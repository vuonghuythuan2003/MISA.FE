<template>
  <div
    class="ms-input"
    :class="{ 'ms-input--error': error, 'ms-input--disabled': disabled }"
  >
    <label v-if="label" class="ms-input__label" :for="inputId">
      {{ label }}
      <span v-if="required" class="ms-input__required">*</span>
    </label>

    <div class="ms-input__wrapper">
      <div v-if="prefixIcon" class="ms-input__prefix">
        <i :class="['icon-default', `icon-${prefixIcon}`]"></i>
      </div>

      <input
        :id="inputId"
        ref="inputRef"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :min="min"
        :max="max"
        :step="step"
        :autocomplete="autocomplete"
        class="ms-input__field"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @keypress="handleKeypress"
      />

      <div
        v-if="suffixIcon || (clearable && modelValue)"
        class="ms-input__suffix"
      >
        <i
          v-if="clearable && modelValue && !disabled"
          class="icon-default icon-close ms-input__clear"
          @click="handleClear"
        ></i>
        <i
          v-else-if="suffixIcon"
          :class="['icon-default', `icon-${suffixIcon}`]"
        ></i>
      </div>
    </div>

    <div v-if="error || helperText" class="ms-input__message">
      <span v-if="error" class="ms-input__error">{{ error }}</span>
      <span v-else class="ms-input__helper">{{ helperText }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

//#region Thuộc tính
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  type: {
    type: String,
    default: "text",
    validator: (value) =>
      ["text", "password", "email", "number", "tel", "url", "search"].includes(
        value
      ),
  },
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: "",
  },
  helperText: {
    type: String,
    default: "",
  },
  prefixIcon: {
    type: String,
    default: "",
  },
  suffixIcon: {
    type: String,
    default: "",
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  maxlength: {
    type: [String, Number],
    // Mặc định cho phép nhập tối đa 300 ký tự để phù hợp các cột varchar(255+)
    default: 300,
  },
  min: {
    type: [String, Number],
    default: undefined,
  },
  max: {
    type: [String, Number],
    default: undefined,
  },
  step: {
    type: [String, Number],
    default: undefined,
  },
  autocomplete: {
    type: String,
    default: "off",
  },
});
//#endregion

//#region Sự kiện
const emit = defineEmits([
  "update:modelValue",
  "blur",
  "focus",
  "clear",
  "keypress",
]);
//#endregion

//#region Dữ liệu
const inputRef = ref(null);
const inputId = computed(
  () => `ms-input-${Math.random().toString(36).substr(2, 9)}`
);
//#endregion

//#region Phương thức
/**
 * Xử lý sự kiện input
 * @param event
 */
const handleInput = (event) => {
  emit("update:modelValue", event.target.value);
};

/**
 * Xử lý sự kiện blur
 * @param event
 */
const handleBlur = (event) => {
  emit("blur", event);
};

/**
 * Xử lý sự kiện focus
 * @param event
 */
const handleFocus = (event) => {
  emit("focus", event);
};

/**
 * Xử lý sự kiện keypress
 * @param event
 */
const handleKeypress = (event) => {
  emit("keypress", event);
};

/**
 * Xử lý xóa nội dung
 */
const handleClear = () => {
  emit("update:modelValue", "");
  emit("clear");
  inputRef.value?.focus();
};

/**
 * Focus vào input (public method)
 */
const focus = () => {
  inputRef.value?.focus();
};

/**
 * Blur input (public method)
 */
const blur = () => {
  inputRef.value?.blur();
};
//#endregion

// Xuất các phương thức công khai
defineExpose({
  focus,
  blur,
});
</script>

<style scoped>
.ms-input {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.ms-input__label {
  font-size: 14px;
  font-weight: 500;
  color: #1e2633;
  margin-bottom: 2px;
}

.ms-input__required {
  color: #f44336;
  margin-left: 2px;
}

.ms-input__wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.ms-input__prefix,
.ms-input__suffix {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8c8c8c;
  font-size: 16px;
  z-index: 1;
}

.ms-input__prefix {
  left: 12px;
}

.ms-input__suffix {
  right: 12px;
}

.ms-input__clear {
  cursor: pointer;
  transition: color 0.2s;
}

.ms-input__clear:hover {
  color: #1e2633;
}

.ms-input__field {
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  font-family: Inter, sans-serif;
  color: #1e2633;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  outline: none;
  transition: all 0.2s;
}

.ms-input__field:hover:not(:disabled) {
  border-color: #4569d6;
}

.ms-input__field:focus {
  border-color: #2680eb;
  box-shadow: 0 0 0 3px rgba(38, 128, 235, 0.1);
}

.ms-input__field::placeholder {
  color: #8c8c8c;
}

.ms-input__field:disabled {
  background-color: #f5f5f5;
  color: #bdbdbd;
  cursor: not-allowed;
}

.ms-input__prefix + .ms-input__field {
  padding-left: 40px;
}

.ms-input:has(.ms-input__suffix) .ms-input__field {
  padding-right: 40px;
}

.ms-input__message {
  font-size: 12px;
  min-height: 18px;
}

.ms-input__error {
  color: #e53935;
}

.ms-input__helper {
  color: #757575;
}

.ms-input--error .ms-input__field {
  border-color: #e53935;
}

.ms-input--error .ms-input__field:focus {
  border-color: #e53935;
  box-shadow: 0 0 0 3px rgba(229, 57, 53, 0.1);
}

.ms-input--disabled {
  opacity: 0.6;
  pointer-events: none;
}
</style>
