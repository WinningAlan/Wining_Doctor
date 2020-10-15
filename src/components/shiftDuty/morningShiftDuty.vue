<template>
  <div class="morningShiftDuty" ref="bodyPrint">
    <div class="head">
      <div class="headLeft titleTab3" v-if="activeName=='3'">
        <el-radio v-model="selectArea" border label="0" size="medium">全部</el-radio>
        <el-radio
          size="medium"
          v-model="selectArea"
          border
          :label="item.DiagnosisAreaType"
          v-for="(item,index) in user.DiagnosisAreas"
          v-show="item.DiagnosisAreaType!=3"
          :key="index"
        >{{item.DiagnosisAreaName}}</el-radio>
      </div>
      <div class="headRight">
        <span>统计日期</span>
        <el-date-picker
          v-model="morningContent.StatisticsStartTime"
          type="datetime"
          :disabled="morningContent.IsHasSubmitRecord||(isDisable&&isEdit==false)"
        ></el-date-picker>--
        <el-date-picker
          v-model="morningContent.StatisticsEndTime"
          type="datetime"
          placeholder="请选择日期时间"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
          :disabled="isDisable&&isEdit==false"
        ></el-date-picker>
      </div>
    </div>
    <div :class="[activeName=='4'?'morningShiftDutyContentAlert':'morningShiftDutyContent']">
      <div class="view">
        <span class="tag"></span>
        <h1 class="title">总体概况</h1>
        <div class="viewContent">
          <ul>
            <li>
              <span>现有患者：</span>
              <span>{{morningContent.ExistingPat}}</span>
            </li>
            <li>
              <span>新入患者：</span>
              <span>{{morningContent.NewHosPat}}</span>
            </li>
            <li>
              <span>入院患者：</span>
              <span>{{morningContent.InHospitalPat}}</span>
            </li>
            <li>
              <span>出科患者：</span>
              <span>{{morningContent.OutHosPat}}</span>
            </li>
            <li>
              <span>死亡患者：</span>
              <span>{{morningContent.DeathPat}}</span>
            </li>
            <li>
              <span>危重患者：</span>
              <span>{{morningContent.CriticalPat}}</span>
            </li>
            <li>
              <span>手术患者：</span>
              <span>{{morningContent.OperationPat}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="importantPat">
        <span class="tag"></span>
        <h1 class="title">重点病人说明</h1>
        <div class="focusPatList">
          <edit-shift-duty
            v-for="(item,index) in editPatientList"
            :key="index"
            :item="item"
            :isDisable="isDisable&&isEdit==false"
            :activeName="activeName"
            :initialize="true"
          ></edit-shift-duty>
        </div>
      </div>
      <div class="other">
        <span class="tag"></span>
        <h1 class="title">其他说明</h1>
        <div class="inputStyle">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            :disabled="isDisable&&isEdit==false"
            v-model="morningContent.Remark"
            :autosize="{minRows:2}"
          ></el-input>
        </div>
      </div>
      <div class="btn" v-if="activeName=='3'">
        <el-button v-if="isEdit==false" @click="isEdit=true">编辑</el-button>
        <el-button @click="saveOrSubmit(1)" v-else>保存</el-button>
        <el-button @click="saveOrSubmit(2)">提交</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import editShiftDuty from "@/components/shiftDuty/editShiftDuty";
import { changeDateTimeFormat } from "@/utils/public";
import CASign from "@/utils/caSign.js";
export default {
  props: {
    // 当前展示的患者列表
    editPatientList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 当前选中的tab
    activeName: {
      type: String,
      default: "3"
    },
    // 晨交班相关信息
    morningContent: {
      type: Object,
      default: function() {
        return {};
      }
    },
    getMorningShiftContent: {
      type: Function
    }
  },
  components: {
    editShiftDuty
  },
  data() {
    return {
      selectArea: "0",
      isDisable: false, //是否是可编辑状态
      isChangeTab: true, //是否是可切换的，解决快速点击问题
      caSignOperation: {}, //
      currentObjData: "",
      submitType:1,
      currentDataStatus:1,//保存1  提交2
      isEdit:true,//是否可编辑
      //patTotal:{},
    };
  },
  created() {
    if (this.morningContent.Status == 1 || this.activeName == "4") {
      this.isDisable = true;
      this.isEdit = false
    }
    console.log(this.isDisable, "hhhhhh");
    if (this.isSignName) {
      this.caSignOperation = new CASign(this, this.signName);
    }
    //this.getMorningPatDataTotal();
  },
  methods: {
    save() {
      this.$print(this.$refs.bodyPrint);
      return false;
    },
    // 提交
    saveOrSubmit(value) {
      this.submitType=value
      this.currentDataStatus = value
      if (this.isSignName && value == 2) {
        let params = {};
        params = this.morningContent;
        // 保存或提交记录区域
        params.Status = value;
        params.PatientRemark = JSON.stringify(this.editPatientList);
        let obj = {
          Type: "0",
          Data: [{Name:'晨班交接'}],
          No: this.user.UserInfo.No,
          UserName: this.user.UserInfo.Name
        };
        this.currentObjData = obj;
        this.caSignOperation.KeyVerify();
      } else {
        this.handleOperation();
      }
    },
    handleOperation() {
      let params = {};
      params = this.morningContent;
      // 保存或提交记录区域
      params.Status = this.submitType;
      params.Status = this.currentDataStatus;
      params.PatientRemark = JSON.stringify(this.editPatientList);
      console.log(params, "患者晨交班");
      this.$Api.saveOrSubmitMorningShift(params).then(res => {
        //this.$msg[res.Status?'success':'error'](res.Message)
        if (res.Status) {
          this.$msg.success("操作成功");
          if (this.currentDataStatus == 1) {
            // 保存
            this.isEdit = false;
          } else {
            // 提交后刷新界面
            this.isEdit = true;
          }
          this.getMorningShiftContent(this.selectArea);
        } else {
          if (this.currentDataStatus == 2) {
            // 提交失败可能是统计时间不对
            this.$msg.warning("交班时间冲突,请刷新后提交");
          } else {
            this.$msg.warning("操作失败");
          }
        }
      });
    },
    // 获取晨交班的统计信息
    async getMorningPatDataTotal() {
      let params = {
        "dto.areaType": this.selectArea,
        "dto.beginTime": this.morningContent.StatisticsStartTime,
        "dto.endTime": this.morningContent.StatisticsEndTime
      };
      this.isChangeTab = false;
      let res = await this.$Api.getMorningPatTotal(params);
      if (res.Status) {
        this.isChangeTab = true;
        this.patTotal = res.Data;
        for (let key in res.Data) {
          this.morningContent[key] = res.Data[key];
        }
      }
    }
  },
  watch: {
    "morningContent.StatisticsStartTime": {
      immediate: true,
      handler: function(newValue) {
        if (this.activeName == "4") {
          return;
        }
        //let startTime = changeDateTimeFormat(newValue)
        let startTime = new Date(newValue).getTime()
        let endTime = new Date(this.morningContent.StatisticsEndTime).getTime()
        console.log(startTime,endTime,newValue,startTime>=endTime)
        if(newValue&&startTime>=endTime) {
          // this.$msg.warning('统计日期开始时间大于结束时间，请重新选择')
          this.morningContent.StatisticsStartTime=''
          return
        }
        
        this.getMorningPatDataTotal();
      }
    },
    "morningContent.StatisticsEndTime": {
      handler: function(newValue) {
        if (this.activeName == "4") {
          return;
        }
        let startTime = new Date(this.morningContent.StatisticsStartTime).getTime()
        let endTime = new Date(newValue).getTime()
        console.log(startTime,endTime,this.morningContent.StatisticsStartTime,startTime>=endTime)
        if(this.morningContent.StatisticsStartTime&&startTime>=endTime) {
          // this.$msg.warning('统计日期开始时间大于结束时间，请重新选择')
          this.morningContent.StatisticsEndTime = changeDateTimeFormat(new Date())
          return
        }
        this.getMorningPatDataTotal();
      }
    },
    selectArea: function(newValue) {
      if (this.isChangeTab == false) {
        return;
      }
      this.getMorningShiftContent(newValue);
    },
    isGetCA: function(val) {
      if (val) {
        // 验证
        this.caSignOperation.checkData(this.user.UserInfo, this.currentObjData);
      }
    }
  },
  computed: {
    ...mapGetters({
      signName: "public/GET_SIGNNAME", //签名系统简称
      isSignName: "public/GET_ISSIGNNAME", //是否启用
      isGetCA: "public/GET_ISGETCA", //
      user: "public/GET_USER"
    })
  }
};
</script>>
<style lang="less" scoped>
.morningShiftDuty {
  height: calc(~"(100% - 20px)");
  //height: auto;
  padding: 10px 20px;
  position: relative;
  font-size: 14px;
  //overflow: auto;
  .tag {
    //display: inline-block;
    width: 3px;
    background: #0f80ed;
    height: 15px;
    float: left;
    margin-right: 15px;
    margin-top: 4px;
  }
  .title {
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 10px;
  }
  .head {
    margin-bottom: 10px;
    overflow: hidden;
    .headLeft {
      float: left;
    }
    .headRight {
      float: right;
      margin-right: 10px;
      span {
        margin-right: 15px;
      }
    }
  }
  .morningShiftDutyContent {
    height: calc(~"(100% - 35px)");
    overflow: auto;
  }
  .morningShiftDutyContentAlert {
    //height:calc(~"(100% -70px)");
     height: 558px;
    overflow: auto;
  }
  .view {
    margin-bottom: 10px;
    .viewContent {
      margin-left: 20px;
      overflow: hidden;
      li {
        float: left;
        margin-right: 100px;
        span:nth-child(1) {
          display: inline-block;
          min-width: 70px;
        }
        span:nth-child(2) {
          display: inline-block;
          min-width: 50px;
        }
      }
    }
  }
  .importantPat {
    margin-bottom: 10px;
    .focusPatList {
      margin-left: 20px;
      background: #f3f5f9;
      min-height: 50px;
      //max-height: 157px;
      overflow: auto;
      /deep/.editShiftDuty {
        padding-top: 0;
        padding-bottom: 5px;
      }
    }
  }
  .other {
    margin-bottom: 10px;
    .inputStyle {
      margin-left: 20px;
    }
  }
  .btn {
    //position: absolute;
    // right: 0;
    // bottom: 4px;
    text-align: right;
  }
}
</style>
<style lang='less'>
@media print {
  .morningShiftDuty {
    height: auto !important;
  }
  .morningShiftDutyContentAlert {
    height: auto !important;
  }
  .focusPatList {
    max-height: none !important;
  }
  body{
    width:auto;
    height: auto;
  }
}
</style>