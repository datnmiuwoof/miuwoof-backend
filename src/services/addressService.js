const address = require("../models/addressModel");
const { sequelize } = require("../models")

class AddressService {
    async checkoutAddress(userId) {
        try {
            const addr = await address.findAll({
                where: {
                    user_id: userId,
                }
            });

            if (!addr) return null;

            const result = await addr.map(add => {
                return {
                    id: add.id,
                    user_id: add.user_id,
                    phone: add.phone,
                    city: add.city,
                    district: add.district,
                    ward: add.ward,
                    address_line: add.address_line,
                    is_default: add.is_default
                };
            })
            return result

        } catch (err) {
            console.error("SERVICE ERROR:", err);
            throw err;
        }
    }


    async setDefaultAddress(userId, addressId) {
        try {
            // Bước 1: Kiểm tra địa chỉ có tồn tại và thuộc về user không
            const targetAddress = await address.findOne({
                where: {
                    id: addressId,
                    user_id: userId
                }
            });

            if (!targetAddress) {
                return { success: false, message: "Địa chỉ không tồn tại hoặc không thuộc về bạn" };
            }

            // Bước 2: Dùng transaction để đảm bảo an toàn dữ liệu
            const result = await sequelize.transaction(async (t) => {
                // Bỏ mặc định tất cả địa chỉ của user
                await address.update(
                    { is_default: false },
                    {
                        where: { user_id: userId },
                        transaction: t
                    }
                );

                // Set cái được chọn thành mặc định
                await address.update(
                    { is_default: true },
                    {
                        where: { id: addressId },
                        transaction: t
                    }
                );

                // Lấy lại danh sách mới nhất
                const updatedAddresses = await address.findAll({
                    where: { user_id: userId },
                    order: [['is_default', 'DESC']],
                    transaction: t
                });

                return updatedAddresses;
            });

            // Format lại dữ liệu trả về giống checkoutAddress
            const formatted = result.map(add => ({
                id: add.id,
                user_id: add.user_id,
                phone: add.phone,
                city: add.city,
                district: add.district,
                ward: add.ward,
                address_line: add.address_line,
                is_default: add.is_default
            }));

            return { success: true, addresses: formatted };

        } catch (err) {
            console.error("SERVICE SET DEFAULT ERROR:", err);
            throw err;
        }

    }

}

module.exports = new AddressService();