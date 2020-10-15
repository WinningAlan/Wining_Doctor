<template>
  <div class="read-report">
    <div class="tabs-temp">
      <el-input  ref="search" class="search"></el-input>
      <el-radio-group v-model="nowTemp" @change="tapsExamine" fill="#0071e7">
        <el-radio-button
          :label="item.Value"
          v-for="(item,index) in tabsTemp"
          :key="index"
        >{{item.Text}}</el-radio-button>
      </el-radio-group>
    </div>
    <div class="left">
      <div class="now-report" v-if="nowTemp==1">
        <div class="now-list" v-if="nowData.length">
          <div
            class="now-item"
            v-for="(item,index) in nowData"
            :key="index"
            @click="lookReport(item,index)"
          >
            <span
              class="type"
              :class="{'icon-inspect':item.ReportType ==='检查','icon-test':item.ReportType ==='检验'}"
            ></span>
            <div :class="{active:item.ReportNo==nowSelectId}" class="typeContent">
              <span>{{item.ReportDate | timeFilter}}</span>
              <span>{{item.ReportCategoryName}}</span>
              <span>{{item.UserName}}</span>
            </div>
          </div>
        </div>
        <div v-else class="dataNull">暂无数据</div>
      </div>
      <div class="history-report" v-else>
        <el-collapse
          v-model="activeName"
          accordion
          @change="changeData"
          v-if="hisParentData.length"
        >
          <el-collapse-item v-for="(item,index) in hisParentData" :key="index" :name="`${index}`">
            <template slot="title">
              <div class="title">
                <span>{{item.InHospTime | timeFilter}}</span>
                <span>{{item.ReportCategoryName}}</span>
                <span>{{item.AreaName}}</span>
              </div>
            </template>
            <div
              class="his-item"
              v-for="(item) in hisData"
              :key="item.ReportNo"
              @click="lookReport(item)"
            >
              <span
                class="type"
                :class="{'icon-inspect':item.ReportType ==='检查','icon-test':item.ReportType ==='检验'}"
              ></span>
              <div :class="{active:item.ReportNo==nowSelectId}" class="typeContent">
                <span>{{item.ReportDate | timeFilter}}</span>
                <span>{{item.ReportCategoryName}}</span>
                <span>{{item.UserName}}</span>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
        <div v-else class="dataNull">暂无数据</div>
      </div>
      <el-radio-group v-model="radio" class="bottom" @change="changeCondition">
        <el-radio :label="0">全部报告</el-radio>
        <el-radio :label="1">检查报告</el-radio>
        <el-radio :label="2">检验报告</el-radio>
      </el-radio-group>
    </div>
    <div class="warp" @click="showTable"  v-show="ifarmSrc">{{show?"数据趋势":"报告详情"}}</div>
    <div class="right">
      <div
        class="content-center ifarme"
        v-loading="showLoading"
        element-loading-text="拼命加载中"
        element-loading-background="rgba(200, 200, 200, .6)"
        v-show="show &&ifarmSrc"
      >
        <iframe height="100%" :src="ifarmSrc" width="100%" frameborder="0" id="ifra"></iframe>
      </div>
      <div class="table" v-show="!show">
        <simpleTable
          :tableData="testDataDetail"
          :isSelect="false"
          row-key="Id"
          indexLable="序号"
          :columns="columns"
          v-if="currentSelectedItem.ReportType=='检验'&&testDataDetail.length"
        >
          <div slot="operation" slot-scope="{scope}">
            <el-button
              type="text"
              @click="testDataTrendGet(scope.row)"
              size="mini"
              :disabled="!scope.row.ItemValue.match('^[-+]?[0-9]*\.?[0-9]+$')"
            >查看</el-button>
          </div>
        </simpleTable>
        <p v-else>检查结论：{{checkDataDetail}}</p>
      </div>
    </div>
    <my-alter
      :title="dialogData.title"
      :width="dialogData.width"
      :visible="dialogData.showAlter"
      :callback="closeDialog"
      :isfooter="false"
    >
      <echarts :echartsData="testTrendData" type="trend" width="100%" style="padding-bottom:30px"></echarts>
    </my-alter>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import simpleTable from "@/components/common/simpleTable";
