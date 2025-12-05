<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import toastr from "toastr";
import MsButton from "../../components/ms-button/MsButton.vue";
import MsInput from "../../components/ms-input/MsInput.vue";
import customerAPI from "@/apis/components/CustomerAPI.js";

const route = useRoute();
const router = useRouter();
const isLoading = ref(false);

// State cho ảnh đại diện
const avatarFile = ref(null);
const avatarPreview = ref(null);

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

// Load dữ liệu khách hàng từ API
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
        address: customer.customerAddress || "",
        phone: customer.customerPhoneNumber || "",
        email: customer.customerEmail || "",
        lastPurchaseDate: customer.lastPurchaseDate || "",
        purchasedGoods: customer.purchasedItemCode || "",
        purchasedGoodsName: customer.purchasedItemName || "",
      };
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

// Validate form
const validateForm = () => {
  if (!formData.value.customerName.trim()) {
    toastr.error("Vui lòng nhập tên khách hàng");
    return false;
  }
  if (!formData.value.customerType.trim()) {
    toastr.error("Vui lòng chọn loại khách hàng");
    return false;
  }
  if (!formData.value.phone.trim()) {
    toastr.error("Vui lòng nhập số điện thoại");
    return false;
  }
  return true;
};

// Xử lý lưu khách hàng
const handleSave = async () => {
  if (!validateForm()) return;

  try {
    isLoading.value = true;
    const customerId = route.params.id;
    
    // Nếu có file ảnh, dùng endpoint with-avatar
    if (avatarFile.value) {
      const formDataWithFile = new FormData();
      formDataWithFile.append('file', avatarFile.value);
      formDataWithFile.append('customerType', formData.value.customerType);
      formDataWithFile.append('customerCode', formData.value.customerCode || '');
      formDataWithFile.append('customerName', formData.value.customerName);
      formDataWithFile.append('customerTaxCode', formData.value.taxCode);
      formDataWithFile.append('customerAddress', formData.value.address);
      formDataWithFile.append('customerPhoneNumber', formData.value.phone);
      formDataWithFile.append('customerEmail', formData.value.email);
      formDataWithFile.append('lastPurchaseDate', formData.value.lastPurchaseDate || '');
      formDataWithFile.append('purchasedItemCode', formData.value.purchasedGoods);
      formDataWithFile.append('purchasedItemName', formData.value.purchasedGoodsName);

      const response = await customerAPI.updateWithAvatar(customerId, formDataWithFile);
      console.log('Update response:', response.data);
    } else {
      // Nếu không có ảnh, dùng endpoint thường
      const payload = {
        customerType: formData.value.customerType,
        customerCode: formData.value.customerCode || undefined,
        customerName: formData.value.customerName,
        customerTaxCode: formData.value.taxCode,
        customerAddress: formData.value.address,
        customerPhoneNumber: formData.value.phone,
        customerEmail: formData.value.email,
        lastPurchaseDate: formData.value.lastPurchaseDate || null,
        purchasedItemCode: formData.value.purchasedGoods,
        purchasedItemName: formData.value.purchasedGoodsName,
      };

      const response = await customerAPI.update(customerId, payload);
      console.log('Update response:', response.data);
    }
    
    toastr.success(`Đã cập nhật khách hàng "${formData.value.customerName}" thành công`);
    router.push('/customer');
  } catch (error) {
    console.error('Lỗi khi cập nhật khách hàng:', error);
    toastr.error('Không thể cập nhật khách hàng. Vui lòng kiểm tra lại thông tin.');
  } finally {
    isLoading.value = false;
  }
};

