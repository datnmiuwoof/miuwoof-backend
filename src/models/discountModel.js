const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Discount = sequelize.define('Discount', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    discount_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    discount_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    discount_type: {
        type: DataTypes.TINYINT,
        allowNull: false,   // 0 = fixed, 1 = percentage
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    min_order_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    max_order_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    used_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'user',
            key: 'id',
        }
    },
}, {
    tableName: 'discount',
    timestamps: true,      // ✅ tạo created_at & updated_at
    underscored: true,
});

module.exports = Discount;
