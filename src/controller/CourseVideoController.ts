import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import fs from 'fs';
import { NextFunction, Request, Response } from 'express';
import CourseVideo from '../domain/entity/CourseVideo';
import { BadRequestError } from '../error_handler/BadRequestHandler';
import mongoose from 'mongoose';
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
    
            // Validação do nome do arquivo
            const isValidFileName = /^[a-zA-Z0-9_]+$/.test(customFileName);
            if (!isValidFileName) {
                throw new BadRequestError("Invalid file name. Only letters, numbers, and underscores (_) are allowed.");
            }
    
            if (customFileName.length > 60) {
                throw new BadRequestError("File name must not exceed 60 characters.");
            }
    
            // Verifica se o nome do arquivo já existe no banco de dados
            const existingFile = await CourseVideo.findOne({ filename: new RegExp(`^${customFileName}\\.part\\d+$`) });
            if (existingFile) {
                throw new BadRequestError("File name must be unique. A file with this name already exists.");
            }
    
            const { buffer: videoBuffer } = req.file;
    
            if (!videoBuffer) {
                throw new BadRequestError("File buffer is undefined");
            }
    
            const MAX_SIZE = 16 * 1024 * 1024; // 16 MB
            const CHUNK_SIZE = 12 * 1024 * 1024; // 12 MB
    
            let compressedBuffer = videoBuffer;
    
            // Compressão se o vídeo exceder o tamanho máximo
            if (videoBuffer.length > MAX_SIZE) {
                fs.mkdirSync('uploads')
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
                fs.rmdir("uploads", () => {});

            }
    
            // Calcular quantos pedaços criar com base no buffer (comprimido ou original)
            const numberOfChunks = Math.ceil(compressedBuffer.length / CHUNK_SIZE);
            const generatedFiles = []; // Array para armazenar os nomes dos arquivos gerados
    
            // Salvar o vídeo em pedaços
            for (let i = 0; i < numberOfChunks; i++) {
                const chunk = compressedBuffer.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
                const filename = `${customFileName}.part${i + 1}`; // Usar o nome personalizado
    
                // Verifica se o nome do arquivo já existe antes de salvar o chunk
                const partFileExists = await CourseVideo.findOne({ filename: filename });
                if (partFileExists) {
                    throw new BadRequestError("File name must be unique. A file with this name already exists.");
                }
    
                const courseVideo = new CourseVideo({
                    filename: filename,
                    data: chunk,
                    size: chunk.length,
                });
    
                await courseVideo.save();
                generatedFiles.push(filename); // Adiciona o nome do arquivo gerado ao array
            }
    
            res.status(200).json({
                message: "Video uploaded and split into chunks successfully",
                totalChunks: numberOfChunks,
                generatedFiles: generatedFiles, // Inclui os nomes dos arquivos gerados na resposta
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

        try {

            if (!name_file) {
                throw new BadRequestError("O parameter 'name_file' is required");
            }

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

            console.log(`VIDEO_CONCATENACAO : result success`)

        } catch (err) {
            console.error('Erro ao buscar ou concatenar arquivos:', err);
            next(err);
        }
    }

      
    
}
