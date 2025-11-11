// src/services/productService.js
const {
  sequelize,
  product,
  product_variants,
  product_image,
  category,
  brand,
  discount,
  product_category,
} = require("../models");
const Category = require("../models/categoryModel");
// const { create } = require("../controllers/admin/categoryController");
const slug = require("slugify")
const uploadService = require("../services/uploadService");
const fs = require("fs");


class ProductService {

  //lấy all sản phẩm ở admin
  async getAllProducts(page = 1, limit = 10) {

    if (page < 1) page = 1;
    if (limit > 100) limit = 100;

    const offset = (page - 1) * limit;

    const { count, rows } = await product.findAndCountAll({
      where: { is_deleted: false },
      include: [
        {
          model: Category,
          through: { attributes: [] },
          attributes: ['id', 'name', 'slug'],
          required: false,
        },
        {
          model: product_variants,
          where: { is_deleted: false },
          include: [
            {
              model: product_image,
              attributes: ['image', 'id', 'product_variants_id'],
              required: false,
            }
          ]
        }
      ],
      limit,
      offset,
      distinct: true,
    });

    const totalPages = Math.ceil(count / limit)

    return {
      data: rows,
      pagination: {
        totalItems: count,
        currentPage: page,
        totalPages,
        limit
      }
    };
  }

  //lấy sản phẩm theo loại
  async getCollections(slug) {

    const cate = await category.findOne({ where: { slug } });

    if (!cate) return [];

    let categoryIds = [cate.id];

    // if (cate.parent_id === null) {
    //   const children = await category.findAll({
    //     where: { parent_id: cate.id },
    //     attributes: ['id'],
    //   });

    //   if (children.length) {
    //     categoryIds = children.map((c) => c.id);
    //   }
    // }

    if (cate.parent_id === null) {
      const children = await category.findAll({
        where: { parent_id: cate.id },
        attributes: ['id'],
      });
      if (children.length) {
        categoryIds = [cate.id, ...children.map((c) => c.id)];
      }
    }


    const getCollections = await product.findAll({
      where: { is_deleted: false },
      include: [
        {
          model: Category,
          through: { attributes: [] },
          attributes: ['id', 'name', 'slug'],
          where: { id: categoryIds },
          required: true,
        },
        {
          model: product_variants,
          attributes: ["price"],
          separate: true,
          limit: 1,
          order: [['price', 'ASC']],
          include: [
            {
              model: product_image,
              attributes: ['image']
            }
          ]
        },
        {
          model: discount,
          attributes: ['id', 'discount_value', 'discount_type', 'is_active'],
        },
      ],
    });

    return getCollections;
  }

  // lấy sản phẩm giảm giá
  async getAllDiscount() {
    const productsDiscount = await product.findAll({
      where: { is_deleted: false },
      include: [
        {
          model: product_variants,
          attributes: ["price"],
          separate: true,
          limit: 1,
          order: [['price', 'ASC']],
          include: [
            {
              model: product_image,
              attributes: ['image']
            }
          ]
        },
        {
          model: discount,
          as: 'Discounts',
          attributes: ['id', 'discount_value', 'discount_type', 'is_active'],
          through: { attributes: [] },
          where: { is_active: true },
          required: true
        }
      ]
    });

    return productsDiscount;
  }

