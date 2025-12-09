<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from "vue";
import MsButton from "../components/ms-button/MsButton.vue";
import MsUpload from "../components/ms-upload/MsUpload.vue";
import CustomerLayOut from "../views/customer/CustomerLayOut.vue";
import { FileExcelOutlined } from "@ant-design/icons-vue";
import { useRouter } from "vue-router";
import customerAPI from "../apis/components/CustomerAPI.js";
import toastr from "toastr";
import MsModal from "../components/ms-modal/MsModal.vue";
import { Modal } from 'ant-design-vue';

// Popup gán loại khách hàng
const showAssignTypePopup = ref(false);
const assignTypeValue = ref(null);
const assignTypeOptions = [
  { label: "VIP", value: "VIP" },
  { label: "NBH01", value: "NBH01" },
  { label: "LKHA", value: "LKHA" },
];

function openAssignTypePopup() {
  assignTypeValue.value = null;
  showAssignTypePopup.value = true;
}

async function handleAssignTypeApply() {
  if (!assignTypeValue.value || selectedIds.value.length === 0) return;
  try {
    await customerAPI.assignType({ customerIds: selectedIds.value, customerType: assignTypeValue.value });
    toastr.success("Gán loại khách hàng thành công");
    showAssignTypePopup.value = false;
    refreshKey.value += 1;
  } catch (error) {
    toastr.error("Gán loại khách hàng thất bại");
  }
}
const router = useRouter();

// Trạng thái hiển thị popup upload
const showUploadPopup = ref(false);

// Cờ dùng để yêu cầu tải lại danh sách sau khi import
const refreshKey = ref(0);

// Trạng thái chọn bản ghi để hiển thị các nút hành động (xóa nhiều và xuất)
const hasSelection = ref(false);

// Danh sách ID đã chọn
const selectedIds = ref([]);
// Mảng chứa toàn bộ object dữ liệu của các item được chọn
const selectedItems = ref([]);

// Trạng thái xử lý
const isDeletingMany = ref(false);
const isExportingCsv = ref(false);

// Trạng thái tìm kiếm & lọc
const searchKeyword = ref("");
let searchTimeout;

// Trạng thái lọc theo loại khách hàng
const customerTypeFilter = ref(null);
const showCustomerTypeDropdown = ref(false);
const customerTypeOptions = [
  { label: 'Tất cả khách hàng', value: null },
  { label: 'VIP', value: 'VIP' },
  { label: 'LKHA', value: 'LKHA' },
  { label: 'NBH01', value: 'NBH01' },
];

// Lấy label hiển thị
const selectedCustomerTypeLabel = computed(() => {
  const option = customerTypeOptions.find(opt => opt.value === customerTypeFilter.value);
  return option ? option.label : 'Tất cả khách hàng';
});

// Theo dõi searchKeyword để gọi API với trì hoãn
watch(searchKeyword, (newValue) => {
  // Xóa timeout trước đó
  clearTimeout(searchTimeout);

  // Đặt timeout để gọi API sau 300ms không nhập
  searchTimeout = setTimeout(() => {
    // API sẽ tự động gọi thông qua watch ở CustomerLayOut
    // vì searchKeyword là prop được truyền sang
  }, 300);
});

// Mở popup nhập từ Excel
function openExcelImport() {
  showUploadPopup.value = true;
}

// Điều hướng sang trang thêm mới
function goToAdd() {
  router.push("/customer/add");
}

// Điều hướng sang trang sửa
function goToEdit() {
  if (selectedIds.value.length > 0) {
    router.push(`/customer/${selectedIds.value[0]}`);
  }
}

