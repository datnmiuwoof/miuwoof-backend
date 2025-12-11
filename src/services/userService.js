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

            if (status && status !== "all") {
                where.role = status;
            }
            const getalluser = await user.findAndCountAll({
                where,
                limit,
                offset,
                attributes: ["id", "name", "role", "email", "created_at", "phone_number", "is_locked", "locked_until", "login_fail_count"],
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
    
    async loginUser(loginData) {
        try {
            const checkUser = await user.findOne({ where: { email: loginData.email } });

            if (!checkUser) {
                throw new Error("Email không tồn tại trong hệ thống");
            }


            if (checkUser.is_locked) {
                if (!checkUser.locked_until || new Date() < new Date(checkUser.locked_until)) {
                    const unlockDate = checkUser.locked_until 
                        ? new Date(checkUser.locked_until).toLocaleString('vi-VN') 
                        : "Vô thời hạn (Vui lòng liên hệ Admin)";
                    throw new Error(`Tài khoản đang bị khóa. Mở lại vào: ${unlockDate}`);
                } 
                
                // Nếu đã hết hạn khóa -> Tự động mở
                checkUser.is_locked = false;
                checkUser.login_fail_count = 0;
                checkUser.locked_until = null;
                await checkUser.save();
            }

            const isMatch = await bcrypt.compare(loginData.password, checkUser.password);

            if (!isMatch) {
                // Tăng số lần sai
                checkUser.login_fail_count = (checkUser.login_fail_count || 0) + 1;
                
                // Nếu sai quá 5 lần -> Khóa 7 ngày
                if (checkUser.login_fail_count >= 5) {
                    checkUser.is_locked = true;
                    checkUser.locked_until = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                    await checkUser.save();
                    throw new Error("Bạn nhập sai quá 5 lần. Tài khoản bị khóa 7 ngày.");
                }

                await checkUser.save();
                const remaining = 5 - checkUser.login_fail_count;
                throw new Error(`Mật khẩu không đúng. Bạn còn ${remaining} lần thử trước khi bị khóa.`);
            }

             //Đăng nhập thành công -> Reset bộ đếm
            if (checkUser.login_fail_count > 0 || checkUser.is_locked) {
                checkUser.login_fail_count = 0;
                checkUser.is_locked = false;
                checkUser.locked_until = null;
                await checkUser.save();
            }

            const token = jwt.sign(
                { id: checkUser.id, name: checkUser.name, email: checkUser.email, role: checkUser.role },
                process.env.JWT_SECRET || "secret_key",
                { expiresIn: "1d" },
            );

            return {
                id: checkUser.id,
                name: checkUser.name,
                email: checkUser.email,
                role: checkUser.role,
                token,
            };

        } catch (error) {
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

    async toggleUserLock(userId) {
        try {
            const userFound = await user.findByPk(userId);
            if (!userFound) throw new Error("User not found");

            // Đảo ngược trạng thái khóa
            const newStatus = !userFound.is_locked;
            
            userFound.is_locked = newStatus;
            
            // Nếu mở khóa -> reset hết
            if (!newStatus) {
                userFound.login_fail_count = 0;
                userFound.locked_until = null;
            } else {
                // Nếu Admin khóa tay -> Khóa vĩnh viễn (locked_until = null)
                userFound.locked_until = null; 
            }

            await userFound.save();
            return userFound;
        } catch (error) {
            throw error;
        }
    }

    async changeUserRole(userId, newRole) {
        try {
            // Chỉ cho phép role là 'user' hoặc 'admin'
            if (!['user', 'admin'].includes(newRole)) {
                throw new Error("Role không hợp lệ (chỉ chấp nhận 'user' hoặc 'admin')");
            }

            const userFound = await user.findByPk(userId);
            if (!userFound) throw new Error("User not found");

            userFound.role = newRole;
            await userFound.save();
            
            return userFound;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new userService();