<template>
  <div class="consultation">
    <div class="tabs-temp">
      <el-radio-group v-model="nowTemp" @change="tapsExamine" fill="#0071e7">
        <el-radio-button
          :label="item.Value"
          v-for="(item,index) in tabsTemp"
          v-if="item.Show"
          :key="index"
        >{{item.Text}}</el-radio-button>
      </el-radio-group>
      <div v-show="nowTemp!==1" class="three">
        <a :href="clienHref" target="_blank">受邀会诊</a>
      </div>
    </div>
    <div class="new-create" v-if="nowTemp===1">
      <newCreate :commonObj="commonObj" ref="newCreate" :isBorder="false">
        <template slot-scope="{submitForm}">
          <div class="btn">
            <el-button @click="reset" class="reset">取消</el-button>
            <el-button type="primary" @click="save(submitForm)" class="save">保存</el-button>
          </div>
        </template>
      </newCreate>
    </div>
    <div class="his-con" v-if="nowTemp===2">
      <div class="his-left">
        <div
          class="his-item"
          v-for="(item,index) in conHisList"
          :key="index"
          :class="{active:hisSelectId==item.InHouseId}"
          @click="selectId(item)"
        >
          <p>{{item.InHospTime | timeFilter}}</p>
          <p>{{item.DepartmentName}}{{item.DepartmentTypeName}}</p>
        </div>
      </div>
      <div class="his-right">
        <conTable :tableData="tableData" :callback="callbackTable"></conTable>
      </div>
    </div>
    <my-alert
      :visible="isShow"
      :title="alterData[nowAlter].title"
      :callback="alterCallback"
      :isfooter="alterData[nowAlter].isfooter"
      :width="alterData[nowAlter].width"
    >
      <component
        :is="nowAlter"
        :detailData="deatilData"
        :changData="signInData"
        :gradeData="gradeData"
        :feedBackData="feedBackData"
      ></component>
      <!-- <templatename="footer"></template> -->
      <div class="btnList" v-if="nowAlter == 'conDeatil' && isDeatilFoot && patientMsg.Status!=8">
        <el-button class="save" @click="submitData">提交</el-button>
        <el-button class="reset-list" @click="upData">修改</el-button>
      </div>
      <div class="btnList" v-if="nowAlter == 'signIn'">
        <el-button class="sigInBtn" @click="sendSignIn">确定签到</el-button>
      </div>
    </my-alert>
  </div>
</template>
<script>
import newCreate from "../../components/doctorAdvice/consultation/newCreate";
import myAlert from "@/components/common/myAlter";
import conDeatil from "../../components/doctorAdvice/consultation/conDeatil";
import conTable from "../../components/doctorAdvice/consultation/conTable";
import signIn from "../../components/doctorAdvice/consultation/signIn";
import conGrade from "../../components/doctorAdvice/consultation/conGrade";
import feedBack from "../../components/doctorAdvice/consultation/feedBack";
import { mapGetters } from "vuex";
import { getSession } from "../../utils/storage";
import { printObjectType } from "@/module/staticData.js";
import CASign from "@/utils/caSign.js";

