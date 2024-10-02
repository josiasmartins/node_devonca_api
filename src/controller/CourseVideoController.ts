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

        const { path: tempPath, originalname } = req.file;
        const outputPath = `uploads/compressed-${originalname}`;

        console.log(tempPath, originalname, outputPath, " ibag test")

        ffmpeg(tempPath)
            .output(outputPath)
            .videoCodec('libx264')
            .audioCodec('aac')
            .size('1920x1080')
            .on('end', async () => {
                const stats = fs.statSync(outputPath);
                const courseVideo = new CourseVideo({
                    filename: originalname,
                    path: outputPath,
                    size: stats.size,
                });

                console.log(courseVideo, " ibag course")

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
}
