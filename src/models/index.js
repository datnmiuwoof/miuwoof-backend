const { sequelize } = require("../config/database");
const user = require("./userModel");
const product = require("./productModel");
const product_image = require("./productImageModel");
const category = require("./categoryModel");
const product_variants = require("./productVariants");
const post_model = require("./postModel");
const post_category = require("./postCategoryModel");
const favorite = require("./favoriteModel");
const review = require("./reviewModel");
const order_detail = require("./orderDetailModel");
const address = require("./addressModel");
const order = require("./orderModel");
const discount = require("./discountModel");
const shipping_method = require("./shippingMehodModel");
const payment = require("./paymentModel");
const banner = require("./bannerModel");
const brand = require("./brandModel");
const productDiscount = require("./productDiscountModel");
const product_category = require("./productCategoryModel");
const cart = require("./cartModel");
const cart_item = require("./cartItemModel");

// ======================== USER ========================
user.hasMany(address, { foreignKey: "user_id" });
address.belongsTo(user, { foreignKey: "user_id" });

user.hasMany(order, { foreignKey: "user_id" });
order.belongsTo(user, { foreignKey: "user_id" });

user.hasMany(favorite, { foreignKey: "user_id" });
favorite.belongsTo(user, { foreignKey: "user_id" });

user.hasMany(review, { foreignKey: "user_id" });
review.belongsTo(user, { foreignKey: "user_id" });

user.hasOne(cart, { foreignKey: "user_id" });
cart.belongsTo(user, { foreignKey: "user_id" });

// Trong SQL của bạn, discount KHÔNG có user_id → bỏ quan hệ này
// user.hasMany(discount, { foreignKey: 'user_id' });
// discount.belongsTo(user, { foreignKey: 'user_id' });

user.hasMany(post_model, { foreignKey: "user_id" });
post_model.belongsTo(user, { foreignKey: "user_id" });

// ======================== PRODUCT ========================
// product.belongsTo(category, { foreignKey: "category_id" });
// category.hasMany(product, { foreignKey: "category_id" });

product.belongsTo(brand, { foreignKey: "brand_id" });
brand.hasMany(product, { foreignKey: "brand_id" });


product.hasMany(product_variants, { foreignKey: "product_id" });
product_variants.belongsTo(product, { foreignKey: "product_id" });

product.hasMany(favorite, { foreignKey: "product_id" });
favorite.belongsTo(product, { foreignKey: "product_id" });

product.hasMany(review, { foreignKey: "product_id" });
review.belongsTo(product, { foreignKey: "product_id" });

product_variants.hasMany(product_image, { foreignKey: "product_variants_id" });
product_image.belongsTo(product_variants, { foreignKey: "product_variants_id" });


// =============category=================

// Category Model
category.belongsTo(category, {
  as: "ParentCategory",
  foreignKey: "parent_id",
});

category.hasMany(category, {
  as: "SubCategories",
  foreignKey: "parent_id",
});


// ======================== ORDER ========================
payment.belongsTo(order, { foreignKey: "order_id" });
order.hasMany(payment, { foreignKey: "order_id" });

order.belongsTo(shipping_method, { foreignKey: "shipping_method_id" });
shipping_method.hasMany(order, { foreignKey: "shipping_method_id" });

order.belongsTo(discount, { foreignKey: "discount_id" });
discount.hasMany(order, { foreignKey: "discount_id" });

order.belongsTo(address, { foreignKey: "address_id" });
address.hasMany(order, { foreignKey: "address_id" });

order.hasMany(order_detail, { foreignKey: "order_id" });
order_detail.belongsTo(order, { foreignKey: "order_id" });

// ✅ Sửa: chỉ belongsTo thôi
order_detail.belongsTo(product_variants, { foreignKey: "product_variant_id" });
product_variants.hasMany(order_detail, { foreignKey: "product_variant_id" });

// ======================== POST ========================
post_model.belongsTo(post_category, { foreignKey: "post_category_id" });
post_category.hasMany(post_model, { foreignKey: "post_category_id" });


// ======================== CART ========================

cart.hasMany(cart_item, {
  as: 'items',
  foreignKey: "cart_id",
  sourceKey: "id"
});

cart_item.belongsTo(cart, {
  foreignKey: "cart_id",
  targetKey: "id"
});

// N:1 CartItem → ProductVariant
cart_item.belongsTo(product_variants, { foreignKey: "product_variants_id", as: 'product_variant' });
product_variants.hasMany(cart_item, { foreignKey: "product_variants_id" });




// ======================== CATEGORY parent-child ========================
category.hasMany(category, { as: "children", foreignKey: "parent_id" });
category.belongsTo(category, { as: "parent", foreignKey: "parent_id" });

// ======================== trung gian discount vs product ========================
discount.belongsToMany(product, {
  through: productDiscount,
  foreignKey: "discount_id",
  otherKey: "product_id",
});

product.belongsToMany(discount, {
  through: productDiscount,
  foreignKey: "product_id",
  otherKey: "discount_id",
});

// ======================== trung gian category vs product ========================
// N product - N category
product.belongsToMany(category, {
  through: product_category,
  foreignKey: 'product_id',
  otherKey: 'category_id',
});

category.belongsToMany(product, {
  through: product_category,
  foreignKey: 'category_id',
  otherKey: 'product_id',

});


// ======================== EXPORT ========================
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
  productDiscount,
  product_category,
  cart,
  cart_item,
};
