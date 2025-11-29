const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    transaction_code: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    // raw_data: {
    //     type: DataTypes.LONGTEXT,
    //     allowNull: true,
    // },
    callback_status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
    },
    currency: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    amount: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    method: {
        type: DataTypes.ENUM("momo", "cod", "vnpay"),
        allowNull: true,
    },
    payment_gateway: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    order_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'order',
            key: 'id'
        }
    },
}, {
    tableName: 'payment',
    timestamps: true,
    underscored: true,
});


module.exports = Payment;
