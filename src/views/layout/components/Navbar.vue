<template>
  <div class="navbar">
    <div class="left-menu top-left-menu-wraper" v-if="menus.length>0">
      <div v-for="(i, index) in menus" :key="i.id" class="top-left-menu-item" :class='{"is-active": index === currentIndex}' @click="goToMenu(i, index)">
        <div class="li-item" >
          <svg-icon icon-class="">{{i.icon}}</svg-icon>
          <span>{{i.title}}</span>
        </div>
      </div>
    </div>
    <div class="logo">这里是logo</div>
    <div class="right-menu">
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
          <span class="user-avatar">{{name}}</span>
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <el-dropdown-item>
            <span style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="top-right-menu-wraper">
        <router-link to="/system" tag="li">
          <svg-icon icon-class=""></svg-icon>
          <span>权限管理</span> 
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data(){
    return {
      currentIndex: 0
    }
  },
  computed: {
    ...mapGetters([
      'menus',
      'sidebar',
      'name',
      'avatar',
      'device'
    ])
  },
  methods: {
    goToMenu (menu, index) {
      console.log('ssssss', index);
      this.currentIndex = index
      if (menu.children) {
        // 解决vuex中的数据刷新后就清空, 放入缓存中
        window.localStorage.setItem('sidemenus', JSON.stringify(menu.children))
        this.$store.commit('SET_SIDEMENUS', [menu.children])
      } else {
        window.localStorage.setItem('sidemenus', '')
        this.$store.commit('SET_SIDEMENUS', [])
      }
      this.$router.push({
        name: menu.name
      })
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        this.$router.push({path: '/login'})
        // location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/styles/mixin.scss";
.navbar {
  @include clearfix;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
  height: 50px;
  overflow: hidden;
  text-align: center;
  box-sizing: border-box;
  color: #76a1e8;
  background: linear-gradient(to right, #285daf, #04193a, #285daf);
  box-shadow: 0 0 10px 0 rgba(0,0,0,.1);
  margin-bottom: 10px;
  // position: relative;
  .left-menu {
    float: left;
    height: 100%;
    display: flex;
    .top-left-menu-item{
      line-height: 50px;
      cursor: pointer;
      .li-item{
        list-style: none;
        padding: 0 10px;
      }
    }
    .top-left-menu-item.is-active{
      color: #fff;
    }
  }
  .logo {
    display: inline-block;
    height: 100%;
    line-height: 50px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%)
    // margin: 0 auto;
    // text-align: center;
  }
  .right-menu {
    float: right;
    height: 100%;
    // line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 20px;

      .avatar-wrapper {
        position: relative;
        .user-avatar {
          cursor: pointer;
          vertical-align: text-bottom;
          line-height: 50px;
          color: #76a1e8;
          font-size: 14px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          color: #fff;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }

    .top-right-menu-wraper{
      display: inline-block;
      height: 100%;
      vertical-align: text-bottom;
      line-height: 50px;
      padding-right: 18px;
      span{
        font-size: 15px;
      }
    }
  }
}
</style>
