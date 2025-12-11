// src/services/emailService.js
const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    // 1. Tạo transporter
    // Transporter là đối tượng chịu trách nhiệm gửi mail
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  /**
   * Hàm gửi mail chung
   * @param {object} options - Tùy chọn gửi mail
   * @param {string} options.to - Email người nhận
   * @param {string} options.subject - Chủ đề email
   * @param {string} options.html - Nội dung HTML của email
   * @param {string} [options.text] - (Tùy chọn) Nội dung text (nếu client không hỗ trợ HTML)
   */
  async sendMail({ to, subject, html, text }) {
    try {
      const mailOptions = {
        from: process.env.MAIL_FROM,
        to: to,
        subject: subject,
        html: html,
        text: text,
      };


      const info = await this.transporter.sendMail(mailOptions);
      console.log("Email đã gửi thành công:", info.messageId);
      return info;
    } catch (error) {
      console.error("Lỗi khi gửi email:", error);
      throw new Error("Gửi email thất bại.");
    }
  }

  async sendRegisterOtp(userEmail, otp) {
    const subject = "Mã xác minh đăng ký tài khoản MiuWoof";
    const html = `
     <h2>Mã xác minh của bạn là</h2>
     <p>Mã OTP để xác minh đăng ký tài khoản là:</p>
     <h1 style="font-size: 28px; letter-spacing: 4px;">${otp}</h1>
     <p>Mã có hiệu lực trong 5 phút.</p>
        <br>
        <p>Trân trọng,<br>MiuWoof Team</p>
     `;
// console.log(`Đã gửi OTP đăng ký tới ${userEmail}: ${otp}`);
    await this.sendMail({
      to: userEmail,
      subject: subject,
      html: html,
    })
    
  }

  // Gửi email xác nhận liên hệ (ví dụ đầu tiên)

  async sendContactReply(userEmail, userName) {
    const subject = "Cảm ơn bạn đã liên hệ với MiuWoof Shop!";
    const html = `
            <h1>Chào ${userName},</h1>
            <p>Chúng tôi đã nhận được thông tin liên hệ của bạn.</p>
            <p>Cảm ơn bạn đã quan tâm đến MiuWoof Shop. Chúng tôi sẽ phản hồi lại bạn trong thời gian sớm nhất.</p>
            <br>
            <p>Trân trọng,</p>
            <p>Đội ngũ MiuWoof.</p>
        `;

    await this.sendMail({
      to: userEmail,
      subject: subject,
      html: html,
    });
  }


  // Gửi thông báo có liên hệ mới cho Admin (ví dụ)

  async sendContactNotificationToAdmin(contactData) {
    const subject = `[MiuWoof] Bạn có liên hệ mới từ ${contactData.name}`;
    const html = `
            <h1>Thông báo liên hệ mới</h1>
            <p><strong>Tên:</strong> ${contactData.name}</p>
            <p><strong>Email:</strong> ${contactData.email}</p>
            <p><strong>Nội dung:</strong></p>
            <p>${contactData.message}</p>
        `;

    await this.sendMail({
      to: "nguyenthegiaan39@gmail.com",
      subject: subject,
      html: html,
    });
  }

  async sendForgotPasswordOtp(userEmail, otp) {
    const subject = "Yêu cầu đặt lại mật khẩu - MiuWoof";
    const html = `
     <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Đặt lại mật khẩu</h2>
        <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản liên kết với email này.</p>
        <p>Mã xác nhận (OTP) của bạn là:</p>
        <h1 style="color: #d35400; letter-spacing: 5px;">${otp}</h1>
        <p>Mã này có hiệu lực trong 5 phút. Tuyệt đối không chia sẻ mã này cho ai.</p>
        <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
        <br>
        <p>Trân trọng,<br>MiuWoof Team</p>
     </div>
     `;

    await this.sendMail({
      to: userEmail,
      subject: subject,
      html: html,
    })
  }

  // Sau này, bạn chỉ cần thêm các hàm mới vào đây
  // async sendPasswordReset(userEmail, resetLink) { ... }
  // async sendOrderConfirmation(userEmail, orderDetails) { ... }
}

module.exports = new EmailService();
