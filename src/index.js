require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const { connectDB, sequelize } = require('./config/database');
const siteRouter = require('./router/client/siterouter');
const productRouter = require('./router/client/productsrouter');
const productAdminRouter = require("./router/admin/productAdminrouter");
const categoryAdminRouter = require("./router/admin/categoryAdminrouter");
const userAdminRouter = require("./router/admin/userAdminrouter");
const userRouter = require("./router/client/userrouter");
const cartRouter = require("./router/client/cartrouter");
const paymentRouter = require("./router/client/paymentrouter");
const addressRouter = require("./router/client/addressrouter");
const statusRouter = require("./router/client/statusrouter");

const app = express();
const port = process.env.PORT || 3000;
// Middleware để parse JSON
app.use(express.json());
app.use(cookieParser());


app.use(express.urlencoded({ extended: true }));

//khai bao cors
app.use(cors({
    origin: "http://localhost:3005",
    credentials: true,
}));

app.set("view engine", "ejs");
app.set("views", "./src/views");
app.use(express.static("./src/public"));


app.use("/", siteRouter);
app.use("/product", productRouter);
app.use("/user", userRouter);
app.use("/api/products", productAdminRouter);
app.use("/api/categorys", categoryAdminRouter);
app.use("/api/users", userAdminRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", paymentRouter);
app.use("/api/address", addressRouter);
app.use("/checkout/success", statusRouter);


(async () => {
    await connectDB();
    await sequelize.sync({ alter: false });
    app.listen(port, () => {
        console.log(`✅ Server chạy tại http://localhost:${port}`);
    });
})();
