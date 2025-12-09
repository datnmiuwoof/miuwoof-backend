const { sequelize, address, order, order_detail } = require("../models");
const user = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const gerenataOTP = require('../utils/generateOTP');
const emailService = require('../services/emailService');
const { saveOTP, verifyOTP } = require('../services/otpService');
const { Op, where } = require("sequelize");


class userService {

    //lấy danh sách user
    async getAlluser(page, status, limit) {
        try {
            const offset = (page - 1) * limit;

            let where = {
                is_locked: false
            };

            if (status && status !== "all") {
                where.role = status;
            }
            const getalluser = await user.findAndCountAll({
                where,
                limit,
                offset,
                attributes: ["id", "name", "role", "email", "created_at", "phone_number"],
                include: [
                    {
                        model: address,
                        attributes: ["id", "phone"],
                    }
                ]
            });
            return getalluser;
        } catch (error) {
            return {
                message: error
            }
        }

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

    async getDetailuser(userId) {
        try {
            const data = await user.findOne({
                where: { id: userId },
                include: [
                    { model: address },
                ]
            });

            const total_order = await order.count({
                where: { user_id: userId }
            })

            const total_amount = await order.sum("total_amount", {
                where: {
                    user_id: userId,
                    order_status: {
                        [Op.notIn]: ["refund", "cancelled"],
                    },
                }
            });

            const average = total_order > 0 ? total_amount / total_order : 0;
            const averageRounded = Number(average.toFixed(2));

            return {
                data,
                total_order,
                total_amount,
                averageRounded,
            };
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async statusUser(tab, userId, page = 1) {
        switch (tab) {
            case "overview":
                const stats = await order.findAll({
                    where: { user_id: userId },
                    order: [['created_at', 'DESC']],
                    limit: 5,
                });
                return stats;

            case "orderHistory":
                const limit = 10;
                const offset = (page - 1) * limit;
                const { rows, count } = await order.findAndCountAll({
                    where: { user_id: userId },
                    include: [
                        {
                            model: order_detail,
                        }
                    ],
                    limit,
                    offset,
                    order: [['created_at', 'DESC']]
                });
                return { orders: rows, total: count, page, totalPages: Math.ceil(count / limit) };

            case "wishlist":
                // trả danh sách yêu thích
                const wishlist = await order.findAll({
                    where: { user_id: userId },
                    limit: 5
                });
                return { wishlist };

            case "addresses":
                const addresses = await address.findAll(
                    {
                        where: { user_id: userId }
                    }
                );
                return { addresses };

            default:
                return {};
        }
    }

    async userBlock(userId) {
        try {
            const [updated] = await user.update(
                { is_locked: true },
                { where: { id: userId } }
            );

            return updated;
        } catch (error) {
            return null;
        }
    }

    // async isLocket(){
    //     try {

    //     } catch (error) {
    //         return null;
    //     }
    // }
}

module.exports = new userService();