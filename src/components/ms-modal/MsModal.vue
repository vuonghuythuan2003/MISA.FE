<template>
  <div v-if="modelValue" class="ms-modal-overlay">
    <div class="ms-modal" :style="{ width }">
      <div class="ms-modal-header">
        <span class="ms-modal-title">{{ title }}</span>
        <button class="ms-modal-close" @click="$emit('update:modelValue', false)">×</button>
      </div>
      <div class="ms-modal-body">
        <slot></slot>
      </div>
      <div v-if="footer !== null" class="ms-modal-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
const props = defineProps({
  modelValue: Boolean,
  title: String,
  centered: Boolean,
  footer: {
    type: [Object, null],
    default: null
  },
  width: {
    type: String,
    default: '400px'
  }
});
const emit = defineEmits(['update:modelValue']);
</script>

<style scoped>
.ms-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.ms-modal {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.15);
  min-width: 320px;
  max-width: 90vw;
  padding: 0;
  overflow: hidden;
}
.ms-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px 8px 24px;
  border-bottom: 1px solid #eee;
}
.ms-modal-title {
  font-size: 18px;
  font-weight: 600;
}
.ms-modal-close {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: #888;
}
.ms-modal-body {
  padding: 16px 24px;
}
.ms-modal-footer {
  padding: 12px 24px;
  border-top: 1px solid #eee;
  text-align: right;
}
</style>
