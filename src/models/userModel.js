const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    is_locked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    is_destroyed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    login_fail_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    locked_until: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'user',
    timestamps: true,
    underscored: true,
});

module.exports = User;
