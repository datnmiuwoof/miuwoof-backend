const shipping_method = require('../../models/shippingMehodModel')

class shipperMethodController {
    async getShippingMethods(req, res) {
        try {
            const methods = await shipping_method.findAll({
                where: { status: 1 },
                attributes: ['id', 'name', 'estimated_day', 'shipping_fee', 'description'],
                order: [['estimated_day', 'ASC']]
            });

            res.json(methods);
        } catch (err) {
            res.status(500).json({ message: 'Lỗi lấy phương thức giao hàng' });
        }
    };
}

module.exports = new shipperMethodController();