import { NextFunction, Request, Response } from "express";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import CourseVideo from "../domain/entity/CourseVideo";
import { BadRequestError } from "../error_handler/BadRequestHandler";

export class CourseVideoController {

    async uploadCourse(req, res: Response, next: NextFunction) {

        if (!req.file) {
            throw new BadRequestError("No file Upload");
        }

        
        const { path: tempPath, originalname } = req.file;
        const outputPath = `uploads/compressed-${originalname}`;

        console.log(tempPath, originalname);

        ffmpeg(tempPath)
            .output(outputPath)
            .videoCodec("libx264")
            .audioCodec('aac')
            .size("1920x1080") // Define a resolução para 1080p
            .on('end', async () => {
                const stats = fs.statSync(outputPath);
                const courseVideo = new CourseVideo({
                    filename: originalname,
                    path: outputPath,
                    size: stats.size
                });

                await courseVideo.save();
                fs.unlinkSync(tempPath); // Remove o arquivo temporário
                res.status(200).json({ 
                    message: "Video uploaded successfully",
                    video: CourseVideo
                });

            })
            .on('error', (error) => {
                console.error(error);
                res.status(500).json({ message: 'Error processing video', error });
            })
            .run();
    }

}