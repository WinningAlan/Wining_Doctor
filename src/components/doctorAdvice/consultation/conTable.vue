<template>
  <el-table :data="tableData" height="90%" class="clinic-table" @row-click="handleRow">
    <el-table-column prop="TypeName" label="会诊类型" min-width="100"></el-table-column>
    <el-table-column prop="ConsultationDetails" label="状态" min-width="80">
      <template slot-scope="scope">
        <p
          v-for="(item,index) in scope.row.ConsultationDetails"
          :key="index"
          class="child-item"
          :class="'status'+ item.InvitingStatus"
        >{{item.InvitingStatusName}}</p>
      </template>
    </el-table-column>
    <el-table-column prop="HospitalName" label="受邀会诊医疗机构" min-width="140"></el-table-column>
    <el-table-column prop="DepartmentName" label="受邀科室" min-width="130">
      <template slot-scope="scope">
        <p
          v-for="(item,index) in scope.row.ConsultationDetails"
          :key="index"
          class="child-item"
          style="text-align:left"
        >{{item.DepartmentName}}</p>
      </template>
    </el-table-column>
    <el-table-column prop="DoctorName" label="会诊医生" min-width="90">
      <template slot-scope="scope">
        <p
          v-for="(item,index) in scope.row.ConsultationDetails"
          :key="index"
          class="child-item"
          style="text-align:left"
        >{{item.DoctorName}}</p>
      </template>
    </el-table-column>
    <el-table-column prop="CheckInDate" label="会诊签到时间" min-width="140">
      <template slot-scope="scope">
        <p
          v-for="(item,index) in scope.row.ConsultationDetails"
          :key="index"
           style="text-align:left"
          class="child-item"
        >{{item.CheckInDate | timeFilter}}</p>
      </template>
    </el-table-column>
    <el-table-column prop="StartDate" label="拟会诊时间" min-width="140">
      <template slot-scope="scope">
        <span>{{scope.row.StartDate | timeFilter}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="ApplyName" label="申请医师" min-width="80"></el-table-column>
    <el-table-column prop="ContactName" label="会诊联系人" min-width="90"></el-table-column>
    <el-table-column prop="ContactPhone" label="联系电话" min-width="90"></el-table-column>
    <el-table-column prop="address" label="会诊记录" min-width="80">
      <template slot-scope="scope">
        <p
          v-for="(item,index) in scope.row.ConsultationDetails"
          :key="index"
          class="lookHis"
          @click.stop="item.IsFeedBack&&lookData(item,'look')"
        >{{item.IsFeedBack?'查看':''}}</p>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="80" fixed="right">
      <template slot-scope="scope">
        <div class="list warp" v-if="patientMsg.Status==8">
          <el-tooltip effect="dark" content="打印" placement="top-start">
            <svg-icon iconClass="printlist" class="styleIcon" @click.stop="print(scope.row,'print')"></svg-icon>
          </el-tooltip>
        </div>
        <div v-else>
          <div class="warp" v-if="scope.row.Status !=8 || scope.row.Status != 9">
            <el-popover
              placement="bottom"
              trigger="hover"
              popper-class="edit-more"
              style="padding:0"
            >
              <p
                @click.stop="signIn(scope.row,'signIn')"
                v-if="scope.row.Status==2 || scope.row.Status==3 || scope.row.Status==4 || scope.row.Status==5"
              >签到</p>
              <p
                @click.stop="cancel(scope.row,'cancel')"
                v-if="scope.row.Status==2 || scope.row.Status==3 || scope.row.Status==4"
              >取消</p>
              <p @click.stop="end(scope.row,'end')" v-if="scope.row.Status==6">结束</p>
              <p @click.stop="evaluate(scope.row,'evaluate')" v-if="scope.row.Status==7">评价</p>
              <p
                @click.stop="print(scope.row,'print')"
                v-if="scope.row.Status==2 || scope.row.Status==3 || scope.row.Status==4 || scope.row.Status==7 || scope.row.Status==6"
              >打印</p>
              <p @click.stop="edit(scope.row,'edit')" v-if="scope.row.Status==1">编辑</p>
              <p @click.stop="del(scope.row,'del')" v-if="scope.row.Status==1">删除</p>
              <span slot="reference" class="more">...</span>
            </el-popover>
          </div>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  props: {
    // v-if="scope.row.Status==6"
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
  computed: {
    ...mapGetters({
      patientMsg: "public/GET_PATIENTMSG"
    })
  },
  methods: {
    //点击行
    handleRow(val) {
      this.callback(val, "row");
    },
    //签到
    signIn(val, str) {
      this.callback(val, str);
    },
    //取消
    cancel(val, str) {
      this.callback(val, str);
    },
    //结束
    end(val, str) {
      this.callback(val, str);
    },
    //评价
    evaluate(val, str) {
      this.callback(val, str);
    },
    //打印
    print(val, str) {
      this.callback(val, str);
    },
    edit(val, str) {
      this.callback(val, str);
    },
    del(val, str) {
      this.callback(val, str);
    },
    lookData(val, str) {
      this.callback(val, str);
    }
  }
};
</script>
<style lang="less" >
// .edit-more {
//   padding: 0 !important;
//   width: 0px;
// }
body {
  /deep/ .el-popover.edit-more {
    padding: 0 !important;
    min-width: 70px !important;
  }
}

.clinic-table {
    &.el-table .cell,
  &.el-table th div {
    padding-right: 0 !important;
  }
  .more {
    font-size: 14px;
    display: block;
    width: 30px;
    height: 30px;
    line-height: 25px;
    font-weight: bold;
    text-align: center;
    color: #0071e7;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
  }
  .styleIcon {
    display: inline-block;
    width: 20px;
    height: 20px;
    color: #0071e7;
    margin-right: 10px;
    cursor: pointer;
  }
  .child-item {
    height: 24px;
    line-height: 24px;
    text-align: center;
    margin: 10px 0;
    font-size: 13px;
    padding: 0;
  }
  .status1 {
    background: #f5f5f5;
    color: rgba(47, 51, 68, 0.4);
    border-radius: 2.4px;
    width: 58px;
  }
  .status2 {
    background: #e9fade;
    color: #5db730;
    border-radius: 2.4px;
    width: 58px;
  }
  .status3 {
    background: rgba(0, 113, 231, 0.1);
    border-radius: 2.4px;
    color: #0071e7;
    width: 58px;
  }
  .status4 {
    background: rgba(0, 113, 231, 0.1);
    border-radius: 2.4px;
    color: #0071e7;
    width: 58px;
  }
  .status5 {
    border-radius: 2.4px;
    color: #5292a9;
    width: 58px;
    background: #e3f7f8;
  }
  .status6 {
    background: rgba(0, 113, 231, 0.1);
    border-radius: 2.4px;
    color: #0071e7;
    width: 58px;
  }
  .status7 {
    width: 58px;
    background: #ffeff0;
    border-radius: 2.4px;
    color: #f52c2c;
  }
  .status8 {
    background: rgba(0, 113, 231, 0.1);
    border-radius: 2.4px;
    color: #0071e7;
    width: 58px;
  }
  .lookHis {
    height: 24px;
    line-height: 24px;
    text-align: left;
    color: #0071e7;
    margin: 10px 0;
    // background: red;
    cursor: pointer;
    &:hover {
      font-weight: bold;
    }
  }
}
</style>