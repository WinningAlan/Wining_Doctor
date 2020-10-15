<template>
  <div class="patient-header clearfix" :class="{more:selectArea.DiagnosisAreaType!==3}">
    <!-- <div class="left-logo"> -->
    <router-link :to="{name:$route.query.from}" class="go-home">
      <svg-icon iconClass="fewer" class="img"></svg-icon>
    </router-link>
    <!-- <svg-icon :iconClass="collapse?'expanded':'fewer'" class="icon" @click="checked('nav')"></svg-icon> -->
    <!-- </div> -->
    <div class="right-msg">
      <img
        class="right-msg-left"
        src="../../assets/imges/boyBig.png"
        v-if="patientMsg.PatGenderCode==1"
        alt
      />
      <img
        class="right-msg-left"
        src="../../assets/imges/girlBig.png"
        alt
        v-else-if="patientMsg.PatGenderCode==2"
      />
      <img class="right-msg-left" src="../../assets/imges/sexUnknow.svg" alt v-else />
      <div class="right-msg-center">
        <p class="top">
          <!-- <span class="liuName"></span> -->
          <span
            :class="{'qiangName':patientMsg.AreaType==1,
          'liuName':patientMsg.AreaType==2,
          'menName':patientMsg.AreaType==3}"
            class="quyu"
          >{{patientMsg.AreaType===1?'抢救区':patientMsg.AreaType===2?'留观区':'急门诊'}}</span>
          <!-- <span class="quyu item">{{selectArea.DiagnosisAreaName}}</span> -->
          <template v-if="patientMsg.AreaType!==3">
            <!-- <span>床号：</span> -->
            <span class="item">{{patientMsg.BedNo}}</span>
          </template>
          <span
            class="item bold patName"
            style="color: #0071e7;"
            @click="getPatDetail"
          >{{patientMsg.PatientName}}</span>
          <span class="item">{{patientMsg.AgeYear | ageFilter(patientMsg.AgeMonth)}}</span>
          <span
            style="display:inline-block;cursor:pointer;margin-right:10px;"
            @click.stop="setAttentionTag(patientMsg)"
          >
            <el-tooltip v-if="!patientMsg.AttentionTag" content="重点关注" placement="top">
              <img src="../../assets/imges/focus.png" alt />
            </el-tooltip>
            <el-tooltip v-else content="取消重点关注" placement="top">
              <img src="../../assets/imges/focusSelect.png" alt />
            </el-tooltip>
          </span>
          <!-- <svg-icon v-if="patientMsg.AttentionTag" iconClass="attention" class="attention"></svg-icon> -->
          <el-tooltip
            :content="greenChanneType[patientMsg.GreenChannelText]"
            placement="top"
            v-if="patientMsg.GreenChannelText"
          >
            <span class="icon" :class="greenChannelData[greenChanneType[patientMsg.GreenChannelText]]"></span>
          </el-tooltip>
          <el-tooltip content="欠费模式" placement="top" v-if="patientMsg.IsOpenGreenChannel">
            <span class="icon lv"></span>
          </el-tooltip>
          <el-tooltip content="过敏" placement="top" v-if="patientMsg.IsAllergy">
            <span class="icon min"></span>
          </el-tooltip>
          <el-tooltip content="群伤" placement="top" v-if="patientMsg.IsGroupInjury">
            <span class="icon qun"></span>
          </el-tooltip>
          <el-tooltip content="告病危" placement="top">
            <span :class="{'wei':patientMsg.IsPeril}" class="icon"></span>
          </el-tooltip>
          <el-tooltip content="告病重" placement="top">
            <span :class="{'zhong':patientMsg.IsHeavy}" class="icon"></span>
          </el-tooltip>
          <el-tooltip content="手术" placement="top">
            <span :class="{'shu':patientMsg.IsOperation}" class="icon"></span>
          </el-tooltip>
          <el-tooltip content="慢性病" placement="top">
            <span :class="{'man':patientMsg.PatientFlag}" class="icon"></span>
          </el-tooltip>
          <!-- 不良事件 -->
          <el-tooltip content="不良事件上报" placement="top" v-if="patientMsg.IsAdverseEventReport">
            <svg-icon iconClass="aes" class="svgImg"></svg-icon>
          </el-tooltip>
          <el-tooltip content="单病种上报" placement="top" v-if="patientMsg.IsDrgsReport">
            <svg-icon iconClass="drgs" class="svgImg"></svg-icon>
          </el-tooltip>
          <el-tooltip content="院感上报" placement="top" v-if="patientMsg.IsNosocomialInfectionReport">
            <svg-icon iconClass="senceHospital" class="svgImg"></svg-icon>
          </el-tooltip>
          <span class="regeistNum">挂号：</span>
          <el-select v-model="patientMsg.RegistId" size="mini" :disabled="patientMsg.Status ==8" @change="changeRegistId">
            <el-option
              v-for="item in registerList"
              :key="item.HisRegistId"
              :label="item.RegDepartmentName+'('+item.FeeType+')'"
              :value="item.HisRegistId"
            ></el-option>
          </el-select>
          <span>
            <el-tooltip v-if="isRegister==='1'" effect="light" content="挂号" placement="top-start">
              <svg-icon
                iconClass="regeist"
                class="editImg"
                @click="registration"
                v-if="patientMsg.Status !=8"
              ></svg-icon>
            </el-tooltip>
          </span>
        </p>
        <p class="buttom">
          <template v-if="docMedicalCar == 2">
            <span>病历号：</span>
            <span class="item">{{patientMsg.RecordNumber}}</span>
          </template>
          <template v-if="docMedicalCar == 0">
            <span>患者ID：</span>
            <span class="item">{{patientMsg.HISPatientId}}</span>
          </template>
          <template v-if="docMedicalCar == 1">
            <span>卡号:</span>
            <span class="item">{{patientMsg.CardNumber}}</span>
          </template>
          <span>患者分级：</span>
          <el-select
            :disabled="patientMsg.Status == 8"
            v-model="patientMsg.TriageLevel"
            size="mini"
            class="item"
            @change="changeLevel"
            :class="`level${patientMsg.TriageLevel}`"
          >
            <el-option
              v-for="item in levelData"
              :key="item.Value"
              :label="item.Text"
              v-if="item.Value>-1"
              :value="item.Value"
            ></el-option>
          </el-select>
          <!-- <span>区域：</span>
          <span class="item">{{patientMsg.CurrentAreaName}}</span>-->

          <span>诊断：</span>
          <el-tooltip
            v-show="patientMsg.Diagnosis"
            effect="light"
            :content="patientMsg.Diagnosis"
            placement="top-start"
          >
            <!-- <span
              class="item hint"
            >发烧头疼感冒,发烧的的发烧的的发烧的的发烧的的发烧头疼感冒发烧的的发烧的的发烧的的发烧的的发烧头疼感冒,发烧的的发烧的的发烧的的发烧的的</span>-->
            <span class="item hint">{{patientMsg.Diagnosis}}</span>
          </el-tooltip>
          <span v-if="patientMsg.Status !=8">
            <svg-icon iconClass="edit" class="disditImg" v-if="$route.name==='diagnose'"></svg-icon>
            <svg-icon iconClass="edit" class="editImg" @click="diagnoseShow" v-else></svg-icon>
          </span>
          <span class="remark">备注：</span>
          <el-tooltip
            v-show="patientMsg.Remark"
            effect="light"
            :content="patientMsg.Remark"
            placement="top-start"
            v-if="isEditRemark==false"
          >
            <!-- <span
              class="item hint"
            >发烧头疼感冒,发烧的的发烧的的发烧的的发烧的的发烧头疼感冒发烧的的发烧的的发烧的的发烧的的发烧头疼感冒,发烧的的发烧的的发烧的的发烧的的</span>-->
            <span class="item hint">{{patientMsg.Remark}}</span>
          </el-tooltip>
          <span v-else class="remarkInput">
            <el-input
              v-model="patientMsg.Remark"
              placeholder="请填写备注"
              @change="editRemarkContent"
              @blur="blueInput"
            ></el-input>
          </span>
          <span>
            <svg-icon
              iconClass="edit"
              class="editImg"
              @click="editRemark"
              v-if="patientMsg.Status !=8"
            ></svg-icon>
          </span>
        </p>
      </div>
      <div class="right-msg-right">
        <div class="button" v-show="patientMsg.Status==8" @click="callbackPat">召回</div>
        <template v-if="patientMsg.Status!=8">
          <div class="button" @click="turnTo">
            <img src="../../assets/imges/lapseTo.png" alt />转归
          </div>
        </template>

        <template v-if="isQueueNumber==='1'&&patientMsg.AreaType==3&&doctorSelectDep!=''">
          <div
            class="button"
            @click="throttleFn('reCallPat')"
            v-if="!patientMsg.IsRecall&&patientMsg.Status!==8"
          >
            <img src="../../assets/imges/callAgain.svg" alt />复呼
          </div>
          <div class="button last" @click="throttleFn('callNextPat')" :class="{'has-patients':count}">
            <img src="../../assets/imges/nextPat.svg" alt />下一位
          </div>
        </template>
        <p class="item" @click="checked('list')">
          <svg-icon iconClass="patients" class="icon"></svg-icon>
          <span>患者列表</span>
        </p>
      </div>
    </div>
    <!--弹窗-->
    <my-alter
      :title="dialogData.title||''"
      :visible="dialogData.visible||false"
      :isfooter="dialogData.isShowFooter"
      :width="dialogData.width"
      :btn="dialogData.btn||[]"
      :callback="closeDialog"
    >
      <component
        v-loading="loading"
        element-loading-text="挂号中..."
        element-loading-spinner="el-icon-loading"
        @readChang="readChang"
        :is="dialogData.component||''"
        ref="content"
        :class="{'diagbose-alter':dialogData.component=='diagnoseView'}"
        :initialize="dialogData.visible"
      ></component>
    </my-alter>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import myAlter from "@/components/common/myAlter";
