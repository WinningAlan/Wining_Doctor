<template>
  <el-table
    :data="tableData"
    :row-style="showRow"
    class="tree-table"
    v-bind="$attrs"
    :show-header="false"
    @row-click="rowClick"
    use-virtual
    :excess-rows="8"
    :row-height="33"
    :height="height"
    v-on="$listeners"
  >
    <el-table-column
    show-overflow-tooltip
    >
      <template slot-scope="scope">
          <template v-if="scope.row[defaultChildren]&&scope.row[defaultChildren].length">
            <span :style="{'padding-left':+scope.row._level*indent + 'px'} "/>
            <span
              v-show="showSperadIcon(scope.row)"
              class="tree-ctrl"
              @click.stop="toggleExpanded(scope.row)"
            >
              <template v-if="!isTree">
                <i v-if="!scope.row._expand" class="el-icon-caret-right"/>
                <i v-else class="el-icon-caret-bottom"/>
              </template>
            </span>
          </template>
          <template v-else>
            <el-checkbox
            :key="scope.row[majorKey]"
              v-model="scope.row._select"
              @click.native.stop="()=>{}"
              :style="{'padding-left':+scope.row._level*indent + 'px'} "
              @change="handleCheckAllChange(scope.row,$event)"
            />
          </template>
          <template > {{ scope.row.Name }}</template>
      </template>;
    </el-table-column>
  </el-table>
</template>

<script>
import treeToArray, { addAttrs } from "@/utils/eval.js";
/*/属性	说明	 类型	 默认值
use-virtual	是否开启虚拟滚动	Boolean	false
row-height	行高(必须要设置正确的行高，否则会导致表格计算不正确)	Number	48
excess-rows	表格可视区域上方与下方额外渲染的行数，行数越多表格接替渲染效果越好，但越耗性能	Number	5
use-row-key	大部分场景下可以不使用rowKey来最大化复用dom，极大的提升渲染效率	Boolean	false/*/
export default {
  name: "TreeTable",
  props: {
    data: {
      type: Array,
      required: true,
      default: () => []
    },
    // 表格数据主键
    majorKey: {
      type: String,
      default: "Id"
    },
    columns: {
      type: Array,
      default: () => []
    },
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    defaultChildren: {
      type: String,
      default: "Children"
    },
    // 缩进尺寸
    indent: {
      type: Number,
      default: 20
    },
    // 原始数据是否为树结构
    isTree: {
      type: Boolean,
      default: false
    },
    selectCallback:{
      type:Function,
      default:()=>{}
    }
  },
  data() {
    return {
      height:330
    };
  },
  created() {
    this.height=document.body.clientHeight-220
  },
  computed: {

    tableData() {
      if (this.isTree) {
        return this.data;
      }
      // const data = JSON.parse(JSON.stringify(this.data))
      const data = this.data;
      if (this.data.length === 0) {
        return [];
      }
      let now=+new Date()
      addAttrs(data, {
        expand: this.defaultExpandAll,
        children: this.defaultChildren
      });
      const retval = treeToArray(data, this.defaultChildren);
      return retval;
    }
  },
  methods: {
    // addBrother(row, data) {
    //   if (row._parent) {
    //     row._parent.Children.unshift(data);
    //   } else {
    //     this.data.unshift(data);
    //   }
    // },
    // addChild(row, data) {
    //   if (!row.Children) {
    //     this.$set(row, "Children", []);
    //   }
    //   row.Children.unshift(data);
    // },
    // delete(row) {
    //   const { _index, _parent, Children } = row;
    //   if (_parent) {
    //     _parent.Children.splice(_index, 1);
    //   } else {
    //     this.data.splice(_index, 1);
    //   }
    // },
    // edit(row, id) {
    //   this.$set(row, "_isEdit", !row._isEdit);
    //   if (id) {
    //     this.$set(row, "Id", id);
    //   }
    // },
    getData() {
      return this.tableData;
    },
    showRow({ row }) {
      const parent = row._parent;
      const show = parent ? parent._expand && parent._show : true;
      return show
        ? "animation:treeTableShow 1s;cursor: pointer;"
        : "cursor: pointer;";
    },
    showSperadIcon(record) {
      return record[this.defaultChildren] && record[this.defaultChildren].length > 0;
    },
    // 展开收起
    toggleExpanded(row) {
      row._expand=!row._expand
      this.tableData.forEach(item=>{
      const parent = item._parent;
      const show = parent ? parent._expand && parent._show : true;
      item._show = show;
      })
    },
    // 勾选项目
    handleCheckAllChange(row,bl) {
      row._select=bl
      this.selectCallback(bl,row)
    },
    // updateTreeNode(item) {
    //   return new Promise(resolve => {
    //     const { _id, _parent } = item;
    //     const index = _id.split("-").slice(-1)[0]; // get last index
    //     if (_parent) {
    //       _parent.Children.splice(index, 1, item);
    //       resolve(this.data);
    //     } else {
    //       this.data.splice(index, 1, item);
    //       resolve(this.data);
    //     }
    //   });
    // },
    rowClick(row){
      if (row[this.defaultChildren]&&row[this.defaultChildren].length) {
        this.toggleExpanded(row)
      }else{
        this.handleCheckAllChange(row,!row._select)
      }
    },
  }
};
</script>

<style>
@keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@-webkit-keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.tree-table.el-table tr td{
  height: 33px;
}
.tree-ctrl {
  position: relative;
  
  cursor: pointer;
  color: #c0c4cc;
}
</style>
