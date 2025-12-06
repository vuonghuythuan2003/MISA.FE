<script setup>
import { onMounted, ref, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import dayjs from "dayjs";
import toastr from "toastr";
import MsButton from "../../components/ms-button/MsButton.vue";
import MsInput from "../../components/ms-input/MsInput.vue";
import MsDate from "../../components/ms-date/MsDate.vue";
import customerAPI from "@/apis/components/CustomerAPI.js";

const route = useRoute();
const router = useRouter();
const isLoading = ref(false);

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
  address: "",
  phone: "",
  email: "",
  lastPurchaseDate: "",
  purchasedGoods: "",
  purchasedGoodsName: "",
});

// Trạng thái lỗi validate trả về từ backend
const validationErrors = ref({
  customerType: "",
  customerCode: "",
  customerName: "",
  customerTaxCode: "",
  customerAddress: "",
  customerPhoneNumber: "",
  customerEmail: "",
  lastPurchaseDate: "",
  purchasedItemCode: "",
  purchasedItemName: "",
});

// Xóa thông báo lỗi khi người dùng chỉnh sửa
watch(() => formData.value.customerName, () => validationErrors.value.customerName = "");
watch(() => formData.value.customerType, () => validationErrors.value.customerType = "");
watch(() => formData.value.customerCode, () => validationErrors.value.customerCode = "");
watch(() => formData.value.taxCode, () => validationErrors.value.customerTaxCode = "");
watch(() => formData.value.address, () => validationErrors.value.customerAddress = "");
watch(() => formData.value.phone, () => validationErrors.value.customerPhoneNumber = "");
watch(() => formData.value.email, () => validationErrors.value.customerEmail = "");
watch(() => formData.value.lastPurchaseDate, () => validationErrors.value.lastPurchaseDate = "");
watch(() => formData.value.purchasedGoods, () => validationErrors.value.purchasedItemCode = "");
watch(() => formData.value.purchasedGoodsName, () => validationErrors.value.purchasedItemName = "");

