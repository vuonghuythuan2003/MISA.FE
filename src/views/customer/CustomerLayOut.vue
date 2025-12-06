<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  LeftOutlined,
  VerticalRightOutlined,
  RightOutlined,
  VerticalLeftOutlined,
  DeleteOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons-vue";
import toastr from "toastr";
import MsPagination from "@/components/ms-paginatuion/MsPagination.vue";
import MsButton from "@/components/ms-button/MsButton.vue";
import customerAPI from "@/apis/components/CustomerAPI.js";

// Helper
const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("vi-VN");
};

// Router
const router = useRouter();
const route = useRoute();

// Props & emits
const props = defineProps({
  searchKeyword: {
    type: String,
    default: "",
  },
  refreshKey: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["selection-change"]);

// State
const currentPage = ref(1);
const totalPages = ref(0);
const pageSize = ref(100);
const totalRecords = ref(0);
const totalDebt = ref(0);
const isLoading = ref(false);
const errorMessage = ref("");

const hoveredRowId = ref(null);
const hoveredHeaderKey = ref(null);

const sortColumn = ref("customerCode");
const sortDirection = ref("desc");

const searchKeyword = ref("");
const filterCustomerName = ref("");
const filterCustomerEmail = ref("");
const filterCustomerPhoneNumber = ref("");

const customers = ref([]);
const headers = [
  { key: "customerType", label: "Loại khách hàng", width: "165px" },
  { key: "customerCode", label: "Mã khách hàng ", width: "250px" },
  { key: "customerName", label: "Tên khách hàng", width: "300px" },
  { key: "customerTaxCode", label: "Mã số thuế", width: "180px" },
  { key: "customerShippingAddress", label: "Địa chỉ (Giao hàng)", width: "200px" },
  { key: "customerPhoneNumber", label: "Điện thoại", width: "200px" },
  { key: "customerEmail", label: "Email", width: "210px" },
  { key: "lastPurchaseDate", label: "Ngày mua hàng gần nhất", width: "217px" },
  { key: "purchasedItemCode", label: "Hàng hóa đã mua", width: "207px" },
  { key: "purchasedItemName", label: "Tên hàng hóa đã mua", width: "197px" },
];

const selectedIds = ref(new Set());
const selectedItems = ref([]);

// Computed
const isAllSelected = computed(
  () => customers.value.length > 0 && selectedIds.value.size === customers.value.length
);

// Selection handlers
const emitSelection = () => {
  const idsArray = Array.from(selectedIds.value);
  selectedItems.value = customers.value.filter((c) => selectedIds.value.has(c.customerId));
  emit("selection-change", { ids: idsArray, items: selectedItems.value });
};

const toggleSelect = (id) => {
  if (selectedIds.value.has(id)) {
    selectedIds.value.delete(id);
  } else {
    selectedIds.value.add(id);
  }
  selectedIds.value = new Set(selectedIds.value);
  emitSelection();
};

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedIds.value = new Set();
  } else {
    selectedIds.value = new Set(customers.value.map((c) => c.customerId));
  }
  emitSelection();
};

// Data fetcher
const fetchCustomers = async () => {
  try {
    isLoading.value = true;
    const params = {
      pageNumber: currentPage.value,
      pageSize: pageSize.value,
    };

    if (sortColumn.value) {
      params.sortColumn = sortColumn.value;
      params.sortDirection = sortDirection.value;
    }

    if (searchKeyword.value.trim()) {
      params.keyword = searchKeyword.value.trim();
    }
    if (filterCustomerEmail.value.trim()) {
      params.customerEmail = filterCustomerEmail.value.trim();
    }
    if (filterCustomerPhoneNumber.value.trim()) {
      params.customerPhoneNumber = filterCustomerPhoneNumber.value.trim();
    }

    const response = await customerAPI.getPaging(params);

    if (response.data && response.data.data) {
      customers.value = response.data.data.map((customer) => ({
        id: customer.customerId,
        customerId: customer.customerId,
        type: customer.customerType || "-",
        code: customer.customerCode,
        name: customer.customerName,
        email: customer.customerEmail || "-",
        phone: customer.customerPhoneNumber || "-",
        taxCode: customer.customerTaxCode || "-",
        address: customer.customerShippingAddress || "-",
        shippingAddress: customer.customerShippingAddress || "-",
        lastDate: formatDate(customer.lastPurchaseDate),
        goodsCode: customer.purchasedItemCode || "-",
        goodsName: customer.purchasedItemName || "-",
      }));

      if (response.data.meta) {
        currentPage.value = response.data.meta.page || 1;
        pageSize.value = response.data.meta.pageSize || 10;
        totalRecords.value = response.data.meta.total || 0;
        totalPages.value = response.data.meta.totalPages || 0;
      }
    }
  } catch (error) {
    console.error("Lỗi khi gọi API lấy danh sách khách hàng:", error);
    errorMessage.value = "Lỗi khi tải danh sách khách hàng";
  } finally {
    isLoading.value = false;
    selectedIds.value = new Set();
    selectedItems.value = [];
    emitSelection();
  }
};

