const addressService = require("../../services/addressService");


class addressController {
    async checkoutAddress(req, res) {
        try {
            const user_id = req.params.id;
            const addresses = await addressService.checkoutAddress(user_id);

            if (!addresses) {
                return res.status(404).json({ message: "User chưa có address" });
            }

            return res.json(addresses);
        } catch (error) {
            res.status(500).json({ message: "Address created founld" });
        }
    }
}

module.exports = new addressController();