const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Address = sequelize.define('Address', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    district: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    address_line: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    ward: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    is_default: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'user',
            key: 'id',
        }
    },
}, {
    tableName: 'address',
    timestamps: true,
    underscored: true,
});

module.exports = Address;
