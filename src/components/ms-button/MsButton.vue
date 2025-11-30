<template>
  <button :class="['ms-button', `ms-button--${type}`]">
    <div class="ms-button__main">
      <i
        v-if="icon && positionIcon === 'left'"
        :class="[
          'ms-button__icon',
          'ms-button__icon--left',
          `icon-default`,
          `icon-${icon}`,
        ]"
      ></i>
      <span class="ms-button__content"><slot /></span>
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
}
.ms-button--primary {
  background-color: #1976d2;
  color: white;
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
