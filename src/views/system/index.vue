<template>
  <div class="data-analysis-container">
    <div class="dashboard"></div>
  </div>
</template>
<script>
import Cookies from 'js-cookie'

export default {
  data () {
    return {
      title: '文字'
    }
  },
  mounted () {
    Cookies.get('sidebarStatus')
  }
}
</script>
<style lang="scss" scoped>
.data-analysis-container{
  height: 100%;
  min-height: 100%;
}
  .dashboard {
    min-width: 100%;
    min-height: 100%;
    // background: url(../../assets/images/tab.png);
    background-size: 100% 100%;
  }
</style>
