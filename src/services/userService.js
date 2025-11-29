const { sequelize } = require("../models");
const user = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const gerenataOTP = require('../utils/generateOTP');
const emailService = require('../services/emailService');
const { saveOTP, verifyOTP } = require('../services/otpService');


class userService {

    //lấy danh sách user
    async getAlluser() {
        const getalluser = await user.findAll();
        return getalluser;
    }

    async getOneEmail(email) {
        const emailId = await user.findOne({
            where: { email: email }
        });
        return emailId
    }

    async addUser({ name, email, password }) {
        try {


            // Tạo user mới
            const newUser = await user.create({
                name,
                email,
                password,
                is_locked: 0,
                role: "user",
            });

            return newUser;
        } catch (error) {
            console.log("Lỗi tạo user:", error);
            throw error;
        }
    }


    async registerUser(addUser) {
        try {
            const checkUser = await user.findOne({ where: { email: addUser.email } });
            if (checkUser) {
                throw new Error("Email đã tồn tại");
            }

            const otp = gerenataOTP();
            saveOTP(addUser.email, otp, addUser.name, addUser.password);
            await emailService.sendRegisterOtp(addUser.email, otp);
            return { message: "đã gửi mã otp thành công" };
        } catch (error) {
            return { message: error };
        }
    }

    async verifyandCreate(email, otpInput) {
        try {
            const checkOTP = verifyOTP(email, otpInput);

            if (!checkOTP.ok) throw new Error("sai otp hoặc đã hết hạn otp");

            const { name, password } = checkOTP.data;

            const hashedPassword = await bcrypt.hash(password, 10);

            await user.create({
                name: name,
                email: email,
                password: hashedPassword,
                is_locked: 0,
                role: 'user',
            })
            return { message: "Đăng ký thành công", user: { ...newUser.get(), password: undefined } };
        } catch (error) {
            return { message: error };
        }
    }

    //đăng ký user
    // async addUser(adduser) {
    //     const t = await sequelize.transaction();

    //     try {
    //         const checkUser = await user.findOne({ where: { email: adduser.email } });

    //         if (checkUser) {
    //             throw new Error("Email đã tồn tại");
    //         }

    //         const otp = gerenataOTP();
    //         saveOTP(email, otp)
    //         await emailService.sendRegisterOtp(email, otp);

    //         const result = verifyOTP(email, otp);
    //         if (!result) {
    //             return "không đúng otp"
    //         }

    //         const hashedPassword = await bcrypt.hash(adduser.password, 10);

    //         const newUser = await user.create({
    //             name: adduser.name,
    //             email: adduser.email,
    //             password: hashedPassword,
    //             is_locked: 0,
    //             role: 'user',
    //         }, { transaction: t });

    //         await t.commit();
    //         return newUser;
    //     } catch (error) {
    //         await t.rollback();
    //         console.log('lỗi rồi: ', error);
    //         throw new Error("tạo dữ liệu bị lỗi")
    //     }

    // }

    //đăng nhập user
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

            const token = jwt.sign(
                { id: checkUser.id, name: checkUser.name, email: checkUser.email, role: checkUser.role, },
                process.env.JWT_SECRET || "secret_key",
                { expiresIn: "1d" },
            );

            const safer = {
                name: checkUser.name,
                email: checkUser.email,
                role: checkUser.role,
                token,
            }
            return safer;

        } catch (error) {
            console.log("lỗi rồi: ", error);
            throw error;
        }
    }
}

module.exports = new userService();