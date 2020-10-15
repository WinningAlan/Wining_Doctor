<template>
  <div class="shiftDuty">
    <div class="shiftDutyLeft" id="content">
      <div class="shiftDutyHead">
        <el-radio-group v-model="activeName" fill="#0071e7" @change="changeTab">
          <el-radio-button
            :label="item.Value"
            v-for="(item,index) in tabList"
            :key="index"
          >{{item.Text}}</el-radio-button>
        </el-radio-group>
      </div>
      <div class="shiftDutyContent">
        <shift-duty-table
          v-if="activeName=='1'||activeName=='2'"
          :tableData="tableData"
          :selectStatusList.sync="selectStatusList"
          :selectAreaList.sync="selectAreaList"
          :selectGraveList.sync="selectGraveList"
          :selectNewList.sync="selectNewList"
          :selectOperationList.sync="selectOperationList"
          :selectHandoverDoctorList.sync="selectHandoverDoctorList"
          :activeName="activeName"
          :handoverDoctorList.sync="handoverDoctorList"
          @selection-change="handleSelectionChange"
        >
          <div slot="operation" slot-scope="{row}" class="tableOperationWord">
            <div v-if="activeName=='1'">
              <el-button
                type="text"
                @click="editShiftDuty(row)"
                :disabled="row.HandoverShiftStatus==3"
              >编辑</el-button>
              <el-button type="text" :disabled="row.HandoverShiftStatus!=3" @click="cancel(row)">撤销</el-button>
            </div>
            <div v-else>
              <el-button
                type="text"
                @click="editShiftDuty(row)"
                :disabled="row.HandoverShiftStatus==5"
              >编辑</el-button>
              <el-button type="text" :disabled="row.HandoverShiftStatus!=5" @click="cancel(row)">撤销</el-button>
            </div>
          </div>
        </shift-duty-table>
        <morning-shift-duty
          v-else-if="activeName=='3'"
          :editPatientList="editPatientList"
          :activeName="activeName"
          :morningContent="morningContent"
          :getMorningShiftContent="getMorningShiftContent"
        ></morning-shift-duty>
        <shift-duty-query
          v-else-if="activeName=='4'"
          :handoverDoctorList="handoverDoctorList"
          :getHandoverDoctorList="getHandoverDoctorList"
        >
          <div slot="operation" slot-scope="{row,selectTab}" class="tableOperationWord">
            <el-button type="text" @click="getRowDetail(row,selectTab)">查看</el-button>
          </div>
        </shift-duty-query>
        <div class="shiftDutyContentHead" v-show="btnName!=''" @click="shiftDutyClick">
          <el-button type="primary">{{btnName}}</el-button>
        </div>
      </div>
    </div>
    <span
      class="unfoldOrFold"
      @click="unfoldOrFold"
      v-if="activeName=='1'||activeName=='3'"
      :class="{left65:isFold}"
    >
      <svg-icon :iconClass="isFold?'fewer':'expanded'" class="icon"></svg-icon>
    </span>
    <div
      class="shiftDutyRight"
      id="patList"
      v-if="activeName=='1'||activeName=='3'"
      v-show="isFold==false"
    >
      <patient-list
        :activeName="activeName"
        :editPatientList="editPatientList"
        :unfoldOrFold="unfoldOrFold"
      ></patient-list>
    </div>
    <my-alter
      :title="dialogData.title||''"
      :visible="dialogData.visible||false"
      :isfooter="ifHasFoot"
      :width="dialogData.width"
      :callback="closeDialog"
      :btn="btns"
    >
      <component
        v-if="dialogData.visible"
        :is="dialogData.component||''"
        ref="content"
        :closeDialog="closeDialog"
        :item="dialogData.data"
        :activeName="activeName"
        :initialize="dialogData.visible"
        :editPatientList="editPatientList"
        :morningContent="morningContent"
        :tableData="tableData"
      ></component>
    </my-alter>
  </div>