// UI handlers
const handleSearch = () => {
  currentPage.value = 1;
  fetchCustomers();
};

const handleClearSearch = () => {
  searchKeyword.value = "";
  filterCustomerName.value = "";
  filterCustomerEmail.value = "";
  filterCustomerPhoneNumber.value = "";
  currentPage.value = 1;
  fetchCustomers();
};

const handleSort = (columnKey) => {
  if (sortColumn.value === columnKey) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortColumn.value = columnKey;
    sortDirection.value = "asc";
  }
  currentPage.value = 1;
  fetchCustomers();
};

const handlePageChange = (page) => {
  currentPage.value = page;
  fetchCustomers();
};

const handlePageSizeChange = (size) => {
  pageSize.value = size;
  currentPage.value = 1;
  fetchCustomers();
};

const handleDelete = async (customer) => {
  if (confirm(`Bạn có chắc muốn xóa khách hàng "${customer.name}"?`)) {
    try {
      isLoading.value = true;
      await customerAPI.delete(customer.customerId);
      toastr.success(`Đã xóa khách hàng "${customer.name}" thành công`);
      fetchCustomers();
    } catch (error) {
      console.error("Lỗi khi xóa khách hàng:", error);
      toastr.error("Lỗi khi xóa khách hàng");
      errorMessage.value = "Lỗi khi xóa khách hàng";
    } finally {
      isLoading.value = false;
    }
  }
};

const handleEditCustomer = async (customer) => {
  try {
    isLoading.value = true;
    const response = await customerAPI.getById(customer.customerId);
    console.log("Customer details:", response.data);
    router.push(`/customer/edit/${customer.customerId}`);
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết khách hàng:", error);
    toastr.error("Không thể tải chi tiết khách hàng");
  } finally {
    isLoading.value = false;
  }
};

// Watchers
let searchTimeout;

watch(
  () => props.searchKeyword,
  (newValue) => {
    searchKeyword.value = newValue;
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      currentPage.value = 1;
      fetchCustomers();
    }, 300);
  }
);

watch(
  () => props.refreshKey,
  () => {
    fetchCustomers();
  }
);

watch(() => route.fullPath, (newPath, oldPath) => {
  if (route.path === "/customer" && oldPath && oldPath !== newPath) {
    currentPage.value = 1;
    sortColumn.value = "customerCode";
    sortDirection.value = "desc";
    fetchCustomers();
  }
});

// Lifecycle
onMounted(() => {
  if (route.query.sortBy) {
    sortColumn.value = route.query.sortBy;
    sortDirection.value = route.query.order || "desc";
  }
  fetchCustomers();
});
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
              :class="{ active: sortColumn === header.key }"
              @mouseenter="hoveredHeaderKey = header.key"
              @mouseleave="hoveredHeaderKey = null"
              @click="handleSort(header.key)"
            >
              <div class="header-content">
                <span>{{ header.label }}</span>
                <SortAscendingOutlined 
                  v-if="hoveredHeaderKey === header.key" 
                  class="sort-icon"
                  :style="{ transform: sortColumn === header.key && sortDirection === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)', color: sortColumn === header.key ? '#1890ff' : '#7c869c' }"
                />
              </div>
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
            @dblclick="handleEditCustomer(customer)"
            style="cursor: pointer;"
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

            <td class="td-name text-left">{{ customer.name }}</td>

            <td class="text-dark">{{ customer.taxCode }}</td>

            <td class="td-addr text-dark" :title="customer.address">
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
      :page-size-options="[15, 30, 50, 100]"
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
  font-family: Inter, sans-serif;
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

.header-content {
  display: flex;
  align-items: center;
  gap: 6px;
}

.sort-icon {
  font-size: 12px;
  color: #7c869c;
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

tbody tr:hover .action-buttons {
  display: flex !important;
} 
.text-left {
  text-align: left;
  color: #0f2fbd;
  font-size: 13px;
  font-family: Inter, sans-serif;
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
  background-color: #fff;
  z-index: 2;
  border-right: none;
  padding-right: 30px;;
}

tbody tr:hover .td-checkbox {
  background-color: #e7ebfd;
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
  background-color: #fff;
  z-index: 2;
  text-align: center;
}

.th-actions {
  background-color: #fff;
}

tbody tr:hover .td-actions {
  background-color: #e7ebfd;
}


.action-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.sort-icon {
  font-size: 14px;
  color: #7c869c;
  margin-left: 4px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.th-data {
  cursor: pointer;
  user-select: none;
}
.td-name{
  padding-right: 30px;
}
.td-addr {
  padding-right: 35px;
}
.th-data.active .sort-icon {
  color: #1890ff;
}
</style>
