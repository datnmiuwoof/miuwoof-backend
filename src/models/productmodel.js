const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true,
    },
    name: {
        type: DataTypes.STRING, allowNull: false,
    },
    email: {
        type: DataTypes.STRING, unique: true, allowNull: false,
    },
}, {
    tableName: 'product',
    timestamps: true,
    underscored: true,
}
);

module.exports = Product;