<template>
  <div class="consumables" :class="{top0:!isShow}">
    <p class="consumables-button" v-if="isShow">
      <el-button type="primary" size="small" @click="add">新增</el-button>
      <el-button type="primary" size="small" @click="save(alterData.childData,'all')">全部提交</el-button>
      <el-button type="primary" size="small" @click="saveTemplate">另存模板</el-button>
      <el-select
        v-model="combo"
        filterable
        clearable
        placeholder="请选择模板"
        size="small"
        @change="selectDeatil"
      >
        <el-option
          v-for="item in templateList"
          :key="item.Id"
          :label="item.TemplateName"
          :value="item.Id"
        ></el-option>
      </el-select>
      <span class="name">选择模板:</span>
    </p>
    <el-table :data="alterData.childData" style="width: 100%;" :row-key="rowkey" :max-height="386" @selection-change="selectionChange">
      <el-table-column type="selection" v-if="isShow"></el-table-column>
      <el-table-column min-width="100" label="类别">
        <template slot-scope="scope">
          <template
            v-if="!scope.row.Status || scope.row.AdviceItemId"
          >{{scope.row.GroupCode | groupFilters(groupArr,scope.row.GroupName)}}</template>
          <el-select
            v-else
            @visible-change="restore"
            v-model="scope.row.GroupCode"
            filterable
            placeholder="请选择"
            @change="changeValue(scope.row,'group')"
            :filter-method="filterMethod"
          >
            <el-option
              v-for="item in groupOption"
              :key="item.Id"
              :label="item.Name"
              :value="item.GroupCode"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column min-width="180" label="计价项目">
        <template slot-scope="scope">
          <template
            v-if="!scope.row.Status ||scope.row.AdviceItemId"
          >{{scope.row.DictAdviceItemName||scope.row.Name}}</template>
          <el-select
            v-else
            v-model="scope.row.DictAdviceItem"
            filterable
            remote
            default-first-option
            class="costItem"
            @change="changeValue(scope.row,'item')"
            value-key="Id"
            ref="costItem"
            placeholder="项目名称/项目名称缩写"
            @focus="itemFocus(scope.row)"
            :remote-method="remoteMethod"
            :loading="loading"
            v-loadmore="loadMore"
          >
            <!-- <el-option-group
              v-for="group in itemOption"
              :key="group.Group"
              :label="group.DictAdviceItemModels.length>1?group.Group:''"
            >-->
            <el-option v-for="item in itemOption" :key="item.Id" :label="item.Name" :value="item">
              <span class="name">{{item.Name}}</span>
              <span class="specifications">{{item.Specifications}}</span>
            </el-option>
            <!-- </el-option-group> -->
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="Specifications" label="规格" v-if="isShow"></el-table-column>
      <el-table-column prop="Unit" label="单位" width="80"></el-table-column>
      <el-table-column prop="Price" label="单价" width="80"></el-table-column>

      <el-table-column prop="Count" label="数量" width="110">
        <template slot-scope="scope">
          <template v-if="!scope.row.Status">{{scope.row.Count}}</template>
          <el-input-number
            v-else
            v-model="scope.row.Count"
            :min="1"
            :max="100"
            label="描述文字"
            size="small"
          ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="OperatorName" label="操作员" v-if="isShow"></el-table-column>
      <el-table-column label="操作" width="120" v-if="isShow">
        <template slot-scope="scope">
          <p class="operation" v-if="!scope.row.IsCharge">
            <span v-if="scope.row.Status" @click="save(scope.row,'one')">提交</span>
            <span v-else @click="edit(scope.row,true)">修改</span>
            <span @click="retreat(scope.row,scope.$index)">作废</span>
          </p>
        </template>
      </el-table-column>
    </el-table>
    <myAlert :visible="templateShow" title="保存模板名称" :callback="closeAlter" width="500px">
      <div class="box">
        <span>模板名称:</span>
        <el-input placeholder="请输入模板名称" v-model="templateName" size="small"></el-input>
      </div>
    </myAlert>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import myAlert from "@/components/common/myAlter";
