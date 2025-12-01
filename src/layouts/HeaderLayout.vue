<script setup>
import { HomeOutlined } from "@ant-design/icons-vue";
import avatarImg from "../assets/images/avatar.png";
import { useRouter } from 'vue-router'

const router = useRouter()

function goToHome() {
  router.push('/customer')
}

</script>
<template>
  <!-- Bố cục Header -->
  <div class="header flex-row justify-content-space-between align-center">
    <!-- Phần trái Header -->
    <div class="header-left flex-row align-center">
      <!-- Logo (phần trái) -->
      <div class="brand-box flex-row">
        <div class="icon-default icon-crm"></div>
        <div class="app-title">CRM</div>
      </div>
      <!-- Thanh điều hướng header-left -->
      <div class="navbar flex-row align-center">
        <div class="nav-item">
          <div class="icon-default icon-desk"></div>
          <span class="nav-text">Bàn làm việc</span>
        </div>

        <div class="nav-item active">
          <div class="icon-default icon-customer"></div>
          <span class="nav-text" @click="goToHome">Khách hàng</span>
        </div>

        <div class="nav-item">
          <div class="icon-default icon-opportunity"></div>
          <span class="nav-text">Cơ hội</span>
        </div>

        <div class="nav-item">
          <div class="icon-default icon-quote"></div>
          <span class="nav-text">Báo giá</span>
        </div>

        <div class="nav-item">
          <div class="icon-default icon-order"></div>
          <span class="nav-text">Đơn hàng</span>
        </div>

        <div class="nav-item">
          <div class="icon-default icon-goods"></div>
          <span class="nav-text">Hàng hóa</span>
        </div>

        <div class="nav-item">
          <div class="icon-default icon-report"></div>
          <span class="nav-text">Báo cáo</span>
        </div>

        <div class="nav-item">
          <div class="icon-default icon-all"></div>
          <span class="nav-text">Tất cả</span>
        </div>
      </div>
    </div>
    <!-- Phần phải Header -->
    <div class="header-right">
      <div class="header-right__inner">
        <img class="avatar" :src="avatarImg" alt="avatar" />
      </div>
    </div>
  </div>
</template>
<style scoped>
.header {
  position: relative;
  z-index: 10;
  border-top: 1px solid #e5e7eb;
  box-shadow: 0 2px 4px #1f222929;
}
.header .header-left {
  width: 900px;
  /* màu nền (ví dụ): lime */
}
.header .header-right {
  width: 560px;
  /* màu nền (ví dụ): yellowgreen */
}
.header-right__inner {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 10px;
  margin-top: 11px;
}
.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.6) inset;
  margin-bottom: 7px;
}
.brand-box {
  display: flex;
  align-items: center;
  height: 48px;
  margin-left: 30px;
  gap: 10px;
  margin-top: 11px;
}
.brand-box .app-title {
  font-family: "Inter", Arial, Helvetica, sans-serif;
  font-weight: 700;
  font-size: 17px;
  color: #111827;
  margin-bottom: 5px;
}
.icon-crm {
  margin-bottom: 7px;
}
.navbar {
  margin-left: 10px;
}
.navbar .nav-item {
  display: flex;
  align-items: center;
  height: 32px;
  font-size: 14px;
  color: #6b7280;
  cursor: pointer;
  gap: 8px;
  padding: 0px 8px;
  margin-top: 3px;
}
.navbar .nav-text {
  margin-top: 2px;
  color: #1f2229;
  font-size: 13px;
  font-family: "Inter", Arial, Helvetica, sans-serif;
  white-space: nowrap;
}

.navbar .nav-item.active {
  color: #427bf4;
  position: relative;
}
.navbar .nav-item.active .nav-text {
  color: #427bf4;
  font-weight: 300;
}
.navbar .nav-item.active::after {
  content: "";
  position: absolute;
  left: 8px;
  right: 8px;
  bottom: -6px;
  height: 3px;
  background: #427bf4;
  border-radius: 3px;
  box-shadow: 0 2px 6px rgba(66, 123, 244, 0.2);
}
.navbar .nav-item .icon-default {
  color: inherit !important;
  background-color: currentColor;
}
.navbar .nav-item.active .icon-default {
  color: #427bf4 !important;
}
</style>
