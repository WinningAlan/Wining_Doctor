<template>
  <div class="inHosRequestNotes" ref="inHosRequestNotes">
    <div class="line0">
      <div>
        <span>姓名：&nbsp;&nbsp;{{patData.PatientName}}</span> &nbsp;&nbsp;&nbsp;&nbsp;
        <span>性别：&nbsp;&nbsp;{{patData.PatGenderCode|sexFilter}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
        <span>年龄：&nbsp;&nbsp;{{patData.AgeYear | ageFilter(patData.AgeMonth)}}</span>
      </div>
      <div style="margin:20px 0">医保卡号:&nbsp;&nbsp;{{patData.CardNumber}}</div>
      <div>门诊病历号:&nbsp;&nbsp;{{patData.RecordNumber}}</div>
    </div>
    <div class="line2">
      <span class="title2">联系电话</span>
      <el-input v-model="patData.Phone" placeholder="请输入电话号码"></el-input>
    </div>
    <div class="line2">
      <span class="titleNone">联系地址</span>
      <el-input v-model="patData.Address" placeholder="请输入联系地址"></el-input>
    </div>
    <div class="line3">
      <span class="title2">初步诊断</span>
      <el-autocomplete
        v-model="patData.Diagnosis"
        :fetch-suggestions="queryDiagnosis"
        placeholder="请输入内容"
        @select="handleSelectDiagnosis"
        :disabled="true"
      ></el-autocomplete>
    </div>
    <div class="line4">
      <div class="left">
        <span class="title2">拟入院科室</span>
        <el-select 
        v-model="dep"
        @change="changeDep"
         placeholder="请输入内容"
         filterable
         remote
         default-first-option
         :remote-method="remoteMethodDep"
         @focus="remoteMethodDep('')"
        >
          <el-option
            v-for="item in inHosPatDep"
            :key="item.Value"
            v-show="item.Value!=-1"
            :value="item.Value"
            :label="item.Text"
          ></el-option>
        </el-select>
      </div>
      <div class="right">
        <span class="titleNone">拟入院病区</span>
        <el-select 
        v-model="InHospitalArea" 
        default-first-option
        filterable
        remote
        @focus="remoteMethod('')"
        placeholder="请输入关键词"
        :remote-method="remoteMethod"
         >
          <el-option
            v-for="item in hospitalAreaList"
            :key="item.WardCode"
            :value="item.WardCode"
            :label="item.WardName"
          ></el-option>
        </el-select>
      </div>
    </div>
    <div class="line5">
      <div class="left">
        <span class="title2">拟入院日期</span>
        <el-date-picker
          v-model="InHospitalDate"
          type="datetime"
          placeholder="选择日期时间"
          value-format=" yyyy-MM-dd HH:mm"
          format="yyyy-MM-dd HH:mm"
        ></el-date-picker>
      </div>
    </div>
    <div class="line5">
      <div class="left">
        <span class="title2">住院付款方式</span>
        <el-select v-model="PaymentMethod" placeholder="请输入内容">
          <el-option
            v-for="(item,index) in paymentmethodList"
            :key="index"
            v-show="item.Value!=-1"
            :value="item.Value"
            :label="item.Text"
          ></el-option>
        </el-select>
      </div>
      <div class="right">
        <span class="title2">预交押金金额</span>
        <el-input v-model="Deposit" placeholder="请输入预交押金金额"></el-input>
      </div>
    </div>
    <div class="line2">
      <span class="title2">身份证号</span>
      <el-input v-model="patData.IDNumber" placeholder="请输入身份证号"></el-input>
    </div>
    <div class="line5">
      <div class="left">
        <span class="titleNone">联系人姓名</span>
        <el-input v-model="ContactsName" placeholder="请输入联系人姓名"></el-input>
      </div>
      <div class="right">
        <span class="titleNone">联系人关系</span>
        <el-select v-model="ContactsRelationship" clearable placeholder="请输入内容">
          <el-option
            v-for="(item,index) in relationshipList"
            :key="index"
            v-show="item.Value!=-1"
            :value="item.Value"
            :label="item.Text"
          ></el-option>
        </el-select>
      </div>
    </div>
    <div class="line5">
      <div class="left">
        <span class="titleNone">联系人电话</span>
        <el-input v-model="ContactsTel" placeholder="请输入联系人电话"></el-input>
      </div>
      <div class="right">
        <el-checkbox v-model="isPrint">是否打印</el-checkbox>
      </div>
    </div>
    <!-- <div class="line5">
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
      <div class="right">
        <el-checkbox v-model="fast">加急</el-checkbox>
      </div>
    </div>-->
  </div>
</template>
<script>
// import { debouce } from "@/utils/public.js";
import { mapGetters } from "vuex";
import * as regex from "@/module/regex";
import { GetFormatDateTime } from "@/utils/public";
import CallNumber from "@/utils/callNumber.js";
export default {
  name: "inHosRequestNotes", //住院申请单
  data() {
    return {
      idCard: "",
      diagnosis: "",
      deb: null, //防抖动
      inHosStyle: "急诊",
      dep: "",
      fast: false, //是否加急
      isPrint: true, //是否打印
      requestTime: GetFormatDateTime(), // 申请时间
      timer: null,
      InHospitalArea: "",
      InHospitalDate: GetFormatDateTime(),
      ContactsName: "",
      ContactsRelationship: "",
      ContactsTel: "",
      PaymentMethod: "",
      Deposit: "",
      hospitalAreaList:[],//病区数据
      inHosPatDep:[],
    };
  },
  created() {
    console.log(this.dictionarys, "字典表");
    if (this.isQueueNumber === "1" && this.selectArea.DiagnosisAreaType === 3) {
      this.callNumber = new CallNumber(this, this.callNumberName);
    }
  },
  methods: {
    queryDiagnosis(queryString, cb) {
      cb([]);
    },
    handleSelectDiagnosis(value) {
      console.log(value);
    },
    fn() {
      return null;
    },
    async save() {
      // 提交申请单并生成医嘱
      // 检查有没有空的必填项
      // 身份证号
      let str = "";
      if (!this.patData.IDNumber) {
        str += "请填写身份证号、";
      }
      // if (!new RegExp(regex.idNum[0].pattern).test(this.patData.IDNumber)) {
      //   this.$msg.warning("身份证格式错误");
      //   return;
      // }
      if (!this.patData.Phone) {
        str += "请填写联系电话、";
      }
      if (!this.patData.Diagnosis) {
        str += "请填写诊断、";
      }
      if (!this.dep) {
        str += "请选择拟入院科室、";
      }
      // if (!this.InHospitalArea) {
      //   str += "请选择拟入院病区、";
      // }
      if (!this.InHospitalDate) {
        str += "请选择拟入院日期、";
      }
      if (this.PaymentMethod === "") {
        str += "请选择住院付款方式、";
      }
      if (!this.Deposit) {
        str += "请填写预交押金金额、";
      }
      if (!new RegExp(regex.phoneReg[0].pattern).test(this.patData.Phone)) {
        str += "联系方式格式错误、";
      }
      str = str.substring(0, str.length - 1);
      if (str) return this.$msg.warning(str, 3000);
      let depName = "";
      let hospitalAreaName = "";
      let relationshipName = "";
      let paymentMethodName = "";
      this.inHosPatDep.forEach(item => {
        if (item.Value == this.dep) {
          depName = item.Text;
        }
      });
      this.hospitalAreaList.forEach(item => {
        if (item.WardCode == this.InHospitalArea) {
          hospitalAreaName = item.WardName;
        }
      });
      this.relationshipList.forEach(item => {
        if (item.Value === this.ContactsRelationship) {
          relationshipName = item.Text;
        }
      });
      this.paymentmethodList.forEach(item => {
        if (item.Value == this.PaymentMethod) {
          paymentMethodName = item.Text;
        }
      });
      let params = {
        InHospitalId: this.patData.Id,
        PatientId: this.patData.PatientId,
        IDNumber: this.patData.IDNumber,
        Phone: this.patData.Phone,
        Address: this.patData.Address,
        Diagnosis: this.patData.Diagnosis,
        InHospitalDepartment: depName, //
        InHospitalDepartmentCode: this.dep,
        InHospitalType: this.inHosStyle,
        ApplyDate: this.requestTime,
        IsUrgent: this.fast,
        InHospitalArea: hospitalAreaName, //
        InHospitalAreaCode: this.InHospitalArea,
        InHospitalDate: this.InHospitalDate,
        ContactsName: this.ContactsName,
        ContactsRelationship: relationshipName, //
        ContactsRelationshipCode: this.ContactsRelationship,
        ContactsTel: this.ContactsTel,
        PaymentMethod: paymentMethodName, //
        PaymentMethodCode: this.PaymentMethod,
        Deposit: this.Deposit,
        CASignImg: this.caImgData,
        DiagnosisCode:this.patData.DiagnosisCode,
        TurnedTo:  this.patData.turnedTo,
        TransferTo:  this.patData.transferTo
      };
          //  let obj = {
          //     inHospitalId:  this.patData.Id,
          //     turnedTo:  this.patData.turnedTo,
          //     transferTo:  this.patData.transferTo
          //   };
    //  let res= await  this.$Api.patPrognosis(obj)
    // if (!res.Status) {
    //   return this.$msg.warning(res.Message)
    // }
      let result = await this.$Api.applyPatInHos(params);
      if (result.Status) {
        if (
          this.isQueueNumber === "1" &&
          !this.patData.IsRecall &&
          this.selectArea.DiagnosisAreaType === 3
        ) {
          this.callNumber.ChangeBrzt(this.patData.ActiveRegistId, 5);
        }
        let t = new Date().getTime();
        this.$store.commit("public/SET_MEDICALADDEVENT", false);
        if (this.isPrint) {
          let str = window.location.protocol + "\\" + window.location.host;
          let url = `${URLCONFIG.Emr}/nursing/EditPage.aspx?inHospPatId=${this.patData.Id}&objectType=10&t=${t}&mark=true&originUrl=${str}&templateId=${this.patData.Id}`;
          console.log("加载完成开始", url);
          this.$store.commit("public/SET_PRINTIFRAMEURL", url);
        }
        return true;
      }
    },
    // 病区搜索
    remoteMethod(val){
        val = val && val.replace(/(^\s*)|(\s*$)/g, "");
      if(this.dep){
      let data={
      departmentCode:this.dep,
      }
      if(val){
        data.queryKey=val
      }
      this.$Api.getWardByDepartment(data).then(res=>{
        this.hospitalAreaList=res.Data||[]
        if (!this.InHospitalArea&&this.hospitalAreaList.length) {
          this.InHospitalArea= this.hospitalAreaList[0].WardCode
        }
      })
      }
    },
    // 改变入院科室
    changeDep(val){
    this.dep=val
    this.InHospitalArea=''
    this.remoteMethod('')
    },
    //远程搜索拟入院科室
    remoteMethodDep(val) {
      val = val && val.replace(/(^\s*)|(\s*$)/g, "");
      console.log(val,'远程搜索拟入院科室')
      let params={}
      if(val!='') {
        params.inputCode=val
      }
      this.$Api.getInPatDepartment(params).then(res => {
        if(res.Status) {
          this.inHosPatDep=res.Data
        }else{
          this.inHosPatDep=[]
        }
      })
    },
  },
  watch: {
    diagnosis: function(newValue) {
      console.log(newValue);
    }
  },
  computed: {
    ...mapGetters({
      dialogData: "public/GET_DIALOGDATA",
      //inHosPatDep: "public/GET_INHOSPATDEP",
      dictionarys: "public/GET_DICTIONARIES",
      selectArea: "home/GET_SELECTAREA",
      user: "public/GET_USER",
      isQueueNumber: "configuration/GET_ISQUEUENUMBER", //是否启用排队叫号系统
      callNumberName: "configuration/GET_CALLNUMBER", //叫号操作系统
      caImgData: "public/GET_CAIMGDATA" //ca签名图片数据流，医嘱提交处使用
    }),
    patData: function() {
      return this.dialogData.data;
    },
    relationshipList: function() {
      return this.dictionarys.Relationship;
    },
    paymentmethodList: function() {
      return this.dictionarys.Paymentmethod;
    },
    InHospitalType: function() {
      return this.dictionarys.InHospitalType;
    }
  }
};
</script>
<style lang="less" scoped>
.inHosRequestNotes {
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
  }
  .title {
    font-size: 18px;
    font-weight: bold;
    text-align: center;
  }
  .title2 {
    margin-right: 10px;
    &:before {
      content: "*";
      display: inline-block;
      color: red;
      margin-right: 5px;
    }
  }
  .titleNone {
    margin-right: 10px;
    &::before {
      display: inline-block;
      width: 6.5px;
      content: "";
      margin-right: 5px;
    }
  }
  .wordLetter {
    letter-spacing: 10px;
  }
  .line1,
  .line4,
  .line5 {
    span {
      display: inline-block;
      width: 96px;
    }
    .el-input {
      width: 60%;
    }
    .el-select {
      width: 60%;
    }
  }
  .line2,
  .line3 {
    span {
      display: inline-block;
      width: 96px;
    }
    .el-input {
      width: 81%;
    }
    .el-autocomplete {
      width: 81%;
    }
  }
}
</style>
