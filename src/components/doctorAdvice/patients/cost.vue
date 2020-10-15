<template>
  <div class="cost">
    <div class="cost-type">
      <div class="item">
        <span class="title">总金额</span>
        <span>￥{{feeAmount.AggregateAmount | costFilter}}</span>
      </div>
      <div class="item">
        <span class="title">预交金合计</span>
        <span>￥{{feeAmount.AdvanceAmount | costFilter}}</span>
      </div>
      <div class="item">
        <span class="title">余额</span>
        <span>￥{{feeAmount.BalanceAmount | costFilter}}</span>
      </div>
      <div class="item">
        <span class="title">自费金额</span>
        <span>￥{{feeAmount.OwnExpense | costFilter}}</span>
      </div>
      <!-- <div class="item">
        <span class="title">自付金额</span>
        <span>￥{{feeAmount.PayOneself | costFilter}}</span>
      </div> -->
      <div class="item">
        <span class="title">未收费总额</span>
        <span>￥{{feeAmount.NoSettledAmount | costFilter}}</span>
      </div>
      <div class="item" style="height:0"></div>
    </div>
    <div class="content">
      <div class="content-header cl">
        <div class="time" v-if="activeIndex==3">
          <span>收费日期</span>
          <el-date-picker
            v-model="timeValue"
            type="datetimerange"
            prefix-icon="el-icon-date"
            :clearable="false"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format=" yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
            @change="selectData"
          ></el-date-picker>
        </div>
        <div class="oper">
          <el-tooltip slot="reference" placement="top" effect="light" content="刷新">
            <svg-icon iconClass="shuaxin" class="wh40" @click="refresh"></svg-icon>
          </el-tooltip>
          <el-tooltip slot="reference" placement="top" effect="light" content="导出">
            <svg-icon iconClass="yuan" class="wh40" @click="exportTable"></svg-icon>
          </el-tooltip>
          <el-tooltip slot="reference" placement="top" effect="light" content="打印">
            <svg-icon iconClass="print" class="wh40" @click="print"></svg-icon>
          </el-tooltip>
        </div>
      </div>
      <div class="table" ref="print">
        <!-- <simpleTable :tableData="tableData" :columns="columns"></simpleTable>
        <div class="print"  >-->
        <h3 style="text-align:center;font-size:20px;">{{ activeIndex | fleeFilter(tabsList)}}</h3>
        <simpleTable :tableData="tableData" :columns="columns" :isEllipsis="false"></simpleTable>
        <p style="text-align:right;font-size:14px;padding-top:10px;">打印时间：{{time}}</p>
        <!-- </div> -->
      </div>
    </div>
    <div class="tabslist cl">
      <p
        v-for="(item,index) in tabsList"
        :key="index"
        :class="{active:activeIndex==item.value}"
        @click="tabsClick(item)"
      >
        {{item.text}}
        <span v-if="index!==tabsList.length-1">|</span>
      </p>
    </div>
  </div>
