<script>
import toastr from 'toastr'

// Cấu hình toastr - tắt nút close, match với giao diện
toastr.options = {
  'closeButton': false,
  'debug': false,
  'newestOnTop': true,
  'progressBar': true,
  'positionClass': 'toast-top-right',
  'preventDuplicates': true,
  'onclick': null,
  'showDuration': '200',
  'hideDuration': '300',
  'timeOut': '3000',
  'extendedTimeOut': '1000',
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
</style>
