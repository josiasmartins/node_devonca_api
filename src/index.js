const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

const port = 3000;

mongoose.connect(`mongodb+srv://db_devonca_user:gnaZPfebbVubrcam@cluster0.78rqzrw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`).catch(err => {
    console.error("Erro database ", err);
})

const User = mongoose.model('User', {
    name: String,
    password: String,
    documentNumber: String,
    image_profile: String,
})

app.get('/', (req, res) => {
    res.send("hello word");
})

app.post("/", async (req, res) => {
    const user = new User({
        name: req.body.name,
        password: req.body.password,
        documentNumber: req.body.documentNumber,
        image_profile: req.body.image_profile
    });

    await user.save();
    res.send(user);
})

app.listen(port, () => {
    console.log(`Example app listener on port ${port}`)
})