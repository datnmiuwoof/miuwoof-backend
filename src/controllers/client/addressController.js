const addressService = require("../../services/addressService");


class addressController {
    async checkoutAddress(req, res) {
        try {
            const userId = req.user.id;
            const addresses = await addressService.checkoutAddress(userId);

            if (!addresses) {
                return res.status(404).json({ message: "User chưa có address" });
            }
            return res.json(addresses);
        } catch (error) {
            res.status(500).json({ message: "Address created founld" });
        }
    }

    async setDefaultAddress(req, res) {
        try {
            const userId = req.user.id;
            const addressId = parseInt(req.params.id);

            if (!addressId) {
                return res.status(400).json({ message: "ID địa chỉ không hợp lệ" });
            }

            const result = await addressService.setDefaultAddress(userId, addressId);

            if (!result.success) {
                return res.status(404).json({ message: result.message });
            }

            return res.json({
                message: "Đã đặt làm địa chỉ mặc định",
                addresses: result.addresses // Trả luôn danh sách mới để frontend có thể dùng ngay
            });

        } catch (error) {
            console.error("Error set default address:", error);
            res.status(500).json({ message: "Lỗi server khi cập nhật địa chỉ mặc định" });
        }
    }

}

module.exports = new addressController();