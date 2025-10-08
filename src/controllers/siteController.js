class siteController {
    home(req, res) {
        res.send('<h1>trang chủ nè quí dị</h1>')
    }
}

module.exports = new siteController;