<script setup>
import { onMounted, ref, watch, nextTick } from "vue";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
import toastr from "toastr";
import MsButton from "../../components/ms-button/MsButton.vue";
import MsInput from "../../components/ms-input/MsInput.vue";
import MsSelected from "../../components/ms-selected/MsSelected.vue";
import MsDate from "../../components/ms-date/MsDate.vue";
import customerAPI from "@/apis/components/CustomerAPI.js";

const router = useRouter();
const isLoading = ref(false);

// Danh sách tùy chọn loại khách hàng
const customerTypeOptions = [
  { label: 'NBH01', value: 'NBH01' },
  { label: 'LKHA', value: 'LKHA' },
  { label: 'VIP', value: 'VIP' },
];

// Trạng thái ảnh đại diện
const avatarFile = ref(null);
const avatarPreview = ref(null);
const avatarInput = ref(null);
const customerTypeRef = ref(null);
const customerNameRef = ref(null);
const phoneRef = ref(null);
const emailRef = ref(null);
const taxCodeRef = ref(null);
const shippingAddressRef = ref(null);

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

const toApiDate = (value) => {
  if (!value) return null;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "" || normalized === "null") return null; // allow empty/"null" to be treated as no date
  }
  if (value?.toISOString) return value.toISOString();
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.toISOString() : null;
};

// Trạng thái lỗi validate trả về từ backend
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

// Xóa thông báo lỗi khi người dùng nhập dữ liệu
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

const focusField = (refEl) => {
  if (!refEl) return;
  if (typeof refEl.focus === "function") {
    refEl.focus();
  } else if (refEl?.$el) {
    const inputEl = refEl.$el.querySelector("input");
    inputEl?.focus();
  }
};

const focusFirstInvalid = async () => {
  const order = [
    { key: "customerType", ref: customerTypeRef },
    { key: "customerName", ref: customerNameRef },
    { key: "customerPhoneNumber", ref: phoneRef },
    { key: "customerEmail", ref: emailRef },
    { key: "customerShippingAddress", ref: shippingAddressRef },
    { key: "customerTaxCode", ref: taxCodeRef },
  ];

  await nextTick();
  for (const item of order) {
    if (validationErrors.value[item.key]) {
      focusField(item.ref?.value ?? item.ref);
      break;
    }
  }
};

const validateRequired = () => {
  const checks = [
    { key: "customerType", value: formData.value.customerType, ref: customerTypeRef, message: "Loại khách hàng không được để trống" },
    { key: "customerName", value: formData.value.customerName, ref: customerNameRef, message: "Tên khách hàng không được để trống" },
    { key: "customerPhoneNumber", value: formData.value.phone, ref: phoneRef, message: "Số điện thoại không được để trống" },
    { key: "customerEmail", value: formData.value.email, ref: emailRef, message: "Email không được để trống" },
    { key: "customerShippingAddress", value: formData.value.shippingAddress, ref: shippingAddressRef, message: "Địa chỉ giao hàng không được để trống" },
  ];

  for (const item of checks) {
    if (!item.value || String(item.value).trim() === "") {
      validationErrors.value[item.key] = item.message;
      focusField(item.ref?.value ?? item.ref);
      toastr.error(item.message);
      return false;
    }
  }
  return true;
};

// Xử lý lưu khách hàng
const handleSave = async () => {
  // Xóa trạng thái lỗi hiện tại
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

  if (!validateRequired()) return;

  try {
    isLoading.value = true;
    // Tạo FormData để gửi lên backend (bao gồm cả file ảnh nếu có)
    const formDataWithFile = new FormData();
    if (avatarFile.value) {
      formDataWithFile.append('file', avatarFile.value);
    }
    formDataWithFile.append('customerType', formData.value.customerType);
    formDataWithFile.append('customerCode', formData.value.customerCode);
    formDataWithFile.append('customerName', formData.value.customerName);
    formDataWithFile.append('customerTaxCode', formData.value.taxCode);
    formDataWithFile.append('customerShippingAddress', formData.value.shippingAddress);
    formDataWithFile.append('customerPhoneNumber', formData.value.phone);
    formDataWithFile.append('customerEmail', formData.value.email);
    const apiDate = toApiDate(formData.value.lastPurchaseDate);
    if (apiDate !== null) {
      formDataWithFile.append('lastPurchaseDate', apiDate);
    }
    formDataWithFile.append('purchasedItemCode', formData.value.purchasedGoods);
    formDataWithFile.append('purchasedItemName', formData.value.purchasedGoodsName);

    // Gọi API (backend sẽ tự xử lý validation, parse date, upload ảnh)
    const response = await customerAPI.createWithAvatar(formDataWithFile);
    toastr.success(`Đã thêm khách hàng "${formData.value.customerName}" thành công`);
    router.push({ path: '/customer', query: { sortBy: 'customerCode', order: 'desc' } });
  } catch (error) {
    console.error('Lỗi khi thêm khách hàng:', error);
    // Xử lý lỗi DuplicateEmail/DuplicatePhoneNumber
    // Fix: lấy error từ error.error.code và error.error.message nếu có
    const errorObj = error.response?.data?.error;
    const errorCode = errorObj?.code || error.response?.data?.errorCode;
    const errorMessage = errorObj?.message || error.response?.data?.message;
    if (errorCode === '4001') {
      validationErrors.value.customerEmail = errorMessage || 'Email đã tồn tại trong hệ thống';
      await focusFirstInvalid();
      toastr.error(validationErrors.value.customerEmail);
    } else if (errorCode === '4002') {
      validationErrors.value.customerPhoneNumber = errorMessage || 'Số điện thoại đã tồn tại trong hệ thống';
      await focusFirstInvalid();
      toastr.error(validationErrors.value.customerPhoneNumber);
    } else if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
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
        const msg = Array.isArray(messages) ? messages[0] : messages;
        const frontendField = fieldMapping[field] || field.charAt(0).toLowerCase() + field.slice(1);
        if (validationErrors.value.hasOwnProperty(frontendField)) {
          validationErrors.value[frontendField] = msg;
        }
      }
      toastr.error('Vui lòng kiểm tra lại thông tin nhập vào');
      await focusFirstInvalid();
    } else if (errorMessage) {
      toastr.error(errorMessage);
    } else {
      toastr.error('Không thể thêm khách hàng. Vui lòng kiểm tra lại thông tin.');
    }
  } finally {
    isLoading.value = false;
  }
};

