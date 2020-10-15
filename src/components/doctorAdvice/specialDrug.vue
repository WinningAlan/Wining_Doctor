<template>
  <div class="specialDrug">
    <div class="drugMessage">
      <div v-for="(item,index) in specialDrugMessage.SpecialDrugInfo" :key="index">
        <div class="drug1">
          <div>{{item.MedicinalName}}</div>
          <div>{{item.SpecificationName}}</div>
          <div>{{item.Dose}}{{item.Unit}}</div>
        </div>
        <div class="drug1">
          <div>{{item.Dosage}}{{item.DosageUnit}}</div>
          <div>{{item.UsageText}}</div>
        </div>
      </div>
    </div>
    <div class="patMessage">
      <ul>
        <li>
          <span>患者ID：</span>
          {{specialDrugMessage.HISPatientId}}
        </li>
        <li class="perMessage">
          <div>
            <span>患者姓名：</span>
            <span>{{specialDrugMessage.Name}}</span>
          </div>
          <div>
            <span>性别：</span>
            <span>{{specialDrugMessage.PatGenderCode|sexFilter}}</span>
          </div>
          <div>
            <span>年龄：</span>
            <span>{{specialDrugMessage.AgeYear | ageFilter(specialDrugMessage.AgeMonth)}}</span>
          </div>
        </li>
        <li>
          <span style="color:red; width:0" v-show="!IDNum">*</span>
          <span>身份证号：</span>
          <el-input placeholder="请输入患者身份证号" v-model="specialDrugMessage.IDCardNumber" v-if="!IDNum"
          @change="changePatIdNum" :disabled="!enable"></el-input>
          <span v-else style="width:450px;text-align:left;">{{IDNum}}</span>
        </li>
        <li class="perMessage">
          <div>
            <span>代办人姓名：</span>
            <el-input placeholder="姓名" v-model="specialDrugMessage.AgencyName" :disabled="!enable"></el-input>
          </div>
          <div>
            <span>性别：</span>
            <span>{{specialDrugMessage.AgencyGenderCode|sexFilter}}</span>
          </div>
          <div>
            <span>年龄：</span>
            <span>{{specialDrugMessage.AgencyAge | ageFilter(specialDrugMessage.AgencyAgeMonth)}}</span>
          </div>
        </li>
        <li>
          <span style="color:red; width:0" v-show="specialDrugMessage.AgencyName">*</span>
          <span>身份证号：</span>
          <el-input placeholder="请输入领药人身份证号" v-model="specialDrugMessage.AgencyIDCardNumber"
          @change="changeAgencyIdNum" :disabled="!enable"
          ></el-input>
        </li>
        <li>
          <span>领药人电话：</span>
          <el-input placeholder="请输入领药人电话" v-model="specialDrugMessage.CollarMedicineTel"
          :disabled="!enable"></el-input>
        </li>
        <li>
          <span>领药人地址：</span>
          <el-input
            placeholder="请输入领药人地址"
            type="textarea"
            :autosize="true"
            :disabled="!enable"
            v-model="specialDrugMessage.CollarMedicineAddress"
          ></el-input>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { identityCodeValid,getBirthday } from "@/utils/public.js";
