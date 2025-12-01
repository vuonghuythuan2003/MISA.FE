<template>
  <div class="ms-table">
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <!-- Cột Checkbox -->
            <th v-if="selectable" class="th-checkbox">
              <span
                class="ms-checkbox"
                :class="{ checked: isAllSelected }"
                @click="toggleSelectAll"
              ></span>
            </th>
            <!-- Các cột dữ liệu -->
            <th
              v-for="field in fields"
              :key="field.key"
              :style="{ width: field.width || 'auto' }"
              class="th-data"
            >
              {{ field.label }}
            </th>
            <!-- Cột trống cuối cùng để fill layout -->
            <th class="th-empty"></th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="row in rows"
            :key="row.id"
            class="table-row"
            :class="{ 'row-selected': selectedIds.has(row.id) }"
            @dblclick="handleRowDblClick(row)"
          >
            <!-- Cột Checkbox -->
            <td v-if="selectable" class="td-checkbox">
              <span
                class="ms-checkbox"
                :class="{ checked: selectedIds.has(row.id) }"
                @click.stop="toggleSelect(row.id)"
              ></span>
            </td>

            <!-- Các cột dữ liệu -->
            <td
              v-for="field in fields"
              :key="field.key"
              :class="getCellClass(field)"
              :title="row[field.key]"
            >
              <!-- Slot tùy chỉnh -->
              <template v-if="field.type === 'custom'">
                <slot
                  :name="field.key"
                  :row="row"
                  :field="field"
                  :value="row[field.key]"
                >
                  {{ handleFormat(row[field.key], 'text') }}
                </slot>
              </template>
              <!-- Cột điện thoại có icon -->
              <template v-else-if="field.type === 'phone' && row[field.key] && row[field.key] !== '-'">
                <div class="flex-row align-center gap-4">
                  <span class="icon-default-background icon-phone"></span>
                  {{ row[field.key] }}
                </div>
              </template>
              <!-- Các kiểu khác -->
              <template v-else>
                {{ handleFormat(row[field.key], field.type || 'text') }}
              </template>
            </td>

            <!-- Cột trống cuối cùng -->
            <td class="td-empty"></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Phần phân trang sử dụng MsPagination -->
    <MsPagination
      v-if="showPagination"
      :total-records="totalRecords"
      :total-debt="totalDebt"
      :show-debt="showDebt"
      :page-size="pageSize"
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-change="handlePageChange"
      @page-size-change="handlePageSizeChange"
    >
      <!-- Truyền slots cho icons -->
      <template #first-icon>
        <slot name="first-icon"></slot>
      </template>
      <template #prev-icon>
        <slot name="prev-icon"></slot>
      </template>
      <template #next-icon>
        <slot name="next-icon"></slot>
      </template>
      <template #last-icon>
        <slot name="last-icon"></slot>
      </template>
    </MsPagination>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { formatNumber, formatDate, formatText } from '@/utils/formatter';
import MsPagination from '@/components/ms-paginatuion/Ms-pagination.vue';

//#region Thuộc tính
const props = defineProps({
  // Cấu hình các cột
  fields: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every((field) => {
        const validTypes = ['text', 'number', 'date', 'custom', 'phone', 'email', 'link'];
        return field.key && field.label && validTypes.includes(field.type || 'text');
      });
    },
  },
  // Dữ liệu các dòng
  rows: {
    type: Array,
    required: true,
  },
  // Cho phép chọn nhiều dòng
  selectable: {
    type: Boolean,
    default: false,
  },
  // Danh sách ID đã chọn (v-model)
  modelValue: {
    type: Array,
    default: () => [],
  },
  // Hiển thị phân trang
  showPagination: {
    type: Boolean,
    default: true,
  },
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
});
//#endregion

//#region Sự kiện
const emit = defineEmits([
  'update:modelValue',
  'edit',
  'delete',
  'row-dblclick',
  'page-change',
  'page-size-change',
  'selection-change',
]);
//#endregion

