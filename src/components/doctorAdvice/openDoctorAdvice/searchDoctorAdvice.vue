<template>
  <div class="searchDoctorAdvice">
    <el-select
      :value="adviceName"
      placeholder="请选择"
      class="advice-name"
      @change="change"
      v-show="isShow"
    >
      <el-option
        v-for="item in adviceNameOptions"
        :key="item.Id"
        :label="item.Name"
        :value="item.AdviceCode"
      ></el-option>
    </el-select>
    <span class="el-icon-search advice-search" :class="{radius:!isShow}"></span>
    <el-select
      class="advice-list"
      v-model="value"
      ref="advice"
      @change="getAdvice"
      default-first-option
      filterable
      remote
      :allow-create="adviceName===122||adviceName==='text'"
      value-key="Id"
      placeholder="请输入拼音首字母或汉字"
      @focus="getFocus()"
      @blur="clearCurrentKeyWord"
      :remote-method="remoteMethod"
      :loading="loading"
      v-loadmore="loadMore"
    >
      <!--如果是药品，没有处方权限不显示出来-->
      <el-option-group
        v-for="(ii,index) in options"
        :key="index"
        v-if="(ii.m_Item2.length&&ii.m_Item2[0].ItemType!=14)||(ii.m_Item2.length&&ii.m_Item2[0].ItemType==14&&userRightList.IsHasPrescriptionRight)"
      >
        <li class="group">
          <span class="adviceIcon">{{ii.m_Item2.length&&ii.m_Item2[0].OrderTypeWord}}</span>
        </li>
        <el-option
          v-for="(item,index) in ii.m_Item2"
          :key="index"
          :label="item.ItemName"
          :value="item"
        >
          <span class="name">{{item.ItemName}}{{item.CategoryName?`[${item.CategoryName}]`:''}}</span>
          <span
            class="price"
            v-if="ii.m_Item1!=='Words'"
          >{{(+item.Price).toFixed(2)}}/{{item.DrugStoreUnit}}</span>
          <span class="manufacturers">{{item.Vendor}}</span>
          <span class="alias">{{item.Alias}}</span>
          <span
            class="price"
            :class="{hidden:ii.m_Item1!=='Medication'}"
            :style="{color:item.StockNum>0?'#0f49ed':'#f58b8b'}"
            style="margin-right:5px;"
          >{{item.StockNum>0?((item.StockNum>999?'999+':item.StockNum)+item.DrugStoreUnit):'无库存'}}</span>
        </el-option>
      </el-option-group>
    </el-select>
    <myAlter
      title="医保审核"
      :visible="showAlter"
      :isfooter="false"
      width="550px"
      :callback="closeAlter"
    >
      <medicareReimbursement :adviceData="adviceData">
        <el-button @click="closeAlter(false)">取 消</el-button>
        <el-button type="primary" @click="closeAlter(true,2)">自 费</el-button>
        <el-button type="primary" @click="closeAlter(true,1)">报 销</el-button>
      </medicareReimbursement>
    </myAlter>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import medicareReimbursement from "./medicareReimbursement.vue";
import myAlter from "../../common/myAlter.vue";

