<template>
  <el-table :data="tableData" height="90%" @row-click="selectOne">
    <el-table-column label="申请单" prop="Index" width="80"></el-table-column>
    <el-table-column label="状态" prop="Status" width="100">
      <template slot-scope="scope">
        <div class="status">
          <!-- <span v-if="scope.row.Status===1" class="status1">已保存</span>
          <span v-if="scope.row.Status===2" class="status2">已提交</span>
          <span v-if="scope.row.Status===3" class="status3">已审核</span>
          <span v-if="scope.row.Status===4" class="status4">退回</span>
          <span v-if="scope.row.Status===5" class="status5">执行中</span> -->
           <span class="bg" :class="'bg'+scope.row.Status">{{scope.row.Status | statusFilter(1,statusOptions)}}</span>

        </div>
      </template>
    </el-table-column>
    <el-table-column label="手术项目" prop="OperationName"></el-table-column>
    <el-table-column label="手术类型" prop="OperationTypeName"></el-table-column>
    <el-table-column label="主刀医师" prop="MianDoctorName"></el-table-column>
    <el-table-column label="手术室" prop="OperationRoomName"></el-table-column>
    <!-- <el-table-column label="费用" prop="Fee" width="100">
    </el-table-column>-->
    <el-table-column label="申请医师" prop="ApplyUserName" width="100"></el-table-column>
    <el-table-column label="申请时间" prop="ApplyTime">
      <template slot-scope="scope">{{scope.row.ApplyTime |timeFilter}}</template>
    </el-table-column>
    <el-table-column label="操作" width="180">
      <template slot-scope="scope">
        <slot name="dd" :scope="scope"></slot>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import { statusOptions } from "@/module/staticData";

export default {
  name: "operationTable", //手术历史表格
  data() {
    return {
      statusOptions: statusOptions
    };
  },
  props: {
    tableData: {
      type: Array,
      default: () => {
        [];
      }
    },
    callback: {
      type: Function,
      default: () => {}
    }
  },
  methods: {
    selectOne(row) {
      this.callback(row);
    }
  }
};
</script>
<style lang="less" scoped>
/deep/ .el-table__body {
  cursor: pointer;
}
// .status {
//   span {
//     width: 58px;
//     height: 24px;
//     font-size: 13px;
//     border-radius: 2.4px;
//     text-align: center;
//     display: inline-block;
//     line-height: 24px;
//     &:nth-child(1) {
//       background: rgba(0, 113, 231, 0.1);
//       color: #0071e7;
//     }
//     &:nth-child(2) {
//       background: #dee2ff;
//       color: #6971ab;
//     }
//   }

// }
.status {
  span {
    width: 58px;
    height: 24px;
    font-size: 13px;
    border-radius: 2.4px;
    text-align: center;
    display: inline-block;
    line-height: 24px;
  }
  .status1 {
    background: rgba(0, 113, 231, 0.1);
    color: #0071e7;
  }
  .status2 {
    background: #dee2ff;
    color: #6971ab;
  }
}
</style>