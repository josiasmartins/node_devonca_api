import User from "../domain/entity/User";
import { BadRequestError } from "../error_handler/BadRequestHandler";

export class UserController {

    async createUser(req, res, next) {

        try {

            const user = new User({
                name: req.body.name,
                password: req.body.password,
                documentNumber: req.body.documentNumber,
                image_profile: req.body.image_profile
            });
    
            await user.save();
            res.status(201).send(user);

        } catch (error) {
            // throw new BadRequestError("Campo invalido");
            next(error)
        }

    }

    async getAll(req, res) {
        const users = await User.find();
        return res.status(200).send(users);
    }

    async deleteUser(req, res) {
        const user = await User.findByIdAndDelete(req.params.id);
        res.status(201).send(user);
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
            
        return res.status(201).send(user);
    } 

}