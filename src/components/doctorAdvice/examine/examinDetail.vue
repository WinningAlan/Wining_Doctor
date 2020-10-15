<template>
  <el-table :data="deatilData" ref="table">
    <el-table-column prop="ApplicationFormName" label="申请单"></el-table-column>

    <el-table-column prop="OrderDetails" label="检查项目" width="300">
      <template slot-scope="scope">
        <div class="advice-content">
          <div class="advice-content-content">
            <p
              v-if="scope.row.OrderDetails"
              v-for="(item, index) in scope.row.OrderDetails"
              :key="index"
            >{{item.DictItemName}}&nbsp;&nbsp;{{item.SampleName}}&nbsp;&nbsp;</p>
            <p
              v-if="scope.row.CheckDetailModels"
              v-for="(item, index) in scope.row.CheckDetailModels"
              :key="index"
            >{{item.DictItemName}}&nbsp;&nbsp;</p>
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
    <el-table-column prop="EffectiveTime" label="造影剂">
      <template slot-scope="scope">
        <p>{{scope.row.CheckFormModel.ContrastAgent}}</p>
      </template>
    </el-table-column>
    <el-table-column prop="CheckFormModel" label="检查科室">
      <template slot-scope="scope">
        <p>{{scope.row.CheckFormModel.ExcuteDepartment | departmentFilter(allDep) }}</p>
      </template>
    </el-table-column>
    <el-table-column prop="Price" label="费用" type="index" width="120">
      <template slot-scope="scope">
        <p>{{(scope.row.OrderDetails || scope.row.CheckDetailModels) | price}}</p>
      </template>
    </el-table-column>
    <el-table-column prop="CreateUserName" label="申请人"></el-table-column>
    <el-table-column label="申请时间" width="200">
      <template slot-scope="scope">
        <p>{{scope.row.CheckFormModel.ApplyTime | timeFilter}}</p>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  props: {
    deatilData: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  computed: {
    ...mapGetters({
      allDep: "public/GET_ALLDEPARTMENTS"
    })
  },
  filters: {
    price( arr) {
      let num = 0;
      if (arr.length > 0) {
        arr.forEach(item => {
          num += item.Price;
        });
        return (+num).toFixed(2);
      }
    }
  }
};
</script>
<style lang="less" scoped>
.advice-content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
}

</style>