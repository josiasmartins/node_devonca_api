const User = require("../domain/entity/User")

class UserController {

    async createUser(req, res) {
        const user = new User({
            name: req.body.name,
            password: req.body.password,
            documentNumber: req.body.documentNumber,
            image_profile: req.body.image_profile
        });

        await user.save();
        res.send(user);
    }

    async getAll(req, res) {
        const users = await User.find();
        return res.send(users);
    }

    async deleteUser(req, res) {
        const user = await User.findByIdAndDelete(req.params.id);
        res.send(user);
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
            
        return res.send(user);
    } 

}

module.exports = UserController;