// Xử lý chọn ảnh
const handleAvatarChange = (event) => {
  const file = event.target.files?.[0];
  if (file) {
    avatarFile.value = file;
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

// Tải dữ liệu khách hàng từ API
const loadCustomerData = async () => {
  try {
    isLoading.value = true;
    const customerId = route.params.id;

    if (!customerId) {
      toastr.error("ID khách hàng không hợp lệ");
      router.back();
      return;
    }

    const response = await customerAPI.getById(customerId);
    console.log('Customer data:', response.data);

    if (response.data && response.data.data) {
      const customer = response.data.data;
      formData.value = {
        customerType: customer.customerType || "",
        customerCode: customer.customerCode || "",
        customerName: customer.customerName || "",
        taxCode: customer.customerTaxCode || "",
        address: customer.customerShippingAddress || customer.customerAddress || "",
        phone: customer.customerPhoneNumber || "",
        email: customer.customerEmail || "",
        lastPurchaseDate: customer.lastPurchaseDate ? dayjs(customer.lastPurchaseDate) : null,
        purchasedGoods: customer.purchasedItemCode || "",
        purchasedGoodsName: customer.purchasedItemName || "",
      };
      avatarPreview.value = customer.customerAvatarUrl || null;
      document.title = `Chỉnh sửa - ${customer.customerName}`;
    }
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu khách hàng:', error);
    toastr.error("Không thể tải dữ liệu khách hàng");
    router.back();
  } finally {
    isLoading.value = false;
  }
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
    { key: "customerAddress", ref: shippingAddressRef },
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
    { key: "customerAddress", value: formData.value.address, ref: shippingAddressRef, message: "Địa chỉ giao hàng không được để trống" },
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
  validationErrors.value = {
    customerType: "",
    customerCode: "",
    customerName: "",
    customerTaxCode: "",
    customerAddress: "",
    customerPhoneNumber: "",
    customerEmail: "",
    lastPurchaseDate: "",
    purchasedItemCode: "",
    purchasedItemName: "",
  };

  if (!validateRequired()) return;

  try {
    isLoading.value = true;
    const customerId = route.params.id;

    if (avatarFile.value) {
      const formDataWithFile = new FormData();
      formDataWithFile.append('file', avatarFile.value);
      formDataWithFile.append('customerType', formData.value.customerType);
      formDataWithFile.append('customerCode', formData.value.customerCode || '');
      formDataWithFile.append('customerName', formData.value.customerName);
      formDataWithFile.append('customerTaxCode', formData.value.taxCode);
      formDataWithFile.append('customerShippingAddress', formData.value.address);
      formDataWithFile.append('customerPhoneNumber', formData.value.phone);
      formDataWithFile.append('customerEmail', formData.value.email);
      formDataWithFile.append('lastPurchaseDate', formData.value.lastPurchaseDate ? dayjs(formData.value.lastPurchaseDate).toISOString() : '');
      formDataWithFile.append('purchasedItemCode', formData.value.purchasedGoods);
      formDataWithFile.append('purchasedItemName', formData.value.purchasedGoodsName);

      await customerAPI.updateWithAvatar(customerId, formDataWithFile);
    } else {
      const payload = {
        customerType: formData.value.customerType,
        customerCode: formData.value.customerCode || undefined,
        customerName: formData.value.customerName,
        customerTaxCode: formData.value.taxCode,
        customerShippingAddress: formData.value.address,
        customerPhoneNumber: formData.value.phone,
        customerEmail: formData.value.email,
        lastPurchaseDate: formData.value.lastPurchaseDate ? dayjs(formData.value.lastPurchaseDate).toISOString() : null,
        purchasedItemCode: formData.value.purchasedGoods,
        purchasedItemName: formData.value.purchasedGoodsName,
      };

      await customerAPI.update(customerId, payload);
    }

    toastr.success(`Đã cập nhật khách hàng "${formData.value.customerName}" thành công`);
    router.push({ path: '/customer', query: { sortBy: 'customerCode', order: 'desc' } });
  } catch (error) {
    console.error('Lỗi khi cập nhật khách hàng:', error);
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      const fieldMapping = {
        'CustomerType': 'customerType',
        'CustomerCode': 'customerCode',
        'CustomerName': 'customerName',
        'CustomerTaxCode': 'customerTaxCode',
        'CustomerAddress': 'customerAddress',
        'CustomerShippingAddress': 'customerAddress',
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
      await focusFirstInvalid();
      toastr.error('Vui lòng kiểm tra lại thông tin nhập vào');
    } else if (error.response?.data?.message) {
      toastr.error(error.response.data.message);
    } else {
      toastr.error('Không thể cập nhật khách hàng. Vui lòng kiểm tra lại thông tin.');
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  document.title = "Chỉnh sửa Khách hàng";
  loadCustomerData();
});
</script>
<template>
  <div class="container-add-customer">
    <!-- Thanh công cụ -->
    <div class="toolbar flex-row flex-space-between">
      <!-- Bố cục thanh công cụ (phần trái) -->
      <div class="toolbar-left flex-row align-center">
        <!-- Tiêu đề Khách hàng -->
        <h1 class="page-title">Chỉnh sửa Khách hàng</h1>
        <div class="dropdown-trigger flex-row align-center">
          <span class="template-name">Mẫu tiêu chuẩn</span>
          <div class="icon-default icon-down"></div>
        </div>
        <a href="#" class="edit-layout-link">Sửa bố cục</a>
      </div>
      <!-- Bố cục thanh công cụ (phần phải) -->
      <div class="toolbar-right flex-row align-center">
        <MsButton type="secondary" @click="router.back()">Hủy bỏ</MsButton>
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
                <MsInput
                  v-model="formData.customerType"
                  placeholder="- Không chọn -"
                  readonly
                  :error="validationErrors.customerType"
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
              <label class="form-label">Địa chỉ (Giao hàng) <span class="required">*</span></label>
              <div class="input-wrapper">
                <MsInput
                  v-model="formData.address"
                  :error="validationErrors.customerAddress"
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
                  :error="validationErrors.purchasedItemCode"
                />
              </div>
            </div>

            <div class="form-item flex-row align-center">
              <label class="form-label">Tên hàng hóa đã mua</label>
              <div class="input-wrapper">
                <MsInput
                  v-model="formData.purchasedGoodsName"
                  :error="validationErrors.purchasedItemName"
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
  background-color: #fff;
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
  align-items: flex-start;
}

.col-left,
.col-right {
  flex: 1 1 0;
}

.col-right .form-label {
  width: 160px;
  min-width: 160px;
  flex: 0 0 160px;
}

.form-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 12px;
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
}

.input-wrapper :deep(.ms-input__message) {
  display: block;
  margin-top: 4px;
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
</style>
