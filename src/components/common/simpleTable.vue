<template>
  <el-table :data="tableData" v-bind="$attrs" v-on="$listeners" class="simple-table">
    <el-table-column type="selection" v-if="isSelect" :reserve-selection='true' :selectable="(row=>!row.listTestDetail ||row.listTestDetail.length>0)" width="55"></el-table-column>
    <el-table-column type="index" v-if="indexLable" :label="indexLable" width="70"></el-table-column>

    <el-table-column
      v-for="(item,index) in columns"
      :key="index"
      :label="item.text"
      :type="item.type"
      :min-width="item.width"
      :width="item.maxWidth"
      :show-overflow-tooltip="isEllipsis"
      :fixed="item.fixed"
      :align="item.align||'left'"
      :header-align="item.headerAlign||'left'"
    >
      <template slot-scope="scope">
        <slot :scope="scope" :name="item.value">
          <span
            v-if="item.formatter"
            v-html="formatter(scope.row[item.value],item.options,item.formatter)"
          ></span>
          <template v-else>{{scope.row[item.value]}}</template>
        </slot>
      </template>;
    </el-table-column>
    <slot name="expand" />
  </el-table>
</template>
<script>
// #### columns(**必填**)

// - text: 显示在表头的文字
// - type: 列的类型 可选参数，默认无（selection/index/expand）
// - value: 对应 data 的 key。treeTable 将显示相应的 value
// - width: 每列的宽度，为一个数字(可选)。例如`200`
// - options: 数据过滤函数时必填
// - formatter: 数据过滤函数接受参数值value，和规则Arr
// - align: 对齐方式 `left/center/right`
// - header-align: 表头对齐方式 `left/center/right`
export default {
  name: "simpleTable", //不可编辑表格通用组件
  props: {
    // 表格数据
    tableData: {
      type: Array,
      required: true,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    // 表格是否可选
    isSelect: {
      type: Boolean,
      default: false
    },

    // index列
    indexLable: {
      type: String,
      default: ""
    },
    isEllipsis:{
      type:Boolean,
      default:true
    }
  },

  methods: {
    // 数据过滤
    //val为值，arr为数组，fn为过滤函数
    formatter(val, arr, fn) {
      return fn(val, arr);
    }
  }
};
</script>
