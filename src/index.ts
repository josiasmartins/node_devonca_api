import "dotenv/config";
import cors from "cors";
import express from "express";

import DatabaseInit from "./config/Database";
import routes from "./routes";
import { errorHandler } from "./middlewares/ErrorHandler";
import { CryptoRSA } from "./services/CryptoRSA";
import { CryptoAES } from "./services/CryptoAES";

const cryptoAES = new CryptoAES();
console.log(cryptoAES.decrypt(cryptoAES.encrypt("i love jessica")));

// const cryptoRSA = new CryptoRSA();
// cryptoRSA.decrypt(cryptoRSA.encrypt("Devonca schools"));

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
