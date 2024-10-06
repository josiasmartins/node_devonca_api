## Passos runner projeto

 public cryptoData(data: any): any {
        if (typeof data !== 'object' || data === null) {
            // Se não for um objeto ou for nulo, retorna o valor original
            return data;
        }

        if (Array.isArray(data)) {
            // Se for um array, percorre e aplica a criptografia em cada item
            return data.map(item => this.cryptoData(item));
        }

        // Para objetos, percorre cada campo
        const encryptedData: Record<string, any> = {};
        for (let field in data) {
            const fieldValue = data[field];
            // Criptografa o valor se for string, número ou booleano
            if (typeof fieldValue === 'string' || typeof fieldValue === 'number' || typeof fieldValue === 'boolean') {
                encryptedData[field] = this.encrypt(fieldValue.toString());
            } else {
                // Se for um objeto ou array, chama recursivamente
                encryptedData[field] = this.cryptoData(fieldValue);
            }
        }

        return encryptedData;
    }

## Cryptografia

ssl
```bash
openssl genrsa -out keys/private.pem 2048
openssl rsa -in keys/private.pem -outform PEM -pubout -out keys/public.pem
```

Estamos usando node-rsa para cryptografia asimetrica;

## Criacao do projeto
npm init;

npm install --save dotenv express mongoose

npm install --save-dev @types/dotenv @types/express @types/mongoose nodemon ts-node typescript

crie um arquivo tsconfig.json
```json
{
    "compilerOptions": {
        "lib": ["es5"],
        "target": "es5",
        "module": "commonjs",
        "moduleResolution": "node",
        "outDir": "dist",
        "resolveJsonModule": true,
        "emitDecoratorMetadata": true,
        "esModuleInterop": true,
        "experimentalDecorators": true,
        "sourceMap": true
    },
    "include": ["src/**/*.ts"],
    "exclude": ["node_modules", "**/*.spec.ts"]
}
```

file .env (root)
```.env
MONGO_URI="mongodb+srv://db_devonca_user:gnaZPfebbVubrcam@cluster0.78rqzrw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
PORT=3000
````

crie uma pasta src>config
```ts

import mongoose from "mongoose";
import "dotenv/config"

const DatabaseInit = () => mongoose.connect(process.env.MONGO_URI || "").catch(err => {
    console.error("Erro database ", err);
});

export default DatabaseInit;
```

crie uma file index.ts dentro de src
```typescript
import express from "express";
import routes from "./routes";
import "dotenv/config"
import DatabaseInit from "./config/Database";
import { errorHandler } from "./middlewares/ErrorHandler";

const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());

app.use(routes);

app.use(errorHandler);

app.listen(port, () => {
    DatabaseInit();
    console.log(`Example app listener on port ${port}`)
})
```

crie o middlewares de erro
```ts
import { ErrorModel } from "../domain/model/ErrorModel";
import { NextFunction, Response, Request } from "express";
import { ApiError } from "../error_handler/ApiError";

export function errorHandler(
    err: Error & Partial<ApiError>, 
    req: Request, 
    res: Response, 
    next: NextFunction) {

    if (res.headersSent) {
        return next(err);
    }

    const statusCode = err.statusCode ?? 500;
    const message = err.message ?? "Internal Server Error";
    
    
    res.status(statusCode);
    res.json({ name: err.name, message, statusCode });
    
    // if (res.headersSent) {
    //     return next(err);
    // }

    // res.status(500);
    // res.send(new ErrorModel(
    //     err.name,
    //     500,
    //     err.message
    // ));

}
```

crie a entity
```ts
import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    name: { type: String, required: true },
    password: { type: String, required: true, minLength: 4, maxLength: 14 },
    documentNumber: { type: String, required: true, match: /\d+$/ },
    image_profile: { type: String, required: false }
})

const User = mongoose.model('User', UserSchema);

export default User;
```

crie os arquivo de rotas
```ts
import { Router } from "express";
import { UserController } from "./controller/UserController";
// import { badRequestHandler } from "./error_handler/BadRequestHandler";

const routes = Router();

routes.get("/user/", new UserController().getAll);
routes.post("/user/", new UserController().createUser);
routes.put("/user/:id", new UserController().updateUser);
routes.delete("/user/:id", new UserController().deleteUser);

export default routes;
```

crie o controller
```ts
import User from "../domain/entity/User";
import { BadRequestError } from "../error_handler/BadRequestHandler";

export class UserController {

    async createUser(req, res, next) {

        try {

            const user = new User({
                name: req.body.name,
                password: req.body.password,
                documentNumber: req.body.documentNumber,
                image_profile: req.body.image_profile
            });
    
            await user.save();
            res.status(201).send(user);

        } catch (error) {
            // throw new BadRequestError("Campo invalido");
            next(error)
        }

    }

    async getAll(req, res) {
        const users = await User.find();
        return res.status(200).send(users);
    }

    async deleteUser(req, res) {
        const user = await User.findByIdAndDelete(req.params.id);
        res.status(201).send(user);
    }

    async updateUser(req, res) {
        const user = await User.findByIdAndUpdate(req.params.id, {
                    name: req.body.name,
                    password: req.body.password,
                    documentNumber: req.body.documentNumber,
                    image_profile: req.body.image_profile
                }, {
                    new: true // usado para pegar o valor atualizado
                });
            
        return res.status(201).send(user);
    } 

}
```

crie um script no package.json
```json
{
  "name": "node_api_devonca",
  "version": "0.0.1",
  "description": "Api for devonca schools",
  "main": "index.js",
  "scripts": {
    "start": "nodemon --exec ts-node src/index.ts"
  },
  "keywords": [
    "api",
    "devonca"
  ],
  "author": "josiasmartins",
  "license": "ISC",
  "dependencies": {
    "dotenv": "^16.4.5",
    "express": "^4.21.0",
    "mongoose": "^8.7.0"
  },
  "devDependencies": {
    "@types/dotenv": "^8.2.0",
    "@types/express": "^5.0.0",
    "@types/mongoose": "^5.11.97",
    "nodemon": "^3.1.7",
    "ts-node": "^10.9.2",
    "typescript": "^5.6.2"
  }
}

```

