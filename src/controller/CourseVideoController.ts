import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import fs from 'fs';
import { NextFunction, Request, Response } from 'express';
import CourseVideo from '../domain/entity/CourseVideo';
import { BadRequestError } from '../error_handler/BadRequestHandler';

// Configura o caminho do FFmpeg
ffmpeg.setFfmpegPath(ffmpegPath);

export class CourseVideoController {
    
    async uploadCourse(req, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.file) {
                throw new BadRequestError("No file uploaded");
            }

            if (!req.query.name_file) {
                throw new BadRequestError("name_file is required");
            }

            const { buffer: videoBuffer, originalname } = req.file;

            if (!videoBuffer) {
                throw new BadRequestError("File buffer is undefined");
            }

            const MAX_SIZE = 16 * 1024 * 1024; // 16 MB
            const CHUNK_SIZE = 12 * 1024 * 1024; // 12 MB

            // Comprimir se o vídeo exceder o tamanho máximo
            if (videoBuffer.length > MAX_SIZE) {
                const tempInputPath = `uploads/temp_${originalname}`;
                const tempOutputPath = `uploads/compressed_${originalname}`;

                fs.writeFileSync(tempInputPath, videoBuffer);

                // Compressão do vídeo
                await new Promise<void>((resolve, reject) => {
                    ffmpeg(tempInputPath)
                        .output(tempOutputPath)
                        .videoCodec('libx264')
                        .audioCodec('aac')
                        .outputOptions('-preset ultrafast') // Configuração para compressão rápida
                        .outputOptions('-crf 28') // Ajuste do CRF para qualidade
                        .on('end', () => resolve())
                        .on('error', (error) => {
                            console.error(error);
                            reject(new BadRequestError("Error processing video compression"));
                        })
                        .run();
                });

                const compressedBuffer = fs.readFileSync(tempOutputPath);
                
                // Calcular quantos pedaços criar com base no tamanho comprimido
                const numberOfChunks = Math.ceil(compressedBuffer.length / CHUNK_SIZE);

                // Salvar o vídeo em pedaços
                for (let i = 0; i < numberOfChunks; i++) {
                    const chunk = compressedBuffer.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
                    const courseVideo = new CourseVideo({
                        filename: `${originalname}.part${i + 1}`,
                        data: chunk,
                        size: chunk.length,
                    });

                    console.error(courseVideo, chunk, " ibag test");

                    await courseVideo.save();
                }

                // Remove arquivos temporários
                fs.unlinkSync(tempInputPath);
                fs.unlinkSync(tempOutputPath);
                res.status(200).json({
                    message: "Video uploaded and split into chunks successfully",
                    totalChunks: numberOfChunks,
                });
            } else {
                // Se o vídeo já estiver dentro do limite
                const numberOfChunks = Math.ceil(videoBuffer.length / CHUNK_SIZE);

                for (let i = 0; i < numberOfChunks; i++) {
                    const chunk = videoBuffer.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
                    const courseVideo = new CourseVideo({
                        filename: `${originalname}.part${i + 1}`,
                        data: chunk,
                        size: chunk.length,
                    });

                    console.error(courseVideo, chunk, " ibag test");

                    await courseVideo.save();
                }

                res.status(200).json({
                    message: "Video uploaded successfully",
                    totalChunks: numberOfChunks,
                });
            }
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    async listAllVideos(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Buscando todos os vídeos, mas excluindo o campo 'data'
            const courseVideos = await CourseVideo.find().select('-data');
            res.status(200).json(courseVideos);
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    async listAllVideosWithBuffer(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const courseVideos = await CourseVideo.find();
            res.status(200).json(courseVideos);
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    async getCourseById(req: Request, res: Response, next: NextFunction): Promise<void> {

        console.log(req.params.id_video, " ibag id_video");

        const courseVideo = await CourseVideo.findById(req.params.id_video);
        console.log(courseVideo, " ibag courseVideo");

        res.status(200).json(courseVideo);

    }
    
}
