const { sequelize } = require("../models");
const user = require("../models/userModel");
const bcrypt = require("bcrypt");


class userService {
    async getAlluser() {
        const getalluser = await user.findAll();
        return getalluser;
    }

    async addUser(adduser) {
        const t = await sequelize.transaction();

        try {
            const checkUser = await user.findOne({ where: { email: adduser.email } });

            if (checkUser) {
                throw new Error("Email đã tồn tại");
            }

            const hashedPassword = await bcrypt.hash(adduser.password, 10);

            const newUser = await user.create({
                name: adduser.name,
                email: adduser.email,
                password: hashedPassword,
                is_locked: 0,
                role: 'user',
            }, { transaction: t });

            await t.commit();
            return newUser;
        } catch (error) {
            await t.rollback();
            console.log('lỗi rồi: ', error);
            throw new Error("tạo dữ liệu bị lỗi")
        }

    }

    async loginUser(loginUser) {
        try {
            const checkUser = await user.findOne({ where: { email: loginUser.email } });

            if (!checkUser) {
                throw new Error("không có người dùng như đã nhập");
            }

            const isMatch = await bcrypt.compare(loginUser.password, checkUser.password);
            if (!isMatch) {
                throw new Error("mật khẩu không khớp");
            }

            const safeUser = { ...checkUser.get(), password: undefined }
            return safeUser;

        } catch (error) {
            console.log("lỗi rồi: ", error);
            throw error;
        }
    }
}

module.exports = new userService();