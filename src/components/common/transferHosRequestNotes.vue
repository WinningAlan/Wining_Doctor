<template>
  <div class="transferHosRequestNotes">
    <div class="line1">
      <span class="title2">转院方式</span>
      <el-radio
        v-model="turnStyle"
        v-for="(item,index) in dictionarys.TransferHospitalType"
        :label="item.Text"
        :key="index"
        v-show="item.Value!=-1"
      >{{item.Text}}</el-radio>
      <el-radio v-model="turnStyle" label="其他" style="margin-right:33px;">其他</el-radio>
      <el-input v-model="turnStyleRemark" v-show="setRemark" placeholder></el-input>
    </div>
    <div class="line2">
      <span class="title2">诊&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;断</span>
      <el-autocomplete
        v-model="patData.Diagnosis"
        placeholder="请输入内容"
        :disabled="true"
      ></el-autocomplete>
    </div>
    <div class="line3">
      <span class="title2">病情摘要</span>
      <el-input type="textarea" v-model="illnessRecord"></el-input>
    </div>
    <div class="line4">
      <span>转院原因</span>
      <el-radio
        v-model="turnReason"
        v-for="(item,index) in dictionarys.TransferHospitalReason"
        :label="item.Text"
        :key="index"
        v-show="item.Value!=-1"
      >{{item.Text}}</el-radio>
    </div>
    <div class="line5">
      <div class="left">
        <span class="title2">去向医院</span>
        <el-autocomplete
          v-model="turnToHos"
          :fetch-suggestions="queryHospatial"
          placeholder="请输入内容"
          @select="handleSelectHospatial"
        ></el-autocomplete>
      </div>
      <div class="right">
        <span class="title2">去向科室</span>
        <el-autocomplete
          v-model="turnToDep"
          :fetch-suggestions="querydep"
          placeholder="请输入内容"
          @select="handleSelectdep"
        ></el-autocomplete>
      </div>
    </div>
    <div class="line6">
      <div class="left">
        <span class="title2">申请时间</span>
        <el-date-picker
          v-model="requestTime"
          type="datetime"
          placeholder="选择日期时间"
          value-format=" yyyy-MM-dd HH:mm"
          format="yyyy-MM-dd HH:mm"
        ></el-date-picker>
      </div>
    </div>
  </div>
