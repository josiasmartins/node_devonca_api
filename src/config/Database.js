const mongoose = require("mongoose");

require("dotenv").config();

const DatabaseInit = () => mongoose.connect(process.env.MONGO_URI).catch(err => {
    console.error("Erro database ", err);
});

module.exports = DatabaseInit;