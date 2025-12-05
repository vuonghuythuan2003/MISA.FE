<script setup>
import { ref, computed } from "vue";
import {
  LeftOutlined,
  VerticalRightOutlined,
  RightOutlined,
  VerticalLeftOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";
import MsPagination from "@/components/ms-paginatuion/MsPagination.vue";
import MsButton from "@/components/ms-button/MsButton.vue";

// Dữ liệu phân trang
const currentPage = ref(1);
const totalPages = ref(22);
const pageSize = ref(100);
const totalRecords = ref(4690);
const totalDebt = ref(0);

// Dòng đang được di chuột vào
const hoveredRowId = ref(null);

// Xử lý thay đổi trang
const handlePageChange = (page) => {
  currentPage.value = page;
  console.log("Đã chuyển sang trang:", page);
};

// Xử lý thay đổi số bản ghi trên trang
const handlePageSizeChange = (size) => {
  pageSize.value = size;
  console.log("Đã thay đổi số bản ghi trên trang:", size);
};

// Biến lưu trữ các ID khách hàng được chọn
const selectedIds = ref(new Set());

// Kiểm tra tất cả đã được chọn chưa
const isAllSelected = computed(() => {
  return customers.value.length > 0 && selectedIds.value.size === customers.value.length;
});

// Bật/tắt chọn một khách hàng
const toggleSelect = (id) => {
  if (selectedIds.value.has(id)) {
    selectedIds.value.delete(id);
  } else {
    selectedIds.value.add(id);
  }
  // Kích hoạt cập nhật giao diện
  selectedIds.value = new Set(selectedIds.value);
};

// Bật/tắt chọn tất cả khách hàng
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedIds.value = new Set();
  } else {
    selectedIds.value = new Set(customers.value.map(c => c.id));
  }
};

// Xử lý xóa khách hàng
const handleDelete = (customer) => {
  console.log('Đang xóa khách hàng:', customer);
  // Gọi API xóa khách hàng tại đây
  if (confirm(`Bạn có chắc muốn xóa khách hàng "${customer.name}"?`)) {
    customers.value = customers.value.filter(c => c.id !== customer.id);
  }
};

const headers = [
  { key: "type", label: "Loại khách hàng", width: "165px" },
  { key: "code", label: "Mã khách hàng ", width: "250px" },
  { key: "name", label: "Tên khách hàng", width: "320px" },
  { key: "taxCode", label: "Mã số thuế", width: "150px" },
  { key: "address", label: "Địa chỉ (Giao hàng)", width: "197px" },
  { key: "phone", label: "Điện thoại", width: "150px" },
  { key: "email", label: "Email", width: "210px" },
  { key: "lastDate", label: "Ngày mua hàng gần nhất", width: "217px" },
  { key: "goodsCode", label: "Hàng hóa đã mua", width: "207px" },
  { key: "goodsName", label: "Tên hàng hóa đã mua", width: "197px" },
];

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
</script>