// Xử lý lưu và thêm mới
const handleSaveAndAdd = async () => {
  if (!validateForm()) return;

  try {
    isLoading.value = true;
    const customerId = route.params.id;
    
    // Nếu có file ảnh, dùng endpoint with-avatar
    if (avatarFile.value) {
      const formDataWithFile = new FormData();
      formDataWithFile.append('file', avatarFile.value);
      formDataWithFile.append('customerType', formData.value.customerType);
      formDataWithFile.append('customerCode', formData.value.customerCode || '');
      formDataWithFile.append('customerName', formData.value.customerName);
      formDataWithFile.append('customerTaxCode', formData.value.taxCode);
      formDataWithFile.append('customerAddress', formData.value.address);
      formDataWithFile.append('customerPhoneNumber', formData.value.phone);
      formDataWithFile.append('customerEmail', formData.value.email);
      formDataWithFile.append('lastPurchaseDate', formData.value.lastPurchaseDate || '');
      formDataWithFile.append('purchasedItemCode', formData.value.purchasedGoods);
      formDataWithFile.append('purchasedItemName', formData.value.purchasedGoodsName);

      const response = await customerAPI.updateWithAvatar(customerId, formDataWithFile);
      console.log('Update response:', response.data);
    } else {
      // Nếu không có ảnh, dùng endpoint thường
      const payload = {
        customerType: formData.value.customerType,
        customerCode: formData.value.customerCode || undefined,
        customerName: formData.value.customerName,
        customerTaxCode: formData.value.taxCode,
        customerAddress: formData.value.address,
        customerPhoneNumber: formData.value.phone,
        customerEmail: formData.value.email,
        lastPurchaseDate: formData.value.lastPurchaseDate || null,
        purchasedItemCode: formData.value.purchasedGoods,
        purchasedItemName: formData.value.purchasedGoodsName,
      };

      const response = await customerAPI.update(customerId, payload);
      console.log('Update response:', response.data);
    }
    
    toastr.success(`Đã cập nhật khách hàng "${formData.value.customerName}" thành công`);
    router.push('/customer/add');
  } catch (error) {
    console.error('Lỗi khi cập nhật khách hàng:', error);
    toastr.error('Không thể cập nhật khách hàng. Vui lòng kiểm tra lại thông tin.');
  } finally {
    isLoading.value = false;
  }
};

// Đặt tiêu đề tab trình duyệt khi vào trang
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
        <MsButton type="outline-primary" @click="handleSaveAndAdd" :disabled="isLoading">Lưu và thêm</MsButton>
        <MsButton type="primary" @click="handleSave" :disabled="isLoading">Lưu</MsButton>
      </div>
    </div>

    <!-- Nội dung trang -->
    <div class="page-content">
      <!-- Phần ảnh đại diện -->
      <div class="section-image">
        <div class="title-image">Ảnh</div>
        <div class="avatar-wrapper" @click="$refs.avatarInput?.click()">
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
              <label class="form-label">Loại khách hàng</label>
              <div class="input-wrapper">
                <MsInput
                  v-model="formData.customerType"
                  placeholder="- Không chọn -"
                  readonly
                />
              </div>
            </div>

            <div class="form-item flex-row align-center">
              <label class="form-label">Mã khách hàng</label>
              <div class="input-wrapper">
                <MsInput
                  v-model="formData.customerCode"
                  placeholder="Mã tự sinh"
                />
              </div>
            </div>

            <div class="form-item flex-row align-center">
              <label class="form-label">Tên khách hàng <span class="required">*</span></label>
              <div class="input-wrapper">
                <MsInput
                  v-model="formData.customerName"
                  :required="true"
                />
              </div>
            </div>

            <div class="form-item flex-row align-center">
              <label class="form-label">Mã số thuế</label>
              <div class="input-wrapper">
                <MsInput
                  v-model="formData.taxCode"
                />
              </div>
            </div>

            <div class="form-item flex-row align-center">
              <label class="form-label">Địa chỉ (Giao hàng)</label>
              <div class="input-wrapper">
                <MsInput
                  v-model="formData.address"
                />
              </div>
            </div>
          </div>

          <!-- Cột phải -->
          <div class="col-right">
            <div class="form-item flex-row align-center">
              <label class="form-label">Điện thoại</label>
              <div class="input-wrapper">
                <MsInput
                  v-model="formData.phone"
                  type="tel"
                />
              </div>
            </div>

            <div class="form-item flex-row align-center">
              <label class="form-label">Email</label>
              <div class="input-wrapper">
                <MsInput
                  v-model="formData.email"
                  type="email"
                />
              </div>
            </div>

            <div class="form-item flex-row align-center">
              <label class="form-label">Ngày mua hàng gần nhất</label>
              <div class="input-wrapper">
                <MsInput
                  v-model="formData.lastPurchaseDate"
                  type="text"
                  placeholder="dd/mm/yyyy"
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
  margin-left: 20px;
  margin-right: 16px;
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
  font-size: 18px;
  font-weight: 500;
  font-family: Inter, sans-serif;
  color: #1f2229;
  margin: 20px 0 16px 0;
}

.form-grid {
  display: flex;
  gap: 60px;
  align-items: flex-start;
  padding-right: 200px;
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
  width: 140px;
  min-width: 140px;
  flex: 0 0 140px;
  color: #1f2229;
  padding-top: 6px;
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
}

.input-wrapper :deep(.ms-input__message) {
  display: none;
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