  // tạo sản phẩm
  async createProduct(productData, files) {
    const t = await sequelize.transaction();
    try {
      const categories = JSON.parse(productData.category_ids);
      const newproduct = await product.create(
        {
          name: productData.name,
          slug: slug(productData.name, { lower: true }),
          description: productData.description,
        },
        {
          transaction: t,
        });

      for (let category of categories) {
        const productCategory = await product_category.create({
          product_id: newproduct.id,
          category_id: category,
        }, { transaction: t })
      }


      let variants = productData.variants
      if (typeof variants === "string") {
        variants = JSON.parse(variants);
      }

      for (let i = 0; i < variants.length; i++) {
        const v = variants[i];

        const newVariants = await product_variants.create({
          product_id: newproduct.id,
          size: v.size,
          style: v.style,
          unit: v.unit,
          flavor: v.flavor,
          price: v.price,
        }, { transaction: t });

        const fileimage = files.filter(v => v.fieldname == `variants_images_${i}`);

        if (fileimage && fileimage.length > 0) {
          const image = [];
          for (let file of fileimage) {
            const url = await uploadService.uploadImage(file.path);
            image.push({
              product_variants_id: newVariants.id,
              image: url,
            });

            const absolutePath = path.resolve(file.path);
            if (fs.existsSync(absolutePath)) {
              fs.unlinkSync(absolutePath);
            }
          }

          const imageUpload = await Promise.all(image)
          await product_image.bulkCreate(imageUpload, { transaction: t })
        }
      }

      await t.commit();
      return {
        message: "Tạo sản phẩm thành công",
        product: newproduct,
      };


    } catch (error) {
      await t.rollback();
      console.error("❌ Lỗi khi tạo sản phẩm:", error);
      throw new Error("Không thể tạo sản phẩm, vui lòng thử lại sau.");
    }
  }

  // lấy chi tiết sản phẩm admin
  async getProductById(id) {
    const result = await product.findOne({
      where: { id: id },
      include: [
        { model: category },
        { model: brand },
        {
          model: product_variants,
          include: [
            {
              model: product_image,
              as: product_image,
            }
          ]
        },
      ],
    });

    if (!result) {
      throw new Error("Không tìm thấy sản phẩm.");
    }
    return result;
  }

  // lấy chi tiết sản phẩm client
  async getProductBySlug(slug) {
    const result = await product.findOne({
      where: { slug },
      include: [
        {
          model: category,
          through: { attributes: [] },
          include: [
            {
              model: category,
              as: "ParentCategory",
              attributes: ["id", "name", "slug"]
            }
          ]
        },
        { model: brand },
        {
          model: product_variants,
          include: [
            {
              model: product_image,
              attributes: ['image'],
            }
          ]
        },
      ],
    });

    if (!result) {
      throw new Error("Không tìm thấy sản phẩm.");
    }
    return result;
  }

