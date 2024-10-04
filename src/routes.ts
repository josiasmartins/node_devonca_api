import { Router } from "express";
import { UserController } from "./controller/UserController";
import { CourseVideoController } from "./controller/CourseVideoController";

import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() }); // Armazenar na memória


const routes = Router();

routes.get("/user/", new UserController().getAll);
routes.post("/user/", new UserController().createUser);
routes.put("/user/:id", new UserController().updateUser);
routes.delete("/user/:id", new UserController().deleteUser);

/** COURSE_VIDEO */
routes.post("/course_video/upload", upload.single('file'), new CourseVideoController().uploadCourse);
routes.get("/course_video/", new CourseVideoController().listAllVideos);
routes.get("/course_video/with_buffer", new CourseVideoController().listAllVideosWithBuffer)
routes.get("/course_video/id/:id_video", new CourseVideoController().getCourseById);
routes.get("/course_video/concat", new CourseVideoController().getConcatAll);

export default routes;
