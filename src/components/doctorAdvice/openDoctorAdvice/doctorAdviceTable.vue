<template>
  <el-table
    :data="adviceData"
    style="width: 100%"
    :default-expand-all="type==='expand'"
    ref="doctorAdviceTable"
    class="doctorAdviceTable"
    v-bind="$attrs"
    v-on="$listeners"
    @cell-dblclick="dblclick"
    @row-click="rowClick"
  >
    <el-table-column v-if="type=='index'" type="index" width="50"></el-table-column>
    <el-table-column type="expand" v-if="type=='expand'" width="1">
      <template slot-scope="props">
        <el-checkbox-group v-model="props.row.CheckedList" :min="1">
          <el-checkbox
            :label="item.ChargeItemCode"
            v-for="item in props.row.ChargeItems"
            :key="item.ChargeItemCode"
          >{{item.ChargeItemName}}</el-checkbox>
        </el-checkbox-group>
      </template>
    </el-table-column>
    <el-table-column
      v-for="(item,index) in columns"
      :key="index"
      :label="item.text"
      :min-width="item.width"
      :width="item.maxWidth"
      show-overflow-tooltip
      :fixed="item.fixed"
      :className="index===columnsIndex?'pointer':''"
      :align="item.align||'left'"
      :header-align="item.headerAlign||'left'"
    >
      <template slot-scope="scope">
        <slot :scope="scope" :name="item.value">
          <template v-if="item.editType">
            <el-select
              v-if="item.editType==='select'"
              v-model="scope.row[item.value]"
              :clearable="item.isClear"
              placeholder="请选择"
              automatic-dropdown
              collapse-tags
              :multiple="item.multiple"
            >
              <el-option
                v-for="items in item.options "
                :key="items[item.key?item.key:'Value']"
                :label="items[item.label?item.label:'Text']"
                :value="items[item.key?item.key:'Value']"
              ></el-option>
            </el-select>
            <el-checkbox v-model="scope.row[item.value]" v-else-if="item.editType==='switch'"></el-checkbox>
            <el-input-number
              v-else-if="item.editType==='number'"
              v-model="scope.row[item.value]"
              label="描述文字"
              :precision="item.precision"
              placeholder="请输入内容"
              :min="item.min"
              :max="item.max"
              controls-position="right"
            ></el-input-number>
            <el-input v-else v-model="scope.row[item.value]" placeholder="请输入内容"></el-input>
          </template>
          <template v-else>
            <span
              v-if="item.formatter"
              v-text="formatter(scope.row[item.value],item.options,item.formatter)"
            ></span>
            <template v-else>{{scope.row[item.value]}}</template>
          </template>
        </slot>
      </template>
    </el-table-column>
    <el-table-column width="40">
      <!-- <el-popover
    placement="top-start"
    title="标题"
    width="200"
    slot-scope="scope" 
    trigger="click"
    content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
      <span slot="reference" class="delelt" >X</span>
      </el-popover>-->
      <svg-icon
        iconClass="del"
        slot-scope="scope"
        class="delete"
        @click.stop="deleteItem(scope.row)"
      ></svg-icon>

      <!-- <span slot-scope="scope" class="el-icon-delete delete" @click="deleteItem(scope.$index)"></span> -->
    </el-table-column>
  </el-table>
</template>

<script>
// - text: 显示在表头的文字
// - value: 对应 data 的 key。treeTable 将显示相应的 value
// - editType: string [select,text,switch,number,time，timeSelect]。是否可编辑，为空不可编辑，控件类型
// - rules: object控件类型为text时表单验证规则 使用方法参照element-ui-form
// - width: 每列的宽度，为一个数字(可选)。例如`200`
// - options: editType 为select时必填，下拉框选项
// - formatter: 数据过滤函数接受参数值value，和规则Arr
// - isFirst: `true` or `false`。若为 true，则该列只能新增时编辑
// - align: 对齐方式 `left/center/right`
// - header-align: 表头对齐方式 `left/center/right`

export default {
  name: "doctorAdviceTable", //医嘱控件公用table
  props: {
    // 表格类型 index,expand
    type: {
      type: String,
      default: ""
    },
    // 表头数组
    columns: {
      type: Array,
      required: true
    },
    // 表格数据
    tableData: {
      type: Array,
      required: true
    },
    // 医嘱类型
    orderType: {
      type: Number,
      required: true
    },
    // 需要双击编辑的第几列的单元格
    columnsIndex: {
      type: Number,
      default: 0
    },
    //删除的数据
    callback: {
      type: Function,
      default: () => {}
    }
  },
  computed: {
    adviceData() {
      return this.tableData.filter((item, index) => {
        item._index = index;
        this.$nextTick(() => {
          console.log(11111111);
          this.type === "expand" &&
            item.CheckedList &&
            !item.CheckedList.length &&
            this.$refs.doctorAdviceTable.toggleRowExpansion(item, false);
        });
        return !item.IsDeleted;
      });
    }
    // rowStyle(row) {
    //   return this.type == "expand" ? { cursor: "pointer" } : {};
    // }
  },
  methods: {
    //双击单元格
    dblclick(row, { label }, cell, event) {
      if (label === this.columns[this.columnsIndex].text) {
        console.log(true);
        this.$set(row, "_edit", true);
      }
      console.log(row, label, cell, event);
    },
    // 数据过滤
    //val为值，arr为数组，fn为过滤函数
    formatter(val, arr, fn) {
      return fn(val, arr);
    },
    // 点击行展开
    rowClick(row, event, column) {
      console.log(row, event, column);
      // console.log(row, column, event);
      if (
        this.type == "expand" &&
        column.label !== "标本说明" &&
        column.label !== "检验项目"
      ) {
        if (row.CheckedList.length) {
          this.$refs.doctorAdviceTable.toggleRowExpansion(row);
        } else {
          this.$refs.doctorAdviceTable.toggleRowExpansion(row, false);
        }
      }
    },
    // 删除
    deleteItem(row) {
      this.$confirm("该操作将删除该记录,是否继续?", "", {
        type: "warning"
      })
        .then(() => {
          if (
            this.orderType === 14 ||
            this.orderType === 4 ||
            this.orderType == 1111
          ) {
            this.tableData.splice(row._index, 1);
            this.callback(row);
          } else {
            if (
              row.OrderId &&
              row.OrderId !== "00000000-0000-0000-0000-000000000000"
            ) {
              row.IsDeleted = true;
              this.tableData.splice(row._index, 1, row);
              this.callback(row);
            } else {
              this.tableData.splice(row._index, 1);
              this.callback(row);
            }
          }

          // this.$msg.success("取消新增记录成功");
        })
        .catch(() => {
          this.$msg.info("已取消操作");
        });
    }
  }
};
</script>

<style  lang='less'>
.el-table__body tr.current-row > td {
  background-color: #7fbcee !important;
  /* color: #f19944; */ /* 设置文字颜色，可以选择不设置 */
}
.doctorAdviceTable {
  margin-top: 0;
  /deep/ .el-table__body tr.el-table__row {
    > td {
      background: #fff;
    }
    &.disabled > td {
      background: #f0f0f0;
    }
  }
  .delete {
    cursor: pointer;
    font-size: 16px;
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
}
</style>