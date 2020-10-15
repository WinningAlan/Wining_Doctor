<template>
  <el-table
    :data="tableData"
    style="width: 100%"
    class="doctorAdviceList"
    row-key="OrderId"
    :ref="isDrop?'drop':'reference'"
    :row-class-name="rowClass"
    v-bind="$attrs"
    highlight-current-row
    v-on="$listeners"
          @cell-mouse-enter="moreInfoShow"
      @cell-mouse-leave="moreInfoShow"
  >
    <el-table-column type="expand" width="1" v-if="isDrop">
      <template slot-scope="scope">
        <slot name="expand" :scope="scope" />
      </template>
    </el-table-column>
    <el-table-column type="selection" width="30" :reserve-selection="true" v-if="isSelection" :selectable="selectable"></el-table-column>
    <el-table-column label="状态" width="65" v-if="!isPackage&&!isHistoryData">
      <template slot="header" slot-scope="scope">
        <el-popover
          placement="bottom-end"
          width="70"
          trigger="click"
          offset="30"
          popper-class="status"
        >
          <el-checkbox
            :indeterminate="isStatus"
            v-model="isStatusAll"
            @change="handleCheckAllChange('statusChecked',$event)"
          >全选</el-checkbox>
          <el-checkbox-group
            v-model="checkedStatus"
            @change="checkedStatusChange('statusChecked',$event)"
          >
            <el-checkbox
              v-for="item in statusOptions"
              :label="item.value"
              :key="item.value"
            >{{item.text}}</el-checkbox>
          </el-checkbox-group>
          <span class="unfold el-icon-caret-bottom" slot="reference">状态</span>
        </el-popover>
      </template>
      <span
        slot-scope="scope"
        class="bg"
        :class="'bg'+scope.row.Status"
      >{{ scope.row.Status| statusFilter(scope.row.EffectiveTime,statusOptions) }}</span>
    </el-table-column>
    <el-table-column label="长/临" width="65">
      <template slot="header" slot-scope="scope">
        <el-popover
          placement="bottom-end"
          width="70"
          trigger="click"
          :offset="60"
          popper-class="status"
        >
          <el-checkbox
            :indeterminate="isEffective"
            v-model="isEffectiveAll"
            @change="handleCheckAllChange('effectiveChecked',$event)"
          >全选</el-checkbox>
          <el-checkbox-group
            v-model="checkedEffective"
            @change="checkedStatusChange('effectiveChecked',$event)"
          >
            <el-checkbox :label="2">长</el-checkbox>
            <el-checkbox :label="1">临</el-checkbox>
          </el-checkbox-group>
          <span class="unfold el-icon-caret-bottom" slot="reference">长/临</span>
        </el-popover>
      </template>
      <template slot-scope="scope">{{ scope.row.EffectiveTime===1?'临':'长' }}</template>
    </el-table-column>
    <el-table-column label="开始时间" :min-width="120" v-if="!isPackage">
      <template
        slot-scope="scope"
      >{{ scope.row.StartTime? scope.row.StartTime:scope.row.OrderTime?scope.row.OrderTime:scope.row.CreateTime |timeFilter}}</template>
    </el-table-column>

    <el-table-column label="医嘱内容" :min-width="390" class-name="height100">
      <template slot-scope="scope">
          <el-popover
           v-if="scope.row.Status!==1&&scope.row.DoctorOrderAdviceItems"
            placement="bottom-start"
            width="620"
            :disabled="scope.row.Status===7||scope.row.DoctorOrderAdviceItems.length===0||isQuote"
            :open-delay="200"
            v-model="scope.row.isInfoShow"
            popper-class="info-more"
            trigger="hover"
          >
          <alterConsumables :isShow="false" :alterData="{childData:scope.row.DoctorOrderAdviceItems}"></alterConsumables>
            <advice-content :row="scope.row" :isCheckedCharge="isCheckedCharge"   slot="reference" ></advice-content>
          </el-popover>
            <advice-content :row="scope.row" :isCheckedCharge="isCheckedCharge"  v-else></advice-content>
        
      </template>
    </el-table-column>
        <el-table-column label=""  width="80">
      <template slot-scope="scope">
        <div v-if="scope.row.OrderType===14" >
          <template v-if="scope.row.OrderDetails.length>1">
            <div v-for="(item, index) in scope.row.OrderDetails" :key="index" style="margin-bottom: 14px;">
              <p class="blue m11" :class="{red:item.SkinTestName&&item.SkinTestName.indexOf('阳')>-1,}"> {{item.SkinTestName?item.SkinTestName:'&nbsp;'}}</p>
              <p class="blue" :class="{red:item.SkinTestName&&item.SkinTestName.indexOf('阳')>-1,}"> {{item.SkinMedicinalBatchCode?item.SkinMedicinalBatchCode:'&nbsp;'}}</p>
              <!-- <p>&nbsp;</p> -->
            </div>
          </template>
        <template v-else>
          <p   class="blue" :class="{red:scope.row.OrderDetails[0].SkinTestName&&scope.row.OrderDetails[0].SkinTestName.indexOf('阳')>-1}"> {{scope.row.OrderDetails[0].SkinTestName}}</p>
          <p v-if="scope.row.OrderDetails[0].SkinMedicinalBatchCode"  class="blue" :class="{red:scope.row.OrderDetails[0].SkinTestName&&scope.row.OrderDetails[0].SkinTestName.indexOf('阳')>-1}"> {{scope.row.OrderDetails[0].SkinMedicinalBatchCode}}</p>
        </template>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="执行/停止时间" :min-width="120" v-if="!isPackage&&!isHistoryData">
      <template slot-scope="scope">
        <template v-if="scope.row.Status===1">{{ scope.row.EndTime |timeFilter}}</template>
        <template v-else-if="scope.row.Status===6">{{ scope.row.StopTime |timeFilter}}</template>
        <template v-else-if="scope.row.Status===7">{{ scope.row.InvalidTime |timeFilter}}</template>
        <template v-else>{{ scope.row.EffectiveTime===1&&scope.row.OrderExcuteTime |timeFilter}}</template>
      </template>
    </el-table-column>
    <el-table-column label="开嘱医生" width="80" prop="CreateUserName" v-if="!isPackage"></el-table-column>
    <!--历史医嘱新加-->
    <el-table-column label="审核护士" prop="AuditUserName" v-if="isHistoryData" :width="80"></el-table-column>
    <el-table-column label="停止时间" prop="StopTime" v-if="isHistoryData" :min-width="100">
      <template slot-scope="scope">{{ scope.row.StopTime |timeFilter}}</template>
    </el-table-column>
    <el-table-column label="停嘱医生" prop="StopUserName" v-if="isHistoryData" :width="80"></el-table-column>
    <el-table-column label="执行时间" prop="OrderExcuteTime" v-if="isHistoryData" :min-width="100">
      <template slot-scope="scope">{{ scope.row.OrderExcuteTime |timeFilter}}</template>
    </el-table-column>
    <el-table-column label="执行者" prop="ExcuteUserName" v-if="isHistoryData" :width="80"></el-table-column>
    <!-- <el-table-column label="单价" prop="Price" v-if="isPackage"></el-table-column> -->
    <el-table-column label="备注" prop="Remark" v-if="isPackage"></el-table-column>
    <el-table-column width="60" v-if="!isHistoryData">
      <template slot-scope="scope">
        <svg-icon
          iconClass="del"
          v-if="isDrop&&showEdit&&patientMsg.Status!=8"
          class="delete no"
          @click.stop="deleteItem(scope.row.OrderId,scope.row._index)"
        ></svg-icon>
        <slot name="cost" :scope="scope" />

          <el-tooltip class="item" effect="dark" content="待处理" placement="top-start" v-if="scope.row.Status==4 && patientMsg.Status!=8&&!scope.row.IsAccept">
            <svg-icon
              iconClass="sendBack"
              class="delete no sendBack"
              @click.stop="sendBack(scope.row.OrderId)"
            ></svg-icon>
          </el-tooltip>
       
      </template>

      <!-- <span slot-scope="scope" v-if="scope.row.Status===1" class="el-icon-delete delete" @click="deleteItem(scope.$index)"></span> -->
    </el-table-column>
  </el-table>
