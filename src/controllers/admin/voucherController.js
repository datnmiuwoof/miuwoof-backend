const voucherService = require('../../services/voucherService')
class voucherController {
    async getVoucher(req, res) {
        try {
            const { page, limit, status = 'all' } = req.query;

            const result = await voucherService.getVouchers({
                page,
                limit,
                status
            });

            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi lấy voucher' });
        }
    }


    async addVoucher(req, res) {
        try {
            const data = req.body;

            // Kiểm tra discount_type
            if (data.discount_type === 0) {
                const requiredFields = ['discount_name', 'discount_value', 'start_date', 'end_date', 'code'];
                for (const field of requiredFields) {
                    if (!data[field]) {
                        return res.status(400).json({ message: `${field} là bắt buộc khi discount_type = 0` });
                    }
                }
            } else if (data.discount_type === 1) {
                if (!data.discount_value) {
                    return res.status(400).json({ message: `discount_value là bắt buộc khi discount_type = 1` });
                }
            } else {
                return res.status(400).json({ message: "discount_type không hợp lệ" });
            }

            const result = await voucherService.addVoucher(data);
            res.status(201).json({ message: "Voucher tạo thành công", voucher: result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi server", error });
        }
    }

    async getVoucherId(req, res) {
        try {
            const { id } = req.params;

            const voucher = await voucherService.getVoucherById(id);

            res.status(200).json({
                message: 'Lấy chi tiết voucher thành công',
                voucher
            });
        } catch (error) {
            console.error(error);
            res.status(404).json({
                message: error.message || 'Lỗi khi lấy voucher'
            });
        }
    }

    async updateVoucher(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;

            const voucher = await voucherService.updateVoucher(id, data);

            res.status(200).json({
                message: 'Cập nhật voucher thành công',
                voucher
            });
        } catch (error) {
            console.error(error);
            res.status(400).json({
                message: error.message || 'Cập nhật voucher thất bại'
            });
        }
    }

    async deleteVoucher(req, res) {
        try {
            const { id } = req.params;

            const result = await voucherService.deleteVoucher(id);

            if (!result) {
                return res.status(400).json({ message: 'không xóa được nha' })
            }

            res.status(200).json({ message: "xóa thành công" });
        } catch (error) {
            return res.status(400).json(error)
        }
    }


    async getProductDiscountOptions(req, res) {
        try {
            const discounts = await voucherService.getActiveProductDiscounts();
            res.status(200).json(discounts);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi lấy voucher sản phẩm' });
        }
    }

    async applyDiscount(req, res) {
        console.log('BODY:', req.body);
        try {
            const { code, subtotal } = req.body;

            const result = await voucherService.applyDiscount(code, subtotal);

            return res.json(result);

        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    };

}

module.exports = new voucherController();