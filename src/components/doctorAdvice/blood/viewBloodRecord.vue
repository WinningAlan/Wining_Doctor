<template>
  <div class="viewBloodRecord">
    <div class="bloodItems">
      <div>血型：{{commonObj.BloodType|bloodTypeFilter(bloodTypeOptions)}}</div>
      <div>RH：{{commonObj.RH}}</div>
      <div>不规则抗体筛查：{{commonObj.IrregularAntibodyScreening==true?'是':'否'}}</div>
      <div>血源：{{commonObj.BloodSource|bloodSourceFilter(bloodsourceOptions)}}</div>
      <div>
        其他：
        {{commonObj.BloodTransfusion==true?'输血史':''}}
        {{commonObj.BloodDonationHistory==true?'献血史':''}}
        {{commonObj.Pregnancy==true?'孕':''}}
        {{commonObj.Fecunditv==true?'产':''}}
      </div>
      <div v-for="(item,index) in bloodData" :key="index">{{item.text}}：{{commonObj[item.key]}}</div>
      <div>用血时间：{{commonObj.UseTime|timeFilter}}</div>
      <div>执行科室：{{commonObj.ExcuteDepartment|excuteDepFilter(allDep)}}</div>
      <div>申请时间：{{commonObj.ApplyTime|timeFilter}}</div>
    </div>
    <div class="bloodRequest">
      <el-table :data="tableData">
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="BloodWay" label="用血方式">
          <template slot-scope="scope">{{scope.row.BloodWay|bloodWayFilter(BloodWay)}}</template>
        </el-table-column>
        <el-table-column prop="ItemName" label="用血要求"></el-table-column>
        <el-table-column prop="Count" label="用量">
          <template slot-scope="scope">{{scope.row.Count}}{{isNaN(parseInt(scope.row.Unit))?'':'*'}}{{scope.row.Unit}}</template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { bloodData } from "../../../module/staticData";
import { mapGetters } from "vuex";
export default {
  props: {
    commonObj: {
      type: Object,
      required: true
    },
    tableData: {
      type: Array
    }
  },
  data() {
    return {
      bloodData: bloodData
    };
  },
  computed: {
    ...mapGetters({
      bloodTypeOptions: "public/GET_BLOODTYPES",
      dict: "public/GET_DICTIONARIES", //字典数据
      allDep: "public/GET_ALLDEPARTMENTS",//执行科室
    }),
    bloodsourceOptions: function(value) {
      return this.dict.BloodSource;
    },
    BloodWay: function(value) {
      return this.dict.BloodWay;
    }
  },
  filters: {
    bloodTypeFilter: function(value, arr) {
      let bloodItem = arr.find(item => {
        if (item.Code == value) {
          return item;
        }
      });
      if (bloodItem) {
        return bloodItem.Name || "";
      }
    },
    bloodSourceFilter: function(value, arr) {
      let bloodItem = arr.find(item => {
        if (item.Value == value) {
          return item;
        }
      });
      if (bloodItem) {
        return bloodItem.Text || "";
      }
    },
    excuteDepFilter: function(value, arr) {
      let depItem = arr.find(item => {
        if (item.Code == value) {
          return item;
        }
      });
      if (depItem) {
        return depItem.Name || "";
      }
    },
    bloodWayFilter: function(value, arr) {
      let wayItem = arr.find(item => {
        if(item.Value==value) {
          return item
        }
      })
      if(wayItem) {
        return wayItem.Text
      }
    }
  }
};
</script>>
<style lang="less" scoped>
.viewBloodRecord {
  padding: 20px;
  .bloodItems {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
        &::after{
      content: "";
      display: block;
        width: 220px;

      height: 0px;
    }
    > div {
      width: 200px;
      margin-right: 20px;
      margin-bottom: 20px;
    }
  }

}
</style>