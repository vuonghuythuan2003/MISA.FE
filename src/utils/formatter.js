/**
 * Các hàm định dạng dữ liệu
 */

/**
 * Định dạng số với dấu phân cách hàng nghìn
 * @param {number|string} value - Giá trị cần định dạng
 * @returns {string} - Chuỗi số đã định dạng
 */
export const formatNumber = (value) => {
  if (value === null || value === undefined || value === '') {
    return '0';
  }
  const num = Number(value);
  if (isNaN(num)) {
    return value;
  }
  return num.toLocaleString('vi-VN');
};

/**
 * Định dạng ngày tháng
 * @param {string|Date} value - Giá trị ngày cần định dạng
 * @param {string} format - Định dạng đầu ra (mặc định: 'dd/MM/yyyy')
 * @returns {string} - Chuỗi ngày đã định dạng
 */
export const formatDate = (value, format = 'dd/MM/yyyy') => {
  if (!value) {
    return '-';
  }
  
  let date;
  if (value instanceof Date) {
    date = value;
  } else {
    date = new Date(value);
  }
  
  if (isNaN(date.getTime())) {
    return value; // Trả về giá trị gốc nếu không parse được
  }
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return format
    .replace('dd', day)
    .replace('MM', month)
    .replace('yyyy', year);
};

/**
 * Định dạng văn bản (xử lý giá trị rỗng)
 * @param {any} value - Giá trị cần định dạng
 * @returns {string} - Chuỗi đã xử lý
 */
export const formatText = (value) => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  return String(value);
};

/**
 * Định dạng tiền tệ
 * @param {number|string} value - Giá trị cần định dạng
 * @param {string} currency - Đơn vị tiền tệ (mặc định: 'VND')
 * @returns {string} - Chuỗi tiền tệ đã định dạng
 */
export const formatCurrency = (value, currency = 'VND') => {
  if (value === null || value === undefined || value === '') {
    return '0 ' + currency;
  }
  const num = Number(value);
  if (isNaN(num)) {
    return value;
  }
  return num.toLocaleString('vi-VN') + ' ' + currency;
};

/**
 * Định dạng phần trăm
 * @param {number|string} value - Giá trị cần định dạng
 * @param {number} decimals - Số chữ số thập phân (mặc định: 2)
 * @returns {string} - Chuỗi phần trăm đã định dạng
 */
export const formatPercent = (value, decimals = 2) => {
  if (value === null || value === undefined || value === '') {
    return '0%';
  }
  const num = Number(value);
  if (isNaN(num)) {
    return value;
  }
  return num.toFixed(decimals) + '%';
};

/**
 * Cắt ngắn chuỗi với dấu "..."
 * @param {string} value - Chuỗi cần cắt
 * @param {number} maxLength - Độ dài tối đa
 * @returns {string} - Chuỗi đã cắt
 */
export const truncateText = (value, maxLength = 50) => {
  if (!value) {
    return '-';
  }
  const str = String(value);
  if (str.length <= maxLength) {
    return str;
  }
  return str.substring(0, maxLength) + '...';
};

/**
 * Định dạng số điện thoại Việt Nam
 * @param {string} phone - Số điện thoại
 * @returns {string} - Số điện thoại đã định dạng
 */
export const formatPhone = (phone) => {
  if (!phone) {
    return '-';
  }
  // Loại bỏ ký tự không phải số
  const cleaned = String(phone).replace(/\D/g, '');
  
  // Định dạng theo mẫu: 0xxx xxx xxx
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  
  return phone;
};
