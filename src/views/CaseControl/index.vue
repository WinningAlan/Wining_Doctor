<template>
  <div class="caseControl">
    <div class="caseControlHead">
      <div class="left">
        <div>
          <span>入院日期</span>
          <el-date-picker
            v-model="timeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            value-format=" yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
            @change="search"
          ></el-date-picker>
        </div>
        <div>
          <el-select
            v-model="selectAreas"
            multiple
            collapse-tags
            placeholder="请选择诊疗区"
            @change="handleSelArea"
          >
            <el-option
              v-for="(item,index) in options"
              :key="index"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div>
          <el-select
            v-model="FirstDoctorIds"
            multiple
            remote
            filterable
            size="small"
            collapse-tags
            placeholder="请选择首诊医生"
            :remote-method="selectDoct"
            default-first-option
            reserve-keyword
            @focus="selectDoct('')"
            @change="search"
          >
            <el-option
              v-for="(item) in doctorList"
              :key="item.Id"
              :label="item.Name"
              :value="item.Id"
            ></el-option>
          </el-select>
          <!-- <el-select
    v-model="FirstDoctorIds"
    multiple
    filterable
    remote
    reserve-keyword
    placeholder="请输入关键词"
    :remote-method="selectDoct"
    >
    <el-option
      v-for="item in doctorList"
      :key="item.Id"
      :label="item.Name"
      :value="item.Id">
    </el-option>
          </el-select>-->
        </div>
        <div>
          <el-input
            placeholder="姓名/患者ID/病历号/卡号"
            v-model="patMessage"
            class="input-with-select"
            clearable
          >
            <el-select v-model="cardType" slot="prepend" placeholder="请选择">
              <el-option
                :label="item.name"
                :value="item.value"
                v-for="(item,index) in cardList"
                :key="index"
              ></el-option>
            </el-select>
          </el-input>
        </div>
        <el-button type="primary" @click="search">查询</el-button>
      </div>
      <div class="right">
        <el-tooltip content="导出" placement="top" effect="light">
          <img @click="exportData" src="../../assets/imges/export-icon.svg" />
        </el-tooltip>
        <el-popover
          placement="bottom"
          width="99"
          v-model="columnSet"
          style="minWidth:0"
          popper-class="newProp"
        >
          <div class="checkContent">
            <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <el-checkbox
              v-for="(item,index) in columnsAll"
              :label="item.Code"
              :key="index"
              v-model="item.Ifcover"
            >{{item.Name}}</el-checkbox>
          </div>
          <div class="columnBtn">
            <span @click="columnSet = false">取消</span>
            <span @click="saveConfig">确定</span>
          </div>
          <el-tooltip slot="reference" placement="top" effect="light" content="自定义配置">
            <img src="../../assets/imges/more-icon.svg" />
          </el-tooltip>
        </el-popover>
      </div>
    </div>
    <div class="caseControlContent">
      <pat-message-table
        :getPatientList="getPatientList"
        :columns="columns"
        :defaultColumns="defaultColumns"
        router="caseControl"
        :height="height"
      >
        <template slot-scope="{scope}">
          <el-button type="text" @click="gotoDetail(scope.row)">查看</el-button>
          <el-button type="text" @click.stop="callbackPatient(scope.row)">召回</el-button>
        </template>
      </pat-message-table>
      <div class="pageStyle" v-if="totalPage!=0">
        <div class="pageNum">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="pageIndex"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="10"
            layout="sizes, prev, pager, next"
            :total="totalPage"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!--弹窗-->
    <my-alter
      title="患者召回"
      :visible="dialogData.visible||false"
      :isfooter="true"
      width="480px"
      :callback="closeDialog"
    >
      <callback-pat ref="content" :initialize="dialogData.visible"></callback-pat>
    </my-alter>
  </div>
</template>

