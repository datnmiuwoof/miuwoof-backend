const {
    order,
    order_detail,
    product,
    user,
    address
} = require("../models");

const { Op } = require("sequelize"); // <-- Thêm dòng này

class DashboardService {
    async getOverview(startDate, endDate) {
        const now = new Date();
        const start = startDate ? new Date(startDate) : new Date(now.getFullYear(), now.getMonth(), 1);
        const end = endDate ? new Date(endDate) : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        const totalRevenue = await order.sum("total_amount", {
            where: {
                payment_status: "paid",
                order_status: { [Op.notIn]: ['cancelled'] },
                is_deleted: false,
                order_date: { [Op.between]: [start, end] }
            }
        });

        const totalOrders = await order.count({
            where: { order_date: { [Op.between]: [start, end] } }
        });

        const totalUsers = await user.count();

        const totalProducts = await product.count({
            where: { is_deleted: false }
        });

        const orderPending = await order.count({
            where: {
                order_status: "pending",
                order_date: { [Op.between]: [start, end] }
            }
        });

        const latestOrders = await order.findAll({
            where: { order_date: { [Op.between]: [start, end] } },
            limit: 10,
            order: [["createdAt", "DESC"]],
            include: [
                { model: user, attributes: ["id", "name", "email"] },
                { model: order_detail },
                { model: address }
            ]
        });

        const yearStart = new Date(now.getFullYear(), 0, 1);
        const yearEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59);

        const revenueData = [];
        for (let month = 0; month < 12; month++) {
            const startOfMonth = new Date(now.getFullYear(), month, 1);
            const endOfMonth = new Date(now.getFullYear(), month + 1, 0, 23, 59, 59);

            const monthlyRevenue = await order.sum("total_amount", {
                where: {
                    payment_status: "paid",
                    is_deleted: false,
                    order_date: { [Op.between]: [startOfMonth, endOfMonth] }
                }
            }) || 0;

            const monthlyOrders = await order.count({
                where: {
                    is_deleted: false,
                    order_status: { [Op.notIn]: ['cancelled'] },
                    order_date: { [Op.between]: [startOfMonth, endOfMonth] }
                }
            }) || 0;

            revenueData.push({
                month: `${month + 1}`,
                revenue: monthlyRevenue / 1000,
                orders: monthlyOrders
            });
        }

        const STATUS_COLOR_MAP = {
            pending: '#F59E0B',     // vàng
            confirmed: '#3B82F6',  // xanh dương
            shipping: '#6366F1',   // indigo
            completed: '#22C55E',  // xanh lá
            cancelled: '#EF4444'   // đỏ
        };

        const statuses = ['pending', 'confirmed', 'shipping', 'completed', 'cancelled'];
        const orderStatusData = [];
        for (const status of statuses) {
            const count = await order.count({
                where: {
                    order_status: status,
                    is_deleted: false,
                    order_date: { [Op.between]: [yearStart, yearEnd] }
                }
            });
            orderStatusData.push({
                name: status,
                value: count,
                color: STATUS_COLOR_MAP[status]
            });
        }


        return {
            totalRevenue: totalRevenue || 0,
            totalOrders,
            totalUsers,
            totalProducts,
            latestOrders,
            orderPending,
            revenueData,
            orderStatusData,
        };
    }
}

module.exports = new DashboardService();
