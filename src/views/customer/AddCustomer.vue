<script setup>
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import toastr from "toastr";
import MsButton from "../../components/ms-button/MsButton.vue";
import MsInput from "../../components/ms-input/MsInput.vue";
import MsSelected from "../../components/ms-selected/MsSelected.vue";
import MsDate from "../../components/ms-date/MsDate.vue";
import customerAPI from "@/apis/components/CustomerAPI.js";

const router = useRouter();
const isLoading = ref(false);

// Customer type options
const customerTypeOptions = [
  { label: 'NBH01', value: 'NBH01' },
  { label: 'LKHA', value: 'LKHA' },
  { label: 'VIP', value: 'VIP' },
];

// State cho ảnh đại diện
const avatarFile = ref(null);
const avatarPreview = ref(null);
const avatarInput = ref(null);

// Dữ liệu form
const formData = ref({
  customerType: "",
  customerCode: "",
  customerName: "",
  taxCode: "",
  shippingAddress: "",
  phone: "",
  email: "",
  lastPurchaseDate: "",
  purchasedGoods: "",
  purchasedGoodsName: "",
});

// State cho validation errors từ backend
const validationErrors = ref({
  customerType: "",
  customerCode: "",
  customerName: "",
  customerTaxCode: "",
  customerShippingAddress: "",
  customerPhoneNumber: "",
  customerEmail: "",
  lastPurchaseDate: "",
  purchasedItemCode: "",
  purchasedItemName: "",
});

// Clear error khi user nhập dữ liệu
watch(
  () => formData.value.customerType,
  () => {
    validationErrors.value.customerType = "";
  }
);

watch(
  () => formData.value.customerCode,
  () => {
    validationErrors.value.customerCode = "";
  }
);

watch(
  () => formData.value.customerName,
  () => {
    validationErrors.value.customerName = "";
  }
);

watch(
  () => formData.value.taxCode,
  () => {
    validationErrors.value.customerTaxCode = "";
  }
);

watch(
  () => formData.value.shippingAddress,
  () => {
    validationErrors.value.customerShippingAddress = "";
  }
);

watch(
  () => formData.value.phone,
  () => {
    validationErrors.value.customerPhoneNumber = "";
  }
);

watch(
  () => formData.value.email,
  () => {
    validationErrors.value.customerEmail = "";
  }
);

watch(
  () => formData.value.lastPurchaseDate,
  () => {
    validationErrors.value.lastPurchaseDate = "";
  }
);

watch(
  () => formData.value.purchasedGoods,
  () => {
    validationErrors.value.purchasedItemCode = "";
  }
);

watch(
  () => formData.value.purchasedGoodsName,
  () => {
    validationErrors.value.purchasedItemName = "";
  }
);

