import "dotenv/config";
import cors from "cors";
import express from "express";

import DatabaseInit from "./config/Database";
import routes from "./routes";
import { errorHandler } from "./middlewares/ErrorHandler";
import { CryptoRSA } from "./services/CryptoRsa";

const cryptoRSA = new CryptoRSA();
cryptoRSA.decrypt(cryptoRSA.encrypt(null));

const port = process.env.PORT || 3000;
const app = express();

app.use(cors())

app.use(express.json());

app.use(routes);

app.use(errorHandler);

app.listen(port, () => {
    DatabaseInit();
    console.log(`Example app listening on port ${port}`);
});
