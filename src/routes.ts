import { Router } from "express";
import { UserController } from "./controller/UserController";
import { CourseVideoController } from "./controller/CourseVideoController";
import multer from "multer";
// import { badRequestHandler } from "./error_handler/BadRequestHandler";

// // Configuração do multer para gerenciar uploads de arquivos
// const upload = multer({
//     dest: 'uploads/', // Diretório de destino para uploads
//     limits: {
//         fileSize: 100 * 1024 * 1024, // Limite de tamanho do arquivo (100 MB)
//     },
//     fileFilter: (req, file, cb) => {
//         // Filtra os tipos de arquivo (opcional)
//         const fileTypes = /mp4|mov|avi|mkv/; // Tipos de vídeo permitidos
//         const extname = fileTypes.test(file.mimetype);
//         if (extname) {
//             return cb(null, true);
//         }
//         cb(new Error("Invalid file type. Only videos are allowed."));
//     }
// });

// Configura o armazenamento
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

/** COURSE_VIDEO  */
routes.post("/course_video/upload", upload.single('file'), new CourseVideoController().uploadCourse);

export default routes;