// Xử lý chọn ảnh
const handleAvatarChange = (event) => {
  const file = event.target.files?.[0];
  if (file) {
    avatarFile.value = file;
    
    // Tạo preview ảnh
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleAvatarClick = () => {
  avatarInput.value?.click();
};

// Xử lý lưu khách hàng
const handleSave = async () => {
  // Reset validation errors
  validationErrors.value = {
    customerType: "",
    customerCode: "",
    customerName: "",
    customerTaxCode: "",
    customerShippingAddress: "",
    customerPhoneNumber: "",
    customerEmail: "",
    lastPurchaseDate: "",
    purchasedItemCode: "",
    purchasedItemName: "",
  };

  try {
    isLoading.value = true;
    
    // Tạo FormData để gửi lên backend (bao gồm cả file ảnh nếu có)
    const formDataWithFile = new FormData();
    
    // Append file ảnh nếu có
    if (avatarFile.value) {
      formDataWithFile.append('file', avatarFile.value);
    }
    
    // Append các trường dữ liệu
    formDataWithFile.append('customerType', formData.value.customerType);
    formDataWithFile.append('customerCode', formData.value.customerCode);
    formDataWithFile.append('customerName', formData.value.customerName);
    formDataWithFile.append('customerTaxCode', formData.value.taxCode);
    formDataWithFile.append('customerShippingAddress', formData.value.shippingAddress);
    formDataWithFile.append('customerPhoneNumber', formData.value.phone);
    formDataWithFile.append('customerEmail', formData.value.email);
    formDataWithFile.append('lastPurchaseDate', formData.value.lastPurchaseDate);
    formDataWithFile.append('purchasedItemCode', formData.value.purchasedGoods);
    formDataWithFile.append('purchasedItemName', formData.value.purchasedGoodsName);

    // Gọi API (backend sẽ tự xử lý validation, parse date, upload ảnh)
    const response = await customerAPI.createWithAvatar(formDataWithFile);
    
    toastr.success(`Đã thêm khách hàng "${formData.value.customerName}" thành công`);
    router.push({ path: '/customer', query: { sortBy: 'customerCode', order: 'desc' } });
  } catch (error) {
    console.error('Lỗi khi thêm khách hàng:', error);    
    // Hiển thị lỗi từ backend dưới các ô input
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      console.log('Errors từ backend:', errors);
      
      // Map field name từ backend sang frontend state
      const fieldMapping = {
        'CustomerType': 'customerType',
        'CustomerCode': 'customerCode',
        'CustomerName': 'customerName',
        'CustomerTaxCode': 'customerTaxCode',
        'CustomerShippingAddress': 'customerShippingAddress',
        'CustomerPhoneNumber': 'customerPhoneNumber',
        'CustomerEmail': 'customerEmail',
        'LastPurchaseDate': 'lastPurchaseDate',
        'PurchasedItemCode': 'purchasedItemCode',
        'PurchasedItemName': 'purchasedItemName',
      };
      
      for (const [field, messages] of Object.entries(errors)) {
        const errorMessage = Array.isArray(messages) ? messages[0] : messages;
        const frontendField = fieldMapping[field] || field.charAt(0).toLowerCase() + field.slice(1);
        
        console.log(`Setting ${frontendField} = ${errorMessage}`);
        
        if (validationErrors.value.hasOwnProperty(frontendField)) {
          validationErrors.value[frontendField] = errorMessage;
        } else {
          console.warn(`Field ${frontendField} không tồn tại trong validationErrors`);
        }
      }
      
      console.log('validationErrors sau khi set:', validationErrors.value);
      toastr.error('Vui lòng kiểm tra lại thông tin nhập vào');
    } else if (error.response?.data?.message) {
      toastr.error(error.response.data.message);
    } else {
      toastr.error('Không thể thêm khách hàng. Vui lòng kiểm tra lại thông tin.');
    }
  } finally {
    isLoading.value = false;
  }
};

// Xử lý lưu và thêm tiếp
const handleSaveAndAdd = async () => {
  // Reset validation errors
  validationErrors.value = {
    customerType: "",
    customerCode: "",
    customerName: "",
    customerTaxCode: "",
    customerShippingAddress: "",
    customerPhoneNumber: "",
    customerEmail: "",
    lastPurchaseDate: "",
    purchasedItemCode: "",
    purchasedItemName: "",
  };

  try {
    isLoading.value = true;
    
    // Tạo FormData để gửi lên backend (bao gồm cả file ảnh nếu có)
    const formDataWithFile = new FormData();
    
    // Append file ảnh nếu có
    if (avatarFile.value) {
      formDataWithFile.append('file', avatarFile.value);
    }
    
    // Append các trường dữ liệu
    formDataWithFile.append('customerType', formData.value.customerType);
    formDataWithFile.append('customerCode', formData.value.customerCode);
    formDataWithFile.append('customerName', formData.value.customerName);
    formDataWithFile.append('customerTaxCode', formData.value.taxCode);
    formDataWithFile.append('customerShippingAddress', formData.value.shippingAddress);
    formDataWithFile.append('customerPhoneNumber', formData.value.phone);
    formDataWithFile.append('customerEmail', formData.value.email);
    formDataWithFile.append('lastPurchaseDate', formData.value.lastPurchaseDate);
    formDataWithFile.append('purchasedItemCode', formData.value.purchasedGoods);
    formDataWithFile.append('purchasedItemName', formData.value.purchasedGoodsName);

    // Gọi API (backend sẽ tự xử lý validation, parse date, upload ảnh)
    const response = await customerAPI.createWithAvatar(formDataWithFile);
    
    toastr.success(`Đã thêm khách hàng "${formData.value.customerName}" thành công`);
    
    // Reset form cho việc thêm tiếp
    formData.value = {
      customerType: "",
      customerCode: "",
      customerName: "",
      taxCode: "",
      shippingAddress: "",
      phone: "",
      email: "",
      lastPurchaseDate: "",
      purchasedGoods: "",
      purchasedGoodsName: "",
    };
    avatarFile.value = null;
    avatarPreview.value = null;
    
    // Gọi API sinh mã mới cho khách hàng tiếp theo
    generateCustomerCode();
  } catch (error) {
    console.error('Lỗi khi thêm khách hàng:', error);
    
    // Hiển thị lỗi từ backend dưới các ô input
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      
      // Map field name từ backend sang frontend state
      const fieldMapping = {
        'CustomerType': 'customerType',
        'CustomerCode': 'customerCode',
        'CustomerName': 'customerName',
        'CustomerTaxCode': 'customerTaxCode',
        'CustomerShippingAddress': 'customerShippingAddress',
        'CustomerPhoneNumber': 'customerPhoneNumber',
        'CustomerEmail': 'customerEmail',
        'LastPurchaseDate': 'lastPurchaseDate',
        'PurchasedItemCode': 'purchasedItemCode',
        'PurchasedItemName': 'purchasedItemName',
      };
      
      for (const [field, messages] of Object.entries(errors)) {
        const errorMessage = Array.isArray(messages) ? messages[0] : messages;
        const frontendField = fieldMapping[field] || field.charAt(0).toLowerCase() + field.slice(1);
        
        if (validationErrors.value.hasOwnProperty(frontendField)) {
          validationErrors.value[frontendField] = errorMessage;
        }
      }
      
      toastr.error('Vui lòng kiểm tra lại thông tin nhập vào');
    } else if (error.response?.data?.message) {
      toastr.error(error.response.data.message);
    } else {
      toastr.error('Không thể thêm khách hàng. Vui lòng kiểm tra lại thông tin.');
    }
  } finally {
    isLoading.value = false;
  }
};

