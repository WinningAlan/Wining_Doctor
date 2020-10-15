<template>
  <el-menu
    :default-active="$route.path"
    :collapse="isDoCollapse?collapse:false"
    background-color="#fff"
    text-color="#8599C0"
    active-text-color="#ffffff"
    :collapse-transition="true"
    mode="vertical"
  >
    <sidebar-item v-for="route in navList" :key="route.UiRouter" :item="route" />
  </el-menu>
</template>
<script>
import sidebarItem from "./sidebarItem.vue";
export default {
  name: "sidebar",
  props: {
    navList:{
      type:Array,
      default:[]
    },
    isDoCollapse: {
      type: Boolean,
      default: true
    }
  },
  components: {
    sidebarItem
  },
  computed: {
    collapse() {
      // console.log(this.$store.getters['public/GET_COLLAPSE']);
      return this.$store.getters["public/GET_COLLAPSE"];
    }
  }
};
</script>
<style lang="less">
.el-menu--collapse.el-menu {
  overflow-x: hidden;
  //height: calc(100vh - 200px);
  .left14 {
    color: #fff;
  }
}
.el-menu.el-menu--inline {
  overflow-x: hidden;
  display: none;
}
.el-menu {
  overflow-y: auto;
  height: calc(100vh - 112px);
  overflow-x: hidden;
  border-right: none;
}
.el-menu:not(.el-menu--collapse) {
  width: 135px;

  .el-menu.el-menu--inline {
    display: block;
    .left14 {
      margin-left: 1.6em;
    }
  }
  .el-menu-item {
    width: 135px;
    min-width: 135px;
  }
}
</style>