</template>

<script>
import adviceContent from "./adviceContent.vue";
import alterConsumables from './alterConsumables.vue';

import { statusOptions } from "@/module/staticData";
import { mapGetters } from "vuex";

import { type } from "@/utils/public";
const statusAll = [1, 2, 3, 4, 5, -5, 6, 7];
export default {
  name: "doctorAdviceList", //医嘱列表
  components: {
    adviceContent,
    alterConsumables
  },
  data() {
    return {
      // rowClass({ row }) {
      //   console.log(this.errorAdvice);
      //   return row.Status === 7 ? "pointer red" : "pointer";
      //   // return row.Status===1?'move ':row.Status===7?'pointer red':'pointer';
      // }, //行class
      isStatusAll: true, //状态是否全选
      isStatus: false, //状态中间状态
      checkedStatus: statusAll, //状态选中值
      isEffectiveAll: true, //长/临是否全选
      isEffective: false, //长/临中间状态
      visible: false,
      checkedEffective: [1, 2], //长/临选中值
      statusOptions: statusOptions,
      sendOrderId: "",
      alterData:{childData:[]}
    };
  },
  computed: {
    ...mapGetters({
      patientMsg: "public/GET_PATIENTMSG",
      isCheckedCharge: "configuration/GET_ISCHECKEDCHARGE" ,//收费小项目是否可选
    })
  },
  mounted() {
    if (this.isQuote) {
      this.statusOptions = this.statusOptions.slice(1);
      this.checkedStatus = this.checkedStatus.slice(1);
    }
  },
  watch: {
    tableData: {
      handler: function(val, oldVal) {
        this.$nextTick(() => {
          this.isDrop && this.rowDrop();
        });
      },
      immediate: true
    }
  },
  props: {
    isSelection: {
      type: Boolean,
      default: true
    },
    tableData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 行是否可以拖拽
    isDrop: {
      type: Boolean,
      default: false
    },
    // 是否是医嘱套餐
    isPackage: {
      type: Boolean,
      default: false
    },
    // 是否是历史医嘱
    isHistoryData: {
      type: Boolean,
      default: false
    },
    // 表格删除按钮是否显示
    showEdit: {
      type: Boolean,
      default: true
    },
    // 状态选中值
    statusChecked: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 长/临选中值
    effectiveChecked: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 是否是数据引用
    isQuote: {
      type: Boolean,
      default: false
    },
    // 错误的医嘱
    errorAdvice:{
            type: Array,
      default: function() {
        return [];
      }
    }
  },
  methods: {
    selectable(row){
      if(this.isHistoryData&&row.OrderType===14&&row._IsHis){
          return !!row.PharmacyNumber
      }else{
        return true
      }
    },
          rowClass({ row }) {
          let str= this.errorAdvice.includes(row.OrderId)?'pointer error':'pointer';
        return row.Status === 7 ? str+' red' : str;
        // return row.Status===1?'move ':row.Status===7?'pointer red':'pointer';
      }, //行class
    //     tableRowClick(row){
    // this.$refs.reference.setCurrentRow(row)
    //     },
    // 行展开收起
    rowExpansion(row, bl) {
      this.$refs.drop.toggleRowExpansion(row, bl);
    },
    // 全选，全清
    checked(type) {
      let dom = this.$refs[this.isDrop ? "drop" : "reference"];
      if (type === "clearSelection") {
        dom.clearSelection();
      } else{
        this.$nextTick(() => {
          this.tableData.forEach(row => {
            dom.toggleRowSelection(row, true);
          });
        });
      }
    },
    // 数据过滤全选
    handleCheckAllChange(type, val) {
      this.checkedStatus = val ? statusAll : [];
      if (type === "statusChecked") {
        this.checkedStatus = val ? statusAll : [];
        this.isStatus = false;
        this.$emit("update:" + type, [...this.checkedStatus]);
      } else {
        this.checkedEffective = val ? [1, 2] : [];
        this.isEffective = false;
        this.$emit("update:" + type, [...this.checkedEffective]);
      }
      console.log(type, val);
    },

    // 数据过滤单选
    checkedStatusChange(type, el) {
      this.$emit("update:" + type, [...el]);

      console.log(el);
      let len = el.length;
      if (type === "statusChecked") {
        this.isStatus = len > 0 && len < 8;
        this.isStatusAll = len === 0 ? false : len === 8;
      } else {
        this.isEffective = len > 0 && len < 2;
        this.isEffectiveAll = len === 0 ? false : len === 2;
      }
    },

    // 删除
    deleteItem(id, index) {
      // this.$parent.deleteAdviceList([id],index)

      console.log(id, index);
      this.$confirm("该操作将删除该医嘱,是否继续?", "", {
        type: "warning"
      })
        .then(() => {
          this.$parent.deleteAdviceList([id], index);
          // console.log(this.$parent.deleteAdviceList());

          // this.$msg.success("取消新增记录成功");
        })
        .catch(() => {
          this.$msg.info("已取消操作");
        });
    },
    // 拖拽元素放入目标元素
    drop(event) {
      let id = event.dataTransfer.getData("id");
      event.preventDefault();
      let toId = "1";
      for (let index = 0; index < event.path.length; index++) {
        const element = event.path[index];
        if (element.className && element.className.indexOf("pointer") > -1) {
          toId = element.getAttribute("data-id");
          break;
        }
      }
      if (toId === id) return;
      let key=this.isPackage?'PackageGroupDrugAdvice':'groupDrugAdvice'
      this.$Api[key]([toId, id]).then(res => {
        console.log(res, "drop");
        this.$msg[res.Status ? "success" : "warning"](res.Message);
        if (res.Status) {
          if (this.isPackage) {
            let id= this.$parent.orderPackageParams.OrderPackageId ||"00000000-0000-0000-0000-000000000000";
            this.$parent.getPackageDetail(id,2);
            
          } else {
          this.$parent.getAdviceList("saveAdviceList");
            
          }
        }
      });
      console.log(id, toId, this.$parent.getAdviceList);
    },
    // 开始拖拽
    dragstart(id, event) {
      console.log(event, id, this);
      event.dataTransfer.setData("id", id);
    },
    //拖拽中
    dragover(event) {
      // console.log(event,'event');
      event.preventDefault();
    },
    //行拖拽
    rowDrop() {
      const tr = document.querySelectorAll(
        ".drop .el-table__body-wrapper tbody >.el-table__row.pointer"
      );
      // const _this = this
      // console.log(tr);
      for (let index = 0; index < tr.length; index++) {
        const el = tr[index];
        // el.draggable=true;
        // console.log(el,index);
        el.setAttribute("data-id", this.tableData[index].OrderId);
        el.ondrop = null;
        el.ondragover = null;
        el.ondragstart = null;
        el.setAttribute("draggable", false);
        if (this.tableData[index].OrderType === 14) {
          el.setAttribute("draggable", true);
          el.ondrop = this.drop;
          el.ondragover = this.dragover;
          el.ondragstart = this.dragstart.bind(
            this,
            this.tableData[index].OrderId
          );
        }
      }
    },
    //接受退回医嘱
    sendBack(id) {
      console.log(id);
      this.sendOrderId = id;
      // this.$store.commit("public/SET_ISSHOW", true);

      this.$confirm("该条医嘱已被护士退回，是否接受本次退回？", "", {
        type: "warning",
        confirmButtonText: "接受",
        cancelButtonText: "拒绝",
        distinguishCancelAndClose: true
      })
        .then(() => {
          let data = {
            MainOrderId: id,
            IsAccept: true,
            InHouseId: this.patientMsg.InHouseId
          };
          this.sendBackAdv(data, true);
        })
        .catch(action => {
          let data = {
            MainOrderId: id,
            IsAccept: false,
            InHouseId: this.patientMsg.InHouseId
          };
          action === "cancel" ? this.sendBackAdv(data, false) : "";
          ;
        });
    },

    sendBackAdv(data, bl) {
      this.$Api.sendBackAdv(data).then(res => {
        console.log("res", res);
        this.$msg[res.Status ? "success" : "warning"](res.Message);
        if (res.Status) {
                this.$parent.getAdviceList("saveAdviceList");
            this.$parent.getAdviceList("doctorAdviceListData");
        }
      });
    },
        moreInfoShow(row, column, cell, event) {
          if(!column.label&&column.width===60)return;
          this.alterData.childData=row.DoctorOrderAdviceItems||[]
          if (row.hasOwnProperty('isInfoShow')) {
            row.isInfoShow = event.type!=='mouseleave';
          } else {
            this.$set(row,'isInfoShow',event.type!=='mouseleave')
          }
    },
  }
};
</script>
<style  lang='less'>
.doctorAdviceList {

  .blue{
    color: dodgerblue ;
  }
        .red {
    color: #e36464;
  }
  .m11{
    margin-top: 11px;
  }
  &.el-table .cell,
  &.el-table th div {
    padding-right: 0 !important;
  }
  tr {
    th,
    td {
      height: 40px;
    }
  }

  margin-top: 0;
  /deep/ .el-table__expanded-cell {
    padding: 0;
  }
  /deep/ .el-icon.el-icon-arrow-right {
    &::before {
      content: "";
    }
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
  .delete,.cost {
    color: #0071e7;
    cursor: pointer;
    font-size: 16px;
  }
  .sendBack {
    font-size: 25px;
    float: left;
  }
  .black{
    color:rgba(47, 51, 68, .4);
  }
}
</style>
<style lang="less">
.el-table {
  &.doctorAdviceList tr th {
    font-size: 14px;
  }
  tbody .height100 .cell {
    height: 100%;
    // line-height: 33px;
  }
  .pointer {
    cursor: pointer;
  }
  // .move{
  //   cursor: move;
  // }
  .red td .cell {
    color: #f52c2c;
  }
  .error td{
    background-color: rgba(245, 44, 44, .15)!important;
    // border-top: 1px solid #f52c2c;
    // border-bottom: 1px solid #f52c2c;
  }
}
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