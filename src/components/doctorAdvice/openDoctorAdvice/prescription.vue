<template>
  <div class="prescription">
    <el-radio-group
      v-model="activeName"
      @change="getPrescriptionList('tree',$event)"
      fill="#0071E7"
    >
      <el-radio-button :label="1" v-if="patientMsg.AreaType!==3">长嘱拆方</el-radio-button>
      <el-radio-button :label="2">处方记录</el-radio-button>
    </el-radio-group>
    <!-- <transition-group
      name="el-fade-in"
      tag="div"
      :duration="{ enter: 500, leave: 200 }"
      class="prescription-warp"
    >-->
    <div class="prescription-now" v-show="activeName===1" key="1">
      <p class="title">总费用： {{cost}}元</p>
      <div class="prescription-table-warp">
        <prescriptionTable
          :tableData="tableData"
          :isSelect="true"
          @selection-change="selectPrescription"
        ></prescriptionTable>
      </div>
      <div class="bottom">
        <el-radio-group v-model="screen" @change="getPrescriptionList">
          <el-radio :label="0">全部</el-radio>
          <el-radio :label="1">未生成</el-radio>
          <el-radio :label="2">已生成</el-radio>
        </el-radio-group>
        <div v-if="patientMsg.Status!=8">
          <div
            class="prescription-button"
            @click="createdPrescription"
            v-if="userRightList.IsHasPrescriptionRight"
          >生成处方</div>
          <el-button v-else :disabled="true" style="float:right">生成处方</el-button>
        </div>
      </div>
    </div>
    <!-- </transition-group>
    <transition-group name="el-fade-in-linear">-->
    <div class="prescription-old" v-show="activeName===2" key="2">
      <div class="prescription-old-list">
        <medicalNowTree
          :callBack="handleNodeClick"
          nodeKey="PrescriptionNumber"
          ref="treeList"
          :default-expanded-keys="expandedKeys"
          :treeData="treeList"
          children="MenuContentList"
          type="prescription"
        ></medicalNowTree>
        <!-- <el-tree v-if="treeList.length" ref="treeList" :data="treeList" :props="defaultProps" accordion @node-click="handleNodeClick" node-key="PrescriptionNumber" :default-expanded-keys="expandedKeys" >
          <span class="custom-tree-node" slot-scope="{ node, data }" >{{node.label}}</span>
        </el-tree>-->
      </div>
      <div class="prescription-old-right" v-if="activePrescription.PrescriptionNumber">
        <div class="title">
          <p class="title-left">处方单号：{{activePrescription.PrescriptionNumber}}</p>
          <p class="title-left"  v-if="activePrescription.PrescriptionStatusName">
            处方状态：
            <span class="status">{{activePrescription.PrescriptionStatusName}}</span>
          </p>
          <p class="title-right">总费用： {{cost}}元</p>
        </div>
        <div class="prescription-table-warp">
          <prescriptionTable :tableData="tableData"></prescriptionTable>
          <div class="print-button" v-show="tableData.length!=0">
            <!-- <p class="count">总计：已打印1次</p> -->
            <p class="prescription-button" @click="print" v-if="activePrescription.PrescriptionStatusName!=='已作废'">打印</p>
            <p
              class="prescription-button"
              @click="specialDrugRegeist"
              v-if="currentTemplate != 'Ordinary'&&userRightList.IsHasPrescriptionRight&&activePrescription.IsInHospital"
            >领药登记信息</p>
            <el-button
              :disabled="true"
              v-if="currentTemplate != 'Ordinary'&&userRightList.IsHasPrescriptionRight==false&&activePrescription.IsInHospital"
              style="float:right;margin-right:20px"
            >领药登记信息</el-button>
            <!-- <el-button v-if="currentTemplate != 'Ordinary'&&userRightList.IsHasPrescriptionRight==false" :disabled="true" >领药登记信息</el-button> -->
          </div>
        </div>
      </div>
    </div>
    <!-- </transition-group> -->
    <slot name="close"></slot>
  </div>
</template>

<script>
import medicalNowTree from "@/components/doctorAdvice/medicalHistory/medicalNowTree.vue";
import specialDrug from "@/components/doctorAdvice/specialDrug.vue";
import prescriptionTable from "./prescriptionTable.vue";
import { mapGetters } from "vuex";
import { GetFormatDateTime } from "@/utils/public";
import { printObjectType } from "@/module/staticData.js";
import CASign from "@/utils/caSign.js";

