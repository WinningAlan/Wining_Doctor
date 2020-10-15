<template>
  <el-table
    :data="tableData"
    style="width: 100%"
    class="prescription-table"
    row-key="MainOrderId"
    v-bind="$attrs"
    :ref="isSelect?'selection':''"
    v-on="$listeners"
  >
    <el-table-column type="selection" width="40" v-if="isSelect" :reserve-selection="true"></el-table-column>
    <el-table-column :label="isSelect?'医嘱内容':'处方内容'" :min-width="490" class-name="height100">
      <template slot-scope="scope">
        <adviceContent :Isprescription="true" :row="scope.row"></adviceContent>
      </template>
    </el-table-column>
    <el-table-column label min-width="50">
      <template slot-scope="scope">
        <p
          class="item-p"
          v-for="(item, index) in scope.row.prescriptionDetailListInfo"
          :key="index"
        >{{item.Dosage}}{{item.DosageUnit}}</p>
      </template>
    </el-table-column>
    <el-table-column label min-width="110">
      <template slot-scope="scope">{{scope.row.UsageText}}&nbsp;&nbsp;{{scope.row.FrequencyText}}</template>
    </el-table-column>
    <el-table-column label="开立时间" v-if="!isSelect" prop="CreateTime" min-width="90">
      <template slot-scope="scope">{{scope.row.CreateTime |timeFilter}}</template>
    </el-table-column>
    <el-table-column label="开立人" prop="CreateUserName" min-width="70"></el-table-column>
    <el-table-column label="状态" v-if="isSelect" width="80" prop="PrescriptionStatusName"></el-table-column>
  </el-table>
</template>

<script>
import adviceContent from "./adviceContent.vue";

export default {
  name: "prescriptionTable", //处方表格
  components: {
    adviceContent
  },
  data() {
    return {};
  },
  props: {
    isSelect: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  watch: {
    tableData(arr) {
      if (this.isSelect) {
        this.$refs.selection && this.$refs.selection.clearSelection();
        this.$nextTick(() => {
          arr.forEach(el => {
            let off = false;
            if (el.PrescriptionStatusName === "未生成") {
              let day = Math.ceil(
                (+new Date() - new Date(el.OrderTime)) / 86400000
              );
              el.prescriptionDetailListInfo.forEach(item => {
                if (item.DosageUnit===item.MinimumUnit) {
                  off=true
                } else {
                 // 总用量
                let oldNum =
                  day == 1
                    ? 0
                    : (day - 1) * item.Dose * el.MaxNumber -
                      (el.MaxNumber - el.FirstDayTimes) * item.Dose;
                let allNum =
                  day * item.Dose * el.MaxNumber -
                  (el.MaxNumber - el.FirstDayTimes) * item.Dose;
                      console.log(day,el.OrderTime,oldNum,allNum);
                // 换算成最小单位
                let firstDosage=item.FirstDayDosageNum*item[item.DosageUnitCategory===1?"InhospitalFactor": "OutPatientFactor"]
                let dosage = item.Dosage*item[item.DosageUnitCategory===1?"InhospitalFactor": "OutPatientFactor"];
                // 剂量单位=规格单位
                if (item.Unit === item.SpecificationUnit) {
                  allNum = allNum / item.SpecificationFactor;
                  oldNum = oldNum / item.SpecificationFactor;
                }
                console.log(oldNum,allNum,firstDosage,dosage);
                // 数量单位是门诊还是住院单位
                // allNum =
                //   item.DosageUnitCategory == 2
                //     ? allNum / item.DrugStoreFactor
                //     : allNum;
                // oldNum =
                //   item.DosageUnitCategory == 2
                //     ? oldNum / item.DrugStoreFactor
                //     : oldNum;
                if (oldNum <= firstDosage && allNum > firstDosage) {
                  off = true;
                  return;
                }
                allNum = allNum - firstDosage;
                oldNum = oldNum - firstDosage;
                if (Math.floor(oldNum / dosage) < Math.floor(allNum / dosage)) {
                  off = true;
                  return;
                }
                }

              });
            }
            this.$refs.selection.toggleRowSelection(el, off);
          });
        });
      }
    }
  },
};
</script>
<style scoped lang='less'>
.el-table tbody .height100 .cell {
  height: 100%;
  // line-height: 33px;
}
.item-p {
  // line-height: 23px;
  margin-bottom: 14px;
  &:first-child {
    margin-top: 4px;
  }
  &:last-child {
    margin-bottom: 4px;
  }
}
.advice-content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 100%;

  &-group {
    // margin: 5% 0;
    height: 100%;
    width: 13px;

    box-sizing: border-box;
    padding: 15px 5px 15px 0;
    .item {
      width: 8px;
      height: 100%;
      border: 2px solid #979797;
      border-right: none;
    }
  }
  &-name {
    margin-right: 7%;
    padding: 4px 0;
    .item {
      margin-bottom: 14px;
      &:last-child {
        margin: 0;
      }
    }
  }
  .jianca {
    margin-left: 20px;
  }
  .min-item {
    padding-left: 20px;
    font-size: 12px;
    color: rgba(47, 51, 68, 0.7);
  }
}
</style>
