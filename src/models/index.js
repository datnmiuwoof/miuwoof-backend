const { sequelize } = require('../config/database');
const user = require('./userModel');
const product = require('./productModel');
const product_image = require('./productImageModel');
const category = require('./categoryModel');
const product_variants = require('./productVariants');
const post_model = require('./postModel');
const post_category = require('./postCategoryModel');
const favorite = require('./favoriteModel');
const review = require('./reviewModel');
const order_detail = require('./orderDetailModel');
const address = require('./addressModel');
const order = require('./orderModel');
const discount = require('./discountModel');
const shipping_method = require('./shippingMehodModel');
const payment = require('./paymentModel');
const banner = require('./bannerModel');
const brand = require('./brandModel');

// USER
user.hasMany(address, { foreignKey: 'id_user' });
address.belongsTo(user, { foreignKey: 'id_user' });

user.hasMany(order, { foreignKey: 'id_user' });
order.belongsTo(user, { foreignKey: 'id_user' });

user.hasMany(favorite, { foreignKey: 'id_user' });
favorite.belongsTo(user, { foreignKey: 'id_user' });

user.hasMany(review, { foreignKey: 'id_user' });
review.belongsTo(user, { foreignKey: 'id_user' });

user.hasMany(discount, { foreignKey: 'id_user' });
discount.belongsTo(user, { foreignKey: 'id_user' });

user.hasMany(post_model, { foreignKey: 'author_id' });
post_model.belongsTo(user, { foreignKey: 'author_id' });

// PRODUCT
product.belongsTo(category, { foreignKey: 'id_category' });
category.hasMany(product, { foreignKey: 'id_category' });

product.belongsTo(brand, { foreignKey: 'id_brand' });
brand.hasMany(product, { foreignKey: 'id_brand' });

product.hasMany(product_image, { foreignKey: 'id_product' });
product_image.belongsTo(product, { foreignKey: 'id_product' });

product.hasMany(product_variants, { foreignKey: 'product_id' });
product_variants.belongsTo(product, { foreignKey: 'product_id' });

product.hasMany(favorite, { foreignKey: 'id_product' });
favorite.belongsTo(product, { foreignKey: 'id_product' });

product.hasMany(review, { foreignKey: 'id_product' });
review.belongsTo(product, { foreignKey: 'id_product' });

product.hasMany(order_detail, { foreignKey: 'id_product' });
order_detail.belongsTo(product, { foreignKey: 'id_product' });

// ORDER
order.belongsTo(payment, { foreignKey: 'id_payment' });
payment.hasMany(order, { foreignKey: 'id_payment' });

order.belongsTo(shipping_method, { foreignKey: 'id_shipping_method' });
shipping_method.hasMany(order, { foreignKey: 'id_shipping_method' });

order.belongsTo(discount, { foreignKey: 'id_discount' });
discount.hasMany(order, { foreignKey: 'id_discount' });

order.belongsTo(address, { foreignKey: 'id_address' });
address.hasMany(order, { foreignKey: 'id_address' });

order.hasMany(order_detail, { foreignKey: 'id_order' });
order_detail.belongsTo(order, { foreignKey: 'id_order' });

// POST
post_model.belongsTo(post_category, { foreignKey: 'post_category_id' });
post_category.hasMany(post_model, { foreignKey: 'post_category_id' });

// CATEGORY PARENT-CHILD
category.hasMany(category, { as: 'children', foreignKey: 'parent_id' });
category.belongsTo(category, { as: 'parent', foreignKey: 'parent_id' });

module.exports = {
    sequelize,
    user,
    product,
    product_image,
    category,
    product_variants,
    post_model,
    post_category,
    favorite,
    review,
    order_detail,
    address,
    order,
    discount,
    shipping_method,
    payment,
    banner,
    brand,
};
