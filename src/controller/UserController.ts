import { UserResponseDTO } from "../domain/DTO/UserResponse";
import User from "../domain/entity/User";
import { BadRequestError } from "../error_handler/BadRequestHandler";
import { CryptoAES } from "../services/CryptoAES";
import { CryptoEnum } from "../services/CryptoEnum";

export class UserController {

    private cryptoAES: CryptoAES;

    constructor() {
        this.cryptoAES = new CryptoAES();
    }

    async createUser(req, res, next) {

        try {

            const _user = await User.findOne({ 'documentNumber': req.body.documentNumber});
            console.log(_user, " ibag _user");
            if (_user) {
                new BadRequestError("documentNumber já salvo");
            }
    
            const user = new User({
                name: req.body.name,
                password: req.body.password,
                documentNumber: req.body.documentNumber,
                image_profile: req.body.image_profile,
                birthday: req.body.birthday
            });
    
            await user.save();

            const cryptedData = this.cryptoAES.cryptoData(user.toObject(), CryptoEnum.ENCRYPT, ["_id", "_iv"]);
            console.log(cryptedData, " ibag cryptedData");

            res.status(201).send(new UserResponseDTO(cryptedData));

        } catch (error) {
            next(error)
        }

    }

    async getAll(req, res) {
        const users = await User.find();

        const usersConvertedToDto = users.map(user => new UserResponseDTO(user))

        return res.status(200).json(usersConvertedToDto);
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