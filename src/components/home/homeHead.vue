<template>
  <div class="homeHead">
    <div class="homeHeadLeft">
      <div>
        <img src="../../assets/imges/time.png" alt /> 最近24小时
      </div>
      <div>
        <el-checkbox
          label="仅看我"
          border
          v-model="justMe"
          @change="getPatSummaryByDiagnosisArea"
          :disabled="!selectArea.DiagnosisAreaType"
        ></el-checkbox>
      </div>
      <div
        @click="startOrStopReceive"
        v-show="doctorSelectDep==''&&selectArea.DiagnosisAreaType===3&&isQueueNumber=='1'"
      >
        <div class="buttonStyle startReceive">
          <img src="../../assets/imges/startReceive.svg" alt /> 开始接诊
        </div>
      </div>
      <div v-show="doctorSelectDep!=''">
        <div class="buttonStyle stopReceive" @click="startOrStopReceive">
          <img src="../../assets/imges/stopReceive.svg" alt />停止接诊
        </div>
        <div class="buttonStyle pauseReceive" @click="setDoctorStatus">
          <div v-show="pauseDoctor==false">
            <img src="../../assets/imges/pauseReceive.svg" alt />暂停接诊
          </div>
          <div v-show="pauseDoctor">
            <img src="../../assets/imges/pauseReceive.svg" alt />继续接诊
          </div>
        </div>
        <template v-if="isQueueNumber==='1'">
          <div class="buttonStyle callAgain" @click="throttleFn('reCallPat')">
            <img src="../../assets/imges/callAgain.svg" alt />复呼
          </div>
          <div
            class="buttonStyle nextPat"
            @click="throttleFn('callNextPat')"
            :class="{'has-patients':count}"
          >
            <img src="../../assets/imges/nextPat.svg" alt />下一位
          </div>
        </template>
      </div>
    </div>
    <div class="homeHeadRight">
      <el-select
        v-model="selectDep"
        multiple
        collapse-tags
        placeholder="请选择"
        v-show="selectArea.DiagnosisAreaType===3"
        @change="changeSelectDep"
      >
        <el-option label="全部" value="0"></el-option>
        <el-option
          v-for="(item,index) in user.Departments"
          :key="index"
          :label="item.Name"
          :value="parseInt(item.Code)"
        ></el-option>
      </el-select>
      <el-radio-group v-model="selectAreaType">
        <el-radio-button
          :label="item.DiagnosisAreaType"
          v-for="(item,index) in user.DiagnosisAreas"
          :key="index"
        >{{item.DiagnosisAreaName}}</el-radio-button>
      </el-radio-group>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import CallNumber from "@/utils/callNumber.js";
