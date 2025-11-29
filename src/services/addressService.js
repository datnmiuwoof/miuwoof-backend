const address = require("../models/addressModel");

class AddressService {
    async checkoutAddress(user_id) {
        try {
            console.log("User ID in service:", user_id);
            const checkoutAddress = await address.findAll({
                where: { user_id: user_id }
            });

            if (checkoutAddress.length === 0) {
                return false;
            } else {
                const addressData = checkoutAddress.map(addr => ({
                    id: addr.id,
                    user_id: addr.user_id,
                    phone: addr.phone,
                    district: addr.district,
                    ward: addr.ward,
                    city: addr.city,
                    is_default: addr.is_default,
                    address_line: addr.address_line
                }))

                return addressData;
            }
        } catch (error) {
            throw new Error("Không thể tạo sản phẩm, vui lòng thử lại sau.");
        }
    }
}

module.exports = new AddressService();