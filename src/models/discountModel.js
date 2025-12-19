const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Discount = sequelize.define('Discount', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    discount_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    discount_value: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
            max: 100,
        },
    },

    discount_type: {
        type: DataTypes.TINYINT,
        allowNull: false,   // 0 = fixed, 1 = percentage
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    min_order_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    max_order_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    used_quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
}, {
    tableName: 'discount',
    timestamps: true,      // ✅ tạo created_at & updated_at
    underscored: true,
});

module.exports = Discount;
