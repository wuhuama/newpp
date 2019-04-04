<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
  <!-- 包含项目列表的sidebar -->
  <div class="left-wrapper">
    <div class="menu-wrapper">
      <el-menu
        :default-active="$route.path"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        mode="vertical"
      >
        <!-- <sidebar-item v-for="route in permission_routers" :key="route.path" :item="route" :base-path="route.path"/> -->
        <sidebar-item v-for="route in sidemenus" :key="route.id" :item="route"/>
      </el-menu>
    </div>
  </div>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  data () {
    return {
      sidemenus: [].concat(JSON.parse(window.localStorage.getItem('sidemenus')))
    }
  },
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  watch: {
    '$route' (to, from) {
      // 对路由变化作出响应...
      this.sidemenus = [].concat(JSON.parse(window.localStorage.getItem('sidemenus')))
    }
  }
}
</script>
<style lang="scss">
.left-wrapper{
  height: 100%;
}
</style>
