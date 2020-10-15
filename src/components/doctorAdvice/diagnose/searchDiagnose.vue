<template>
  <div class="searchDiagnose">
    <span class="el-icon-search diagnose-search" v-if="!isCreate"></span>
    <el-select
      class="diagnose-list"
      v-model="value"
      @change="getDiagnose"
      default-first-option
      :allow-create="isCreate"
      :multiple="isMultiple"
      filterable
      remote
      value-key="Id"
      ref="advice"
      placeholder="请输入拼音首字母或汉字"
      :remote-method="remoteMethod"
      :loading="loading"
       @focus="remoteMethod(currentKeyWord)"
        @blur="clearCurrentKeyWord"
    >
      <el-option-group>
        <el-option v-for="(item,index) in options" :key="index" :label="item.Name" :value="item">
          <span class="name">{{item.Name}}</span>
          <span class="manufacturers">{{item.ICDName}}</span>
        </el-option>
      </el-option-group>
    </el-select>
  </div>
</template>
<script>
export default {
  name: "searchDiagnose", //诊断搜索
  props: {
    // 回调函数新增医嘱
    callBack: {
      type: Function,
      default:()=>{}
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
    isCreate:{
      type:Boolean,
      default:false
    },
    // 是否多选
    isMultiple:{
      type:Boolean,
      default:false
    },
    // 选中的值
    checkedData:{
      type:Array,
      default:()=>{
        return []
      }
    }
  },
  data() {
    return {
      value: "", //搜索值
      loading: false,
      options: {}, //医嘱内容
      ICDCode:"",
      currentKeyWord:'',
    };
  },
  created() {
    this.currentKeyWord=this.value = this.itemName;
    this.$Api.getICDtype({}).then(res => {
      if (res.Status && res.Data) {
        this.ICDCode = res.Data.ICDTypeName;
        this.searchList(this.value);
      }
    });
    this.$nextTick(() => {
      document.querySelector(".searchDiagnose .el-input__inner").addEventListener('keydown',this.keydown,false)
      document.querySelector(".searchDiagnose .el-input__inner").addEventListener('compositionend',this.compositionEnd,false)
        this.$refs.advice.toggleMenu = function(el) {
          if (el) return false;
          if (!this.selectDisabled) {
            if (this.menuVisibleOnFocus) {
              this.menuVisibleOnFocus = false;
            } else {
              this.visible = !this.visible;
            }
            if (this.visible) {
              (this.$refs.input || this.$refs.reference).focus();
            }
          }
        };
      });
  },
  beforeDestroy() {
    let dom=document.querySelector(".searchDiagnose .el-input__inner")
      dom&& dom.removeEventListener('keydown',this.keydown,false)
      dom&& dom.removeEventListener('compositionend',this.compositionEnd,false)
  },
  methods: {
        // 中文输入法结束事件
    compositionEnd(e){
console.log(e,'结束',this.options,e.target.value);
this.remoteMethod(e.target.value)
    },
        // 失去焦点 清空关键字
    clearCurrentKeyWord() {
      if(this.itemName) {
        this.value = this.currentKeyWord = this.itemName;
      }else{
        this.value = this.currentKeyWord;
      }
      
    },
    getDiagnose(el) {
        console.log(el,'sssa',this.isMultiple);

      if (!this.isMultiple) {
      this.callBack(el,this.number);
      }else{
        let arr=[];
        el.forEach(item=>{
          arr.push(item.Code)
        })
        this.$emit("update:checkedData", arr);
      }
        this.value =this.currentKeyWord= '';
      this.$nextTick(() => {
        this.$refs.advice && this.$refs.advice.blur();
      });
    },
    searchList(val) {
      let data;
      if(val){
         data = {keyWord: val,icdType:this.ICDCode};
      }else{
        data = {icdType:this.ICDCode}
      }
        this.loading = true;
      this.$Api.getDiagnoseSearchData(data).then(res => {
        this.options = res.Data ||[];
        this.loading = false;
      });
    },
    // 远程搜索
    remoteMethod(val) {
      console.log(val,'val');
      val = val && val.replace(/(^\s*)|(\s*$)/g, "");
      this.currentKeyWord = val;  
      this.searchList(val);
    },
    // 键盘事件
        keydown(el){
      let target=el.target
      if (el.key==='Backspace'&&target.value&&target.selectionStart===0&&target.selectionEnd===target.value.length) {
        this.remoteMethod('')
      }
    },
  }
};
</script>
<style scoped lang='less'>
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
/deep/ .el-select-group {
  min-width: 900px;
  overflow-x: auto;
  .el-select-dropdown__item {
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
