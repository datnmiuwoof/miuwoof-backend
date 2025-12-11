const OTP_STORE = {};

async function saveOTP(email, otp, data = {}) {
    OTP_STORE[email] = {
        otp: String(otp),
        data: data, 
        expire: Date.now() + 5 * 60 * 1000,
        used: false,
        attempts: 0,
    };
}

function verifyOTP(email, otp) {
    const record = OTP_STORE[email];
    if (!record) return { ok: false, message: "Chưa gửi OTP" };
    if (Date.now() > record.expire) return { ok: false, message: "Mã OTP hết hạn" };
    if (record.used) return { ok: false, message: "OTP đã được sử dụng" };
    if (record.attempts >= 5) return { ok: false, message: "Nhập sai quá 5 lần, vui lòng gửi lại OTP" };
    if (String(record.otp) !== String(otp)) {
        record.attempts++;
        return { ok: false, message: "Sai mã OTP" };
    }

    record.used = true;
   return { ok: true, data: record.data };
}

module.exports = { saveOTP, verifyOTP};
