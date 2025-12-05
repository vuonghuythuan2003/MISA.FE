<template>
  <div class="ms-table">
    <table>
      <thead>
        <tr>
          <th
            v-for="field in fields"
            :key="field.key"
            :style="{ width: field.width || 'auto' }"
          >
            {{ field.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in rows" :key="index">
          <td v-for="field in fields" :key="field.key">
            {{ row[field.key] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  fields: {
    type: Array,
    required: true,
  },
  rows: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped>
.ms-table {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-family: "Inter", Arial, Helvetica, sans-serif;
  font-size: 13px;
}

th,
td {
  padding: 8px 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

th {
  background-color: #f5f5f5;
  font-weight: 600;
  color: #1f2229;
}

tr:hover {
  background-color: #f9f9f9;
}
</style>