export default {
  name: "prescription", //处方记录
  components: {
    prescriptionTable,
    medicalNowTree,
    specialDrug
  },
  props: {
    showSpecialDrugDialog: Function // 特殊药品领药登记弹窗
  },
  data() {
    this.printUrlCommon = "/webroot/decision/view/report";
    return {
      expandedKeys: [], //tree默认展开的项
      activePrescription: {}, //当前处方基本信息
      tableData: [],
      selectArr: [], //选中的处方
      treeList: [],

      activeName: 1,
      screen: 1, //处方显示条件
      currentTemplate: "", // 打印处方模板
      timer: null,
      caSignOperation: {}, //
      currentObjData: ""
    };
  },
  computed: {
    ...mapGetters({
      patientMsg: "public/GET_PATIENTMSG",
      userRightList: "public/GET_USERRIGHTLIST",
      signName: "public/GET_SIGNNAME", //签名系统简称
      isSignName: "public/GET_ISSIGNNAME", //是否启用
      isGetCA: "public/GET_ISGETCA", //
      user: "public/GET_USER"
    }),
    // 费用
    cost() {
      let num = 0;
      let data = this.activeName == 1 ? this.selectArr : this.tableData;
      data.forEach(el => {
        el.prescriptionDetailListInfo.forEach(item => {
          if(!item.IsSelfProvided){
          num += item.TotalAmount;
          }
        });
      });
      return num.toFixed(2);
    }
  },
  created() {
    this.activeName=this.patientMsg.AreaType===3?2:1
    this.getPrescriptionList(this.patientMsg.AreaType===3?'tree':'');
    //  this.getTreeData()
    if (this.isSignName) {
      this.caSignOperation = new CASign(this, this.signName);
    }
  },
  beforeDestroy() {
    clearTimeout(this.timer)
    clearTimeout(this.mytimer)
  },
  watch: {
    isGetCA: function(val) {
      if (val) {
        // 验证
        this.caSignOperation.checkData(this.user.UserInfo, this.currentObjData);
      }
    }
  },
  methods: {
    // 特殊药品领药登记
    specialDrugRegeist() {
      let params = {
        OrderIds: [this.tableData[0].MainOrderId],
        PrescriptionNumber: this.activePrescription.PrescriptionNumber
      };
      this.showSpecialDrugDialog(params, false);
    },
    // 打印历史处方
    print() {
      if (this.currentTemplate == "Ordinary") {
        // 普通药品打印
        clearTimeout(this.timer);
        let t = new Date().getTime();
        let str = window.location.protocol + "\\" + window.location.host;
        let url = `${URLCONFIG.Emr}/Nursing/EditPage.aspx?patientId=${this.patientMsg.PatientId}&inHouseId=${this.patientMsg.InHouseId}&areaType=${this.patientMsg.AreaType}&createUser=940c7df7-a718-e911-80cd-0050568e1b08&originUrl=${str}&objectType=${printObjectType.prescription.objectType}&logUserEditTrack=true&documentId=f2f201db-3ca2-47b0-ba81-ab6b0096abd6&mark=true&templateId=${printObjectType.prescription.templateId}&hisorderid=${this.activePrescription.PrescriptionNumber}&areaId=${this.patientMsg.AreaId}&t=${t}`;
        console.log(url);
        this.$store.commit("public/SET_PRINTIFRAMEURL", url);
      } else {
        // 特殊药品
        // 医嘱id
        let orderIdList = [];
        this.tableData.forEach(item => {
          orderIdList.push(item.MainOrderId);
        });
        this.printSpecial(
          printObjectType[this.currentTemplate].objectType,
          printObjectType[this.currentTemplate].templateId,
          orderIdList.join(",")
        );
      }
    },
    printSpecial(objectType, templateId, orderIds) {
      clearTimeout(this.timer);
      let t = new Date().getTime();
      let str = window.location.protocol + "\\" + window.location.host;
      let url = `${URLCONFIG.Emr}/Nursing/EditPage.aspx?patientId=${this.patientMsg.PatientId}&inHouseId=${this.patientMsg.InHouseId}&areaType=${this.patientMsg.AreaType}&createUser=940c7df7-a718-e911-80cd-0050568e1b08&originUrl=${str}&objectType=${objectType}&logUserEditTrack=true&documentId=f2f201db-3ca2-47b0-ba81-ab6b0096abd6&mark=true&templateId=${templateId}&hisorderid=${this.activePrescription.PrescriptionNumber}&RegisterId=${this.tableData[0].RegisterId}&t=${t}`;
      console.log(url);
      this.$store.commit("public/SET_PRINTIFRAMEURL", url);
    },
    // 生成处方
    createdPrescription() {
      if (!this.selectArr.length) return this.$msg.info("未选中处方，请选择！");
      let isCreate=this.isCreate
      this.isCreate=JSON.stringify(this.selectArr)
    this.mytimer =  setTimeout(() => {
        this.isCreate=''
      }, 2500);
      // 避免反复提交
      if(isCreate===this.isCreate)return
      if (this.isSignName) {
        let obj = {
          Type: "0",
          Data: [{ Name: "生成处方" }],
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
      let MainOrderId = [];
      console.log(this.selectArr);
      this.selectArr.forEach(el => {
        MainOrderId.push(el.MainOrderId);
      });
      this.$Api
        .createdPrescription({
          InHouseId: this.patientMsg.InHouseId,
          MainOrderId
        })
        .then(res => {
          this.isCreate=''
          this.$msg[res.Status ? "success" : "warning"](res.Message);
          console.log(res, "生成处方返回");
          if (res.Status) {
            this.getPrescriptionList();
            let ordinaryStr = "";
            let objectTypes = ''
            let templateIds = ''
            res.Data.PrescriptionInfo.forEach(item => {
              if (item.TemplateName == "Ordinary") {
                // 普通处方
                ordinaryStr += item.PrescriptionMasterNo + ",";
                objectTypes+=printObjectType['prescription'].objectType+","
                templateIds+=printObjectType['prescription'].templateId+","
              }
            });
            if (ordinaryStr != "") {
              let t = new Date().getTime();
              window.addEventListener("message", this.load, false);
              // let str = window.location.protocol + "\\" + window.location.host;
              let url = `${URLCONFIG.Emr}/Nursing/EditPage.aspx?patientId=${
                this.patientMsg.PatientId
              }&inHouseId=${this.patientMsg.InHouseId}&areaType=${
                this.patientMsg.AreaType
              }&createUser=940c7df7-a718-e911-80cd-0050568e1b08&objectType=${
                printObjectType.specialDrugBatch.objectType
              }&logUserEditTrack=true&documentId=f2f201db-3ca2-47b0-ba81-ab6b0096abd6&mark=true&templateId=C16DA3C4-D502-4082-AEC8-AB7C00F17C78&ObjectTypes=${objectTypes.slice(
                0,
                objectTypes.length - 1
              )}&TemplateIds=${templateIds.slice(
                0,
                templateIds.length - 1
              )}&ids=${ordinaryStr.slice(0,ordinaryStr.length-1)}&ismult=true&areaId=${this.patientMsg.AreaId}&t=${t}`;
              console.log(url);
              this.$store.commit("public/SET_PRINTIFRAMEURL", url);
            }
            // 特殊药品登记弹窗
            if (res.Data.IsHasSpecial) {
              let arr = res.Data.PrescriptionInfo
              let str = ''
              arr.forEach(item => {
                str+=item.PrescriptionMasterNo+','
              })
              let params = {
                PrescriptionNumber: str==''?'':str.slice(0,str.length-1),
                OrderIds: MainOrderId
              };
              this.showSpecialDrugDialog(params);
            }
          }
        });
    },
    // 获取历史处方列表
    getTreeData() {
      this.$Api
        .getPrescriptiontree({ patientId: this.patientMsg.PatientId })
        .then(res => {
          if (res.Status) {
            console.log(this.activePrescription);
            let data = res.Data || [];
            // data.forEach(el=>el.PrescriptionNumber=el.InHouseId)
            this.treeList = data;

            if (!this.activePrescription.PrescriptionNumber && data.length) {
              // this.expandedKeys = [data[0].PrescriptionNumber];
              // this.activePrescription = data[0].MenuContentList[0];
              console.log(this.expandedKeys, this.activePrescription);
              this.$nextTick(() => {
                this.$refs.treeList.currentChange(
                  data[0].MenuContentList[0],
                  data[0].PrescriptionNumber
                );
              });
            } else if (this.activePrescription.PrescriptionNumber) {
              this.getPrescriptionList("history");
            }
          } else {
            this.$msg.warning(res.Message);
          }
        });
    },
    // 点击树形节点
    handleNodeClick(data, type, parentId) {
      console.log(data, type, parentId);
      this.activePrescription = data;
      this.activePrescription.patientId = parentId;
      this.expandedKeys = [parentId];
      this.getPrescriptionList("history");
    },
    // 选中的处方
    selectPrescription(selection) {
      this.selectArr = selection;
    },
    // 获取处方列表
    getPrescriptionList(type, activeName = this.activeName) {
      console.log(type, this.activeName, "type");
      let data = {
        PrescriptionDataStatus: this.screen,
        PrescriptionDateType: this.activeName,
        InHouseId: this.$route.query.id
      };
      if (this.activeName === 2) {
        // type==='tree'&&this.getTreeData();
        if (type === "tree") {
          return this.getTreeData();
        } else if (type === "history") {
          data.PrescriptionNumber = this.activePrescription.PrescriptionNumber;
        }
      }
      this.$Api.getPrescriptionList(data).then(res => {
        if (res.Status) {
          this.selectArr = [];

          this.tableData = res.Data.prescriptionListInfoModel || [];
          this.currentTemplate = res.Data.TemplateName;
        } else {
          this.$msg.warning(res.Message);
        }
      });
    }
  }
};
</script>
<style scoped lang='less'>
.prescription {
  width: 100%;
  height: 100%;
  background: #ffffff;

  box-sizing: border-box;
  position: relative;
  padding-top: 10px;
  .prescription-warp {
    overflow: hidden;
  }
  .close {
    position: absolute;
    right: 15px;
    top: 5px;
    font-size: 30px;
    cursor: pointer;
    color: @blueMain;
  }
  > .el-radio-group {
    padding-left: 19px;
    /deep/ .el-radio-button__inner {
      padding: 0;
      text-align: center;
      line-height: 32px;
      width: 98px;
      height: 32px;
      display: inline-block;
    }
  }
  .prescription-button {
    float: right;
    width: 90px;
    height: 30px;
    right: 10px;
    background: #ffffff;
    border: 1px solid #0071e7;
    border-radius: 3px;
    font-size: 14px;
    color: #0071e7;
    cursor: pointer;
    text-align: center;
    line-height: 32px;
    margin-right: 40px;
  }
  .prescription-table-warp {
    width: 100%;
    height: calc(100vh - 208px);
    overflow-y: auto;
    box-sizing: border-box;
    // padding: 0 19px;
  }
  &-now {
    .title {
      height: 48px;
      line-height: 48px;
      text-align: right;
      font-size: 15px;
      padding-right: 19px;
    }
    .prescription-table-warp {
      padding: 0 19px;
    }
    .bottom {
      height: 48px;
      box-sizing: border-box;
      padding: 8px;
      padding-right: 50px;
      //border: 1px solid rgba(47, 51, 68, 0.4);
      box-shadow: 0 -2px 2px #f2f2f2;
      .el-radio-group {
        float: left;
        .el-radio {
          height: 32px;
          line-height: 32px;
        }
        // height: 32px;
      }
    }
  }
  &-old {
    width: 100%;
    height: calc(100vh - 120px);
    box-sizing: border-box;
    padding-top: 25px;
    overflow: hidden;
    &-list {
      float: left;
      width: 270px;
      padding: 0 15px 20px 19px;
      height: 100%;
      box-sizing: border-box;
      border-right: 1px solid rgba(47, 51, 68, 0.4);
      .medical-now-tree {
        height: calc(100vh - 165px);
        overflow: auto;
      }
    }
    &-right {
      overflow: hidden;
      box-sizing: border-box;
      padding: 0 19px;
      height: 100%;
      .title {
        height: 24px;
        font-size: 15px;
        line-height: 24px;
        padding-bottom: 20px;
        &-left {
          float: left;
          margin-right: 40px;
          .status {
            color: #ffffff;
            background: #0071e7;
            padding: 0 20px;
            border-radius: 10px;
          }
        }
        &-right {
          float: right;
        }
      }
      .prescription-table-warp {
        height: calc(100vh - 181px);
      }
      .print-button {
        margin-top: 20px;
        height: 48px;
        padding: 8px 0;
        box-sizing: border-box;
        .count {
          float: left;
          line-height: 32px;
          color: rgba(47, 51, 68, 0.4);
        }
      }
    }
  }
}
</style>
