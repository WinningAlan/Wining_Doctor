<template>
  <div class="diagnose">
    <div class="tabs-temp">
      <el-radio-group v-model="nowTemp" @change="tapsExamine" fill="#0071e7">
        <el-radio-button
          :label="item.Value"
          v-for="(item,index) in tabsTemp"
          v-if="item.Show"
          :key="index"
        >{{item.Text}}</el-radio-button>
      </el-radio-group>
    </div>
    <div class="content">
      <div class="newDiagnose" v-if="nowTemp=='newDiagnose' ">
        <div class="new-left-list">
          <myTabs
            :tabsList="tabsList"
            :activeName.sync="activeName"
            :tabChange="selectTabs"
            :width="90"
          ></myTabs>
          <!-- <div class="search">
            <el-input placeholder="请输入" v-model="serachName" size="small">
              <i slot="suffix" class="el-input__icon el-icon-search icon-left"></i>
            </el-input>
          </div>-->
          <ul class="list">
            <li v-for="(item,index) in recommendData" :key="index" @click="addDiagnosis(item)">
              <span
                :title="item.DiagnosisName.length>8?item.DiagnosisName:''"
              >{{item.DiagnosisName}}</span>
              <div class="warp">
                <span class="add" v-if="!item.show"></span>
                <span class="minus" v-else></span>
              </div>
              <span class="finish" v-if="item.show"></span>
            </li>
          </ul>
        </div>
        <div class="new-right">
          <div class="old-submit" ref="oldSubmitContiner">
            <submit-table
              :tableData="oldSubmitData"
              ref="oldTable"
              :callback="selectRow"
              :type="1"
              id="oldSubmitTable"
              :options="options"
              :isSelect="true"
            ></submit-table>
          </div>
          <div class="create-diagnose">
            <h3>待提交</h3>
            <div class="create-content">
              <doctorAdviceTable
                :tableData="toSubmitData"
                :columns="toColumns"
                ref="toSubmit"
                :columnsIndex="0"
                :orderType="1111"
                :callback="delDiagnosis"
                @row-click="clickRow"
              >
                <template slot="DiagnosisName" slot-scope="{scope}">
                  <searchDiagnose
                    :callBack="add"
                    :number="scope.$index"
                    :itemName="scope.row.DiagnosisName"
                    v-if="scope.row._edit"
                    ref="searchDiagnose"
                    :isCreate="true"
                    :type="ICDCode"
                  ></searchDiagnose>
                  <span v-else class="DiagnosisName">{{scope.row.DiagnosisName}}</span>
                </template>
                <template slot="RecordDate" slot-scope="{scope}">
                  <el-date-picker
                    style="width:170px;"
                    :clearable="false"
                    :picker-options="pickerOptions"
                    @change="changeTime(scope.row,$event)"
                    v-model="scope.row.RecordDate"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm"
                    placeholder="选择日期时间"
                    default-time="12:00:00"
                  ></el-date-picker>
                </template>
                <template slot="DiagnosisCode" slot-scope="{scope}">
                  <span>{{scope.row.ICDName}}{{scope.row.ICDCode}}</span>
                </template>
              </doctorAdviceTable>
              <searchDiagnose :callBack="add" class="search-diagnose" :type="ICDCode"></searchDiagnose>
            </div>
            <div class="diagnose-button">
              <el-button @click="cancel" class="reset">取消</el-button>
              <el-button @click="save" class="save">提交</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="historyDiagnose" v-else>
        <div class="left">
          <ul class="list">
            <li
              v-for="(item,index) in historyListData"
              :key="item.InHospitalId"
              :class="{active:historySelectId===item.InHospitalId}"
              @click="selectHisData(item)"
            >
              <p>{{item.DepartmentName}}</p>
              <span>{{item.InHospTime | timeFilter}}</span>
            </li>
          </ul>
        </div>
        <div class="right">
          <submit-table
            :tableData="historyTableData"
            :options="options"
            ref="oldTable"
            :callback="selectRow"
            :type="2"
          ></submit-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import submitTable from "../../components/doctorAdvice/diagnose/submitTable";
