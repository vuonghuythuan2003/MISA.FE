<template>
  <div class="ms-selected">
    <div class="ms-selected-wrapper" :class="{ 'ms-selected--error': error }">
      <a-select
        :value="modelValue"
        show-search
        :placeholder="placeholder"
        class="custom-select"
        :class="{ 'flex-1': hasButton }"
        :options="options"
        :filter-option="filterOption"
        :get-popup-container="(trigger) => trigger.parentElement"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
      >
        <template #suffixIcon>
          <div class="icon-default-background icon-type-customer"></div>
        </template>
      </a-select>
      <button v-if="hasButton" class="btn-more" @click="handleButtonClick">
        <div class="icon-default icon-other"></div>
      </button>
    </div>
    <div v-if="error" class="ms-selected__error">{{ error }}</div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: undefined,
  },
  options: {
    type: Array,
    required: true,
  },
  placeholder: {
    type: String,
    default: "Chọn giá trị",
  },
  hasButton: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "focus", "blur", "buttonClick"]);

const handleChange = (value) => {
  emit("update:modelValue", value);
};

const handleBlur = () => {
  emit("blur");
};

const handleFocus = () => {
  emit("focus");
};

const handleButtonClick = () => {
  emit("buttonClick");
};

const filterOption = (input, option) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
</script>

<style scoped>
.ms-selected {
  width: 100%;
}

.ms-selected-wrapper {
  display: flex;
  gap: 0;
  width: 100%;
}

.ms-selected--error .custom-select :deep(.ant-select-selector) {
  border-color: #faad14 !important; /* match warning/yellow style */
}

.ms-selected-wrapper .flex-1 :deep(.ant-select-selector) {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.ms-selected__error {
  color: #faad14; /* yellow warning text */
  font-size: 12px;
  margin-top: 4px;
  line-height: 1.5;
}

/* Custom Ant Design Select */
.custom-select {
  width: 100%;
}

.custom-select :deep(.ant-select-selector) {
  height: 31px !important;
  padding: 8px 12px !important;
  border-radius: 4px !important;
  display: flex !important;
  align-items: center !important;
}

.custom-select :deep(.ant-select-selection-search-input) {
  height: 100% !important;
}

.custom-select :deep(.ant-select-selection-item) {
  line-height: 20px !important;
}

.flex-1 {
  flex: 1;
}
.btn-more {
  width: 36px;
  height: 31px;
  border: 1px solid #e0e0e0;
  border-left: none;
  background: #f5f5f5;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  flex-shrink: 0;
}

.btn-more:hover {
  background: #e0e0e0;
}
</style>
