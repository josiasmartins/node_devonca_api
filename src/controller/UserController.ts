import { UserResponseDTO } from "../domain/DTO/UserResponse";
import User from "../domain/entity/User";
import { BadRequestError } from "../error_handler/BadRequestHandler";
import { CryptoAES } from "../services/CryptoAES";

const complexObject = {
    user: {
        id: 12345,
        name: "John Doe",
        email: "johndoe@example.com",
        isActive: true,
        preferences: {
            theme: "dark",
            notifications: {
                email: true,
                sms: false,
            },
            languages: ["en", "fr", "es"],
        },
    },
    posts: [
        {
            id: 1,
            title: "First Post",
            content: "This is the content of the first post.",
            tags: ["introduction", "welcome"],
            comments: [
                {
                    id: 1,
                    user: "Jane Doe",
                    message: "Great post!",
                    timestamp: "2024-10-05T12:00:00Z",
                },
                {
                    id: 2,
                    user: "Alice Smith",
                    message: "Thanks for sharing!",
                    timestamp: "2024-10-06T12:00:00Z",
                },
            ],
        },
        {
            id: 2,
            title: "Second Post",
            content: "Content for the second post.",
            tags: ["update", "news"],
            comments: [],
        },
    ],
    metadata: {
        createdAt: "2024-10-01T12:00:00Z",
        updatedAt: "2024-10-05T12:00:00Z",
        version: 1.0,
    },
    isVerified: false,
    followers: [
        { id: 1, name: "Follower One", active: true },
        { id: 2, name: "Follower Two", active: false },
        { id: 3, name: "Follower Three", active: true },
    ],
    settings: {
        privacy: {
            profileVisibility: "friends",
            searchEngineIndexing: false,
        },
        accountType: "premium",
        loginHistory: [
            { date: "2024-10-01", ip: "192.168.1.1" },
            { date: "2024-10-05", ip: "192.168.1.2" },
        ],
    },
};

export class UserController {

    async createUser(req, res, next) {

        const _user = await User.findOne({ 'documentNumber': req.body.documentNumber});

        console.log(_user, " ibag _user");

        if (_user) {
            next(new BadRequestError("documentNumber já salvo"));
        }

        try {

            const user = new User({
                name: req.body.name,
                password: req.body.password,
                documentNumber: req.body.documentNumber,
                image_profile: req.body.image_profile,
                birthday: req.body.birthday
            });

            const data = new CryptoAES().cryptoData(complexObject);

            console.log(JSON.stringify(data, null, 2))
    
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