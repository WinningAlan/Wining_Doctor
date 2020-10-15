<template>
  <div class="historyDoctorAdvice">
    <slot name="close"></slot>
    <div class="allContent">
      <div class="allContent-left">
        <div class="head">历史医嘱</div>
        <div class="dataNone" v-if="historyMenuList.length==0">暂无数据</div>
        <div class="dataList" v-else>
          <ul @click="itemClick">
            <li :id="index" v-for="(item,index) in historyMenuList" :key="index" class="menuItem" :class="{active:index===currentIndex}">
              {{item.InHospTime.slice(0,10)}}
              <span
                :class="{'qiang':item.AreaType==1,'liu':item.AreaType==2,'men':item.AreaType==3}"
              ></span>
              {{item.DepartmentName}}
            </li>
          </ul>
        </div>
      </div>
      <div class="allContent-right" v-if="historyData.length">
        <div class="head">
          <div
            class="head-left"
          >历史医嘱/{{historyMenuList[currentIndex].InHospTime|timeFilter}} ~ {{historyMenuList[currentIndex].OutHospTime|timeFilter}}</div>
          <div class="head-right" v-if="historyMenuList[currentIndex].InHouseId!=='00000000-0000-0000-0000-000000000000'">
            <el-tooltip class="item" effect="dark" content="另存为医嘱套餐" placement="top">
              <svg-icon iconClass="saveAs" class="right" @click="saveOrderPackage"></svg-icon>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="打印" placement="top">
              <svg-icon iconClass="print" class="right" @click="selectPrint"></svg-icon>
            </el-tooltip>
            <el-dropdown trigger="click" @command="selectChange">
              <!-- <span>分类打印</span> -->
              <el-tooltip class="item" effect="dark" content="分类打印" placement="top">
                <img
                  src="../../assets/imges/more-icon.svg"
                  style="width:20px;height:20px;margin-top:5px;cursor: pointer;"
                />
                <!-- <svg-icon iconClass="print" class="right"></svg-icon> -->
              </el-tooltip>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="2">打印长期医嘱单</el-dropdown-item>
                <el-dropdown-item command="1">打印临时医嘱单</el-dropdown-item>
                <el-dropdown-item command="0">打印长/临医嘱单</el-dropdown-item>
                <!-- <el-dropdown-item command="EDIS/Doctor/Advice/LongTerm.cpt">打印长期医嘱单</el-dropdown-item>
                <el-dropdown-item command="EDIS/Doctor/Advice/Temporary.cpt">打印临时医嘱单</el-dropdown-item>
                <el-dropdown-item command="EDIS/Doctor/Advice/LongTermTemporary.cpt">打印长/临医嘱单</el-dropdown-item>-->
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="content" v-loading="showLoading"
        element-loading-text="拼命加载中...">
          <doctor-advice-list
            :tableData="historyShowData"
            v-bind.sync="filters"
            ref="reference"
            class="reference"
            :isHistoryData="true"
            @selection-change="historySelectionChange"
          ></doctor-advice-list>
        </div>
        <div class="foot" v-if="patientMsg.Status !==8">
          <el-button type="primary" size="medium" @click="copyOrderList">引用</el-button>
        </div>
      </div>
      <div v-else class="noData" v-loading="showLoading"
        element-loading-text="拼命加载中...">
           <svg-icon iconClass="searchNoData" class="noDataImg"></svg-icon>
      <div class="noDataWord">无历史医嘱</div>
      </div>
    </div>

    <!--另存为医嘱套餐引用弹窗-->
    <my-alter
      :title="dialogTitle"
      :visible="dialogVisible"
      :callback="closeDialog"
      :isfooter="true"
      width="560px"
    >
      <saveOrderPackage ref="saveOrder"></saveOrderPackage>
    </my-alter>
  </div>