// Xử lý xóa nhiều khách hàng
async function handleDeleteMultiple() {
  if (!selectedIds.value.length || isDeletingMany.value) return;

  Modal.confirm({
    title: "Xác nhận xóa",
    content: `Bạn có chắc muốn xóa ${selectedIds.value.length} khách hàng đã chọn?`,
    centered: true,
    okText: "Xóa",  
    okType: "danger",
    cancelText: "Hủy",
    autoFocusButton: "cancel",
    onOk: () =>
      (async () => {
        try {
          isDeletingMany.value = true;
          await customerAPI.deleteMany(selectedIds.value);
          toastr.success("Đã xóa khách hàng đã chọn thành công");
          refreshKey.value += 1; // Tải lại danh sách
        } catch (error) {
          console.error("Lỗi khi xóa nhiều khách hàng:", error);
          const message =
            error?.response?.data?.userMessage ||
            error?.response?.data?.message ||
            "Lỗi khi xóa nhiều khách hàng";
          toastr.error(message);
        } finally {
          isDeletingMany.value = false;
        }
      })(),
  });
}

// Xử lý xuất CSV
function handleExportCsv() {
  if (!selectedItems.value.length || isExportingCsv.value) return;

  Modal.confirm({
    title: "Xuất CSV",
    content: `Xuất ${selectedItems.value.length} khách hàng đã chọn ra CSV?`,
    centered: true,
    okText: "Xuất",
    okType: "primary",
    cancelText: "Hủy",
    autoFocusButton: "cancel",
    onOk: () =>
      (async () => {
        try {
          isExportingCsv.value = true;

          const escapeCsv = (value) => {
            if (value === null || value === undefined) return "";
            const str = String(value);
            return /[",\n\r]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
          };

          const headers = [
            "STT",
            "Mã khách hàng",
            "Tên khách hàng",
            "Loại khách hàng",
            "Số điện thoại",
            "Email",
            "Địa chỉ",
            "Địa chỉ giao hàng",
            "Mã số thuế",
            "Ngày mua gần nhất",
            "Mã hàng đã mua",
            "Tên hàng đã mua",
          ];

          const lines = selectedItems.value.map((item, index) => [
            index + 1,
            item.code,
            item.name,
            item.type,
            item.phone,
            item.email,
            item.address,
            item.shippingAddress,
            item.taxCode,
            item.lastDate,
            item.goodsCode,
            item.goodsName,
          ].map(escapeCsv).join(","));

          const csvContent = [headers.join(","), ...lines].join("\n");
          // Binary Large Object
          // Tạo file CSV (UTF-8 + tiếng Việt chuẩn) từ biến csvContent
          const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });

          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "DanhSachKhachHang.csv");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          toastr.success("Xuất CSV thành công");
        } catch (error) {
          console.error("Lỗi khi xuất CSV:", error);
          toastr.error("Lỗi khi xuất CSV");
        } finally {
          isExportingCsv.value = false;
        }
      })(),
  });
}

// Sau khi import CSV thành công, đóng popup và tăng refresh key để CustomerLayOut fetch lại
function handleImported() {
  refreshKey.value += 1;
}

// Nhận danh sách ID được chọn từ CustomerLayOut
function handleSelectionChange(payload) {
  const ids = payload?.ids || [];
  const items = payload?.items || [];
  selectedIds.value = Array.isArray(ids) ? ids : [];
  selectedItems.value = Array.isArray(items) ? items : [];
  hasSelection.value = selectedIds.value.length > 0;
}

// Xử lý thay đổi loại khách hàng
function handleCustomerTypeChange(value) {
  // Nếu chọn 'Tất cả khách hàng' thì truyền null, còn lại truyền đúng mã loại
  customerTypeFilter.value = value === null ? null : value;
  showCustomerTypeDropdown.value = false;
  refreshKey.value += 1; // Trigger refresh để CustomerLayOut fetch lại với filter mới
}

// Toggle dropdown
function toggleCustomerTypeDropdown() {
  showCustomerTypeDropdown.value = !showCustomerTypeDropdown.value;
}