const defalutData = {
  InHouseId: "",
  TypeCode: "",
  Target: "",
  TargetCode: "",
  StartDate: "",
  LocationCode: "",
  HospitalCode: "",
  Fee: 0,
  ConsultationDetails: [],
  DictItemCode:"",
  ContactName: getSession("user").UserInfo.Name,
  ContactPhone: getSession("user").UserInfo.Telphone
};
console.log("user", getSession("user"));
export default {
  name: "consultation", //会诊管理
  data() {
    return {
      nowTemp: 1, //当前显示的是那个模板
      tabsTemp: [
        {
          Text: "新建会诊",
          Value: 1,
          Show: true
        },
        {
          Text: "会诊记录",
          Value: 2,
          Show: true
        }
      ],
      commonObj: {}, //表单的数据
      alterData: {
        conDeatil: {
          width: "500px",
          title: "会诊单详情",
          isfooter: false
        },
        signIn: {
          width: "400px",
          title: "签到",
          isfooter: false
        },
        conGrade: {
          width: "800px",
          title: "评价",
          isfooter: true
        },
        feedBack: {
          width: "400px",
          title: "查看反馈",
          isfooter: false
        }
      },
      deatilData: {}, //详情的弹窗数据
      nowAlter: "conDeatil",
      tableData: [], //获取历史的数据
      hisSelectId: "", //会诊记录选中的记录id
      consultationId: "", //单条会诊的记录id
      conHisList: [], //诊断的历史列表数据
      isDeatilFoot: true, //详情的弹框底部显示问题
      signInData: [], //签到的数据
      gradeData: [], //评价的数据存储
      feedBackData: {}, //反馈的数据
      clienHref: "",
      timer: null,
      caSignOperation: {}, //
      currentObjData: ""
    };
  },
  watch: {
    "patientMsg.Status": {
      handler(val) {
        if (val == 8) {
          this.tabsTemp[0].Show = false;
          this.nowTemp = 2;
          this.$Api
            .getConHisList({ PatientId: this.patientMsg.PatientId })
            .then(res => {
              if (res.Status) {
                this.conHisList = res.Data || [];
                console.log(res);
                if (this.conHisList[0]) {
                  this.hisSelectId = this.conHisList[0].InHouseId;
                  this.getConHisDetails(this.conHisList[0].InHouseId);
                }
              }
            });
        } else {
          this.tabsTemp[0].Show = true;
          this.nowTemp = 1;
        }
      },
      deep: true,
      immediate: true
    },
    isGetCA: function(val) {
      if (val) {
        // 验证  会诊申请
        if(this.currentObjData.Data&&this.currentObjData.Data[0].Name=='会诊申请') {
          this.caSignOperation.checkData(this.user.UserInfo, this.currentObjData);
        }
      }
    }
  },
  mounted() {
    this.getFeeByTypeCodeList();
    this.clienHref = window.URLCONFIG.Consultation;
    if (this.isSignName) {
      this.caSignOperation = new CASign(this, this.signName);
    }
  },
  methods: {
    //却换历史和新建的函数
    tapsExamine(val) {
      console.log(val);
      if (val == 1) {
        this.isDeatilFoot = true;
      } else {
        this.commonObj = defalutData;
        this.$Api
          .getConHisList({ PatientId: this.patientMsg.PatientId })
          .then(res => {
            if (res.Status) {
              this.conHisList = res.Data || [];
              console.log(res);
              if (this.conHisList[0]) {
                this.hisSelectId = this.conHisList[0].InHouseId;
                this.getConHisDetails(this.conHisList[0].InHouseId);
              }
            }
          });
      }
    },
    //清空数据
    reset() {
      this.$refs.newCreate.resetForm();
      this.commonObj = defalutData;
    },
    //保存数据
    async save(submitForm) {
      let data = await submitForm();
      // this.commonObj = data;
      let sendData = { ...data };
      if (data) {
        let arr = [];
        sendData.ConsultationDetails.forEach(item => {
          arr.push({
            DepartmentCode: item
          });
        });
        sendData.ConsultationDetails = arr;
        this.$Api.addConsultation(sendData).then(res => {
          this.$msg[res.Status ? "success" : "warning"](res.Message);
          if (res.Status) {
            this.consultationId = res.Data;
            this.getOneDeatil(this.consultationId);
          }
        });
      }
      // this.commonObj =  data;
    },
    //弹窗回调
    alterCallback(val) {
      if (val) {
        if (this.nowAlter == "conDeatil") {
          console.log(this.nowTemp);
          if (this.nowTemp == 1) {
            this.upData();
          }
          this.$store.commit("public/SET_ISSHOW", false);
        } else if (this.nowAlter == "conGrade") {
          let data = {
            ConsultationId: this.consultationId,
            EvaluationDetails: this.gradeData
          };
          this.$Api.evaluateCon(data).then(res => {
            this.$msg[res.Status ? "success" : "warning"](res.Message);
            console.log(res);
            if (res.Status) {
              this.getConHisDetails(this.hisSelectId);
              this.$store.commit("public/SET_ISSHOW", false);
            }
          });
        }
      } else {
        if (this.nowAlter == "conDeatil") {
          console.log(this.nowTemp);
          if (this.nowTemp == 1) {
            this.upData();
          }
          this.$store.commit("public/SET_ISSHOW", false);
        }
        this.$store.commit("public/SET_ISSHOW", false);
      }
    },
    //获取单个详情的数据
    getOneDeatil(id) {
      this.$Api.getConsultationInfo({ ConsultationId: id }).then(res => {
        // if (res.Status) {
        let data = res.Data || {};
        console.log(this.itemFeeList);
        this.itemFeeList.forEach(el => {
          if (el.ItemCode === data.DictItemCode) {
            data.DictItemName = el.ItemName;
          }
        });
        this.deatilData = data;

        this.nowAlter = "conDeatil";
        this.$store.commit("public/SET_ISSHOW", true);
        // }
      });
    },
    //提交会诊数据
    submitData() {
      if (!this.patientMsg.RegistId) {
        this.$msg.info("该患者无有效挂号，请先挂号！");
        if (this.isRegister === "1") {
          let obj = {
            title: "患者挂号",
            width: "800px",
            component: "registrationAlter",
            isShowFooter: true,
            btn: ["挂号", "取消"],
            visible: true
          };
          this.$store.commit("public/SET_DIALOGDATA", obj);
        }
        return;
      }
      if (this.isSignName) {
        let obj = {
          Type: "0",
          Data: [{ Name: "会诊申请" }],
          No: this.user.UserInfo.No,
          UserName: this.user.UserInfo.Name
        };
        this.currentObjData = obj;
        this.caSignOperation.KeyVerify();
      } else {
        this.handleOperation();
      }
    },
  async  handleOperation() {
    console.log(this.deatilData);
    try {
     let isPassIMIS=await this.$IMIS.submmitOrderIMIS([{OrderType:31,OrderId:this.deatilData.DoctorOrderId}],this.patientMsg)
       if(!isPassIMIS)return
   } catch (error) {
     
   }
      this.$Api
        // .submitAdvice({ InHouseId: this.$route.query.id, OrderList: [this.consultationId], HisRegisterId: this.patientMsg.RegistId })
        .submitAdvice({
          InHouseId: this.$route.query.id,
          OrderList: [this.deatilData.DoctorOrderId],
          HisRegisterId: this.patientMsg.RegistId,
          CASignImg:this.caImgData
        })
        .then(res => {
          this.$msg[res.Status ? "success" : "warning"](res.Message);
          if (res.Status) {
            this.$store.commit("public/SET_ISSHOW", false);
            if (this.nowTemp == 2) {
              this.getConHisDetails(this.hisSelectId);
            }
            this.$refs.newCreate.resetForm();
            this.commonObj = defalutData;
            this.print();
 
          }else{
            this.refreshOrderStatus()
          }
        }).catch(err=>{
          this.refreshOrderStatus()
        });
    },
    //修改数据
    upData() {
      console.log(this.deatilData);
      this.toData();
    },
    //合并数据到修改数据
    toData() {
      let arr = [];

      if (this.deatilData) {
        this.deatilData.ConsultationDetails &&
          this.deatilData.ConsultationDetails.forEach(item => {
            arr.push(item.DepartmentCode);
          });
      }
      this.commonObj = this.deatilData;
      this.commonObj.ConsultationDetails = arr;
      console.log(this.commonObj);
      this.$store.commit("public/SET_ISSHOW", false);
      this.nowTemp = 1;
    },
    //表格的回调函数
    callbackTable(val, str) {
      this.consultationId = val.ConsultationId;
      if (str === "row") {
        this.consultationId = val.ConsultationId;
        this.getOneDeatil(val.ConsultationId);
        if (val.Status !== 1) {
          this.isDeatilFoot = false;
        } else {
          this.isDeatilFoot = true;
        }
      }
      if (str == "signIn") {
        this.$Api
          .getSingIn({ consultationId: val.ConsultationId })
          .then(res => {
            if (res.Status) {
              this.signInData = res.Data;
              this.nowAlter = "signIn";
              this.$store.commit("public/SET_ISSHOW", true);
              console.log(res.Data);
            }
          });
      }
      if (str == "cancel") {
        this.$confirm("该操作将取消该会诊记录,是否继续?", "", {
          type: "warning"
        })
          .then(() => {
            this.$Api
              .stopAdvice({
                opertionType: 5,
                orderIdList: [val.DoctorOrderId]
              })
              .then(res => {
                this.$msg[res.Status ? "success" : "warning"](res.Message);
                if (res.Status) {
                  this.getConHisDetails(this.hisSelectId);
                }
              });
          })
          .catch(() => {
            this.$msg.info("已取消操作");
          });
      }
      if (str == "evaluate") {
        this.$Api
          .getGradeDetail({ consultationId: this.consultationId })
          .then(res => {
            if (res.Status) {
              this.gradeData = res.Data;
            } else {
              let arr = [];
              val.ConsultationDetails.forEach(item => {
                arr.push({
                  ConsultationDetailId: item.ConsultationDetailId,
                  DepartmentName: item.DepartmentName,
                  EvaluationGrade: 0,
                  EvaluationDesc: ""
                });
              });
              this.gradeData = arr;
            }
          });
        this.nowAlter = "conGrade";
        // this.gradeData.ConsultationId = this.consultationId;
        this.$store.commit("public/SET_ISSHOW", true);
      }
      if (str == "end") {
        // this.$Api
        // .stopAdvice({
        //   opertionType: row.EffectiveTime === 2 ? 4 : 5,
        //   orderIdList: [row.OrderId],
        //   MaxNumber
        // })
        // .then(res => {
        //   this.$msg[res.Status ? "success" : "warning"](res.Message);
        //   if (res.Status) {
        //     this.submitRowData = {};
        //     this.getAdviceList("doctorAdviceListData");
        //   }
        // });
        this.$confirm("该操作将结束本次会诊,是否继续?", "", {
          type: "warning"
        })
          .then(() => {
            this.loadIframe(val.ConsultationId);
            this.$Api
              .endCon({ consultationId: val.ConsultationId })
              .then(res => {
                this.$msg[res.Status ? "success" : "warning"](res.Message);
                if (res.Status) {
                  this.getConHisDetails(this.hisSelectId);
                }
              });
          })
          .catch(() => {
            this.$msg.info("已取消操作");
          });
      }
      if (str == "edit") {
        // this.commonObj = val;
        this.$Api
          .getConsultationInfo({ ConsultationId: this.consultationId })
          .then(res => {
            if (res.Status) {
              var arr = [];
              res.Data.ConsultationDetails &&
                res.Data.ConsultationDetails.forEach(item => {
                  arr.push(item.DepartmentCode);
                });
            }

            this.commonObj = res.Data;
            this.commonObj.ConsultationDetails = arr;
            this.nowTemp = 1;
          });
      }
      if (str == "del") {
        this.$confirm("该操作将删除该会诊记录,是否继续?", "", {
          type: "warning"
        })
          .then(() => {
            this.$Api
              .delCon({ consultationId: this.consultationId })
              .then(res => {
                if (res.Status) {
                  this.getConHisDetails(this.hisSelectId);
                }
              });
          })
          .catch(() => {
            this.$msg.info("已取消操作");
          });
      }
      if (str == "print") {
        this.print();
        // let url = `${URLCONFIG.DoctorAdvicePrint}/webroot/decision/view/report?viewlet=EDIS/Doctor/Consultation/ConsultationApply.cpt&consultationid=${this.consultationId}&inhouseid=${this.$route.query.id}`;
        // let dom = document.createElement("a");
        // dom.setAttribute("href", url);
        // dom.setAttribute("target", "_blank");
        // dom.click();
      }
      if (str == "look") {
        this.feedBackData = {};
        this.$Api
          .getConFeedBack({ consultationDetailId: val.ConsultationDetailId })
          .then(res => {
            if (res.Status) {
              this.feedBackData = res.Data;
              this.nowAlter = "feedBack";
              this.$store.commit("public/SET_ISSHOW", true);
            }
          });
      }
    },
    print() {
      clearTimeout(this.timer);
      let t = new Date().getTime();
      let str = window.location.protocol + "\\" + window.location.host;
      let url = `${URLCONFIG.Emr}/Nursing/EditPage.aspx?patientId=${this.patientMsg.PatientId}&inHouseId=${this.patientMsg.InHouseId}&areaType=${this.patientMsg.AreaType}&createUser=940c7df7-a718-e911-80cd-0050568e1b08&originUrl=${str}&objectType=${printObjectType.consultation.objectType}&logUserEditTrack=true&documentId=f2f201db-3ca2-47b0-ba81-ab6b0096abd6&mark=true&templateId=${printObjectType.consultation.templateId}&consultationid=${this.consultationId}&areaId=${this.patientMsg.AreaId}&t=${t}`;
      console.log(url);
      this.$store.commit("public/SET_PRINTIFRAMEURL", url);
    },
    //获取详情的表格数据
    getConHisDetails(id) {
      this.$Api.getConHisDetails({ InHouseId: id }).then(res => {
        if (res.Status) {
          this.tableData = res.Data;
        }
      });
    },
    //选着历史数据
    selectId(val) {
      this.hisSelectId = val.InHouseId;
      this.getConHisDetails(this.hisSelectId);
    },
    //签到
    sendSignIn() {
      console.log(this.signInData);
      let data = {
        ConsultationId: this.consultationId,
        ConsultationDetails: []
      };
      let off=false
      for (let i = 0; i < this.signInData.length; i++) {
        if (this.signInData[i].DoctorId) {
          off=true
          data.ConsultationDetails.push({
            ConsultationId: this.consultationId,
            DoctorId: this.signInData[i].DoctorId,
            ConsultationDetailId: this.signInData[i].ConsultationDetailId
          });
        }
      }
      if(!off)return this.$msg.info('未选择签到人员！')
  //  return   console.log(data);
      this.$Api.subSignIn(data).then(res => {
        this.$msg[res.Status ? "success" : "warning"](res.Message);
        if (res.Status) {
          this.getConHisDetails(this.hisSelectId);
          this.$store.commit("public/SET_ISSHOW", false);
        }
      });
    },
    //生成病历
    loadIframe(consultationId) {
      let str = "";

      let obj = {
        patientId: this.patientMsg.PatientId,
        inHospPatId: this.patientMsg.InHouseId,
        areaType: this.selectArea.DiagnosisAreaType,
        createUser: this.user.UserInfo.Id,
        consultationId: consultationId,
        // originUrl: window.location.protocol + "\\" + window.location.host,
        objectType: 14,
        // isDirectSave: true,
        t: +new Date()
        // logUserEditTrack: true
      };

      console.log(process.env.NODE_ENV !== "production");
      // 加载不显示的模板
      // obj.documentId = templateId;
      // obj.templateId = templateId;

      for (const key in obj) {
        str += `${key}=${obj[key]}&`;
      }
      str = str.substring(0, str.length - 1);
      let url = `${URLCONFIG.Emr}/Nursing/EditPage.aspx?${str}`;
      this.$store.commit("public/SET_PRINTIFRAMEURL", url);
    },
    //获取项目的数据
    getFeeByTypeCodeList() {
      this.$Api.getFeeByTypeCodeList({ typeCode: null }).then(res => {
        this.itemFeeList = res.Data || [];
      });
    },
            // 重置医嘱提交错误时的医嘱状态
    refreshOrderStatus(){
       this.$Api.refreshOrderStatus({inHospitalId:this.$route.query.id||this.patientMsg.InHouseId}).then(res=>{
       })
    },
  },
  computed: {
    ...mapGetters({
      isShow: "public/GET_ISSHOW",
      patientMsg: "public/GET_PATIENTMSG",
      user: "public/GET_USER",
      isRegister: "configuration/GET_ISREGISTER", //是否可挂号
      selectArea: "home/GET_SELECTAREA", //所在区域
      signName: "public/GET_SIGNNAME", //签名系统简称
      isSignName: "public/GET_ISSIGNNAME", //是否启用
      isGetCA: "public/GET_ISGETCA", //
      user: "public/GET_USER",
      caImgData:"public/GET_CAIMGDATA",//ca签名图片数据流，医嘱提交处使用
    })
  },
  components: {
    newCreate,
    myAlert,
    conDeatil,
    conTable,
    signIn,
    conGrade,
    feedBack
  }
};
</script>
<style scoped lang='less'>
.consultation {
  height: 100%;
  padding: 10px 20px;
  box-sizing: border-box;
  position: relative;
  .tabs-temp {
    display: flex;
    justify-content: space-between;
    /deep/.el-radio-button__inner {
      width: 98px;
      height: 32px;
      font-size: 14px;
      border-radius: 0;
    }
    .three {
      a {
        display: inline-block;
        width: 80px;
        height: 32px;
        line-height: 32px;
        border: 1px solid #ccc;
        border-radius: 2px;
        text-align: center;
        font-size: 4px;
        font-size: 14px;
        color: #333333;
        &:hover {
          background: rgba(0, 113, 231, 0.1);
          color: #0071e7;
        }
      }
    }
  }
  .new-create {
    margin-top: 20px;
  }
  .his-con {
    height: 100%;
    margin-top: 20px;
    .his-left {
      width: 120px;
      height: 100%;
      float: left;
      border-right: 1px solid #ccc;
      margin-right: 20px;
      padding: 10px;
      overflow: auto;
      .his-item {
        font-size: 12px;
        border-bottom: 1px solid #ccc;
        cursor: pointer;
        height: 40px;
        padding: 3px 4px;
      }
      .active {
        background: #0071e7;
        color: #fff;
      }
    }

    .his-right {
      overflow: hidden;
      height: 100%;
    }
  }
  .btn {
    position: absolute;
    bottom: 10px;
    right: 0px;
    left: 0;
    text-align: center;
    .save {
      background: #0071e7;
      border-radius: 2px;
      width: 98px;
      color: #fff;
      font-size: 14px;
    }
    .reset {
      background: #f3f5f9;
      width: 98px;
      border-radius: 2px;
    }
  }
}
/deep/ .btnList {
  // position: absolute;
  // bottom: 10px;
  // right: 20px;
  height: 60px;
  box-shadow: 0 -2px 7px 0 rgba(102, 136, 169, 0.16);
  .save {
    background: #0071e7;
    border-radius: 2px;
    width: 98px;
    color: #fff;
    font-size: 14px;
    float: right;
    margin-top: 15px;
  }
  .reset-list {
    background: #f3f5f9;
    width: 98px;
    border-radius: 2px;
    float: right;
    margin-top: 15px;
  }
  .sigInBtn {
    background: #0071e7;
    border-radius: 2px;
    width: 98px;
    color: #fff;
    font-size: 14px;
    margin-top: 15px;
    margin-left: 150px;
  }
}
</style>
