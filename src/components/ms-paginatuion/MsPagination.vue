<template>
  <div class="pagination-container flex-row justify-content-space-between">
    <!-- Phần bên trái: Tổng số và công nợ -->
    <div class="pagination-left flex-row align-center">
      <div class="icon-default icon-sort-setting"></div>
      <div class="count-info-text flex-row align-center">
        <div class="total-record flex-column">
          <span class="label-count">Tổng số:</span>
          <span class="value-number">{{ formatNumber(totalRecords) }}</span>
        </div>
        <div v-if="showDebt" class="total-debt flex-column">
          <span class="label-count">Công nợ:</span>
          <span class="value-number">{{ formatNumber(totalDebt) }}</span>
        </div>
      </div>
    </div>

    <!-- Phần bên phải: Chọn số bản ghi và điều hướng trang -->
    <div class="pagination-right flex-row align-center justify-content-space-between">
      <!-- Dropdown chọn số bản ghi trên trang -->
      <div class="page-size-selector-wrapper">
        <div 
          class="page-size-selector flex-row align-center justify-content-space-between" 
          @click="showPageSizeDropdown = !showPageSizeDropdown"
        >
          <span class="text-size">{{ pageSize }} Bản ghi trên trang</span>
          <div class="icon-default icon-down"></div>
        </div>
        
        <!-- Dropdown menu -->
        <div v-if="showPageSizeDropdown" class="page-size-dropdown">
          <div 
            v-for="size in pageSizeOptions" 
            :key="size"
            class="dropdown-item"
            :class="{ active: pageSize === size }"
            @click="handlePageSizeChange(size)"
          >
            {{ size }} bản ghi
          </div>
        </div>
      </div>

      <!-- Điều hướng trang -->
      <div class="page-navigation flex-row align-center justify-content-center">
        <span 
          class="nav-icon" 
          :class="{ disabled: currentPage === 1 }" 
          @click="goToFirstPage"
        >
          <slot name="first-icon">
            <span class="default-icon">⏮</span>
          </slot>
        </span>
        <span 
          class="nav-icon" 
          :class="{ disabled: currentPage === 1 }" 
          @click="goToPrevPage"
        >
          <slot name="prev-icon">
            <span class="default-icon">◀</span>
          </slot>
        </span>

        <div class="page-info">
          <b class="page-number-left">{{ currentPage }}</b>
          <span class="page-sep">đến</span>
          <b class="page-number-right">{{ totalPages }}</b>
        </div>

        <span 
          class="nav-icon" 
          :class="{ disabled: currentPage === totalPages }" 
          @click="goToNextPage"
        >
          <slot name="next-icon">
            <span class="default-icon">▶</span>
          </slot>
        </span>
        <span 
          class="nav-icon" 
          :class="{ disabled: currentPage === totalPages }" 
          @click="goToLastPage"
        >
          <slot name="last-icon">
            <span class="default-icon">⏭</span>
          </slot>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { formatNumber } from '@/utils/formatter';

//#region Thuộc tính
const props = defineProps({
  // Tổng số bản ghi
  totalRecords: {
    type: Number,
    default: 0,
  },
  // Tổng công nợ
  totalDebt: {
    type: Number,
    default: 0,
  },
  // Hiển thị công nợ
  showDebt: {
    type: Boolean,
    default: false,
  },
  // Số bản ghi trên trang
  pageSize: {
    type: Number,
    default: 100,
  },
  // Trang hiện tại
  currentPage: {
    type: Number,
    default: 1,
  },
  // Tổng số trang
  totalPages: {
    type: Number,
    default: 1,
  },
  // Các tùy chọn số bản ghi trên trang
  pageSizeOptions: {
    type: Array,
    default: () => [20, 50, 100, 200],
  },
});
//#endregion

//#region Sự kiện
const emit = defineEmits([
  'page-change',
  'page-size-change',
]);
//#endregion

//#region State
const showPageSizeDropdown = ref(false);

//#endregion

