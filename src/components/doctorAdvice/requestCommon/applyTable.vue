<template>
  <el-table :data="tableData" ref="table" height="94.5%">
    <el-table-column type="expand" min-width="0" >
      <template slot-scope="props">
        <el-table :data="tableData" class="contentTable">
          <el-table-column
            v-for="(item,index) in childrenColumns"
            :key="index"
            :min-width="item.width"
            :label="item.text"
          >
            <template slot-scope="scope">{{scope.row[item.value]}}</template>
          </el-table-column>
        </el-table>
      </template>
    </el-table-column>
    <el-table-column
      v-for="(item,index) in parentColumns"
      :key="index"
      :label="item.text"
      :min-width="item.width"
      :width="item.maxWidth"
      show-overflow-tooltip
      :fixed="item.fixed"
      align="left"
      header-align="left"
    >
      <template slot-scope="scope">
        <slot :scope="scope" :name="item.value">
          <template>{{scope.row[item.value]}}</template>
        </slot>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="180">
      <template slot-scope="scope">
        <slot name="dd" :scope="scope"></slot>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  props: {
    parentColumns: {
      type: Array,
      default: () => {
        return [];
      }
    },
    childrenColumns: {
      type: Array,
      default: () => {
        return [];
      }
    },
    tableData: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    showChildTable(row, bl) {
      this.$refs.table.toggleRowExpansion(row);
    }
  }
};
</script>
<style lang="less" scoped>
.el-table{
  margin: 0;
}
/deep/ .el-table__expand-column.is-leaf {
  padding: 0;
  width: 0;
}
/deep/.el-table__expand-column .cell {
  padding: 0;
  width: 0;
}
/deep/ .el-icon.el-icon-arrow-right {
  &::before {
    content: "";
  }
}
.contentTable {
  margin: 0;
  border: 1px solid #0071e7;
  /deep/.el-table__row {
    border: none;
  }
}
/deep/.el-table td,
.el-table th.is-leaf {
  border-bottom: none;
}
/deep/.el-table tr th {
  background: #f4f8fc;
  height: 30px;
  font-size: 15px;
  color: #2f3344;
  font-weight: 700;
}
/deep/.el-table tr td {
  height: 40px;
  padding: 0;
  font-size: 14px;
  //color: #333333;
  color: @wordColor;
}
/deep/.el-table__expanded-cell[class*="cell"] {
  padding: 0;
}
</style>