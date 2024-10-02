
import mongoose from "mongoose";
import "dotenv/config"

const DatabaseInit = () => mongoose.connect(process.env.MONGO_URI || "").catch(err => {
    console.error("Erro database ", err);
});

export default DatabaseInit;