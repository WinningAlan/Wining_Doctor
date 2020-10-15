<template>
  <div class="shiftDutyQuery">
    <div class="head">
      <div class="left titleTab3">
        <el-radio v-model="selectTab" label="1" border size="medium">患者交接</el-radio>
        <el-radio v-model="selectTab" label="2" border size="medium">晨班交接</el-radio>
      </div>
      <div class="right">
        <div v-if="selectTab=='1'">
          <el-date-picker
            v-model="searchDate"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @change="search"
          ></el-date-picker>
        </div>
        <div v-else>
          <el-date-picker
            v-model="searchDateSE"
            type="daterange"
            placeholder="选择日期"
            range-separator="至"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            start-placeholde="开始日期"
            end-placeholde="结束日期"
            @change="search"
          ></el-date-picker>
        </div>
        <div>
          <el-select placeholder="请选择区域" v-model="searchArea" multiple @change="search">
            <el-option
              v-for="(item,index) in user.DiagnosisAreas"
              :key="index"
              v-show="item.DiagnosisAreaType!=3"
              :label="item.DiagnosisAreaName"
              :value="item.DiagnosisAreaType"
            ></el-option>
          </el-select>
        </div>
        <div v-if="selectTab=='1'">
          <el-select v-model="selectSchedule" placeholder="请选择班次" multiple @change="search">
            <el-option
              v-for="(item,index) in doctorScheduleList"
              :key="index"
              :label="item.ScheduleName"
              :value="item.Id"
            ></el-option>
          </el-select>
        </div>
        <div>
          <el-select v-model="selectDoctor" multiple collapse-tags placeholder="请选择医生" @change="search">
            <el-option
              v-for="(item,index) in handoverDoctorList"
              :key="index"
              :label="item.Text"
              :value="item.Value"
            ></el-option>
          </el-select>
        </div>
        <div>
          <el-button type="primary" @click="search">查询</el-button>
        </div>
      </div>
    </div>
    <div class="content">
      <el-table :data="tableData" ref="table">
        <el-table-column
          v-for="(item,index) in columns"
          :key="index"
          :prop="item.prop"
          :label="item.name"
        >
          <template slot-scope="scope">
            <div v-if="item.prop=='HandoverDtime'">{{scope.row[item.prop]|timeFilter}}</div>
            <div v-else>{{scope.row[item.prop]}}</div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
              <slot name="operation" :row="scope.row" :selectTab="selectTab">
                  <el-button type="text">查看</el-button>
              </slot>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="bottom">
        <el-button type="primary" @click="exportDetail" v-if="selectTab=='1'">导出明细</el-button>
      <el-button type="primary" @click="exportTable">导出</el-button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { GetFormatDateTime } from "@/utils/public";
