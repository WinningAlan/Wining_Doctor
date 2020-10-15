<template>
  <div class="tree">
    <div class="title">
      <div class="tt" @click="handleTree">
        <span v-if="showLeaf" class="el-icon-caret-bottom"></span>
        <span v-else class="el-icon-caret-right"></span>
        <span
          v-if="type==='1'"
          class="treeTitle"
        >{{ treeData.CategoryName}} （ {{treeData.DocList.length}} ）</span>
        <span v-else class="treeTitle">{{ treeData.CategoryName}} （ {{treeData.AssList.length}} ）</span>
      </div>
    </div>

    <transition name="fade">
      <div class="infos" v-show="showLeaf">
        <div v-if="type==='1'">
          <div
            class="info"
            v-for="(item, index) in treeData.DocList"
            :key="item.DocId"
            :class="{active:activeItem===item.DocId}"
            @click="selectLeaf(item.DocId, type, item.Number)"
            ref="leaf"
            :id="item.DocId"
            name="leaf"
          >
            <div class="infoDetail">
              <div class="info1">
                <div>{{item.DocName}}</div>
              </div>
              <div class="info2">{{item.CreateTime|timeFilter}}</div>
            </div>
          </div>
        </div>
        <div v-else>
          <div
            class="info"
            v-for="(item, index) in treeData.AssList"
            :key="index"
            :class="{active:activeItem===item.DocId}"
            @click="selectLeaf(item.DocId, type, item.Number)"
            ref="leaf"
            :id="item.DocId"
            name="leaf"
          >
            <div class="infoDetail">
              <div class="info1">
                <div>{{item.AssName}}</div>

              </div>
              <div class="info2">{{item.CreateTime|timeFilter}}</div>
            </div>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>
<script>
export default {
  props: {
    // 树的相关数据
    treeData: {
      type: Object,
      default: function() {
        return {};
      }
    },
    // 选中叶子
    selectLeaf: {
      type: Function,
      default: function() {
        return {};
      }
    },
    // 当前叶子
    activeItem: {
      type: String,
      default: ""
    },
    // 1 护理文书  2 护理评估
    type: {
      type: String,
      default: function() {
        return "1";
      }
    }
  },

  data() {
    return {
      showLeaf: true,
    };
  },

  methods: {
    handleTree() {
      this.showLeaf = !this.showLeaf;
    },
 
  },

};
</script>

<style lang="less" scoped>
.tree {
  font-size: 14px;
  color: #333333;
  background: #fff;
  // height: calc(~"(100% - 21px)");
  // overflow: auto;
  // padding: 0 11px;
  // background-color: #f4f8fc;
  position: relative;
  .title {
    margin-top: 7px;
    padding: 7px 11px;
    background-color: #f4f8fc;
    position: relative;
    .treePrint {
      position: absolute;
      right: 10px;
    }
    .tt {
      margin-right: 30px;
    }
    // padding: 0 11px;
    .treeTitle {
      display: inline-block;
      max-width: 165px;
    }
    img {
      cursor: pointer;
    }
  }
  .infos {
    // padding: 0 11px;
    .info {
      height: 54px;
      border-bottom: 1px dashed #e0e0e0;
      // padding: 13px 9px 0 18px;
      padding: 13px 11px 0 29px;
      // box-sizing: border-box;

      position: relative;
      cursor: pointer;
      &:hover {
        background: #ebf4fd;
      }
      &.active {
        background: #d0e7ff;
      }
      .checkPrint {
        position: absolute;
        width: 30px;
      }
      .infoDetail {
        // margin-left:30px;
        .info1 {
          height: 20px;
          line-height: 20px;
          > div:nth-child(1) {
            float: left;
            max-width: 192px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          > div:nth-child(2) {
            float: right;
          }
          .score {
            font-size: 18px;
            font-weight: bold;
          }
        }
        .info2 {
          height: 34px;
          line-height: 34px;
          color: #999999;
        }
      }
    }
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .iframe {
    position: absolute;
    top: 0px;
    right: 0px;
    z-index: -100;
    // bottom: 0px;
    // display: none;
  }
}
</style>

