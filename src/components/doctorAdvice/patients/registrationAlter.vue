<template>
  <div class="registrationAlter">
    <p class="msg" v-if="msg">
      <svg-icon iconClass="title" class="my-icon"></svg-icon>
      {{msg}}
    </p>
    <el-form
      :model="commonData"
      :rules="rules"
      ref="inspectDoctorAdvice"
      label-position="right"
      label-width="80px"
    >
      <el-form-item label="就诊卡" prop="cardType">
        <div class="handleTableLeft">
          <el-input
            placeholder="就诊卡"
            v-model="cardNumber"
            :readonly="isDisabled"
            size="small"
            @keyup.enter.native="getPatientList"
          >
            <!-- <el-select
              v-model="commonData.cardType"
              slot="prepend"
              placeholder="请选择"
              @change="changeFeeType(commonData.cardType!==1)"
            >
              <el-option
                :label="item.name"
                :value="item.value"
                v-for="(item,index) in cardList"
                :key="index"
              ></el-option>
            </el-select> -->
            <!-- <span slot="append" icon="el-icon-search" @click="getPatientList(1)"></span> -->
          </el-input>
        </div>
        <el-checkbox
          v-model="isSelfpaying"
          :disabled='isDisabled'
          class="isSelfpaying"
          @change="changeFeeType"
        >自费挂号</el-checkbox>
      </el-form-item>
      <el-form-item label="患者姓名" class="item first">{{patientMsg.PatientName}}</el-form-item>
      <el-form-item label="性别" class="item sex">{{patientMsg.PatGenderCode |sexFilter}}</el-form-item>
      <el-form-item
        label="年龄"
        class="item age"
      >{{patientMsg.AgeYear | ageFilter(patientMsg.AgeMonth)}}</el-form-item>
      <el-form-item
        label="费别"
        prop="FeeType"
        class="item last"
      >{{commonData.FeeType|feeTypeFilter(feeTypeList)}}</el-form-item>
      <el-form-item label="挂号类型" prop="RegisterType" class="w50">
        <el-select v-model="commonData.RegisterType" placeholder="请选择">
          <el-option
            :label="item.Text"
            :value="item.Value"
            :key="item.Value"
            v-for=" item in registrationArr"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="挂号科室" prop="RegisterDepCode" class="w50">
        <el-select v-model="commonData.RegisterDepCode" placeholder="请选择">
          <el-option
            :label="item.Name"
            :value="item.Code"
            v-for="item in departments"
            :key="item.Code"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="科别" prop="departmenttypename" class="w50">
        <el-select v-model="commonData.departmenttypename" placeholder="请选择">
          <el-option
            :label="item.Text"
            :value="item.Text"
            v-for="item in departmenttypenameOps"
            :key="item.Value"
          ></el-option>
        </el-select>
      </el-form-item> -->
    </el-form>
  </div>
</template>

