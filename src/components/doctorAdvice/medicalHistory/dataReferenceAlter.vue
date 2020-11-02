<template>
  <div class="data-reference-alter">
    <div class="cl">
      <el-radio-group v-model="alterData.activeName" fill="#0071E7">
        <el-radio-button
          :label="item.value"
          v-for="(item, index) in alterData.list"
          :key="index"
        >{{item.text}}</el-radio-button>
      </el-radio-group>

      <div class="name-left" v-show="alterData.activeName===1">
        <span>引用内容</span>
        <el-select
          v-model="referName"
          placeholder="请选择引用内容"
          multiple
          filterable
          collapse-tags
          default-first-option
        >
          <el-option
            v-for="item in referList"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
    </div>

    <div class="data-reference-table" 
         v-loading="showLoading"
        element-loading-text="拼命加载中...">
      <submitTable
        v-show="alterData.activeName===1"
        key="1"
        :tableData="diagnosticRecordsData"
        :type="10"
        :options="options"
        @selection-change="selectionChange"
        row-key="Id"
        style="margin-top:0;width:1254px"
      ></submitTable>
      <doctor-advice-list
        :tableData="submitData"
        :isQuote="true"
        v-show="alterData.activeName===2"
        v-bind.sync="filters"
        ref="reference"
        class="reference"
        @selection-change="selectionChange"
      ></doctor-advice-list>
      <simpleTable
        v-show="alterData.activeName===3"
        :tableData="inspectionResultData"
        key="3"
        :isSelect="true"
        @selection-change="selectionChange"
        :row-key="(row=>row.ItemCode+row.ApplyId)"
        style="margin-top:0;width:1254px"
        :columns="inspectionResultColumns"
      ></simpleTable>
      <simpleTable
        v-show="alterData.activeName===4"
        :tableData="testResultData"
        key="4"
        :isSelect="true"
        @selection-change="selectionChange"
        row-key="ReportNo"
        @select="select"
        @select-all="selectAll"
        ref="testResult"
        :expand-row-keys="expandRow"
        class="testResult"
        style="margin-top:0;width:1254px"
        :columns="testResultColumns"
      >
        <span
          slot-scope="{scope}"
          :class="{red:scope.row.CrisisFlag}"
          slot="CrisisFlag"
        >{{!scope.row.CrisisFlag?'正常':'危机'}}</span>

        <el-table-column type="expand" slot="expand" label="检验报告" width="80">
          <template slot-scope="props">
            <simpleTable
              :tableData="props.row.listTestDetail"
              v-if="props.row.listTestDetail.length"
              :isSelect="true"
              row-key="ItemCode"
              :ref="props.row.ReportNo"
              @selection-change="detailChange(props.row.ItemCode,$event)"
              indexLable="序号"
              style="margin-top:0;width:1254px"
              :columns="testDetailColumns"
            ></simpleTable>
            <p v-else style="text-align:center;">暂无报告</p>
          </template>
        </el-table-column>
      </simpleTable>
      <simpleTable
        v-show="alterData.activeName===5"
        :tableData="nursingRecordData"
        :isSelect="true"
        key="5"
        @selection-change="selectionChange"
        row-key="Id"
        style="margin-top:0;width:1254px"
        :columns="nursingRecordColumns"
      ></simpleTable>
      <simpleTable
        v-show="alterData.activeName===6"
        :tableData="signsRecordData"
        key="6"
        :isSelect="true"
        @selection-change="selectionChange"
        row-key="Id"
        style="margin-top:0;width:1254px"
        :columns="signsRecordColumns"
      ></simpleTable>
      <div class="table-warp" v-show="alterData.activeName===7" key="7">
        <el-radio-group v-model="allergyType" class="formula-left" @change="getAllergy">
          <el-radio-button
            :label="item.value"
            v-for="(item, index) in allergyOption"
            :key="index"
          >{{item.text}}</el-radio-button>
        </el-radio-group>
        <div class="formula-right">
          <simpleTable
            v-show="allergyType===1"
            :tableData="allergyData"
            :isSelect="true"
            @selection-change="selectionChange"
            row-key="Id"
            style="margin-top:0;"
            :columns="drugColumns"
          ></simpleTable>
          <simpleTable
            v-show="allergyType===2"
            :tableData="allergyData"
            :isSelect="true"
            @selection-change="selectionChange"
            row-key="Id"
            style="margin-top:0;"
            :columns="foodColumns"
          ></simpleTable>
          <simpleTable
            v-show="allergyType===3"
            :tableData="allergyData"
            :isSelect="true"
            @selection-change="selectionChange"
            row-key="Id"
            style="margin-top:0;"
            :columns="takeColumns"
          ></simpleTable>
          <simpleTable
            v-show="allergyType===4"
            :tableData="allergyData"
            :isSelect="true"
            @selection-change="selectionChange"
            row-key="Id"
            style="margin-top:0;"
            :columns="elseColumns"
          ></simpleTable>
          <simpleTable
            v-show="allergyType===5"
            :tableData="allergyData"
            :isSelect="true"
            @selection-change="selectionChange"
            row-key="Id"
            style="margin-top:0;"
            :columns="untowardColumns"
          ></simpleTable>
          <simpleTable
            v-show="allergyType===6"
            :tableData="allergyData"
            :isSelect="true"
            @selection-change="selectionChange"
            row-key="Id"
            style="margin-top:0;"
            :columns="historyColumns"
          ></simpleTable>
        </div>
      </div>
    </div>
    <p class="alter-button">
      <slot name="close"></slot>
      <el-button
        type="primary"
        @click="insert(selectData[alterData.activeName],alterData.activeName)"
      >引用</el-button>
    </p>
  </div>