//#region Phương thức
/**
 * Xử lý thay đổi số bản ghi trên trang
 */
const handlePageSizeChange = (size) => {
  if (size !== props.pageSize) {
    showPageSizeDropdown.value = false;
    emit('page-size-change', size);
  }
};

/**
 * Toggle dropdown chọn số bản ghi
 */
const togglePageSizeDropdown = () => {
  // Có thể mở rộng sau với dropdown thực sự
  console.log('Toggle page size dropdown');
};

/**
 * Đi đến trang đầu tiên
 */
const goToFirstPage = () => {
  if (props.currentPage !== 1) {
    emit('page-change', 1);
  }
};

/**
 * Đi đến trang trước
 */
const goToPrevPage = () => {
  if (props.currentPage > 1) {
    emit('page-change', props.currentPage - 1);
  }
};

/**
 * Đi đến trang tiếp theo
 */
const goToNextPage = () => {
  if (props.currentPage < props.totalPages) {
    emit('page-change', props.currentPage + 1);
  }
};

/**
 * Đi đến trang cuối cùng
 */
const goToLastPage = () => {
  if (props.currentPage !== props.totalPages) {
    emit('page-change', props.totalPages);
  }
};

/**
 * Thay đổi số bản ghi trên trang
 */
const changePageSize = (size) => {
  emit('page-size-change', size);
};
//#endregion

// Xuất các phương thức công khai
defineExpose({
  goToFirstPage,
  goToPrevPage,
  goToNextPage,
  goToLastPage,
  changePageSize,
});
</script>

<style scoped>
.pagination-container {
  width: 100%;
  min-height: 56px;
  background-color: #ffffff;
  border-top: 1px solid #d3d7de;
  position: sticky;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  padding: 8px 16px;
  box-sizing: border-box;
  max-height: 56px;
}

.pagination-left {
  height: 40px;
  flex: 1;
}

.pagination-right {
  box-sizing: border-box;
  font-size: 13px;
  width: 375px;
  font-family: Inter, sans-serif;
}

.count-info-text {
  display: flex;
  align-items: center;
}

.total-record {
  padding-left: 16px;
  font-family: Inter, sans-serif;
  font-size: 13px;
}

.label-count {
  font-weight: 400;
  color: #586074;
  text-align: left;
}

.value-number {
  font-weight: 700;
  color: #1f2229;
  line-height: 19px;
}

.total-debt {
  margin-left: 20px;
  font-size : 13px;
}

.page-size-selector {
  min-height: 32px;
  width: 183px;
  border: 1px solid #d3d7de;
  padding-left: 16px;
  padding-right: 8px;
  border-radius: 4px;
  cursor: pointer;
}

.page-size-selector:hover {
  border-color: #4262f0;
}

.page-size-selector-wrapper {
  position: relative;
}

.page-size-dropdown {
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  margin-bottom: 0;
  background: white;
  border: 1px solid #d3d7de;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.dropdown-item {
  padding: 8px 16px;
  font-size: 13px;
  color: #1f2229;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f0f2f5;
}

.dropdown-item.active {
  background-color: #e7ebfd;
  color: #4262f0;
  font-weight: 500;
}

.page-navigation {
  margin-left: 16px;
  width: 176px;
  text-align: center;
}

.nav-icon {
  width: 24px;
  height: 24px;
  font-size: 14px;
  color: #1f2229;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.nav-icon:hover:not(.disabled) {
  color: #4262f0;
}

.nav-icon.disabled {
  color: #bbbec6;
  cursor: not-allowed;
}

.default-icon {
  font-size: 12px;
}

.page-info {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin: 0 8px;
}

.page-sep {
  font-weight: 400;
  padding: 0 4px;
  color: #1f2229;
}

.page-number-left,
.page-number-right {
  font-weight: 700;
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

.align-center {
  align-items: center;
}

.justify-content-space-between {
  justify-content: space-between;
}

.justify-content-center {
  justify-content: center;
}
</style>