//#region Dữ liệu
// State để lưu các ID được chọn
const selectedIds = ref(new Set(props.modelValue));

// Kiểm tra tất cả đã được chọn chưa
const isAllSelected = computed(() => {
  return props.rows.length > 0 && selectedIds.value.size === props.rows.length;
});
//#endregion

//#region Watchers
// Đồng bộ với v-model
watch(
  () => props.modelValue,
  (newVal) => {
    selectedIds.value = new Set(newVal);
  }
);

watch(selectedIds, (newVal) => {
  emit('update:modelValue', Array.from(newVal));
  emit('selection-change', Array.from(newVal));
}, { deep: true });
//#endregion

//#region Phương thức
/**
 * Bật/tắt chọn một item
 */
const toggleSelect = (id) => {
  if (selectedIds.value.has(id)) {
    selectedIds.value.delete(id);
  } else {
    selectedIds.value.add(id);
  }
  // Kích hoạt cập nhật giao diện
  selectedIds.value = new Set(selectedIds.value);
};

/**
 * Bật/tắt chọn tất cả
 */
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedIds.value = new Set();
  } else {
    selectedIds.value = new Set(props.rows.map((r) => r.id));
  }
};

/**
 * Lấy class cho ô dữ liệu
 */
const getCellClass = (field) => {
  const classes = [];
  if (field.type === 'link' || field.type === 'email' || field.type === 'phone') {
    classes.push('text-link');
  } else {
    classes.push('text-dark');
  }
  if (field.align) {
    classes.push(`text-${field.align}`);
  }
  return classes;
};

/**
 * Hàm định dạng giá trị dựa trên kiểu
 */
const handleFormat = (value, type) => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  switch (type) {
    case 'number':
      return formatNumber(value);
    case 'date':
      return formatDate(value);
    case 'text':
    default:
      return formatText(value);
  }
};

/**
 * Xử lý double click vào dòng
 */
const handleRowDblClick = (row) => {
  emit('row-dblclick', row);
};

/**
 * Xử lý thay đổi trang
 */
const handlePageChange = (page) => {
  emit('page-change', page);
};

/**
 * Xử lý thay đổi số bản ghi trên trang
 */
const handlePageSizeChange = (size) => {
  emit('page-size-change', size);
};
//#endregion

// Xuất các phương thức công khai
defineExpose({
  toggleSelect,
  toggleSelectAll,
  selectedIds,
});
</script>

<style scoped>
.ms-table {
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
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
  font-family: 'Inter', Arial, Helvetica, sans-serif;
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

th {
  height: 40px;
  border-bottom: 1px solid #d3d7de;
  text-align: left;
  color: #1f2229;
  white-space: nowrap;
  font-weight: 600;
  padding: 0 8px;
}

.th-data,
td {
  overflow: hidden;
  text-overflow: ellipsis;
  height: 40px;
  white-space: nowrap;
  padding: 0 8px;
}

.table-row:hover {
  background-color: #e7ebfd;
}

.row-selected {
  background-color: #e7ebfd;
}

/* Checkbox styles */
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

.th-checkbox,
.td-checkbox {
  width: 72px;
  text-align: center;
  position: sticky;
  left: 0;
  background-color: inherit;
  z-index: 2;
  border-right: none;
  padding-right: 30px;
}

.th-empty,
.td-empty {
  width: auto;
}

/* Text styles */
.text-link {
  color: #0f2fbd;
  cursor: pointer;
}

.text-link:hover {
  text-decoration: underline;
}

.text-dark {
  color: #1f2229;
}

.text-left {
  text-align: left;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

/* Phone icon */
.icon-phone {
  background-color: #ffffff;
  border-radius: 50%;
  margin-right: 6px;
}

/* Flex utilities */
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

.gap-4 {
  gap: 4px;
}
</style>
