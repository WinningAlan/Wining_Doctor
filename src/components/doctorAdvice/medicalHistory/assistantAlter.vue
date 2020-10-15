<template>
  <div class="assistantAlter">
    <el-radio-group v-model="alterData.activeName" fill="#0071E7">
      <el-radio-button
        :label="item.value"
        v-for="(item, index) in alterData.list"
        :key="index"
      >{{item.text}}</el-radio-button>
    </el-radio-group>
    <div class="assistant-alter-content">
      <el-radio-group
        v-model="navListActive[alterData.activeName]"
        class="formula-left"
        v-if="leftNavList[alterData.activeName]"
      >
        <el-radio-button
          :label="item.value"
          v-for="(item, index) in leftNavList[alterData.activeName]"
          :key="index"
        >{{item.text}}</el-radio-button>
      </el-radio-group>
      <div class="formula-right" v-show="alterData.activeName===1">
        <bodySurfaceArea
          v-for="(item, index) in calculatorData"
          :key="index"
          :formulaData="item"
          :ref="`calculator${index}`"
          v-show="navListActive[alterData.activeName]==index"
        ></bodySurfaceArea>
      </div>
      <div class="formula-right no-border" v-show="alterData.activeName===2">
        <div class="group-warp" v-for="(item, index) in specificSymbolData" :key="index">
          <p class="group-name">{{item.groupName}}</p>
          <ul class="item-list">
            <li
              class="item"
              @click="setSpecific(el)"
              :class="{active:el===specificActive}"
              v-for="(el, index) in item.itemList"
              :key="index"
              v-html="el"
            ></li>
          </ul>
        </div>
      </div>

      <div class="formula-right" v-show="alterData.activeName===4" ref="medicalTable">
        <medicalTable
          :column="medicalTableColumns[navListActive[4]+'Columns']"
          :tableData="medicalTableData[navListActive[4]+'Data']"
        ></medicalTable>
      </div>
    </div>
    <p class="alter-button">
      <slot name="close"></slot>
      <el-button type="primary" @click="insert(alterData.activeName)">插入病历</el-button>
    </p>
  </div>
</template>

<script>
import myKeypad from "./myKeypad.vue";
// import bodySurfaceArea from "./bodySurfaceArea.vue";
import {
  recordColumns,
  pathologicReflex6Columns,
  gcsGrade2Columns,
  nutritionGradeColumns
} from "../../../module/tableColumns.js";
import {
  bodySurfaceAreaData,
  bodyMassIndexData,
  carboplatinValueData,
  waistHipRatioData,
  plasmaOsmoticPressureData,
  thrombocyteData,
  mdrdData,
  theSugarData,
  formulaList,
  medicalTableList,
  recordData,
  pathologicReflex6Data,
  gcsGrade2Data,
  nutritionGradeData,
  specificSymbolData,
  reviseCcrData
} from "../../../module/staticData";
import medicalTable from "./medicalTable";
import bodySurfaceArea from "./bodySurfaceArea.vue"
const specialControl = {
  牙位图: "toothBitmap,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,",
  月经史: "menstrualHistory,,,",
  胎心: "fetalHeartTu,,,,,,,"
};
export default {
  name: "assistantAlter", //病历助手弹窗
  components: {
    myKeypad,
    // bodySurfaceArea: () => import("./bodySurfaceArea.vue"),
    bodySurfaceArea,
    medicalTable
  },
  props: {
    alterData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      specificActive: "", //选中的符号
      specificSymbolData: specificSymbolData, //特殊字符
      leftNavList: {
        1: formulaList,
        4: medicalTableList
      }, //左侧导航数据
      medicalTableColumns: {
        recordColumns,
        pathologicReflex6Columns,
        gcsGrade2Columns,
        nutritionGradeColumns
      }, //插入表格列头
      medicalTableData: {
        recordData,
        pathologicReflex6Data,
        gcsGrade2Data,
        nutritionGradeData
      }, //插入表格数据
      calculatorData: [
        bodySurfaceAreaData,
        bodyMassIndexData,
        carboplatinValueData,
        waistHipRatioData,
        plasmaOsmoticPressureData,
        thrombocyteData,
        mdrdData,
        theSugarData,
        reviseCcrData
      ], //   各种计算器数据
      navListActive: {
        1: "0",
        4: "record"
      } //左侧导航当前项
    };
  },
  methods: {
    // 点击符号
    setSpecific(value) {
      this.specificActive = value;
    },
    // 插入病历
    insert(activeName) {
      let dom = document.getElementById("medicalNow");
      let str = "";
      switch (activeName) {
        // 表格
        case 4:
          str = this.$refs.medicalTable.innerHTML;
          break;
        // 特殊符号
        case 2:
          str = this.specificActive;
          if (specialControl[str]) {
            dom.contentWindow.postMessage(
              specialControl[str],
              window.URLCONFIG.Emr
            );
            return;
          }
          str='&nbsp;'+ str;
          break;
        // 计算器
        case 1:
          str ='&nbsp;'+ this.$refs[
            "calculator" + this.navListActive["1"]
          ][0].getResult();
          break;
      }
      str &&
        dom.contentWindow.postMessage(
          { type: "insertHtml", msg: str },
          window.URLCONFIG.Emr
        );
    }
  }
};
</script>
<style lang='less'>
.assistantAlter {
  width: 100%;
  box-sizing: border-box;
  height: 658px;
  padding: 20px;
  position: relative;
  .assistant-alter-content {
    padding-top: 15px;
    height: 525px;
    .formula-left {
      width: 148px;
      height: 100%;
      overflow: auto;
      float: left;
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
      height: 100%;
      overflow: auto;

      // overflow: hidden;
      box-sizing: border-box;
      padding-left: 10px;
      border-left: 1px solid #dfe7f5;
      &.no-border {
        border: none;
        padding-left: 0;
      }
    }
    .group-warp {
      position: relative;
      border: 1px solid #dcdfe6;
      margin-top: 20px;
      padding: 12px 5px 5px 5px;
      margin-right: 5px;
      .group-name {
        position: absolute;
        line-height: 24px;
        background: #fff;
        padding: 0 10px;
        top: 0;
        left: 30px;
        transform: translateY(-50%);
      }
      .item-list {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        .item {
          width: 80px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          cursor: pointer;

          border-radius: 3px;
          &:hover {
            background: @controlBg;
          }
          &.active {
            background: #409eff;
            color: #fff;
          }
        }
      }
    }
  }
  .alter-button {
    position: absolute;
    bottom: 10px;
    // width: 100%;
    right: 0;
  }
  .medicalTable {
    tr td {
      font-size: 14px;
    }
  }
}
</style>
