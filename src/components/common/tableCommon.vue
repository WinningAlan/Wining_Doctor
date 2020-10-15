<template>
  <el-table
    :data="tableData"
    v-bind="$attrs"
    v-on="$listeners"
    :row-key="(row)=>row.Id"
    class="mytable"
  >
    <!-- class="my-input-time my-input-nimber" -->

    <el-table-column
      v-for="(item,index) in columns"
      :key="index"
      :label="item.text"
      :min-width="item.width"
      :width="item.maxWidth"
      show-overflow-tooltip
      :fixed="item.fixed"
      :align="item.align||'left'"
      :header-align="item.headerAlign||'left'"
    >
      <template slot-scope="scope">
        <slot :scope="scope" :name="item.value">
          <template v-if="item.editType">
            <template v-if="scope.row._isEdit&&(scope.row.Id<0||!item.isFirst)">
              <el-select
                v-if="item.editType==='select'"
                v-model="scope.row[item.value]"
                filterable
                :clearable="item.isClear"
                collapse-tags
                :multiple="item.multiple"
                placeholder="请选择"
                size="small"
              >
                <el-option
                  v-for="items in item.options "
                  :key="items[item.key?item.key:'Value']"
                  :label="items[item.label?item.label:'Text']"
                  :value="items[item.key?item.key:'Value']"
                  v-show="items.Value>=0 ||item.key "
                ></el-option>
              </el-select>
              <el-checkbox v-model="scope.row[item.value]" v-else-if="item.editType==='checkbox'"></el-checkbox>
              <el-switch
                v-else-if="item.editType==='switch'"
                v-model="scope.row[item.value]"
                active-color="#EBEBEB"
                inactive-color="#1989fa"
                :active-value="item.options?item.options[0].value:0"
                :inactive-value="item.options?item.options[1].value:1"
                :active-text="item.options?item.options[0].text:'停用'"
                :inactive-text="item.options?item.options[1].text:'在用'"
              ></el-switch>
              <el-input-number
                v-else-if="item.editType==='number'"
                v-model="scope.row[item.value]"
                label="描述文字"
                size="small"
                :precision="item.precision"
                placeholder="请输入内容"
                :min="item.min"
                :max="item.max"
                :controls="false"
              ></el-input-number>
              <el-time-select
                class="time-select"
                v-else-if="item.editType==='timeSelect'"
                v-model="scope.row[item.value] "
                size="small"
                :picker-options="!item.minTime?{start: '00:00',
      step: '00:30',
      end: '24:00'}:{start: '00:00',
      step: '00:30',
      end: '24:00',
      minTime:scope.row[item.minTime]}"
                placeholder="选择时间"
              ></el-time-select>
              <el-date-picker
                v-else-if="item.editType==='time'"
                v-model="scope.row[item.value] "
                type="datetime"
                value-format="yyyy-MM-dd HH:mm"
                format="yyyy-MM-dd HH:mm"
                prefix-icon="el-icon-date"
                placeholder="选择日期时间"
                size="small"
              ></el-date-picker>
              <!-- <treeselect 
              v-model="scope.row[item.value]" 
              :multiple="true" 
              :options="item.options"
              v-else-if="item.editType=='treeSelect'"/>-->
              <div class="el-textarea" v-else-if="item.editType==='textarea'">
                <textarea
                  autocomplete="off"
                  rows="2"
                  placeholder="请输入内容"
                  class="el-textarea__inner"
                  style="min-height: 32.9886px; margin-top: 0px; margin-bottom: 0px; height: 33px;"
                  v-model="scope.row[item.value]"
                ></textarea>
              </div>
              <template v-else>
                <div class="el-input el-input--small input-list" v-if="!item.rules">
                  <input
                    v-model="scope.row[item.value]"
                    type="text"
                    placeholder="请输入内容"
                    class="el-input__inner"
                    style="width:100%"
                  />
                </div>
                <el-form v-else :model="scope.row">
                  <el-form-item :prop="item.value" inline-message :rules="item.rules">
                    <el-input
                      class="input-list"
                      v-model="scope.row[item.value]"
                      size="small"
                      placeholder="请输入内容"
                      @blur="rules(scope.row,item.value,item.rules)"
                    ></el-input>
                  </el-form-item>
                </el-form>
              </template>
            </template>
            <template v-else>
              <el-checkbox
                v-model="scope.row[item.value]"
                v-if="item.editType==='checkbox'"
                disabled
              ></el-checkbox>
              <template v-else>
                <span
                  v-if="item.formatter"
                  v-html="formatter(scope.row[item.value],item.options,item.formatter)"
                ></span>
                <template v-else>{{scope.row[item.value]}}</template>
              </template>
            </template>
          </template>
          <template v-else>
                <span
                  v-if="item.formatter"
                  v-html="formatter(scope.row[item.value],item.options,item.formatter)"
                ></span>
                <template v-else>{{scope.row[item.value]}}</template>
          </template>
        </slot>
      </template>;
    </el-table-column>
  </el-table>