import { testDetailColumns } from "@/module/tableColumns";
import myAlter from "@/components/common/myAlter";
import echarts from "@/components/common/Echarts";
import { IframeOnClick,GetFormatDateTime } from "@/utils/public";

export default {
  name: "readReport", //报告调阅
  components: {
    simpleTable,
    myAlter,
    echarts
  },
  data() {
    return {
      columns: testDetailColumns,
      tableData: [], //检查结果表格展示
      nowTemp: 1, //当前显示的是历史报告还是当前报告
      radio: 0, //筛选为不同的报告，检查，检验
      activeName: "0", //数据展开显示时第几行
      tabsTemp: [
        {
          Text: "当前报告",
          Value: 1
        },
        {
          Text: "历史报告",
          Value: 2
        }
      ], //却换显示历史还是当前
      show: true, //显示时表格还是报告
      nowData: [], //当前的报告调阅
      hisData: [], //历史的数据结构
      hisParentData: [], //历史父级的数据
      nowSelectId: "", //选中的id;
      currentSelectedItem: {}, //当前选中的检查检验报告
      ifarmSrc: "",
      showLoading: true,
      index: 0,
      testDataDetail: [], //检验数据详情
      checkDataDetail: "", //检查数据详情
      testTrendData: [], //检验某个指标趋势数据
      dialogData: {
        showAlter: false,
        title: "趋势图",
        width: "1262px"
      } //弹窗数据
    };
  },
  props: {
    // 组件变化
    initialize: false
  },
  watch: {
    initialize: {
      handler: function(val, oldVal) {
        if (val) {
          this.nowTemp = 1;
          this.show = true;
          this.radio = 0;
          this.ifarmSrc = "";
          this.currentSelectedItem={}
          this.showLoading = false;
          this.getNowReportData();
        }else{
          IframeOnClick.clear()
        }
      },
      immediate: true
    }
  },
  mounted() {},
  beforeDestroy() {
    IframeOnClick.clear()
  },
  computed: {
    ...mapGetters({
      patientMsg: "public/GET_PATIENTMSG",
      user: "public/GET_USER",
      reportConfig: "public/GET_REPORTCONFIG"
    })
  },
  methods: {
    closeDialog(Value) {
      this.dialogData.showAlter = false;
    },
    // 查看数据趋势
    testDataTrendGet(row) {
      console.log(row, "行标题");
      this.dialogData.showAlter = true;
      this.dialogData.title = row.ItemName + "近30天趋势图";
      let params = {
        HisPatientId: this.patientMsg.HISPatientId,
        ItemCode: row.ItemCode,
        ReportDate: row.ReportDate
      };
      this.$Api.getTestItemTrend(params).then(res => {
        // echarts图
        if (res.Status) {
          this.testTrendData = res.Data;
        } else {
          this.$msg.warning(res.Message);
        }
      });
    },
    // 切换条件
    changeCondition(val) {
      this.ifarmSrc = "";
      this.testDataDetail = [];
      this.checkDataDetail = "";
      this.nowTemp === 2 ? this.getWarpList(val) : this.getNowReportData(val);
    },
    //切换历史和当前
    tapsExamine(val) {
      this.show = true;
      this.ifarmSrc = "";
      this.testDataDetail = [];
      this.checkDataDetail = "";
      val === 2 ? this.getWarpList() : this.getNowReportData();
      // 清空右侧内容
    },
    //切换显示是报告详情还是表格
    showTable() {
      this.show = !this.show;
    },
    //获取当前的报告数据
    getNowReportData(type = this.radio) {
      this.$Api
        .getReportNowListNew({
          HisPatientId: this.patientMsg.HISPatientId,
          ReportType: type,
          PatientId: this.patientMsg.PatientId
        })
        .then(res => {
          if (res.Status) {
            this.nowData = res.Data || [];
            this.nowSelectId = res.Data[0] ? res.Data[0].ReportNo : "";
            if (res.Data[0]) {
              this.lookReport(res.Data[0], 0);
              // this.ifarmSrc = res.Data[0]
              //   ? res.Data[0].IP +
              //     "?repno=" +
              //     res.Data[0].repno +
              //     "&replb=" +
              //     res.Data[0].replb
              //   : "";
              // const iframe = document.querySelector("#ifra");
              // iframe.onload = () => {
              //   this.showLoading = false;
              // };

              console.log(this.nowData);
            }
          }
        });
    },
    //获取历史的报告数据
    getHisReportContentData(item) {
      this.$Api
        .getReportHisContentNew({
          HisPatientId: this.patientMsg.HISPatientId,
          ReportType: this.radio,
          PatientId: this.patientMsg.PatientId,
          InHospTime: item.InHospTime,
          OutHospTime:GetFormatDateTime('',new Date(+new Date(item.OutHospTime)+24 * 3600 * 1000*4)) 
        })
        // 临时处理方式时间增加4天
        .then(res => {
          if (res.Status) {
            this.hisData = res.Data || [];
            this.nowSelectId = res.Data[0] ? res.Data[0].ReportNo : "";
            if (res.Data[0]) {
              this.lookReport(res.Data[0], 0);
              // this.ifarmSrc = res.Data[0]
              //   ? res.Data[0].IP +
              //     "?repno=" +
              //     res.Data[0].repno +
              //     "&replb=" +
              //     res.Data[0].replb
              //   : "";
              // const iframe = document.querySelector("#ifra");
              // iframe.onload = () => {
              //   this.showLoading = false;
              // };
            }
          }
          console.log(res);
        });
    },
    //获取阶段列表的数据
    getWarpList(type = this.radio) {
      this.$Api
        .getReportHisListNew({
          HisPatientId: this.patientMsg.HISPatientId,
          ReportType: type,
          PatientId: this.patientMsg.PatientId
        })
        //.getInHouseList({ patientId: this.patientMsg.PatientId })
        .then(res => {
          if (res.Status) {
            this.hisParentData = res.Data;
            if (this.hisParentData && this.hisParentData.length > 0) {
              this.getHisReportContentData(this.hisParentData[0]);
            }
          }
        });
    },
    changeData(val) {
      if (val) {
        this.getHisReportContentData(this.hisParentData[val]);
      }
    },
    //查看报告
    lookReport(item, index) {
      this.nowSelectId = item.ReportNo;
      this.currentSelectedItem = item;
console.log(item,'item');
      // 获取详细信息
      // if (this.show) {
        this.ifarmSrc = "";
        this.showLoading = true;
        let t = +new Date();
        let obj = this.reportConfig.find(oo => {
          return oo.ReportTypeCode == item.Replb.trim();
        });
        if (obj == undefined) {
          if(!item.IP){
            this.showLoading = false;
            return this.$msg.warning('该报告无报告地址')
            }
          if (item.IP.indexOf("?") == -1) {
            item.IP += "?";
          }
          this.ifarmSrc =
            item.IP +
            "repno=" +
            item.ReportNo +
            "&reptypeno=" +
            item.Replb.trim() +
            "&HospitalCode=" +
            this.user.UserInfo.HospitalCode +
            "&t=" +
            t;
        } else {
          if (obj.ReportUrl.indexOf("?") == -1) {
            obj.ReportUrl += "?";
          }
          let str = obj.ReportSuffix;
          let paramsStr = str.replace('@ReportNo',item.ReportNo).replace('@PatientName',this.patientMsg.PatientName).replace('@ReportType',item.Replb.trim()).replace('@HisPatientId',this.patientMsg.HISPatientId).replace('@HisRecordNumber',this.patientMsg.RecordNumber)
          this.ifarmSrc = obj.ReportUrl+paramsStr+
            "&t=" +
            t;
        }
        console.log(this.ifarmSrc);
        this.index = index;
        const iframe = document.querySelector("#ifra");
        iframe.onload = () => {
          console.log("iframe加载完成");
                  IframeOnClick.clear()
        IframeOnClick.track(document.getElementById("ifra"), this.openIE ); 
          this.showLoading = false;
        };
      // }
      let params = {
        reportNo: item.ReportNo
      };
      if (item.ReportType == "检查" || item.ReportType == "6  ") {
        // 检查相关
        this.$Api.getCheckResultByReportId(params).then(res => {
          if (res.Status) {
            this.checkDataDetail =res.Data? res.Data.ResultDesc:'';
          } else {
            this.$msg.warning(res.Message);
            this.checkDataDetail = "";
          }
        });
      } else if (item.ReportType == "检验" || item.ReportType == "17  ") {
        this.$Api.getTestResultByReportId(params).then(res => {
          // 检验结果
          if (res.Status) {
            this.testDataDetail = res.Data||[];
          } else {
            this.$msg.warning(res.Message);
            this.testDataDetail = [];
          }
        });
      }
    },
        openIE(){
          this.$Api.openIE(this.ifarmSrc.replace(/&/g,"$")).then(res=>{
        console.log(res,'打开IE');
        // document.activeElement=document.body
        this.$refs.search.focus()
      })
    },
  }
};
</script>
<style lang="less" scoped>
.read-report {
  height: 90vh;
  padding: 10px 20px;
  box-sizing: border-box;
  position: relative;
  .search{
    position: absolute;
    z-index: -100;
    top: 0;
    left: 0;
  }
  .tabs-temp {
    /deep/.el-radio-button__inner {
      width: 98px;
      height: 32px;
      font-size: 14px;
      border-radius: 0;
    }
  }
  .left {
    height: calc(100% - 23px);
    width: 400px;
    border-right: 1px solid #cccc;
    //overflow: auto;
    float: left;
    margin-right: 20px;
    .dataNull {
      text-align: center;
      margin-top: 30%;
    }
    .bottom {
      position: absolute;
      bottom: 0px;
      width: 420px;
      height: 60px;
      border-top: 1px solid #ccc;
      left: 0px;
      display: flex;
      justify-content: space-between;
      padding: 20px 10px;
      box-sizing: border-box;
    }
    .now-report,
    .history-report {
      height: calc(100% - 59px);
      overflow: auto;
    }
    .now-list {
      font-size: 14px;
      margin-top: 20px;
      width: 394px;
      //height: 100%;
      //overflow: hidden;
      .now-item {
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #ccc;
        cursor: pointer;
        //margin-right:10px;
        span {
          padding-right: 10px;
        }
        .type {
          width: 36px;
          height: 36px;
          // border:1px solid #ccc;
          display: inline-block;
          line-height: 36px;
          text-align: center;
          margin-top: 2px;
          padding: 0;
          margin-right: 5px;
        }
      }
    }
    .active {
      background: #0071e7;
      color: #fff;
      font-weight: bold;
    }
    .typeContent {
      display: inline-block;
      width: 348px;
      padding-left: 5px;
    }
    .history-report {
      .title {
        span {
          padding-right: 10px;
        }
      }
      .his-item {
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #ccc;
        cursor: pointer;
        span {
          padding-right: 10px;
        }
        .type {
          width: 36px;
          height: 36px;
          // border:1px solid #ccc;
          display: inline-block;
          line-height: 36px;
          text-align: center;
          margin-top: 2px;
          padding: 0;
          margin-right: 5px;
        }
      }
    }
  }
  .warp {
    height: 30px;
    width: 30px;
    text-align: center;
    padding: 3px;
    border: 1px solid #ccc;
    position: absolute;
    top: 8px;
    right: 30px;
    cursor: pointer;
    line-height: 1.2;
    &:hover {
      color: #0071e7;
      border-color: #0071e7;
    }
  }
  .right {
    height: calc(100% - 40px);
    overflow: hidden;
    // border: 2px solid #ccc;
    // border-radius: 5px;
    // position: relative;
    .table {
      height: 95%;
      overflow: auto;
      /deep/.el-button {
        font-size: 14px;
        width: auto;
      }
    }
    .ifarme {
      height: 100%;
      margin-top: 8px;
    }
  }
}
</style>