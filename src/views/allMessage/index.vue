<template>
  <div class="AllMassageContent">
    <div class="AllMassageBody">
      <div class="bodyLeft">
        <div class="seachHeard">
          <table class="heardtable">
            <tr>
              <td class="titleAll">
                <label class="tagTitle">全部消息</label>
              </td>
              <td style="text-align: right;">
                <el-input placeholder="请输入内容" v-model="name" class="input-with-select">
                  <el-button slot="append" icon="el-icon-search" @click="Seach"></el-button>
                </el-input>
                <div class="close-btn el-icon-close" @click="$router.go(-1)"></div>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div class="msg-list">
        <msg-table :tableData="tableData"></msg-table>
      </div>
      <div class="page cl" v-show="pageNumber">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="pageNumber"
          :page-size="pageSize"
          @current-change="getTableData"
          :current-page.sync="pageIndex"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import msgTable from "../../components/allmessage/msgTable";
export default {
  data() {
    return {
      pageSize: 10,
      pageIndex: 1,
      name: "",
      tableData: [],
      pageNumber: 0
    };
  },
  mounted() {
    this.pageSize =
      Math.floor((document.documentElement.clientHeight - 300) / 48) || 1;
    this.getTableData();
  },
  computed: {
    ...mapGetters({
      user: "public/GET_USER",
      messageCount: "public/GET_MESSAGECOUNT"
    })
  },
  components: {
    msgTable
  },
  methods: {
    Seach() {
      this.pageIndex = 1;
    },
    getTableData() {
      let data = {
        userId: this.user.UserInfo.Id,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex
      };
      if (this.name) {
        data.name = this.name;
      }
      this.$Api.getUserHistoryMessage(data).then(res => {
        console.log(res);
        if (res.Status) {
          this.pageNumber = res.Count;
          this.tableData = res.Data;
        }
      });
    }
  }
};
</script>
<style  lang="less" scoped>
.titleAll {
  text-align: left;
}
.AllMassageContent {
  padding: 10px 18px 20px 0px;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
  .AllMassageBody {
    height: 100%;
    width: 100%;
  }
  .bodyLeft {
    padding: 10px 18px 0px 20px;
    overflow-x: hidden;
    overflow-y: auto;
    .seachHeard {
      padding-top: 10px;
      height: 45px;
    }
    /deep/ .seachHeard .el-input__inner {
      border: none;
      border-radius: 0px;
      border-bottom: 2px solid #d1d1d1;
    }
    /deep/ .seachHeard .el-input-group__append {
      border: 0px;
      background-color: white;
      border-bottom: 2px solid #d1d1d1;
      border-radius: 0px;
      padding: 0 8px;
    }
    /deep/ .seachHeard .el-input-group--append {
      position: relative;
      bottom: 8px;
    }
    /deep/ .seachHeard .el-icon-search {
      font-size: 24px;
    }
    /deep/ .seachHeard .el-button {
      padding: 4px 20px 12px 4px;
    }

    .seachBody {
      position: relative;
    }
    .columnTag {
      margin-right: 6px;
      font-family: SourceHanSans-Regular;
      font-size: 14px;
      color: #999999;
      letter-spacing: 0;
      text-align: right;
    }
    .columnMain {
      font-family: SourceHanSans-Bold;
      font-size: 16px;
      color: #333333;
      letter-spacing: 0;
    }
    .columnMainRead {
      font-family: SourceHanSans-Bold;
      font-size: 16px;
      color: #999999;
      letter-spacing: 0;
    }
    .columnspan {
      font-family: SourceHanSans-Regular;
      font-size: 14px;
      color: #999999;
      letter-spacing: 0;
      text-align: right;
    }

    /deep/ .scroll-container {
      overflow-y: auto;
      // height: 780px;
      max-height: 520px;
      //height: calc(100% - 165px);
      margin-top: 10px;
    }
    /deep/ .scroll-container .el-table {
      margin-top: 0px;
    }
    .heardtable {
      width: 100%;
    }
    .tagTitle {
      margin-left: 10px;
      font-family: SourceHanSans-Bold;
      font-size: 20px;
      color: #1989fa;
      letter-spacing: 0;
      line-height: 12px;
      position: relative;
    }
    /deep/ .seachHeard .el-input-group {
      width: 398px;
    }
    /deep/ .el-pagination {
      text-align: right;
      margin-top: 14px;
    }
    /deep/ .seachBody .el-table__body {
      border-top: 1px solid #ebeef5;
    }
    /deep/ .el-table__header-wrapper {
      display: none;
    }
  }
  .bodyRight {
    &::after {
      content: "";
      position: absolute;
      top: 76px;
      display: inline-block;
      width: 3px;
      background: #dddddd;
      left: 10px;
      height: 100%;
    }
    float: right;
    width: 200px;
    padding-top: 14px;
    height: 100%;
    position: relative;
    .goto {
      margin-left: 20px;
    }
    .checkUl {
      list-style: none;
      padding-left: 13px;
      position: relative;
      top: 60px;
      left: 47px;
    }
    .checkUl li {
      position: relative;
      text-align: left;
    }
    .checkUl li:first-child {
      padding-left: 10px;
      padding-bottom: 14px;
    }

    .checkUl li:first-child:before {
      content: "";
      position: absolute;
      top: 3px;
      left: 0;
      display: inline-block;
      width: 3px;
      height: 14px;
      background: #0f80ed;
    }
    .setTag {
      padding-left: 13px;
      font-family: SourceHanSans-Bold;
      font-size: 14px;
      color: #333333;
    }
    /deep/ .el-checkbox + .el-checkbox {
      margin-left: 0px;
      // margin-top: 15px;
    }
    .el-checkbox {
      // width: 100%;
      display: block;
      padding-bottom: 11px;
    }
    .el-checkbox-group {
      padding-top: 15px;
      position: relative;
      right: 3px;
    }
    .el-switch {
      left: -4px;
    }
  }
  /deep/.el-checkbox__input.is-checked + .el-checkbox__label {
    color: #606266;
  }
}
.close-btn {
  width: 18px;
  height: 18px;
  margin-left: 200px;
  font-size: 20px;
  color: #8da1c6;
  // background: url('../../assets/imges/close-icon.svg') no-repeat;
  cursor: pointer;
  &:hover {
    color: #1989fa;
  }
}
.msg-list {
  padding-left: 20px;
}
.page {
  margin-top: 20px;
  float: right;
}
</style>