// Xử lý lưu và thêm tiếp
const handleSaveAndAdd = async () => {
  // Xóa trạng thái lỗi hiện tại
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

  if (!validateRequired()) return;

  try {
    isLoading.value = true;
    const formDataWithFile = new FormData();
    if (avatarFile.value) {
      formDataWithFile.append('file', avatarFile.value);
    }
    formDataWithFile.append('customerType', formData.value.customerType);
    formDataWithFile.append('customerCode', formData.value.customerCode);
    formDataWithFile.append('customerName', formData.value.customerName);
    formDataWithFile.append('customerTaxCode', formData.value.taxCode);
    formDataWithFile.append('customerShippingAddress', formData.value.shippingAddress);
    formDataWithFile.append('customerPhoneNumber', formData.value.phone);
    formDataWithFile.append('customerEmail', formData.value.email);
    const apiDate = toApiDate(formData.value.lastPurchaseDate);
    if (apiDate !== null) {
      formDataWithFile.append('lastPurchaseDate', apiDate);
    }
    formDataWithFile.append('purchasedItemCode', formData.value.purchasedGoods);
    formDataWithFile.append('purchasedItemName', formData.value.purchasedGoodsName);

    const response = await customerAPI.createWithAvatar(formDataWithFile);
    toastr.success(`Đã thêm khách hàng "${formData.value.customerName}" thành công`);
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
    generateCustomerCode();
  } catch (error) {
    console.error('Lỗi khi thêm khách hàng:', error);
    const errorCode = error.response?.data?.errorCode;
    const errorMessage = error.response?.data?.message;
    if (errorCode === '4001') {
      validationErrors.value.customerEmail = errorMessage || 'Email đã tồn tại trong hệ thống';
      await focusFirstInvalid();
      toastr.error(validationErrors.value.customerEmail);
    } else if (errorCode === '4002') {
      validationErrors.value.customerPhoneNumber = errorMessage || 'Số điện thoại đã tồn tại trong hệ thống';
      await focusFirstInvalid();
      toastr.error(validationErrors.value.customerPhoneNumber);
    } else if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
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
        const msg = Array.isArray(messages) ? messages[0] : messages;
        const frontendField = fieldMapping[field] || field.charAt(0).toLowerCase() + field.slice(1);
        if (validationErrors.value.hasOwnProperty(frontendField)) {
          validationErrors.value[frontendField] = msg;
        }
      }
      toastr.error('Vui lòng kiểm tra lại thông tin nhập vào');
      await focusFirstInvalid();
    } else if (errorMessage) {
      toastr.error(errorMessage);
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
    
    // Ghi log để kiểm tra
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
    
    formData.value.customerCode = code || 'KH001'; // Giá trị dự phòng khi không nhận được mã mới
  } catch (error) {
    console.error('Lỗi khi generate mã khách hàng:', error);
    formData.value.customerCode = 'KH001'; // Giá trị dự phòng khi phát sinh lỗi
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
                  ref="customerTypeRef"
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
                  ref="customerNameRef"
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
                  ref="phoneRef"
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
                  ref="emailRef"
                />
              </div>
            </div>
          </div>

          <!-- Cột phải -->
          <div class="col-right">
            <div class="form-item flex-row align-center">
              <label class="form-label">Địa chỉ giao hàng <span class="required">*</span></label>
              <div class="input-wrapper">
                <MsInput
                  v-model="formData.shippingAddress"
                  :error="validationErrors.customerShippingAddress"
                  ref="shippingAddressRef"
                />
              </div>
            </div>

            <div class="form-item flex-row align-center">
              <label class="form-label">Mã số thuế</label>
              <div class="input-wrapper">
                <MsInput
                  v-model="formData.taxCode"
                  :error="validationErrors.customerTaxCode"
                  ref="taxCodeRef"
                />
              </div>
            </div>
            <div class="form-item flex-row align-center">
              <label class="form-label">Ngày mua hàng gần nhất</label>
              <div class="input-wrapper-date">
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
  min-height: 0;
  overflow-y: auto;
}

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
  height: 32px;
  line-height: 32px;
  width: 160px;
  min-width: 160px;
  flex: 0 0 160px;
  color: #1f2229;
  padding-top: 0;
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
  color: #f59e0b !important;
}

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
.input-wrapper-date{
  width: 100%;
  border-radius : 2px !important;
  height: 32px;
}

.input-wrapper-date :deep(.ms-input__message) {
  color: #f59e0b !important;
}
</style>
