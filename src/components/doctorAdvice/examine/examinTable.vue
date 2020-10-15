<template>
  <el-table :data="tableData" ref="table" @row-click="selectRow" height="100%"  style="width: 100%;margin-top:0;">
    <el-table-column prop="ApplicationFormName" label="申请单" width="100">
      <template slot-scope="scope">
        <p>{{scope.row.CheckFormModel.ApplicationFormName}}</p>
      </template>
    </el-table-column>
    <el-table-column prop="Status" label="状态" width="80">
      <template slot-scope="scope">
        <div class="status">
          <!-- <span v-if="scope.row.Status===1" class="status1">已保存</span>
          <span v-if="scope.row.Status===2" class="status2">已提交</span>
          <span v-if="scope.row.Status===3" class="status3">已审核</span>
          <span v-if="scope.row.Status===4" class="status4">退回</span>
          <span v-if="scope.row.Status===5" class="status5">执行中</span>
          <span v-if="scope.row.Status===7" class="status7">已作废</span> -->
           <span class="bg" :class="'bg'+scope.row.Status">{{scope.row.Status | statusFilter(1,statusOptions)}}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="OrderDetails" label="检查项目" min-width="280">
      <template slot-scope="scope">
        <div class="advice-content">
          <div class="advice-content-content">
            <p
              v-for="(item, index) in scope.row.OrderDetails"
              :key="index"
            >{{item.DictItemName}}&nbsp;&nbsp;{{item.SampleName}}&nbsp;&nbsp;</p>
          </div>
          <div class="jianca" v-if="scope.row.CheckFormModel">
            <span class="icon-bed" v-if="scope.row.CheckFormModel.IsBed"></span>
            <span class="icon-urgency" v-if="scope.row.CheckFormModel.IsEmergency"></span>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="WordsType" label="媒介项目">
      <template slot-scope="scope">
        <p>{{scope.row.CheckFormModel.Medium}}</p>
      </template>
    </el-table-column>
    <el-table-column prop="EffectiveTime" label="造影剂" >
      <template slot-scope="scope">
        <p>{{scope.row.CheckFormModel.ContrastAgent}}</p>
      </template>
    </el-table-column>
    <el-table-column prop="CheckFormModel" label="检查科室">
      <template slot-scope="scope">
        <p>{{scope.row.CheckFormModel.ExcuteDepartmentName }}</p>
      </template>
    </el-table-column>
    <el-table-column prop="Price" label="费用"  min-width="80">
      <template slot-scope="scope">
        <p>{{scope.row.CheckFormModel | price(scope.row.OrderDetails)}}</p>
      </template>
    </el-table-column>
    <el-table-column prop="CreateUserName" label="申请人"  ></el-table-column>
    <el-table-column label="申请时间" min-width="100">
      <template slot-scope="scope">
        <p>{{scope.row.CheckFormModel.ApplyTime | timeFilter}}</p>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="120" fixed='right'>
      <template slot-scope="scope">
        <slot name="dd" :scope="scope"></slot>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
// import {mapGetters} from "vuex"
import { statusOptions } from "@/module/staticData";

export default {
  // 检查
    data(){
    return {
      statusOptions
    }
  },
  props: {
    tableData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    callback: {
      type: Function,
      default: () => {}
    }
  },
  methods: {
    selectRow(row) {
      this.callback(row);
    }
  },
  filters:{
    price(val,arr){
      let num = 0;
      if(arr.length>0){
        arr.forEach((item)=>{
           num += item.Price
        })
        return (+num).toFixed(2);
      }
    }
  },
  //  computed:{
  //   ...mapGetters({
  //     allDep:"public/GET_ALLDEPARTMENTS"
  //   })
  // }
};
</script>
<style lang="less" scoped>
/deep/ .el-table__body {
  cursor: pointer;
}
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
  .status7{
    background: #FFEFF0;
    color: #F52C2C;
  }
}
.advice-content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
}
</style>