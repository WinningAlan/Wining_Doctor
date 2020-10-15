
<template>
  <div class="start-request">
    <div class="check-stoke">
      <h3>{{title}}</h3>
      <div class="warp">
        <div class="check-item cl" v-for="(item,index) in usedCheckData" :key="index">
          <span>{{item.CategoryName}}：</span>
          <div class="box">
            <el-button
              class="item"
              v-for="(data,index) in item.Models"
              :key="index"
              @click="selectData(data)"
            >{{data.ItemName}}</el-button>
          </div>
        </div>
      </div>
      <div class="more" @click="moreList">
        <span v-if="isStr">
          展开
          <svg-icon iconClass="zhankai" class="styleIcon"></svg-icon>
        </span>
        <span v-else>
          收起
          <svg-icon iconClass="shouqi" class="styleIcon"></svg-icon>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isStr: true
    };
  },
  props: {
    usedCheckData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    callback: {
      type: Function,
      default: () => {}
    },
    title: {
      type: String,
      default: ""
    }
  },
  methods: {
    //查看更多显示和隐藏
    moreList() {
      this.isStr = !this.isStr;
      let check = document.getElementsByClassName("check-stoke")[0];
      let warp = document.getElementsByClassName("warp")[0];
      if (!this.isStr) {
        check.style.height = "300px";
        warp.style.overflow = "auto";
        warp.style.height = "230px";
        // check.style.paddingBottom = "30px"
      } else {
        check.style.height = "185px";
        warp.style.height = "110px";
        warp.style.overflow = "hidden";
        warp.scrollTop = 0;
      }
    },
    //选中的数据
    selectData(val) {
      this.callback(val);
    }
  }
};
</script>
<style lang="less" scoped>
.start-request {
  font-size: 14px;
  color: #000622;
  .check-stoke {
    min-height: 145px;
    border: 1px solid #dfe7f5;
    box-sizing: border-box;
    // max-height: 257px;
    position: relative;
    padding: 10px 10px 30px 10px;
    transition: all .5s;
    // overflow: hidden;
    width: 100%;
    background: #fff;
    h3 {
      padding-bottom: 10px;
    }
    .check-item {
      line-height: 3.6;
      span {
        width: 180px;
        text-align: right;
        float: left;
      }
      .box {
        float: left;
        width: ~"calc(100% - 190px)";
      }
    }
    .more {
      position: absolute;
      left: 0;
      bottom: 0;
      font-size: 14px;
      color: #0071e7;
      cursor: pointer;
      left: 50%;
      //   width: 100%;
      background: #fff;
      height: 30px;
      text-align: center;
      z-index: 100;
      line-height: 30px;
    }
    .warp {
      height: 100px;
      //   overflow: auto;
      overflow: hidden;
      //   margin-bottom: 10px;
      // overflow: auto;
      //   padding-bottom: 20px;
      transition: all .5s;
    }
  }
  .table-list {
    height: 50px;
    display: flex;
    margin-top: 20px;
    .table-list-item {
      border: 1px solid #dfe7f5;
      line-height: 32px;
      padding: 0 15px;
      height: 32px;
      border-right: none;
      cursor: pointer;
      &:last-child {
        border-right: 1px solid #dfe7f5;
      }
    }
    .table-list-item.active {
      border-color: #0071e7;
      color: #0071e7;
      border-right: 1px solid #0071e7;
      font-weight: bold;
    }
  }
  .content {
    margin-top: 20px;

    // height:
    .inpt {
      .icon-font {
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
      }
      margin-bottom: 20px;
    }
    /deep/.el-input__inner {
      border: none;
      background: #f3f5f9;
      border-radius: 2px;
    }
    .inpt-list {
      display: flex;
      justify-content: space-between;
      .inpt-item {
        margin-top: 15px;
        .el-input {
          width: 300px;
        }
        span {
          font-size: 14px;
          color: #000622;
          i {
            font-style: normal;
            padding-right: 5px;
            color: red;
          }
        }
      }
    }
    .remark {
      margin-top: 20px;
      display: flex;
      span {
        width: 50px;
        line-height: 32px;
        padding-left: 37px;
        text-align: right;
      }
    }
  }
  .btn {
    position: absolute;
    bottom: 10px;
    right: 40px;
    .el-button {
      background: #f3f5f9;
      border: 1px solid #c0cbe9;
      border-radius: 2px;
      width: 98px;
      font-size: 14px;
      //   color: #000622;
    }
    .submit {
      background: #0071e7;
      color: #fff;
      border: none;
    }
  }
  .styleIcon {
    width: 13px;
    height: 13px;
    margin-left: 5px;
    color: #0071e7;
  }
}
</style>