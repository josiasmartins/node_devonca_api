import express from "express";
import routes from "./routes";
import "dotenv/config"
import DatabaseInit from "./config/Database";
import { errorHandler } from "./middlewares/ErrorHandler";
import multer from "multer";

const port = process.env.PORT || 3000;
const app = express();

// Middleware para o upload de arquivos
const upload = multer({ dest: 'uploads/' }); // Defina o diretório para uploads
app.use(upload.single('file')); // Usar multer para upload de arquivos

app.use(express.json());

app.use(routes);

app.use(errorHandler);

app.listen(port, () => {
    DatabaseInit();
    console.log(`Example app listener on port ${port}`)
})