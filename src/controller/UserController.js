const User = require("../domain/entity/User")

class UserController {

    // constructor() {}

    async getAll(req, res) {
        const users = await User.find();
        return res.send(users);
    }

}

module.exports = UserController;