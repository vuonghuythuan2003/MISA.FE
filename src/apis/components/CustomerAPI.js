import api from '@/apis/config/APIConfig.js';
import BaseAPI from '@/apis/base/BaseAPI.js';

/**
 * Customer API class
 * Quản lý các API call liên quan đến khách hàng
 */
class CustomerAPI extends BaseAPI {
    constructor() {
        super('customer');
    }

    /**
     * Sinh mã khách hàng mới
     * @returns {Promise} Response chứa mã khách hàng mới
     */
    generateNewCode() {
        return api.get(`/${this.controller}/NewCode`);
    }

    // Header dùng chung cho các API upload file
    get multipartHeaders() {
        return {
            'Content-Type': 'multipart/form-data'
        };
    }

    /**
     * Nhập khách hàng từ file CSV
     * @param {File} file - File CSV
     * @returns {Promise} Response từ API
     */
    importFromCsv(file) {
        const formData = new FormData();
        formData.append('file', file);
        return api.post(`/${this.controller}/import`, formData, {
            headers: this.multipartHeaders
        });
    }

    /**
     * Xuất danh sách khách hàng ra file CSV
     * @param {object} params - Tham số lọc và sắp xếp (keyword, customerName, sortColumn, sortDirection, ...)
     * @returns {Promise} Response chứa file CSV
     */
    exportToCsv(params) {
        return api.get(`/${this.controller}/export`, {
            params,
            responseType: 'blob' // Để nhận file
        });
    }

    /**
     * Tạo mới khách hàng với upload ảnh đại diện
     * @param {FormData} formData - Form data chứa file ảnh và thông tin khách hàng
     * @returns {Promise} Response từ API
     */
    createWithAvatar(formData) {
        return api.post(`/${this.controller}/with-avatar`, formData, {
            headers: this.multipartHeaders
        });
    }

    /**
     * Cập nhật khách hàng với upload ảnh đại diện mới
     * @param {string|number} id - ID khách hàng
     * @param {FormData} formData - Form data chứa file ảnh và thông tin khách hàng
     * @returns {Promise} Response từ API
     */
    updateWithAvatar(id, formData) {
        return api.put(`/${this.controller}/${id}/with-avatar`, formData, {
            headers: this.multipartHeaders
        });
    }

    /**
     * Gán loại khách hàng cho nhiều bản ghi
     * @param {object} payload - { customerIds: Array<string>, customerType: string }
     * @returns {Promise} Response từ API
     */
    assignType(payload) {
        return api.post(`/${this.controller}/assign-type`, payload);
    }

    /**
     * Xóa nhiều khách hàng
     * @param {Array<string>} ids - Mảng ID khách hàng
     * @returns {Promise} Response từ API
     */
    deleteMany(ids) {
        return api.post(`/${this.controller}/delete-many`, ids);
    }
}

export default new CustomerAPI();