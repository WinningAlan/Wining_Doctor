<template>
  <div class="editShiftDuty">
    <div class="head">
      <div class="headLeft">
        <ul>
          <li>{{item.BedNo}}</li>
          <li>{{item.AreaName}}</li>
          <li>{{item.PatientName}}</li>
          <li>{{item.PatGenderCode|sexFilter}}</li>
          <li>{{item.AgeYear | ageFilter(item.AgeMonth)}}</li>
          <li>
            <span v-if="item.IsNew" class="xin"></span>
          </li>
          <li>
            <span class="wei" v-if="item.IsPeril"></span>
          </li>
          <li>
            <span class="zhong" v-if="item.IsHeavy"></span>
          </li>
          <li>
            <span class="shu" v-if="item.IsOperation"></span>
          </li>
        </ul>
      </div>
      <div class="headRight" v-show="isDisable==false" @click="copyInsert">
        <el-button plain>引用</el-button>
      </div>
    </div>
    <div class="handoverEdit">
      <div v-if="activeName=='2'" class="title2">交班重点</div>
      <div class="line1" :class="{'textInput':activeName=='3'}">
        <span>病情变化：</span>
        <el-input
          type="textarea"
          :disabled="activeName=='2'||activeName=='4'||isDisable"
          v-model="item.ConditionsChange"
          placeholder="请输入内容"
          @focus="getFocus('ConditionsChange')"
          :resize="activeName=='4'?'none':'vertical'"
          :autosize="activeName=='4'"
        ></el-input>
      </div>
      <div class="line2" :class="{'textInput':activeName=='3'}">
        <span>诊疗经过：</span>
        <el-input
          type="textarea"
          v-model="item.TreatmentProcess"
          :disabled="activeName=='2'||activeName=='4'||isDisable"
          placeholder="请输入内容"
          @focus="getFocus('TreatmentProcess')"
          :resize="activeName=='4'?'none':'vertical'"
          :autosize="activeName=='4'"
        ></el-input>
      </div>
      <div class="line3" :class="{'textInput':activeName=='3'}">
        <span>注意事项：</span>
        <el-input
          type="textarea"
          v-model="item.HandoverRemark"
          :disabled="activeName=='2'||activeName=='4'||isDisable"
          placeholder="请输入内容"
          @focus="getFocus('HandoverRemark')"
          :resize="activeName=='4'?'none':'vertical'"
          :autosize="activeName=='4'"
        ></el-input>
      </div>
    </div>
    <div class="takeoverEdit" v-if="activeName=='2'">
      <div class="title2">接班重点</div>
      <div class="line1">
        <span>当前病情：</span>
        <el-input
          type="textarea"
          resize="vertical"
          rows="2"
          placeholder="请输入内容"
          v-model="item.ShiftConditionsChange"
          @focus="getFocus('ShiftConditionsChange')"
          :autosize="true"
        ></el-input>
      </div>
      <div class="line2">
        <span>当前处置：</span>
        <el-input
          type="textarea"
          resize="vertical"
          rows="2"
          placeholder="请输入内容"
          v-model="item.ShiftDisMeasures"
          @focus="getFocus('ShiftDisMeasures')"
          :autosize="true"
        ></el-input>
      </div>
      <div class="line3">
        <span>诊疗计划：</span>
        <el-input
          type="textarea"
          resize="vertical"
          rows="2"
          placeholder="请输入内容"
          v-model="item.ShiftTreatmentPlan"
          @focus="getFocus('ShiftTreatmentPlan')"
          :autosize="true"
        ></el-input>
      </div>
    </div>
    <my-alter
      :title="citeData.name"
      :visible="citeData.visible"
      :isfooter="false"
      :width="citeData.width"
      :callback="closeDialog"
    >
      <dataReferenceAlter :alterData="citeData"></dataReferenceAlter>
    </my-alter>
  </div>
