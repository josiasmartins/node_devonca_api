import express from "express";
import routes from "./routes";
import "dotenv/config"
import DatabaseInit from "./config/Database";

const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());

app.use(routes);

app.listen(port, () => {
    DatabaseInit();
    console.log(`Example app listener on port ${port}`)
})