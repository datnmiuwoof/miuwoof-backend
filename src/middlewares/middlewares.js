const jwt = require("jsonwebtoken");

const authmiddlewares = (roleRequired = null) => {
    return (req, res, next) => {
        const token = req.cookies.token;


        if (!token) return res.status(401).json({ message: "Chưa đăng nhập hoặc thiếu token" });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key");

            req.user = decoded;

            if (roleRequired && req.user.role !== roleRequired) {
                return res.status(403).json({ message: "Không có quyền truy cập" });
            }
            next();
        } catch (error) {
            return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
        }
    }
}

module.exports = authmiddlewares;