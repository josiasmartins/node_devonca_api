import { Router } from "express";
import { UserController } from "./controller/UserController";
import { CourseVideoController } from "./controller/CourseVideoController";
import multer from "multer";

// Configura o armazenamento do multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Mantém o nome original
    },
});

// Inicializa o multer com a configuração de armazenamento
const upload = multer({ storage });

const routes = Router();

routes.get("/user/", new UserController().getAll);
routes.post("/user/", new UserController().createUser);
routes.put("/user/:id", new UserController().updateUser);
routes.delete("/user/:id", new UserController().deleteUser);

/** COURSE_VIDEO */
routes.post("/course_video/upload", upload.single('file'), new CourseVideoController().uploadCourse);

export default routes;
