<template>
  <div class="shiftDutyTable" :class="{'alertContentStyle':activeName=='4'}" id="table">
    <el-table :data="tableData" v-bind="$attrs" v-on="$listeners " style="width:100%">
        <el-table-column
          type="selection"
          width="35"
          :selectable="handleDisable"
          v-if="activeName!='4'"
        ></el-table-column>
        <el-table-column prop="HandoverShiftStatusName" label="状态" v-if="activeName!='4'">
          <template slot="header" slot-scope="scope">
            <el-popover
              placement="bottom-end"
              width="70"
              trigger="click"
              offset="30"
              popper-class="status"
              v-if="activeName=='1'"
            >
              <el-checkbox
                v-model="isStatusAll"
                @change="changeSelectAll('selectStatusList','sStatusList','statusList','isStatusAll',$event)"
              >全选</el-checkbox>
              <el-checkbox-group
                v-model="sStatusList"
                @change="changeSelectAll('selectStatusList','sStatusList','statusList','isStatusAll',$event)"
              >
                <el-checkbox
                  :label="item.value"
                  v-for="(item,index) in statusList"
                  :key="index"
                >{{item.text}}</el-checkbox>
              </el-checkbox-group>
              <span class="unfold el-icon-caret-bottom" slot="reference">状态</span>
            </el-popover>
            <el-popover
              placement="bottom-end"
              width="70"
              trigger="click"
              offset="30"
              popper-class="status"
              v-else
            >
              <el-checkbox
                v-model="isStatusAll"
                @change="changeSelectAll('selectStatusList','sTStatusList','takeStatusList','isStatusAll',$event)"
              >全选</el-checkbox>
              <el-checkbox-group
                v-model="sTStatusList"
                @change="changeSelectAll('selectStatusList','sTStatusList','takeStatusList','isStatusAll',$event)"
              >
                <el-checkbox
                  :label="item.value"
                  v-for="(item,index) in takeStatusList"
                  :key="index"
                >{{item.text}}</el-checkbox>
              </el-checkbox-group>
              <span class="unfold el-icon-caret-bottom" slot="reference">状态</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="ScheduleName" label="班次" v-if="activeName=='4'"></el-table-column>
        <el-table-column prop="BedNo" label="床号"></el-table-column>
        <el-table-column prop="AreaName" label="区域">
          <template slot="header" slot-scope="scope">
            <el-popover
              placement="bottom-end"
              width="70"
              trigger="click"
              offset="30"
              popper-class="status"
              v-if="activeName!=4"
            >
              <el-checkbox v-model="isAreaAll" @change="changeSelectArea">全选</el-checkbox>
              <el-checkbox-group v-model="sAreaList" @change="changeSelectArea">
                <el-checkbox
                  v-show="item.DiagnosisAreaType!=3"
                  :label="item.DiagnosisAreaType"
                  v-for="(item,index) in user.DiagnosisAreas"
                  :key="index"
                >{{item.DiagnosisAreaName}}</el-checkbox>
              </el-checkbox-group>
              <span class="unfold el-icon-caret-bottom" slot="reference">区域</span>
            </el-popover>
            <span v-else slot="reference">区域</span>
          </template>
        </el-table-column>
        <el-table-column prop="HISPatientId" label="患者ID" v-if="activeName=='4'"></el-table-column>
        <el-table-column prop="PatientName" label="患者" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span class="patName">{{scope.row.PatientName}}</span>&nbsp;
            <span class="patSex">{{scope.row.PatGenderCode|sexFilter}}</span>&nbsp;
            <span class="patAge">{{scope.row.AgeYear | ageFilter(scope.row.AgeMonth)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="IsDangerous" label="危重">
          <template slot="header" slot-scope="scope">
            <el-popover
              placement="bottom-end"
              width="70"
              trigger="click"
              offset="30"
              popper-class="status"
              v-if="activeName!=4"
            >
              <el-checkbox
                v-model="isGraveAll"
                @change="changeSelectAll('selectGraveList','sGraveList','graveList','isGraveAll',$event)"
              >全选</el-checkbox>
              <el-checkbox-group
                v-model="sGraveList"
                @change="changeSelectAll('selectGraveList','sGraveList','graveList','isGraveAll',$event)"
              >
                <el-checkbox
                  :label="item.value"
                  v-for="(item,index) in graveList"
                  :key="index"
                >{{item.text}}</el-checkbox>
              </el-checkbox-group>
              <span class="unfold el-icon-caret-bottom" slot="reference">危重</span>
            </el-popover>
            <span v-else slot="reference">危重</span>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.IsDangerous">√</span>
          </template>
        </el-table-column>
        <el-table-column prop="IsNew" label="新入">
          <template slot="header" slot-scope="scope">
            <el-popover
              placement="bottom-end"
              width="70"
              trigger="click"
              offset="30"
              popper-class="status"
              v-if="activeName!=4"
            >
              <el-checkbox
                v-model="isNewAll"
                @change="changeSelectAll('selectNewList','sNewList','newList','isNewAll',$event)"
              >全选</el-checkbox>
              <el-checkbox-group
                v-model="sNewList"
                @change="changeSelectAll('selectNewList','sNewList','newList','isNewAll',$event)"
              >
                <el-checkbox
                  :label="item.value"
                  v-for="(item,index) in newList"
                  :key="index"
                >{{item.text}}</el-checkbox>
              </el-checkbox-group>
              <span class="unfold el-icon-caret-bottom" slot="reference">新入</span>
            </el-popover>
            <span v-else slot="reference">新入</span>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.IsNew">√</span>
          </template>
        </el-table-column>
        <el-table-column prop="IsOperation" label="手术">
          <template slot="header" slot-scope="scope">
            <el-popover
              placement="bottom-end"
              width="70"
              trigger="click"
              offset="30"
              popper-class="status"
              v-if="activeName!=4"
            >
              <el-checkbox
                v-model="isOperationAll"
                @change="changeSelectAll('selectOperationList','sOperationList','operationList','isOperationAll',$event)"
              >全选</el-checkbox>
              <el-checkbox-group
                v-model="sOperationList"
                @change="changeSelectAll('selectOperationList','sOperationList','operationList','isOperationAll',$event)"
              >
                <el-checkbox
                  :label="item.value"
                  v-for="(item,index) in operationList"
                  :key="index"
                >{{item.text}}</el-checkbox>
              </el-checkbox-group>
              <span class="unfold el-icon-caret-bottom" slot="reference">手术</span>
            </el-popover>
            <span v-else slot="reference">手术</span>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.IsOperation">√</span>
          </template>
        </el-table-column>
        <el-table-column prop="Diagnosis" label="诊断" :show-overflow-tooltip="true"></el-table-column>
        <!-- <el-table-column
          prop="HandoverRemark"
          label="交班重点"
          v-if="activeName=='4'"
          :show-overflow-tooltip="true"
        ></el-table-column> -->
        <el-table-column prop="IsKeyPoint" label="交班重点" v-if="activeName=='4'" >
          <template slot-scope="scope">
            <div class="important">
              <img src="../../assets/imges/handoverImNo.png" alt v-if="!scope.row.IsKeyPoint" />
              <el-tooltip placement="top" v-else>
                <img src="../../assets/imges/handoverIm.png" alt />
                <div slot="content">
                  <div>病情变化：{{scope.row.ConditionsChange}}</div>
                  <div>诊疗经过：{{scope.row.TreatmentProcess}}</div>
                  <div>注意事项：{{scope.row.HandoverRemark}}</div>
                 </div>
              </el-tooltip>
              
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="DoctorName" label="责任医生" v-if="activeName!='4'"></el-table-column>
        <el-table-column prop="HandoverDoctorName" label="交班医生" width="100">
          <template slot="header" slot-scope="scope">
            <el-popover
              placement="bottom-end"
              width="70"
              trigger="click"
              offset="30"
              popper-class="status"
              v-if="activeName=='2'"
            >
              <el-checkbox v-model="isHandoverDotAll" @change="changeSelectDoctor">全选</el-checkbox>
              <el-checkbox-group v-model="sHandoverDotList" @change="changeSelectDoctor">
                <el-checkbox
                  :label="item.Value"
                  v-for="(item,index) in handoverDoctorList"
                  :key="index"
                >{{item.Text}}</el-checkbox>
              </el-checkbox-group>
              <span class="unfold el-icon-caret-bottom" slot="reference">交班医生</span>
            </el-popover>
            <span v-else slot="reference">交班医生</span>
          </template>
          <template
            slot-scope="scope"
            v-if="scope.row.HandoverShiftStatus!=1"
          >{{scope.row.HandoverDoctorName}}</template>
        </el-table-column>
        <el-table-column prop="HandoverDtime" label="交班时间" width="140">
          <template
            slot-scope="scope"
            v-if="scope.row.HandoverShiftStatus!=1"
          >{{scope.row.HandoverDtime|timeFilter}}</template>
        </el-table-column>
        <!-- <el-table-column
          prop="ShiftRemark"
          label="接班重点"
          v-if="activeName=='4'"
          :show-overflow-tooltip="true"
        ></el-table-column> -->
        <el-table-column prop="IsShiftKeyPoint" label="接班重点" v-if="activeName=='4'" >
          <template slot-scope="scope">
            <div class="important">
               <img src="../../assets/imges/takeoverImNo.png" alt v-if="!scope.row.IsShiftKeyPoint" />
               <el-tooltip placement="top" v-else>
                <img src="../../assets/imges/takeoverIm.png" alt />
                <div slot="content">
                  <div>当前病情：{{scope.row.ShiftConditionsChange}}</div>
                  <div>当前处置：{{scope.row.ShiftDisMeasures}}</div>
                  <div>诊疗计划：{{scope.row.ShiftTreatmentPlan}}</div>
                 </div>
              </el-tooltip>
             
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="ShiftDoctorName"
          label="接班医生"
          v-if="activeName=='2'||activeName=='4'"
        >
          <template
            v-if="scope.row.HandoverShiftStatus!=3"
            slot-scope="scope"
          >{{scope.row.ShiftDoctorName}}</template>
        </el-table-column>
        <el-table-column
          prop="ShiftDtime"
          label="接班时间"
          v-if="activeName=='2'||activeName=='4'"
          width="140"
        >
          <template
            slot-scope="scope"
            v-if="scope.row.HandoverShiftStatus!=3"
          >{{scope.row.ShiftDtime|timeFilter}}</template>
        </el-table-column>
        <el-table-column prop="IsKeyPoint" label="交接班重点" v-if="activeName!='4'" width="100">
          <template slot-scope="scope">
            <div class="important">
              <img src="../../assets/imges/handoverIm.png" alt v-if="scope.row.IsKeyPoint" />
              <img src="../../assets/imges/handoverImNo.png" alt v-else />
            </div>
            <div class="important" v-if="activeName=='2'">
              <img src="../../assets/imges/takeoverIm.png" alt v-if="scope.row.IsShiftKeyPoint" />
              <img src="../../assets/imges/takeoverImNo.png" alt v-else />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="90" v-if="activeName!='4'">
          <template slot-scope="scope">
            <slot name="operation" :row="scope.row" />
          </template>
        </el-table-column>
      </el-table>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  props: {
    tableData: {
      type: Array,
      default: function(){
        return []
      }
    },
    selectStatusList: {
      type: Array,
         default: function(){
        return []
      }
    },
    selectAreaList: {
      type: Array,
         default: function(){
        return []
      }
    },
    selectGraveList: {
      type: Array,
         default: function(){
        return []
      }
    },
    selectNewList: {
      type: Array,
       default: function(){
        return []
      }
    },
    selectOperationList: {
      type: Array,
         default: function(){
        return []
      }
    },
    activeName: {
      type: String,
      default: "1"
    },
    handoverDoctorList: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  mounted() {
    let dom = document.getElementById('table')
  },
  data() {
    (this.statusList = [
      { text: "待交班", value: 1 },
      { text: "已交班", value: 3 }
    ]),
      (this.takeStatusList = [
        { text: "待接班", value: 3 },
        { text: "已接班", value: 5 }
      ]),
      (this.graveList = [
        { text: "危重", value: 1 },
        { text: "非危重", value: 2 }
      ]),
      (this.newList = [
        { text: "新入", value: 1 },
        { text: "非新入", value: 2 }
      ]),
      (this.operationList = [
        { text: "手术", value: 1 },
        { text: "非手术", value: 2 }
      ]);
    return {
      sStatusList: [1, 3], //交班
      sTStatusList: [3, 5], //接班
      sAreaList: [1, 2], //
      sNewList: [1, 2],
      sHandoverDotList: [], //筛选医生交班列表
      sOperationList: [1, 2],
      sGraveList: [1, 2],
      isStatusAll: true, //状态全选
      isGraveAll: true, //危重全选
      isNewAll: true, //新入全选
      isOperationAll: true, //手术全选
      isAreaAll: true, //区域是否全选
      isHandoverDotAll: true //交班医生全选
    };
  },
  methods: {
    handleDisable(row) {
      if (this.activeName == "1") {
        return row.HandoverShiftStatus != 3;
      } else {
        return row.HandoverShiftStatus != 5;
      }
    },
    // 状态全选 目前
    // val1  父组件需要改变的数据
    // val2 子组件选中的列表数据
    // val3 子组件定义字典表
    // val4  子组件相应是否全选变量
    changeSelectAll(val1, val2, val3, val4, value) {
      if (typeof value == "boolean") {
        let val3Arr = [];
        this[val3].forEach(item => {
          val3Arr.push(item.value);
        });
        let arr = value ? val3Arr : [];
        this[val2] = arr;
        this.$emit("update:" + val1, arr);
      } else {
        if (value.length == this[val3].length) {
          this[val4] = true;
        } else {
          this[val4] = false;
        }
        this.$emit("update:" + val1, value);
      }
    },
    // 区域筛选
    changeSelectArea(value) {
      let arr = [];
      this.user.DiagnosisAreas.forEach(item => {
        if (item.DiagnosisAreaType != 3) {
          arr.push(item.DiagnosisAreaType);
        }
      });
      if (typeof value == "boolean") {
        this.sAreaList = value ? arr : [];
        //this.$emit("update:selectAreaList", this.sAreaList);
      } else {
        if (value.length == arr.length) {
          this.isAreaAll = true;
        } else {
          this.isAreaAll = false;
        }
      }
    },
    changeSelectDoctor(value) {
      let arr = [];
      this.handoverDoctorList.forEach(item => {
        arr.push(item.Value);
      });
      if (typeof value == "boolean") {
        this.sHandoverDotList = value ? arr : [];
        //this.$emit("update:selectAreaList", this.sHandoverDotList);
      } else {
        if (value.length == arr.length) {
          this.isHandoverDotAll = true;
        } else {
          this.isHandoverDotAll = false;
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      user: "public/GET_USER"
    })
  },
  watch: {
    sStatusList: function(newValue) {
      this.$emit("update:selectStatusList", newValue);
    },
    sAreaList: function(newValue) {
      this.$emit("update:selectAreaList", newValue);
    },
    sNewList: function(newValue) {
      this.$emit("update:selectNewList", newValue);
    },
    sGraveList: function(newValue) {
      this.$emit("update:selectGraveList", newValue);
    },
    sOperationList: function(newValue) {
      this.$emit("update:selectOperationList", newValue);
    },
    sHandoverDotList: function(newValue) {
      this.$emit("update:selectHandoverDoctorList", newValue);
    },
    handoverDoctorList: {
      immediate: true,
      handler: function(newValue) {
        this.sHandoverDotList = [];
        newValue.forEach(item => {
          this.sHandoverDotList.push(item.Value);
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
.alertContentStyle {
  height: 500px !important;
  overflow: auto;
}
.shiftDutyTable {
  overflow: auto;
  padding: 0 10px;
  height: calc(~"(100% - 40px)");
  /deep/.el-button--text{
    font-size: 14px;
  }
  .unfold {
    cursor: pointer;
    font-weight: 700;
    &::before {
      content: "";
    }
    &::after {
      content: "\E60B";
    }
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
  .important {
    display: inline-block;
    img {
      width: 22px;
      height: 22px;
    }
  }
}
</style>
<style lang="less">
.el-popover.el-popper.status {
  min-width: 70px !important;
  > .el-checkbox {
    margin-bottom: 10px;
  }
  .el-checkbox-group {
    width: 66px;
    .el-checkbox {
      margin: 0;
    }
  }
}
</style>