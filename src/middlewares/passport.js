
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userModel = require("../models/userModel"); // Đảm bảo đường dẫn đúng tới model User

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,

            callbackURL: "/user/auth/google/callback",
        },
        async function (accessToken, refreshToken, profile, done) {
            try {
                // 1. Tìm user theo google_id
                let user = await userModel.findOne({ where: { google_id: profile.id } });

                if (user) {
                    return done(null, user);
                }

                // 2. Nếu không có, tìm theo email (đề phòng user cũ đã đk bằng email này)
                const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
                if (email) {
                    user = await userModel.findOne({ where: { email } });
                    if (user) {
                        // Cập nhật google_id cho user cũ
                        user.google_id = profile.id;
                        await user.save();
                        return done(null, user);
                    }
                }

                const newUser = await userModel.create({
                    name: profile.displayName,
                    email: email,
                    google_id: profile.id,
                    role: "user",
                    is_locked: false,

                });

                return done(null, newUser);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

// Bắt buộc phải có để passport hoạt động (dù mình dùng JWT)
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    const user = await userModel.findByPk(id);
    done(null, user);
});

module.exports = passport;