import searchDoctorAdvice from "../../components/doctorAdvice/openDoctorAdvice/searchDoctorAdvice";
import historyList from "@/components/doctorAdvice/requestCommon/historyList";
import searchDiagnose from "../../components/doctorAdvice/diagnose/searchDiagnose";
import doctorAdviceTable from "../../components/doctorAdvice/openDoctorAdvice/doctorAdviceTable";
import myTabs from "../../components/common/my-tabs";
import { numTostr } from "../../utils/public";
import { GetFormatDateTime } from "../../utils/public";
export default {
  name: "diagnose", //诊断管理
  components: {
    submitTable,
    searchDoctorAdvice,
    searchDiagnose,
    doctorAdviceTable,
    myTabs
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() <
            +new Date(GetFormatDateTime("yyyy/MM/dd", new Date()) + " 00:00:00")
          );
        }
      },
      tabsList: [
        {
          label: "主诉推荐",
          value: 1
        },
        {
          label: "科室常用",
          value: 2
        }
      ],
      options: [],
      oldSubmitData: [], //已提交的数据;
      toColumns: [
        {
          text: "诊断内容",
          value: "DiagnosisName",
          width: "200"
        },
        {
          text: "ICD疾病编码",
          value: "DiagnosisCode",
          width: "100"
        },
        {
          text: "ICD版本",
          value: "DiagnosisICDType",
          maxWidth: "90"
        },
        {
          text: "诊断类型",
          value: "DiagnosisTypeCode",
          editType: "select",
          maxWidth: "150",
          options: []
        },
        {
          text: "开立人",
          value: "CreateUser",
          maxWidth: "90"
        },
        {
          text: "开立时间",
          value: "RecordDate",
          maxWidth: "195"
        }
      ], //待提交表头
      toSubmitData: [], //待提交的数据
      historyListData: [], //历史列表数据
      historyTableData: [], //历史诊断的表格数据
      activeName: 1, //当前常用项的类型
      serachName: "", //搜索常用项的名称
      nowTemp: "newDiagnose", //切换后现在的组件,
      tabsTemp: [
        {
          Text: "新建诊断",
          Value: "newDiagnose",
          Show: true
        },
        {
          Text: "诊断记录",
          Value: "historyDiagnose",
          Show: true
        }
      ], //切换新建诊断和诊断记录的数据存储
      historySelectId: "", //选着点击保存id
      ICDCode: "", //存储ICD的类型
      recommendData: [],
      depCode: ""
    };
  },
  created() {
    this.getICDtype();
    this.getDiagnoseType();
    this.getOldSubmit();
    this.pickerOptions.disabledDate = time => {
      return (
        time.getTime() <
        +new Date(
          GetFormatDateTime(
            "yyyy/MM/dd",
            new Date(this.patientMsg.InHospTime)
          ) + " 00:00:00"
        )
      );
    };
  },
  props: {
    initialize: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      patientMsg: "public/GET_PATIENTMSG",
      selectArea: "home/GET_SELECTAREA", //所在区域
      userName: "public/GET_USERNAME",
      isRegister: "configuration/GET_ISREGISTER", //是否可挂号
      user: "public/GET_USER",
      isReportCard: "configuration/GET_ISREPORTCARD", //是否报卡
    }),
    doctorDep() {
      let data = this.patientMsg.RegisterInfoList || [];
      let depId = "";
      for (let i = 0; i < data.length; i++) {
        if (this.patientMsg.RegistId === data[i].HisRegistId) {
          depId = data[i].RegDepartmentCode;
        }
      }
      return depId;
    }
  },
  watch: {
    "patientMsg.Status": {
      handler(val) {
        if (val === 8) {
          this.tabsTemp[0].Show = false;
          this.nowTemp = "historyDiagnose";
          this.$Api
            .getDiagnoseList({ PatientId: this.patientMsg.PatientId })
            .then(res => {
              if (res.Status) {
                this.historyListData = res.Data;
                console.log("data", res.Data);
                if (this.historyListData[0]) {
                  this.historySelectId = this.historyListData[0].InHospitalId;
                  this.getHisTableData(this.historySelectId);
                }
              }
            });
        } else {
          this.tabsTemp[0].Show = true;
          this.nowTemp = "newDiagnose";
        }
      },
      deep: true,
      immediate: true
    },
    patientMsg: {
      handler(val) {

        if (val) {
          let list = this.patientMsg.RegisterInfoList || [];
          console.log(list, "list", this.patientMsg.RegistId);
          list.forEach((item, index) => {
            if (this.patientMsg.RegistId == item.HisRegistId) {
              this.depCode = item.RegDepartmentCode;
              console.log(list, "list", this.patientMsg.RegistId, this.depCode);
            }
          });
        }
        if (val.TriageId) {
          this.selectTabs(this.activeName, true);
        }
      },
      deep: true,
      immediate: true
    },
    initialize(val) {
      if (val) {
        this.selectTabs(1, true);
        this.nowTemp = "newDiagnose";
        this.cancel();
        this.getICDtype();
        this.getDiagnoseType();
        this.getOldSubmit();
        this.pickerOptions.disabledDate = time => {
          return (
            time.getTime() <
            +new Date(
              GetFormatDateTime(
                "yyyy/MM/dd",
                new Date(this.patientMsg.InHospTime)
              ) + " 00:00:00"
            )
          );
        };
      }
    }
  },
  methods: {
    // 获取ICD类型
    getICDtype() {
      this.$Api.getICDtype({ t: new Date().getTime() }).then(res => {
        if (res.Status && res.Data) {
          this.ICDCode = res.Data["ICDTypeName"];
        }
      });
    },
    // 获取诊断类型
    getDiagnoseType() {
      this.$Api.getDiagnoseType({}).then(res => {
        if (res.Status) {
          var arr = [];
          this.options = res.Data;
          res.Data &&
            res.Data.forEach(item => {
              arr.push({
                Text: item.DiagnosisTypeName,
                Value: item.DiagnosisTypeCode
              });
            });
          this.toColumns[3].options = arr;
        }
      });
    },
    //切换历史和新建
    tapsExamine(val) {
      this.nowTemp = val;
      if (this.nowTemp === "historyDiagnose") {
        this.$Api
          .getDiagnoseList({ PatientId: this.patientMsg.PatientId })
          .then(res => {
            if (res.Status) {
              this.historyListData = res.Data;
              console.log("data", res.Data);
              if (this.historyListData[0]) {
                this.historySelectId = this.historyListData[0].InHospitalId;
                this.getHisTableData(this.historySelectId);
              }
            }
          });
      }
    },
    //新增或者修改诊断
    add(val, num) {
      console.log(val, num);
      let data = num < 0 ? {} : this.toSubmitData[num];
      let off = true;
      this.toSubmitData.forEach((item, index) => {
        console.log(val, item, "--------");
        if (item.DiagnosisName == val.Name && (num < 0 || num != index)) {
          this.$msg.warning("不能重复开诊断");
          off = false;
          return;
        }
      });
      if (off) {
        if (typeof val === "string") {
          data.DiagnosisName = val;
          data.newData = true;
          data._edit = false;
        } else {
          data.InHospPatId = this.$route.query.id || this.patientMsg.InHouseId;
          // data.DiagnosisCategory = 1;
          data.DiagnosisName = val.Name;
          data.ICDName = val.ICDName;
          data.Code = val.Code;
          data.RecordDate = GetFormatDateTime("yyyy/MM/dd HH:mm", new Date());
          //data.DiagnosisTypeCode = data.DiagnosisTypeCode || "";
          data.DiagnosisTypeCode =
            this.toColumns[3].options && this.toColumns[3].options[0].Value;
          data.DiagnosisCode = val.Code;
          data.ICDCode = val.ICDCode;
          data.DiagnosisICDType = val.ICDType;
          data.CreateUser = this.userName;
          data.Flag = 0;
          data.newData = false;
          data._edit = false;
          data.AreaId = this.patientMsg.AreaId || null;
          data.DepartMentCode = this.depCode || null;
        }
        console.log(this.toSubmitData);
        if (num < 0) {
          this.toSubmitData.push(data);
        }
      }
    },
    //取消所有诊断，清理诊断内容
    cancel() {
      this.toSubmitData = [];
      for (let i = 0; i < this.recommendData.length; i++) {
        this.recommendData[i].show = false;
      }
    },
    //保存诊断内容
  async  save() {
      if (!this.patientMsg.RegistId) {
        this.$msg.info("该患者无有效挂号，请先挂号！");
        if (this.isRegister === "1") {
          let obj = {
            title: "患者挂号",
            width: "800px",
            component: "registrationAlter",
            isShowFooter: true,
            btn: ["挂号", "取消"],
            visible: true
          };
          this.$store.commit("public/SET_DIALOGDATA", obj);
        }
        return;
      }
      if (!this.toSubmitData.length) return this.$msg.info("没有可提交的诊断");
      let arr = [];
      for (let i = 0; i < this.toSubmitData.length; i++) {
        if (!this.toSubmitData[i].DiagnosisTypeCode) {
          arr.push(numTostr(i + 1));
        }
      }
      if (arr.length) {
        this.$msg.warning(`第${arr.join("、")}行，诊断类型未填`);
        return;
      }
      var data = {
        InHospPatId: this.$route.query.id || this.patientMsg.InHouseId,
        HisRegisterId: this.patientMsg.RegistId,
        DictDiagnosisModels: [],
        DiagnosisRecordModels: this.toSubmitData
      };
      for (var i = 0; i < this.toSubmitData.length; i++) {
        if (this.toSubmitData[i].newData) {
          data.DictDiagnosisModels.push({
            Code: this.toSubmitData[i].DiagnosisCode,
            Name: this.toSubmitData[i].DiagnosisName,
            ICDType: this.toSubmitData[i].DiagnosisICDType,
            [`ICD${this.toSubmitData[i].DiagnosisICDType.replace(
              /[^0-9]/gi,
              ""
            )}Code`]: this.toSubmitData[i].ICDCode,
            Abstract: ""
          });
        }
      }
      let loadingInstance = this.$loading();
      try {
        let isSave=await this.$IMIS.loadPatientInfoIMIS(this.patientMsg)
        if(!isSave)return loadingInstance.close()
      } catch (error) {
        
      }
      this.$Api.submitDiagnoseData(data).then(res => {
        console.log(res);
        loadingInstance.close()
        this.$msg[res.Status ? "success" : "warning"](res.Message);
        if (res.Status) {
          let arr = [];
          let data = res.Data || [];
          data.forEach(item => {
            arr.push({
              zddm: item.DiagnosisCode,
              zdmc: item.DiagnosisName,
              zdlx: 0
            });
          });
          this.getOldSubmit(true, arr);
          this.toSubmitData = [];
          this.setPatMsg(this.$route.query.id || this.patientMsg.InHouseId);
          for (var i = 0; i < this.recommendData.length; i++) {
            this.recommendData[i].show = false;
          }
        }
      });
    },
    changeNum(val) {
      this.editNum = val;
    },
    //常用诊断和推荐诊断的切换
    selectTabs(value, bl) {
      // console.log(str, row);
      if (value === 1) {
        this.$Api
          .getRecommend({ TriageId: this.patientMsg.TriageId })
          .then(res => {
            console.log("recommendData", res);
            this.recommendData = res.Data || [];
            for (var i = 0; i < this.recommendData.length; i++) {
              for (var j = 0; j < this.toSubmitData.length; j++) {
                if (
                  this.recommendData[i].DiagnosisName ==
                  this.toSubmitData[j].DiagnosisName
                ) {
                  this.recommendData[i].show = true;
                }
              }
            }
            if (!this.recommendData.length && bl) {
              this.activeName = 2;
              this.selectTabs(2);
            }
            !res.Status && this.$msg.warning(res.Message);
          });
      } else {
        let data = {
          areaId: this.patientMsg.AreaId || null,
          departmentCode: this.depCode || null
        };
        // if (
        //   this.patientMsg.AreaId == "979319b6-7e1f-e911-80cd-0050568e1b08" ||
        //   this.patientMsg.AreaId == "ee2bcb06-ae4a-e911-99d9-0050568e1b08"
        // ) {
        //   data.queryType = 2;
        //   data.code = this.patientMsg.AreaId;
        // } else {
        //   data.queryType = 1;
        //   data.code = this.patientMsg.Department || "";
        // }

        this.$Api.getDepOrArea(data).then(res => {
          this.recommendData = res.Data || [];
          for (var i = 0; i < this.recommendData.length; i++) {
            for (var j = 0; j < this.toSubmitData.length; j++) {
              if (
                this.recommendData[i].DiagnosisName ==
                this.toSubmitData[j].DiagnosisName
              ) {
                this.recommendData[i].show = true;
              }
            }
          }
          !res.Status && this.$msg.warning(res.Message);
          // console.log(res)
        });
      }
    },
    //获取已提交的数据
    getOldSubmit(bl, arr) {
      this.$Api
        .getHistoryDiagnoseList({ inHouseId: this.$route.query.id })
        .then(res => {
          if (res.Status) {
            // this.oldSubmitData = [...res.Data];
            let dom = this.$refs.oldSubmitContiner||{};
            this.$nextTick(() => {
              dom.scrollTop = dom.scrollHeight;
            });
            this.oldSubmitData = res.Data || [];
            if (bl&&this.isReportCard==='1') {
              let data = {
                yqdm: this.user.HospitalAreaCode,
                bgrdm: this.user.UserInfo.No,
                bgksdm: this.doctorDep,
                ghxh: this.patientMsg.RegistId,
                diagnosisThis: arr,
                diagnosis: []
              };
              this.oldSubmitData.forEach((item, index) => {
              data.diagnosis.push({
                  zddm: item.DiagnosisCode,
                  zdmc: item.DiagnosisName,
                  zdlx: 0
                });
              });
              this.$Api.postDiagCar(data).then(res => {
                if (!res.Status) {
                  this.$msg.warning(res.Message);
                }
              });
            }
          }
        });
    },
    //已提交数据的表格的回调函数
    selectRow(str, val) {
      if (str === "del") {
        this.getOldSubmit();
        this.setPatMsg(this.$route.query.id || this.patientMsg.InHouseId);
      } else {
        this.nowTemp = "newDiagnose";
        var data = {};
        data.InHospPatId = this.$route.query.id || this.patientMsg.InHouseId;
        // data.DiagnosisCategory = 1;
        data.DiagnosisName = val.DiagnosisName;
        data.ICDName = val.ICDName;
        data.RecordDate = new Date();
        data.DiagnosisTypeCode = val.DiagnosisTypeCode;
        data.DiagnosisCode = val.DiagnosisCode;
        data.DiagnosisICDType = val.DiagnosisICDType;
        data.Flag = 0;
        data.newData = false;
        data.CreateUser = this.userName;
        data.AreaId = this.patientMsg.AreaId || null;
        data.DepartMentCode = this.depCode || null;
        data._edit = false;
        for (var i = 0; i < this.toSubmitData.length; i++) {
          if (this.toSubmitData[i].DiagnosisName == data.DiagnosisName) {
            this.$msg.warning("存在相同的诊断！！");
            return;
          }
        }
        this.toSubmitData.push(data);
        this.$msg.success("引用成功！！");
        for (var i = 0; i < this.recommendData.length; i++) {
          for (var j = 0; j < this.toSubmitData.length; j++) {
            if (
              this.recommendData[i].DiagnosisName ==
              this.toSubmitData[j].DiagnosisName
            ) {
              this.recommendData[i].show = true;
            }
          }
        }
      }
    },
    //时间选着，修改不能让选着的时间大于入科时间
    changeTime(val, el) {
      if (+new Date(el) < +new Date(this.patientMsg.InHospTime)) {
        this.$msg.info("申请时间不允许早于患者入科时间！");
        console.log("date", val, el);
        val.RecordDate = GetFormatDateTime(
          "yyyy/MM/dd HH:mm",
          new Date(this.patientMsg.InHospTime)
        );
      }
      //  是否是补录医嘱
    },
    //获取历史常看的表格数据
    getHisTableData(id) {
      this.$Api.getHistoryDiagnoseList({ inHouseId: id }).then(res => {
        if (res.Status) {
          console.log(res.Data);
          this.historyTableData = res.Data;
        }
      });
    },
    //筛选需要的数据
    selectHisData(val) {
      console.log(val);
      this.historySelectId = val.InHospitalId;
      this.getHisTableData(val.InHospitalId);
    },
    //推荐项新增诊断
    addDiagnosis(val) {
      console.log(1111);
      if (val.show) {
        this.minusDiagnosis(val);
      } else {
        this.$Api
          .getDiagnoseSearchData({
            keyWord: val.DiagnosisName,
            icdType: this.ICDCode
          })
          .then(res => {
            if (res.Status) {
              for (var i = 0; i < res.Data.length; i++) {
                if (val.DiagnosisName === res.Data[i].Name) {
                  this.$set(val, "show", true);
                  this.add(res.Data[i], -1);
                  break;
                }
              }
            }
          });
      }
    },
    //推荐诊断去除操作
    minusDiagnosis(item) {
      console.log(item);
      for (var i = 0; i < this.toSubmitData.length; i++) {
        if (item.DiagnosisName === this.toSubmitData[i].DiagnosisName) {
          this.toSubmitData.splice(i, 1);
          this.$set(item, "show", false);
        }
      }
    },
    //删除诊断
    delDiagnosis(val) {
      for (var i = 0; i < this.recommendData.length; i++) {
        if (val.DiagnosisName === this.recommendData[i].DiagnosisName) {
          this.recommendData[i].show = false;
        }
      }
    },
    //更新患者基本信息
    setPatMsg(id) {
      this.$store.dispatch("public/getPatientMsg", {
        that: this,
        data: { inHouseId: id }
      });
    },
    clickRow(row, event, cell) {
      console.log(row, event, cell);
      let { label } = cell;
      this.$refs.toSubmit.dblclick(row, { label });
    }
  }
};
</script>
<style scoped lang='less'>
//  @import url("./adviceStyle.less");
.diagnose {
  padding: 10px 15px;
  // height: 100%;
  // // box-sizing: border-box;
  // overflow: hidden;
  // font-size: @
  .tabs-temp {
    /deep/.el-radio-button__inner {
      width: 98px;
      height: 32px;
      font-size: 14px;
      border-radius: 0;
    }
  }
  .content {
    margin-top: 15px;
    position: relative;
    height: calc(~"(100vh - 135px)");
    // background:red;
    // overflow: auto;
    .newDiagnose {
      height: 100%;
      .new-left-list {
        height: 100%;
        float: left;
        width: 180px;
        padding-right: 20px;
        height: 100%;
        border-right: 1px solid #dfe7f5;
        margin-right: 15px;
        /deep/.el-tabs__item {
          width: 90px;
          padding-bottom: 0;
        }
        // .search {
        // margin-top: -10px;
        // }
        .el-input {
          border-bottom: 1px solid #ccc;
        }
        /deep/.el-input__inner {
          border: none;
        }
        .icon-left {
          font-size: 20px;
          cursor: pointer;
        }
        .list {
          height: calc(~"(100% - 40px)");
          overflow: auto;
        }
        .list li {
          height: 30px;
          border-bottom: 1px solid #ccc;
          padding-left: 10px;
          cursor: pointer;
          line-height: 30px;
          font-size: 14px;
          span {
            float: left;
            width: 130px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .warp {
            display: none;
            float: right;
            line-height: 30px;
            padding-right: 5px;
            span {
              width: 20px;
              height: 20px;
              margin-top: 7px;
            }
            .add {
              background: url("../../assets/imges/jiahao.svg") no-repeat;
            }
            .minus {
              background: url("../../assets/imges/jianhao.svg") no-repeat;
            }
          }
          .finish {
            padding-right: 5px;
            float: right;
            width: 16px;
            height: 16px;
            margin-top: 7px;
            background: url("../../assets/imges/success.svg") no-repeat;
          }
          &:hover {
            background: #dfe7f5;
            .warp {
              display: block;
            }
            .finish {
              display: none;
            }
          }
        }
      }
      .new-right {
        height: 100%;
        height: calc(~"(100% - 60px)");

        h3 {
          margin-bottom: 10px;
          font-size: 16px;
          color: #000622;
        }
        overflow: hidden;
        .old-submit {
          min-height: 20%;
          max-height: 45%;
          margin-bottom: 20px;
          overflow: auto;
        }
        .create-diagnose {
          height: 50%;
          padding-bottom: 20px;
          // position: relative;
          // overflow: auto;
          .create-content {
            height: 96%;
            overflow: auto;
          }
        }
        .search-diagnose {
          margin-top: 10px;
        }
        .diagnose-button {
          position: absolute;
          bottom: 10px;
          left: 0;
          right: 0;
          text-align: center;
          margin-left: 200px;
          .save {
            background: #0071e7;
            border-radius: 2px;
            width: 98px;
            color: #fff;
            font-size: 14px;
          }
          .reset {
            background: #f3f5f9;
            width: 98px;
            border-radius: 2px;
          }
        }
      }
      .right {
        overflow: auto;
        height: calc(~"(100% - 60px)");
      }
    }
    .historyDiagnose {
      height: 100%;
      display: flex;
      .left {
        width: 120px;
        padding: 0 10px;
        height: 100%;
        border-right: 1px solid #ccc;
        margin-right: 30px;
        .list {
          height: calc(~"(100% - 60px)");
          overflow: auto;
        }
        .list li {
          height: 40px;
          border-bottom: 1px solid #ccc;
          padding-left: 10px;
          cursor: pointer;
          font-size: 12px;
        }
        .active {
          background: #0071e7;
          color: #fff;
        }
      }
      .right {
        flex: 1;
      }
    }
  }
  .DiagnosisName {
    display: inline-block;
    height: 32px;
    width: 100%;
    background: #f2f2f2;
    line-height: 32px;
    color: rgb(96, 98, 102);
    font-size: 14px;
  }
}
/deep/ .el-select,
.el-date-editor {
  border: none;
  /deep/.el-input__inner {
    background: #f2f2f2;
    border-radius: 2px;
    border: none;
  }
}
</style>