</template>
<script>
import simpleTable from "../../common/simpleTable";
import { mapGetters } from "vuex";
import {
  categoriesColumns,
  subentryColumns,
  detailColumns,
  prepayColumns,
  bedColumns,
  operationColumns,
  tallyColumns,
  medicinColumns
} from "../../../module/patientInfo";
import { GetFormatDateTime } from "../../../utils/public";
export default {
  name: "cost",
  components: {
    simpleTable
  },
  computed: {
    ...mapGetters({
      patientMsg: "public/GET_PATIENTMSG"
    })
  },
  created() {
    this.timeValue[0] = GetFormatDateTime(
      null,
      new Date(new Date().getTime() - 7 * 24 * 3600 * 1000)
    );
    this.time = this.timeValue[1] = GetFormatDateTime();

    this.getTotalAmount();
    this.getFeeBigItems();
  },
  methods: {
    refresh() {
      switch (this.activeIndex) {
        case 1:
          this.getFeeBigItems();
          break;
        case 2:
          this.getFeeSmallItems();
          break;
        case 3:
          this.getFeeDetailItems();
          break;
        case 4:
          this.getAdvancePayments();
          break;
        case 5:
          this.getFeeBeds();
          break;
        case 6:
          this.getFeeOperations();
          break;
        case 7:
          this.getFeeUnaccountedInfo();
          break;
        case 8:
          this.getFeeMedicineRateInfo();
          break;
      }
      // if (this.activeIndex == 1) {
      //   this.getFeeBigItems();
      // }
      // if (this.activeIndex == 2) {
      //   this.getFeeSmallItems();
      // }
      // if (this.activeIndex == 3) {
      //   this.getFeeDetailItems();
      // }
      // if (this.activeIndex == 4) {
      //   this.getAdvancePayments();
      // }
      // if (this.activeIndex == 5) {
      //   this.getFeeBeds();
      // }
      // if (this.activeIndex == 6) {
      //   this.getFeeOperations();
      // }
      // if (this.activeIndex == 7) {
      //   this.getFeeUnaccountedInfo();
      // }
      // if (this.activeIndex == 8) {
      //   this.getFeeMedicineRateInfo();
      // }
    },
    exportTable() {
      if (this.tableData.length > 0) {
        let data = {};
        if (this.activeIndex == 3) {
          data["feeConditionDto.feeType"] = this.activeIndex;
          data["feeConditionDto.hisPatientId"] = this.patientMsg.HISPatientId;
          data["feeConditionDto.startTime"] = this.timeValue[0];
          data["feeConditionDto.endTime"] = this.timeValue[1];
        } else {
          data["feeConditionDto.feeType"] = this.activeIndex;
          data["feeConditionDto.hisPatientId"] = this.patientMsg.HISPatientId;
        }
        let str = "";
        for (var key in data) {
          str += `${key}=${data[key]}&`;
        }
        var href = `${window.URLCONFIG.Doctor}/api/v1/Patient/ExportPatientFee?${str}`;
        console.log(href);

        var a = document.createElement("a");
        a.setAttribute("download", ""); // download属性
        a.setAttribute("href", href); // href链接
        a.click(); // 自执行点击事件
      } else {
        this.$msg.warning("暂无数据！！");
      }
    },
    tabsClick(val) {
      this.activeIndex = val.value;
      switch (this.activeIndex) {
        case 1:
          this.columns = categoriesColumns;
          this.getFeeBigItems();
          break;
        case 2:
          this.columns = subentryColumns;
          this.getFeeSmallItems();
          break;
        case 3:
          this.columns = detailColumns;
          this.getFeeDetailItems();
          break;
        case 4:
          this.columns = prepayColumns;
          this.getAdvancePayments();
          break;
        case 5:
          this.columns = bedColumns;
          this.getFeeBeds();
          break;
        case 6:
          this.columns = operationColumns;
          this.getFeeOperations();
          break;
        case 7:
          this.columns = tallyColumns;
          this.getFeeUnaccountedInfo();
          break;
        case 8:
          this.columns = medicinColumns;
          this.getFeeMedicineRateInfo();
          break;
      }
      // if (this.activeIndex == 1) {
      //   this.columns = categoriesColumns;
      //   this.getFeeBigItems();
      // }
      // if (this.activeIndex == 2) {
      //   this.columns = subentryColumns;
      //   this.getFeeSmallItems();
      // }
      // if (this.activeIndex == 3) {
      //   this.columns = detailColumns;
      //   this.getFeeDetailItems();
      // }
      // if (this.activeIndex == 4) {
      //   this.columns = prepayColumns;
      //   this.getAdvancePayments();
      // }
      // if (this.activeIndex == 5) {
      //   this.columns = bedColumns;
      //   this.getFeeBeds();
      // }
      // if (this.activeIndex == 6) {
      //   this.columns = operationColumns;
      //   this.getFeeOperations();
      // }
      // if (this.activeIndex == 7) {
      //   this.columns = tallyColumns;
      //   this.getFeeUnaccountedInfo();
      // }
      // if (this.activeIndex == 8) {
      //   this.columns = medicinColumns;
      //   this.getFeeMedicineRateInfo();
      // }
    },
    //获取各项费用的展示信息
    getTotalAmount() {
      this.$Api
        .getTotalAmount({ hisPatientId: this.patientMsg.HISPatientId })
        .then(res => {
          if (res.Status) {
            this.feeAmount = res.Data || {};
          } else {
            this.$msg.warning(res.Message);
          }
        });
    },
    //获取费用大项信息
    getFeeBigItems() {
      this.$Api
        .getFeeBigItems({ hisPatientId: this.patientMsg.HISPatientId })
        .then(res => {
          if (res.Status) {
            this.tableData = res.Data || [];
          } else {
            this.tableData = [];
            this.$msg.warning(res.Message);
          }
        });
    },
    //获取费用小项信息
    getFeeSmallItems() {
      this.$Api
        .getFeeSmallItems({ hisPatientId: this.patientMsg.HISPatientId })
        .then(res => {
          if (res.Status) {
            this.tableData = res.Data || [];
          } else {
            this.tableData = [];
            this.$msg.warning(res.Message);
          }
        });
    },
    //费用明细信息
    getFeeDetailItems() {
      this.$Api
        .getFeeDetailItems({
          HisPatientId: this.patientMsg.HISPatientId,
          StartTime: this.timeValue[0],
          EndTime: this.timeValue[1]
        })
        .then(res => {
          if (res.Status) {
            this.tableData = res.Data || [];
          } else {
            this.tableData = [];
            this.$msg.warning(res.Message);
          }
        });
    },
    //预交金信息
    getAdvancePayments() {
      this.$Api
        .getAdvancePayments({ hisPatientId: this.patientMsg.HISPatientId })
        .then(res => {
          if (res.Status) {
            this.tableData = res.Data || [];
          } else {
            this.tableData = [];
            this.$msg.warning(res.Message);
          }
        });
    },
    //床位信息
    getFeeBeds() {
      this.$Api
        .getFeeBeds({ hisPatientId: this.patientMsg.HISPatientId })
        .then(res => {
          if (res.Status) {
            this.tableData = res.Data || [];
          } else {
            this.tableData = [];
            this.$msg.warning(res.Message);
          }
        });
    },
    //手术信息
    getFeeOperations() {
      this.$Api
        .getFeeOperations({ hisPatientId: this.patientMsg.HISPatientId })
        .then(res => {
          if (res.Status) {
            this.tableData = res.Data || [];
          } else {
            this.tableData = [];
            this.$msg.warning(res.Message);
          }
        });
    },
    //未记账费用信息
    getFeeUnaccountedInfo() {
      this.$Api
        .getFeeUnaccountedInfo({ hisPatientId: this.patientMsg.HISPatientId })
        .then(res => {
          if (res.Status) {
            this.tableData = res.Data || [];
          } else {
            this.tableData = [];
            this.$msg.warning(res.Message);
          }
        });
    },
    //药占比信息
    getFeeMedicineRateInfo() {
      this.$Api
        .getFeeMedicineRateInfo({ hisPatientId: this.patientMsg.HISPatientId })
        .then(res => {
          if (res.Status) {
            this.tableData = res.Data || [];
          } else {
            this.tableData = [];
            this.$msg.warning(res.Message);
          }
        });
    },
    //费用明细的时间筛选
    selectData(val) {
      this.getFeeDetailItems();
    },
    //打印费用
    print() {
      this.$print(this.$refs.print);
    }
  },
  data() {
    return {
      time: "",
      tableData: [], //表格数据
      activeIndex: 1, //当前激活的项目
      columns: categoriesColumns, //费用项的表头
      tabsList: [
        {
          text: "费用大项信息",
          value: 1
        },
        {
          text: "费用小项目信息",
          value: 2
        },
        {
          text: "费用明细信息",
          value: 3
        },
        {
          text: "预交金信息",
          value: 4
        },
        {
          text: "床位信息",
          value: 5
        },
        {
          text: "手术信息",
          value: 6
        },
        {
          text: "未收费项目信息",
          value: 7
        },
        {
          text: "药占比信息",
          value: 8
        }
      ], //却换费用项的列表
      timeValue: [new Date(), new Date()], //费用明细的收费日期筛选
      feeAmount: {
        AggregateAmount: 0,
        AdvanceAmount: 0,
        BalanceAmount: 0,
        OwnExpense: 0,
        PayOneself: 0,
        NoSettledAmount: 0
      }
    };
  },
  filters: {
    fleeFilter(val, ops) {
      console.log("val", val, ops);
      for (let i = 0; i < ops.length; i++) {
        if (val == ops[i].value) {
          return ops[i].text;
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
.cost {
  height: 100%;
  position: relative;
  .cost-type {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    border-bottom: 1px solid #ccc;
    .item {
      width: 300px;
      margin-bottom: 10px;
      .title {
        display: inline-block;
        width: 100px;
        text-align: center;
        height: 30px;
        line-height: 30px;
        border-radius: 10px;
        background: #eee;
        margin-right: 5px;
      }
    }
   
  }
  .content {
    .content-header {
      margin-bottom: 10px;
    }
    .time {
      float: left;
      margin-top: 10px;
      span {
        padding-right: 10px;
      }
      /deep/ .el-input__inner {
        background: #f2f2f2;
        border-radius: 2px;
      }
    }
    .oper {
      float: right;
      margin-top: 10px;
      .wh40 {
        width: 20px;
        height: 20px;
        color: #0071e7;
        margin-left: 10px;
        cursor: pointer;
      }
    }
  }
  .tabslist {
    position: absolute;
    left: 0;
    bottom: -40px;
    display: flex;
    p {
      padding: 10px;
      cursor: pointer;
      span {
        padding-left: 10px;
      }
    }
    .active {
      color: #0071e7;
      span {
        color: #333;
      }
    }
  }
  .table {
    margin-top: 10px;
    height: calc(100vh - 300px);
    overflow: auto;
    /deep/ .el-table {
      .cell,
      th div,
      td div {
        padding-right: 0;
      }
    }
    h3 {
      text-align: center;
      display: none;
    }
    p {
      display: none;
    }
  }
}
</style>
<style lang="less">
@media print {
  body,html{
    height:auto !important;
  }
  table,
  .el-table {
    width: 100% !important ;
  }
  //  @page {
  //   size: auto;
  //   margin: 0mm;
  // }
  @page {  margin: 4mm 2mm; }
  colgroup {
    display: none !important;
  }
}
</style>