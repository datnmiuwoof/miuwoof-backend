require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/database');
const siteRouter = require('./router/siterouter');
const userRouter = require('./router/siterouter');
const productRouter = require("./router/productsrouter");

const app = express();
const port = process.env.PORT || 3000;

// Middleware để parse JSON
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", "./src/views");
app.use(express.static("./src/public"));

//khai bao cors
app.use(cors());


app.use("/", siteRouter);
app.use("/user", userRouter);
app.use("/api/products", productRouter);

(async () => {
    await connectDB();
    await sequelize.sync({ alter: false });
    app.listen(port, () => {
        console.log(`✅ Server chạy tại http://localhost:${port}`);
    });
})();
