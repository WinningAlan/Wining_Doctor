<template>
  <div class="operation-warp">
    <div class="tabs-temp">
      <el-radio-group v-model="nowTemp" @change="tapsExamine" fill="#0071e7">
        <el-radio-button
          :label="item.Value"
          v-for="(item,index) in tabsTemp"
          v-if="item.Show"
          :key="index"
        >{{item.Text}}</el-radio-button>
      </el-radio-group>
    </div>
    <div class="newOperation" v-show="nowTemp=='newOperation'">
      <newOperation :commonObj="commonObj" v-if="isReset" :isBorder="false">
        <template slot-scope="{submitForm}">
          <div class="btn">
            <el-button @click="reset" class="reset">取消</el-button>
            <el-button type="primary" @click="save(submitForm)" class="save">保存</el-button>
          </div>
        </template>
      </newOperation>
    </div>
    <div class="historyOperation" v-show="nowTemp=='historyOperation'">
      <div class="history-left">
        <history-list :historyListData="historyListData" ref="historyList" :callback="historyItem"></history-list>
      </div>
      <operation-table :tableData="tableData" :callback="selectRow">
        <template slot-scope="{scope}" slot="dd">
          <div class="dd-box">
            <el-tooltip effect="dark" content="引用" placement="top-start" >
              <svg-icon
                iconClass="quote"
                class="styleIcon"
                @click.stop="showTable(scope.row)"
                v-if="patientMsg.Status !=8"
              ></svg-icon>
            </el-tooltip>
            <el-tooltip effect="dark" content="打印" placement="top-start" v-if="scope.row.Status!==1&&scope.row.Status!==7">
              <svg-icon iconClass="printlist" class="styleIcon" @click.stop="print(scope.row)"></svg-icon>
            </el-tooltip>
            <!-- <el-tooltip effect="dark" content="查看报告" placement="top-start">
              <svg-icon
                iconClass="viewreport"
                class="styleIcon"
                @click.stop="lookReport(scope.row)"
              ></svg-icon>
            </el-tooltip>-->
          </div>
        </template>
      </operation-table>
    </div>
    <my-alter :visible="isShow" title="手术申请单详请" :callback="alterCallback" :isfooter="false">
      <component :is="'operationDeatil'" :commonObj="commonObj"></component>
      <!-- <templatename="footer"></template> -->
      <div class="btnList" v-if="isFooter && patientMsg.Status !=8">
        <el-button class="save" @click="submitData">提交</el-button>
        <el-button class="reset-list" @click="upData">修改</el-button>
      </div>
    </my-alter>
  </div>
