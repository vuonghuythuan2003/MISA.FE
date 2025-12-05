<template>
  <Teleport to="body">
    <Transition name="popup-fade">
      <div v-if="visible" class="ms-popup-overlay" @click="handleOverlayClick">
        <Transition name="popup-scale">
          <div
            v-if="visible"
            class="ms-popup"
            :class="[`ms-popup--${size}`]"
            :style="{ width: customWidth }"
            @click.stop
          >
            <!-- Header -->
            <div class="ms-popup__header">
              <div class="ms-popup__title">
                <slot name="title">{{ title }}</slot>
              </div>
              <button
                v-if="showClose"
                class="ms-popup__close"
                @click="handleClose"
              >
                <div class="icon-default icon-close"></div>
              </button>
            </div>

            <!-- Body -->
            <div class="ms-popup__body" :class="{ 'ms-popup__body--no-padding': noPadding }">
              <slot></slot>
            </div>

            <!-- Footer -->
            <div v-if="showFooter" class="ms-popup__footer">
              <slot name="footer">
                <button
                  v-if="showCancel"
                  class="ms-popup__btn ms-popup__btn--cancel"
                  @click="handleCancel"
                >
                  {{ cancelText }}
                </button>
                <button
                  v-if="showConfirm"
                  class="ms-popup__btn ms-popup__btn--confirm"
                  :disabled="confirmDisabled"
                  @click="handleConfirm"
                >
                  {{ confirmText }}
                </button>
              </slot>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { watch, onMounted, onUnmounted } from "vue";

const props = defineProps({
  // v-model:visible
  visible: {
    type: Boolean,
    default: false,
  },
  // Tiêu đề popup
  title: {
    type: String,
    default: "Thông báo",
  },
  // Kích thước popup: small, medium, large, full
  size: {
    type: String,
    default: "medium",
    validator: (value) => ["small", "medium", "large", "full"].includes(value),
  },
  // Custom width (ưu tiên hơn size)
  customWidth: {
    type: String,
    default: "",
  },
  // Hiển thị nút close
  showClose: {
    type: Boolean,
    default: true,
  },
  // Hiển thị footer
  showFooter: {
    type: Boolean,
    default: true,
  },
  // Hiển thị nút cancel
  showCancel: {
    type: Boolean,
    default: true,
  },
  // Hiển thị nút confirm
  showConfirm: {
    type: Boolean,
    default: true,
  },
  // Text nút cancel
  cancelText: {
    type: String,
    default: "Hủy",
  },
  // Text nút confirm
  confirmText: {
    type: String,
    default: "Đồng ý",
  },
  // Disable nút confirm
  confirmDisabled: {
    type: Boolean,
    default: false,
  },
  // Đóng popup khi click overlay
  closeOnClickOverlay: {
    type: Boolean,
    default: false,
  },
  // Đóng popup khi nhấn ESC
  closeOnEsc: {
    type: Boolean,
    default: true,
  },
  // Bỏ padding body
  noPadding: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  "update:visible",
  "close",
  "cancel",
  "confirm",
  "open",
]);

// Xử lý click overlay
const handleOverlayClick = () => {
  if (props.closeOnClickOverlay) {
    handleClose();
  }
};

// Xử lý đóng popup
const handleClose = () => {
  emit("update:visible", false);
  emit("close");
};

// Xử lý nút cancel
const handleCancel = () => {
  emit("cancel");
  handleClose();
};

// Xử lý nút confirm
const handleConfirm = () => {
  emit("confirm");
};

// Xử lý phím ESC
const handleKeydown = (e) => {
  if (e.key === "Escape" && props.closeOnEsc && props.visible) {
    handleClose();
  }
};

// Watch visible để emit event open
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      emit("open");
      // Prevent body scroll when popup is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }
);

// Lắng nghe sự kiện keydown
onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
  document.body.style.overflow = "";
});
</script>

<style scoped>
/* Overlay */
.ms-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* Popup container */
.ms-popup {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  max-width: 95vw;
}

/* Popup sizes */
.ms-popup--small {
  width: 400px;
}

.ms-popup--medium {
  width: 600px;
}

.ms-popup--large {
  width: 900px;
}

.ms-popup--full {
  width: 95vw;
  height: 90vh;
}

/* Header */
.ms-popup__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
  flex-shrink: 0;
}

.ms-popup__title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2229;
  line-height: 24px;
}

.ms-popup__close {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.ms-popup__close:hover {
  background-color: #f5f5f5;
}

.ms-popup__close .icon-close {
  mask-position: -64px -16px;
  mask-repeat: no-repeat;
  width: 16px;
  height: 16px;
  background-color: #666;
}

.ms-popup__close:hover .icon-close {
  background-color: #333;
}

/* Body */
.ms-popup__body {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
}

.ms-popup__body--no-padding {
  padding: 0;
}

/* Footer */
.ms-popup__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #e0e0e0;
  flex-shrink: 0;
}

/* Buttons */
.ms-popup__btn {
  min-width: 80px;
  height: 32px;
  padding: 0 16px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ms-popup__btn--cancel {
  background-color: #fff;
  color: #1f2229;
  border: 1px solid #d3d7de;
}

.ms-popup__btn--cancel:hover {
  background-color: #f5f5f5;
  border-color: #c0c4cc;
}

.ms-popup__btn--confirm {
  background-color: #4262f0;
  color: #fff;
  border: 1px solid #4262f0;
}

.ms-popup__btn--confirm:hover {
  background-color: #3451d1;
  border-color: #3451d1;
}

.ms-popup__btn--confirm:disabled {
  background-color: #a0b0f0;
  border-color: #a0b0f0;
  cursor: not-allowed;
}

/* Animations */
.popup-fade-enter-active,
.popup-fade-leave-active {
  transition: opacity 0.25s ease;
}

.popup-fade-enter-from,
.popup-fade-leave-to {
  opacity: 0;
}

.popup-scale-enter-active {
  transition: all 0.25s ease-out;
}

.popup-scale-leave-active {
  transition: all 0.2s ease-in;
}

.popup-scale-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.popup-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Scrollbar styling */
.ms-popup__body::-webkit-scrollbar {
  width: 6px;
}

.ms-popup__body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.ms-popup__body::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.ms-popup__body::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
