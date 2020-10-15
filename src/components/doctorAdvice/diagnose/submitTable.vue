<template>
  <el-table
    class="diagnoseTable"
    :data="tableList"
    style="width: 100%"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <!-- <el-table-column
        prop="DiagnosisCategory"
        label="主/次"
        width="80">
        <template slot-scope="scope">
           <span v-if="scope.row.DiagnosisCategory==1">主</span>
           <span v-else>次</span>
        </template>
    </el-table-column>-->
    <el-table-column type="selection" v-if="type===10" :reserve-selection="true" width="55"></el-table-column>

    <el-table-column show-overflow-tooltip prop="DiagnosisName" label="诊断内容" min-width="200"></el-table-column>
    <el-table-column show-overflow-tooltip prop="DiagnosisCode" label="ICD疾病编码" min-width="120">
      <template slot-scope="scope">
        <span>{{scope.row.ICDName}}{{scope.row.ICDCode}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="DiagnosisICDType" label="ICD版本" width="80"></el-table-column>
    <!-- <el-table-column
        prop="DiagnosisCode"
        label="诊断Code">
    </el-table-column>-->
    <el-table-column prop="DiagnosisTypeCode" label="诊断类型" width="150">
      <template slot="header" slot-scope="scope">
        <el-popover
          placement="bottom"
          width="80"
          trigger="click"
          :offset="80"
          v-if="isSelect"
          popper-class="DiagnosisTypeCode"
        >
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
          >全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="checkedList" @change="handleCheckedChange">
            <el-checkbox
              v-for="item in options"
              :label="item.DiagnosisTypeCode"
              :key="item.DiagnosisTypeCode"
              style="margin:0"
            >{{item.DiagnosisTypeName}}</el-checkbox>
          </el-checkbox-group>
          <span slot="reference" class="el-icon-caret-bottom unfold">诊断类型</span>
        </el-popover>
        <span v-else>诊断类型</span>
      </template>

      <template slot-scope="scope">
        <span>{{scope.row.DiagnosisTypeCode | typeFilter(options)}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="DoctorName" label="开立人" width="90"></el-table-column>
    <el-table-column prop="RecordDate" label="开立时间" width="180">
      <template slot-scope="scope">
        <span>{{scope.row.RecordDate | timeFilter}}</span>
      </template>
    </el-table-column>
    <el-table-column width="60" label="操作" v-if="type!==10 && patientMsg.Status !=8">
      <template slot-scope="scope">
        <div v-if="type==1">
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <svg-icon iconClass="del" class="delete" @click.stop="deleteItem(scope.row)"></svg-icon>
          </el-tooltip>
        </div>
        <div v-else>
          <el-tooltip class="item" effect="dark" content="引用" placement="top">
            <svg-icon
              iconClass="quote"
              class="quote"
              @click.stop="quote(scope.row)"
             
            ></svg-icon>
          </el-tooltip>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "diagnoseTable", //诊断
  props: {
    tableData: {
      type: Array,
      required: true
    },
    //回调展示数据
    callback: {
      type: Function,
      default: () => {}
    },
    type: {
      type: Number,
      default: 1
    },
    options: {
      type: Array,
      default: () => {
        return [];
      }
    },
    isSelect: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      checkAll: true,
      checkedList: [],
      isIndeterminate: true,
      allList: []
    };
  },
  computed: {
    ...mapGetters({
      patientMsg: "public/GET_PATIENTMSG"
    }),
    tableList(){
      return this.tableData.filter(el=>this.checkedList.includes(el.DiagnosisTypeCode))
    }
  },
  created() {
    //  this.$Api.getDiagnoseType({}).then(res => {
    //   if (res.Status) {
    //      this.options = res.Data
    //      console.log(res.Data)
    //   }
    // });
  },
  filters: {
    typeFilter(val, arr) {
      for (var i = 0; i < arr.length; i++) {
        if (val == arr[i].DiagnosisTypeCode) {
          return arr[i].DiagnosisTypeName;
        }
      }
    }
  },

  methods: {
    deleteItem(row) {
      console.log(row);
      this.$confirm("该操作将删除该记录,是否继续?", "", {
        type: "warning"
      })
        .then(() => {
          this.$Api.delDiagnose({}, {id:row.Id,diagnosisCategory:row.DiagnosisCategory,doctorCode:row.DoctorCode,registerId:row.RegisterId,diagnosisTypeCode:row.DiagnosisTypeCode}).then(res => {
            this.$msg[res.Status ? "success" : "warning"](res.Message);
            if (res.Status) {
              this.callback("del", row);
            }
          });
        })
        .catch(() => {
          this.$msg.info("已取消操作");
        });
    },
    quote(row) {
      this.callback("quote", row);
    },
    handleCheckAllChange(val) {
      console.log(val);
      this.checkedList = val ? this.allList : [];
      this.isIndeterminate = false;
      // this.$emit("upCheck", [...this.checkedList]);
    },
    handleCheckedChange(value) {
      // this.$emit("upCheck", [...value]);
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.options.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.options.length;
    }
  },
  watch: {
    options: {
      handler(val) {
        if (val.length > 0) {
          for (let i = 0; i < val.length; i++) {
            this.allList[i] = val[i].DiagnosisTypeCode;
          }
          this.handleCheckAllChange(true);
          console.log(this.allList);
        }
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style  lang='less'>
.diagnoseTable {
  margin-top: 0;
  /deep/ .el-table__body tr.el-table__row {
    > td {
      background: #fff;
    }
    &.disabled > td {
      background: #f0f0f0;
    }
  }
  .delete,
  .quote {
    cursor: pointer;
    font-size: 18px;
    color: #0071e7;
  }
  /deep/ .pointer {
    cursor: pointer;
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
}
.el-popover.el-popper.DiagnosisTypeCode {
  min-width: 150px !important;
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