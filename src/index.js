const express = require("express");
const routes = require("./routes");
const DatabaseInit = require("./config/Database");
require("dotenv").config();

const port = process.env.PORT | 3000;
const app = express();
app.use(express.json());

app.use(routes);

app.listen(port, () => {
    DatabaseInit();
    console.log(`Example app listener on port ${port}`)
})