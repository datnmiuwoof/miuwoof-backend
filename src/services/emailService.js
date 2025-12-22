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
      // console.log("Email đã gửi thành công:", info.messageId);
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

    await this.sendMail({
      to: userEmail,
      subject: subject,
      html: html,
    })
  }


  async sendContactNotificationToAdmin(contactData) {
    const subject = `[MiuWoof] Liên hệ mới từ ${contactData.name}`;
    const html = `
      <h1>🔔 Có liên hệ mới từ khách hàng</h1>
      <p><strong>Họ tên:</strong> ${contactData.name}</p>
      <p><strong>Email:</strong> ${contactData.email}</p>
      <p><strong>Số điện thoại:</strong> ${contactData.phone || "Không cung cấp"}</p>
      <p><strong>Nội dung:</strong></p>
      <div style="background:#f9f9f9; padding:15px; border-left:4px solid #10b981; border-radius:4px;">
        ${contactData.message.replace(/\n/g, '<br>')}
      </div>
      <br>
      <p>Vui lòng phản hồi khách hàng sớm nhé!</p>
      <hr>
      <p><small>Email được gửi tự động từ form liên hệ MiuWoof Shop</small></p>
    `;

    // Dùng ADMIN_EMAIL từ .env, fallback về email cá nhân của bạn
    const adminEmail = process.env.MAIL_USER || "datnmiuwoof@gmail.com";
    await this.sendMail({
      to: adminEmail,         // ← Đúng: gửi cho admin
      subject: subject,
      html: html,
    });
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

  async sendContactEmails(contactData) {
    try {
      const { name, email, phone, message } = contactData;

      // 1. Gửi email cảm ơn cho khách
      await this.sendContactReply(email, name);

      // 2. Gửi thông báo cho admin
      await this.sendContactNotificationToAdmin({
        name,
        email,
        phone: phone || "Không có",
        message,
      });

      // console.log("Đã gửi email liên hệ thành công cho cả khách và admin");
    } catch (error) {
      console.error("Lỗi khi gửi email liên hệ:", error);
      throw new Error("Gửi email liên hệ thất bại");
    }
  }

  // Sau này, bạn chỉ cần thêm các hàm mới vào đây
  // async sendPasswordReset(userEmail, resetLink) { ... }
  // async sendOrderConfirmation(userEmail, orderDetails) { ... }
}

module.exports = new EmailService();