</template>
<script>
import dataReferenceAlter from "../../components/doctorAdvice/medicalHistory/dataReferenceAlter.vue";
import myAlter from "@/components/common/myAlter";
import { dataReference } from "@/module/alertData.js";
export default {
  components: {
    dataReferenceAlter,
    myAlter
  },
  props: {
    item: {
      type: Object,
      default: function() {
        return {};
      }
    },
    activeName: {
      type: String,
      default: "1"
    },
    isDisable: {
      type: Boolean,
      default: false
    },
    initialize: Boolean
  },
  data() {
    return {
      focusType: "", //目前获取焦点的输入框
      citeData: dataReference
    };
  },
  watch: {
    "citeData.insertContent": {
      immediate: true,
      handler: function(newValue) {
        console.log(newValue,this.item[this.focusType], "插入数据");
        //let str = (this.item[this.focusType]+";"+newValue).replace(';',"").replace(/null;/g,"").replace(/null/g,"").replace(/undefined/g,"").replace(/&nbsp;/g,"")
        let str = ''
        str = this.item[this.focusType]==null?newValue:(this.item[this.focusType]+";"+newValue).replace(';',"")
        console.log(str,'整理数据')
        this.item[this.focusType] = str;
      }
    },
    initialize: {
      handler: function(val, oldVal) {
        if (val) {
          this.citeData = JSON.parse(JSON.stringify(dataReference));
          console.log(this.item);
          this.citeData.inHouseId = this.item.InHospitalId;
          this.citeData.PatientId = this.item.PatientId;
          this.citeData.list.push({ text: "护理记录", value: 5 });
          this.citeData.HISPatientId = this.item.HISPatientId;
          this.citeData.InHospTime = this.item.InHospTime
          console.log(this.citeData,'初始化数据');
        }
      },
      immediate: true
    }
  },
  methods: {
    getFocus(type) {
      this.focusType = type;
    },
    async save() {
      if (this.activeName == "1") {
        // 交班
        let {
          InHospitalId,
          ConditionsChange,
          TreatmentProcess,
          HandoverRemark,
          IsOperation,
          IsDangerous
        } = this.item;
        let params = {
          InHospitalId,
          ConditionsChange,
          TreatmentProcess,
          HandoverRemark,
          IsOperation,
          IsDangerous
        };
        let res = await this.$Api.saveImportantHandover(params);
        this.$msg[res.Status ? "success" : "warning"](res.Message);
        return false;
      } else if (this.activeName == "2") {
        // 接班内容保存
        let params = {
          HandoverShiftId: this.item.Id,
          ShiftConditionsChange: this.item.ShiftConditionsChange,
          ShiftDisMeasures: this.item.ShiftDisMeasures,
          ShiftTreatmentPlan: this.item.ShiftTreatmentPlan
        };
        let res = await this.$Api.saveImportantTakeover(params);
        this.$msg[res.Status ? "success" : "warning"](res.Message);
        return false;
      }
    },
    closeDialog(value) {
      this.citeData.visible = false;
    },
    copyInsert() {
      this.citeData.visible = true;
      this.citeData.insertContent = "";
    }
  }
};
</script>
<style lang="less" scoped>
.editShiftDuty {
  padding: 20px;
  color: #333333;
  .head {
    overflow: hidden;
    height: 50px;
    line-height: 50px;
    //margin-bottom: 10px;
    .headLeft {
      float: left;
      ul > li {
        float: left;
        margin-right: 20px;
      }
      li:nth-child(1),
      li:nth-child(2),
      li:nth-child(3),
      li:nth-child(4) {
        font-weight: bold;
      }
    }
    .headRight {
      float: right;
    }
  }
  .title2 {
    color: #666666;
  }
  .handoverEdit {
    div:nth-child(1) {
      //color: #888888;
      margin-bottom: 10px;
      //font-weight: bold;
    }
  }
  .takeoverEdit {
    div:nth-child(1) {
      //color: #666666;
      //font-weight: bold;
      margin-bottom: 10px;
    }
  }
  .line1,
  .line2,
  .line3 {
    margin-bottom: 10px;
    position: relative;
    span {
      display: inline-block;
      position: absolute;
      //margin-bottom: 24px;
    }
    .el-textarea {
      margin-left: 80px;
      width: calc(~"(100% - 80px)");
      // width: 700px;
      // margin-left: 24px;
      /deep/.el-textarea__inner {
        background: #f3f5f9;
        border: none;
        resize: none;
      }
    }
  }
  .textInput {
    .el-textarea {
      /deep/.el-textarea__inner {
        background: #f3f5f9;
        border: 1px solid #dcdfe6;
      }
    }
  }
}
</style>