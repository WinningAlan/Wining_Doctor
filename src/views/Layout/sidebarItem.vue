<template>
  <div class="menu-wrapper">
    <el-submenu
      v-if="item.Children.length>0"
      ref="subMenu"
      :index="item.UiRouter"
      popper-append-to-body
    >
      <template slot="title">
        <svg-icon :iconClass="item.Icon" class="wh20 " v-if="item.Icon"></svg-icon>
        <span class="left14">{{item.Name}}</span>
      </template>
      <sidebar-item
       
        v-for="child in item.Children"
        :key="child.UiRouter"
        :is-nest="true"
        :item="child"
        class="nest-menu"
      />
    </el-submenu>
    <router-link
      :to="{name:item.UiRouter,query:{...$route.query}}"
      active-class="color"
      v-else
      @click.native="clickLink(item.UiRouter)"
    >
      <!-- <el-menu-item :index="item.UiRouter" style="color:rgb(191,203,217)"> -->
      <el-menu-item :index="item.UiRouter" >
        <svg-icon :iconClass="item.Icon" class="wh20" v-if="item.Icon"></svg-icon>
        <span slot="title" class="left14">{{ item.Name }}</span>
      </el-menu-item>
    </router-link>
  </div>
</template>
<script>
export default {
  name: "SidebarItem",
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    clickLink(name) {
      let query={...this.$route.query}
      query.t=+new Date() //保证每次点击路由的query项都是不一样的，确保会重新刷新view
      this.$router.push({
        name,
        query
      });
    }
  }
};
</script>

