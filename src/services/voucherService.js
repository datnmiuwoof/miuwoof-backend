
const { discount } = require("../models")

class voucherService {
    async getVouchers({ page = 1, limit = 10, status }) {
        const offset = (page - 1) * limit;

        const where = {};

        // status filter
        if (status !== undefined && status !== 'all' && status !== '') {
            where.is_active = status === '1';
        }

        const { rows, count } = await discount.findAndCountAll({
            where,
            limit: Number(limit),
            offset,
            order: [['createdAt', 'DESC']]
        });

        return {
            data: rows,
            pagination: {
                total: count,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(count / limit)
            }
        };
    }


    async addVoucher(data) {
        try {
            const voucherData = {
                discount_name: data.discount_name,
                discount_value: data.discount_value,
                discount_type: data.discount_type,
                is_active: data.is_active || true, // mặc định active
                min_order_value: data.min_order_value || null,
                max_order_value: data.max_order_value || null,
                used_quantity: data.used_quantity || 0,
                description: data.description || null
            };

            if (data.discount_type === 0) {
                voucherData.code = data.code;
                voucherData.start_date = data.start_date;
                voucherData.end_date = data.end_date;
            }

            const newVoucher = await discount.create(voucherData);
            return newVoucher;
        } catch (error) {
            throw error;
        }
    }

    // Lấy chi tiết voucher theo id
    async getVoucherById(id) {
        try {
            const voucher = await discount.findOne({
                where: { id }
            });

            if (!voucher) {
                throw new Error('Voucher không tồn tại');
            }

            return voucher;
        } catch (error) {
            throw error;
        }
    }


    async updateVoucher(id, data) {
        try {
            const voucher = await discount.findByPk(id);

            if (!voucher) {
                throw new Error('Voucher không tồn tại');
            }

            const updateData = {
                discount_name: data.discount_name,
                description: data.description || null,
                discount_value: data.discount_value,
                discount_type: data.discount_type,
                is_active: data.is_active,
                min_order_value: data.min_order_value || null,
                max_order_value: data.max_order_value || null
            };

            // Voucher theo CODE
            if (data.discount_type === 0) {
                if (!data.code || !data.start_date || !data.end_date) {
                    throw new Error('Thiếu dữ liệu bắt buộc cho voucher theo code');
                }

                updateData.code = data.code;
                updateData.start_date = data.start_date;
                updateData.end_date = data.end_date;
            }

            // Voucher thường (không code)
            if (data.discount_type === 1) {
                updateData.code = null;
                updateData.start_date = null;
                updateData.end_date = null;
            }

            await voucher.update(updateData);
            return voucher;

        } catch (error) {
            throw error;
        }
    }

    async deleteVoucher(id) {
        try {
            const result = await discount.destroy({ where: { id } });

            if (!result) {
                return false;
            }

            return true;
        } catch (error) {
            return false;
        }
    }

    async getActiveProductDiscounts() {
        return await discount.findAll({
            where: {
                is_active: true,
                discount_type: 1
            },
            attributes: [
                'id',
                'discount_name',
                'discount_value',
                'discount_type'
            ],
            order: [['createdAt', 'DESC']]
        });
    }

    async applyDiscount(code, subtotal) {
        if (!code || !subtotal) {
            throw new Error('Thiếu dữ liệu');
        }

        const voucher = await discount.findOne({
            where: {
                is_active: true,
                discount_type: 0
            }
        });

        if (!voucher) {
            throw new Error('Mã giảm giá không tồn tại');
        }

        // min order
        if (voucher.min_order_value && subtotal < voucher.min_order_value) {
            throw new Error(
                `Đơn hàng tối thiểu ${Number(voucher.min_order_value).toLocaleString('vi-VN')}₫`
            );
        }

        // tính % giảm
        let discountAmount = Math.floor(subtotal * voucher.discount_value / 100);

        // cap giảm tối đa
        if (voucher.max_order_value && discountAmount > voucher.max_order_value) {
            discountAmount = voucher.max_order_value;
        }

        return {
            id: voucher.id,
            code: voucher.code,
            discount_amount: discountAmount
        };
    }



}

module.exports = new voucherService();