import { setSession, removeSession } from "../../utils/storage";
import { throttle } from "@/utils/public.js";
export default {
  props: {
    getPatientList: Function,
    showLoading: Boolean
  },
  data() {
    return {
      count: 0, //待接诊患者数
      selectAreaType: "",
      isStartReceive: false,
      // selectDep: ["0"],
      // justMe: false,
      pauseDoctor: false,
      callNumberOperation: {},
      callNumberList: [], //叫号患者列表
      headSelectArea: "" //当前选择的诊疗区 为了规避错误
    };
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  created() {
    this.throttleFn = throttle(this.callNumberFn, 3000);
    console.log(this.selectArea.DiagnosisAreaType);
    if (!this.user.DiagnosisAreas || !this.user.DiagnosisAreas.length) {
      this.$emit("update:showLoading", false);
      return this.$msg.info("该账号无诊疗区域权限，请联系管理员！", 5000);
    }
    if (this.selectArea.DiagnosisAreaType == undefined) {
      let diagnosisList = this.user.DiagnosisAreas;
      if (diagnosisList.length > 0) {
        this.selectAreaType = diagnosisList[0].DiagnosisAreaType;
      }
    } else {
      this.selectAreaType = this.selectArea.DiagnosisAreaType;
    }
    this.callNumberOperation = new CallNumber(this, this.callNumberName);
    // this.callNumberOperation.ChangeBrzt()
    //this.callNumberOperation = new CallNumber(this, "yan_tian");
    if (this.doctorSelectDep) {
      this.isStartReceive = true;
    }
    // 获取待接诊列表
    console.log(this.callNumberOperation, "急诊诊疗头部");
    this.getCallNumberPatientList();
  },
  methods: {
    changeSelectDep(value) {
      console.log(value, "科室筛选");
      if (value.length >= 2 && value.indexOf("0") != -1) {
        if (value[0] == "0") {
          // 全部在第一位  选中其他科室，全部应取消
          value.shift();
          this.selectDep = value;
        } else {
          this.selectDep = ["0"];
        }
      }
      let arr = this.selectDep.length ? this.selectDep : ["0"];
      this.getPatSummaryByDiagnosisArea(arr);
      this.getPatientList(1);
    },
    callNumberFn(fn) {
      if (fn == "callNextPat") {
        this.callNextPat();
      } else if (fn == "reCallPat") {
        this.reCallPat();
      }
    },
    getCallNumberPatientList(type = "ClinicTotal") {
      type === "ClinicTotal" &&
        this.$store.commit("home/SET_CALLNUMBERLIST", []);
      let depObj = [];
      this.user.Departments.forEach(item => {
        depObj.push(item.Code);
      });
      let obj = {
        QueryType: type,
        DiagnosisAreaType: 3,
        JustMe: false,
        PageIndex: 1,
        PageSize: 9999,
        UserId: this.user.UserInfo.Id,
        Deps: type === "ClinicTotal" ? depObj : [this.doctorSelectDep]
      };
      let result = {};
      let t=new Date().getTime()
      this.$Api.getClinicPatient(obj).then(result => {
        let patientList = result.Data || [];
        if (type === "ClinicNotReception") {
          patientList = patientList.filter(el =>el.RegisterTime&&t-new Date(el.RegisterTime)< 10800000);
          this.count = patientList.length;
        }
        if (result.Status && type === "ClinicTotal") {
          this.callNumberList = [];

          let len = patientList.length;
          for (let i = 0; i < len; i++) {
            if (patientList[i].ActiveRegistId) {
              this.callNumberList.push(patientList[i]);
            }
          }
          this.$store.commit("home/SET_CALLNUMBERLIST", this.callNumberList);
        }
      });
    },
    callNextPat() {
      if (this.isPauseDoctor) {
        console.log(this.callNumberOperation, "下一个");

        let depObj = [];
        this.user.Departments.forEach(item => {
          depObj.push(item.Code);
        });
        let paramsData = {
          QueryType: "ClinicTotal",
          DiagnosisAreaType: 3,
          JustMe: false,
          PageIndex: 1,
          PageSize: 9999,
          UserId: this.user.UserInfo.Id,
          Deps: depObj
        };
        this.callNumberOperation.CallNextPat(this.callNumberList, paramsData);
      } else {
        this.$msg.warning("已暂停接诊");
      }

      // 取患者信息  跳转到患者主页
    },
    reCallPat() {
      console.log(this.isPauseDoctor, this.callNumberOperation, "复呼");
      if (this.isPauseDoctor) {
        this.callNumberOperation.ReCall();
      } else {
        this.$msg.warning("已暂停接诊");
      }
    },
    // 开始接诊
    startOrStopReceive() {
      console.log(
        this.callNumberOperation,
        "开始接诊",
        this.doctorSelectDep,
        this.user.Departments
      );
      if (this.isQueueNumber === "0") return;
      if (!this.doctorSelectDep) {
        // 查看权限科室
        if (this.user.Departments.length != 0) {
          // 弹窗
          let obj = {
            title: "选择科室",
            width: "400px",
            component: "doctorSelectDep",
            visible: true,
            selectDep: this.user.Departments && this.user.Departments[0].Code
            // data: {
            //   selectDep: this.user.Departments&&this.user.Departments[0].Code
            // }
          };
          console.log(obj);
          this.$store.commit("public/SET_DIALOGDATA", obj);
        }
      } else {
        this.$store.commit("home/SET_DOCTORSELECTDEP", "");
        removeSession("doctorSelectDep");
        this.isStartReceive = !this.isStartReceive;
        // 退出登录
        if (this.callNumberOperation.type == "") {
          this.callNumberOperation = new CallNumber(this, this.callNumberName);
        }
        this.callNumberOperation.Logout();
      }
    },
    // 继续还是暂停接诊
    setDoctorStatus() {
      this.pauseDoctor = !this.pauseDoctor;

      let params = {
        isZjzt: this.pauseDoctor ? 0 : 1
      };
      this.callNumberOperation.ChangeZjzt(params);
    },
    // 获取诊疗区域概览信息
    async getPatSummaryByDiagnosisArea(value, isFirst) {
      this.headSelectArea = this.selectAreaType;
      console.log(value);
      let card =
        this.selectArea.DiagnosisAreaType !== 3
          ? {
              Code: "Total",
              Count: 10,
              Ifcover: true,
              Name: "总患者"
            }
          : {
              Code: "ClinicNotReception",
              Count: 0,
              Ifcover: true,
              Name: "待接诊患者"
            };

      if (value != undefined && value.length > 1 && value.indexOf("0") == 0) {
        this.selectDep = ["0"];
        return;
      }
      this.$store.commit("home/SET_SEARCHSELECTDEP", value);
      if (!this.user.DiagnosisAreas || !this.user.DiagnosisAreas.length) return;

      isFirst && this.$store.commit("home/SET_CARDS", []);
      let depObj = {};
      // if (typeof value != Boolean) {
      //   if (value == undefined) {
      //     this.selectDep = ["0"];
      //   }
      // }
      let selectDep = this.selectDep.length ? this.selectDep : ["0"];
      if (value && value.length == 0) {
        this.user.Departments.forEach(item => {
          depObj[item.Code] = item.Name;
        });
      }
      if (selectDep.indexOf("0") != -1) {
        // 包含全部
        // this.selectDep = ["0"];
        this.user.Departments.forEach(item => {
          depObj[item.Code] = item.Name;
        });
      } else {
        this.user.Departments.forEach(item => {
          if (selectDep.indexOf(parseInt(item.Code)) != -1) {
            depObj[item.Code] = item.Name;
          }
        });
      }
      let obj = {
        DiagnosisAreaType: this.selectAreaType,
        JustMe: this.justMe,
        Deps: depObj
      };
      this.$emit("update:showLoading", true);
      isFirst && this.getPatientList(1, null, card);
      //this.$store.dispatch('home/getPatSummary',{that:this,params:obj})
      let res = await this.$Api.getPatientSummary(obj);
      let arr = Object.keys(obj.Deps);
      let isCurrent = true;
console.log(this.selectDep,'this.selectDep');
      if (this.selectDep.indexOf("0") != -1 || !this.selectDep.length) {
        if (arr.length != this.user.Departments.length) {
          isCurrent = false;
        }
      } else {
        let nowArr = this.selectDep.length ? this.selectDep : ["0"];
        isCurrent =
          arr.sort((a, b) => a - b).join() ===
          nowArr.sort((a, b) => a - b).join();
      }
      this.$emit("update:showLoading", false);
      if (this.headSelectArea === obj.DiagnosisAreaType && isCurrent) {
        let data = res.Data || [];
        console.log(data, "data");
        this.$store.commit("home/SET_CARDS", data);
        if (data.length && isFirst) {
          // this.getPatientList(1,null,data[0])
        }
      }
    }
  },
  watch: {
    selectAreaType: {
      handler: function(newValue,oldValue) {
        // if(!this.user.DiagnosisAreas||!this.user.DiagnosisAreas.length)return this.$msg.info('该账号无诊疗区域权限，请联系管理员！')
        let item = this.user.DiagnosisAreas.find(item => {
          if (item.DiagnosisAreaType === newValue) {
            return item;
          }
        });
        if (item.DiagnosisAreaType !== 3) {
        //  this.cardContent.Code==='Total'
          this.isStartReceive = false;
          clearInterval(this.timer);
        } else {
          clearInterval(this.timer);
          if (this.isQueueNumber == "1") {
            this.timer = setInterval(() => {
              //  this.doctorSelectDep
              this.doctorSelectDep &&
                this.getCallNumberPatientList("ClinicNotReception");
            }, 30000);
            this.getCallNumberPatientList();
            this.callNumberOperation = new CallNumber(
              this,
              this.callNumberName
            );
          }
        }
        this.$store.commit("home/SET_SELECTAREA", item);
       oldValue!=='' && this.$store.commit("home/SET_CARDCONTENT", {})
         console.log('1111111');
        this.getPatSummaryByDiagnosisArea(undefined, true);
      }
    },
    justMe: {
      handler: function() {
        this.getPatientList();
      }
    },
    doctorSelectDep: {
      handler: function(val) {
        if (val != "") {
          console.log(this.isStartReceive, "开始接诊");
          if (this.isStartReceive == false) {
            this.isStartReceive = true;

            console.log(this.callNumberList, "筛选挂号患者列表");
            console.log(
              this.callNumberOperation,
              this.callNumberName,
              "开始接诊跳转下一个"
            );
            if (!this.callNumberOperation.type) {
              this.callNumberOperation = new CallNumber(
                this,
                this.callNumberName
              );
            }
            // this.callNumberOperation.CallNextPat(this.callNumberList, 0);
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      selectArea: "home/GET_SELECTAREA",
      user: "public/GET_USER",
      isQueueNumber: "configuration/GET_ISQUEUENUMBER", //是否启用排队叫号系统
      doctorSelectDep: "home/GET_DOCTORSELECTDEP",
      callNumberName: "configuration/GET_CALLNUMBER", //叫号操作系统
      isPauseDoctor: "home/GET_ISPAUSEDOCTOR", //是否暂停接诊
      clinicPatRouter: "configuration/GET_CLINICPATDATAROUTER",
      cardContent:"home/GET_CARDCONTENT"
    }),
    justMe: {
      get: function() {
        return this.$store.getters["home/GET_JUSTME"];
      },
      // setter
      set: function(newValue) {
        this.$store.commit("home/SET_JUSTME", newValue);
      }
    },
    selectDep: {
      get: function() {
        return this.$store.getters["home/GET_SELECTDEP"];
      },
      // setter
      set: function(newValue) {
        this.$store.commit("home/SET_SELECTDEP", newValue);
      }
    },
  }
};
</script>
<style lang="less" scoped>
.homeHead {
  padding: 10px 25px;
  height: 50px;
  border-top: 10px solid #dfe7f5;
  line-height: 50px;
  .homeHeadLeft {
    float: left;
    display: flex;
    font-size: 14px;
    /deep/.el-checkbox.is-bordered.el-checkbox--small {
      width: 90px;
    }
    .el-checkbox.is-bordered.is-checked {
      border-color: @blueMain;
    }
    /deep/.el-checkbox__input.is-checked + .el-checkbox__label {
      color: @blueMain;
    }
    /deep/.el-checkbox.is-bordered.el-checkbox--small .el-checkbox__label {
      font-size: 14px;
    }
    .startReceive,
    .nextPat {
      background-color: @blueMain;
      color: #fff;
    }

    img {
      margin-bottom: 2px;
      margin-right: 5px;
    }
    > div:nth-child(1) {
      img {
        width: 18px;
        height: 18px;
        margin-right: 12px;
      }
    }
    > div {
      display: inline-block;
      padding: 0px 10px;
    }
    > div:nth-child(3) {
      div {
        margin-top: 9px;
      }
    }
    > div:nth-child(4) {
      display: flex;
      > div {
        display: inline-block;
        margin-right: 20px;
        margin-top: 9px;
      }
    }
  }
  .homeHeadRight {
    float: right;
    /deep/.el-radio-button__orig-radio:checked + .el-radio-button__inner {
      background-color: @blueMain;
      border-color: @blueMain;
    }
    .el-radio-group {
      margin-left: 15px;
    }
  }
}
</style>