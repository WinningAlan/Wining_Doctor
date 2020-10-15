<template>
  <div class="patMessageTable">
    <el-table :data="tableData" style="width:100%" @row-click="handleTableRow" v-on="$listeners" v-bind="$attrs">
      <el-table-column
        v-for="(item) in defaultColumns"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :show-overflow-tooltip="true"
        :width="item.width"
        :min-width="item.minWidth"
      >
        <template slot-scope="scope">
          <template v-if="item.prop=='TriageLevel'">
            <svg-icon :iconClass="`level${scope.row.TriageLevel}`" class="tableLevel"></svg-icon>
          </template>
          <template v-else-if="item.prop=='AttentionTag'">
            <div @click.stop="setAttentionTag(scope.row)" v-if="scope.row.ReceptionStatus!=0">
              <img src="../../assets/imges/focus.png" alt v-if="!scope.row.AttentionTag" />
              <img src="../../assets/imges/focusSelect.png" alt v-else />
            </div>
            <div v-else></div>
          </template>
          <template v-else-if="item.prop=='PatientName'">
            <span :class="{'new':scope.row.IsNew}"></span>
            <span :class="{'patContent':scope.row.IsNew}" class="patName">{{scope.row.PatientName}}</span>&nbsp;
            <span class="patSex">{{scope.row.PatGenderCode|sexFilter}}</span>&nbsp;
            <span class="patAge">{{scope.row.AgeYear | ageFilter(scope.row.AgeMonth)}}</span>
          </template>
          <template
            v-else-if="item.prop=='DiagnosisAreaName'&&selectArea.DiagnosisAreaType!=3"
          >{{scope.row.DiagnosisAreaName}}</template>
          <template
            v-else-if="item.prop=='BedNo'&&selectArea.DiagnosisAreaType!=3"
          >{{scope.row.BedNo}}</template>
          <template v-else-if="item.prop=='GreenChannel'">
            <el-tooltip placement="bottom">
              <div slot="content">
                <span
                  style="margin-left:0"
                  :class="greenChannelData[greenChanneType[scope.row.GreenChannel]]"
                ></span>
                <span :class="{'qun':scope.row.IsGroupEvent}"></span>
                <span :class="{'min':scope.row.AllergyHistory}"></span>
                <span :class="{'lv':scope.row.IsArrearsApply}"></span>
                <span :class="{'zhong':scope.row.AttentionTag}"></span>
              </div>
              <div>
                <span
                  :class="greenChannelData[greenChanneType[scope.row.GreenChannel]]"
                ></span>
                <span :class="{'qun':scope.row.IsGroupEvent}"></span>
                <span :class="{'min':scope.row.AllergyHistory}"></span>
                <span :class="{'lv':scope.row.IsArrearsApply}"></span>
                <span :class="{'zhong':scope.row.AttentionTag}"></span>
              </div>
            </el-tooltip>
          </template>
          <template v-else>{{scope.row[item.prop]}}</template>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item,index) in columns"
        :sortable="item.Code==='RegisterTime'?'custom':false"
        :key="item.Code+index"
        :prop="item.Code"
        :label="item.Name"
        :min-width="tableItemWidth[item.Code]&&tableItemWidth[item.Code].minWidth"
        :width="tableItemWidth[item.Code]&&tableItemWidth[item.Code].width"
        :show-overflow-tooltip="item.Code!='PatientIdentification'"
      >
        <template slot-scope="scope">
          <template v-if="item.Code=='WaitingTime'">
            <div
              :class="{'registerOverTime':scope.row.OverTime}"
            >{{scope.row.WaitingTime|changeSecondToTime}}</div>
          </template>
          <template
            v-else-if="item.Code=='NursingLevel'"
          >{{scope.row.NursingLevel|nurseLevelFilter}}</template>
          <template v-else-if="item.Code=='Arrearage'">
            <div class="registerOverTime">{{scope.row.Arrearage}}</div>
          </template>
          <template
            v-else-if="item.Code=='RegisterTime'||item.Code=='InHospTime'||item.Code=='TriageTime'||item.Code=='ReceptionTime'||item.Code=='OutHospTime'"
          >{{scope.row[item.Code]|timeFilter}}</template>
          <template v-else-if="item.Code=='PatientIdentification'">
            <el-tooltip placement="top">
              <div slot="content">
                <span
                  style="margin-left:0"
                  :class="greenChannelData[greenChanneType[scope.row.GreenChannel]]"
                ></span>
                <span :class="{'qun':scope.row.IsGroupEvent}"></span>
                <span :class="{'min':scope.row.IsAllergy}"></span>
                <span :class="{'lv':scope.row.IsArrearsApply}"></span>
                <!-- <span :class="{'zhong':scope.row.AttentionTag}"></span> -->
                <span :class="{'wei':scope.row.IsPeril}"></span>
                <span :class="{'zhong':scope.row.IsHeavy}"></span>
                <span :class="{'shu':scope.row.IsOperation}"></span>
              </div>
              <div>
                <span :class="greenChannelData[scope.row.GreenChannel]"></span>
                <span :class="{'qun':scope.row.IsGroupEvent}"></span>
                <span :class="{'min':scope.row.IsAllergy}"></span>
                <span :class="{'lv':scope.row.IsArrearsApply}"></span>
                <!-- <span :class="{'zhong':scope.row.AttentionTag}"></span> -->
                <span :class="{'wei':scope.row.IsPeril}"></span>
                <span :class="{'zhong':scope.row.IsHeavy}"></span>
                <span :class="{'shu':scope.row.IsOperation}"></span>
              </div>
            </el-tooltip>
          </template>
          <template v-else>{{scope.row[item.Code]}}</template>
        </template>
      </el-table-column>
      <el-table-column
        prop="ReceptionStatusDesc"
        label="就诊状态"
        v-if="router!='caseControl'"
        width="80"
      >
        <template slot-scope="scope">{{scope.row.ReceptionStatusDesc}}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <slot :scope="scope"></slot>
        </template>
      </el-table-column>
    </el-table>
    <div class="noData" v-if="tableData.length==0&&showPatListLoading==false">
      <svg-icon iconClass="searchNoData" class="noDataImg"></svg-icon>
      <div class="noDataWord">没有找到符合条件的结果</div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { greenChannelData, tableItemWidth } from "@/module/staticData.js";