</template>
<script>
// import { debouce } from "@/utils/public.js";
import { mapGetters } from "vuex";
import { GetFormatDateTime } from "@/utils/public";
import CallNumber from "@/utils/callNumber.js";
export default {
    name:"transferHosRequestNotes",//转院申请单
  data() {
    return {
      diagnosis: "",
      deb: null, //防抖动
      turnToDep: "",
      fast: false, //是否加急
      requestTime: GetFormatDateTime(), // 申请时间
      turnStyle: "", //转院方式
      turnReason: "", //转院原因
      illnessRecord: "", //病情摘要
      setRemark: false,
      turnToHos: "", //去向医院
      turnStyleRemark: "", //其他的备注
      timer:null,
    };
  },
  created() {
    if (this.isQueueNumber === "1"&&this.selectArea.DiagnosisAreaType === 3) {
      this.callNumber = new CallNumber(this, this.callNumberName);
    }
  },
  methods: {


    queryHospatial(queryString, cb) {
      cb([]);
    },
    handleSelectHospatial() {},
    querydep(queryString, cb) {
      cb([]);
    },
    handleSelectdep(value) {
      console.log(value);
    },
    async save() {
      if (!this.turnStyle) {
        this.$msg.warning("请选择转院方式");
        return;
      }
      if (!this.patData.Diagnosis) {
        this.$msg.warning("诊断内容为空，不允许提交");
        return;
      }
      if (!this.illnessRecord) {
        this.$msg.warning("请填写病情摘要");
        return;
      }
      if (!this.turnToHos) {
        this.$msg.warning("请填写去向医院");
        return;
      }
      if (!this.turnToDep) {
        this.$msg.warning("请填写去向科室");
        return;
      }
      if (!this.requestTime) {
        this.$msg.warning("请选择申请时间");
        return;
      }
      if (this.turnStyle == "其他") {
        if (this.turnStyleRemark != "") {
          this.turnStyle = this.turnStyleRemark;
        }
      }
      // 提交申请单并生成医嘱
      let params = {
        InHospitalId: this.patData.Id,
        PatientId: this.patData.PatientId,
        TransferHospitalType: this.turnStyle,
        Diagnosis: this.patData.Diagnosis,
        ConditionSummary: this.illnessRecord,
        TransferHospitalReason: this.turnReason,
        TargetHospital: this.turnToHos,
        TargetDepartment: this.turnToDep,
        ApplyDate: this.requestTime,
        CASignImg:this.caImgData,
        TurnedTo:  this.patData.turnedTo,
        TransferTo:  this.patData.transferTo
      };
            //      let obj = {
            //   inHospitalId:  this.patData.Id,
            //   turnedTo:  this.patData.turnedTo,
            //   transferTo:  this.patData.transferTo
            // };
    // let res= await  this.$Api.patPrognosis(obj)
    // if (!res.Status) {
    //   return this.$msg.warning(res.Message)
    // }
      let result = await this.$Api.applyPatTransferHos(params);
      console.log(result);
      if (result.Status) {
        if (
          this.isQueueNumber === "1" &&
          !this.patData.IsRecall &&
          this.selectArea.DiagnosisAreaType === 3
        ) {
          this.callNumber.ChangeBrzt(this.patData.ActiveRegistId, 5);
        }
        // 触发打印
            this.$store.commit("public/SET_MEDICALADDEVENT",false)
        let t = new Date().getTime();
        let str = window.location.protocol + "\\" + window.location.host;
        let url = `${URLCONFIG.Emr}/nursing/EditPage.aspx?inHospPatId=${this.patData.Id}&objectType=11&t=${t}&mark=true&originUrl=${str}&templateId=${this.patData.Id}`;
        console.log(url,'住院url')
        this.$store.commit("public/SET_PRINTIFRAMEURL", url);
        return true;
      }
    },
  },
  computed: {
    ...mapGetters({
      dialogData: "public/GET_DIALOGDATA",
      dictionarys: "public/GET_DICTIONARIES",
      selectArea: "home/GET_SELECTAREA",
      user: "public/GET_USER",
      isQueueNumber: "configuration/GET_ISQUEUENUMBER", //是否启用排队叫号系统
      callNumberName: "configuration/GET_CALLNUMBER", //叫号操作系统
      caImgData:"public/GET_CAIMGDATA",//ca签名图片数据流，医嘱提交处使用
    }),
    patData: function() {
      return this.dialogData.data;
    }
  },
  watch: {
    turnStyle: function(newValue) {
      console.log();
      if (newValue == "其他") {
        this.setRemark = true;
      } else {
        this.setRemark = false;
      }
    },
  }
};
</script>
<style lang="less" scoped>
.transferHosRequestNotes {
  padding: 20px;
  .left {
    float: left;
    width: 47%;
  }
  .right {
    float: right;
    width: 47%;
  }

  > div {
    margin-bottom: 20px;
    overflow: hidden;
    //height: 32px;;
  }
  .title {
    font-size: 18px;
    font-weight: bold;
    text-align: center;
  }
  .title2 {
    margin-right: 20px;
    &:before {
      content: "*";
      display: inline-block;
      color: red;
      margin-right: 5px;
    }
  }
  .wordLetter {
    letter-spacing: 10px;
  }
  .line1 {
    height: 32px;
    line-height: 30px;
    .el-radio + .el-radio {
      margin-left: 0;
      margin-right: 29px;
    }
    .el-input {
      width: 35%;
    }
  }
  .line2 {
    .el-autocomplete {
      width: 85%;
    }
  }
  .line3 {
    span {
      height: 50px;
      display: inline-block;
    }
    .el-textarea {
      width: 85%;
    }
  }
  .line4 {
    .el-radio + .el-radio {
      margin-left: 0;
      margin-right: 29px;
    }
    span {
      margin-right: 20px;
      margin-left: 12px;
    }
  }
  .line5 {
    .el-autocomplete {
      width: 69%;
    }
    .el-select {
      width: 69%;
    }
  }
  .line6 {
    .el-input {
      width: 69%;
    }
  }
}
</style>