<template>
  <!-- Bố cục bảng khách hàng  -->
  <div class="customer-layout">
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <!-- Cột Checkbox -->
            <th class="th-checkbox ">
              <span 
                class="ms-checkbox" 
                :class="{ checked: isAllSelected }"
                @click="toggleSelectAll"
              ></span>
            </th>
            <!-- Các cột dữ liệu -->
            <th
              v-for="(header, index) in headers"
              :key="index"
              :style="{ width: header.width || 'auto' }"
              class="th-data"
            >
              {{ header.label }}
            </th>
            <!-- Cột trống cuối cùng để fill layout -->
            <th class="th-actions"></th>
          </tr>
        </thead>
        
        <tbody>
          <tr 
            v-for="customer in customers" 
            :key="customer.id"
            @mouseenter="hoveredRowId = customer.id"
            @mouseleave="hoveredRowId = null"
          >
            <td class="td-checkbox">
              <span 
                class="ms-checkbox" 
                :class="{ checked: selectedIds.has(customer.id) }"
                @click="toggleSelect(customer.id)"
              ></span>
            </td>

            <td class="text-dark">{{ customer.type }}</td>

            <td class="text-left">{{ customer.code }}</td>

            <td class="text-left">{{ customer.name }}</td>

            <td class="text-dark">{{ customer.taxCode }}</td>

            <td class="text-dark" :title="customer.address">
              {{ customer.address }}
            </td>

            <td class="text-left text-green" v-if="customer.phone !== '-'">
              <div class="flex-row align-center gap-4">
                <span class="icon-default-background icon-phone"></span>
                {{ customer.phone }}
              </div>
            </td>
            <td class="text-left" v-else>-</td>
            <td class="text-left">{{ customer.email }}</td>

            <td class="text-dark">{{ customer.lastDate }}</td>

            <td class="text-dark">{{ customer.goodsCode }}</td>

            <td class="text-dark" :title="customer.goodsName">
              {{ customer.goodsName }}
            </td>

            <!-- Cột hành động - hiển thị khi hover -->
            <td class="td-actions">
              <div v-show="hoveredRowId === customer.id" class="action-buttons">
                <MsButton 
                  type="icon-only-danger" 
                  title="Xóa"
                  @click.stop="handleDelete(customer)"
                >
                  <template #icon-left>
                    <DeleteOutlined />
                  </template>
                </MsButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Phần phân trang  -->
    <MsPagination
      :total-records="totalRecords"
      :total-debt="totalDebt"
      :show-debt="true"
      :page-size="pageSize"
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-change="handlePageChange"
      @page-size-change="handlePageSizeChange"
    >
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
    </MsPagination>
  </div>
</template>

<style scoped>
.customer-layout {
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
  margin-top: 1px;
  border-top: 1px solid #d3d7de;
  padding: 0;
}
.table-container {
  width: 100%;
  max-height: calc(100vh - 160px);
  overflow: auto;
}
table {
  width: 100%;
  table-layout: fixed;
  font-family: "Inter", Arial, Helvetica, sans-serif;
  font-size: 13px;
  border-collapse: collapse;
}

thead {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #fff;
}
tr {
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
}
.ms-checkbox {
  -webkit-transform: translateY(-50%);
  height: 16px;
  width: 16px;
  background-color: #fff;
  border: 1px solid #7c869c;
  border-radius: 4px;
  accent-color: #4262f0;
  margin-left: 40px;
  position: absolute;
  top: 50%;
  left: 0;
  background-clip: padding-box;
  cursor: pointer;
  display: inline-block;
}

.ms-checkbox:hover {
  border-color: #4262f0;
}

.ms-checkbox.checked {
  background-color: #4262f0;
  border-color: #4262f0;
}

.ms-checkbox.checked::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: translate(-50%, -60%) rotate(45deg);
}
th {
  height: 40px;
  border-bottom: 1px solid #d3d7de;
  text-align: left;
  color: #1f2229;
  white-space: nowrap;
}
.th-data,
td {
  overflow: hidden;
  text-overflow: ellipsis;
  height: 40px;
  white-space: nowrap;
}
tbody tr:hover {
  background-color: #e7ebfd;
} 
.text-left {
  text-align: left;
  color: #0f2fbd;
  font-size: 13px;
  font-family: "Inter", Arial, Helvetica, sans-serif;
}
.header-dark {
  color: #1f2229;
}
.text-dark {
  color: #1f2229;
}
.th-checkbox,
.td-checkbox {
  width: 72px;
  text-align: center;
  position: sticky;
  left: 0;
  background-color: inherit;
  z-index: 2;
  border-right: none;
  padding-right: 30px;;
}
/* Style cho các icon trong phân trang */
:deep(.nav-icon) {
  color: #bbbec6;
}
:deep(.nav-icon svg) {
  width: 16px;
  height: 16px;
}
.icon-phone{
  background-color: #ffffff;
  border-radius: 50%;
  margin-right: 6px;
}

/* Cột hành động */
.th-actions,
.td-actions {
  width: 80px;
  min-width: 80px;
  position: sticky;
  right: 0;
  background-color: inherit;
  z-index: 2;
  text-align: center;
}

.th-actions {
  background-color: #fff;
}


.action-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
</style>
