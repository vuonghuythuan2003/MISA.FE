
# MISA CRM Frontend

Đây là dự án frontend của hệ thống MISA CRM, sử dụng Vue 3, Vite và Ant Design Vue.

## Cấu trúc thư mục

- `src/` - Mã nguồn chính
  - `components/` - Các component dùng chung (MsTable, MsButton, MsUpload, ...)
  - `views/` - Các trang chính (customer, opportunity, ...)
  - `apis/` - Giao tiếp API backend
  - `assets/` - Ảnh, style, tài nguyên tĩnh
  - `layouts/` - Layout tổng thể
  - `router/` - Định tuyến trang
  - `utils/` - Hàm tiện ích
- `public/` - File tĩnh, favicon
- `index.html` - File HTML gốc
- `vite.config.js` - Cấu hình Vite
- `package.json` - Thông tin package, scripts

## Cài đặt

```bash
npm install
```

## Chạy dự án

```bash
npm run dev
```

## Build production

```bash
npm run build
```

## Một số lệnh khác

- `npm run lint` - Kiểm tra code style
- `npm run preview` - Xem thử bản build

## Tính năng chính

- Quản lý khách hàng, cơ hội
- Import/Export file Excel
- Phân trang, tìm kiếm, lọc, sắp xếp
- Thông báo realtime (toastr)
- Giao diện hiện đại, responsive

## Công nghệ sử dụng

- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Ant Design Vue](https://www.antdv.com/)
- [Axios](https://axios-http.com/) (gọi API)
- [Pinia](https://pinia.vuejs.org/) (quản lý state)
- [Sass/CSS3] (style)

## Liên hệ

- Người phát triển : Vương Huy Thuận
- Email: vuonghuythuan1@gmail.com

## Kết nối backend

- Sửa URL API trong file `src/apis/base/BaseAPI.js` nếu backend chạy port khác.
- Mặc định gọi tới: `http://localhost:5246/api/v1/Customer`

## Định dạng file Import CSV

```
FullName,Phone,Email,CustomerShippingAddress,CustomerType
Nguyen Van A,0901234567,email@test.com,123 ABC Q1 HCM,Individual
```

## Đóng góp & liên hệ

- Tác giả: vuonghuythuan2003 (12/2024)
- Đóng góp: tạo pull request hoặc liên hệ trực tiếp.