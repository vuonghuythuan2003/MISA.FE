<template>
  <transition name="toast-fade">
    <div v-if="visible" :class="['ms-toast', `ms-toast--${type}`]">
      <div class="ms-toast__icon">
        <div
          v-if="type === 'success'"
          class="icon-default icon-check-circle"
        ></div>
        <div
          v-if="type === 'error'"
          class="icon-default icon-error-circle"
        ></div>
        <div
          v-if="type === 'warning'"
          class="icon-default icon-warning-circle"
        ></div>
        <div v-if="type === 'info'" class="icon-default icon-info-circle"></div>
      </div>
      <div class="ms-toast__content">
        <div class="ms-toast__message">{{ message }}</div>
      </div>
      <button class="ms-toast__close" @click="close">
        <div class="icon-default icon-close"></div>
      </button>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "success",
    validator: (value) =>
      ["success", "error", "warning", "info"].includes(value),
  },
  duration: {
    type: Number,
    default: 3000,
  },
});

const emit = defineEmits(["close"]);

const visible = ref(false);
let timer = null;

onMounted(() => {
  visible.value = true;
  if (props.duration > 0) {
    timer = setTimeout(() => {
      close();
    }, props.duration);
  }
});

const close = () => {
  visible.value = false;
  if (timer) {
    clearTimeout(timer);
  }
  setTimeout(() => {
    emit("close");
  }, 300);
};
</script>

<style scoped>
.ms-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  min-width: 320px;
  max-width: 400px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 10000;
  border-left: 4px solid;
}

.ms-toast--success {
  border-left-color: #52c41a;
}

.ms-toast--error {
  border-left-color: #ff4d4f;
}

.ms-toast--warning {
  border-left-color: #faad14;
}

.ms-toast--info {
  border-left-color: #1890ff;
}

.ms-toast__icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
}

.ms-toast--success .icon-default {
  background-color: #52c41a;
}

.ms-toast--error .icon-default {
  background-color: #ff4d4f;
}

.ms-toast--warning .icon-default {
  background-color: #faad14;
}

.ms-toast--info .icon-default {
  background-color: #1890ff;
}

.ms-toast__content {
  flex: 1;
}

.ms-toast__message {
  font-size: 14px;
  color: #1e2633;
  font-weight: 500;
  font-family: Inter, Helvetica, sans-serif;
}

.ms-toast__close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ms-toast__close:hover {
  opacity: 0.7;
}

.ms-toast__close .icon-default {
  width: 14px;
  height: 14px;
  background-color: #8c8c8c;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}

.toast-fade-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