import turnTo from "@/components/common/turnTo";
import patBasicMsg from "@/components/doctorAdvice/patients/patBasicMsg";
import inHosRequestNotes from "@/components/common/inHosRequestNotes";
import transferHosRequestNotes from "@/components/common/transferHosRequestNotes";
import { greenChannelData } from "@/module/staticData.js";
import diagnoseView from "../../views/DoctorAdvice/diagnose";
import registrationAlter from "../doctorAdvice/patients/registrationAlter.vue";
import callbackPat from "@/components/common/callbackPat";
import CallNumber from "@/utils/callNumber.js";
import { throttle } from "@/utils/public.js";
import CASign from "@/utils/caSign.js";

export default {
  name: "patientHeader",
  components: {
    myAlter,
    turnTo,
    inHosRequestNotes,
    transferHosRequestNotes,
    patBasicMsg,
    diagnoseView,
    registrationAlter,
    callbackPat
  },
  data() {
    return {
      greenChannelData: greenChannelData,
      loading: false, //loading
      isEditRemark: false, //是否编辑备注
      timer: "",
      loginIp: "",
      callNumberOperation: {}, //叫号操作
      throttleFn: {}, //节流函数
      currentObjData: {} ,//
      count:0,//待接诊患者列表
      // level: 1,
    };
  },
  created() {
    if(this.isQueueNumber==='1'&&this.doctorSelectDep){
      this.queueNumbertimer=setInterval(()=>{
        this.getClinicNotReception()
      },30000)
    }
    this.callNumberOperation = new CallNumber(this, this.callNumberName);
    this.throttleFn = throttle(this.callNumberFn, 3000);
    if (this.isSignName == "1") {
      this.caSignOperation = new CASign(this, this.signName);
    }
  },
  beforeDestroy() {
    clearInterval(this.queueNumbertimer)
  },
  destroyed() {
    this.$store.commit("public/SET_DIALOGDATA", {
      title: "诊断",
      width: "100vw",
      component: "diagnoseView",
      visible: false,
      isShowFooter: false,
      data: {}
    });
  },
  watch: {
    "$route.query.id": {
      handler: function(id) {
        this.setPatMsg(id, true);
        // this.$store.actions['public/getPatientMsg']
        console.log(this.selectArea, 1);
      },
      immediate: true
    },
    isGetCA: function(val) {
      if (val) {
        // 验证
        if(this.currentObjData.Data&&this.currentObjData.Data[0].Name=='转归生成医嘱') {
          this.caSignOperation.checkData(this.user.UserInfo, this.currentObjData);
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      collapse: "public/GET_COLLAPSE",
      isShowList: "public/GET_ISSHOWLIST",
      patientMsg: "public/GET_PATIENTMSG",
      user: "public/GET_USER",
      selectArea: "home/GET_SELECTAREA", //所在区域
      dialogData: "public/GET_DIALOGDATA", //弹窗数据
      isRegister: "configuration/GET_ISREGISTER", //是否可挂号
      isQueueNumber: "configuration/GET_ISQUEUENUMBER", //是否启用排队叫号系统
      docMedicalCar: "configuration/GET_DOCMEDICALCAR",
      doctorSelectDep: "home/GET_DOCTORSELECTDEP", //医生开始接诊选择科室
      isTray: "configuration/GET_ISTRAY",
      callNumberName: "configuration/GET_CALLNUMBER", //叫号操作系统
      isPauseDoctor: "home/GET_ISPAUSEDOCTOR", //是否暂停接诊
      callNumberList: "home/GET_CALLNUMBERLIST", //叫号列表
      signName: "public/GET_SIGNNAME", //签名系统简称
      isSignName: "public/GET_ISSIGNNAME", //是否启用
      isGetCA: "public/GET_ISGETCA" ,//
       greenChanneType: "public/GET_GREENCHANNETYPE"
    }),
    levelData() {
      return this.$store.getters["public/getDic"]("TriageLevel");
    },
    // 挂号列表
    registerList() {
      let data = [];
      let list = this.patientMsg.RegisterInfoList || [];
      console.log(list, "list", this.user.Departments);
      if (this.selectArea.DiagnosisAreaType === 3) {
        list.forEach(el => {
          let off = false;
          this.user.Departments.forEach(item => {
            if (el.RegDepartmentCode === item.Code) {
              off = true;
            }
          });
          off && data.push(el);
        });
      } else {
        data = list;
      }
      let obj=null;
      data.forEach(el=>{
        if(el.HisRegistId===this.activeRegistId){
          obj=el
        }
      })
      obj=obj||data[0]
      // if (!this.patientMsg.RegistId) {
        this.patientMsg.RegistId = obj? obj.HisRegistId : "";
        this.patientMsg.SocialSecurityCode = obj? obj.SocialSecurityCode : "";
        this.$store.commit("public/SET_PATIENTMSG", { ...this.patientMsg });
      // }
      return data;
    },
        activeRegistId: {
      get: function() {
        return this.$store.getters["public/GET_ACTIVEREGISTID"];
      },
      // setter
      set: function(newValue) {
        this.$store.commit("public/SET_ACTIVEREGISTID", newValue);
      }
    },
  },

  methods: {
    // 获取叫号待接诊患者数量
    getClinicNotReception(){
      if(this.patientMsg.AreaType!==3)return
      let obj = {
        QueryType: 'ClinicNotReception',
        DiagnosisAreaType: 3,
        JustMe: false,
        PageIndex: 1,
        PageSize: 9999,
        UserId: this.user.UserInfo.Id,
        Deps: [this.doctorSelectDep]
      };
       let t=new Date().getTime()
      this.$Api.getClinicPatient(obj).then(result => {
        let patientList=result.Data||[]
           patientList=patientList.filter(el=>el.RegisterTime&&t-new Date(el.RegisterTime)< 10800000)
          this.count=patientList.length
      });
    },
    callNumberFn(fn) {
      if (fn == "callNextPat") {
        this.callNextPat();
      } else if (fn == "reCallPat") {
        this.reCallPat();
      }
    },
    callNextPat() {
      if (this.isPauseDoctor) {
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
        this.callNumberOperation.CallNextPat(this.callNumberList,paramsData);
      } else {
        this.$msg.warning("已暂停接诊");
      }
    },
    reCallPat() {
      if (this.isPauseDoctor) {
        this.callNumberOperation.ReCall();
      } else {
        this.$msg.warning("已暂停接诊");
      }
    },
    // 召回
    callbackPat() {
      let obj = {
        title: "患者召回",
        width: "480px",
        component: "callbackPat",
        isShowFooter: true,
        btn: ["确认", "取消"],
        visible: true,
        data: this.patientMsg
      };
      this.$store.commit("public/SET_DIALOGDATA", obj);
    },
    // 挂号
    registration() {
      let obj = {
        title: "患者挂号",
        width: "800px",
        component: "registrationAlter",
        isShowFooter: true,
        btn: ["挂号", "取消"],
        visible: true
      };
      this.$store.commit("public/SET_DIALOGDATA", obj);
    },
    blueInput() {
      this.isEditRemark = false;
    },
    // 编辑备注
    editRemarkContent() {
      console.log("编辑备注");
      this.isEditRemark = false;
      console.log(this.patientMsg, "this.patientMsg");
      let params = {
        inhouseId: this.patientMsg.InHouseId,
        remark: this.patientMsg.Remark
      };
      this.$Api.updatePatRemark(params).then(res => {
        this.$msg[res.Status ? "success" : "warning"](res.Message);
        return;
      });
    },
    editRemark() {
      this.isEditRemark = !this.isEditRemark;
    },
    // 设置是否重点关注
    setAttentionTag(obj) {
      if (this.patientMsg.Status != 8) {
        let params = {
          InHospitalId: obj.InHouseId,
          isAttention: obj.AttentionTag == 0 ? 1 : 0
        };
        this.$Api.setAttentionTag(params).then(res => {
          this.$msg[res.Status ? "success" : "warning"](res.Message);
          // 刷新界面
          this.setPatMsg(obj.InHouseId);
        });
      }
    },
    // 查看患者基本信息
    getPatDetail() {
      let obj = {
        title: "患者信息管理",
        width: "100vw",
        component: "patBasicMsg",
        isShowFooter: false,
        visible: true,
        data: this.patientMsg
      };
      this.$store.commit("public/SET_DIALOGDATA", obj);
      // this.$router.push({name:"home",query:{id:this.patientMsg.InHouseId,from:this.$route.name}})
    },
    // 重新设置患者信息
    setPatMsg(id, isAlter) {
      console.log("object");
      this.$store
        .dispatch("public/getPatientMsg", {
          that: this,
          data: { inHouseId: id }
        })
        .then(status => {
          console.log(status, isAlter, this.patientMsg.RegistId);
          setTimeout(() => {
            if (
            isAlter &&
            status &&
            !this.patientMsg.RegistId &&
            this.patientMsg.Status !== 8
          ) {
            if (this.isRegister === "1") {
              this.registration();
            } else {
              this.$msg.info("该患者未挂号，请先挂号！");
            }
          }
          }, 100);

        });
    },
    // 转归
    turnTo() {
      // this.patientMsg.Id = this.patientMsg.InHouseId;
      let data = { ...this.patientMsg, Id: this.patientMsg.InHouseId };
      let obj = {
        title: "转归",
        width: "650px",
        component: "turnTo",
        visible: true,
        isShowFooter: true,
        data
      };
      this.$store.commit("public/SET_DIALOGDATA", obj);
    },
    async closeDialog(value) {
      if (value) {
        // 确定关闭弹窗
        console.log(this.isTray, "this.isTray");
        if (
          this.dialogData.component === "registrationAlter" &&
          this.isTray == 1
        ) {
          this.loading = this.dialogData.component === "registrationAlter";
          this.$refs.content.readTray();
          this.$store.commit("public/SET_UPDATEPATIENTLIST", Math.random());
        } else if (
          (this.dialogData.component === "turnTo"||this.dialogData.component === "transferHosRequestNotes"||this.dialogData.component === "inHosRequestNotes") &&
          this.isSignName == "1"
        ) {
          // 转归ca
          console.log("ca签名");
          let obj = {
            Type: "0",
            Data: [{ Name: "转归生成医嘱" }],
            No: this.user.UserInfo.No,
            UserName: this.user.UserInfo.Name
          };
          this.currentObjData = obj;
          this.caSignOperation.KeyVerify();
        } else {
          this.handleOperation()
        }
      } else {
        if (this.dialogData.component === "registrationAlter") {
          clearInterval(this.$refs.content.readTimer);
        }

        this.$store.commit("public/SET_DIALOGDATA", {
          ...this.dialogData,
          visible: false
        });
        // this.$store.commit("public/SET_MEDICALADDEVENT", true);
        // this.$store.commit("public/SET_DIALOGDATA", {});
        this.loading = false;
      }
    },
    async handleOperation() {
      this.loading = this.dialogData.component === "registrationAlter";
          let res = await this.$refs.content.save();
          console.log(res, "ressss");
          this.loading = false;
          if (res) {
            let pId = this.patientMsg.InHouseId;
            this.dialogData.component !== "registrationAlter" &&
              this.setPatMsg(pId);
            this.$store.commit("public/SET_DIALOGDATA", {
              ...this.dialogData,
              visible: false
            });
            this.$store.commit("public/SET_UPDATEPATIENTLIST", Math.random());
          }
    },
    readChang() {
      this.loading = false;
      this.$store.commit("public/SET_DIALOGDATA", {
        ...this.dialogData,
        visible: false
      });
    },
    // 展开收起导航
    checked(type) {
      if (type == "nav") {
        this.$store.commit("public/SET_COLLAPSE", !this.collapse);
      } else {
        this.$store.commit("public/SET_ISSHOWLIST", !this.isShowList);
      }
    },
    // 修改分级
    changeLevel(el) {
      this.$Api
        .changeLevel({
          inhouseId: this.patientMsg.InHouseId,
          triageLevel: el
        })
        .then(res => {
          this.$msg[res.Status ? "success" : "warning"](res.Message);
          if (res.Status) {
            // 更新患者列表
            this.$store.commit("public/SET_UPDATEPATIENTLIST", Math.random());
          }
        });
      // this.level = el;
    },
    diagnoseShow(val) {
      if (this.$route.name == "diagnose") {
        return;
      }
      this.$store.commit("public/SET_DIALOGDATA", {
        title: "诊断",
        width: "100vw",
        component: "diagnoseView",
        visible: true,
        isShowFooter: false,
        data: {}
      });
    },
    // 更改挂号
    changeRegistId(val){
      let code=this.registerList.find(el=>val===el.HisRegistId)||{};
        this.patientMsg.RegistId = val;
        this.activeRegistId=val
        this.patientMsg.SocialSecurityCode = code.SocialSecurityCode||'';
        this.$store.commit("public/SET_PATIENTMSG", { ...this.patientMsg });
    }
  }
};
</script>
<style  lang='less'>
.patient-header {
  height: 60px;

  width: 100%;
  .iframe {
    display: none;
  }
  .go-home {
    float: left;
    padding: 19px 20px;
    cursor: pointer;
    height: 22px;
    .img {
      color: #979797;
      height: 22px;
      width: 22px;
      display: block;
    }
    &:hover {
      .img {
        color: #0071e7;
      }
    }
  }

  .right-msg {
    overflow: hidden;
    font-size: 14px;

    box-sizing: border-box;
    padding: 0 10px 9px 20px;
    &-left {
      width: 42px;
      height: 42px;
      float: left;
      padding-top: 9px;
      margin-right: 20px;
    }
    &-center {
      float: left;
      overflow: hidden;
      padding-top: 2px;
      line-height: 28px;
      .editImg {
        width: 18px;
        height: 18px;
        margin-right: 10px;
        color: #0071e7;
        cursor: pointer;
        margin-bottom: -2px;
      }
      .disditImg {
        width: 18px;
        height: 18px;
        margin-right: 10px;
        margin-bottom: -2px;
        color: #ccc;
        cursor: not-allowed;
      }
      .top {
        font-size: 13px;
        height: 28px;
        text-align: left;
        color: rgba(0, 6, 16, 0.6);
        .patName {
          cursor: pointer;
          border-bottom: 1px solid #0071e7;
          font-size: 14px;
        }
        .regeistNum {
          margin-left: 10px;
        }
        .icon {
          color: #f58b8b;
          line-height: 20px;
        }
        .svgImg {
          width: 20px;
          height: 20px;
          margin-right: 10px;
          margin-bottom: -2px;
        }
        .attention {
          color: #f58b8b;
          width: 20px;
          height: 20px;
          margin-right: 10px;
          vertical-align: -0.35em;
        }
        .item {
          margin-right: 20px;
          color: #000622;
          line-height: 35px;
        }
        .quyu {
          color: #fff;
          //color: #0f49ed;
          line-height: 35px;
          margin-right: 10px;
          //background: #ebf0ff;
          //border: 1px solid #b5c9ff;
          border-radius: 2.4px;
          padding: 0 5px;
        }
        .qiangName {
          background: #f52c2c;
        }
        .liuName {
          background: #e4860a;
        }
        .menName {
          background: #5db730;
        }
        /deep/ .el-select {
          .el-input__inner {
            color: #0071e7;
            width: 215px;
            margin-right: 10px;
            margin-top: -5px;
          }
          .el-input__suffix {
            right: 15px;
          }
        }
      }
      .buttom {
        font-size: 13px;
        height: 28px;
        color: rgba(0, 6, 16, 0.6);
        > span {
          float: left;
          line-height: 32px;
        }
        .remark {
          margin-left: 10px;
        }
        .item {
          margin-right: 20px;
          color: #000622;
          &:last-child {
            margin-right: 0;
          }
        }

        .diagnose {
          cursor: pointer;
          color: #0f49ed;
        }
        .remarkInput {
          /deep/ .el-input {
            width: 200px;
            height: 24px;
            margin-right: 10px;
          }
          /deep/.el-input--small .el-input__inner {
            border: none;
            background: @controlBg;
            height: 23px;
          }
        }

        /deep/ .el-select {
          float: left;
          // .el-input__suffix{
          //   height: 24px;
          //   top: 5px;
          //   .el-input__suffix-inner{
          //     height: 24px;
          //   }
          // }
          .el-input__inner {
            //border: none;
            font-weight: bold;
            width: 85px;
            // height: 24px;
            // background: @controlBg;
            // font-weight: bold;
          }
          &.level1 .el-input__inner {
            color: #ef6f6f;
          }
          &.level2 .el-input__inner {
            color: #ef9541;
          }
          &.level3 .el-input__inner {
            color: #efc92c;
          }
          &.level4 .el-input__inner {
            color: #8abb65;
          }
          &.level5 .el-input__inner {
            color: #8abb65;
          }
        }
      }
      /deep/ .el-select {
        .el-input__inner {
          border: none;
          height: 24px;
          background: @controlBg;
        }
      }
    }
    &-right {
      float: right;
      font-size: 13px;
      padding: 14px 0;
      color: #0071e7;
      height: 32px;
      line-height: 32px;
      .icon {
        font-size: 20px;
        float: left;
        padding-top: 6px;
        padding-right: 10px;
      }

      .item {
        cursor: pointer;

        float: left;
        // height: 42px;

        // line-height: 20px;
        margin: 0 18px 0 10px;
      }
    }
  }
}
.hint {
  //.textEllipsis(12vw);
  .textEllipsis(6vw);
}
.diagbose-alter.diagnose {
  height: calc(~"(100vh - 52px)");
  box-sizing: border-box;
}
.more .hint {
  //max-width: 25vw;
  max-width: 12.5vw;
}

@media screen and (min-width: 1370px) and (max-width: 1500px) {
  .hint {
    //max-width: 13vw;
    max-width: 6.5vw;
  }
  .more .hint {
    //max-width: 29vw;
    max-width: 14.5vw;
  }
}
@media screen and (min-width: 1501px) and (max-width: 1600px) {
  .hint {
    //max-width: 19vw;
    max-width: 9.5vw;
  }
  .more .hint {
    //max-width: 33vw;
    max-width: 16.5vw;
  }
}
@media screen and (min-width: 1601px) and (max-width: 1919px) {
  .hint {
    //max-width: 24vw;
    max-width: 12vw;
  }
  .more .hint {
    //max-width: 37vw;
    max-width: 18.5vw;
  }
}
@media screen and (min-width: 1920px) {
  .hint {
    // max-width: 36vw;
    max-width: 18vw;
  }
  .more .hint {
    // max-width: 47vw;
    max-width: 23.5vw;
  }
}
</style>
