const userService = require("../../services/userService");
const emailService = require("../../services/emailService");
const { saveOTP, verifyOTP, saveForgotPasswordOTP, checkverifyOTP } = require("../../services/otpService");
const Joi = require("joi");

class userController {
  //register/ tạo tài khoản

  //gửi otp để tạo tài khoản
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

    await saveOTP(email, otp, name, password);
    await emailService.sendRegisterOtp(email, otp);
    return res.status(200).json({ message: "OTP đã gửi về email" });
  }

  //gửi otp quên mật khẩu
  async sendForgotPasswordOtp(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Vui lòng nhập email" });
      }

      const user = await userService.getOneEmail(email);
      if (!user) {
        return res.status(400).json({ message: "Email không tồn tại trong hệ thống" });
      }

      const otp = Math.floor(100000 + Math.random() * 900000);

      saveForgotPasswordOTP(email, otp);

      await emailService.sendRegisterOtp(email, otp);

      return res.status(200).json({ message: "OTP đã gửi về email của bạn" });
    } catch (error) {
      return res.status(400).json({ message: error });
    }

  }

  //reset password
  async passwordReset(req, res) {
    const { otp, newPassword, confirmPassword, email } = req.body;

    console.log("otp", otp, newPassword, confirmPassword, email)

    if (!otp || !email || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "Thiếu dữ liệu required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Mật khẩu xác nhận không khớp" });
    }

    const check = await checkverifyOTP(email, otp);

    if (!check.ok) {
      return res.status(400).json({
        message: check.message,
      });
    }

    try {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.string().min(6).required(),
      }).options({ allowUnknown: true });

      const { error } = schema.validate(req.body);

      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const result = await userService.resetPassword(email, newPassword);


      return res.status(200).json({ message: "đổi mật khẩu thành công" });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi thêm dữ liệu",
        error: error.message,
      });
    }


  }

  async verifyOtp(req, res) {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Thiếu dữ liệu" });
    }

    const check = await verifyOTP(email, otp);
    if (!check.ok) {
      return res.status(400).json({
        message: check.message,
      });
    }

    try {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.string().min(6).required(),
      }).options({ allowUnknown: true });

      const { error } = schema.validate(req.body);

      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const { name, password } = check.data;

      const result = await userService.addUser({
        name,
        email,
        password,
      });

      const safeUser = { ...result.get(), password: undefined };
      res.status(200).json({
        message: "đăng ký thành công",
        data: safeUser,
      });
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

  async resetPassword(req, res) {
    try {
      const userId = req.user.id;

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Thiếu dữ liệu" });
      }

      if (currentPassword === newPassword) {
        throw new Error("Mật khẩu mới không được trùng mật khẩu cũ");
      }


      const result = await userService.changePassword(
        userId,
        currentPassword,
        newPassword
      );

      return res.json(result);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
}

module.exports = new userController();
