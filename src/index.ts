import express from "express";
import routes from "./routes";
import "dotenv/config";
import DatabaseInit from "./config/Database";
import { errorHandler } from "./middlewares/ErrorHandler";
import { CryptoRSA } from "./services/CryptoRsa";
import cors from "cors";

import { decrypt, encrypt } from "./services/test";

// console.log(decrypt(encrypt('jessica valeska')));



// import "./services/test"
const cryptoRSA = new CryptoRSA();
// const encryptedValue = cryptoRSA.encrypt("hello word");
cryptoRSA.decrypt(cryptoRSA.encrypt("jessica valeska"));

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
