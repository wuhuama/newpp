<template>
  <div class="menu-wrapper">
      <template v-for="item in side_menus" v-if="!item.hidden&&item.children">
        <el-submenu :index="item.name||item.path" :key="parseInt(item.id)">
          <template slot="title">
            <svg-icon v-if="item.icon" :icon-class="item.icon"></svg-icon>
            <span v-if="item.title" slot="title">{{item.title}}</span>
          </template>

          <template v-for="child in item.children" v-if="!child.hidden">
            <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0" :menus="[child]" :key="parseInt(child.id)"></sidebar-item>

            <router-link v-else :to="{name: child.name}" :key="parseInt(child.id)" class="menu-item">
              <el-menu-item :index="item.name+'/'+child.name">
                <!-- <svg-icon v-if="child&&child.icon" :icon-class="child.icon"></svg-icon> -->
                <span v-if="child&&child.title" slot="title">{{child.title}}</span>
              </el-menu-item>
            </router-link>
          </template>
        </el-submenu>

      </template>
      <!-- <template v-for="item in sidemenus" v-if="!item.hidden&&item.children">
        <router-link v-if="hasOneShowingChildren(item.children) && !item.children[0].children&&!item.alwaysShow" :to="item.path+'/'+item.children[0].path"
          :key="item.children[0].name">
          <el-menu-item :index="item.path+'/'+item.children[0].path" :class="{'submenu-title-noDropdown':!isNest}">
            <svg-icon v-if="item.children[0].meta&&item.children[0].meta.icon" :icon-class="item.children[0].meta.icon"></svg-icon>
            <span v-if="item.children[0].meta&&item.children[0].meta.title" slot="title">{{item.children[0].meta.title}}</span>
          </el-menu-item>
        </router-link>

        <el-submenu v-else :index="item.name||item.path" :key="item.name">
          <template slot="title">
            <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
            <span v-if="item.meta&&item.meta.title" slot="title">{{item.meta.title}}</span>
          </template>

            <template v-for="child in item.children" v-if="!child.hidden">
              <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.path"></sidebar-item>

              <router-link v-else :to="item.path+'/'+child.path" :key="child.name" class="zzzzzzz">
                <el-menu-item :index="item.path+'/'+child.path">
                  <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
                  <span v-if="child.meta&&child.meta.title" slot="title">{{child.meta.title}}</span>
                </el-menu-item>
              </router-link>
            </template>
        </el-submenu>

      </template> -->
  </div>
</template>

<script>
export default {
  name: 'SidebarItem',
  props: {
    menus: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    side_menus () {
      let tmp = []
      tmp = tmp.concat(this.menus)
      return tmp
    }
  }
}
</script>
<style>
</style>
