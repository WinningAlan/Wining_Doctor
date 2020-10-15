<template>
  <div class="bloodRe" >
    <el-table :data="bloodDetailData" @row-click="handleRow" style="width:100%" ref="table">
        <el-table-column type="expand" width="1">
          <template slot-scope="scope">
            <slot name="expand" :scope="scope">展开备注</slot>
          </template>
        </el-table-column>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="Status" label="状态" width="100">
          <template slot-scope="scope">
            <span class="bg" :class="'bg'+scope.row.Status">
              {{scope.row.Status| statusFilter(1,statusOptions) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="Target" label="输血目的"></el-table-column>
        <el-table-column prop="Price" label="费用"></el-table-column>
        <el-table-column prop="ApplyUser" label="申请医师"></el-table-column>
        <el-table-column prop="ApplyTime" label="申请时间">
          <template slot-scope="scope">
            {{scope.row.ApplyTime|timeFilter}}
          </template>
        </el-table-column>
        <el-table-column prop label="操作" width="230">
          <template slot-scope="scope">
            <slot :scope="scope" name="handle" :viewRecord="getDetail"></slot>
          </template>
        </el-table-column>
      </el-table>
  </div>
</template>
<script>
import {statusOptions} from '@/module/staticData'

export default {
  data() {
    return {
      statusOptions:statusOptions,
      isExpand:false
    };
  },
  methods:{
    getDetail(row) {
      this.isExpand = !this.isExpand
      this.$nextTick(() => {
        this.$refs.table.toggleRowExpansion(row,this.isExpand)
      })
    }
  },
  props:{
    handleRow:Function,//点击表格数据
    bloodDetailData:Array,//用血详细信息
  },
};
</script>
<style lang="less" scoped>
.bloodRe{
  /deep/.el-table__expand-icon>.el-icon{
  display: none;
}
 /deep/ .el-table__row {
   cursor: pointer;
 }
}

</style>>