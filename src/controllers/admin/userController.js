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

    //register/ tạo tài khoản
    async addUser(req, res) {
        const { name, email, password } = req.body;
        try {
            const schema = Joi.object({
                name: Joi.string().min(3).required(),
                email: Joi.string().email().required(),
                password: Joi.string().min(6).required(),
            })


            const { error } = schema.validate(req.body);

            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const result = await userService.addUser({
                name, email, password,
            })

            const safeUser = { ...result.get(), password: undefined }
            res.status(201).json({
                message: "đăng ký thành công",
                data: safeUser,
            })
        } catch (error) {
            res.status(500).json({
                message: "Lỗi khi thêm dữ liệu",
                error: error.message,
            });
        }
    }

    async login(req, res) {
        const { email, password } = req.body;
        try {

            const schema = Joi.object({
                email: Joi.string().email().required(),
                password: Joi.string().min(6).required()
            })

            const { error } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const checkUser = await userService.loginUser({ email, password });

            res.status(201).json({
                message: "dang nhap thanh cong",
                data: checkUser
            });

        } catch (error) {
            res.status(400).json({
                message: error.message || "Đăng nhập lỗi",
            });
        }
    }
}

module.exports = new userController();