require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/database');
const siteRouter = require('./router/siterouter');
const userRouter = require('./router/siterouter');
const app = express();
const port = process.env.PORT || 3000;


// Middleware để parse JSON
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", "./src/views");
app.use(express.static("./src/public"));

//khai bao cors 
app.use(cors());

// Route cơ bản
app.use('/', siteRouter);
app.use('/user', userRouter);



(async () => {
    await connectDB();
    await sequelize.sync({ alter: false }); // tự động tạo bảng nếu chưa có
    app.listen(port, () => {
        console.log(`✅ Server chạy tại http://localhost:${port}`);
    });
})();