export default {
  components: {
  },
  props:{
    handoverDoctorList:{
      type:Array,
      default:function() {
        return []
      }
    },
    getHandoverDoctorList:Function,
  },
  data() {
    this.columns1 = [
      { prop: "ScheduleName", name: "班次" },
      { prop: "HandoverDoctorName", name: "交班医生" },
      { prop: "Count", name: "交班患者数" },
      { prop: "DangerousCount", name: "危重" },
      { prop: "NewCount", name: "新入" },
      { prop: "OperationCount", name: "手术" }
    ];
    this.columns2 = [
      { prop: "AreaName", name: "诊疗区" },
      { prop: "HandoverDoctorName", name: "交班医生" },
      { prop: "HandoverDtime", name: "交班时间" },
      { prop: "ExistingPat", name: "现有" },
      { prop: "NewHosPat", name: "新入" },
      { prop: "InHospitalPat", name: "入院" },
      { prop: "OutHosPat", name: "出院" },
      { prop: "DeathPat", name: "死亡" },
      { prop: "CriticalPat", name: "危重" },
      { prop: "OperationPat", name: "手术" }
    ];
    return {
      selectTab: "1",
      searchDate: GetFormatDateTime('yyyy-MM-dd',new Date()),
      searchDateSE: [GetFormatDateTime('yyyy-MM-dd',new Date()),GetFormatDateTime('yyyy-MM-dd',new Date())], //晨班交接时间区间
      searchArea: [],//区域表格
      columns: [], //tab表格
      tableData: [],
      tableDetailData: [], //详细数据
      selectDoctor: [], //筛选医生
      selectSchedule: [], //筛选班次
    };
  },
  mounted() {
    //  this.columns = this.columns1;
    //   this.getHandoverShiftQuery();
  },
  computed: {
    ...mapGetters({
      user: "public/GET_USER",
      doctorScheduleList: "public/GET_DOCTORSCHEDULEINFO",
      dialogData:"public/GET_DIALOGDATA",
    })
  },
  methods: {
    // 导出明细
    exportDetail() {
      if(this.tableData.length==0) {
        return
      }
      let url = `${URLCONFIG.Doctor}/api/v1/ChangeShifts/HandOverDetailInfoExport?AreaType=${this.searchArea}
      &EndTime=${this.searchDate||GetFormatDateTime('yyyy-MM-dd',new Date())}&ScheduleId=${this.selectSchedule}&HandOverDoctorId=${this.selectDoctor}&HospitalAreaId=${this.user.HospitalAreaId}`
      console.log(url)
      let doma = document.createElement('a')
      doma.setAttribute('href', url)
      doma.setAttribute('download', '患者交接明细导出')
      doma.click()
      doma.remove()
    },
    // 导出
    exportTable() {
       if(this.tableData.length==0) {
        return
      }
      let url=''
      if(this.selectTab=='1') {
        url = `${URLCONFIG.Doctor}/api/v1/ChangeShifts/HandoverShiftExport?
        handOverDoctorId=${this.selectDoctor.join(',')}
      &areaType=${this.searchArea.join(',')}&endTime=${this.searchDate||GetFormatDateTime('yyyy-MM-dd',new Date())}
      &scheduleId=${this.selectSchedule.join(',')}
      &pageIndex=1&pageSize=99999&hospitalAreaId=${this.user.HospitalAreaId}`
      }else{
        url = `${URLCONFIG.Doctor}/api/v1/ChangeShifts/MorningHandoverPatListExport?
        handOverDoctorId=${this.selectDoctor.join(',')}
      &areaType=${this.searchArea.join(',')}&beginTime=${this.searchDateSE[0]||GetFormatDateTime('yyyy-MM-dd',new Date())}
      &endTime=${this.searchDateSE[1]||GetFormatDateTime('yyyy-MM-dd',new Date())}
      &pageIndex=1&pageSize=99999&hospitalAreaId=${this.user.HospitalAreaId}`
      }
      console.log(url)
      let doma = document.createElement('a')
      doma.setAttribute('href', url)
      doma.setAttribute('download', '表格数据导出')
      doma.click()
      doma.remove()
    },
    // 搜索
    search() {
      if (this.selectTab == "1") {
        // 患者交接
         this.columns = this.columns1;
        this.getHandoverShiftQuery();
      } else {
        // 晨班交接
        this.columns = this.columns2;
        this.getMorningShiftQuery();
      }
    },
    // 患者交接
    getHandoverShiftQuery() {
      this.tableData = []
      let params = {
        "AreaType": this.searchArea,
        "EndTime": this.searchDate||GetFormatDateTime('yyyy-MM-dd',new Date()),
        "ScheduleId": this.selectSchedule,
        "HandOverDoctorId": this.selectDoctor
      };
      this.$Api.getHandoverShiftQuery(params).then(res => {
        if (res.Status) {
          this.tableData = res.Data;
        }
      });
    },
    // 晨班交接
    getMorningShiftQuery() {
      this.tableData = []
      let params = {
        "AreaType": this.searchArea,
        "BeginTime": (this.searchDateSE&&this.searchDateSE[0])||GetFormatDateTime('yyyy-MM-dd',new Date()),
        "EndTime": (this.searchDateSE&&this.searchDateSE[1])||GetFormatDateTime('yyyy-MM-dd',new Date()),
        "HandOverDoctorId": this.selectDoctor
      };
      this.$Api.getMorningShiftQuery(params).then(res => {
        if (res.Status) {
          this.tableData = res.Data;
        }
      });
    },
  },
  watch: {
    selectTab: {
      immediate: true,
      handler: function(newValue) {
        console.log(newValue);
        if (newValue == "1") {
          // 患者交接
          this.columns = this.columns1;
          this.getHandoverShiftQuery();
          this.getHandoverDoctorList(3)
        } else {
          // 晨班交接
          this.columns = this.columns2;
          this.getMorningShiftQuery();
          this.getHandoverDoctorList(2)
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
.shiftDutyQuery {
height: 100%;
box-sizing: border-box;
padding: 10px 0px 4px 0;
  .head {
    overflow: hidden;
    margin-bottom: 10px;
    .left {
      float: left;
      margin-bottom: 10px;
    }
    .right {
      float: right;
      display: flex;
      div {
        margin-right: 10px;
      }
    }
  }
  .content {
    height: calc(~"(100% - 80px)");
    overflow: auto;
    /deep/ .el-table {
      margin-top: 0;
    }
    /deep/.el-table__expand-icon > .el-icon {
      display: none;
    }
    /deep/.el-table__expanded-cell[class*="cell"] {
      padding: 0 10px;
    }
  }
  .bottom {
    height: 32px;
    // padding: 4px 0;
    padding-top: 4px;
    //border: 1px solid rgba(47, 51, 68, 0.4);
    text-align: right;
  }
}
</style>