  //cập nhật sản phẩm
  async updateProduct(productId, productData, files) {

    const t = await sequelize.transaction();

    try {

      const productToUpdate = await product.findByPk(productId);
      if (!productToUpdate) {
        throw new Error("Không tìm thấy sản phẩm để cập nhật.");
      }


      const productUpdate = {};

      if (productData.name && productData.name.trim() !== "")
        productUpdate.name = productData.name;

      if (productData.description && productData.description.trim() !== "")
        productUpdate.description = productData.description;

      if (productData.category_ids && String(productData.category_ids).trim() !== "")
        productUpdate.category_ids = productData.category_ids;


      const slugValue = productUpdate.name
        ? slug(productUpdate.name, { lower: true })
        : productToUpdate.slug;

      await productToUpdate.update(
        {
          name: productUpdate.name ?? productToUpdate.name,
          slug: slugValue,
          description: productUpdate.description ?? productToUpdate.description,
        },
        { transaction: t }
      );

      // Nếu category_ids là string JSON thì parse
      let categoryIds = productData.category_ids;
      if (typeof categoryIds === 'string') {
        try {
          categoryIds = JSON.parse(categoryIds);
        } catch (err) {
          categoryIds = [];
        }
      }

      // Xóa hết category cũ
      await product_category.destroy({
        where: { product_id: productId },
        transaction: t
      });

      // Thêm category mới
      for (let catId of categoryIds) {
        const id = Number(catId);
        if (!isNaN(id)) {
          await product_category.create(
            {
              product_id: productId,
              category_id: id
            },
            { transaction: t }
          );
        }
      }


      //chuyển đổi thành sting nếu k đúng kiểu
      if (typeof productData.variants === "string") {
        try {
          productData.variants = JSON.parse(productData.variants);
        } catch (err) {
          console.error("❌ Lỗi parse JSON variants:", err);
          productData.variants = [];
        }
      }

      const { Op, where, } = require("sequelize");
      const variantIdsToKeep = JSON.parse(productData.tokeepvariants || "[]");

      const variantsToDelete = await product_variants.findAll({
        where: {
          product_id: productId,
          id: { [Op.notIn]: variantIdsToKeep },
        },
        transaction: t,
      });

      const variantIdsToDelete = variantsToDelete.map(v => v.id);


      if (variantIdsToDelete.length > 0) {
        await product_image.destroy({
          where: {
            product_variants_id: { [Op.in]: variantIdsToDelete },
          },
          transaction: t,
        });
      }


      await product_variants.destroy({
        where: {
          product_id: productId,
          id: { [Op.notIn]: variantIdsToKeep },
        },
        transaction: t,
      });

      const variants = productData.variants || [];

      for (let i = 0; i < variants.length; i++) {
        const v = variants[i];

        // Nếu có id => variant cũ => update
        if (v.id) {
          await product_variants.update(
            {
              size: v.size,
              style: v.style,
              unit: v.unit,
              flavor: v.flavor,
              price: Number(v.price) || 0,
              available_quantity: Number(v.available_quantity) || 0,
            },
            { where: { id: v.id }, transaction: t }
          );


          const oldImages = await product_image.findAll({
            where: { product_variants_id: v.id },
            transaction: t,
          });

          const fileUpload = files.filter(v => v.fieldname === `variants_images_${i}`);
          const image = [];

          if (oldImages.length > 0) {
            if (fileUpload && fileUpload.length > 0) {
              // Xóa ảnh cũ
              await product_image.destroy({
                where: { product_variants_id: v.id },
                transaction: t,
              });
            }
          }

          // Upload ảnh mới
          for (let file of fileUpload) {
            const upload = await uploadService.uploadImage(file.path);
            image.push({
              product_variants_id: v.id,
              image: upload,
            });

            fs.existsSync(file.path) && fs.unlinkSync(file.path);
          }
          // const imageUpload = await Promise.all(image)
          await product_image.bulkCreate(image, { transaction: t })

        } else {
          // Nếu không có id => tạo mới variant
          const newVariant = await product_variants.create(
            {
              product_id: productId,
              size: v.size,
              style: v.style,
              unit: v.unit,
              flavor: v.flavor,
              price: Number(v.price) || 0,
              available_quantity: Number(v.available_quantity) || 0,
            },
            { transaction: t }
          );

          const uploadNew = files.filter(v => v.fieldname == `variants_images_${i}`);
          const imageNew = [];

          if (uploadNew && uploadNew.length > 0) {
            for (let file of uploadNew) {
              const upload = await uploadService.uploadImage(file.path);
              imageNew.push({
                product_variants_id: newVariant.id,
                image: upload,
              })

              fs.existsSync(file.path) && fs.unlinkSync(file.path);
            }
          }

          await product_image.bulkCreate(imageNew, { transaction: t });
        }
      }

      await t.commit();

      return { message: "Cập nhật sản phẩm thành công!" };
    } catch (error) {
      await t.rollback();
      console.error("🔥 Lỗi service cập nhật sản phẩm:", error.message);
      console.error(error.stack);
      throw error;
    }
  }

  //xóa mềm sản phẩm
  async softDelete(id) {
    const t = await sequelize.transaction();
    try {
      await product.update({ is_deleted: true }, { where: { id }, transaction: t });

      const variants = await product_variants.findAll({ where: { product_id: id }, transaction: t });

      for (const variant of variants) {
        await product_variants.update(
          { is_deleted: true },
          { where: { id: variant.id }, transaction: t }
        );

        await product_image.update(
          { is_deleted: true },
          { where: { product_variants_id: variant.id }, transaction: t }
        );
      }

      await t.commit();
      return true; // ✅ chỉ trả về kết quả
    } catch (error) {
      await t.rollback();
      console.error(error);
      return false; // hoặc throw error để controller xử lý
    }
  }

  //lấy sản phẩm xóa mềm
  async getSoftDeleted() {
    try {
      const getdeleted = await product.findAll({
        where: { is_deleted: true },
        include: [
          {
            model: product_variants,
            limit: 1,
            include: [
              {
                model: product_image,
                attributes: ['id', 'image'],
                limit: 1
              }
            ]
          },
        ]
      })

      if (!getdeleted) {
        return null;
      }

      return getdeleted;
    } catch (error) {
      return error;
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
}

module.exports = new ProductService();
