import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import fs from 'fs';
import { NextFunction, Request, Response } from 'express';
import CourseVideo from '../domain/entity/CourseVideo';
import { BadRequestError } from '../error_handler/BadRequestHandler';

// Configura o caminho do FFmpeg
ffmpeg.setFfmpegPath(ffmpegPath);

export class CourseVideoController {

    async uploadCourse(req: Request, res: Response, next: NextFunction) {
        if (!req.file) {
            throw new BadRequestError("No file uploaded");
        }

        if (!req.query.name_file) {
            throw new BadRequestError("name_file is required");
        }
    
        const { path: tempPath, originalname } = req.file;
        const outputPath = `uploads/compressed_${req.query.name_file}.mp4`;
    
        ffmpeg(tempPath)
            .output(outputPath)
            .videoCodec('libx264')
            .audioCodec('aac')
            .outputOptions('-preset ultrafast') // Usando a opção de preset diretamente
            .outputOptions('-threads 8') // Ajustando o número de threads
            .outputOptions('-crf 20') // Ajustando a qualidade
            .on('end', async () => {
                const stats = fs.statSync(outputPath);
                const courseVideo = new CourseVideo({
                    filename: originalname,
                    path: outputPath,
                    size: stats.size,
                });
    
                await courseVideo.save();
                fs.unlinkSync(tempPath); // Remove o arquivo temporário
                res.status(200).json({
                    message: "Video uploaded successfully",
                    video: courseVideo,
                });
            })
            .on('error', (error) => {
                console.error(error);
                res.status(500).json({ message: 'Error processing video', error });
            })
            .run();
    }

    async listAllVideos(req: Request, res: Response, next: NextFunction) {
        
        const courseVideos = await CourseVideo.find();

        res.status(200).send(courseVideos);

    }
    
    
}
