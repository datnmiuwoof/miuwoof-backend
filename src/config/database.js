require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  (process.env.DB_NAME = "datn"),
  (process.env.DB_USER = "root"),
  (process.env.DB_PASS = ""),
  {
    host: (process.env.DB_HOST = "localhost"),
    dialect: (process.env.DB_DIALECT = "mysql"),
    logging: false,
  }
);

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("Kết nối cơ sở dữ liệu thành công!");
  } catch (error) {
    console.error("Lỗi kết nối cơ sở dữ liệu:", error);
  }
}

module.exports = { sequelize, connectDB };