const defaultRow = {
  Count: 1,
  DictAdviceItemId: null,
  // Id: null,
  DictAdviceItemName: null,
  Price: null,
  Specifications: null,
  Status: true,
  Unit: null,
  Usage: null
};
export default {
  name: "alterConsumables", //关联费用弹窗
  props: {
    idKey: {
      type: String,
      default: "Group"
    },
    alterData: {
      type: Object,
      default: {}
    },
    // 是否显示操作
    isShow: {
      type: Boolean,
      default: true
    }
  },
  components: {
    myAlert
  },
  data() {
    return {
      // table绑定row-key
      rowkey(row) {
        return row.DictAdviceItemId;
      },
      combo: "", //模板值
      comboOptions: [], //所有模板
      groupOption: [], //大项下拉值
      itemOption: [], //小项下拉数组
      childData: [],
      loading: false,
      templateName: "", //模板名称
      templateList: [], //模板列表
      templateShow: false,
      pageIndex: 1
    };
  },
  watch: {
    "alterData.showAlter": {
      handler: function(val, oldVal) {
        if (val) {
          this.combo = "";
          this.selectArr=[]
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    // this.getGroup();
    this.groupOption=this.groupArr
    this.isShow && this.getTemplateList();
  },
  computed: {
    ...mapGetters({
      user: "public/GET_USER",
      groupArr:"public/GET_GROUPARR", //所有材料大项
    })
  },
  filters: {
    groupFilters(val, arr, name) {
      let str = name;
      arr.forEach(item => {
        if (item.Code == val) {
          str = item.Name;
        }
      });
      return str;
    }
  },
  methods: {
    add() {
      if (!this.groupArr.length) return this.$msg.info("无耗材数据");
      let row = { ...defaultRow };
      row.GroupCode = this.groupArr[0].GroupCode;
      row.OperatorName = this.user.UserInfo.Name;
      row._Id=+new Date()
      this.alterData.childData.unshift(row);
    },
    // 小项获焦
    itemFocus(row) {
      this.rowData = row;
      this.itemOption = [];
      this.pageIndex = 1;
      this.remoteMethod("", 1);
    },
    changeValue(row, type) {
      console.log(row, row.DictAdviceItem);
      if (type === "item") {
        const data = row.DictAdviceItem;
        row.GroupCode = data.GroupCode
        console.log(data);
        row.DictAdviceItemId = data.Id;
        row.DictAdviceItemCode = data.Code;
        row.DictAdviceItemName = data.Name;
        for (const key in data) {
          if (row.hasOwnProperty(key) && key != "Id" && key != "Group") {
            row[key] = data[key];
          }
        }
      } else {
        console.log(row, type);
        for (const key in defaultRow) {
          row[key] = defaultRow[key];
        }
      }
    },
    // 还原数据
    restore(bl) {
      if (bl) this.groupOption = this.groupArr;
    },
    // 耗材大项本地搜索
    filterMethod(val) {
      val = val && val.replace(/(^\s*)|(\s*$)/g, "");
      if (val) {
        //val存在
        this.groupOption = this.groupArr.filter(item => {
          console.log(item.InputCode.indexOf(val) > -1, item.InputCode);
          if (item.Name.indexOf(val) > -1 || item.InputCode.indexOf(val) > -1) {
            return true;
          }
        });
      } else {
        //val为空时，还原数组
        this.groupOption = this.groupArr;
      }
    },
    // 获取所有耗材大项
    // getGroup() {
    //   this.$Api.getGroupList().then(res => {
    //     if (res.Status) {
    //       res.Data &&
    //         res.Data.forEach(item => {
    //           item["GroupCode"] = item.Code;
    //         });
    //       this.groupOption = res.Data || [];
    //       this.$store.commit("public/SET_GROUPARR", this.groupOption);
    //     }
    //   });
    // },
    // 远程搜索
    remoteMethod(val, pageIndex = 1) {
      console.log(this.rowData, val);
      val = val && val.replace(/(^\s*)|(\s*$)/g, "");
      this.currentKeyWord = val;

      this.loading = pageIndex === 1;
      this.$Api
        .getCostItemList({
          groupCode: this.rowData.GroupCode,
          content: val,
          pageIndex,
          pageSize: 10
        })
        .then(res => {
          this.loading = false;
          if (res.Status) {
            let data = res.Data[0] ? res.Data[0].DictAdviceItemModels : [];
            if (pageIndex === 1) {
              this.itemOption = data;
            } else {
              this.itemOption.push(...data);
            }
          } else {
            this.itemOption = [];
          }
        });
    },
    // 编辑
    edit(row, bl) {
      this.$set(row, "Status", bl);
    },
    // 保存
    save(row, saveType = "one") {
      console.log("alterData", row, this.alterData);
      let arr = saveType == "one" ? [row] : row;
      let off = true;
      let sendData = [];
      let data = arr.filter(item => {
        console.log(item);
        if (item.AdviceItemId) {
          sendData.push({
            Id: item.AdviceItemId,
            DictAdviceItemCode: item.DictAdviceItemCode,
            Count: item.Count,
            InHouseId: this.alterData.inHouseId
          });
        } else {
          sendData.push({
            DictAdviceItemCode: item.DictAdviceItemCode,
            Count: item.Count,
            InHouseId: this.alterData.inHouseId
          });
        }

        if (!item.DictAdviceItemCode) {
          off = false;
        }
        return item.Status;
      });

      if (!off) {
        return this.$msg.warning("计价项目不允许为空");
      }
      if (!data.length) {
        return this.$msg.warning("没有新增或修改的费用");
      }
      sendData = {
        InHouseId: this.$route.query.id,
        DoctorOrderId: this.alterData.DoctorOrderId,
        AdviceItems: sendData
      };
      this.$Api.saveCostItem(sendData).then(res => {
        this.$msg[res.Status ? "success" : "warning"](res.Message);
        if (res.Status) {
          if (saveType == "one") {
            this.$set(row, "Status", false);
            row.AdviceItemId = row.AdviceItemId
              ? row.AdviceItemId
              : res.Data[0];
          } else {
            this.alterData.childData.forEach(el => {
              el.Status = false;
            });
          }
        }
      });
    },
    // 退回、作废操作
    retreat(data, num) {
      this.$confirm("此操作将将永久作废该记录, 是否继续?", "", {
        customClass: "msg-box",
        type: "warning"
      })
        .then(() => {
          // 材料未保存作废
          if (!data.AdviceItemId) {
            this.alterData.childData.splice(num, 1);
            this.deleteSelect(data._Id)
            // 材料已保存作废
          } else {
            this.$Api
              .deleteCostItem({
                materialId: data.AdviceItemId,
                DoctorOrderId: this.alterData.DoctorOrderId,
                hisxh: data.Hisxh
              })
              .then(res => {
                this.$msg[res.Status ? "success" : "warning"](res.Message);
                res.Status && this.alterData.childData.splice(num, 1);
                res.Status && this.deleteSelect(data.AdviceItemId)
              });
          }
        })
        .catch(() => {
          this.$msg.info("已取消操作");
        });
    },
    //保存模板
    saveTemplate() {
      var off = true;
      if (this.selectArr.length > 0) {
        console.log(this.selectArr);
        this.selectArr.forEach(item => {
          if (!item.DictAdviceItemCode) {
            this.$msg.warning("项目名称为必填项!!");
            off = false;
            return;
          }
        });
        if (off) {
          this.templateShow = true;
        }
      } else {
        this.$msg.warning("请选择需要另存模板的材料!!!");
      }
    },
    //模板名称弹出回调
    closeAlter(bl) {
      console.log(bl);
      if (bl) {
        var data = {
          TemplateName: this.templateName,
          TemplateDetails: []
        };
        this.selectArr.forEach(item => {
            data.TemplateDetails.push({
              DictAdviceItemCode: item.DictAdviceItemCode,
              GroupCode: item.GroupCode,
              Count: item.Count
            });
          });
        console.log(data);
        // 保存模板
        this.$Api.saveCostTemplate(data).then(res => {
          this.$msg[res.Status ? "success" : "error"](res.Message);
          if (res.Status) {
            this.templateName = "";
            this.getTemplateList();
            this.templateShow = false;
          }
        });
      } else {
        this.templateShow = false;
      }
    },
    //获取模板列表
    getTemplateList() {
      this.$Api.getCostTemplate().then(res => {
        this.templateList = res.Data || [];
      });
    },
    //获取模板详情的信息
    getTemplateDetail(id) {
      this.$Api.getCostTemplateDetails({ templateId: id }).then(res => {
        if (res.Status) {
          res.Data &&
            res.Data.forEach(item => {
              item.Status = true;
              item.DictAdviceItem = item.DictAdviceItemName;
              item._Id=Math.random()
            });
          this.alterData.childData.unshift(...res.Data);
        }
      });
    },
    selectDeatil(val) {
      if (val) {
        this.getTemplateDetail(val);
      }
    },
    loadMore() {
      ++this.pageIndex;
      this.remoteMethod(this.currentKeyWord, this.pageIndex);
    },
    selectionChange(arr){
      this.selectArr=arr
    },
    // 删除选中项
    deleteSelect(id){
      this.selectArr=this.selectArr.filter(el=>{
        if (el.AdviceItemId) {
          return id!==el.AdviceItemId
        } else {
          return id!=el._Id
        }
      })
    }
  },
  directives: {
    loadmore: {
      bind: function(el, binding) {
        const SELECTWRAP_DOM = el.querySelector(
          ".el-select-dropdown .el-select-dropdown__wrap"
        );
        SELECTWRAP_DOM.addEventListener("scroll", function() {
          // 滚动条已经到底部
          const CONDITION =
            this.scrollHeight - this.scrollTop <= this.clientHeight;
          if (CONDITION) {
            binding.value();
          }
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
.consumables {
  padding: 10px 20px 0;
  height: 434px;
  &.top0 {
    height: auto;
    padding: 10px;
    .el-table {
      margin-top: 0;
    }
  }
  .consumables-button {
    height: 32px;
    line-height: 32px;
    color: #777;
    .el-button,
    .name,
    .el-select {
      float: right;
      margin-left: 20px;
    }
    .el-button--small {
      padding: 9px;
    }
    /deep/ .el-input__inner {
      background: #f2f2f2;
      width: 170px;
    }
  }
  /deep/ .el-input__inner {
    background: #f2f2f2;
    border: none;
  }
  /deep/ .el-input-number {
    width: 100px;
    background: #f2f2f2;
    border-radius: 2px;
    border: none;
    .el-input-number__decrease,
    .el-input-number__increase {
      background: #c7e0ff;
      border-radius: 2px 0px 0px 2px;
      font-size: 20px;
      font-weight: bold;
      color: #1989fa;
      border: none;
    }
  }
}
.el-select-group {
  .name {
    margin-right: 20px;
  }
  .specifications {
    color: #999;
    font-size: 12px;
  }
}
.noClickDis {
  color: #ccc;
  cursor: no-drop;
  &:hover {
    color: #ccc;
    font-weight: normal;
  }
}
.box {
  padding: 20px;
  span {
    padding-right: 10px;
  }
  .el-input {
    width: 390px;
  }
}
</style>