<script>
import { cardList } from "@/module/staticData.js";
import patMessageTable from "../../components/common/patMessageTable.vue";
import { GetFormatDateTime, exportData,debouce } from "@/utils/public";
import { mapGetters } from "vuex";
import callbackPat from "@/components/common/callbackPat";
import myAlter from "@/components/common/myAlter";
export default {
  components: {
    patMessageTable,
    callbackPat,
    myAlter,
  },
  name: "caseControl", //患者管理
  data() {
    return {
      totalPage: 0,
      pageIndex: 1,
      pageSize: 10,
      columnsAll: "", //所有可配置的列
      patMessage: "", // 搜索
      checkAll: false,
      columnSet: false,
      timeRange: [,],
      selectAreas: [0],
      FirstDoctorIds: [],
      doctorList: [], //医生列表
      cardType: 3,
      cardList: cardList,
      columns: [],
      //showAlter:false,//是否显示弹窗
      defaultColumns: [
        { prop: "Prognosis", label: "转归", width: "70px", children: [] },
        { prop: "TriageLevel", label: "分级", width: "60px", children: [] },
        {
          prop: "PatientName",
          label: "患者基本信息",
          minWidth: "140",
          children: [],
        },
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      showLoading: false, //导出loading
      height:400,
    };
  },
  created() {
    this.height=parseInt(document.body.clientHeight-210)

     this.debouceElg = debouce(this.getPatientList, 500);
    this.blobArr = [];
    console.log("创建");
    this.timeRange[0] = GetFormatDateTime(
      null,
      new Date(new Date().getTime() - 7 * 24 * 3600 * 1000)
    );
    this.timeRange[1] = GetFormatDateTime();
    console.log(this.timeRange, "时间范围");
    this.getTableConfig();
    this.getPatientList();
    this.$store.commit("public/SET_PATIENTTABLELIST", []);
  },
  methods: {
    // 医生搜索
    selectDoct(query) {
      // if(this.FirstDoctorIds.length!=0) {
      //   return
      // }
      query = query && query.replace(/(^\s*)|(\s*$)/g, "");
      this.getDoctorList(query);
    },
    // 获取医生列表
    getDoctorList(value) {
      value = value == "" ? null : value;
      let params = { content: value };
      this.$Api.getDoctorList(params).then((res) => {
        if (res.Status) {
          if (res.Data.length != 0) {
            this.doctorList = res.Data.map((item) => {
              let obj = {
                Id: item.Id,
                Name: item.Name,
                value: item.Name,
              };
              return obj;
            });
          }
        } else {
          this.$msg.warning(res.Message);
        }
      });
    },
    async closeDialog(value) {
      if (value) {
        // 确定关闭弹窗
        let res = await this.$refs.content.save();
        console.log(res);
        if (res) {
          //this.showAlter = false
          this.getPatientList();
          this.$store.commit("public/SET_DIALOGDATA", {});
        }
      } else {
        //this.showAlter = false
        this.$store.commit("public/SET_DIALOGDATA", {});
      }
    },
    getPatientList() {
      let params = {
        inHospStartTime:
          (this.timeRange && this.timeRange[0]) ||
          GetFormatDateTime(
            null,
            new Date(new Date().getTime() - 7 * 24 * 3600 * 1000)
          ),
        inHospEndTime:
          (this.timeRange && this.timeRange[1]) || GetFormatDateTime(),
        QueryKey: this.patMessage,
        AreaType: this.selectAreas,
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
        FirstDoctorIds: this.FirstDoctorIds,
        IsAsc: true,
      };
      this.$Api.getOutHosPats(params).then((result) => {
        if (this.pageIndex === 1) {
          let now = {
            inHospStartTime:
              (this.timeRange && this.timeRange[0]) ||
              GetFormatDateTime(
                null,
                new Date(new Date().getTime() - 7 * 24 * 3600 * 1000)
              ),
            inHospEndTime:
              (this.timeRange && this.timeRange[1]) || GetFormatDateTime(),
            QueryKey: this.patMessage,
            AreaType: this.selectAreas,
            PageIndex: this.pageIndex,
            PageSize: this.pageSize,
            FirstDoctorIds: this.FirstDoctorIds,
            IsAsc: true,
          };
          if (JSON.stringify(now) !== JSON.stringify(params)) return;
        }
        let data = result.Data || [];
        this.totalPage = result.Count;
        this.$store.commit("public/SET_PATIENTTABLELIST", data);
      });
    },
    search() {
      this.pageIndex = 1;
       this.debouceElg();
    },
    handleCurrentChange(value) {
      console.log(value, "当前页码");
      this.pageIndex = value;
      this.getPatientList();
    },
    handleSizeChange(value) {
      this.pageSize = value;
      this.pageIndex = 1;
      this.getPatientList();
    },
    // 区域筛选
    handleSelArea(value) {
      console.log(value, "区域筛选");
      if (value.length >= 2 && value.indexOf(0) != -1) {
        if (value[0] == 0) {
          // 全部在第一位，先选择了全部，再选择各个诊疗区
          value.shift();
          this.selectAreas = value;
        } else {
          // 全部在第二位，先选择了诊疗区 之后点击全部,诊疗区全清除
          this.selectAreas = [0];
        }
      }
      // if (value.indexOf(0) != -1) {
      //   this.selectAreas = [0];
      // }
      this.search();
    },
    // 获取全部配置项
    getTableConfig() {
      let params = { tableCode: "OutDepartmentPatient" };
      this.$Api.getTableColConfig(params).then((res) => {
        if (res.Status) {
          this.columnsAll = res.Data;
          this.columns = [];
          res.Data.forEach((item) => {
            if (item.Ifcover) {
              this.columns.push(item);
            }
          });
          if (this.columns.length == this.columnsAll.length) {
            this.checkAll = true;
          } else {
            this.checkAll = false;
          }
        }
      });
    },
    // 全选配置项
    handleCheckAllChange(value) {
      if (value) {
        this.columnsAll.forEach((item) => {
          item.Ifcover = true;
        });
      } else {
        this.columnsAll.forEach((item) => {
          item.Ifcover = false;
        });
      }
    },
    // 保存配置
    saveConfig() {
      let params = { tableCode: "OutDepartmentPatient" };
      this.columnSet = false;
      let ColumnCode = [];
      this.columnsAll.forEach((item) => {
        if (item.Ifcover) {
          ColumnCode.push(item.Code);
        }
      });
      params["ColumnCode"] = ColumnCode;
      this.$Api.setTableColConfig(params, ColumnCode).then((res) => {
        if (res.Status) {
          this.getTableConfig();
          this.$msg.success("操作成功");
        }
      });
    },
    // 导出excel
    exportData() {
      if (this.showLoading) return;
      let url = "";
      let areaArr = [];
      if (this.selectAreas.indexOf(0) != -1) {
        this.options.forEach((item) => {
          if (item.value != 0) {
            areaArr.push(item.value);
          }
        });
        areaArr;
      } else {
        areaArr = this.selectAreas;
      }
      let obj = {
        inHospStartTime:
          (this.timeRange && this.timeRange[0]) ||
          GetFormatDateTime(
            null,
            new Date(new Date().getTime() - 7 * 24 * 3600 * 1000)
          ),
        inHospEndTime:
          (this.timeRange && this.timeRange[1]) || GetFormatDateTime(),
        QueryKey: this.patMessage,
        AreaType: areaArr,
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
        IsAsc: true,
        UserId: this.user.UserInfo.Id,
        HospitalAreaId: this.user.HospitalAreaId,
      };
      let dto = JSON.stringify(obj);
      // 固定列
      let defaultCol = {
        Prognosis: "转归",
        TriageLevel: "级别",
        PatientName: "姓名",
        PatGenderCode: "性别",
        AgeYear: "年龄",
      };
      let params = {};
      this.columnsAll.forEach((item) => {
        if (item.Ifcover) {
          params[item.Code] = item.Name;
        }
      });
      let cols = JSON.stringify(Object.assign({}, defaultCol, params));
      url = `${
        URLCONFIG.Doctor
      }/api/v1/Patient/OutHospitalPatientExport?dto=${dto}&columns=${cols}&FirstDoctorIds=${JSON.stringify(
        this.FirstDoctorIds
      )}`;
      console.log(url);
      this.showLoading = true;
      // this.$msg.info('数据导出中...')
      this.$confirm(
        "数据导出中，您可以操作其他内容，但请勿退出系统！",
        "提示",
        {
          confirmButtonText: "确定",
          showCancelButton: false,
        }
      );
      exportData(url, "出科患者", () => {
        this.$msg.success("数据导出成功！");
        this.showLoading = false;
      });
    },
    callbackPatient(row) {
      //this.showAlter = true
      let obj = {
        title: "患者召回",
        visible: true,
        data: row,
      };
      this.$store.commit("public/SET_DIALOGDATA", obj);
    },
    // 查看
    gotoDetail(row) {
      this.$router.push({
        name: "medicalHistory",
        query: { id: row.Id, from: "caseControl" },
      });
    },
  },
  computed: {
    ...mapGetters({
      user: "public/GET_USER",
      patList: "public/GET_PATIENTTABLELIST",
      dialogData: "public/GET_DIALOGDATA",
    }),

    options: function () {
      let arr = [{ name: "全部", value: 0 }];
      this.user.DiagnosisAreas.forEach((item) => {
        let obj = {};
        obj.name = item.DiagnosisAreaName;
        obj.value = item.DiagnosisAreaType;
        arr.push(obj);
      });
      return arr;
    },
  },
  watch: {
    patMessage(val) {
        this.search();
    },
  },
};
</script>

<style lang="less">
.caseControl {
  .caseControlHead {
    padding: 10px 25px;
    height: 50px;
    border-top: 10px solid #dfe7f5;
    line-height: 50px;
    .left {
      float: left;
      div:nth-child(1) {
        > span {
          margin-right: 10px;
        }
      }
      /deep/.el-button--small,
      .el-button--small.is-round {
        margin-bottom: 6px;
      }
      > div {
        float: left;
        margin-right: 20px;
      }
      /deep/.el-input--small .el-input__inner {
        height: 32px !important;
      }
      /deep/.el-input-group__prepend {
        width: 97px;
        border: none;
        background-color: #f3f5f9;
        padding: 0;
      }

      /deep/.el-input-group__append {
        border: none;
      }
      /deep/.el-input-group--append .el-input__inner {
        border: none;
        background-color: #f3f5f9;
        border-right: 1px solid #c5d0d9;
      }
      /deep/.el-input-group__prepend .el-select {
        margin: 0;
      }
    }
    .right {
      float: right;
      img {
        cursor: pointer;
        width: 20px;
        height: 20px;
        margin-right: 20px;
      }
    }
  }
  .caseControlContent {
    height: calc(~"(100% - 80px)");
    overflow: auto;
    .pageStyle {
      text-align: right;
      margin-top: 10px;
      /deep/.el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: @blueMain;
      }
      span {
        display: inline-block;
      }
      .pageNum {
        float: right;
      }
    }
  }
}
</style>
