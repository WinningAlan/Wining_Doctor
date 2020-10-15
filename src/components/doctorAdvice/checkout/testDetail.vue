<template>
  <el-table :data="deatilData" ref="table">
    <el-table-column prop="ApplicationFormName" label="申请单">
       <template slot-scope="scope">
        <p>{{scope.row.TestFormModel.ApplicationFormName}}</p>
      </template>
    </el-table-column>
    <el-table-column prop="OrderDetails" label="检验项目" width="400">
      <template slot-scope="scope">
        <div class="advice-content">
          <div class="advice-content-content">
            <p
              v-if="scope.row.OrderDetails"
              v-for="(item, index) in scope.row.OrderDetails"
              :key="index"
            >{{item.DictItemName}}&nbsp;&nbsp;{{item.SampleName}}&nbsp;&nbsp;</p>
          </div>
          <div class="jianca" v-if="scope.row.TestFormModel">
            <span class="icon-urgency" v-if="scope.row.TestFormModel.IsEmergency"></span>
            <span class="icon-out" v-if="scope.row.TestFormModel.IsOtherTest"></span>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="TestFormModel" label="检验科室">
      <template slot-scope="scope">
       <p>{{scope.row.TestFormModel.ExcuteDepartmentName }}</p>
      </template>
    </el-table-column>
     <el-table-column prop="OrderDetails" label="费用">
      <template slot-scope="scope">
        <p>{{scope.row.OrderDetails | priceFilter}}</p>
      </template>
    </el-table-column>
    <el-table-column prop="CreateUserName" label="申请人"></el-table-column>
    <el-table-column label="申请时间"  width="200">
      <template slot-scope="scope">
        <p>{{scope.row.TestFormModel.ApplyTime | timeFilter}}</p>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
// import {mapGetters} from "vuex"
export default {
  props: {
    deatilData: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
   filters: {
    priceFilter(checkArr) {
      let num = 0;
      checkArr.forEach(item => {
        num += item.Price;
      });
      return (+num).toFixed(2);
    }
  },
  // computed:{
  //   ...mapGetters({
  //     allDep:"public/GET_ALLDEPARTMENTS"
  //   })
  // }
};
</script>
<style lang="less" scoped>
.advice-content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
}
// .icon-bed,
// .icon-urgency {
//   display: inline-block;
//   width: 18px;
//   height: 18px;
//   color: #0071e7;
//   text-align: center;
//   border: 1px solid #0071e7;
//   border-radius: 50%;
//   line-height: 18px;
//   background: rgba(0, 113, 231, 0.1);
// }
// .icon-urgency {
//   margin-left: 20px;
// }
// .icon-bed::after {
//   content: "床";
// }
// .icon-urgency::after {
//   content: "急";
// }
</style>