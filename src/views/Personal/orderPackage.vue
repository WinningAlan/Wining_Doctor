<template>
  <div class="perOrderPackage">
    <el-popover v-model="childPageVisible" popper-class="childOrderPackage" v-if="childPageVisible">
      <edit-order-package
        :orderPackageParams="orderPackageParams"
        :showEdit="showEdit"
        ref="editPackage"
        :getPackageDetail="getPackageDetail"
        :cancelPackage="cancel"
        :orderPackageAllData="orderPackageData"
        :delOrderIds="delOrderIds"
        :saveOrEditPackage="saveOrEditPackage"
      >
        <div class="el-icon-close close closeStyle" slot="close" @click="childPageVisible=false"></div>
        <div slot="btn" class="orderBtnStyle" slot-scope="{checkForm}">
          <el-button type="primary" @click="saveOrEditPackage(checkForm)">{{showEdit?'保存':'编辑'}}</el-button>
          <el-button @click="childPageVisible=false">{{showEdit?'取消':'关闭'}}</el-button>
        </div>
      </edit-order-package>
    </el-popover>
    <div class="top">
      <ul>
        <li>
          范围：
          <el-select v-model="PackageRangCode" placeholder="请选择" clearable @change="getPackageList">
            <el-option
              v-for="item in orderPackageRange"
              :key="item.Value"
              :label="item.Text"
              :value="item.Value"
            ></el-option>
          </el-select>
        </li>
        <li>
          类别：
          <el-select v-model="PackageCategoryCode" placeholder="请选择" clearable @change="getPackageList">
            <el-option
              v-for="item in orderPackageType"
              :key="item.Value"
              :label="item.Text"
              :value="item.Value"
            ></el-option>
          </el-select>
        </li>
        <li>
          状态：
          <el-select v-model="Status" placeholder="请选择" clearable @change="getPackageList">
            <el-option
              v-for="item in statusList"
              :key="item.Value"
              :label="item.Text"
              :value="item.Value"
            ></el-option>
          </el-select>
        </li>
        <li>
          <el-input v-model="keyword" placeholder="请输入套餐名称" @change="getPackageList"
          @keyup.enter.native="getPackageList"></el-input>
        </li>
        <li>
          <el-button type="primary" @click="getPackageList">搜索</el-button>
        </li>
      </ul>
      <div class="topAdd">
        <el-button type="primary" @click="addOrderPackage">添加</el-button>
      </div>
    </div>
    <div class="tableContent">
      <el-table :data="tableData" style="width:100%" @row-click="handleRow" :height="height">
        <el-table-column label="序号" type="index" width="60"></el-table-column>
        <el-table-column prop="PackageName" label="名称"></el-table-column>
        <el-table-column prop="PackageRangeName" label="范围"></el-table-column>
        <el-table-column prop="PackageCategoryName" label="类别"></el-table-column>
        <el-table-column prop="CreateUserName" label="创建人"></el-table-column>
        <el-table-column prop="CreateTime" label="创建时间" min-width="100">
          <template slot-scope="scope">{{scope.row.CreateTime|timeFilter}}</template>
        </el-table-column>
        <el-table-column prop="UpdateUserName" label="最后修改人"></el-table-column>
        <el-table-column prop="UpdateTime" label="最后修改时间" min-width="100">
          <template slot-scope="scope">{{scope.row.UpdateTime|timeFilter}}</template>
        </el-table-column>
        <el-table-column prop="StatusName" label="状态"></el-table-column>
        <el-table-column prop label="操作" fixed="right" width="130">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click.stop="edit(scope.row)"
              :disabled="scope.row.PackageRangeName=='科室'&&userRightList.IsHasDeptRight==false"
            >编辑</el-button>
            <el-button
              type="text"
              size="small"
              :disabled="scope.row.PackageRangeName=='科室'&&userRightList.IsHasDeptRight==false"
              @click.stop="modifyStatus(scope.row)"
            >{{scope.row.Status?'停用':'启用'}}</el-button>
            <el-button
              type="text"
              size="small"
              @click.stop="del(scope.row)"
              :disabled="scope.row.PackageRangeName=='科室'&&userRightList.IsHasDeptRight==false"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import editOrderPackage from "@/components/personal/editOrderPackage";
