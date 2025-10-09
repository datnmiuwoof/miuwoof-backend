const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PostCategory = sequelize.define('PostCategory', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    slug: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1,
    },
}, {
    tableName: 'post_category',
    timestamps: true,
    underscored: true,
});

module.exports = PostCategory;