import { setSession } from "@/utils/storage";
import CallNumber from "@/utils/callNumber.js";
export default {
  props: {
    getPatientList: Function,
    columns: Array, //可配置项列
    defaultColumns: Array, //固定显示列
    router: {
      type: String,
      default: "home"
    },
    setAttentionTag: Function, //设置是否重点关注
    showPatListLoading: Boolean //
  },
  data() {
    this.startTime = 0;
    return {
      greenChannelData: greenChannelData,
      callNumberOperation: {},
      tableItemWidth: tableItemWidth,
      tooltipCode: ["PatientIdentification"]
    };
  },
  computed: {
    ...mapGetters({
      tableData: "public/GET_PATIENTTABLELIST",
      selectArea: "home/GET_SELECTAREA",
      inHosPatRouter: "configuration/GET_INHOSPATDATAROUTER",
      clinicPatRouter: "configuration/GET_CLINICPATDATAROUTER",
      isQueueNumber: "configuration/GET_ISQUEUENUMBER", //是否启用排队叫号系统
      callNumberName: "configuration/GET_CALLNUMBER" ,//叫号操作系统
      greenChanneType:"public/GET_GREENCHANNETYPE",//绿色通道图标
    })
  },
  mounted() {},
  methods: {
    async handleTableRow(row) {
      this.$store.commit("public/SET_PATIENTMSG", row);
      if (this.router == "caseControl") {
        this.$router.push({
          name: "medicalHistory",
          query: { id: row.Id, from: this.router }
        });
        return;
      }
      // 三种情况
      // 1.抢救留观患者是跳
      if (this.selectArea.DiagnosisAreaType != 3) {
        this.$router.push({
          name: this.inHosPatRouter,
          query: { id: row.Id, from: this.router }
        });
      } else {
        // 2.门急诊待接诊跳
        if (row.ReceptionStatus == 0) {
          let now = new Date().getTime();
          if (now - this.startTime > 3000) {
            this.startTime = now;
          } else {
            return;
          }
          let paramsPat = {
            TriageId: row.TriageId,
            ActiveRegistId: row.ActiveRegistId
          };
          try {
            let rr = await this.$Api.getPersonMessageById(paramsPat);
            if (rr.Status && rr.Data && rr.Data.length) {
              row = rr.Data[0];
              this.$store.commit("public/SET_PATIENTMSG", row);
            }
          } catch (error) {
            console.log(error, "error");
          }
          let params = {
            triageId: row.TriageId,
            patientId: row.PatientId,
            registerId: row.ActiveRegistId,
            departmentCode: row.DepartmentCode,
            triageLevel: row.TriageLevel
          };
          this.$Api.patReceive(params).then(res => {
            if (res.Status) {
              setSession("currentPat", { currentPat: row });
              this.$router.push({
                name: this.clinicPatRouter,
                query: { id: res.Data, from: this.router }
              });
            }
          });
        } else {
          setSession("currentPat", { currentPat: row });
          // 3.门急诊就诊中
          //this.goonDoctor(row);
          this.$router.push({
            name: this.clinicPatRouter,
            query: { id: row.Id, from: this.router }
          });
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
.patMessageTable {
  padding: 0 25px;
  //height: 100%;
  // overflow: auto;
  height: calc(~"(100% - 50px)");
  overflow: hidden;
  position: relative;
  /deep/ .el-table .cell,
  /deep/ .el-table th div {
    padding-right: 0 !important;
  }
  .noData {
    //height: 100%;
    position: absolute;
    top:50%;
    left: 50%;
    text-align: center;
    margin-left: -100px;
    margin-top: -70px;
    //margin-top:30px;;
    .noDataImg {
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

  /deep/ .el-table__row {
    cursor: pointer;
  }
  .tableLevel {
    width: 19px;
    height: 19px;
  }
  /deep/.el-button--text {
    color: @blueMain;
    font-size: 14px;
  }
  .registerOverTime {
    color: #f52c2c;
  }
  .patMes {
    line-height: 48px;
  }
  .patMessage {
    span:nth-child(1) {
      font-size: 12px;
    }
  }
  .patContent {
    margin-left: 10px;
  }
  .patName {
    color: #000622;
    font-weight: bold;
    font-size: 14px;
  }
  .patSex,
  .patAge {
    opacity: 0.4;
  }
}
</style>