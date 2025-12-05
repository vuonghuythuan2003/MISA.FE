<template>
  <div class="input-container">
    <label v-if="label" class="form-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <a-date-picker
      :value="dateValue"
      :placeholder="placeholder"
      :format="format"
      :picker="picker"
      class="date-picker-custom"
      :class="{ 'date-picker-error': error }"
      :get-popup-container="(trigger) => trigger.parentElement"
      @change="handleChange"
    >
      <template #suffixIcon>
        <CalendarOutlined />
      </template>
    </a-date-picker>
    <div v-if="error || helperText" class="message">
      <span v-if="error" class="error-text">{{ error }}</span>
      <span v-else class="helper-text">{{ helperText }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { CalendarOutlined } from "@ant-design/icons-vue";
import dayjs from "dayjs";

const props = defineProps({
  modelValue: {
    type: [String, Object],
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "dd/MM/yyyy",
  },
  format: {
    type: String,
    default: "DD/MM/YYYY",
  },
  required: {
    type: Boolean,
    default: false,
  },
  helperText: {
    type: String,
    default: "",
  },
  error: {
    type: String,
    default: "",
  },
  picker: {
    type: String,
    default: "date",
  },
});

const emit = defineEmits(["update:modelValue"]);

const dateValue = ref(
  props.modelValue ? dayjs(props.modelValue, props.format) : null
);

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      dateValue.value = dayjs(newValue, props.format);
    } else {
      dateValue.value = null;
    }
  }
);

const handleChange = (date, dateString) => {
  emit("update:modelValue", dateString);
};
</script>

<style scoped>
.input-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #1e2633;
  font-family: Inter, sans-serif;
}

.required {
  color: #f44336;
  margin-left: 2px;
}

.date-picker-custom :deep(.ant-picker) {
  width: 100%;
  height: 31px;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
}

.date-picker-error :deep(.ant-picker) {
  border-color: #ff4d4f !important;
}

.message {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.error-text {
  color: #ff4d4f;
  font-size: 12px;
  line-height: 1.5;
}

.helper-text {
  color: #999;
  font-size: 12px;
  line-height: 1.5;
}

.date-picker-custom {
  width: 100%;
}

.date-picker-custom :deep(.ant-picker) {
  width: 100%;
  height: 31px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
}

.date-picker-custom :deep(.ant-picker:hover) {
  border-color: #2680eb;
}

.date-picker-custom :deep(.ant-picker-focused) {
  border-color: #2680eb;
  box-shadow: none;
}

.date-picker-custom :deep(.ant-picker-input > input) {
  font-size: 14px;
  color: #1e2633;
  font-family: Inter, sans-serif;
}

.date-picker-custom :deep(.ant-picker-input > input::placeholder) {
  color: #9e9e9e;
}

.date-picker-custom :deep(.ant-picker-suffix) {
  display: flex;
  align-items: center;
  color: #888E9C;
}

.date-picker-custom :deep(.ant-picker-suffix svg) {
  color: #888E9C;
}

.helper-text {
  font-size: 12px;
  color: #faad14;
  margin-top: 4px;
}
</style>
