<script setup></script>

<template>
  <div class="toolbar flex-row justify-content-space-between">
    <!-- ToolBarLeftLayOut  -->
    <div class="toolbar-left flex-row align-center">
      <div class="customer-dropdown flex-row align-center">
        <div class="icon-default icon-folder"></div>
        <div class="content-customer">Tất cả khách hàng</div>
        <div class="icon-default icon-down"></div>
      </div>

      <div class="action-group flex-row align-center">
        <span class="action-text">Sửa</span>
        <span class="icon-default icon-reload"></span>
      </div>
    </div>
    <!-- ToolBarRightLayOut  -->
    <div class="toolbar-right"></div>
  </div>
</template>
<style scoped>

.toolbar-left .customer-dropdown{
    width: 185px;
    height: 32px;
    background-color: #fff;
    border: 1px solid #D3D7DE;
    padding-right: 8px !important;
    padding-left: 12px !important;
    height: 32px;
    border-radius: 4px;
    justify-content: space-between;
    cursor: pointer;
    margin-left: 16px;
}
.content-customer{
    font-size: 13px;
    font-weight: 600;
    font-family: Misafont, Arial, Helvetica, sans-serif;
    line-height: 1.428571429;
    color: #1f2229;
}
.action-text{
    padding: 0;
    margin: 0;
    font-size: 13px;
    font-family: Misafont, Arial, Helvetica, sans-serif;    
    color: #4262f0!important
}
.action-group{
    margin-left: 15px;
    gap: 20px;
    cursor: pointer;
}
</style>