import { mapGetters } from "vuex";
export default {
  components: {
    editOrderPackage
  },
  data() {
    return {
      statusList: [
        { Text: "启用", Value: 1 },
        { Text: "停用", Value: 0 }
      ],
      keyword: "",
      PackageRangCode: "",
      PackageCategoryCode: "",
      Status: "",
      tableData: [],
      childPageVisible: false,
      orderPackageParams: {}, //医嘱套餐相关参数
      orderPackageData: [], //相关医嘱
      showEdit: true, //是否以编辑状态展示
      delOrderIds: [] ,//暂时删除的医嘱列表
      height:400
    };
  },
  watch: {
    // Status:function(newValue){
    //   console.log(newValue)
    // },
    childPageVisible(bl) {
      !bl && this.getPackageList();
    }
  },
  created() {
    this.height=parseInt(document.body.clientHeight-170)
    this.getPackageList();
  },

  methods: {
    // 修改停用启用状态
    modifyStatus(row) {
      let str = "";
      if (row.Status) {
        str = "确定要停用该医嘱套餐吗？";
      } else {
        str = "确定要启用该医嘱套餐吗？";
      }
      this.$confirm(str, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let value = row.Status ? 0 : 1;
          let params = {
            orderPackageId: row.OrderPackageId,
            packageOpertion: value
          };
          this.$Api.opertionOrderPackage(params).then(res => {
            this.$msg[res.Status ? "success" : "warning"](res.Message);
            if (res.Status) {
              this.getPackageList();
            }
          });
        })
        .catch(() => {
          this.$msg.info("已取消该操作");
        });
    },
    // 获取个人中心套餐列表
    getPackageList() {
      console.log(this.Status);
      let params = {
        PackageRangCode: this.PackageRangCode || 0,
        PackageCategoryCode: this.PackageCategoryCode || 0,
        Status: this.Status === "" ? -1 : this.Status,
        KeyWord: this.keyword
      };
      this.$Api.getOrderPackageList(params).then(res => {
        if (res.Status) {
          this.tableData = res.Data || [];
        } else {
          this.$msg.warning(res.Message);
        }
      });
    },
    addOrderPackage() {
      this.orderPackageData = [];
      this.orderPackageParams = {
        PackageCategoryCode:this.orderPackageType[0].Value
      };
      this.childPageVisible = true;
      this.showEdit = true;
    },
    // 编辑套餐数据
    edit(row) {
      this.getApiData(row.OrderPackageId, true, true, 1);
    },
    // 删除
    del(row) {
      this.$confirm("确定要删除该医嘱套餐吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            orderPackageId: row.OrderPackageId,
            packageOpertion: -1
          };
          this.$Api.opertionOrderPackage(params).then(res => {
            this.$msg[res.Status ? "success" : "warning"](res.Message);
            if (res.Status) {
              this.getPackageList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 单击行
    handleRow(row) {
      this.getApiData(row.OrderPackageId, true, false, 1);
    },
    // id:套餐id showChild：是否显示页面，value：子页面是否是可编辑状态，type：0 暂存数据，1保存数据，2全部数据
    getApiData(id, showChild, value, type) {
      this.delOrderIds = [];
      Promise.all([
        this.getPackageDetail(id, type),
        this.getPackageMainInfo(id)
      ])
        .then(res => {
          if (res[0].Status) {
            this.orderPackageData = res[0].Data || [];
            this.modifyTableData();
          }
          if (res[1].Status) {
            this.orderPackageParams = res[1].Data || {};
          }
          this.childPageVisible = showChild;
          this.showEdit = value;
        })
        .catch(e => console.log(e));
    },
    modifyTableData() {
      this.orderPackageData.forEach((item, index) => {
        item._index = index;
      });
      console.log(this.orderPackageData);
    },
    getPackageDetail(id, type) {
      let vv = id == undefined ? "00000000-0000-0000-0000-000000000000" : id;
      let params = {
        orderPackageId: vv,
        DataStatus: type
      };
      let result = this.$Api.getOrderPackageDetail(params);
      if (type == 2) {
        // 暂存+保存的数据
        result.then(res => {
          if (res.Status) {
            this.orderPackageData = res.Data||[];
            this.modifyTableData();
          }
        });
      } else {
        return result;
      }
    },
    getPackageMainInfo(id) {
      let params = {
        orderPackageId: id
      };
      return this.$Api.getOrderPackageMainInfo(params);
    },
    // 保存医嘱套餐
    async saveOrEditPackage(fn) {
      console.log(this.orderPackageParams, "保存");
      if (this.showEdit) {
        // 执行保存操作
        //let res = await fn();
        //console.log(res,'promise')
        fn()
          .then(res => {
            if (res) {
              this.showEdit = false;
              this.orderPackageParams.OrderPackageId =
                this.orderPackageParams.OrderPackageId == undefined
                  ? "00000000-0000-0000-0000-000000000000"
                  : this.orderPackageParams.OrderPackageId;
              this.$Api
                .saveOrderPackage(this.orderPackageParams)
                .then(result => {
                  this.$msg[result.Status ? "success" : "warning"](
                    result.Message
                  );
                  if (result.Status) {
                    if (
                      this.orderPackageParams.OrderPackageId ==
                        "00000000-0000-0000-0000-000000000000" ||
                      this.orderPackageParams.OrderPackageId == undefined
                    ) {
                      this.orderPackageParams.OrderPackageId = result.Data;
                    }
                    console.log(this.orderPackageParams, "1111111111");
                  }

                  this.getPackageList();
                  this.delOrderIds = [];
                });
            }else{
              // 如果是新添加清空
              // if(this.orderPackageParams.OrderPackageId == undefined) {
              //   this.delOrderIds = [];
              //   this.cancel("00000000-0000-0000-0000-000000000000")
              // }else{
              //   this.delOrderIds = [];
              //   this.cancel(this.orderPackageParams.OrderPackageId)
              // }
            }
          })
          .catch(() => {});
      } else {
        // 编辑套餐是科室套餐并且没有科室套餐权限不可编辑
        if (
          this.orderPackageParams.PackageRangeCode == "2" &&
          this.userRightList.IsHasDeptRight == false
        ) {
          this.$msg.warning("该账号没有科室套餐权限，不可编辑！");
          return;
        } else {
          // 执行点击编辑按钮操作
          this.showEdit = true;
        }
      }
    },
    // 取消或关闭
    cancel(value) {
      console.log(value);
      let params = {
        orderPackageId: value,
        delOrderIds: this.delOrderIds
      };
      this.$Api.cancelOrderPackage(params).then(res => {
        //this.$msg[res.Status?'success':'warning'](res.Message)
      });
      this.childPageVisible = false;
    }
  },
  computed: {
    ...mapGetters({
      orderPackageRange: "orderpackages/GET_ORDERPACKAGERANGE",
      orderPackageType: "orderpackages/GET_ORDERPACKAGETYPE",
      userRightList: "public/GET_USERRIGHTLIST"
    })
  }
};
</script>
<style lang="less" scoped>
.perOrderPackage {
  margin: 20px;
  height: 100%;
  .el-select,
  .el-date-editor,
  .el-input,
  .el-input-number {
    .el-input__inner {
      background: @controlBg;
      border: none;
    }
  }
  .top {
    margin-bottom: 20px;
    overflow: hidden;
    ul > li {
      float: left;
      margin-right: 20px;
    }
    .topAdd {
      float: right;
    }
  }
  .tableContent {
    /deep/ .el-table__row {
      cursor: pointer;
    }
    overflow: hidden;
    width: 99%;
    height: calc(~"(100% - 60px)");
  }
}
</style>>
<style lang="less" >
.perOrderPackage {
  .el-select,
  .el-date-editor,
  .el-input,
  .el-input-number {
    .el-input__inner {
      background: @controlBg;
      border: none;
    }
  }
}
.childOrderPackage.el-popover {
  transition: all 0.3s cubic-bezier(0.65, 0.05, 0.36, 1);
  width: calc(100vw - 145px);
  height: calc(100vh - 21px);
  // background: #000;
  background: #fff;
  border-right: 10px solid #dfe7f5;
  box-sizing: border-box;
  top: 69px !important;
  left: 145px !important;
  margin-top: 0;
  box-shadow: none;
  padding: 0;
}
.orderBtnStyle {
  text-align: center;
  // position: absolute;
  // bottom: 0;
  // right: 0;
}
.closeStyle {
  width: 100%;
  text-align: right;
  font-size: 30px;
  cursor: pointer;
  color: #0071e7;
}
</style>