// Sinh mã khách hàng
const generateCustomerCode = async () => {
  try {
    const response = await customerAPI.generateNewCode();
    const codeData = response.data;
    
    // Log để debug
    console.log('Code response:', codeData);
    
    // Nếu codeData là string, dùng trực tiếp
    // Nếu là object, lấy property 'data' hoặc 'code' hoặc các tên khác
    let code = '';
    if (typeof codeData === 'string') {
      code = codeData;
    } else if (codeData && typeof codeData === 'object') {
      // Thử các property phổ biến
      code = codeData.data || codeData.code || codeData.customerCode || '';
    }
    
    formData.value.customerCode = code || 'KH001'; // Fallback value
  } catch (error) {
    console.error('Lỗi khi generate mã khách hàng:', error);
    formData.value.customerCode = 'KH001'; // Fallback
  }
};

// Đặt tiêu đề tab trình duyệt khi vào trang
onMounted(() => {
  document.title = "Thêm Khách hàng";
  generateCustomerCode();
});
</script>
<template>
  <div class="container-add-customer">
    <!-- Thanh công cụ -->
    <div class="toolbar flex-row flex-space-between">
      <!-- Bố cục thanh công cụ (phần trái) -->
      <div class="toolbar-left flex-row align-center">
        <!-- Tiêu đề Khách hàng -->
        <h1 class="page-title">Thêm Khách hàng</h1>
        <div class="dropdown-trigger flex-row align-center">
          <span class="template-name">Mẫu tiêu chuẩn</span>
          <div class="icon-default icon-down"></div>
        </div>
        <a href="#" class="edit-layout-link">Sửa bố cục</a>
      </div>
      <!-- Bố cục thanh công cụ (phần phải) -->
      <div class="toolbar-right flex-row align-center">
        <MsButton type="secondary" @click="router.back()">Hủy bỏ</MsButton>
        <MsButton type="outline-primary" @click="handleSaveAndAdd" :disabled="isLoading">Lưu và thêm</MsButton>
        <MsButton type="primary" @click="handleSave" :disabled="isLoading">Lưu</MsButton>
      </div>
    </div>

    <!-- Nội dung trang -->
    <div class="page-content">
      <!-- Phần ảnh đại diện -->
      <div class="section-image">
        <div class="title-image">Ảnh</div>
        <div class="avatar-wrapper" @click="handleAvatarClick">
          <img v-if="avatarPreview" :src="avatarPreview" alt="Avatar preview" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;" />
          <div v-else class="icon-default-background icon-image-customer"></div>
          <input 
            type="file" 
            accept="image/*" 
            @change="handleAvatarChange"
            style="display: none;"
            ref="avatarInput"
          />
        </div>
      </div>

      <!-- Phần thông tin chung -->
      <div class="general-info-section">
        <div class="section-title">Thông tin chung</div>

        <div class="form-grid">
          <!-- Cột trái -->
          <div class="col-left">
            <div class="form-item flex-row align-center">
              <label class="form-label">Loại khách hàng <span class="required">*</span></label>
              <div class="input-wrapper">
                <MsSelected
                  v-model="formData.customerType"
                  :options="customerTypeOptions"
                  :error="validationErrors.customerType"
                  placeholder="- Chọn loại khách hàng -"
                />
              </div>
            </div>

            <div class="form-item flex-row align-center">
              <label class="form-label">Mã khách hàng <span class="required">*</span></label>
              <div class="input-wrapper">
                <MsInput
                  v-model="formData.customerCode"
                  placeholder="Mã tự sinh"
                  :error="validationErrors.customerCode"
                  :readonly="true"
                />
              </div>
            </div>

            <div class="form-item flex-row align-center">
              <label class="form-label">Tên khách hàng <span class="required">*</span></label>
              <div class="input-wrapper">
                <MsInput
                  v-model="formData.customerName"
                  :required="true"
                  :error="validationErrors.customerName"
                />
              </div>
            </div>

            <div class="form-item flex-row align-center">
              <label class="form-label">Điện thoại <span class="required">*</span></label>
              <div class="input-wrapper">
                <MsInput
                  v-model="formData.phone"
                  type="tel"
                  :error="validationErrors.customerPhoneNumber"
                />
              </div>
            </div>

            <div class="form-item flex-row align-center">
              <label class="form-label">Email <span class="required">*</span></label>
              <div class="input-wrapper">
                <MsInput
                  v-model="formData.email"
                  type="email"
                  :error="validationErrors.customerEmail"
                />
              </div>
            </div>
          </div>

          <!-- Cột phải -->
          <div class="col-right">
            <div class="form-item flex-row align-center">
              <label class="form-label">Mã số thuế <span class="required">*</span></label>
              <div class="input-wrapper">
                <MsInput
                  v-model="formData.taxCode"
                  :error="validationErrors.customerTaxCode"
                />
              </div>
            </div>

            <div class="form-item flex-row align-center">
              <label class="form-label">Địa chỉ giao hàng <span class="required">*</span></label>
              <div class="input-wrapper">
                <MsInput
                  v-model="formData.shippingAddress"
                  :error="validationErrors.customerShippingAddress"
                />
              </div>
            </div>

            <div class="form-item flex-row align-center">
              <label class="form-label">Ngày mua hàng gần nhất</label>
              <div class="input-wrapper">
                <MsDate
                  v-model="formData.lastPurchaseDate"
                  :error="validationErrors.lastPurchaseDate"
                  placeholder="dd/mm/yyyy"
                  format="DD/MM/YYYY"
                />
              </div>
            </div>

            <div class="form-item flex-row align-center">
              <label class="form-label">Hàng hóa đã mua</label>
              <div class="input-wrapper">
                <MsInput
                  v-model="formData.purchasedGoods"
                />
              </div>
            </div>

            <div class="form-item flex-row align-center">
              <label class="form-label">Tên hàng hóa đã mua</label>
              <div class="input-wrapper">
                <MsInput
                  v-model="formData.purchasedGoodsName"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container-add-customer {
  background-color: #f5f5f5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.toolbar {
  min-height: 56px;
  max-height: 56px;
  background: #e2e4e9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.toolbar-left {
  height: 56px;
  display: flex;
  align-items: center;
}

