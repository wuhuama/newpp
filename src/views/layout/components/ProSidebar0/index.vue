<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >

    <sidebar-item :menus="menus"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  data () {
    return {
      menus: [].concat(JSON.parse(window.localStorage.getItem('sidemenus')))
    }
  },
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      // 'sidemenus', // 侧边菜单
      'sidebar'
    ]),
    isCollapse () {
      return !this.sidebar.opened
    }
  },
  watch: {
    '$route' (to, from) {
      // 对路由变化作出响应...
      this.menus = [].concat(JSON.parse(window.localStorage.getItem('sidemenus')))
    }
  }
}
</script>
