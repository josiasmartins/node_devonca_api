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
        // new CryptoAES().cryptoData({                name: req.body.name,
        //     password: req.body.password,
        //     documentNumber: req.body.documentNumber,
        //     image_profile: req.body.image_profile,
        //     birthday: req.body.birthday}, CryptoEnum.DECRYPT);
        try {

            // const _user = await User.findOne({ 'documentNumber': this.cryptoAES.decrypt(req.body.documentNumber)});
            const _user = await User.findOne({ 'documentNumber': req.body.documentNumber});

            console.log(_user, " ibag _user");
    
            if (_user) {
                new BadRequestError("documentNumber já salvo");
            }

            const encrypted = this.cryptoAES.cryptoData({ data: "test", nome: "jogos", objeto: { nome: "test" } }, CryptoEnum.ENCRYPT, ["nome"]);
            console.log(encrypted, " IBAG ENCRYPTED")
    
            const user = new User({
                name: req.body.name,
                password: this.cryptoAES.encrypt(req.body.password),
                documentNumber: this.cryptoAES.encrypt(req.body.documentNumber),
                image_profile: req.body.image_profile,
                birthday: req.body.birthday
            });

            // user.validate({ documentNumber: {} });
    
            await user.save();

            res.status(201).send(new UserResponseDTO(user));

        } catch (error) {
            // throw new BadRequestError("Campo invalido");
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