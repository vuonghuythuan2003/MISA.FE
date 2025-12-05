<script setup>
import { ref } from 'vue';
import MsButton from "../components/ms-button/MsButton.vue";
import MsUpload from "../components/ms-upload/MsUpload.vue";
import CustomerLayOut from "../views/customer/CustomerLayOut.vue";
import { useRouter } from 'vue-router'

const router = useRouter()

// Trạng thái hiển thị popup upload
const showUploadPopup = ref(false);

function goToAdd() {
  router.push('/customer/add')
}

// Mở popup nhập từ Excel
function openExcelImport() {
  showUploadPopup.value = true;
}
</script>

<template>
  <div class="main-content-layout">
  <div class="toolbar flex-row justify-content-space-between">
    <!-- Bố cục thanh công cụ (phần trái) -->
    <div class="toolbar-left flex-row align-center">
      <!-- Dropdown Khách hàng -->
      <div class="customer-dropdown flex-row align-center">
        <div class="icon-default icon-folder"></div>
        <div class="content-customer">Tất cả khách hàng</div>
        <div class="icon-default icon-down"></div>
      </div>
      <!-- Nhóm hành động -->
      <div class="action-group flex-row align-center">
        <span class="action-text">Sửa</span>
        <span class="icon-default icon-reload"></span>
      </div>
    </div>
    <!-- Bố cục thanh công cụ (phần phải) -->
    <div class="toolbar-right flex-row align-center">
      <!-- Input Tìm kiếm thông minh -->
      <div class="smart-search-input flex-row align-center">
        <div class="icon-default icon-search"></div>
        <input
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
  <CustomerLayOut />
  
  <!-- Popup nhập từ Excel -->
  <MsUpload :open="showUploadPopup" @update:open="val => showUploadPopup = val" />
  </div>
</template>
<style scoped>
.toolbar-left .customer-dropdown {
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
}
.content-customer {
  font-size: 13px;
  margin-right: 8px;
  margin-left: 8px;
  margin-bottom: initial;
  cursor: pointer;
  font-weight: 600;
  font-family: "Inter", Arial, Helvetica, sans-serif;
  line-height: 1.428571429;
  color: #1f2229;
}
.action-text {
  padding: 0;
  margin: 0;
  font-size: 13px;
  font-family: "Inter", Arial, Helvetica, sans-serif;
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
  font-family: "Inter", Arial, Helvetica, sans-serif;
  padding: 5px 16px 5px 8px !important;
}
.btn-excel-import {
  height: 32px !important;
  margin-left: 8px;
  margin-top: 26px;
  font-size: 13px;
  font-family: "Inter", Arial, Helvetica, sans-serif;
  background-color: #ffffff !important;
  border: 1px solid #4262f0 !important;
  font-feature-settings: normal;
  font-variant: normal;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  color: #4262f2 !important;
  padding: 5px 16px 5px 8px !important;
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
  width: 55px;
  height: 32px;
  border: 1px solid #d3d7de !important;
  text-transform: none !important;
  font-weight: 500 !important;
  background-color: #fff;
  color: #1f2229;
  margin-right: 15px;
  margin-left: 8px;
  margin-top: 26px;
  border-radius: 4px;
  white-space: nowrap;
  padding: 7px !important;
}
</style>
