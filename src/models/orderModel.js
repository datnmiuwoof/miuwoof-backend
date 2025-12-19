const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    order_status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'shipped', 'completed', 'canceled'),
        allowNull: false,
        defaultValue: 'pending'
    },
    order_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    total_amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    discount_amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    payment_status: {
        type: DataTypes.ENUM('pending', 'paid', 'failed', 'canceled', 'refund'),
        defaultValue: 'pending',
    },
    order_note: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    shipping_method_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
            model: 'shipping_method',
            key: 'id'
        }
    },
    user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'user',
            key: 'id'
        }
    },
    discount_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
            model: 'discount',
            key: 'id'
        }
    },
    address_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'address',
            key: 'id'
        }
    },
}, {
    tableName: 'order',
    timestamps: true,
    underscored: true,
});

module.exports = Order;
