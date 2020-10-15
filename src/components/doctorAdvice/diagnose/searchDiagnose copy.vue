<template>
  <div class="searchDiagnose">
    <span class="el-icon-search diagnose-search" v-if="!isCreate"></span>
    <el-autocomplete
      class="diagnose-list"
      v-model="value"
      @change="getDiagnose"
      highlight-first-item
      value-key="Id"
      ref="advice"
      @focus="checkText"
      @blur="setText"
      popper-class="my-list"
      :hide-loading="true"
      :popper-append-to-body="true"
      placeholder="请输入内容"
      :fetch-suggestions="remoteMethod"
      @select="getDiagnose"
    >
      <template slot-scope="{ item }">
        <span class="name">{{item.Name}}</span>
        <span class="manufacturers">{{item.ICDName}}</span>
      </template>
    </el-autocomplete>
  </div>
</template>
<script>
export default {
  name: "searchDiagnose", //诊断搜索
  props: {
    // 回调函数新增医嘱
    callBack: {
      type: Function,
      default: () => {}
    },
    // 是否修改
    number: {
      type: Number,
      default: -1
    },
    // 搜索框内文字
    itemName: {
      type: String,
      default: ""
    },
    isCreate: {
      type: Boolean,
      default: false
    },
    // 选中的值
    checkedData: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      value: "", //搜索值
      options: [], //医嘱内容
      ICDCode: "",
      currentKeyWord: ""
    };
  },
  created() {
    this.currentKeyWord = this.value = this.itemName;
    this.$Api.getICDtype({}).then(res => {
      if (res.Status && res.Data) {
        this.ICDCode = res.Data.ICDTypeName;
      }
    });
  },

  methods: {
    getDiagnose(el) {
      // console.log(el, "sssa", this.isMultiple);
      this.callBack(el, this.number);
      this.value = this.currentKeyWord = "";
    },
    searchList(val, cb) {
      let data;
      if (val) {
        data = { keyWord: val, icdType: this.ICDCode };
      } else {
        data = { icdType: this.ICDCode };
      }
      this.$Api.getDiagnoseSearchData(data).then(res => {
        this.options = res.Data || [];
        cb(this.options);
      });
    },
    // 远程搜索
    remoteMethod(val, cb) {
      console.log(val, "val");
      val = val && val.replace(/(^\s*)|(\s*$)/g, "");
      this.currentKeyWord = val;
      this.searchList(val, cb);
    },
    // 键盘事件
    keydown(el) {
      let target = el.target;
      if (
        el.key === "Backspace" &&
        target.value &&
        target.selectionStart === 0 &&
        target.selectionEnd === target.value.length
      ) {
        this.remoteMethod("");
      }
    },
    // 获焦时选中文本
    checkText(el) {
      let target = el.target;
      target.selectionStart = 0;
      target.selectionEnd = target.value.length;
    },
    // 处理自定义诊断
    setText(el) {
      console.log(el.target.value,this.value,999);
      if (!this.options.length && this.number > -1)
        this.callBack(this.value, this.number);
      // console.log(this.options,el,'set',this.value);
    }
  }
};
</script>
<style  lang='less'>
.searchDiagnose {
  height: 32px;
  display: flex;
  box-sizing: content-box !important;
  width: 100%;
  .diagnose-name {
    width: 120px;
    /deep/ .el-input__inner {
      border-radius: 2px 0px 0px 2px;
      border-right: solid;
      border-right-width: 1px;
      border-right-color: #bdcaee !important;
    }
  }
  .diagnose-list {
    flex: 1;
    /deep/ .el-input__inner {
      border-radius: 0px 2px 2px 0;
      padding-left: 5px;
      background: #f2f2f2;
      border: none;
    }
  }
  .diagnose-search {
    background: @controlBg;
    cursor: pointer;
    width: 30px;
    line-height: 32px;
    box-sizing: border-box;
    font-size: 16px;
    text-align: center;
    &.radius {
      border-radius: 2px 0px 0px 2px;
    }
  }
}
</style>
<style lang="less">
.my-list .el-scrollbar {
  min-width: 900px;
  // overflow-x: auto;
  .el-scrollbar__view li {
    min-width: 900px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .name,
  .manufacturers {
    font-size: 12px;
    display: inline-block;
  }
  .name {
    flex: 1;
  }
  .manufacturers {
    width: 250px;
    .textEllipsis(250px);
  }
}
</style>