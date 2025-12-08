const {
    order,
    order_detail,
    product,
    user,
    address,
    sequelize
} = require("../models");

class DashboardService {
    async getOverview() {
        const totalRevenue = await order.sum("total_amount", {
            where: { payment_status: "paid", is_deleted: false }
        });

        const totalOrders = await order.count();

        const totalUsers = await user.count();

        const orderPending = await order.count({
            where: { order_status: "pending" }
        })

        const totalProducts = await product.count({
            where: { is_deleted: false }
        });

        const latestOrders = await order.findAll({
            limit: 5,
            order: [["createdAt", "DESC"]],
            include: [
                { model: user, attributes: ["id", "name", "email"] },
                { model: order_detail },
                { model: address }
            ]
        });

        return {
            totalRevenue: totalRevenue || 0,
            totalOrders,
            totalUsers,
            totalProducts,
            latestOrders,
            orderPending
        };
    }
}

module.exports = new DashboardService();