.page-title {
  font-weight: 500;
  font-size: 20px;
  font-family: Inter, sans-serif;
  padding: 0;
  color: #1f2229;
  margin-left: 16px;
  margin-right: 16px;
  margin-top: 5px;
}

.dropdown-trigger {
  cursor: pointer;
}

.template-name {
  font-weight: 500;
  font-size: 16px;
  color: #1f2229;
  font-family: Inter, sans-serif;
}

.edit-layout-link {
  margin: 0;
  font-size: 13px;
  font-family: Inter, sans-serif;
  box-shadow: none;
  font-weight: 400;
  border-radius: 0;
  color: #4262f0 !important;
  text-decoration: none !important;
  margin-left: 10px;
}

.edit-layout-link:hover {
  text-decoration: underline !important;
}

.toolbar-right {
  gap: 10px;
  margin-right: 3px;
  display: flex;
  align-items: center;
}

.page-content {
  padding: 32px;
  background-color: #ffffff;
  flex: 1;
  overflow-y: auto;
}

/* Phần ảnh */
.section-image {
  background: transparent;
  margin-bottom: 16px;
  margin-left: 24px;
}

.title-image {
  font-size: 18px !important;
  display: block;
  margin-bottom: 16px;
  font-weight: 500;
  font-family: Inter, sans-serif;
  color: #1f2229;
}

