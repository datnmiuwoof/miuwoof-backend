// src/services/productService.js
const {
  sequelize,
  product,
  product_variants,
  product_image,
  category,
  brand,
} = require("../models");

class ProductService {
  async getAllProducts() { }

  // tạo sản phẩm
  async createProduct(productData) {
    const t = await sequelize.transaction();
    try {
      const newProduct = await product.create(
        {
          name: productData.name,
          slug: productData.slug,
          price: productData.price,
          import_price: productData.import_price,
          description: productData.description,
          category_id: productData.category_id,
          brand_id: productData.brand_id,
          image: productData.images[0] ? productData.images[0].url : null, // Lấy ảnh
        },
        { transaction: t }
      );

      // 2. Chuẩn bị dữ liệu cho biến thể và hình ảnh
      const productId = newProduct.id;

      if (productData.variants && productData.variants.length > 0) {
        const variantsData = productData.variants.map((v) => ({
          ...v,
          product_id: productId,
        }));
        await product_variants.bulkCreate(variantsData, { transaction: t });
      }

      if (productData.images && productData.images.length > 0) {
        const imagesData = productData.images.map((img) => ({
          ...img,
          product_id: productId,
          image: img.url,
        }));
        await product_image.bulkCreate(imagesData, { transaction: t });
      }

      await t.commit();
      return newProduct;
    } catch (error) {
      await t.rollback();
      console.error("Lỗi service tạo sản phẩm:", error);
      throw new Error("Tạo sản phẩm thất bại.");
    }
  }

  // lấy chi tiết sản phẩm
  async getProductById(productId) {
    const result = await product.findByPk(productId, {
      include: [
        { model: category },
        { model: brand },
        { model: product_image },
        { model: product_variants },
      ],
    });

    if (!result) {
      throw new Error("Không tìm thấy sản phẩm.");
    }
    return result;
  }

  // cập nhật sản phẩm
  async updateProduct(productId, productData) {
    const t = await sequelize.transaction();
    try {
      const productToUpdate = await product.findByPk(productId);
      if (!productToUpdate) {
        throw new Error("Không tìm thấy sản phẩm để cập nhật.");
      }

      // 1. Cập nhật thông tin chính của sản phẩm
      // ✅ Chỉ cập nhật các trường được cung cấp trong productData
      await productToUpdate.update(
        {
          name: productData.name,
          slug: productData.slug,
          price: productData.price,
          import_price: productData.import_price,
          description: productData.description,
          category_id: productData.category_id,
          brand_id: productData.brand_id,
          image:
            productData.images && productData.images[0]
              ? productData.images[0].url
              : productToUpdate.image,
        },
        { transaction: t }
      );

      // 2. Xử lý variants và images (nếu chúng được cung cấp)
      if (productData.variants) {
        await product_variants.destroy(
          { where: { product_id: productId } },
          { transaction: t }
        );
        if (productData.variants.length > 0) {
          const variantsData = productData.variants.map((v) => ({
            ...v,
            product_id: productId,
          }));
          await product_variants.bulkCreate(variantsData, { transaction: t });
        }
      }

      if (productData.images) {
        await product_image.destroy(
          { where: { product_id: productId } },
          { transaction: t }
        );
        if (productData.images.length > 0) {
          const imagesData = productData.images.map((img) => ({
            ...img,
            product_id: productId,
            image: img.url,
          }));
          await product_image.bulkCreate(imagesData, { transaction: t });
        }
      }

      await t.commit();

      // Trả về dữ liệu đã được cập nhật đầy đủ
      return await product.findByPk(productId, {
        include: [category, brand, product_image, product_variants],
      });
    } catch (error) {
      await t.rollback();
      console.error("Lỗi service cập nhật sản phẩm:", error);
      throw new Error("Cập nhật sản phẩm thất bại.");
    }
  }

  // xóa sản phẩm
  async deleteProduct(productId) {
    const productToDelete = await product.findByPk(productId);
    if (!productToDelete) {
      throw new Error("Không tìm thấy sản phẩm để xóa.");
    }

    await productToDelete.destroy();
  }
  // ...
}

module.exports = new ProductService();