</template>
<script>
import newOperation from "../../components/doctorAdvice/operation/newOperation";
import { mapGetters } from "vuex";
import operationDeatil from "../../components/doctorAdvice/operation/operationDeatil";
import operationTable from "../../components/doctorAdvice/operation/operationTable";
import historyList from "../../components/doctorAdvice/requestCommon/historyList";
import { GetFormatDateTime } from "@/utils/public";
import myAlter from "@/components/common/myAlter";
import {printObjectType} from '@/module/staticData.js'
import CASign from '@/utils/caSign.js'
export default {
  data() {
    return {
      operationId: "", //手术申请单id
      orderId:'',//医嘱ID
      isReset: true, //清空数据
      tableData: [],
      commonObj: {},
      nowTemp: "newOperation",
      tabsTemp: [
        {
          Text: "新建手术",
          Value: "newOperation",
          Show: true
        },
        {
          Text: "手术记录",
          Value: "historyOperation",
          Show: true
        }
      ],
      historyListData: [], //历史数据的列表
      isFooter: true,
      timer:null,
      caSignOperation:{},//
      currentObjData:''
    };
  },
  components: {
    newOperation,
    operationDeatil,
    operationTable,
    historyList,
    myAlter
  },
  watch: {
    "patientMsg.Status": {
      handler(val) {
        if (val === 8) {
          this.tabsTemp[0].Show = false;
          this.nowTemp = "historyOperation";
          this.$Api
            .getHistoryOperation({ patientId: this.patientMsg.PatientId })
            .then(res => {
              if (res.Status) {
                this.historyListData = res.Data || [];
                this.$nextTick(() => {
                  if (this.historyListData.length > 0) {
                    this.$refs.historyList.selectId = this.historyListData[0].InHospitalId;
                    this.historyListData[0].InHospitalId &&
                      this.getHistoryDetail(
                        this.historyListData[0].InHospitalId
                      );
                  }
                });
              }
            });
        } else {
          this.tabsTemp[0].Show = true;
          this.nowTemp = "newOperation";
        }
      },
      deep: true,
      immediate: true
    },
    isGetCA: function(val) {
      if (val) {
        // 验证
        if(this.currentObjData.Data&&this.currentObjData.Data[0].Name=='手术申请') {
          this.caSignOperation.checkData(this.user.UserInfo, this.currentObjData);
        }
      }
    },
  },
  created() {
    if(this.isSignName) {
      this.caSignOperation = new CASign(this,this.signName)
    }
  },
  computed: {
    ...mapGetters({
      patientMsg: "public/GET_PATIENTMSG",
      // selectArea: "home/GET_SELECTAREA" //所在区域
      isShow: "public/GET_ISSHOW",
      isRegister: "configuration/GET_ISREGISTER", //是否可挂号
      signName: "public/GET_SIGNNAME", //签名系统简称
      isSignName: "public/GET_ISSIGNNAME", //是否启用
      isGetCA: "public/GET_ISGETCA", //
      user: "public/GET_USER",
      caImgData:"public/GET_CAIMGDATA",//ca签名图片数据流，医嘱提交处使用
    })
  },
  methods: {
    // 打印手术申请单
    print(row) {
      clearTimeout(this.timer);
      let t = new Date().getTime()
      let str = window.location.protocol + "\\" + window.location.host;
      let url = `${URLCONFIG.Emr}/Nursing/EditPage.aspx?patientId=${this.patientMsg.PatientId}&inHouseId=${this.patientMsg.InHouseId}&areaType=${this.patientMsg.AreaType}&createUser=940c7df7-a718-e911-80cd-0050568e1b08&originUrl=${str}&objectType=${printObjectType.operation.objectType}&logUserEditTrack=true&documentId=f2f201db-3ca2-47b0-ba81-ab6b0096abd6&mark=true&templateId=${printObjectType.operation.templateId}&operationid=${row.FormId}&areaId=${this.patientMsg.AreaId}&t=${t}`;
      console.log(url);
      this.$store.commit("public/SET_PRINTIFRAMEURL", url);
    },
    //却换新建和历史的操作
    tapsExamine(val) {
      console.log(val);
      if (val === "historyOperation") {
        this.$Api
          .getHistoryOperation({ patientId: this.patientMsg.PatientId })
          .then(res => {
            if (res.Status) {
              this.historyListData = res.Data || [];
              this.$nextTick(() => {
                if (this.historyListData.length > 0) {
                  this.$refs.historyList.selectId = this.historyListData[0].InHospitalId;
                  this.historyListData[0].InHospitalId &&
                    this.getHistoryDetail(this.historyListData[0].InHospitalId);
                }
              });
            }
          });
      }
    },
    //保存表单数据
    getHistoryDetail(id=this.$route.query.id) {
      this.$Api.getHistoryDetail({ inHospitalId: id ||this.patientMsg.InHouseId}).then(res => {
        if (res.Status) {
          for (var i = 0; i < res.Data.length; i++) {
            res.Data[i]["Index"] = i + 1;
          }
          this.tableData = res.Data;
        }
      });
    },
    //保存提交的数据
    async save(prems) {
      console.log(1111);
      this.isFooter = true;
      let data = await prems();
      console.log("data", data);
      if (data) {
        this.$Api.postOperationData(data).then(res => {
          console.log(res);
          if (res.Status) {
            this.commonObj = data;
            this.operationId = res.Data.FormId;
            this.orderId = res.Data.OrderId;
            this.$store.commit("public/SET_ISSHOW", true);
          }
        });
      }
    },
    //修改数据
    upData() {
      this.commonObj.Id = this.operationId;
      // this.isDeatil = false;
      this.$store.commit("public/SET_ISSHOW", false);
      this.nowTemp = "newOperation";
    },
    //提交数据
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
      if(this.isSignName) {
        let obj = {
          Type: "0",
          Data: [{Name:'手术申请'}],
          No: this.user.UserInfo.No,
          UserName: this.user.UserInfo.Name
        };
        this.currentObjData = obj;
        this.caSignOperation.KeyVerify();
      }else{
        this.handleOperation()
      }
      
    },
   async handleOperation() {
        try {
     let isPassIMIS=await this.$IMIS.submmitOrderIMIS([{OrderId:this.orderId,OrderType:1}],this.patientMsg)
       if(!isPassIMIS)return
   } catch (error) {
     
   }
      this.$Api
        .submitAdvice({
          InHouseId: this.$route.query.id||this.patientMsg.InHouseId,
          OrderList: [this.orderId],
          HisRegisterId: this.patientMsg.RegistId,
          CASignImg:this.caImgData
        })
        .then(res => {
          // this.$Api.submitOperationData({ FormId: this.operationId }).then(res => {
          this.$msg[res.Status ? "success" : "warning"](res.Message);
          if (res.Status) {
            let obj = {
              FormId: res.Data.FormIds[0]
            };
            this.print(obj);
            this.reset();
            this.$store.commit("public/SET_ISSHOW", false);
          this.$refs.historyList&&this.$refs.historyList.selectId&& this.getHistoryDetail(this.$refs.historyList.selectId);
          }else{
            this.refreshOrderStatus()
          }
        }).catch(err=>{
          this.refreshOrderStatus()
        })
    },
    //取消清空所有的数据
    reset() {
      this.isReset = false;
      this.commonObj = {};
      this.$nextTick(() => {
        this.isReset = true;
      });
    },
    //展开制表格的数据
    showTable(row) {
      console.log(row);
      this.$Api.getOperationOneData({ formId: row.FormId }).then(res => {
        if (res.Status) {
          let data=res.Data
          data.Id="00000000-0000-0000-0000-000000000000"
          data.ExpectOperationTime=data.ApplyTime=GetFormatDateTime()
          this.commonObj = data;
          this.nowTemp = "newOperation";
          console.log(this.commonObj);
        }
      });
    },
    //弹框回调的函数
    alterCallback(bl) {
      if (this.nowTemp == "newOperation") {
        this.commonObj.Id = this.operationId;
      } else {
        this.reset();
      }
      this.$store.commit("public/SET_ISSHOW", false);
    },
    //历史列表申请单的数据
    historyItem(val) {
      this.getHistoryDetail(val);
    },
    //获取单个的申请单的数据
    getOperationOneData(id) {
      this.$Api.getOperationOneData({ formId: id }).then(res => {
        if (res.Status) {
          this.commonObj = res.Data;
          this.$store.commit("public/SET_ISSHOW", true);
        }
      });
    },
    //常看报告
    lookReport(row) {
      console.log(row);
    },
    //点击表格的行弹出提交框
    selectRow(row) {
      console.log(row);
      this.operationId = row.FormId;
      this.orderId = row.OrderId;
      this.getOperationOneData(row.FormId);
      if (row.Status === 1) {
        this.isFooter = true;
      } else {
        this.isFooter = false;
      }
    },
            // 重置医嘱提交错误时的医嘱状态
    refreshOrderStatus(){
       this.$Api.refreshOrderStatus({inHospitalId:this.$route.query.id||this.patientMsg.InHouseId}).then(res=>{
       })
    },
  }
};
</script>
<style lang="less" scoped>
.operation-warp {
  padding: 10px 15px;
  height: 100%;
  box-sizing: border-box;
 
  // font-size: @
  .newOperation {
    overflow: auto;
    position: relative;
    height: calc(~"(100vh - 120px)");
  }
  .tabs-temp {
    /deep/.el-radio-button__inner {
      width: 98px;
      height: 32px;
      font-size: 14px;
      border-radius: 0;
    }
  }
  .btn {
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

  .historyOperation {
    margin-top: 20px;
    height: 100%;
    display: flex;
    justify-content: space-between;
    .dd-box {
      span {
        display: inline-block;
        width: 30px;
        height: 30px;
        background: red;
      }
    }
    .history-left {
      width: 130px;
      padding: 0 10px;
      height: 100%;
      border-right: 1px solid #ccc;
      margin-right: 30px;
    }
  }
  .styleIcon {
    display: inline-block;
    width: 20px;
    height: 20px;
    color: #0071e7;
    margin-right: 10px;
    cursor: pointer;
  }
}
.btnList {
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
}
</style>