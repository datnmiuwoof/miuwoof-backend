require('dotenv').config();
const express = require('express');
const cors = require('cors');
const siteRouter = require('./router/siterouter');
const app = express();
const port = process.env.PORT || 3000;


// Middleware để parse JSON
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", "./src/views");
app.use(express.static("./src/public"));

//khai bao cors 
const cors = require("cors");
app.use(cors());

// Route cơ bản
app.use('/', siteRouter);



// Khởi động server
app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});