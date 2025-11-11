const userService = require("../../services/userService");
const Joi = require("joi");

class userController {
    //xem all dữ iệu user
    async getAllUser(req, res) {
        try {
            const allUser = await userService.getAlluser();
            res.status(200).json({ message: "danh sach user", data: allUser })
        } catch (error) {
            res.status(500).json({ message: "loi roi ba" })
        }
    }

}

module.exports = new userController();