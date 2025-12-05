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
      @update:file-list="val => fileList.value = val"
      name="file"
      :multiple="false"
      :accept="'.csv'"
      :custom-request="handleUpload"
      @change="handleChange"
      @drop="handleDrop"
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
import customerAPI from '@/apis/components/CustomerAPI.js';

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
const emit = defineEmits(['update:open', 'uploaded']);

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
    message.success(`Nhập tệp ${info.file.name} thành công.`);
  } else if (status === 'error') {
    message.error(`Nhập tệp ${info.file.name} thất bại.`);
  }
};

// Upload CSV qua API customer/import
const handleUpload = async ({ file, onSuccess, onError }) => {
  try {
    await customerAPI.importFromCsv(file);
    onSuccess && onSuccess({});
    message.success(`Nhập tệp ${file.name} thành công.`);
    emit('uploaded');
    handleClose();
  } catch (err) {
    console.error('Upload CSV error:', err);
    message.error(`Nhập tệp ${file.name} thất bại.`);
    onError && onError(err);
  }
};

// Xử lý sự kiện kéo thả file
function handleDrop(e) {
  console.log(e);
}
</script>