export default {
  props: {
    specialDrugMessage: {
      type: Object,
      default: function() {
        return {};
      }
    },
    enable:{
      type:Boolean,
      default:function() {
        return true
      }
    }
  },
  data() {
    return {
      IDNum: "", //患者身份证号
      //enable:true,//是否可编辑
      editIdCardNum:false,//是否可编辑身份证号
    };
  },
  created() {
   // this.IDNum = this.specialDrugMessage.IDCardNumber;
  },
  mounted() {
    this.$nextTick(() => {
      this.IDNum = this.specialDrugMessage.IDCardNumber;
    console.log(this.specialDrugMessage,'特殊药品的详细信息')
    })
  },
  methods: {
    changePatIdNum(value) {
      let regData = identityCodeValid(
            value
          );
          if (!regData.pass) {
            this.$msg.warning(regData.message);
            return;
          }else{
            let obj = getBirthday(value)
            this.specialDrugMessage.Age = obj.ageValue
            this.specialDrugMessage.AgeYear = obj.ageValue
            this.specialDrugMessage.AgeMonth = obj.monthValue
            // 性别
            let sex = value.slice(16,17)
            console.log(sex,'性别')
            if(sex%2==0) {
              this.specialDrugMessage.PatGenderCode = 2
            }else{
              this.specialDrugMessage.PatGenderCode = 1
            }
          }
    },
    changeAgencyIdNum(value) {
      // 有内容校验
          let regData = identityCodeValid(
            value
          );
          if (!regData.pass) {
            this.$msg.warning(regData.message);
            return;
          }else{
            let obj = getBirthday(value)
            this.specialDrugMessage.AgencyAge = obj.ageValue
            this.specialDrugMessage.AgencyAgeMonth = obj.monthValue
            // 性别
            let sex = value.slice(16,17)
            if(sex%2==0) {
              this.specialDrugMessage.AgencyGenderCode = 2
            }else{
              this.specialDrugMessage.AgencyGenderCode = 1
            }
          }
    },
    async save() {
      // 患者身份证号必填
      // 如果领药人是自己，代办人不用填写
      // 如果领药人是别人，基本信息和身份证号必填，地址和电话不是必填
      
      if (this.specialDrugMessage.AgencyName) {
        if (!this.specialDrugMessage.AgencyIDCardNumber) {
          this.$msg.warning("请填写代领人身份证号");
          return;
        }else{
          // 有内容校验
          let regData = identityCodeValid(
            this.specialDrugMessage.AgencyIDCardNumber
          );
          if (!regData.pass) {
            this.$msg.warning(regData.message);
            return;
          }else{
            let obj = getBirthday(this.specialDrugMessage.AgencyIDCardNumber)
            this.specialDrugMessage.AgencyAge = obj.ageValue
          }
        }
      }
      if(this.specialDrugMessage.CollarMedicineTel) {
         if(!((/^1[3456789]\d{9}$/.test(this.specialDrugMessage.CollarMedicineTel))
         ||(/0\d{2,3}-\d{7,8}/.test(this.specialDrugMessage.CollarMedicineTel)))) {
           // 正则验证不通过
           this.$msg.warning('电话格式错误')
           return
         }
      }
      if (this.specialDrugMessage.IDCardNumber) {
        // 有内容校验
        let regData = identityCodeValid(this.specialDrugMessage.IDCardNumber);
        if (!regData.pass) {
          this.$msg.warning(regData.message);
          return;
        }
      }else{
        this.$msg.warning('请填写患者身份证号')
        return
      }
      let params = this.specialDrugMessage;
      //params.OrderIds = arr
      let res = await this.$Api.submitSpecialDrugTake(params);
      this.$msg[res.Status ? "success" : "warning"](res.Message);
      if (res.Status) {
        // 成功之后打印
        //let RegisterId = res.Data.RegisterId;
        return res.Data;
      } else {
        return false;
      }
    }
  },
  computed: {
    ...mapGetters({
      dictionaries: "public/GET_DICTIONARIES"
    }),
    sexList: function() {
      return this.dictionaries.PatGenderCode;
    }
  },
};
</script>>
<style lang="less" scoped>
.specialDrug {
  padding: 10px 20px;
  max-height: 768px;
  overflow: auto;
  color: #888;
  .drugMessage {
    border-bottom: 1px solid #f2f2f2;
    padding: 20px 30px;
    .drug1 {
      display: flex;
      justify-content: space-between;
      span {
        color: @wordColor;
      }
    }
  }
  .patMessage {
    margin-top: 20px;
    text-align: center;
    li {
      margin-bottom: 15px;
      span {
        display: inline-block;
        width: 85px;
        //margin-right: 10px;
        color: @wordColor;
        text-align: right;
      }
      .el-textarea {
        width: 450px;
      }
      /deep/.el-textarea__inner {
        background-color: #f2f2f2;
        border: none;
      }
      .el-input {
        width: 450px;
      }
      /deep/.el-input--small .el-input__inner {
        border: none;
        background: #f2f2f2;
      }
    }
    li:nth-child(1) {
          width: 535px;
    text-align: left;
    margin: 0 auto;
    margin-bottom: 15px;;
    }
    // .AgencyMessage {
    //   > div {
    //     width: auto;
    //     display: inline-block;
    //     //margin-right: 10px;
    //     .el-input {
    //       width: 93px;
    //     }
    //     /deep/.el-select > .el-input {
    //       width: 93px;
    //     }
    //   }
    // }
    .perMessage {
      div:nth-child(1){
        .el-input {
        width: 93px;
      }
      span{
        width:95px;
      }
      }
      > div {
        width: auto;
        display: inline-block;
        margin-right: 9px;
        
        span:nth-child(2) {
          color: #888;
        }
      }
    }
  }
}
</style>