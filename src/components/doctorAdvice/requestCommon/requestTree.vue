<template>
  <div class="request-tree">
    <slot name="header"></slot>
    <div class="tree">
      <el-tree
        :data="treeData"
        :props="defaultProps"
        @node-click="selectLeave"
        highlight-current
      ></el-tree>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    treeData: {
      type: Array,
      default: function() {
        return [
          {
            label: "一级 1",
            children: [
              {
                label: "二级 1-1",
                children: [
                  {
                    label: "三级 1-1-1"
                  }
                ]
              }
            ]
          },
          {
            label: "一级 2",
            children: [
              {
                label: "二级 2-1",
                children: [
                  {
                    label: "三级 2-1-1"
                  }
                ]
              },
              {
                label: "二级 2-2",
                children: [
                  {
                    label: "三级 2-2-1"
                  }
                ]
              }
            ]
          },
          {
            label: "一级 3",
            children: [
              {
                label: "二级 3-1",
                children: [
                  {
                    label: "三级 3-1-1"
                  }
                ]
              },
              {
                label: "二级 3-2",
                children: [
                  {
                    label: "三级 3-2-1"
                  }
                ]
              }
            ]
          }
        ];
      }
    },
    // 树状列表的字段名
    defaultProps: {
      type: Object,
      default: function() {
        return {
          children: "children",
          label: "label"
        };
      }
    },
    selectLeave: {
      type:Function,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    tabs(val) {
      console.log(val);
    },
    handleNodeClick(data) {
      console.log(data);
    }
  }
};
</script>
<style lang="less" scoped>
.request-tree {
  height: 100%;
  color: #000622;
  .tabs {
    /deep/.el-radio-button__inner {
      width: 66px;
      height: 32px;
      font-size: 14px;
      border-radius: 0;
    }
    .active {
      border-color: #0071e7 !important;
      color: #0071e7 !important;
      background: #fff !important;
    }
  }
  .search {
    border-bottom: 1px solid #dfe7f5;
    .el-input {
      width: 90%;
      /deep/.el-input__inner {
        border: none;
      }
    }
    .search-button {
      font-size: 20px;
      color: #dfe7f5;
      font-weight: bold;
      cursor: pointer;
    }
  }
  .tree {
    height: calc(~"(100% - 70px)");
    overflow: auto;
    /deep/ .el-tree-node__content {
      height: 32px;
      line-height: 32px;
      border-bottom: 1px solid #dfe7f5;
    }
    /deep/.el-tree-node:focus > .el-tree-node__content {
      background-color: #0071e7 !important;
      color: #fff !important;
    }
    /deep/ .el-tree-node__expand-icon {
      font-weight: bold;
    }
    /deep/
      .el-tree--highlight-current
      .el-tree-node.is-current
      > .el-tree-node__content {
      background-color: #0071e7;
      color: #fff !important;
    }
  }
}
</style>