const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    transaction_code: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    currency: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false,     // 0 = pending, 1 = success, 2 = failed (tùy hệ thống)
    },
    method: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
}, {
    tableName: 'payment',
    timestamps: true,      // ✅ Tạo created_at & updated_at
    underscored: true,
});

module.exports = Payment;
