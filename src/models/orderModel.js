const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
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
    id_payment: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'payment',
            key: 'id'
        }
    },
    id_shipping_method: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'shipping_method',
            key: 'id'
        }
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'user',
            key: 'id'
        }
    },
    id_discount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'discount',
            key: 'id'
        }
    },
    id_address: {
        type: DataTypes.INTEGER,
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
