<template>
  <div class="my-tabs">
    <ul class="my-tabs-nav">
      <li
        class="el-tabs__active-bar is-top"
        :style="{width:width+'px',transform: `translateX(${width*index}px)`}"
      ></li>
      <li
        class="my-tabs-item el-tabs__item"
        :style="{width:width+'px'}"
        :class="{'is-active':activeName===item[propsName[0]]}"
        v-for="item in tabsList"
        :key="item[propsName[0]]"
        @click="checked(item[propsName[0]])"
      >{{item[propsName[1]]}}</li>
    </ul>
    <!-- <transition-group name="el-fade-in" tag="div" :duration="{ enter: 500, leave: 10 }"  class="my-tabs-content"> -->
    <div
      class="my-tabs-content"
      v-for="item in tabsList"
      :key="item[propsName[0]]"
      v-show="activeName===item[propsName[0]]"
    >
      <slot :name="item[propsName[0]]" />
    </div>
    <!-- </transition-group> -->
  </div>
</template>

<script>
export default {
  name: "my-tabs", //切换组件
  props: {
    //   当前项
    activeName: "",
    //   数据
    tabsList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // tab标签对应的字段名称
    propsName:{
      type: Array,
      default: () => {
        return ["value","label"];
      }
    },
    //   选项改变的回调函数
    tabChange: {
      type: Function,
      default: () => {}
    },
    //   单个tab宽度
    width: {
      type: Number,
      default: 115
    }
  },
  data() {
    return {};
  },
  computed: {
    index() {
      let num = 0;
      this.tabsList.forEach((item, i) => {
        if (item[this.propsName[0]] === this.activeName) {
          num = i;
        }
      });
      return num;
    }
  },
  methods: {
    checked(val) {
      if (val===this.activeName) return
      this.$emit("update:activeName", val);
      this.tabChange(val);
    }
  }
};
</script>
<style scoped lang='less'>
.my-tabs {
  .my-tabs-nav {
    white-space: nowrap;
    position: relative;
    transition: -webkit-transform 0.3s;
    .el-tabs__active-bar {
      color: #0071e7;
    }
    .my-tabs-item {
      padding: 0;
      cursor: pointer;
      text-align: center;
      &.is-active {
        color: #0071e7;
      }
      &:hover {
        color: #0071e7;
      }
    }
    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 2px;
      background-color: #e4e7ed;
      z-index: 0;
    }
  }
  .my-tabs-content {
    overflow: hidden;
    position: relative;
  }
}
</style>