</template>
<script>
import shiftDutyTable from "@/components/shiftDuty/shiftDutyTable";
import morningShiftDuty from "@/components/shiftDuty/morningShiftDuty";
import shiftDutyQuery from "@/components/shiftDuty/shiftDutyQuery";
import patientList from "@/components/shiftDuty/patientList";
import myAlter from "@/components/common/myAlter";
import editShiftDuty from "@/components/shiftDuty/editShiftDuty";
import pwVerification from "@/components/shiftDuty/pwVerification";
import { mapGetters } from "vuex";
import CASign from "@/utils/caSign.js";
export default {
  components: {
    shiftDutyTable,
    morningShiftDuty,
    shiftDutyQuery,
    patientList,
    myAlter,
    editShiftDuty,
    pwVerification
  },
  data() {
    return {
      tabList: [
        { Text: "医生交班", Value: "1" },
        { Text: "医生接班", Value: "2" },
        { Text: "晨班交接", Value: "3" },
        { Text: "交班查询", Value: "4" }
      ],
      isFold: false,
      activeName: "1",
      btnName: "交班", //交接班
      tableData: [], //交接班表格数据
      selectStatusList: [1, 3, 5], //状态筛选列表
      selectAreaList: [1, 2], //区域筛选列表
      selectHandoverDoctorList: [], //交班医生筛选列表
      selectGraveList: [1, 2], //危重筛选列表
      selectNewList: [1, 2], //新入筛选列表
      selectOperationList: [1, 2], //手术筛选列表
      tableDataAll: [], //所有数据
      selectPats: [], //交班接班患者列表
      editPatientList: [], //晨班报告需要编辑的患者列表
      morningContent: {}, //晨交班相关信息
      handoverDoctorList: [], // 已经交班患者列表
      btns: [], //弹窗按钮
      ifHasFoot: true, //是否有
      caSignOperation: {}, //
      currentObjData: "",
      submitDataObj: null, //提交数据
      pw:'',
      operationType:'submit',//submit交接班，cancel撤销
      currentRow:null,
    };
  },
  mounted() {
    let dom = document.getElementById("content");
    console.log(dom.offsetWidth, "元素实际宽度");
    console.log(document.body.clientWidth, "网页整体宽度");
    this.getHandoverPatList();
    if (this.isSignName) {
      this.caSignOperation = new CASign(this, this.signName);
    }
  },
  methods: {
    getHandoverDoctorList(value = 1) {
      let params = {
        listType: value
      };
      this.$Api.getHandoverDoctorList(params).then(res => {
        if (res.Status) {
          this.handoverDoctorList = res.Data;
        } else {
          this.handoverDoctorList = [];
          this.$msg.warning(res.Message);
        }
      });
    },
    getMorningShiftContent(value) {
      if (value == undefined) {
        value = 0;
      }
      let params = {
        handDoctorId: this.user.UserInfo.Id,
        areaType: value
      };
      this.$Api.getMorningShiftContent(params).then(res => {
        if (res.Status) {
          this.editPatientList = JSON.parse(res.Data.PatientRemark);
          if (this.editPatientList == null) {
            this.editPatientList = [];
          }
          console.log(this.editPatientList);
          this.morningContent = res.Data;
        }
      });
    },
    async getRowDetail(row, selectTab) {
      console.log("查看行数据的详细信息");
      let obj = {};
      if (selectTab == "1") {
        //this.btns = []
        this.ifHasFoot = false;
        let params = {
          "query.EndTime": row.HandoverTime,
          "query.handoverDoctorId": row.HandoverDoctorId,
          "query.nursingScheduleId": row.NursingScheduleId,
          "query.pageIndex": 1,
          "query.pageSize": 999999
        };
        let res = await this.$Api.getHandoverShiftDetail(params);
        if (res.Status) {
          this.tableData = res.Data;
          obj = {
            title: "患者交接详情",
            width: "1166px",
            data: res.Data,
            visible: true,
            component: "shiftDutyTable"
          };
          this.$store.commit("public/SET_DIALOGDATA", obj);
        }
      } else {
        // 晨班交接弹窗
        let params = {
          morningShiftRecordId: row.Id
        };
        let res = await this.$Api.getMorningShiftDetail(params);
        if (res.Status) {
          this.editPatientList = JSON.parse(res.Data.PatientRemark);
          if (this.editPatientList == null) {
            this.editPatientList = [];
          }
          this.morningContent = res.Data;
          this.ifHasFoot = true;
          this.btns = ["打印"];
          obj = {
            title: "晨班交接详情",
            width: "1024px",
            data: res.Data,
            visible: true,
            component: "morningShiftDuty"
          };
          this.$store.commit("public/SET_DIALOGDATA", obj);
        }
      }
    },
    // 撤销
    cancel(row) {
      this.$confirm("确定要撤销当前状态吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.operationType = 'cancel'
          this.currentRow = row
         if(this.isSignName) {
           let obj =  { Type: "0", Data: [{Name:'撤销交班/接班'}], No: this.user.UserInfo.No, 
UserName: this.user.UserInfo.Name };
        this.currentObjData = obj
        this.caSignOperation.KeyVerify()
         }else{
           this.handleOperation()
         }
        })
        .catch(() => {
          this.$msg.info("已取消撤销操作");
        });
    },
    // 交班或接班
    shiftDutyClick() {
      if (this.selectPats.length == 0) {
        this.$msg.warning("请选择要操作的患者");
        return;
      }
      this.$store.commit("shiftduty/SET_PW", "");
      let obj = {
        visible: true,
        width: "540px",
        component: "pwVerification",
        activeName: this.activeName
      };
      if (this.activeName == "1") {
        // 交班
        obj.title = "交班";
        obj.data = {};
      } else if (this.activeName == "2") {
        // 接班
        obj.title = "接班";
        obj.data = {};
      }
      this.$store.commit("public/SET_DIALOGDATA", obj);
    },
    unfoldOrFold() {
      let dom = document.getElementById("patList");
      let domContent = document.getElementById("content");
      if (this.isFold) {
        dom.style.width = 285 + "px";
        dom.style.display = "block";
        // domContent.style.width = 800 + "px"; //不知道为什么必须设置才有效
        console.log(dom, "dom宽度");
      } else {
        dom.style.width = 0;
        dom.style.display = "none";
      }
      this.isFold = !this.isFold;
      console.log(dom);
    },
    changeTab(value) {
      this.ifHasFoot = true;
      this.btns = [];
      this.tableDataAll = [];
      this.tableData = [];
      if (value == "1") {
        this.btnName = "交班";
        this.getHandoverPatList();
      } else if (value == "2") {
        this.btnName = "接班";
        // this.getTakeoverPatList();
        this.getHandoverDoctorList();
      } else if (value == "3") {
        this.btnName = "";
        this.getMorningShiftContent();
      } else {
        this.btnName = "";
      }
    },
    getHandoverPatList() {
      let params = {
        "query.doctorId": this.user.UserInfo.Id,
        "query.pageIndex": 1,
        "query.pageSize": 99999999
      };
      this.$Api.getHandoverPatList(params).then(res => {
        if (res.Status) {
          this.tableData = res.Data;
          this.tableDataAll = res.Data;
        } else {
          this.tableData = [];
          this.tableDataAll = [];
        }
      });
    },
    getTakeoverPatList() {
      console.log("接班");
      let params = {
        HandOverDoctorIds: this.selectHandoverDoctorList
      };
      this.$Api.getTakeoverPatList(params).then(res => {
        if (res.Status) {
          this.tableData = res.Data;
          this.tableDataAll = res.Data;
          this.tableDataFilter();
        } else {
          this.tableData = [];
          this.tableDataAll = [];
        }
      });
    },
    // 编辑
    editShiftDuty(row) {
      let obj = {
        visible: true,
        width: "1166px",
        data: row,
        activeName: this.activeName
      };
      if (this.activeName == "1") {
        // 交班
        obj.title = "交班内容编辑";
        obj.component = "editShiftDuty";
      } else if (this.activeName == "2") {
        // 接班
        obj.title = "接班内容编辑";
        obj.component = "editShiftDuty";
      }
      this.$store.commit("public/SET_DIALOGDATA", obj);
    },
    // 关闭弹窗
    async closeDialog(value) {
      if (value) {
        ////
        let res = await this.$refs.content.save();
        if (res == 1) {
          return;
        }
        if (res) {
          this.operationType = 'submit'
          this.submitDataObj = res;
          this.$store.commit('shiftduty/SET_PW',res.Pwd)
          this.pw = res.Pwd
          console.log(this.pw,'mmmmmmmm',res.Pwd)
          if (this.isSignName) {
            let obj = {
              Type: "0",
              Data: [{ Name: "交班/接班" }],
              No: this.user.UserInfo.No,
              UserName: this.user.UserInfo.Name
            };
            this.currentObjData = obj;
            this.caSignOperation.KeyVerify();
          } else {
            this.handleOperation();
          }
        } else {
          if (this.activeName == "1") {
            this.getHandoverPatList();
          } else if (this.activeName == "2") {
            this.getTakeoverPatList();
          }
        }
      }
      this.$store.commit("public/SET_DIALOGDATA", {
        ...this.dialogData,
        visible: false
      });
    },
    async handleOperation() {
      if(this.operationType=='submit') {
        if (this.activeName == "1") {
        // 交班
        let arr = [];
        this.selectPats.forEach(item => {
          arr.push(item.InHospitalId);
        });
        let params = this.submitDataObj;
        params.InHospitalIds = arr;
        params.isCA=this.isSignName==0?false:true
        console.log("交班");
        this.$Api.handoverPatList(params).then(res => {
          this.$msg[res.Status ? "success" : "warning"](res.Message);
          if (res.Status) {
            this.getHandoverPatList();
            this.$refs.patlist.changeSelect();
          }
        });
      } else if (this.activeName == "2") {
        // 接班
        let arr = [];
        this.selectPats.forEach(item => {
          arr.push(item.Id);
        });
        let params = this.submitDataObj;
        params.isCA=this.isSignName==0?false:true
        params.HandoverShiftId = arr;
        this.$Api.takeoverPatList(params).then(res => {
          this.$msg[res.Status ? "success" : "warning"](res.Message);
          if (res.Status) {
            this.getTakeoverPatList();
          }
        });
      }
      this.$store.commit("public/SET_DIALOGDATA", {
        ...this.dialogData,
        visible: false
      });
      }else{
        // 撤销
         let params = {
            handoverShiftId: this.currentRow.Id
          };
          if (this.activeName == "1") {
            // 交班
            this.$Api.cancelHandover(params).then(res => {
              this.$msg[res.Status ? "success" : "warning"](res.Message);
              if (res.Status) {
                this.getHandoverPatList();
                // 刷新右侧患者列表
                this.$refs.patlist.changeSelect();
              }
            });
          } else if (this.activeName == "2") {
            //  接班
            this.$Api.cancelTakeover(params).then(res => {
              this.$msg[res.Status ? "success" : "warning"](res.Message);
              if (res.Status) {
                this.getTakeoverPatList();
              }
            });
          }
      }
      
    },
    // 条件筛选
    conditionFilter(value, arrSource, prop) {
      let arrTarget = [];
      if (value.length == 2) {
        arrTarget = arrSource;
      } else if (value.length == 0) {
        arrTarget = [];
      } else if (value.length == 1) {
        let bl = value.includes(1);
        if (bl) {
          arrTarget = arrSource.filter(item => {
            return item[prop] == true;
          });
        } else {
          arrTarget = arrSource.filter(item => {
            return item[prop] == false;
          });
        }
      }
      return arrTarget;
    },
    tableDataFilter() {
      console.log(
        this.tableDataAll,
        this.selectAreaList,
        this.selectStatusList
      );
      let arr = this.tableDataAll.filter(item => {
        return (
          this.selectStatusList.includes(item.HandoverShiftStatus) &&
          this.selectAreaList.includes(item.AreaType)
        );
      });
      console.log(arr, "区域和状态");
      let arr1 = this.conditionFilter(this.selectGraveList, arr, "IsDangerous");
      let arr2 = this.conditionFilter(this.selectNewList, arr1, "IsNew");
      let arr3 = this.conditionFilter(
        this.selectOperationList,
        arr2,
        "IsOperation"
      );
      this.tableData = arr3;
    },
    // 复选框
    handleSelectionChange(value) {
      this.selectPats = value;
    }
  },
  watch: {
    selectStatusList: function(newValue) {
      this.tableDataFilter();
    },
    selectAreaList: function(newValue) {
      this.tableDataFilter();
    },
    selectGraveList: function(newValue) {
      this.tableDataFilter();
    },
    selectNewList: function(newValue) {
      this.tableDataFilter();
    },
    selectOperationList: function(newValue) {
      this.tableDataFilter();
    },
    selectHandoverDoctorList: function(newValue) {
      if (this.activeName != 2) {
        return;
      }
      console.log(newValue, "选中医生");
      this.getTakeoverPatList();
    },
    isGetCA: function(val) {
      if (val) {
        console.log(this.pw, "ffffff参数", this.currentObjData);
        if(this.activeName!=3) {
          this.caSignOperation.CALoginVerify(this.pw, this.currentObjData);
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      dialogData: "public/GET_DIALOGDATA",
      signName: "public/GET_SIGNNAME", //签名系统简称
      isSignName: "public/GET_ISSIGNNAME", //是否启用
      isGetCA: "public/GET_ISGETCA", //
      user: "public/GET_USER",
      // pw: "shiftduty/GET_PW"
    })
  }
};
</script>
<style lang="less" scoped>
.shiftDuty {
  border-top: 10px solid #dfe7f5;
  display: flex;
  width: 100%;
  box-sizing: border-box;
  .shiftDutyLeft {
    flex: 1;
    min-width: 1011px;
    box-sizing: border-box;
    height: 100%;
    border-right: 10px solid #dfe7f5;
    border-left: 10px solid #dfe7f5;
  }
  .tableOperationWord {
    font-size: 14px;
  }
  // 展开折叠
  .unfoldOrFold {
    width: 11px;
    height: 28px;
    line-height: 28px;
    box-shadow: 1px 1px 3px 2px rgba(153, 183, 255, 0.6);
    color: #666;
    text-align: center;
    position: absolute;
    top: 50%;
    margin-top: -14px;
    cursor: pointer;
    background: #fff;
    //transition: all 0.3s cubic-bezier(0.65, 0.05, 0.36, 1);

    right: 285px;
    &.left65 {
      right: 0px;
    }
    .icon {
      width: 11px;
      height: 11px;
      color: #666;
    }
  }
  .shiftDutyRight {
    float: right;
    width: 285px;
    //border: 1px solid #0071e7;
    height: 100%;
    .patList {
      height: 100%;
    }
  }
  .shiftDutyHead {
    padding: 0px 25px;
    margin-top: 10px;
    margin-bottom: 10px;
    /deep/.el-radio-button--small .el-radio-button__inner {
      font-size: 14px;
      border-radius: 0;
    }
  }
  .shiftDutyContent {
    padding: 0px 25px;
    height: calc(~"(100% - 55px)");
    box-sizing: border-box;
    width: 100%;
    .shiftDutyContentHead {
      text-align: right;
      padding-top: 4px;
    }
    .flodBtn {
      display: inline-block;
    }
  }
}
</style>
<style>
.el-select .el-input__inner,
.el-input--small .el-input__inner,
.el-range-editor--small.el-input__inner {
  background: #f2f2f2;
  border: none;
}
/* .el-dialog__body{
  height: 618px;
  overflow: auto;
} */
</style>