</template>
<script>
// #### columns(**必填**)

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
// import { type } from "../../utils/public.js"
// import Treeselect from '@riophae/vue-treeselect'
// import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: "tableCommon",
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
    // 后台请求携带的表名
    tableName: {
      type: String,
      default: ""
    }
  },
  components: {
    // Treeselect
  },

  methods: {
    // 数据过滤
    //val为值，arr为数组，fn为过滤函数
    formatter(val, arr, fn) {
      return fn(val, arr);
    },

    // 数据验证

    rules(row, key, rule) {
      const value = row[key];
      const off = {};
      rule.forEach(item => {
        if (item.hasOwnProperty("required")) {
          if (value) {
            off.required = true;
          } else {
            off.required = false;
          }
        } else if (item.hasOwnProperty("pattern")) {
          if (item.pattern.test(value)) {
            off.pattern = true;
          } else {
            off.pattern = false;
          }
        }
      });
      let offOn = true;
      for (const key in off) {
        if (!off[key]) {
          offOn = false;
          break;
        }
      }
      row._isTrue = offOn;
    },
    add(data) {
      this.tableData.unshift(data);
    },

    delete(row, index, type, fn) {
      console.log(row);
      if (type) {
        this.$confirm("该操作将删除该记录,是否继续?", "", {
          type: "warning"
        })
          .then(() => {
            if (typeof row.Id === "number") {
              this.tableData.splice(index, 1);
              this.$msg.success("取消新增记录成功");
              Object.prototype.toString.call(fn) === "[object Function]" &&
                fn();
            } else {
              let params = this.tableName
                ? {
                    tableName: this.tableName,
                    json: JSON.stringify(row)
                  }
                : "";
              this.$Api[type](params, row.Id).then(res => {
                this.$msg[res.Status ? "success" : "warning"](res.Message);
                if (res.Status) {
                  this.tableData.splice(index, 1);
                  // 回调更新数据

                  Object.prototype.toString.call(fn) === "[object Function]" &&
                    fn();
                }
              });
            }
          })
          .catch(() => {
            this.$msg.info("已取消操作");
          });
      } else {
        this.tableData.splice(index, 1);
      }
    },
    edit(row) {
      this.$set(row, "_isEdit", !row._isEdit);
    },
    save(row, type, arr = [], fn) {
      if (row._isTrue === false) {
        this.$msg.warning("数据格式错误");
        return;
      }
      const bl = typeof row.Id === "number";
      let params = { ...row };
      params.Id = bl ? "00000000-0000-0000-0000-000000000000" : params.Id;
      if (this.tableName) {
        let obj = { ...row };
        obj.Id = bl ? "00000000-0000-0000-0000-000000000000" : obj.Id;
        params = {
          tableName: this.tableName,
          json: JSON.stringify(obj),
          verifyParams: arr
        };
      }
      // 新增保存
      if (type) {
        this.$Api[type](params, row.Id).then(res => {
          if (res.Status) {
            if (bl) {
              if (typeof res.Data === "string") {
                row.Id = res.Data;
              } else {
                for (const key in res.Data) {
                  row[key] = res.Data[key];
                }
              }
            }
            this.edit(row);
            // 回调更新数据
            Object.prototype.toString.call(fn) === "[object Function]" &&
              fn(res.Data);

            // this.detailsData.LiquidBalanceItemModels.splice(index,1,res.Data)
          }
          this.$msg[res.Status ? "success" : "warning"](res.Message);
        });
      } else {
        this.edit(row);
      }
    }
  }
};
</script>
<style lang="less" scoped>
.mytable {
  /deep/ .el-form {
    .el-form-item__content {
      position: relative;
    }
    .el-form-item {
      margin-bottom: 0;
    }
    .el-form-item__error {
      color: #f56c6c;
      font-size: 12px;
      line-height: 1;
      padding-top: 4px;
      position: absolute;
      top: 30%;
      right: 0;
      left: auto;
    }
  }
  .el-textarea__inner {
    border: none;
    background: rgb(242, 242, 242);
  }
  /deep/ .el-input-number,
  /deep/ .el-select {
    width: 100%;
    .el-input__inner {
      background: #f2f2f2;
      border: none;
      width: 100%;
    }
  }
  .el-input {
    width: 100%;
  }
  /deep/ .el-form-item {
    .el-input__inner {
      background: #f2f2f2;
      width: 100%;
      border: none;
    }
    &.is-error .el-input__inner {
      border: 1px solid #f56c6c;
    }
  }
  /deep/ .el-date-editor {
    .el-input__inner {
      background: #f2f2f2;
      border: none;
      width: 100%;
    }
  }
  .el-input__inner {
    background: #f2f2f2;
    border: none;
    width: 100%;
  }
}
</style>