<script>
import { cardList } from "@/module/staticData.js";
import { mapGetters } from "vuex";
import {
  getYourIP,
  GetFormatDateTime,
  birthDayTime
} from "../../../utils/public";
export default {
  name: "registrationAlter", //挂号
  props: {
    initialize: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      cardList,
      isSelfpaying: false, //是否自费
      allDepartments: [], //所有科室

      commonData: {
        HisPatientId: "",
        PatientId: "",
        cardType: 2,
        CardNumber: "", //就诊卡号
        IDNumber: "", //身份证号
        SocialSecurityNumber: "", //医保卡号
        FeeType: "",
        RegisterDepCode: "",
        RegisterType: "",
        Cfzbz: 0,// 初复诊标识 0：初诊，1：复诊 ,
        departmenttypename:''
      },
      loginIp: "",
      readTimer: null,
      rules: {
        RegisterDepCode: [
          { required: true, message: "请选择挂号科室", trigger: "change" }
        ],
        RegisterType: [
          { required: true, message: "请选择挂号类型", trigger: "change" }
        ],
        cardType: [{ required: true, message: "请输入卡号", trigger: "change" }],
        // departmenttypename:[{ required: true, message: "请选择患者科别", trigger: "change" }]
      }
    };
  },
  created() {
   this.isTray==1&& this.getIp()
  },
  beforeDestroy() {
    clearInterval(this.readTimer);
  },
  computed: {
    ...mapGetters({
      patientMsg: "public/GET_PATIENTMSG",
      selectArea: "home/GET_SELECTAREA", //所在区域
      user: "public/GET_USER",
      feeTypeList: "public/GET_FEETYPELIST", //所有费别
      // feeTypeCode:"doctoradvice/GET_FEETYPECODE",
      isTray: "configuration/GET_ISTRAY",
      medicareList: "configuration/GET_MEDICARELIST",
    }),
    // //科别字典
    // departmenttypenameOps:function(value){
    //     return this.$store.getters['public/getDic']('DepartmentTypeName').filter(
    //       el=>el.Value !== -1
    //     )
    // },
    //可挂号的科室
    departments() {
      let data = this.allDepartments || [];
      console.log(this.user.Departments, this.allDepartments);

      if (this.selectArea.DiagnosisAreaType === 3) {
        let arr = [];
        this.allDepartments.forEach(el => {
          this.user.Departments.forEach(item => {
            el.Code === item.Code && arr.push(item);
          });
        });
        data = arr;
      }
      this.selectArea.DiagnosisAreaType === 3
        ? this.user.Departments
        : this.allDepartments;
      if (!this.commonData.RegisterDepCode) {
        this.commonData.RegisterDepCode = this.patientMsg.Department?this.patientMsg.Department:(data[0] ? data[0].Code : "");
      }
      return data;
    },
    // 卡号是否只读
    isDisabled() {
      let type=this.patientMsg.SocialSecurityCode_default
      return !this.medicareList.includes(type)
    },
    cardNumber: {
      get: function() {
        return this.commonData.CardNumber
        // let type = this.commonData.cardType;
        // return type === 1
        //   ? this.commonData.SocialSecurityNumber
        //   : type === 2
        //   ? this.commonData.CardNumber
        //   : this.commonData.IDNumber;
      },
      set: function(val) {
        switch (this.commonData.cardType) {
          case 1:
            this.commonData.SocialSecurityNumber = val;
            break;
          case 2:
            this.commonData.CardNumber = val;
            break;
          case 3:
            this.commonData.IDNumber = val;
            break;
        }
      }
    },
    // 提示信息
    msg() {
      if (!this.patientMsg.IsRegister) {
        return "患者未挂号，请挂号！";
      } else if (this.patientMsg.IsRegister && !this.patientMsg.RegistId) {
        return "挂号失效，请重新挂号!";
      } else {
        return "";
      }
    },
    // 挂号类型
    registrationArr() {
      let data =
        this.$store.getters["public/getDic"]("RegisterType").filter(
          el => el.Value > -1
        ) || [];
      this.commonData.RegisterType = data[0] ? data[0].Value : "";
      return data;
    }
  },
  watch: {
    initialize: {
      handler: function(val, oldVal) {
        if (val) {
          // console.log(this.feeTypeCode,"this.feeTypeCode")
          console.log(this.patientMsg.SocialSecurityCode_default,"this.patientMsg.SocialSecurityCode_default")
          this.getEmergencyDepment();
          this.commonData.FeeType = this.patientMsg.SocialSecurityCode_default;
          this.commonData.feeTypeText =  this.feeTypeList.find(el=>el.Code===this.commonData.FeeType).Name;
          this.commonData.SocialSecurityNumber = this.patientMsg.SocialSecurityNumber;
          this.commonData.CardNumber = this.patientMsg.CardNumber;
          this.commonData.IDNumber = this.patientMsg.IDNumber;
          this.commonData.HisPatientId = this.patientMsg.HISPatientId;
          this.commonData.PatientId = this.patientMsg.PatientId;
          this.changeFeeType(!this.medicareList.includes(this.commonData.FeeType));
        }
      },
      immediate: true
    }
  },
  methods: {
    // 挂号
    async save() {
      if (!this.cardNumber) return this.$msg.warning("请填写卡号或身份证！");
      try {
        let num = 0;
        this.patientMsg.RegisterInfoList.forEach(el => {
          if (el.RegDepartmentCode === this.commonData.RegisterDepCode) {
            num = 1;
          }
        });
        this.commonData.Cfzbz = num;
        this.commonData.InHospitalId = this.patientMsg.InHouseId;
        let data = await this.$Api.registerApply(this.commonData);
        this.$msg[data.Status ? "success" : "warning"](data.Message);
        if (data.Status) {
          try {
            let res = await this.setRegister({
              HisRegisterId: data.Data.Ghhx,
              Department: this.commonData.RegisterDepCode,
              RegisterType: data.Data.Ghlb
            });
          } catch (error) {
            let patientMsg = JSON.parse(JSON.stringify(this.patientMsg));
            patientMsg.RegisterInfoList.unshift({
              RegDepartmentName: this.getDepmentText(),
              FeeType: this.commonData.feeTypeText,
              HisRegistId: data.Data.Ghhx,
              RegDepartmentCode: this.commonData.RegisterDepCode
            });
            patientMsg.SocialSecurityNumber = this.commonData.SocialSecurityNumber;
            patientMsg.CardNumber = this.commonData.CardNumber;
            patientMsg.IDNumber = this.commonData.IDNumber;
            patientMsg.RegistId = data.Data.Ghhx;
            this.$store.commit("public/SET_PATIENTMSG", patientMsg);
            return data.Status;
          }
          console.log(data, this.patientMsg);
        }
        return data.Status;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    //读取托盘程序的
    readTray() {
if (!this.cardNumber) return this.$msg.warning("请填写卡号或身份证！");
      if(!this.commonData.departmenttypename) return this.$msg.warning("请选择患者科别！");
      let num = 0;
      let cont = 0;
      this.patientMsg.RegisterInfoList.forEach(el => {
        if (el.RegDepartmentCode === this.commonData.RegisterDepCode) {
          num = 1;
        }
      });
      let data = {
        Zgdm: this.user.UserInfo.No, //登录人id  /// 职工代码
        Zgxm: this.user.UserInfo.Name, //登录人姓名  /// 职工姓名
        DepCode: this.commonData.RegisterDepCode, // /// 科室代码
        DepName: this.getDepmentText(), /// 科室名称
        Wkdz: null, /// 网卡地址
        Patid: this.patientMsg.HISPatientId, /// 病人ID
        Ksdm: this.commonData.RegisterDepCode, /// 科室代码
        Ysdm: this.user.UserInfo.No, /// 医生代码
        Ghlb: this.commonData.RegisterType, /// 挂号类别
        Pbmxxh: null, /// 排班表明细序号
        Tsbzdm: null, /// 特殊病种代码
        Tsbzmc: null, /// 特殊病种名称
        Medtype: null, /// 医疗类别名称
        Ybbfz: null, // / 并发症
        Mfghyy: null, /// 免费挂号原因代码（GH_MFGHYY中获取）
        Qfjsbz: null, /// 欠费结算标志（0不允许欠费结算1允许欠费结算）默认为0
        Yyxh: null, /// 预约序号（非预约时传空）
        Cfzbz: num, /// 初复诊标志(0--初诊,1--复诊)
        Ybdm: this.commonData.FeeType, //费别
        Yjxh: null, /// 预检序号(非预检时传空)
        DepartmentTypeName:this.commonData.departmenttypename
      };
      this.$Api
        .readTFTray({
          loginip: this.loginIp,
          type: "3",
          token: new Date().getTime(),
          data: JSON.stringify(data)
        })
        .then(returRes => {
          if (returRes.Status) {
            // console.log(returRes, "res");
            // console.log(returRes.Data, "data");
            // console.log(JSON.parse(returRes.Data), "JSON.parse(list)");
            if (returRes.Data) {
              let runData = returRes.Data;
              // let runData = JSON.parse(registerData);
              // console.log(data,"datata")
              // this.getCommonInfo(runData.Ghhx);
              this.toRegister(
                {
                  HisRegisterId: runData.Ghhx,
                  Department: this.commonData.RegisterDepCode,
                  RegisterType: runData.Ghlb,
                  SocialSecurityCode: runData.Ybdm,
                  FeeType: this.commonData.feeTypeText
                },
                runData
              );
              // clearInterval(this.readTimer);
              this.$msg.success("挂号成功！");
              // this.$store.commit("doctoradvice/SET_FEETYPECODE","")
              this.$emit("readChang");
           
            }
          } else {
            // clearInterval(this.readTimer);
            this.$msg.warning(returRes.Message);
            this.$emit("readChang");
          }

        });
    },
    // 获取科室文字
    getDepmentText() {
      let str = "";
      this.departments.forEach(el => {
        if (el.Code === this.commonData.RegisterDepCode) {
          str = el.Name;
        }
      });
      return str;
    },
    // 改变费别
    changeFeeType(val) {
      console.log(this.patientMsg.SocialSecurityCode_default)
      this.isSelfpaying = val;
      this.commonData.FeeType = this.patientMsg.SocialSecurityCode_default;
      this.commonData.feeTypeText =  this.feeTypeList.find(el=>el.Code===this.commonData.FeeType).Name;
      val &&
        this.feeTypeList.forEach(el => {
          if (el.Name.indexOf("自费") > -1) {
            this.commonData.FeeType = el.Code;
            this.commonData.feeTypeText = el.Name;
          }
        });
    },
    getPatientList() {},
    // 获取所有急诊科室
    getEmergencyDepment() {
      this.$Api.getEmergencyDepment().then(res => {
        this.allDepartments = res.Data || [];
        !res.Status && this.$msg.warning(res.Message);
      });
    },
    //更新患者数据
    setPatMsg(id) {
      this.$store.dispatch("public/getPatientMsg", {
        that: this,
        data: { inHouseId: id }
      });
    },
    async setRegister(obj) {
    let data = { ...this.patientMsg, ...obj };
      data.HospitalAreaId = this.user.HospitalAreaId;
      data.MainInHouseId = data.InHouseId;
      data.ReceptionTime = GetFormatDateTime();
      data.Name = data.PatientName;
      data.BirthDay = birthDayTime(data.BirthDay);
      data.Number = data.HisRegistId;
      data.SocialSecurityCode=this.commonData.FeeType
       data.RegisterInfoList=null;
      return this.$Api.setRegister(data);
    },
    toRegister(obj, runData) {
      let data = { ...this.patientMsg, ...obj };
      data.HospitalAreaId = this.user.HospitalAreaId;
      data.MainInHouseId = data.InHouseId;
      data.ReceptionTime = GetFormatDateTime();
      data.Name = data.PatientName;
      data.BirthDay = birthDayTime(data.BirthDay);
      data.Number = data.HisRegisterId;
      data.DepartmentTypeName = this.commonData.departmenttypename
      console.log(data.HisRegisterId,"data.HisRegisterId",data);
      delete data.RegisterInfoList;
      this.$Api.setRegister(data).then(res => {
        this.setPatMsg(this.$route.query.id);
        if (res.Status) {
  
        } else {
          let patientMsg = JSON.parse(JSON.stringify(this.patientMsg));
          patientMsg.RegisterInfoList.unshift({
            RegDepartmentName: this.getDepmentText(),
            FeeType: this.commonData.feeTypeText,
            HisRegistId: runData.Ghhx,
            RegDepartmentCode: this.commonData.RegisterDepCode,
            RegistTime: runData.Ghsj,
            SocialSecurityCode: this.commonData.FeeType
          });
          patientMsg.SocialSecurityNumber = runData.Ybdm;
          patientMsg.CardNumber = this.commonData.CardNumber;
          patientMsg.IDNumber = this.commonData.IDNumber;
          patientMsg.RegistId = runData.Ghhx;
          patientMsg.SocialSecurityCode = this.commonData.FeeType;
          this.$store.commit("public/SET_PATIENTMSG", patientMsg);
          // this.$parent.isShowAlter = true;
        }
      });
    },
        // 获取本地ip
    getIp() {
      this.$Api.getLocalhostIp().then(res => {
        let IP = res.Data;
        if(IP)this.loginIp=IP
      });
      getYourIP(ip => {
        if(ip)this.loginIp=ip
      });
    }
  },
  filters: {
    feeTypeFilter(val, arr) {
      let str = "";
      arr.forEach(element => {
        if (val === element.Code) {
          str = element.Name;
        }
      });
      return str;
    }
  }
};
</script>
<style  lang='less'>
.registrationAlter {
  padding: 30px 10px;
  height: 250px;
  position: relative;
  box-sizing: border-box;
  .msg {
    position: absolute;
    top: -37px;
    left: 100px;
    // z-index: 10000;
    .my-icon {
      color: #f52c2c;
      margin-right: 10px;
    }
    color: #f52c2c;
    font-size: 16px;
  }
  .handleTableLeft {
    float: left;
    .el-input-group__prepend {
      width: 133px;
      border: none;
      background-color: #f3f5f9;
      padding: 0;
    }
    .el-input__inner {
      border: none;
      background-color: #f3f5f9;
      border-left: 1px solid #c5d0d9;
    }
    > .el-input > .el-input__inner {
      width: 324px;
    }
    // /deep/.el-input-group__append {
    //   border: none;
    //   .el-button--small {
    //     width: 15px;
    //   }
    // }
    // /deep/.el-input-group--append .el-input__inner {
    //   border: none;
    //   background-color: #f3f5f9;
    //   border-right: 1px solid #c5d0d9;
    // }

    /deep/.el-input-group__prepend .el-select {
      margin: 0;
    }
  }
  .isSelfpaying {
    float: left;
    margin-left: 41px;
    // margin-right: 70px;
  }
  .noLabel {
    margin-bottom: 0 !important;
  }
  .item {
    float: left;
    &.sex {
      width: 16%;
    }
    &.age {
      width: 24%;
    }
    &.first {
      width: 29%;
    }
    &.last {
      width: 29%;
    }
    /deep/ .el-form-item__content {
      background-color: #f2f2f2;
      padding-left: 5px;
    }
  }
  .w50 {
    width: 50%;
    float: left;
    /deep/ .el-select {
      width: 292px;
      .el-input__inner {
        border: none;
        background-color: #f3f5f9;
      }
    }
  }
}
</style>