export default {
  name: "searchDoctorAdvice", //医嘱搜索
  components: {
    medicareReimbursement,
    myAlter
  },
  props: {
    // 医嘱类型
    adviceName: {
      type: [Number, String],
      required: true
    },
    // 回调函数新增医嘱
    callBack: {
      type: Function,
      required: true
    },
    // 是否显示医嘱类别筛选
    isShow: {
      type: Boolean,
      default: false
    },
    // 是否修改
    index: {
      type: Number,
      default: -1
    },
    // 搜索框内文字
    itemName: {
      type: String,
      default: ""
    },
    // 科室
    departmentCode: {
      type: String,
      default: ""
    },
    categoryNo: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      value: "", //搜索值
      loading: false,
      options: {}, //医嘱内容
      PageIndex: 1,
      PageSize: 10,
      currentKeyWord: "", //当前输入关键字
      showAlter: false,
      adviceData: {}
    };
  },
  created() {
    this.value = this.currentKeyWord = this.itemName;
    this.searchList(this.currentKeyWord);
    this.$nextTick(() => {
      document
        .querySelector(".advice-list .el-input__inner")
        .addEventListener("keydown", this.keydown, false);
      document
        .querySelector(".advice-list .el-input__inner")
        .addEventListener("compositionend", this.compositionEnd, false);
      this.$refs.advice.toggleMenu = function(el) {
        // console.log(el,'uuu');
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
    let dom = document.querySelector(".advice-list .el-input__inner");
    dom && dom.removeEventListener("keydown", this.keydown, false);
    dom &&
      dom.removeEventListener("compositionend", this.compositionEnd, false);
  },
  computed: {
    ...mapGetters({
      requestRule: "configuration/GET_REQUESTRULE",
      typeList: "doctoradvice/GET_ORDERCLASSIFICATION",
      userRightList: "public/GET_USERRIGHTLIST",
      patientMsg: "public/GET_PATIENTMSG",
      medicareList: "configuration/GET_MEDICARELIST",
    }),
    adviceNameOptions: function() {
      let obj = { Id: -1, Name: "全部", AdviceCode: -1 };
      let arr = [obj, ...this.typeList];
      return arr;
    }
  },
  watch: {
    adviceName: {
      immediate: true,
      handler: function(newValue) {
        if (newValue != -1) {
          this.PageIndex = 1;
          this.options = [];
        }
      }
    }
  },
  directives: {
    loadmore: {
      bind: function(el, binding) {
        const SELECTWRAP_DOM = el.querySelector(
          ".el-select-dropdown .el-select-dropdown__wrap"
        );
        SELECTWRAP_DOM.addEventListener("scroll", function() {
          // 滚动条已经到底部
          const CONDITION =
            this.scrollHeight - this.scrollTop <= this.clientHeight;
          if (CONDITION) {
            binding.value();
          }
        });
      }
    }
  },
  methods: {
    closeAlter(bl, num) {
      if (bl) {
        this.adviceData.ReimbursementType = num;
        this.getAdvice(this.adviceData, true);
      } else {
        this.value = this.currentKeyWord;
      }
      this.showAlter = false;
    },
    // 中文输入法结束事件
    compositionEnd(e) {
      console.log(e, "结束", this.options, e.target.value);
      this.remoteMethod(e.target.value);
    },
    // 失去焦点 清空关键字
    clearCurrentKeyWord() {
      this.$nextTick(() => {
        if (this.itemName) {
          this.value = this.currentKeyWord = this.itemName;
        } else {
          this.value = this.currentKeyWord;
        }
      });
    },
    getFocus() {
      this.PageIndex = 1;
      this.searchList(this.value);
    },
    // 滚动条滚动触发事件
    loadMore() {
      if (this.adviceName == -1) {
        // 全部不触发更新
        return;
      }
      this.searchList(this.currentKeyWord);
    },
    getAdvice(el, bl) {
      
      let feeType=this.$route.name==='orderPackage'?'':this.patientMsg.SocialSecurityCode;
      let isFee=this.$route.name==='orderPackage'?true:this.medicareList.includes(feeType)
      console.log(this.$route.name,feeType);
      if (typeof el !== "string" && el.ItemType === 14 &&el.MedicalInsuranceControlFlag&& !bl&&isFee) {
        this.adviceData = el;
        return (this.showAlter = true);
      }
      console.log(el, "xuan");
      this.callBack(el, this.index);
      this.value = this.currentKeyWord = "";
      this.$nextTick(() => {
        this.$refs.advice && this.$refs.advice.blur();
      });
    },
    change(el) {
      this.$emit("update:adviceName", el);
    },
    searchList(val) {
      console.log(val, "val");
      let typeList = [];
      if (typeof this.adviceName == "number") {
        if (this.adviceName == -1) {
          typeList = [-1];
        } else {
          // 用血
          typeList = [this.adviceName];
        }
      } else {
        let obj = this.adviceNameOptions.find(item => {
          if (item.AdviceCode == this.adviceName) {
            return item;
          }
        });
        let arr = obj.OrderTypeModelList || [];
        arr.forEach(item => {
          typeList.push(item.Code);
        });
      }
      let data = {
        CategoryCode: this.requestRule == 2 ? this.categoryNo : "",
        SearchType: typeList,
        keyWord: val,
        DeptCode: this.departmentCode,
        DictItemCode: "",
        PageIndex: this.PageIndex,
        PageSize: this.PageSize,
        HisRegisterId: this.$route.query.id ? this.patientMsg.RegistId : ""
      };
      this.$Api.searchAdvices2(data).then(res => {
        if (res.Status) {
          if (this.adviceName == -1 || this.PageIndex == 1) {
            this.options = res.Data || [];
          } else {
            let arr = res.Data || [];
            for (let i = 0; i < this.options.length; i++) {
              for (let j = 0; j < arr.length; j++) {
                if (arr[j].m_Item1 == this.options[i].m_Item1) {
                  let opts = [...this.options[i].m_Item2, ...arr[j].m_Item2];
                  this.options[i].m_Item2 = opts;
                }
              }
            }
          }
          this.PageIndex += 1;
        }
        if (this.adviceName === 122 || this.adviceName === "text") {
          this.options.forEach(el => {
            if (el.m_Item1 === "Words" && el.m_Item2.length === 0) {
              this.options = [
                {
                  m_Item1: "Words",
                  m_Item2: [{ ItemType: 122, ItemName: val }]
                }
              ];
            }
          });
        }
        this.loading = false;
      });
    },
    // 远程搜索
    remoteMethod(val) {
      console.log(val, "remoteMethod");
      val = val && val.replace(/(^\s*)|(\s*$)/g, "");
      this.currentKeyWord = this.value = val;
      this.PageIndex = 1;
      this.options = [];
      this.loading = true;
      this.searchList(val);
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
    }
  }
};
</script>
<style scoped lang='less'>
.searchDoctorAdvice {
  height: 32px;
  display: flex;
  // padding: 10px 0;
  box-sizing: content-box !important;
  width: 100%;
  .advice-name {
    width: 120px;
    /deep/ .el-input__inner {
      border-radius: 2px 0px 0px 2px;
      border-right: solid;
      border-right-width: 1px;
      border-right-color: #bdcaee !important;
    }
  }
  .advice-list {
    flex: 1;
    /deep/ .el-input__inner {
      border-radius: 0px 2px 2px 0;
      padding-left: 0;
    }
  }
  .advice-search {
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
  position: relative;
  min-width: 900px;
  overflow-x: auto;

  .group {
    position: absolute;
    left: 10px;
    top: 7px;
  }
  .el-select-dropdown__item {
    // overflow: hidden;
    min-width: 900px;
    margin-left: 30px;
    padding-right: 10px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .name,
  .price,
  .manufacturers,
  .alias {
    font-size: 12px;
    display: inline-block;
  }
  .name {
    // width: 40%;
    flex: 1;
    // min-width: 240px;
  }
  .price {
    // width: 10%;
    width: 90px;
    &.hidden {
      visibility: hidden;
    }
    // min-width: 100px;
  }
  .manufacturers {
    // width: 30%;
    // min-width: 220px;
    width: 200px;
    .textEllipsis(200px);
  }
  .alias {
    .textEllipsis(200px);

    // width: 20%;
    // min-width: 150px;
    width: 200px;
    // flex: .3;
  }
}
</style>
