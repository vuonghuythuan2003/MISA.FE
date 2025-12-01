<script setup>
import HeaderLayout from "./layouts/HeaderLayout.vue";
</script>

<template>
  <div class="container">
    <HeaderLayout />
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<style scoped></style>
