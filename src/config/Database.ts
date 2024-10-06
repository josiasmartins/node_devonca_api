
import mongoose from "mongoose";
import "dotenv/config"

const URI_DATABASE = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER_NAME.toLowerCase()}.mmbfq.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.DB_CLUSTER_NAME}`

console.error(URI_DATABASE, " ibag uri")

const DatabaseInit = () => mongoose.connect(URI_DATABASE || "").catch(err => {
    console.error("Erro database ", err);
});

export default DatabaseInit;