<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
  <!-- 包含项目列表的sidebar -->
  <div class="left-wrapper" v-if="sidebar.opened">
    <div class="pro-wrapper">
      <div class="pro-title">
        <div class="green-3px-line"></div>
          <div class="pro-container">
            <span>项目列表</span>
            <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
            <!-- <div class="toggle">>></div> -->
          </div>
      </div>
      <div class="pro-inner">
        <div class="pro-header">
          <div class="text">我的项目</div>
          <div class="pro-count">项目数量：5</div>
        </div>
        <div class="pro-body">
          <!-- 向左的三角形 -->
          <div class="triangle_border_left"></div>
          <div v-for="item in 5" :key="item" class="pro-item">
            项目名称: XX交通规划-{{item}}
          </div>
        </div>
      </div> 
    </div>
    <div class="menu-wrapper" v-if="sidemenus.length>0">
      <div class="menu-title">
        <div class="green-3px-line"></div>
        <div class="pro-container">
          <span>功能列表</span>
        </div>
      </div>
      <el-menu
        :default-active="$route.path"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        :collapse-transition=false
        mode="vertical"
      >
        <!-- <sidebar-item v-for="route in permission_routers" :key="route.path" :item="route" :base-path="route.path"/> -->
        <sidebar-item v-for="route in sidemenus" :key="route.id" :item="route" />
      </el-menu>
    </div>
  </div>
  <div v-else class="hide-left-wrapper">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
  </div>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import Hamburger from '@/components/Hamburger'
import variables from '@/styles/variables.scss'
import { isEmpty } from '@/utils'
export default {
  data () {
    return {
      // sidemenus: [].concat(JSON.parse(window.localStorage.getItem('sidemenus')))
    }
  },
  components: { 
    SidebarItem,
    Hamburger,
  },
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
    },
    sidemenus:function () {
      let sides = []
      if (!isEmpty(window.localStorage.getItem('sidemenus'))){
        sides = [].concat(JSON.parse(window.localStorage.getItem('sidemenus')))
      }
      return sides
    }
  },
  watch: {
    '$route' (to, from) {
      // 对路由变化作出响应...
      if (!isEmpty(window.localStorage.getItem('sidemenus'))){
        this.sidemenus = [].concat(JSON.parse(window.localStorage.getItem('sidemenus')))
      }
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    }
  }
}
</script>
<style lang="scss">
.left-wrapper{
  height: 100%;
  .pro-wrapper{
     margin-bottom: 20px;
    .pro-title{
      height: 36px;
      line-height: 26px;
      font-size: 0;
      box-sizing: border-box;
      padding: 5px;
      display: flex;
      background: rgba(70, 112, 190, 0.1);
      background: linear-gradient(to right #031837 #081f4b);
      background-clip:padding-box,border-box;
      background-origin:padding-box,border-box;
      background-image:linear-gradient(135deg,#031837,#081f4b),linear-gradient(135deg,#031837,#3878de,#031837);
      border-bottom:2px transparent solid;
      .green-3px-line{
        height: 100%;
        display: inline-block;
        border-left: 3px solid #02f59f;
      }
      .pro-container{
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
          span{
            vertical-align: text-bottom;
            font-size: 14px;
            margin-left: 10px;
          }
          .toggle{
            font-size: 16px;
          }
          .hamburger-container {
            // line-height: 50px;
            height: 100%;
            float: left;
            cursor: pointer;
            transition: background .3s;
            background: rgba(255, 255, 255, .5);
            padding: 0 5px !important;
            &:hover {
              background: rgba(0, 0, 0, .025)
            }
          }
      }
    }
    .pro-inner{
      .pro-header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 30px;
        color: #fff;
        font-size: 12px;
        padding: 5px;
      }
      .pro-body{
        position: relative;
        border: 1px solid #2758a7;
        padding: 12px;
        /*向左*/
        .triangle_border_left{
            width:0;
            height:0;
            border-width:30px 30px 30px 0;
            border-style:solid;
            border-color:transparent #031837 transparent transparent;
            margin:0;
            position: absolute;
            transform: rotate(45deg);
            top: -21px;
            left: -6px;
            &::after{
              content: '';
              width: 1px;
              height: 57px;
              background: #2758a7;
              position: absolute;
              top: -29px;
              left: 29px;

            }
            &::before{
              content: '';
              width: 1px;
              height: 30px;
              background: #2758a7;
              position: absolute;
              top: -18px;
              left: 18px;

            }
        }
        .pro-item{
          height: 36px;
          line-height: 36px;
          font-size: 14px;
          padding-left: 15px;
        }
      }
    }
  }
  .menu-wrapper{
    .menu-title{
      height: 36px;
      line-height: 36px;
      font-size: 0;
      box-sizing: border-box;
      padding: 5px;
      display: flex;
      background: rgba(70, 112, 190, 0.1);
      background: linear-gradient(to right #031837 #081f4b);
      background-clip:padding-box,border-box;
      background-origin:padding-box,border-box;
      background-image:linear-gradient(135deg,#031837,#081f4b),linear-gradient(135deg,#031837,#3878de,#031837);
      border-bottom:2px transparent solid;
      margin-bottom: 10px;
      .green-3px-line{
        height: 100%;
        display: inline-block;
        border-left: 3px solid #ffb117;
      }
      .pro-container{
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
          span{
            vertical-align: text-bottom;
            font-size: 16px;
            margin-left: 10px;
          }
      }
    }

  }
}
.hide-left-wrapper{
  padding: 5px;
  position: fixed;
  left: 0;
  top: 50%;
  background: rgba(255, 255, 255, .5);
  cursor: pointer;
  .hamburger-container{
    padding: 0 !important;
    color: #fff;
  }
}
</style>
