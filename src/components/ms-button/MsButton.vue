<template>
  <button :class="['ms-button', `ms-button--${type}`]">
    <div class="ms-button__main">
      <!-- Slot cho icon tùy chỉnh bên trái -->
      <span v-if="$slots['icon-left']" class="ms-button__icon ms-button__icon--left">
        <slot name="icon-left"></slot>
      </span>
      <i
        v-else-if="icon && positionIcon === 'left'"
        :class="[
          'ms-button__icon',
          'ms-button__icon--left',
          `icon-default`,
          `icon-${icon}`,
        ]"
      ></i>
      <span v-if="$slots.default" class="ms-button__content"><slot /></span>
      <i
        v-if="icon && positionIcon === 'right'"
        :class="[
          'ms-button__icon',
          'ms-button__icon--right',
          `icon-default`,
          `icon-${icon}`,
        ]"
      ></i>
    </div>
    <slot name="icon-right"></slot>
  </button>
</template>
<style scoped>
.ms-button {
  display: inline-flex;
  align-items: center;
  padding: 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  overflow: hidden;
  height: 36px;
}

.ms-button__main {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  height: 100%;
  width: 100%;
  justify-content: center;
}
.ms-button--primary {
  background-color: #4262F0;
  color: white;
  width: 57px;
  height: 32px;
}

.ms-button--secondary {
  background-color: #fff;
  color: #1f2229;
  border: 1px solid #d3d7de;
  min-width: 78px;
  height: 32px;
  line-height: 20px !important;
  border-radius: 4px;
  font-weight: 500 !important;  
  font-size: 13px;
      font-feature-settings: normal;
    font-variant: normal;
    cursor: pointer;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
}

.ms-button--outline-primary {
  color: #4262F0;
  border: 1px solid #4262F0;
  font-feature-settings: normal;
    font-variant: normal;
    cursor: pointer;
    text-align: center;
    white-space: nowrap;
    font-family: "Inter", Arial, Helvetica, sans-serif;
    font-size: 13px;
    background-color: #FFFFFF;
    box-sizing: border-box;
    width: 110px;
    font-weight: 500;
    height: 32px;
}

.ms-button--link {
  background: none;
  color: #1976d2;
  padding: 0;
}

.ms-button--warning {
  background-color: #ff9800;
  color: white;
}

.ms-button--danger {
  background-color: #dc3545;
  color: white;
}

.ms-button--icon-only {
  width: 28px;
  height: 28px;
  min-width: 28px;
  padding: 0;
  background-color: transparent;
  border: none;
}

.ms-button--icon-only .ms-button__main {
  padding: 0;
  justify-content: center;
}

.ms-button--icon-only:hover {
  background-color: rgba(0, 0, 0, 0.08);
}

.ms-button--icon-only-danger {
  width: 28px;
  height: 28px;
  min-width: 28px;
  padding: 0;
  background-color: transparent;
  border: none;
  color: #ff4d4f;
}

.ms-button--icon-only-danger .ms-button__main {
  padding: 0;
  justify-content: center;
}

.ms-button--icon-only-danger:hover {
  background-color: #fff1f0;
  color: #cf1322;
}

.ms-button__content {
  white-space: nowrap;
}

.ms-button__icon {
  display: inline-flex;
  align-items: center;
}

.ms-button__icon--left {
  margin-right: 8px;
}

.ms-button__icon--right {
  margin-left: 8px;
}
</style>
<script setup>
defineProps({
  icon: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "primary",
  },
  positionIcon: {
    type: String,
    default: "left",
    validator: (value) => ["left", "right"].includes(value),
  },
});
</script>
