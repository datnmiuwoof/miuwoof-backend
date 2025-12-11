const { DataTypes } = require("sequelize")
const { sequelize } = require("../config/database");

const post_images = sequelize.define("post_images", {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    post: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: "post",
            key: "id"
        },
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },

}, {
    tableName: 'post_images',
    timestamps: true,
    underscored: true,
})

module.exports = post_images;