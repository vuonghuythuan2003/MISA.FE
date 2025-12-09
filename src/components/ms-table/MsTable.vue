<template>
  <div class="ms-table-container">
    <table class="ms-table">
      <thead @mouseleave="hoveredHeaderKey = null">
        <tr>
          <!-- Checkbox column -->
          <th class="th-checkbox">
            <span 
              class="ms-checkbox" 
              :class="{ checked: isAllSelected }"
              @click="$emit('selectAll')"
            ></span>
          </th>
          <!-- Data columns -->
          <th
            v-for="(header, idx) in headers"
            :key="idx"
            :style="{ width: header.width || 'auto', padding: '0 12px' }"
            class="th-data"
            :class="{ active: sortColumn === header.key }"
            @mouseenter="hoveredHeaderKey = header.key"
            @mouseleave="hoveredHeaderKey = null"
            @click="$emit('sort', header.key)"
          >
            <div class="header-content">
              <span>{{ header.label }}</span>
              <SortAscendingOutlined
                v-if="hoveredHeaderKey === header.key"
                class="sort-icon"
                :style="{
                  transform: sortColumn === header.key && sortDirection === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)',
                  color: sortColumn === header.key ? '#1890ff' : '#7c869c'
                }"
              />
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="item in items" 
          :key="item.customerId || item.id"
          @dblclick="$emit('rowDblClick', item)"
          style="cursor: pointer;"
        >
          <td class="td-checkbox">
            <span 
              class="ms-checkbox" 
              :class="{ checked: selectedIds.has(item.customerId || item.id) }"
              @click="$emit('select', item.customerId || item.id)"
            ></span>
          </td>
          <td v-for="(header, idx) in headers" :key="idx" :class="header.cellClass" style="padding: 0 12px;">
            <slot :name="header.key" :row="item">
              {{ item[header.key] }}
            </slot>
          </td>
        </tr>
        <tr v-if="isLoading">
          <td :colspan="headers.length + 1" style="text-align:center;">Đang tải dữ liệu...</td>
        </tr>
        <tr v-if="!isLoading && items.length === 0">
          <td :colspan="headers.length + 1" style="text-align:center;">Không có dữ liệu</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script setup>
import { ref, computed } from 'vue';
import { SortAscendingOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  headers: Array,
  items: Array,
  selectedIds: {
    type: Object,
    default: () => new Set(),
  },
  sortColumn: String,
  sortDirection: String,
  isLoading: Boolean,
});

const hoveredHeaderKey = ref(null);
const isAllSelected = computed(() => props.items && props.items.length > 0 && props.selectedIds.size === props.items.length);
</script>

<style scoped>
.ms-table-container {
  width: 100%;
  min-height: 532px;
  display: flex;
  flex-direction: column;
  overflow-x: auto;
  background-color: #fff;
  border-radius: 0;
  border: none;
}
.ms-table {
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
  height: 16px;
  width: 16px;
  background-color: #fff;
  border: 1px solid #7c869c;
  border-radius: 4px;
  accent-color: #4262f0;
  background-clip: padding-box;
  cursor: pointer;
  display: inline-block;
  position: relative;
  vertical-align: middle;
  margin-left: 50px;
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
  padding-right: 30px;
  vertical-align: middle;
}
tbody tr:hover .td-checkbox {
  background-color: #e7ebfd;
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
