const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ShippingMethod = sequelize.define('ShippingMethod', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    estimated_day: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    shipping_fee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,    // 1 = hoạt động, 0 = ngừng
    },
}, {
    tableName: 'shipping_method',
    timestamps: true,      // ✅ Tạo created_at & updated_at
    underscored: true,
});

module.exports = ShippingMethod;
