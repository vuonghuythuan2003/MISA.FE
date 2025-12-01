<script setup>
import { ref } from "vue";
import MsTable from "../../components/ms-table/MsTable.vue";
import {
  LeftOutlined,
  VerticalRightOutlined,
  RightOutlined,
  VerticalLeftOutlined,
} from "@ant-design/icons-vue";

// Cấu hình các cột
const fields = [
  { key: "type", label: "Loại khách hàng", width: "165px", type: "text" },
  { key: "code", label: "Mã khách hàng", width: "250px", type: "link" },
  { key: "name", label: "Tên khách hàng", width: "320px", type: "link" },
  { key: "taxCode", label: "Mã số thuế", width: "150px", type: "text" },
  { key: "address", label: "Địa chỉ (Giao hàng)", width: "197px", type: "text" },
  { key: "phone", label: "Điện thoại", width: "150px", type: "phone" },
  { key: "email", label: "Email", width: "210px", type: "link" },
  { key: "lastDate", label: "Ngày mua hàng gần nhất", width: "217px", type: "text" },
  { key: "goodsCode", label: "Hàng hóa đã mua", width: "207px", type: "text" },
  { key: "goodsName", label: "Tên hàng hóa đã mua", width: "197px", type: "text" },
];

// Danh sách ID được chọn
const selectedIds = ref([]);

// Dữ liệu khách hàng
const customers = ref([
  {
    id: 1,
    type: "NBH01",
    code: "KH001-testvnquan3",
    name: "Công ty TNHH Hoa Mai",
    taxCode: "-",
    address: "-",
    phone: "-",
    lastDate: "-",
    goodsCode: "-",
    goodsName: "-",
  },
  {
    id: 2,
    type: "-",
    code: "KH0000100100216265210",
    name: "Vương Long",
    taxCode: "-",
    address: "-",
    phone: "055555553...",
    lastDate: "-",
    goodsCode: "-",
    goodsName: "-",
  },
  {
    id: 3,
    type: "-",
    code: "KH0000100100216265209",
    name: "Silkweb",
    taxCode: "-",
    address: "N/A",
    phone: "-",
    lastDate: "-",
    goodsCode: "-",
    goodsName: "-",
  },
  {
    id: 4,
    type: "-",
    code: "KH0000100100216265208",
    name: "CÔNG TY CỔ PHẦN SẢN XUẤT KINH DOANH...",
    taxCode: "0100101234",
    address: "Số 5 ngõ 31 phố Hoàng...",
    phone: "0904165344",
    lastDate: "-",
    goodsCode: "-",
    goodsName: "-",
  },
  {
    id: 5,
    type: "NBH01",
    code: "KH001-testnhanh-111",
    name: "Công ty TNHH Hoa Mai",
    taxCode: "-",
    address: "-",
    phone: "-",
    lastDate: "-",
    goodsCode: "-",
    goodsName: "-",
  },
  {
    id: 6,
    type: "-",
    code: "KH0000100100216265211",
    name: "Ngọc Anh",
    taxCode: "-",
    address: "-",
    phone: "-",
    lastDate: "22/10/2025",
    goodsCode: "-",
    goodsName: "-",
  },
  {
    id: 7,
    type: "LKHA",
    code: "KH10010021626224",
    name: "HỘ KINH DOANH TOTO BEAUTY",
    taxCode: "0109763539-001",
    address: "Số 152, đường 2, Xã Phủ...",
    phone: "0974526333",
    lastDate: "22/10/2025",
    goodsCode: "PPP00, 40990...",
    goodsName: "123456789, 24 Gran...",
  },
  {
    id: 8,
    type: "LKHA",
    code: "KH10010021626224",
    name: "HỘ KINH DOANH TOTO BEAUTY",
    taxCode: "0109763539-001",
    address: "Số 152, đường 2, Xã Phủ...",
    phone: "0974526333",
    lastDate: "22/10/2025",
    goodsCode: "PPP00, 40990...",
    goodsName: "123456789, 24 Gran...",
  },
  {
    id: 9,
    type: "LKHA",
    code: "KH10010021626224",
    name: "HỘ KINH DOANH TOTO BEAUTY",
    taxCode: "0109763539-001",
    address: "Số 152, đường 2, Xã Phủ...",
    phone: "0974526333",
    lastDate: "22/10/2025",
    goodsCode: "PPP00, 40990...",
    goodsName: "123456789, 24 Gran...",
  },
  {
    id: 10,
    type: "LKHA",
    code: "KH10010021626224",
    name: "HỘ KINH DOANH TOTO BEAUTY",
    taxCode: "0109763539-001",
    address: "Số 152, đường 2, Xã Phủ...",
    phone: "0974526333",
    email: "vuonghuythuan1@gmail.com",
    lastDate: "22/10/2025",
    goodsCode: "PPP00, 40990...",
    goodsName: "123456789, 24 Gran...",
  },
  {
    id: 11,
    type: "LKHA",
    code: "KH10010021626224",
    name: "HỘ KINH DOANH TOTO BEAUTY",
    taxCode: "0109763539-001",
    address: "Số 152, đường 2, Xã Phủ...",
    phone: "0974526333",
    email: "vuonghuythuan1@gmail.com",
    lastDate: "22/10/2025",
    goodsCode: "PPP00, 40990...",
    goodsName: "123456789, 24 Gran...",
  },
  {
    id: 12,
    type: "LKHA",
    code: "KH10010021626224",
    name: "HỘ KINH DOANH TOTO BEAUTY",
    taxCode: "0109763539-001",
    address: "Số 152, đường 2, Xã Phủ...",
    phone: "0974526333",
    email: "vuonghuythuan1@gmail.com",
    lastDate: "22/10/2025",
    goodsCode: "PPP00, 40990...",
    goodsName: "123456789, 24 Gran...",
  },
  {
    id: 13,
    type: "LKHA",
    code: "KH10010021626224",
    name: "HỘ KINH DOANH TOTO BEAUTY",
    taxCode: "0109763539-001",
    address: "Số 152, đường 2, Xã Phủ...",
    phone: "0974526333",
    email: "vuonghuythuan1@gmail.com",
    lastDate: "22/10/2025",
    goodsCode: "PPP00, 40990...",
    goodsName: "123456789, 24 Gran...",
  },
]);

// Xử lý sự kiện double click vào dòng
const handleRowDblClick = (row) => {
  console.log("Double clicked:", row);
  // Có thể navigate đến trang chỉnh sửa
};

// Xử lý thay đổi selection
const handleSelectionChange = (ids) => {
  console.log("Selected IDs:", ids);
};

// Xử lý thay đổi trang
const handlePageChange = (page) => {
  console.log("Page changed:", page);
};
</script>

<template>
  <!-- Bố cục bảng khách hàng -->
  <MsTable
    :fields="fields"
    :rows="customers"
    v-model="selectedIds"
    :selectable="true"
    :show-pagination="true"
    :total-records="4690"
    :total-debt="0"
    :show-debt="true"
    :page-size="100"
    :current-page="1"
    :total-pages="22"
    @row-dblclick="handleRowDblClick"
    @selection-change="handleSelectionChange"
    @page-change="handlePageChange"
  >
    <!-- Slot cho icon phân trang -->
    <template #first-icon>
      <VerticalRightOutlined />
    </template>
    <template #prev-icon>
      <LeftOutlined />
    </template>
    <template #next-icon>
      <RightOutlined />
    </template>
    <template #last-icon>
      <VerticalLeftOutlined />
    </template>
  </MsTable>
</template>

<style scoped>
/* Ghi đè style nếu cần */
</style>
