const OTP_STORE = {};
const bcrypt = require("bcrypt");

async function saveOTP(email, otp, name, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    OTP_STORE[email] = {
        otp: String(otp),
        name,
        password: hashedPassword,
        expire: Date.now() + 5 * 60 * 1000,
        used: false,
        attempts: 0,
    };
}

function saveForgotPasswordOTP(email, otp) {
    OTP_STORE[email] = {
        otp: String(otp),
        expire: Date.now() + 5 * 60 * 1000,
        used: false,
        attempts: 0,
        type: "forgot"
    };
}


//check otp của quên pass
function checkverifyOTP(email, otp) {
    if (!otp || String(otp).trim() === "") {
        return { ok: false, message: "OTP không được để trống" };
    }

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
    return { ok: true };
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
    return { ok: true, data: { name: record.name, password: record.password } };
}

module.exports = { saveOTP, verifyOTP, saveForgotPasswordOTP, checkverifyOTP };
