const dashboardService = require("../../services/dashboardService");

class DashboardController {
    async overview(req, res) {
        try {
            const { start, end } = req.query; // nhận query từ frontend
            const data = await dashboardService.getOverview(start, end);
            return res.status(200).json({
                message: "OK",
                data
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Lỗi server" });
        }
    }
}

module.exports = new DashboardController();
