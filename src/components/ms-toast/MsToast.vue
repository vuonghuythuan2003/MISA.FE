<script>
import toastr from 'toastr'
import '@/assets/styles/css/toast.css'

// Cấu hình toastr - thon gọn, match với giao diện
toastr.options = {
  'closeButton': true,
  'debug': false,
  'newestOnTop': true,
  'progressBar': false,
  'positionClass': 'toast-top-right',
  'preventDuplicates': true,
  'onclick': null,
  'showDuration': '200',
  'hideDuration': '300',
  'timeOut': '3000',
  'extendedTimeOut': '500',
  'showEasing': 'swing',
  'hideEasing': 'linear',
  'showMethod': 'fadeIn',
  'hideMethod': 'fadeOut'
}

export default {
  install(app) {
    app.config.globalProperties.$toastr = toastr
  }
}
</script>

<template>
  <!-- Toast container sẽ được render bởi thư viện toastr -->
  <div id="toast-container"></div>
</template>

<style scoped>
/* Toastr CSS được import từ thư viện, không cần style riêng */
</style>
