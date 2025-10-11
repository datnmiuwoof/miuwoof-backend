const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    order_status: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    order_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    total_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    payment_status: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    order_note: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    payment_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'payment',
            key: 'id'
        }
    },
    shipping_method_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
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
        allowNull: false,
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
