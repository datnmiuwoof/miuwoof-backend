
const { sequelize, user, address } = require("../models")

class profileService {

    async getService(userId) {
        try {
            const result = await user.findOne({
                where: { id: userId },
                attributes: ["name", "email"],
                include: [
                    {
                        model: address,
                        attributes: ["id", "city", "district", "ward", "phone"]
                    }
                ]
            });

            return result;
        } catch (error) {
            return null;
        }
    }

    async addAddress(userId, body) {
        const t = await sequelize.transaction();
        try {
            if (body.is_default) {
                await address.update(
                    { is_default: false },
                    { where: { user_id: userId }, transaction: t }
                );
            }

            const data = await address.create(
                {
                    user_id: userId,
                    phone: body.phone,
                    address_line: body.address_line,
                    city: body.city,
                    district: body.district,
                    ward: body.ward,
                    is_default: body.is_default ?? false,
                },
                { transaction: t }
            );

            await t.commit();
            return data;
        } catch (err) {
            await t.rollback();
            throw err;
        }
    }

    async updateProfile(userId, body) {
        try {
            const { fullName } = body;

            if (!fullName) {
                throw new Error('Name là bắt buộc');
            }

            // Cập nhật name của user theo userId
            const [updatedRows] = await user.update(
                { name: fullName },
                { where: { id: userId } }
            );

            if (updatedRows === 0) {
                throw new Error('User không tồn tại hoặc không thể cập nhật');
            }

            // Lấy lại user vừa cập nhật
            const updatedUser = await user.findByPk(userId);
            return updatedUser;

        } catch (error) {
            throw error;
        }
    }

}

module.exports = new profileService();
