class userController {
    getuser(req, res) {
        res.send('<h1>trang user nè quí dị</h1>')
    }
}

module.exports = new userController;