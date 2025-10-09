const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Post = sequelize.define('Post', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    slug: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    post_category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'post_category',
            key: 'id',
        }
    },
    author_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'user',
            key: 'id',
        }
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1,
    },
}, {
    tableName: 'post',
    timestamps: true,
    underscored: true,
});

module.exports = Post;
