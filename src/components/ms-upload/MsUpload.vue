<template>
  <AModal
    :open="isVisible"
    title="Nhập từ Excel"
    :footer="null"
    :width="500"
    @cancel="handleClose"
    @update:open="val => isVisible = val"
    centered
  >
    <AUploadDragger
      :file-list="fileList"
      name="file"
      :multiple="true"
      :accept="'.xlsx,.xls'"
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      @change="handleChange"
      @drop="handleDrop"
      @update:file-list="val => fileList = val"
    >
      <p class="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p class="ant-upload-text">Nhấp hoặc kéo tệp vào khu vực này để tải lên</p>
      <p class="ant-upload-hint">
        Hỗ trợ tải lên đơn lẻ hoặc hàng loạt. Nghiêm cấm tải lên dữ liệu công ty hoặc các tệp bảng khác
      </p>
    </AUploadDragger>
  </AModal>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Modal, UploadDragger, message } from 'ant-design-vue';
import { InboxOutlined } from '@ant-design/icons-vue';
import 'ant-design-vue/dist/reset.css';

// Định nghĩa component
const AModal = Modal;
const AUploadDragger = UploadDragger;

// Props để nhận trạng thái hiển thị từ component cha
const props = defineProps({
  open: {
    type: Boolean,
    default: false
  }
});

// Emit để gửi sự kiện đóng popup về component cha
const emit = defineEmits(['update:open']);

// Trạng thái hiển thị popup
const isVisible = ref(props.open);

// Theo dõi props.open để đồng bộ trạng thái
watch(() => props.open, (newVal) => {
  isVisible.value = newVal;
});

// Danh sách file đã tải lên
const fileList = ref([]);

// Đóng popup
const handleClose = () => {
  isVisible.value = false;
  emit('update:open', false);
};

// Xử lý sự kiện thay đổi file
const handleChange = info => {
  const status = info.file.status;
  if (status !== 'uploading') {
    console.log(info.file, info.fileList);
  }
  if (status === 'done') {
    message.success(`Tải lên tệp ${info.file.name} thành công.`);
  } else if (status === 'error') {
    message.error(`Tải lên tệp ${info.file.name} thất bại.`);
  }
};

// Xử lý sự kiện kéo thả file
function handleDrop(e) {
  console.log(e);
}
</script>