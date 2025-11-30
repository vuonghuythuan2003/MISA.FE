<script setup>
import HeaderLayout from "./layouts/HeaderLayout.vue";
import ToolBar from "./layouts/MainContentLayout.vue";
import CustomerLayOut from "./views/customer/CustomerLayOut.vue";
</script>

<template>
  <div class="container">
    <HeaderLayout />
    <div class="content">
      <ToolBar />
      <CustomerLayOut />
    </div>
  </div>
</template>

<style scoped></style>
