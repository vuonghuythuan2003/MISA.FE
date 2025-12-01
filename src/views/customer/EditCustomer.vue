<script setup>
import { onMounted, ref } from "vue";
import MsButton from "../../components/ms-button/MsButton.vue";
import MsInput from "../../components/ms-input/MsInput.vue";

// Đặt tiêu đề tab trình duyệt khi vào trang
onMounted(() => {
  document.title = "Chỉnh sửa Khách hàng";
});

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
        <MsButton type="secondary">Hủy bỏ</MsButton>
        <MsButton type="outline-primary">Lưu và thêm</MsButton>
        <MsButton type="primary">Lưu</MsButton>
      </div>
    </div>

    <!-- Nội dung trang -->
    <div class="page-content">
      <!-- Phần ảnh đại diện -->
      <div class="section-image">
        <div class="title-image">Ảnh</div>
        <div class="avatar-wrapper">
          <div class="icon-default-background icon-image-customer"></div>
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
  font-family: 'Inter', Arial, Helvetica, sans-serif;
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
  font-family: "Inter", Arial, Helvetica, sans-serif;
}

.edit-layout-link {
  margin: 0;
  font-size: 13px;
  font-family: "Inter", Arial, Helvetica, sans-serif;
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
  font-family: 'Inter', Arial, Helvetica, sans-serif;
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

/* Phần thông tin chung */
.general-info-section {
  background-color: #ffffff;
  padding: 0 24px 40px;
  margin-top: 40px;
}

.section-title {
  font-size: 18px;
  font-weight: 500;
  font-family: "Inter", Arial, Helvetica, sans-serif;
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
  font-family: "Inter", Arial, Helvetica, sans-serif;
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
