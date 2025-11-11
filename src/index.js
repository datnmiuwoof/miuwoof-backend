require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/database');
const siteRouter = require('./router/client/siterouter');
const productRouter = require('./router/client/productsrouter');
const productAdminRouter = require("./router/admin/productAdminrouter");
const categoryAdminRouter = require("./router/admin/categoryAdminrouter");
const userAdminRouter = require("./router/admin/userAdminrouter");
const userRouter = require("./router/client/userrouter");


const app = express();
const port = process.env.PORT || 3000;
const nodemailer = require("nodemailer");
// Middleware để parse JSON
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", "./src/views");
app.use(express.static("./src/public"));

//khai bao cors
app.use(cors());


app.use("/", siteRouter);
app.use("/product", productRouter);
app.use("/user", userRouter);
app.use("/api/products", productAdminRouter);
app.use("/api/categorys", categoryAdminRouter);
app.use("/api/users", userAdminRouter);


(async () => {
    await connectDB();
    await sequelize.sync({ alter: false });
    app.listen(port, () => {
        console.log(`✅ Server chạy tại http://localhost:${port}`);
    });
})();
