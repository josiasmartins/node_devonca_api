import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import fs from 'fs';
import { NextFunction, Request, Response } from 'express';
import CourseVideo from '../domain/entity/CourseVideo';
import { BadRequestError } from '../error_handler/BadRequestHandler';
import mongoose from 'mongoose';
import path from "path";
import { NotFoundError } from '../error_handler/NotFoundError';

// Configura o caminho do FFmpeg
ffmpeg.setFfmpegPath(ffmpegPath);

export class CourseVideoController {
    
    async uploadCourse(req, res: Response, next: NextFunction): Promise<void> {
        try {

            if (!req.file) {
                throw new BadRequestError("No file uploaded");
            }
    
            const { originalname } = req.file;
            const customFileName = req.query.name_file || originalname; // Use o nome da query ou o original
    
            const { buffer: videoBuffer } = req.file;
    
            if (!videoBuffer) {
                throw new BadRequestError("File buffer is undefined");
            }
    
            const MAX_SIZE = 16 * 1024 * 1024; // 16 MB
            const CHUNK_SIZE = 12 * 1024 * 1024; // 12 MB
    
            let compressedBuffer = videoBuffer;
    
            // Compressão se o vídeo exceder o tamanho máximo
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
                        .outputOptions('-preset veryfast') // Preset ajustado para velocidade
                        .outputOptions('-crf 23') // Melhor qualidade (pode ser ajustado)
                        .on('end', () => resolve())
                        .on('error', (error) => {
                            console.error(error);
                            reject(new BadRequestError("Error processing video compression"));
                        })
                        .run();
                });
    
                compressedBuffer = fs.readFileSync(tempOutputPath);
    
                // Remove arquivos temporários
                fs.unlinkSync(tempInputPath);
                fs.unlinkSync(tempOutputPath);
            }
    
            // Calcular quantos pedaços criar com base no buffer (comprimido ou original)
            const numberOfChunks = Math.ceil(compressedBuffer.length / CHUNK_SIZE);
    
            // Salvar o vídeo em pedaços
            for (let i = 0; i < numberOfChunks; i++) {
                const chunk = compressedBuffer.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
                const courseVideo = new CourseVideo({
                    filename: `${customFileName}.part${i + 1}`, // Usar o nome personalizado
                    data: chunk,
                    size: chunk.length,
                });
    
                await courseVideo.save();
            }
    
            res.status(200).json({
                message: "Video uploaded and split into chunks successfully",
                totalChunks: numberOfChunks,
            });
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
        try {
            const videoId = req.params.id_video;
            console.log(videoId, " ibag id_video");
    
            // Verifica se o ID é um ObjectId válido
            if (!mongoose.isValidObjectId(videoId)) {
                throw new BadRequestError("Invalid Video ID format");
            }
    
            const courseVideo = await CourseVideo.findById(videoId);
    
            if (!courseVideo) {
                throw new BadRequestError("Video ID does not exist in database");
            }
    
            console.log(courseVideo, " ibag courseVideo");
    
            // Define o cabeçalho Content-Type
            res.set('Content-Type', 'video/mp4');
    
            // Se courseVideo.data for um buffer, você pode enviar diretamente
            if (Buffer.isBuffer(courseVideo.data)) {
                // Define o comprimento do conteúdo
                res.set('Content-Length', courseVideo.data.length.toString());
                res.status(200).send(courseVideo.data);
            } else {
                throw new BadRequestError("Video data is not in the correct format");
            }
        } catch (error) {
            console.error(error);
            next(error);
        }
    }
    
    
    async getConcatAll(req, res, next) {
        const { name_file } = req.query;

        if (!name_file) {
            throw new BadRequestError("O parameter 'name_file' is required");
        }

        try {
            // Cria uma expressão regular para encontrar os arquivos
            const regex = new RegExp(`^${name_file}\\.part\\d+$`);
            const arquivos = await CourseVideo.find({ filename: regex });

            if (arquivos.length === 0) {
                throw new NotFoundError("File is not found");
            }

            // Concatena os dados dos arquivos
            const concatenatedData = Buffer.concat(arquivos.map(arquivo => arquivo.data));

            // Define o cabeçalho para streaming de vídeo
            res.set({
                'Content-Type': 'video/mp4',
                'Content-Length': concatenatedData.length,
            });

            // Envia os dados concatenados como resposta
            res.status(200).send(concatenatedData);

            // Após enviar, deleta os arquivos do sistema de arquivos
            for (const arquivo of arquivos) {
                const filePath = path.join(__dirname, 'uploads', arquivo.filename); // Altere o caminho conforme necessário
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error(`Erro ao deletar o arquivo ${arquivo.filename}:`, err);
                    }
                });
            }

        } catch (err) {
            console.error('Erro ao buscar ou concatenar arquivos:', err);
            next(err);
        }
    }

      
    
}