// Đóng dropdown khi click ra ngoài
function handleClickOutside(event) {
  const dropdown = event.target.closest('.customer-dropdown');
  if (!dropdown && showCustomerTypeDropdown.value) {
    showCustomerTypeDropdown.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="main-content-layout">
    <div class="toolbar flex-row justify-content-space-between">
      <!-- Bố cục thanh công cụ (phần trái) -->
      <div class="toolbar-left flex-row align-center">
        <!-- Dropdown Khách hàng -->
        <div class="customer-dropdown flex-row align-center" @click="toggleCustomerTypeDropdown">
          <div class="icon-default icon-folder"></div>
          <div class="content-customer">{{ selectedCustomerTypeLabel }}</div>
          <div class="icon-default icon-down"></div>
          <!-- Dropdown menu -->
          <div v-if="showCustomerTypeDropdown" class="customer-type-dropdown-menu">
            <div 
              v-for="option in customerTypeOptions" 
              :key="option.value"
              class="dropdown-menu-item"
              :class="{ active: customerTypeFilter === option.value }"
              @click.stop="handleCustomerTypeChange(option.value)"
            >
              {{ option.label }}
              <span v-if="customerTypeFilter === option.value" class="check-icon">✓</span>
            </div>
          </div>
        </div>
        <!-- Nhóm hành động -->
        <div class="action-group flex-row align-center">
          <span class="action-text" @click="goToEdit" style="cursor:pointer" v-show="hasSelection">Sửa</span>
          <span class="icon-default icon-reload"></span>
        </div>
        <!-- Nút Xóa -->
        <MsButton
          class="btn-delete-multiple align-center justify-content-center" 
          type="primary"
          v-show="hasSelection"
          :disabled="isDeletingMany"
          @click="handleDeleteMultiple"
          >Xóa</MsButton
        >
        <!-- Nút Xuất từ CSV -->
        <MsButton
          class="btn-excel-export align-center justify-content-center"
          type="link"
          v-show="hasSelection"
          :disabled="isExportingCsv"
          @click="handleExportCsv"
        >
          <template #icon-left>
            <FileExcelOutlined />
          </template>
          Xuất CSV
        </MsButton>

          <!-- Nút Gán loại khách hàng -->
          <MsButton
            class="btn-assign-type align-center justify-content-center"
            type="primary"
            v-show="hasSelection"
            :disabled="isDeletingMany"
            @click="openAssignTypePopup"
          > 
            Gán loại khách hàng
          </MsButton>
      </div>
      <!-- Bố cục thanh công cụ (phần phải) -->
      <div class="toolbar-right flex-row align-center">
        <!-- Input Tìm kiếm thông minh -->
        <div class="smart-search-input flex-row align-center">
          <div class="icon-default icon-search"></div>
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="Tìm kiếm thông minh"
            class="search-field"
          />

          <div class="icon-ai"></div>
        </div>
        <!-- Nút Icon Tòa nhà -->
        <div class="btn-square-icon align-center justify-content-center">
          <div class="icon-default icon-building"></div>
        </div>
        <!-- Nút Thêm -->
        <MsButton
          class="btn-add align-center justify-content-center"
          icon="add"
          type="primary"
          @click="goToAdd"
          >Thêm</MsButton
        >
        <!-- Nút Nhập từ Excel -->
        <MsButton
          class="btn-excel-import align-center justify-content-center"
          icon="excel-import"
          type="link"
          @click="openExcelImport"
          >Nhập từ Excel</MsButton
        >
        <!-- Nút More (...) -->
        <div class="btn-more flex-row align-center justify-content-center">
          <!-- Giả lập 3 dấu chấm bằng CSS hoặc icon -->
          <div class="icon-default icon-three-dots"></div>
        </div>
        <!-- Nút View Mode (List + Arrow) -->
        <div class="btn-view-mode flex-row align-center justify-content-center">
          <div class="icon-default icon-list-ul"></div>
          <div class="icon-default icon-down-gray"></div>
        </div>
      </div>
    </div>
    <!-- Giao diện danh sách khách hàng hiển thị bên dưới thanh công cụ -->
    <CustomerLayOut
      :searchKeyword="searchKeyword"
      :customerTypeFilter="customerTypeFilter"
      :refresh-key="refreshKey"
      @selection-change="handleSelectionChange"
    />

    <!-- Popup nhập từ Excel -->
    <MsUpload
      :open="showUploadPopup"
      @update:open="(val) => (showUploadPopup = val)"
      @uploaded="handleImported"
    />
    <!-- Popup Gán loại khách hàng -->
    <MsModal
      v-model="showAssignTypePopup"
      title="Gán loại khách hàng"
      centered
      :footer="null"
      width="400px"
    >
      <div style="margin-bottom: 24px;">
        <div v-for="option in assignTypeOptions" :key="option.value" style="margin-bottom: 12px;">
          <label style="display: flex; align-items: center; cursor: pointer;">
            <input type="radio" v-model="assignTypeValue" :value="option.value" style="margin-right: 8px;" />
            {{ option.label }}
          </label>
        </div>
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 12px;">
        <MsButton type="secondary" @click="showAssignTypePopup = false">Hủy</MsButton>
        <MsButton type="primary" :disabled="!assignTypeValue" @click="handleAssignTypeApply" style="width: 100px;">Áp dụng</MsButton>
      </div>
    </MsModal>
  </div>
</template>
<style scoped>
.main-content-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.toolbar-left .customer-dropdown {
  position: relative;
  width: 185px;
  height: 32px;
  background-color: #fff;
  border: 1px solid #d3d7de;
  padding-right: 8px !important;
  padding-left: 12px !important;
  height: 32px;
  border-radius: 4px;
  justify-content: space-between;
  cursor: pointer;
  margin-left: 16px;
}
.toolbar-right {
  width: 700px;
  height: 32px;
  margin-left: 10px;
  transform: translateX(10px);
}
.btn-assign-type{
  margin-left: 20px;
  width: 140px !important;
}
.content-customer {
  font-size: 13px;
  margin-right: 8px;
  margin-left: 8px;
  margin-bottom: initial;
  cursor: pointer;
  font-weight: 600;
  font-family: Inter, sans-serif;
  line-height: 1.428571429;
  color: #1f2229;
}
.action-text {
  padding: 0;
  margin: 0;
  font-size: 13px;
  font-family: Inter, sans-serif;
  color: #4262f0 !important;
}
.action-group {
  margin-left: 15px;
  gap: 20px;
  cursor: pointer;
}
.search-field {
  width: 282px;
  height: 32px;
  outline: none;
  border-radius: 3px;
  font-size: 13px;
  padding: 6px 12px;
  color: #5c66f0;
  background-color: #ffffff;
  border: 2px solid transparent;
  background-image: linear-gradient(#ffffff, #ffffff),
    linear-gradient(251deg, #4262f0 24.05%, #9f73f1 71.93%);
  background-origin: padding-box, border-box;
  background-clip: padding-box, border-box;
  box-shadow: 0 2px 0 rgba(66, 123, 244, 0.06) inset;
  padding-left: 30px;
  border-top: 1px solid transparent !important;
  border-right: 1px solid transparent !important;
}

.search-field::placeholder {
  color: #5c66f0;
}
.smart-search-input {
  margin-top: 26px;
  gap: 8px;
}
.icon-ai {
  right: 425px;
}

.icon-search {
  background-color: #7d6df0 !important;
  margin-left: 8px;
}
.btn-excel-import :deep(.icon-excel-import) {
  background-color: #4262f2 !important;
  margin-left: -10px;
}
.icon-building {
  background-color: #7d6df0 !important;
}
.btn-square-icon {
  margin-top: 26px;
  margin-left: 12px;
  border-radius: 3px;
  width: 32px;
  height: 32px;
  border: 2px solid transparent;
  background-image: linear-gradient(#ffffff, #ffffff),
    linear-gradient(251deg, #4262f0 24.05%, #9f73f1 71.93%);
  background-origin: padding-box, border-box;
  background-clip: padding-box, border-box;
  box-shadow: 0 2px 0 rgba(66, 123, 244, 0.06) inset;
  border-top: 1px solid transparent !important;
  border-right: 1px solid transparent !important;
}
.btn-add {
  border: 1px solid #4262f0;
  height: 32px !important;
  margin-left: 12px;
  margin-top: 26px;
  font-size: 13px;
  width: 85.1px !important;
  font-family: Inter, sans-serif;
  padding: 5px 16px 5px 8px !important;
}
.btn-excel-import {
  height: 32px !important;
  margin-left: 8px;
  margin-top: 26px;
  font-size: 13px;
  font-family: Inter, sans-serif;
  background-color: #ffffff !important;
  border: 1px solid #4262f0 !important;
  font-feature-settings: normal;
  font-variant: normal;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  color: #4262f2 !important;
  padding: 5px 5px 5px 8px !important;
}
.btn-excel-import:hover {
  background-color: rgb(236, 230, 230) !important;
  border-color: #c4c3c3;
  color: #0430f5 !important;
}
.btn-excel-export {
  height: 30px !important;
  margin-left: 15px;
  font-size: 13px;
  font-family: Inter, sans-serif;
  background-color: #ffffff !important;
  border: 1px solid #4262f0 !important;
  font-feature-settings: normal;
  font-variant: normal;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  color: #4262f2 !important;
}
.btn-excel-export:hover {
  background-color: rgb(236, 230, 230) !important;
  border-color: #c4c3c3;
  color: #0430f5 !important;
}
.btn-more {
  width: 36px;
  height: 32px;
  font-weight: 500 !important;
  border: 1px solid #d3d7de !important;
  background-color: #fff;
  box-sizing: border-box;
  color: #1f2229;
  border-radius: 4px;
  margin-left: 8px;
  margin-top: 26px;
  white-space: nowrap;
}
.btn-view-mode {
  width: 60px;
  height: 32px;
  border: 1px solid #d3d7de !important;
  text-transform: none !important;
  font-weight: 500 !important;
  background-color: #fff;
  color: #1f2229;
  margin-left: 8px;
  margin-top: 26px;
  border-radius: 4px;
  white-space: nowrap;
  padding: 7px !important;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-view-mode:hover {
  background-color: #f5f5f5;
  border-color: #b8bcc4;
}

.btn-view-mode:active {
  background-color: #e7ebfd;
  border-color: #7c869c;
}

.toolbar-left .customer-dropdown {
  transition: all 0.3s ease;
}

.toolbar-left .customer-dropdown:hover {
  background-color: #f5f5f5;
  border-color: #b8bcc4;
}

.toolbar-left .customer-dropdown:active {
  background-color: #e7ebfd;
  border-color: #7c869c;
}

.action-group {
  transition: all 0.3s ease;
}

.action-group:hover {
  opacity: 0.8;
}

.action-group:active {
  opacity: 0.6;
}

.btn-square-icon {
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-square-icon:hover {
  box-shadow: 0 2px 8px rgba(66, 98, 240, 0.2);
  opacity: 0.9;
}

.btn-square-icon:active {
  opacity: 0.8;
}

.btn-more {
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-more:hover {
  background-color: #f5f5f5;
  border-color: #b8bcc4;
}
.btn-more:active {
  background-color: #e7ebfd;
  border-color: #7c869c;
}
.icon-down-gray {
  margin-left: 8px;
}
.btn-delete-multiple{
  width: 100px;
  margin-left: 20px;
  background-color: #FFF;
  color: #FF0000;
  height: 30px;
  border : 1px solid #FF0000;

}
.btn-delete-multiple:hover {
  background-color: rgb(226, 221, 221); 
}

.customer-type-dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  background: white;
  border: 1px solid #d3d7de;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 185px;
  max-height: 300px;
  overflow-y: auto;
}

.dropdown-menu-item {
  padding: 8px 12px;
  font-size: 13px;
  font-family: Inter, sans-serif;
  color: #1f2229;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s;
}

.dropdown-menu-item:hover {
  background-color: #f5f5f5;
}

.dropdown-menu-item.active {
  background-color: #e7ebfd;
  color: #4262f0;
  font-weight: 500;
}

.check-icon {
  color: #4262f0;
  font-weight: bold;
}

</style>