</template>
<script>
import doctorAdviceList from "@/components/doctorAdvice/openDoctorAdvice/doctorAdviceList.vue";
import saveOrderPackage from "@/components/doctorAdvice/orderPackage/saveOrderPackage.vue";
import myAlter from "@/components/common/myAlter.vue";
import { printObjectType } from "@/module/staticData.js";
import {newGuid} from '@/utils/public';
import { mapGetters } from "vuex";
export default {
  components: {
    doctorAdviceList,
    saveOrderPackage,
    myAlter
  },
  props: ["callback"],
  data() {
    this.printUrlCommon = "/webroot/decision/view/report";
    return {
      dialogTitle: "另存为医嘱套餐",
      dialogVisible: false,
      filters: {
        effectiveChecked: [1, 2] //表格长/临字段筛选条件
      },
      historyMenuList: [],
      currentIndex: 0,
      historyData: [], //医嘱表格总数据
      checkDataList: [] ,//复选框选中列表
      showLoading:false
    };
  },
  created() {
    this.getHistoryMenuList();
  },
  computed: {
    ...mapGetters({
      patientMsg: "public/GET_PATIENTMSG",
      user: "public/GET_USER"
    }),
    //医嘱表格展示数据
    historyShowData: {
      get: function() {
        let arr = this.historyData.filter(item => {
          item._IsHis=item.OrderId==='00000000-0000-0000-0000-000000000000'
          item.OrderId=item.OrderId==='00000000-0000-0000-0000-000000000000'?newGuid():item.OrderId
          return this.filters.effectiveChecked.includes(item.EffectiveTime);
        });
        //this.checkDataList = arr
        return arr;
      }
    }
  },
  methods: {
    // 弹窗关闭
    async closeDialog(value) {
      if (value) {
        let params = await this.$refs.saveOrder.save();
        if (!params) {
          this.$msg.warning("请把信息填写完整");
          return;
        }
        let ids = [];
        this.checkDataList.forEach(item => {
          ids.push(item.OrderId);
        });
        params.OrderMainIds = ids;
        this.$Api.saveAsOrderPackage(params).then(res => {
          if (res.Status) {
            this.$msg.success("操作成功");
            return;
          }
        });
      }
      this.dialogVisible = false;
    },
    // 引用
    copyOrderList() {
      // 把选中引用的医嘱添加到医嘱下达未提交列表
      // 类似需要执行保存
      if (this.checkDataList.length == 0) {
        this.$msg.warning("请选择需要引用的医嘱");
        return;
      }
      let inHouseId = this.$route.query.id;
      let orderIds = [];
      let HisPrescriptionIds=[]
      this.checkDataList.forEach(item => {
        orderIds.push(item.OrderId);
        HisPrescriptionIds.push(item.HisPrescriptionId);
      });
      let params = {
        CurrentUserId: this.user.UserInfo.Id,
        OrderMainIds: orderIds,
        InHouseId: inHouseId,
        HisPatientId:this.patientMsg.HISPatientId,
        HisPrescriptionIds
      };
      this.$Api.copyHistoryOrder(params).then(res => {
        this.$msg[res.Status ? "success" : "warning"](res.Message);
        // 进入医嘱下达页面
        res.Status && this.callback();
      });
    },
    // // 选择不同类别的打印
    // selectChange(value) {
    //   console.log(value);
    //   let url = "";
    //   let t = new Date().getTime();
    //   url = `${URLCONFIG.DoctorAdvicePrint}${this.printUrlCommon}?viewlet=${value}&inhouseid=${this.historyMenuList[this.currentIndex].InHouseId}&status=2`;
    //   let dom = document.createElement("a");
    //   dom.setAttribute("href", url);
    //   dom.setAttribute("target", "_blank");
    //   dom.click();
    //   console.log(url);
    // },
    // 选择不同类别的打印
    selectChange(value) {
      console.log(value);
      let url = "";
      let t = new Date().getTime();
      if (value == 0) {
        // 长/临
        this.printDuchang(
          printObjectType.longTempAdvice.templateId,
          printObjectType.longTempAdvice.reportType
        );
      } else if (value == 1) {
        // 临
        this.printDuchang(
          printObjectType.tempAdvice.templateId,
          printObjectType.tempAdvice.reportType
        );
      } else if (value == 2) {
        // 长
        this.printDuchang(
          printObjectType.longAdvice.templateId,
          printObjectType.longAdvice.reportType
        );
      }
    },
    // 另存为医嘱套餐
    saveOrderPackage() {
      console.log(this.checkDataList);
      if (this.checkDataList.length == 0) {
        this.$msg.warning("请选择医嘱");
        return;
      }
      this.dialogVisible = true;
      if (this.$refs.saveOrder) {
        this.$refs.saveOrder.orderPackageParams = {};
      }
    },
    // // 复选框选择打印
    // selectPrint() {
    //   if (this.checkDataList.length == 0) {
    //     this.$msg.warning("请选择需要打印的医嘱单");
    //     return;
    //   }
    //   let url = "";
    //   let t = new Date().getTime();
    //   let str = "";
    //   this.checkDataList.forEach(item => {
    //     str += item.CreateTimeSpan + ",";
    //   });
    //   // createTime 时间戳逗号链接
    //   let dom = document.createElement("a");
    //   //body.append(dom)
    //   url = `${URLCONFIG.DoctorAdvicePrint}${this.printUrlCommon}?viewlet=EDIS/Doctor/Advice/PartLongTermTemporary.cpt&inhouseid=${this.historyMenuList[this.currentIndex].InHouseId}&cttimestamps=${str}&status=2`;
    //   dom.src = url;
    //   dom.setAttribute("href", url);
    //   dom.setAttribute("target", "_blank");
    //   dom.click();
    // },
    // 复选框选择打印
    selectPrint() {
      if (this.checkDataList.length == 0) {
        this.$msg.warning("请选择需要打印的医嘱单");
        return;
      }
      let url = "";
      let t = new Date().getTime();
      let str = "";
      this.checkDataList.forEach(item => {
        str += item.CreateTimeSpan + ",";
      });
      this.printDuchang(
        printObjectType.otherAdvice.templateId,
        printObjectType.otherAdvice.reportType,
        str
      );
    },
    printDuchang(templateId, reportType, timeStr = "") {
      clearTimeout(this.timer);
      let t = new Date().getTime();
      let str = window.location.protocol + "\\" + window.location.host;
      let url = `${URLCONFIG.Emr}/Nursing/EditPage.aspx?patientId=${
        this.patientMsg.PatientId
      }&inHouseId=${
        this.historyMenuList[this.currentIndex].InHouseId
      }&areaType=${
        this.historyMenuList[this.currentIndex].AreaType
      }&createUser=940c7df7-a718-e911-80cd-0050568e1b08&originUrl=${str}&objectType=29&logUserEditTrack=true&documentId=f2f201db-3ca2-47b0-ba81-ab6b0096abd6&mark=true&templateId=${templateId}&reportType=${reportType}&timestamps=${timeStr}&areaId=${this.patientMsg.AreaId}&t=${t}`;
      console.log(url);
      this.$store.commit("public/SET_PRINTIFRAMEURL", url);
    },
    // 多选
    historySelectionChange(value) {
      this.checkDataList = value;
    },
    getHistoryMenuList() {
      let params = {
        patientId: this.patientMsg.PatientId,
        hisPatientId:this.patientMsg.HISPatientId
        //patientId: "D17FCAC3-2360-44C5-838F-AAE400FC9AEB"
      };
      this.$Api.getHistoryList(params).then(res => {
        if (res.Status) {
          this.historyMenuList = res.Data;
          if (this.historyMenuList.length != 0) {
            console.log("历史医嘱列表", this.historyMenuList);
            let obj = {
              srcElement: {
                id: "0"
              }
            };
            this.currentIndex=0
            this.itemClick(obj);
          }
        } else {
          this.historyMenuList = [];
        }
      });
    },
    itemClick(e) {
      // console.log(e);
      if (!e.srcElement.id) {
        return;
      }
      this.$refs.reference && this.$refs.reference.checked("clearSelection");
      this.checkDataList = [];
       this.showLoading=true
        this.currentIndex = +e.srcElement.id;
        let params = {
        inHouseId: this.historyMenuList[this.currentIndex].InHouseId,
          beginTime: this.historyMenuList[this.currentIndex].InHospTime,
          endTime: this.historyMenuList[this.currentIndex].OutHospTime,
           hisPatientId:this.patientMsg.HISPatientId
        };
        if(this.historyMenuList[this.currentIndex].HisRegisterId){
          params.hisRegisterIds=this.historyMenuList[this.currentIndex].HisRegisterId
        }
       
        this.$Api.getHistoryDoctorAdviceDetail(params).then(res => {
           this.historyData = res.Data||[];
           this.showLoading=false
        });
    }
  }
};
</script>
<style lang="less" scoped>
.historyDoctorAdvice {
  //padding: 10px 20px 10px 20px;
  height: 100%;
  box-sizing: border-box;
  //height: calc(~"(100% - 30px)");
    .noData {
    //height: 100%;
    text-align: center;
    //margin-top:30px;;
    overflow: hidden;
    .noDataImg {
       padding-top: 200px;
      width: 200px;
      height: 150px;
    }
    .noDataWord {
      margin-top: 15px;
      text-align: center;
      font-size: 14px;
      color: #000;
    }
  }
  .close {
    position: absolute;
    right: 15px;
    top: 5px;
    font-size: 30px;
    cursor: pointer;
    color: @blueMain;
  }
  .allContent {
    height: calc(~"(100% - 12px)");
    overflow: hidden;
    padding: 10px 20px 5px 20px;
    //display: flex;
    &-left {
      height: 100%;
      float: left;
      overflow: auto;
      width: 220px;
      padding-right: 20px;
      box-sizing: content-box;
      border-right: 1px solid rgba(47, 51, 68, 0.4);
      position: relative;
      .head {
        width: 200px;
        height: 32px;
        background: rgba(0, 113, 231, 0.1);
        color: @wordColor;
        font-weight: bold;
        line-height: 32px;
        padding-left: 20px;
        margin-bottom: 10px;
      }
      .dataNone {
        //height: calc(~"(100% - 60px)");
        text-align: center;
        line-height: 30px;
        color: #888;
        position: absolute;
        top: 30%;
        left: 30%;
        //margin-top:50%;
      }
      .dataList {
        .active {
          background: #0071e7;
          color: #fff;
        }
        ul {
          // margin-left: 20px;
          li {
            cursor: pointer;
            padding: 10px 3px;
            border-bottom: 1px solid #ccc;
          }
          // li:hover {
          //   background: #0071e7;
          //   color: #fff;
          // }
        }
      }
    }
    &-right {
      float: right;
      //flex: 1;
      //margin-left:220px;
      width: calc(~"(100% - 261px)");
      height: 100%;
      height: calc(~"(100% - 85px)");
      margin-top: 25px;
      padding-left: 20px;
      .head {
        overflow: hidden;
        padding: 10px 0;
        &-left {
          float: left;
          color: #000622;
          font-weight: bold;
        }
        &-right {
          float: right;
          .right {
            color: rgba(0, 113, 231, 0.7);
            float: right;
            font-size: 20px;
            cursor: pointer;
            padding: 6px 0 0 15px;
          }
        }
      }
      .content {
        height: calc(~"(100% - 30px)");
        overflow: auto;
      }
      .foot {
        overflow: hidden;
        box-sizing: border-box;
        padding: 8px;
      text-align: center;
      }
    }
  }
}
</style>