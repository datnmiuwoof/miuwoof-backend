module.exports = function gerenataOTP() {
    return Math.floor(100000 + Math.random() * 9000000).toString();
};