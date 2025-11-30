<template>
  <div class="ms-table">
    <table>
      <thead>
        <tr>
          <th v-for="field in fields" :key="field.key">{{ field.label }}</th>
          <th class="action-col"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id" class="table-row">
          <td v-for="field in fields" :key="field.key">
            <!-- Slot tùy chỉnh -->
            <template v-if="field.type === 'custom'">
              <slot
                :name="field.key"
                :row="row"
                :field="field"
                :value="row[field.key]"
              >
                {{ handleFormat(row[field.key], "text") }}
              </slot>
            </template>
            <!-- Các kiểu khác -->
            <template v-else>
              {{ handleFormat(row[field.key], field.type || "text") }}
            </template>
          </td>
          <!-- Nút thao tác nổi -->
          <td class="action-cell">
            <div class="action-buttons">
              <button @click="handleEdit(row)" class="edit-btn">Edit</button>
              <button @click="handleDelete(row)" class="delete-btn">
                Delete
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { formatNumber, formatDate, formatText } from "@/utils/formatter";

//#region Thuộc tính
const props = defineProps({
  fields: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every((field) => {
        const validTypes = ["text", "number", "date", "custom"];
        return (
          field.key && field.label && validTypes.includes(field.type || "text")
        );
      });
    },
  },
  rows: {
    type: Array,
    required: true,
  },
});
//#endregion

//#region Sự kiện
const emit = defineEmits(["edit", "delete"]);
//#endregion

//#region Phương thức
/**
 * Hàm định dạng giá trị dựa trên kiểu
 * @param value
 * @param type
 * @returns
 * createdby: pdthien - 15.10.2025
 */
const handleFormat = (value, type) => {
  switch (type) {
    case "number":
      return formatNumber(value);
    case "date":
      return formatDate(value);
    case "text":
      return formatText(value);
    default:
      return formatText(value);
  }
};

/**
 * Hàm xử lý sửa bản ghi
 * @param row
 * createdby: pdthien - 15.10.2025
 */
const handleEdit = (row) => {
  emit("edit", row);
};

/**
 * Hàm xử lý xóa bản ghi
 * @param row
 */
const handleDelete = (row) => {
  emit("delete", row);
};
//#endregion
</script>

<style scoped>
.ms-table {
  width: 100%;
  overflow-x: auto;
  position: relative;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

th,
td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  font-weight: 600;
}

.table-row {
  position: relative;
}

.table-row:hover {
  background-color: #f5f5f5;
  color: black;
}

.table-row:hover .action-buttons {
  opacity: 1;
  pointer-events: auto;
}

.action-cell {
  position: relative;
  width: 150px;
}

.action-col {
  width: 150px;
}

.action-buttons {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 0.5rem;
  padding: 0 1rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  background: linear-gradient(to left, #f5f5f5 70%, transparent);
}

.edit-btn,
.delete-btn {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  z-index: 1;
}

.edit-btn {
  background-color: #4caf50;
  color: white;
  border: none;
}

.delete-btn {
  background-color: #f44336;
  color: white;
  border: none;
}

.edit-btn:hover,
.delete-btn:hover {
  opacity: 0.9;
}
</style>
