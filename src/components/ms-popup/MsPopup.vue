<template>
  <Teleport to="body">
    <Transition name="popup">
      <div
        v-if="modelValue"
        class="ms-popup-overlay"
        @click="handleOverlayClick"
      >
        <div
          class="ms-popup"
          :class="[`ms-popup--${size}`, { 'ms-popup--fullscreen': fullscreen }]"
          :style="{ width: customWidth }"
          @click.stop
        >
          <!-- Phần đầu -->
          <div class="ms-popup__header">
            <div class="ms-popup__title">
              <slot name="title">{{ title }}</slot>
            </div>
            <button
              v-if="closable"
              class="ms-popup__close"
              @click="handleClose"
              aria-label="Close"
            >
              <i class="icon-default icon-close"></i>
            </button>
          </div>

          <!-- Nội dung -->
          <div
            class="ms-popup__body"
            :class="{ 'ms-popup__body--no-padding': noPadding }"
          >
            <slot></slot>
          </div>

          <!-- Phần chân -->
          <div v-if="$slots.footer || showFooter" class="ms-popup__footer">
            <slot name="footer">
              <div class="ms-popup__actions">
                <MsButton
                  v-if="showCancel"
                  type="secondary"
                  @click="handleCancel"
                >
                  {{ cancelText }}
                </MsButton>
                <MsButton
                  v-if="showConfirm"
                  type="primary"
                  @click="handleConfirm"
                  :disabled="confirmDisabled"
                >
                  {{ confirmText }}
                </MsButton>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { watch, onMounted, onUnmounted } from "vue";
import MsButton from "../ms-button/MsButton.vue";

//#region Thuộc tính
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "medium",
    validator: (value) => ["small", "medium", "large"].includes(value),
  },
  customWidth: {
    type: String,
    default: "",
  },
  fullscreen: {
    type: Boolean,
    default: false,
  },
  closable: {
    type: Boolean,
    default: true,
  },
  closeOnClickOutside: {
    type: Boolean,
    default: true,
  },
  closeOnEsc: {
    type: Boolean,
    default: true,
  },
  showFooter: {
    type: Boolean,
    default: false,
  },
  showCancel: {
    type: Boolean,
    default: true,
  },
  showConfirm: {
    type: Boolean,
    default: true,
  },
  cancelText: {
    type: String,
    default: "Hủy",
  },
  confirmText: {
    type: String,
    default: "Xác nhận",
  },
  confirmDisabled: {
    type: Boolean,
    default: false,
  },
  noPadding: {
    type: Boolean,
    default: false,
  },
  lockScroll: {
    type: Boolean,
    default: true,
  },
});
//#endregion

//#region Sự kiện
const emit = defineEmits([
  "update:modelValue",
  "close",
  "cancel",
  "confirm",
  "opened",
  "closed",
]);
//#endregion

//#region Phương thức
/**
 * Đóng popup
 */
const handleClose = () => {
  emit("update:modelValue", false);
  emit("close");
};

/**
 * Xử lý click overlay
 */
const handleOverlayClick = () => {
  if (props.closeOnClickOutside) {
    handleClose();
  }
};

/**
 * Xử lý nút hủy
 */
const handleCancel = () => {
  emit("cancel");
  handleClose();
};

/**
 * Xử lý nút xác nhận
 */
const handleConfirm = () => {
  emit("confirm");
};

/**
 * Xử lý phím ESC
 */
const handleEscKey = (event) => {
  if (event.key === "Escape" && props.closeOnEsc && props.modelValue) {
    handleClose();
  }
};
//#endregion

//#region Vòng đời & Watchers
// Khóa cuộn khi popup mở
watch(
  () => props.modelValue,
  (newValue) => {
    if (props.lockScroll) {
      if (newValue) {
        document.body.style.overflow = "hidden";
        emit("opened");
      } else {
        document.body.style.overflow = "";
        emit("closed");
      }
    }
  }
);

// Lắng nghe phím ESC
onMounted(() => {
  document.addEventListener("keydown", handleEscKey);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEscKey);
  if (props.lockScroll) {
    document.body.style.overflow = "";
  }
});
//#endregion
</script>

<style scoped>
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
  z-index: 9999;
  padding: 20px;
}

.ms-popup {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 40px);
  max-width: 100%;
  overflow: hidden;
  font-family: Inter, Helvetica, Arial, sans-serif;
}

/* Kích thước */
.ms-popup--small {
  width: 400px;
}

.ms-popup--medium {
  width: 600px;
}

.ms-popup--large {
  width: 900px;
}

.ms-popup--fullscreen {
  width: 100% !important;
  height: 100%;
  max-height: 100vh;
  border-radius: 0;
}

/* Phần đầu */
.ms-popup__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e6ec;
  flex-shrink: 0;
}

.ms-popup__title {
  font-size: 18px;
  font-weight: 600;
  color: #1e2633;
}

.ms-popup__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background-color: transparent;
  border-radius: 4px;
  cursor: pointer;
  color: #757575;
  transition: all 0.2s;
}

.ms-popup__close:hover {
  background-color: #f5f5f5;
  color: #1e2633;
}

.ms-popup__close .icon-default {
  font-size: 16px;
}

/* Nội dung */
.ms-popup__body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
  color: #1e2633;
  font-size: 14px;
  line-height: 1.6;
}

.ms-popup__body--no-padding {
  padding: 0;
}

/* Thanh cuộn tùy chỉnh */
.ms-popup__body::-webkit-scrollbar {
  width: 6px;
}

.ms-popup__body::-webkit-scrollbar-track {
  background: #f5f5f5;
}

.ms-popup__body::-webkit-scrollbar-thumb {
  background: #bdbdbd;
  border-radius: 3px;
}

.ms-popup__body::-webkit-scrollbar-thumb:hover {
  background: #9e9e9e;
}

/* Phần chân */
.ms-popup__footer {
  padding: 16px 24px;
  border-top: 1px solid #e0e6ec;
  flex-shrink: 0;
}

.ms-popup__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Hiệu ứng chuyển tiếp */
.popup-enter-active,
.popup-leave-active {
  transition: opacity 0.3s ease;
}

.popup-enter-active .ms-popup,
.popup-leave-active .ms-popup {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.popup-enter-from,
.popup-leave-to {
  opacity: 0;
}

.popup-enter-from .ms-popup,
.popup-leave-to .ms-popup {
  transform: scale(0.9);
  opacity: 0;
}

/* Responsive - Điện thoại */
@media (max-width: 768px) {
  .ms-popup-overlay {
    padding: 0;
  }

  .ms-popup {
    width: 100% !important;
    height: 100%;
    max-height: 100vh;
    border-radius: 0;
  }

  .ms-popup__header {
    padding: 16px;
  }

  .ms-popup__body {
    padding: 16px;
  }

  .ms-popup__footer {
    padding: 12px 16px;
  }
}
</style>
