const userService = require("../../services/userService");
const emailService = require("../../services/emailService");
const { saveOTP, verifyOTP } = require("../../services/otpService");
const Joi = require("joi");
const bcrypt = require("bcrypt");

class userController {
  //register/ tạo tài khoản

  async sendOtp(req, res) {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Điền đầy đủ thông tin" });
    }

    const checkUser = await userService.getOneEmail(email);
    if (checkUser) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const hashedPassword = await bcrypt.hash(password, 10);

    await saveOTP(email, otp, { 
            name: name, 
            password: hashedPassword 
        });
    await emailService.sendRegisterOtp(email, otp);
    return res.status(200).json({ message: "OTP đã gửi về email" });
  }

  async verifyOtp(req, res) {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: "Thiếu dữ liệu" });
        }

        // Kiểm tra OTP
        const check = verifyOTP(email, otp); // Hàm này giờ trả về { ok, data }
        if (!check.ok) {
            return res.status(400).json({ message: check.message });
        }

        try {
            // ✅ Lấy dữ liệu từ check.data (đúng cấu trúc object)
            const { name, password } = check.data;

            // Gọi service tạo user (password đã hash rồi nên userService chỉ việc lưu)
            const result = await userService.addUser({
                name, email, password
            })

            const safeUser = { ...result.get(), password: undefined }
            res.status(200).json({
                message: "Đăng ký thành công",
                data: safeUser,
            })
        } catch (error) {
            res.status(500).json({
                message: "Lỗi khi thêm dữ liệu",
                error: error.message,
            });
        }
    }

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
      });

      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const checkUser = await userService.loginUser({ email, password });
      const token = checkUser.token;

      res.cookie("token", token, {
        httpOnly: false,
        secure: false, //khi push lên mạng dùng https đổi thành true
        sameSite: "lax",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        email: checkUser.email,
        name: checkUser.name,
        role: checkUser.role,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message || "Đăng nhập lỗi",
      });
    }
  }

  async getCurrentUser(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Chưa đăng nhập" });
      }
      res.status(200).json({
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role || "user",
      });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }

  async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            if (!email) return res.status(400).json({ message: "Vui lòng nhập email" });

            const result = await userService.requestForgotPassword(email);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

  async resetPassword(req, res) {
        try {
            const { email, otp, newPassword } = req.body;
          
            const schema = Joi.object({
                email: Joi.string().email().required(),
                otp: Joi.string().required(),
                newPassword: Joi.string().min(6).required()
            });
            
            const { error } = schema.validate(req.body);
            if (error) return res.status(400).json({ message: error.details[0].message });

            const result = await userService.resetPassword(email, otp, newPassword);
            return res.status(200).json(result);

        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new userController();