.icon-image-customer {
  width: 48px;
  height: 48px;
  background-color: #ffffff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
}

.avatar-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
  cursor: pointer;
  overflow: hidden;
}

/* Phần thông tin chung */
.general-info-section {
  background-color: #ffffff;
  padding: 0 24px 40px;
  margin-top: 40px;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  font-family: Inter, sans-serif;
  color: #1f2229;
  margin: 20px 0 20px 0;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  padding-right: 0;
}

.col-left,
.col-right {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.form-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
  justify-content: flex-start;
}

.form-label {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: 500;
  font-size: 13px;
  font-family: Inter, sans-serif;
  display: inline-flex;
  align-items: center;
  width: 160px;
  min-width: 160px;
  flex: 0 0 160px;
  color: #1f2229;
  padding-top: 8px;
}

.col-right .form-label {
  width: 160px;
  min-width: 160px;
  flex: 0 0 160px;
}

.icon-info {
  font-size: 12px;
  color: #7c869c;
  margin-left: 4px;
  cursor: help;
}

.input-wrapper {
  flex: 1 1 auto;
  margin-bottom: 0;
  position: relative;
}

/* Ghi đè style của MsInput để phù hợp với form */
.input-wrapper :deep(.ms-input) {
  gap: 0;
}

.input-wrapper :deep(.ms-input__label) {
  display: none;
}

.input-wrapper :deep(.ms-input__field) {
  height: 32px;
  padding: 6px 12px;
  font-size: 13px;
  border-radius: 4px;
  background-color: #ffffff;
  border: 1px solid #dfe4ea;
}

.input-wrapper :deep(.ms-input__message) {
  display: block; 
  margin-top: 4px;
}

/* Ghi đè style của MsDate để phù hợp với form */
.input-wrapper :deep(.input-container) {
  gap: 0;
}

.input-wrapper :deep(.date-picker-custom .ant-picker) {
  height: 32px;
  padding: 6px 12px;
  font-size: 13px;
  border-radius: 4px;
  background-color: #ffffff;
  border: 1px solid #dfe4ea;
}

.input-wrapper :deep(.date-picker-custom .ant-picker:hover) {
  border-color: #bfc5cc;
}

.input-wrapper :deep(.date-picker-custom .ant-picker-focused) {
  border-color: #4262f0;
  box-shadow: 0 0 0 2px rgba(66, 98, 240, 0.1);
}

.input-wrapper :deep(.date-picker-custom .ant-picker-input > input) {
  font-size: 13px;
  color: #1f2229;
  font-family: Inter, sans-serif;
}

.input-wrapper :deep(.date-picker-custom .ant-picker-input > input::placeholder) {
  color: #9da5b1;
}

.combo-box {
  position: relative;
}

.icon-combo-box {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.m-input {
  width: 100%;
  padding: 6px 12px;
  height: 32px;
  box-sizing: border-box;
  font-size: 13px;
  background-color: #fff;
  border: 1px solid #dfe4ea;
  border-radius: 4px;
  color: #1f2229;
  font-family: Inter, sans-serif;
}

.combo-box .m-input {
  padding-right: 32px;
  cursor: pointer;
}

.m-textarea {
  width: 100%;
  padding: 8px 12px;
  box-sizing: border-box;
  font-size: 13px;
  background-color: #fff;
  border: 1px solid #dfe4ea;
  border-radius: 4px;
  color: #1f2229;
  font-family: Inter, sans-serif;
  resize: vertical;
  min-height: 80px;
}

.m-input::placeholder,
.m-textarea::placeholder {
  color: #9da5b1;
}

.m-input:focus,
.m-textarea:focus {
  outline: none;
  border-color: #4262f0;
  box-shadow: 0 0 0 2px rgba(66, 98, 240, 0.1);
}

.m-input:hover,
.m-textarea:hover {
  border-color: #bfc5cc;
}

.required {
  color: #e53935;
  margin-left: 2px;
}

/* Flex utilities */
.flex-row {
  display: flex;
  flex-direction: row;
}

.flex-space-between {
  justify-content: space-between;
}

.align-center {
  align-items: center;
}

.icon-down {
  margin-left: 7px;
}
</style>