</template>

<script>
import doctorAdviceList from "@/components/doctorAdvice/openDoctorAdvice/doctorAdviceList.vue";
import simpleTable from "../../common/simpleTable.vue";
import submitTable from "../diagnose/submitTable";
import {
  inspectionResultColumns,
  testResultColumns,
  signsRecordColumns,
  nursingRecordColumns,
  testDetailColumns,
  drugColumns,
  foodColumns,
  takeColumns,
  elseColumns,
  untowardColumns,
  historyColumns,
} from "../../../module/tableColumns";
import submitTableVue from "../diagnose/submitTable.vue";
import { mapGetters } from "vuex";
import { GetFormatDateTime } from "@/utils/public";
import { allergyOption } from "../../../module/staticData";

const STATUS = {
  体温: "°C",
  脉搏: "次/分",
  心率: "次/分",
  呼吸: "次/分",
  呼吸: "次/分",
  血压: "mmHg",
  血氧: "%",
  出量值: "ml",
  入量值: "ml",
  瞳孔大小左: "mm",
  瞳孔大小右: "mm",
  意识: "",
  病情记录: "",
};
export default {
  name: "dataReferenceAlter", //数据引用
  components: {
    doctorAdviceList,
    simpleTable,
    submitTable,
  },
  props: {
    alterData: {
      type: Object,
      required: true,
    },
  },
  created() {
    console.log(this.alterData, "传递数据");
    this.$Api.getDiagnoseType({}).then((res) => {
      this.options = res.Data || [];
    });
  },
  computed: {
    ...mapGetters({
      patientMsg: "public/GET_PATIENTMSG",
    }),

    // 过滤后提交的医嘱列表
    submitData() {
      return this.doctorAdviceListData.filter((item, index) => {
        item._index = index;
        return (
          this.filters.statusChecked.includes(
            item.EffectiveTime === 1 && item.Status === 5
              ? -item.Status
              : item.Status
          ) && this.filters.effectiveChecked.includes(item.EffectiveTime)
        );
      });
    },
    //展开项
    expandRow() {
      console.log(this.testResultData, "检验详细数据");
      let arr = [];
      this.testResultData.forEach((el) => {
        el.listTestDetail.length && arr.push(el.ReportNo);
        //el.listTestDetail.length && arr.push(el.ReportNo);
      });
      return arr;
    },
  },
  watch: {
    alterData: {
      handler: function (val) {
        let num = val.activeName;
        this.showLoading=true
        switch (num) {
          case 1:
            this.getDiagnoseList();
            break;
          case 2:
            this.getAdviceList();
            break;
          case 3:
            this.getReportResultList(1);
            //this.getReportApplyList(1);
            break;
          case 4:
            this.getReportResultList(2);
            //this.getReportApplyList(2);
            break;
          case 5:
            this.getNursingRecord();
            break;
          case 6:
            this.getTrigeRecord();
            break;
          case 7:
            this.allergyType = 1;
            this.getAllergy(1);
            break;
        }

        console.log(val.activeName, "activeName");
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      filters: {
        statusChecked: [2, 3, 4, 5, -5, 6, 7], //表格状态字段筛选条件
        effectiveChecked: [1, 2], //表格长/临字段筛选条件
      },

      allergyType: 1, //过敏类型
      allergyOption: allergyOption, //过敏类型选项
      allergyData: [], //过敏信息
      // allergyColumns: [], // 过敏表格列名
      // 过敏表格列名
      drugColumns,
      foodColumns,
      takeColumns,
      elseColumns,
      untowardColumns,
      historyColumns,
      options: [], //诊断类型
      selectData: {}, //选中的数据
      selectAllergy: {}, //选中的过敏信息
      detailChecked: {}, //检验详情选中
      doctorAdviceListData: [], //医嘱
      inspectionResultColumns: inspectionResultColumns, //检查结果
      inspectionResultData: [], //检查结果
      testResultColumns: testResultColumns, //检验结果
      testDetailColumns: testDetailColumns, //检验详情
      testResultData: [], //检验结果
      // diagnosticRecordsColumns: diagnosticRecordsColumns, //诊断记录
      diagnosticRecordsData: [], //诊断记录
      signsRecordColumns: signsRecordColumns, //体征记录
      signsRecordData: [], //体征记录
      nursingRecordColumns: nursingRecordColumns, //护理记录
      nursingRecordData: [], //护理记录
      referList: [
        {
          text: "诊断内容",
          value: "DiagnosisName",
        },
        {
          text: "ICD编码",
          value: "ICDCode",
        },
      ],
      referName: ["DiagnosisName"], //引用的内容
      showLoading:false,
    };
  },
  methods: {
    //获取过敏信息
    getAllergy(val) {
      switch (val) {
        case 1:
          this.getMedicine();
          // this.allergyColumns = drugColumns;
          break;
        case 2:
          this.getFoodAllergy();
          // this.allergyColumns = foodColumns;
          break;
        case 3:
          this.getContrasAllergy();
          // this.allergyColumns = takeColumns;
          break;
        case 4:
          this.getOtherAllergy();
          // this.allergyColumns = elseColumns;
          break;
        case 5:
          this.getDrugList();
          // this.allergyColumns = untowardColumns;
          break;
        case 6:
          this.getAllergyHistories();
          // this.allergyColumns = historyColumns;
          break;
      }
    },

    //获取所有的药品过敏列表
    getMedicine() {
      this.$Api
        .getMedicine({
          InHouseId: this.$route.query.id || this.alterData.inHouseId,
        })
        .then((res) => {
          this.showLoading=false
          this.allergyData = res.Data || [];
          !res.Status && this.$msg.warning(res.Message);
        });
    },
    //获取造影剂的信息
    getContrasAllergy() {
      this.$Api
        .getContrasAllergy({
          InHouseId: this.$route.query.id || this.alterData.inHouseId,
        })
        .then((res) => {
          this.showLoading=false
          this.allergyData = res.Data || [];
          !res.Status && this.$msg.warning(res.Message);
        });
    },
    //获取食物的过敏信息
    getFoodAllergy() {
      this.$Api
        .getFoodAllergy({
          InHouseId: this.$route.query.id || this.alterData.inHouseId,
        })
        .then((res) => {
          this.showLoading=false
          this.allergyData = res.Data || [];
          !res.Status && this.$msg.warning(res.Message);
        });
    },
    //其他过敏信息
    getOtherAllergy() {
      this.$Api
        .getOtherAllergy({
          InHouseId: this.$route.query.id || this.alterData.inHouseId,
        })
        .then((res) => {
          this.showLoading=false
          this.allergyData = res.Data || [];
          !res.Status && this.$msg.warning(res.Message);
        });
    },
    //获取药品不良反应
    getDrugList() {
      this.$Api
        .getDrugList({
          InHouseId: this.$route.query.id || this.alterData.inHouseId,
        })
        .then((res) => {
          this.showLoading=false
          this.allergyData = res.Data || [];
          !res.Status && this.$msg.warning(res.Message);
        });
    },
    //获取过敏的历史信息
    getAllergyHistories() {
      this.$Api
        .getAllergyHistories({
          patientId: this.patientMsg.PatientId || this.alterData.PatientId,
        })
        .then((res) => {
          this.showLoading=false
          this.allergyData = res.Data || [];
          !res.Status && this.$msg.warning(res.Message);
        });
    },
    // 手动勾选全部
    selectAll(arr) {
      let data = arr.length
        ? arr
        : this.testResultData.filter((item) => item.listTestDetail.length);
      data.forEach((el) => {
        this.$refs.testResult.$children[0].toggleRowExpansion(el, true);
      });
      this.$nextTick(() => {
        data.forEach((el) => {
          this.$refs[el.ReportNo] &&
            this.$refs[el.ReportNo].$children[0][
              arr.length ? "toggleAllSelection" : "clearSelection"
            ]();
        });
      });
    },
    // 手动勾选
    select(arr, row) {
      console.log(arr, row, "select");
      this.$refs.testResult.$children[0].toggleRowExpansion(row, true);
      let off = this.isChecked(arr, row.ReportNo);
      this.$nextTick(() => {
        this.$refs[row.ReportNo] &&
          this.$refs[row.ReportNo].$children[0][
            off ? "toggleAllSelection" : "clearSelection"
          ]();
      });
    },
    // 是否勾选了该列
    isChecked(arr, id) {
      let off = false;
      arr.forEach((el) => {
        if (el.ReportNo === id) {
          off = true;
        }
      });
      return off;
    },
    //  检验详情选中
    detailChange(id, arr) {
      this.detailChecked[id] = arr;
      console.log(id, arr);
    },
    // 引用
    insert(data = [], type) {
      if (this.alterData.activeName === 7) {
        data = this.selectAllergy[this.allergyType];
      }
      if (this.alterData.activeName === 4) {
        let arr = [...Object.values(this.detailChecked)];
        data = arr;
      }
      if (!data.length) return this.$msg.info("未选中需要引用的数据！");
      let dom = document.getElementById("medicalNow");
      let str = "";
      switch (type) {
        // 诊断
        case 1:
          data.forEach((item) => {
            let arr=this.referName.length?[...this.referName]:[this.referList[0].value]
            arr.forEach((el,i)=>arr[i]=item[el])
            str += `${arr.join(' ')}；`;
          });
          break;
        // 医嘱
        case 2:
          str = this.getAdviceStr(data);
          break;
        // 检查
        case 3:
          data.forEach((item) => {
            str += `${item.ItemName}：${item.Content}；`;
          });
          break;
        // 检验
        case 4:
          str = this.getTestStr();
          break;
        // 护理记录
        case 5:
        case 6:
          data.forEach((item) => {
            str += `${item.Content}；`;
          });
          break;
        // 过敏信息
        case 7:
          data.forEach((item) => {
            str += `${
              this.allergyType == 1 || this.allergyType == 5
                ? item.MedicineName
                : item.Name
            },${
              this.allergyType == 5
                ? item.SeverityTypeDesc
                : this.allergyType == 6
                ? item.AllergyType
                : item.AllergyTypeDesc
            }；`;
          });
          break;
      }
      // return
      str = str.substring(0, str.length - 1);
      str = str
        .replace(/null;/g, "")
        .replace(/null；/g, "")
        .replace(/null/g, "")
        .replace(/undefined/g, "")
        .replace(/undefined;/g, "")
        .replace(/undefined；/g, "");
      if (this.alterData.inHouseId) {
        // 交接班管理处的引用
        str = str
          .replace(/&nbsp;/g, "")
          .replace(/<\/?p[^>]*>/gi, "")
          .replace(/[┏│┗]/g)
          .replace(/undefined/g, "");
        this.alterData.insertContent = str;
        this.alterData.visible = false;
        return;
      }
      str = str.replace(/<\/p[^>]*>/gi, "<br>");
      str = str.replace(/<p[^>]*>/gi, "");
      str &&
        dom.contentWindow.postMessage(
          { type: "insertHtml", msg: str },
          window.URLCONFIG.Emr
        );
      console.log(str);
    },
    // 拼接检验字符串
    getTestStr() {
      let str = "";
      Object.values(this.detailChecked).forEach((el) => {
        let st = "";
        el.forEach((item) => {
          st += `${item.ItemName}:${item.ItemValue}${item.Unit}，`;
        });
        str += `${st.substring(0, st.length - 1)}；`;
      });
      return str;
    },
    // 拼接医嘱字符串
    getAdviceStr(data) {
      let str = "";
      let st = "";
      data.forEach((item) => {
        let type = item.OrderType;
        switch (type) {
          // 手术
          case 15:
            str += `${item.OrderContent}；`;
            break;
          // 治疗、会诊、护理、饮食、文字
          case 1:
          case 0:
          case 5:
          case 3:
          case 122:
          case 31:
            str += `${item.OrderContent}&nbsp; ${item.FrequencyText}&nbsp;；`;
            break;
          // 用血
          case 4:
            st = "";
            let con = "";
            if (item.BloodTypeName) {
              con = `<span>${item.BloodTypeName}&nbsp;RH<sup>${
                item.RH === "阳性" ? "+" : "-"
              }</sup> </span>`;
            }
            item.OrderDetails.forEach((el) => {
              st += `<p>${con}${el.ItemName}&nbsp;${el.Count} ${el.Unit} 静滴&nbsp;ST</p>`;
            });

            // st = st.substring(0, st.length - 4);
            str += `${st} `;
            break;
          // 检查
          case 7:
          //检验
          case 8:
            st = "";
            item.OrderDetails.forEach((el) => {
              st += `<p>${el.DictItemName}</p>`;
            });
            // st = st.substring(0, st.length - 4);
            str += `${st} `;
            break;
          // 药品
          case 14:
            st = "";
            item.OrderDetails.forEach((el) => {
              let groupStr = this.getgroupStr(el);

              st += `${groupStr}${el.Insurance}${
                el.SpecialName && el.SpecialName !== "普通"
                  ? "[" + el.SpecialName + "]"
                  : ""
              }${el.MedicineName}&nbsp; ${el.Dose}${el.Unit}${
                el.GroupNumber === el.GroupCount ? "" : "</p>"
              }`;
            });
            // st = st.substring(0, st.length - 1);
            str += `${st}&nbsp; ${item.UsageText}&nbsp; ${item.FrequencyText}${
              item.OrderDays ? "&nbsp; " + item.OrderDays + "天" : ""
            }</p> `;
            break;
        }
      });
      console.log(str);
      return str;
    },
    // 获取观察项记录
    getTrigeRecord() {
      this.$Api
        .getTrigeRecord({
          inHouseId: this.$route.query.id || this.alterData.inHouseId,
        })
        .then((res) => {
          this.showLoading=false
          if (res.Status) {
            let item = JSON.parse(res.Data) || {};
            // data.forEach(item=>{
            let str = "";
            str += item.Temp
              ? `体温:${item.Temp < 35 ? "体温不升" : item.Temp + "°C"}，`
              : "";
            str += item.HeartRate ? `心率:${item.HeartRate}次/分，` : "";
            str += item.Breath ? `呼吸:${item.Breath}次/分，` : "";
            str += item.SBP ? `血压:${item.SBP}/${item.SDP}mmHg，` : "";
            str += item.SPO2 ? `血氧:${item.SPO2}%，` : "";
            item.Content = str.substring(0, str.length - 1);
            // })
            this.signsRecordData = [item];
            console.log(item);
          } else {
            this.$msg.warning(res.Message);
          }
        });
    },
    // 获取护理记录
    getNursingRecord() {
      this.$Api
        .getNursingRecord({
          inHouseId: this.$route.query.id || this.alterData.inHouseId,
          // inHouseId: '7d3cae89-e6ea-4a15-9958-ab0a012fe867',
          startTime:
            this.$route.name == "medicalHistory"
              ? this.patientMsg.InHospTime
              : this.alterData.InHospTime,
          endTime: GetFormatDateTime(),
        })
        .then((res) => {
          this.showLoading=false
          if (res.Status) {
            let data = JSON.parse(res.Data) || [];
            console.log(data);

            data = data.filter((item, index) => {
              item.Id = index;
              let str = "";
              item.Time = item["日期"] + " " + item["时间"];
              Object.keys(STATUS).forEach((key) => {
                if (item[key]) {
                  if (STATUS[key] === "ml") {
                    str += `${
                      key === "入量值" ? item["入量项目"] : item["出量项目"]
                    }:${item[key]}${STATUS[key]}，`;
                  } else {
                    str += `${key}:${item[key]}${STATUS[key]}，`;
                  }
                }
              });
              item.Content = str.substring(0, str.length - 1);
              return item["护士签名"];
            });
            console.log(data);
            this.nursingRecordData = data;
          } else {
            this.$msg.warning(res.Message);
          }
        });
    },
    //获取诊断数据
    getDiagnoseList() {
      this.$Api
        .getHistoryDiagnoseList({
          inHouseId: this.$route.query.id || this.alterData.inHouseId,
        })
        .then((res) => {
            this.showLoading=false
          if (res.Status) {
            console.log(res.Data);
            this.diagnosticRecordsData = res.Data || [];
          }
        });
    },
    // 选中的数据
    selectionChange(arr) {
      console.log(arr);
      if (this.alterData.activeName === 7) {
        this.selectAllergy[this.allergyType] = arr;
      } else {
        this.selectData[this.alterData.activeName] = arr;
      }
    },
    // 获取医嘱
    getAdviceList() {
      this.$Api
        .getAdviceList({
          inHouseId: this.$route.query.id || this.alterData.inHouseId,
          orderStatus: 2,
        })
        .then((res) => {
            this.showLoading=false
          this.doctorAdviceListData = res.Data || [];
        });
    },
    // 获取检查、检验报告结果
    getReportResultList(type) {
      let params = {
        HisPatientId: this.alterData.HISPatientId,
        ReportType: type,
      };
      this.$Api.getReportResultList(params).then((res) => {
        this.showLoading=false
        console.log(res);
        if (res.Status) {
          if (type === 1) {
            res.Data.forEach((el) => {
              let str = "";
              el.listCheckDetail &&
                el.listCheckDetail.forEach((item) => {
                  if (item.ItemName === "检查结论") {
                    str += `${item.ItemValue}，`;
                  }
                });
              el.Content = str.substring(0, str.length - 1);
            });
          }
          this[type === 1 ? "inspectionResultData" : "testResultData"] =
            res.Data || [];
        }
      });
    },

    getgroupStr(item) {
      let str = "<p>";
      if (item.GroupCount === 1) return str;

      if (item.GroupNumber === 1) {
        str += "┏";
      } else if (item.GroupNumber === item.GroupCount) {
        str += "┗";
      } else {
        str += "│";
      }
      return str;
    },
  },
};
</script>
<style  lang='less'>
.data-reference-alter {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  height: 610px;
  // max-height: 88vh;

  padding: 20px;
  .el-radio-group {
    float: left;
  }
  .name-left {
    float: right;
    line-height: 32px;
    .el-select {
      margin: 0 10px;
    }
  }
  .red {
    color: #ff0000;
  }
  .alter-button {
    position: absolute;
    bottom: 10px;
    // width: 100%;
    right: 0;
  }
  .table-warp {
    height: 472px;
    display: flex;
    .formula-left {
      width: 148px;
      height: 100%;

      margin-right: 10px;
      .el-radio-button {
        display: block;
        /deep/ .el-radio-button__inner {
          padding: 0;
          display: inline-block;
          border-radius: 0;
          width: 148px;
          line-height: 32px;
          text-align: center;
          border: none;
        }
      }
    }
    .formula-right {
      flex: 1;
      overflow: auto;

      // overflow: hidden;
      box-sizing: border-box;
      padding-left: 10px;
      border-left: 1px solid #dfe7f5;
      // overflow: hidden;
      // box-sizing: border-box;
      // padding-left: 10px;
      // border-left: 1px solid #dfe7f5;
      // &.no-border {
      //   border: none;
      //   padding-left: 0;
      // }
    }
  }
  .data-reference-table {
    height: 492px;
    // height: 420px;

    overflow: auto;
    // padding-right: 6px;
    padding-top: 20px;
    box-sizing: border-box;
    .advice-content {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 100%;
    }
  }
  // .el-radio-group {
  //   padding-bottom: 20px;
  // }
  .el-table .cell,
  .el-table th div {
    padding-right: 0 !important;
  }
  tr {
    th,
    td {
      height: 40px;
    }
  }
  .el-table__expanded-cell[class*="cell"] {
    padding: 0 0 0 50px;
  }
  /deep/ .testResult {
    .el-table__expand-icon {
      transform: rotate(0) !important;
      .el-icon {
        margin: 0;
        color: #1989fa;
        position: static;
        &::before {
          content: "查看报告";
        }
      }
    }
  }
}
</style>
