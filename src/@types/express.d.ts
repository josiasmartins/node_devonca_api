// src/@types/express.d.ts

import { File } from 'multer';

declare global {
    namespace Express {
        interface Request {
            file?: File & { originalname: string; path: string; }; // Adicione outras propriedades se necessário
        }
    }
}