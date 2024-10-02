// // src/@types/express.d.ts

// import * as express from 'express';

// declare global {
//     namespace Express {
//         interface MyFile {
//             originalname: string;
//             path: string;
//             // Adicione outras propriedades se necessário
//         }

//         interface Request {
//             file?: MyFile; // Usa a interface personalizada
//         }
//     }
// }

// // Se você estiver importando express em um arquivo de definição,
// // adicione a linha abaixo para garantir que o arquivo seja tratado como um módulo.
// export {};


// declare global {
//     namespace Express {
//         export  interface Request {
//             file?: Partial<string>
//         }
//     }
// }