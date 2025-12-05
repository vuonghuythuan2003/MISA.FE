import api from '@/apis/config/APIConfig.js';

/**
 * Base API class chứa các phương thức CRUD cơ bản
 * Được kế thừa bởi các API class khác (CustomerAPI, ProductAPI, ...)
 */
export default class BaseAPI {
    /**
     * Constructor
     * @param {string} controller - Tên controller (ví dụ: 'customer', 'product')
     */
    constructor(controller) {
        this.controller = controller;
    }

    /**
     * Lấy tất cả bản ghi
     * @returns {Promise} Response từ API
     */
    getAll() {
        return api.get(`/${this.controller}`);
    }

    /**
     * Lấy bản ghi theo ID
     * @param {string|number} id - ID của bản ghi
     * @returns {Promise} Response từ API
     */
    getById(id) {
        return api.get(`/${this.controller}/${id}`);
    }

    /**
     * Lấy danh sách bản ghi với phân trang, sắp xếp, lọc, tìm kiếm
     * @param {object} params - Tham số query (pageNumber, pageSize, sortColumn, sortDirection, keyword, ...)
     * @returns {Promise} Response từ API
     */
    getPaging(params) {
        return api.get(`/${this.controller}/paging`, { params });
    }

    /**
     * Tạo mới bản ghi
     * @param {object} payload - Dữ liệu gửi lên
     * @returns {Promise} Response từ API
     */
    create(payload) {
        return api.post(`/${this.controller}`, payload);
    }

    /**
     * Cập nhật bản ghi
     * @param {string|number} id - ID của bản ghi cần cập nhật
     * @param {object} payload - Dữ liệu cập nhật
     * @returns {Promise} Response từ API
     */
    update(id, payload) {
        return api.put(`/${this.controller}/${id}`, payload);
    }

    /**
     * Xóa bản ghi (soft delete)
     * @param {string|number} id - ID của bản ghi cần xóa
     * @returns {Promise} Response từ API
     */
    delete(id) {
        return api.delete(`/${this.controller}/${id}`);
    }
}
