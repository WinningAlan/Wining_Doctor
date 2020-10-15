<template>
  <div class="home" id="home">
    <!--头部-->
    <home-head ref="head" :getPatientList="getPatientList" :showLoading.sync="showLoading"></home-head>
    <div style="height:100%">
      <!--卡片列表-->
      <condition-list
        ref="card"
        :getPatientList="getPatientList"
        v-loading="showLoading"
        element-loading-text="拼命加载中..."
      ></condition-list>
      <!--表格筛选-->
      <div class="handleTable">
        <div class="handleTableLeft">
          <el-input
            placeholder="姓名/患者ID/病历号/卡号"
            v-model="searchData"
            class="input-with-select"
            @input="searchList"
            @keyup.enter.native="searchList"
            clearable
            ref="inputWithSelect"
          >
            <el-select v-model="cardType" slot="prepend" placeholder="请选择">
              <el-option
                :label="item.name"
                :value="item.value"
                v-for="(item,index) in cardList"
                :key="index"
              ></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="getPatientList(1)"></el-button>
          </el-input>
        </div>
        <div class="handleTableRight" v-show="selectArea.DiagnosisAreaType">
          <el-tooltip content="床卡" placement="top" effect="light">
            <img
              v-show="selectArea.DiagnosisAreaType!=3"
              @click="showBedList"
              v-if="showBedCard==false"
              src="../../assets/imges/card.svg"
            />
            <img
              v-show="selectArea.DiagnosisAreaType!=3"
              @click="showBedList"
              v-else
              src="../../assets/imges/cardSelect.svg"
            />
          </el-tooltip>
          <el-tooltip content="表格" placement="top" effect="light">
            <img
              v-show="selectArea.DiagnosisAreaType!=3"
              @click="showTable"
              src="../../assets/imges/table.svg"
              v-if="showBedCard"
            />
            <img
              v-show="selectArea.DiagnosisAreaType!=3"
              @click="showTable"
              v-else
              src="../../assets/imges/tableSelect.svg"
            />
          </el-tooltip>
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
      <!--表格-->
      <div class="homeDataContent" v-loading="showPatListLoading" element-loading-text="拼命加载中...">
        <bed-info
          v-show="showBedCard"
          :getPatientList="getPatientList"
          :columns="columns"
          :setAttentionTag="setAttentionTag"
          :showPatListLoading="showPatListLoading"
        ></bed-info>
        <pat-message-table
        :height='height'
          v-show="showBedCard==false"
          :getPatientList="getPatientList"
          :columns="columns"
          :defaultColumns="defaultColumns"
          :setAttentionTag="setAttentionTag"
          @sort-change="sortChange"
          :showPatListLoading="showPatListLoading"
        >
          <template slot-scope="{scope}">
            <el-button
              type="text"
              v-if="scope.row.ReceptionStatus==0&&selectArea.DiagnosisAreaType===3&&scope.row.Status!==8"
              @click.stop="startDoctor(scope.row)"
            >就诊</el-button>
            <el-button
              type="text"
              v-if="scope.row.ReceptionStatus==1&&selectArea.DiagnosisAreaType===3"
              @click.stop="goonDoctor(scope.row)"
            >继续</el-button>
            <el-button
              type="text"
              v-if="scope.row.Status!=8&&selectArea.DiagnosisAreaType!==3"
              @click.stop="setDoctorAdvice(scope.row)"
            >医嘱下达</el-button>
            <el-button
              type="text"
              v-if="scope.row.Status!=8&&scope.row.ReceptionStatus!==0"
              @click.stop="turnTo(scope.row)"
            >转归</el-button>
            <el-button
              type="text"
              v-if="scope.row.ReceptionStatus==1&&selectArea.DiagnosisAreaType===3&&scope.row.FirstDoctorId===user.UserInfo.Id"
              @click.stop="cancel(scope.row)"
            >取消就诊</el-button>
            <el-button
              type="text"
              v-if="scope.row.Status==8"
              @click.stop="callbackPat(scope.row)"
            >召回</el-button>
          </template>
        </pat-message-table>
        <div class="pageStyle" v-if="totalPage!=0&&showBedCard==false">
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
    </div>
    <!--弹窗-->
    <my-alter
      :title="dialogData.title||''"
      :visible="dialogData.visible||false"
      :isfooter="true"
      :width="dialogData.width"
      :callback="closeDialog"
    >
      <component :is="dialogData.component||''" ref="content" :initialize="dialogData.visible"></component>
    </my-alter>
  </div>
</template>

<script>
import conditionList from "../../components/home/conditionList.vue";
import patMessageTable from "../../components/common/patMessageTable.vue";
import bedInfo from "@/components/home/bedInfo";
import homeHead from "@/components/home/homeHead";
import { mapGetters } from "vuex";
import myAlter from "@/components/common/myAlter";
import setCards from "@/components/home/setCards";
import turnTo from "@/components/common/turnTo";
import inHosRequestNotes from "@/components/common/inHosRequestNotes";
import transferHosRequestNotes from "@/components/common/transferHosRequestNotes";
import { cardList } from "@/module/staticData.js";
import callbackPat from "@/components/common/callbackPat";
import { birthdayToAge, debouce } from "@/utils/public";
import doctorSelectDep from "@/components/home/doctorSelectDep";
import CASign from "@/utils/caSign.js";
export default {
  name: "home", //急诊诊疗
  components: {
    conditionList,
    patMessageTable,
    homeHead,
    myAlter,
    setCards,
    bedInfo,
    turnTo,
    inHosRequestNotes,
    transferHosRequestNotes,
    callbackPat,
    doctorSelectDep
  },
  data() {
    this.startTime=0
    return {
      showPatListLoading: true, //获取用户列表loading
      showLoading: true, //页面展示正在加载中
      cardType: 3,
      cardList: cardList,
      searchData: "",
      checkAll: false,
      columnSet: false,
      showBedCard: true,
      // columns: [], //已经配置项表头
      // columnsAll: [], //全部配置项表头
      columnsBed: [], //床卡已经配置项表头
      columnsBedAll: [], //床卡全部配置项表头
      columnsClinic: [], //门急诊已经配置项表头
      columnsClinicAll: [], //门急诊全部配置项表头
      pageSize: 10,
      totalPage: 0,
      pageIndex: 1,
      // 表格的默认列
      inHosPatDefaultColumn: [
        { prop: "AttentionTag", label: "重点关注", width: "70", children: [] },
        { prop: "TriageLevel", label: "分级", width: "50", children: [] },
        {
          prop: "PatientName",
          label: "患者基本信息",
          minWidth: "120",
          children: ["IsNew", "PatientName", "PatGenderCode", "AgeYear"]
        },
        {
          prop: "DiagnosisAreaName",
          label: "所属区域",
          width: "70",
          children: []
        },
        { prop: "BedNo", label: "床号", width: "70", children: [] },
        {
          prop: "GreenChannel",
          label: "患者标识",
          width: "",
          children: [
            "GreenChannel",
            "IsGroupEvent",
            "IsAllergy",
            "IsArrearsApply",
            "AttentionTag"
          ]
        }
      ],
      clinicPatDefaultColumn: [
        { prop: "AttentionTag", label: "重点关注", width: "70", children: [] },
        { prop: "TriageLevel", label: "分级", width: "50", children: [] },
        {
          prop: "PatientName",
          label: "患者基本信息",
          minWidth: "120",
          children: ["IsNew", "PatientName", "PatGenderCode", "AgeYear"]
        },
        {
          prop: "GreenChannel",
          label: "患者标识",
          width: "",
          children: [
            "GreenChannel",
            "IsGroupEvent",
            "IsAllergy",
            "IsArrearsApply",
            "AttentionTag"
          ]
        }
      ],
      defaultColumns: [],
      timer: "", //定时器
      sortType: {},
      currentObjData: {},
      caSignOperation: {},
      height:300
    };
  },
  computed: {
    ...mapGetters({
      dialogData: "public/GET_DIALOGDATA",
      selectArea: "home/GET_SELECTAREA",
      user: "public/GET_USER",
      patList: "public/GET_PATIENTTABLELIST",
      signName: "public/GET_SIGNNAME", //签名系统简称
      isSignName: "public/GET_ISSIGNNAME", //是否启用
      isGetCA: "public/GET_ISGETCA", //
      searchSelectDep: "home/GET_SEARCHSELECTDEP"
    }),
    columns: function() {
      let cols = [];
      if (this.selectArea.DiagnosisAreaType == 3) {
        // 门急诊
        cols = this.columnsClinic;
      } else {
        cols = this.columnsBed;
      }
      return cols;
    },
    columnsAll: function() {
      let colsA = [];
      if (this.selectArea.DiagnosisAreaType == 3) {
        // 门急诊
        colsA = this.columnsClinicAll;
      } else {
        colsA = this.columnsBedAll;
      }
      return colsA;
    }
  },
  created() {
    console.log(this.$route, "当前路由");
    this.height=parseInt(document.body.clientHeight-380)
    this.debouceElg = debouce(this.getPatientList, 500, 1);
    if (this.isSignName == "1") {
      this.caSignOperation = new CASign(this, this.signName);
    }
  },
  mounted() {
    // 时输入框不失去焦点
    document.getElementById("home").onmousedown = function(e) {
      if (e.target.nodeName !== "INPUT") {
        //现代浏览器阻止默认事件
        if (e && e.preventDefault) e.preventDefault();
        //IE阻止默认事件
        else window.event.returnValue = false;
        return false;
      }
    };
    this.$store.commit("public/SET_PATIENTTABLELIST", []);
    this.getBedCardItemConfig();
    this.getTableColItemConfig();
  },
  methods: {
    //根据挂号时间排序患者列表
    sortChange(val) {
      this.sortType = val;
      this.getPatientList(this.pageIndex, val.order);
    },
    // 设置是否重点关注
    setAttentionTag(obj) {
      let params = {
        InHospitalId: obj.Id,
        isAttention: obj.AttentionTag == 0 ? 1 : 0
      };
      this.$Api.setAttentionTag(params).then(res => {
        this.$msg[res.Status ? "success" : "warning"](res.Message);
        // 刷新界面
        if (res.Status) {
          obj.AttentionTag = obj.AttentionTag == 0 ? 1 : 0;
        }
        this.$refs.head.getPatSummaryByDiagnosisArea();
      });
    },
    async closeDialog(value) {
      console.log("关闭住院或转院弹窗");
      if (value) {
        if (
          this.isSignName == "1" &&
          this.dialogData.component != "setCards" &&
          this.dialogData.component != "doctorSelectDep"
        ) {
          console.log("ca签名");
          let obj = {
            Type: "0",
            Data: [{ Name: "转归生成医嘱" }],
            No: this.user.UserInfo.No,
            UserName: this.user.UserInfo.Name
          };
          this.currentObjData = obj;
          this.caSignOperation.KeyVerify();
        } else {
          this.handleOperation();
        }
      } else {
        this.$store.commit("public/SET_DIALOGDATA", {
          ...this.dialogData,
          visible: false
        });
      }
    },
    async handleOperation() {
      // 确定关闭弹窗
      console.log("转归ccc");
      let res = await this.$refs.content.save();
      console.log(res);
      if (res) {
        this.$refs.head.getPatSummaryByDiagnosisArea(this.searchSelectDep);
        (this.selectArea.DiagnosisAreaType == 3 ||
          this.dialogData.component === "callbackPat") &&
          this.getPatientList();
        this.$store.commit("public/SET_DIALOGDATA", {
          ...this.dialogData,
          visible: false
        });
      }
    },
    async getPatientList(pgIndex = this.pageIndex, isAsc = null, queryType) {
      console.log(
        queryType,
        "queryTypequeryTypequeryTypequeryTypequeryTypequeryTypequeryType"
      );
      if (queryType) {
        if ( this.$refs.card.cardContent.Code) {
          queryType = this.$refs.card.cardContent.Code;
        } else {
        this.$refs.card.cardContent = { ...queryType };
        queryType = queryType.Code;
        }

      }
      this.showPatListLoading = true;
      this.pageIndex = pgIndex;
      let obj = {
        QueryType: queryType || this.$refs.card.cardContent.Code,
        DiagnosisAreaType: this.selectArea.DiagnosisAreaType,
        JustMe: this.$refs.head.justMe,
        PageIndex: pgIndex,
        PageSize: this.pageSize,
        UserId: this.user.UserInfo.Id
      };
      if (this.searchData != "") {
        obj["QueryKey"] = this.searchData;
      }
      let result = {};
      if (this.selectArea.DiagnosisAreaType == 3) {
        let depObj = [];
        let selectDep = this.$refs.head.selectDep;
        selectDep = selectDep.length ? selectDep : ["0"];
        if (selectDep.indexOf("0") != -1) {
          this.user.Departments.forEach(item => {
            depObj.push(item.Code);
          });
        } else {
          depObj = selectDep;
        }
        console.log(selectDep, "selectDep", depObj, selectDep.indexOf("0"));

        obj["Deps"] = depObj;
        if (isAsc === "descending") {
          obj["IsAsc"] = false;
          obj["OrderField"] = "RegisterTime";
        } else if (isAsc === "ascending") {
          obj["IsAsc"] = true;
          obj["OrderField"] = "RegisterTime";
        }
        result = await this.$Api.getClinicPatient(obj);
        this.showPatListLoading = false;
        let nowArr = this.$refs.head.selectDep;
        nowArr = nowArr.length ? nowArr : ["0"];
        if (
          selectDep.sort((a, b) => a - b).join() !==
            nowArr.sort((a, b) => a - b).join() &&
          !queryType
        )
          return;
        let patientList = result.Data || [];
        patientList.forEach(el => {
          if (el.Status === 0) {
            let birthday = el.BirthDay;
            if (birthday) {
              birthday = `${birthday.slice(0, 4)}/${birthday.slice(
                4,
                6
              )}/${birthday.slice(6, 8)}`;
              let ageObj = birthdayToAge(birthday);
              el.AgeYear = +ageObj.year;
              if (ageObj.month) {
                el.AgeMonth = ageObj.month + "";
              }
              if (ageObj.day) {
                if (ageObj.month) {
                  el.AgeMonth = el.AgeMonth + "*" + ageObj.day + "/" + 30;
                } else {
                  el.AgeMonth = ageObj.day + "/" + 30;
                }
              }
            }
          }
        });
        console.log(result, "result");
      } else {
        result = await this.$Api.getInHospitalPatient(obj);
      }
      let list = result.Data || [];
      this.showPatListLoading = false;
      if (result.Status) {
        this.totalPage = result.Count;
        // 列表
        if (this.showBedCard && this.selectArea.DiagnosisAreaType != 3) {
          if (pgIndex > Math.ceil(this.totalPage / this.pageSize)) {
            if (this.totalPage == 0) {
              this.$store.commit("public/SET_PATIENTTABLELIST", []);
            }
            return;
          }
          if (pgIndex == 1) {
            this.$store.commit("public/SET_PATIENTTABLELIST", list);
          } else {
            let data = JSON.parse(JSON.stringify(this.patList));
            this.$store.commit(
              "public/SET_PATIENTTABLELIST",
              data.concat(list)
            );
          }
          this.pageIndex += 1;
        } else {
          this.$store.commit("public/SET_PATIENTTABLELIST", list);
        }
      } else {
        this.$store.commit("public/SET_PATIENTTABLELIST", []);
        this.$msg.warning(result.Message);
      }
    },
    saveConfig() {
      if (this.selectArea.DiagnosisAreaType == 3) {
        this.setTableColItemConfig();
      } else {
        this.setBedCardItemConfig();
      }
    },
    // 获取床卡配置项
    getBedCardItemConfig() {
      this.$Api.getBedCardConfig().then(res => {
        !res.Status && this.$msg.warning(res.Message);
        if (res.Status) {
          //this.columns = [];
          this.columnsBed = [];
          //this.columnsAll = res.Data;
          this.columnsBedAll = res.Data || [];
          res.Data.forEach(item => {
            if (item.Ifcover) {
              //this.columns.push(item);
              this.columnsBed.push(item);
            }
          });
        }
      });
    },
    // 配置床卡
    setBedCardItemConfig() {
      this.columnSet = false;
      let params = [];
      this.columnsBedAll.forEach(item => {
        if (item.Ifcover) {
          params.push(item.Code);
        }
      });
      this.$Api.setBedCardConfig(params).then(res => {
        this.$msg[res.Status ? "success" : "warning"](res.Message);
        res.Status && this.getBedCardItemConfig();
      });
    },
    // 获取急门诊的表格配置项
    getTableColItemConfig() {
      let params = { tableCode: "ClinicPatient" };
      this.$Api.getTableColConfig(params).then(res => {
        !res.Status && this.$msg.warning(res.Message);
        if (res.Status) {
          this.columnsClinic = [];
          this.columnsClinicAll = res.Data;
          res.Data.forEach(item => {
            if (item.Ifcover) {
              this.columnsClinic.push(item);
            }
          });
        }
      });
    },
    // 设置急门诊的表格配置项
    setTableColItemConfig() {
      let params = { tableCode: "ClinicPatient" };
      this.columnSet = false;
      let ColumnCode = [];
      this.columnsClinicAll.forEach(item => {
        if (item.Ifcover) {
          ColumnCode.push(item.Code);
        }
      });
      params["ColumnCode"] = ColumnCode;
      this.$Api.setTableColConfig(params, ColumnCode).then(res => {
        !res.Status && this.$msg.warning(res.Message);
        res.Status && this.getTableColItemConfig();
      });
    },
    // 导出
    exportData() {
      let url = "";
      let depsArr = [];
      if (this.$refs.head.selectDep.indexOf("0") != -1) {
        this.user.Departments.forEach(item => {
          depsArr.push(item.Code);
        });
      } else {
        depsArr = this.$refs.head.selectDep;
      }
      let obj = {
        QueryType: this.$refs.card.cardContent.Code,
        DiagnosisAreaType: this.selectArea.DiagnosisAreaType,
        JustMe: this.$refs.head.justMe,
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
        Deps: depsArr,
        UserId: this.user.UserInfo.Id,
        HospitalAreaId: this.user.HospitalAreaId
      };
      if (this.searchData != "") {
        obj["QueryKey"] = this.searchData;
      }
      let dto = JSON.stringify(obj);
      // 固定列
      let defaultCol = {
        TriageLevel: "级别",
        PatientName: "姓名",
        PatGenderCode: "性别",
        AgeYear: "年龄",
        GreenChannel: "绿色通道",
        IsGroupEvent: "群伤",
        IsAllergy: "过敏",
        IsArrearsApply: "一键启动绿色通道",
        IsNew: "新入",
        AttentionTag: "重点关注"
      };
      let otherCol = { DiagnosisAreaName: "所属区域", BedNo: "床号" };
      let params = {};
      this.columnsAll.forEach(item => {
        if (item.Ifcover) {
          params[item.Code] = item.Name;
        }
      });
      if (this.selectArea.DiagnosisAreaType == 3) {
        // 门急诊
        let cols = JSON.stringify(Object.assign({}, defaultCol, params));
        url = `${URLCONFIG.Doctor}/api/v1/Patient/ClinicPatientExport?dto=${dto}&columns=${cols}`;
      } else {
        // 抢救留观
        let cols = JSON.stringify(
          Object.assign({}, defaultCol, otherCol, params)
        );
        url = `${URLCONFIG.Doctor}/api/v1/Patient/InHospitalPatientExport?dto=${dto}&columns=${cols}`;
      }
      console.log(url);
      let dom = document.createElement("a");
      dom.setAttribute("href", url);
      dom.setAttribute("download", "数据列表导出");
      dom.click();
      dom.remove();
    },
    handleCheckAllChange(value) {
      if (value) {
        this.columnsAll.forEach(item => {
          item.Ifcover = true;
        });
      } else {
        this.columnsAll.forEach(item => {
          item.Ifcover = false;
        });
      }
    },
    // 展示床卡
    showBedList() {
      this.showBedCard = true;
      this.pageIndex = 1;
      this.pageSize = 10;
      console.log(this.pageIndex + "点击床卡");
      this.getPatientList();
    },
    // 展示表格
    showTable() {
      this.showBedCard = false;
      this.pageIndex = 1;
      this.pageSize = 10;
      console.log(this.pageIndex + "点击表格");
      this.getPatientList();
    },
    //
    handleCurrentChange(value) {
      this.pageIndex = value;
      console.log(this.pageIndex + "点击第几页");
      this.getPatientList(this.pageIndex, this.sortType.order);
    },
    handleSizeChange(value) {
      this.pageSize = value;
      this.pageIndex = 1;
      console.log(this.pageIndex + "改变每页显示");
      this.getPatientList(this.pageIndex, this.sortType.order);
    },
    async startDoctor(row) {
      let now=new Date().getTime()
      if(now-this.startTime>3000){
        this.startTime=now
      }else{
        return
      }
      let paramsPat = {
        TriageId: row.TriageId,
        ActiveRegistId: row.ActiveRegistId
      };
      try {
        let rr = await this.$Api.getPersonMessageById(paramsPat);
        console.log(rr, rr);
        if (rr.Status && rr.Data && rr.Data.length) {
          row = rr.Data[0];
        }
      } catch (error) {
        console.log(error, "error");
      }
      let params = {
        triageId: row.TriageId,
        patientId: row.PatientId,
        registerId: row.ActiveRegistId,
        departmentCode: row.DepartmentCode,
        triageLevel: row.TriageLevel
      };
      if (row.Id !== "00000000-0000-0000-0000-000000000000")
        return this.$router.push({
          name: "medicalHistory",
          query: { id: row.Id, from: "home" }
        });
      this.$store.commit("public/SET_PATIENTMSG", row);

      this.$Api.patReceive(params).then(res => {
        console.log(row.PatientId, "PatientId：就诊");
        if (res.Status) {
          // 跳转
          this.$router.push({
            name: "medicalHistory",
            query: { id: res.Data, from: "home" }
          });
        } else {
          this.$msg.warning(res.Message);
        }
      });
    },
    goonDoctor(row) {
      this.$router.push({
        name: "medicalHistory",
        query: { id: row.Id, from: "home" }
      });
    },
    // stopDoctor(row) {
    //   let params = {
    //     id: row.Id
    //   };
    //   this.$Api.patEndReceive(params).then(res => {
    //     if (res.Status) {
    //       // 刷新界面
    //       //this.getPatientList();
    //       //使用状态管理异步操作
    //       this.$refs.head.getPatSummaryByDiagnosisArea();
    //       this.$msg.success(res.Message);
    //     } else {
    //       this.$msg.warning(res.Message);
    //     }
    //   });
    // },
    callbackPat(row) {
      let obj = {
        title: "患者召回",
        visible: true,
        width: "480px",
        component: "callbackPat",
        data: row
      };
      this.$store.commit("public/SET_DIALOGDATA", obj);
    },
    setDoctorAdvice(row) {
      this.$router.push({
        name: "openDoctorAdvice",
        query: { id: row.Id, from: "home" }
      });
    },
    turnTo(row) {
      let obj = {
        title: "转归",
        width: "650px",
        component: "turnTo",
        visible: true,
        data: row
      };
      this.$store.commit("public/SET_DIALOGDATA", obj);
    },
    // 节流搜索患者
    searchList() {
      this.debouceElg();
    },
    // 取消就诊
    cancel(row) {
      this.$confirm("该操作将取消接诊，是否继续？", "", {
        type: "warning"
      })
        .then(() => {
          this.$Api.cancelReceive({id:row.Id}).then(res=>{
            this.$msg[res.Status?'success':'warning'](res.Message)
            if(res.Status){
            let card=  this.$refs.card
            let conditionList=card.conditionList
            let index=0
            let item=conditionList.find((el,i)=>{
              // console.log(el.Name,el.Name==="ClinicNotReception");
              if(el.Code==="ClinicNotReception"){
                index=i
                return true
              }
            });
            console.log(item,index);
            if(item){
                card.refreshData(item,index)
            }else{
            this.getPatientList();
            }
            }
          })
        })
        .catch(() => {
          this.$msg.info("已取消操作");
        });
    }
  },
  watch: {
    "selectArea.DiagnosisAreaType": {
      immediate: true,
      handler: function(newValue) {
        this.pageIndex = 1;
        console.log("区域改变" + this.pageIndex);
        this.$nextTick(() => {
          let dom = document.querySelectorAll(".input-with-select input");
          dom && dom[1] && dom[1].focus();
          // this.$refs.inputWithSelect&&this.$refs.inputWithSelect.focus()
        });
        if (newValue == 3) {
          this.showBedCard = false;
          this.defaultColumns = this.clinicPatDefaultColumn;
        } else {
          this.sortType = {};
          this.showBedCard = true;
          this.defaultColumns = this.inHosPatDefaultColumn;
        }
      }
    },
    columnsAll: {
      immediate: true,
      deep: true,
      handler: function(newValue) {
        let ii = newValue.find(item => {
          if (!item.Ifcover) {
            return item;
          }
        });
        if (!ii) {
          this.checkAll = true;
        } else {
          this.checkAll = false;
        }
      }
    },
    patList: {
      immediate: true,
      deep: true,
      handler: function(newValue) {
        console.log(newValue, "实时患者数组");
      }
    },
    isGetCA: function(val) {
      if (val) {
        // 验证
        this.caSignOperation.checkData(this.user.UserInfo, this.currentObjData);
      }
    }
  }
  //   directives: {
  //   focus: {
  //     // 指令的定义
  //     inserted: function(el) {
  //       // console.log(el.querySelectorAll("input"),'focus');
  //       el.querySelectorAll("input")[1].focus();
  //     }
  //   }
  // },
};
</script>
<style scoped lang='less'>
.home {
  height: 100%;
  box-sizing: border-box;
  .homeDataContent {
    height: calc(~"(100% - 250px)");
    overflow: auto;
    .img-box {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      height: 100%;
      text-align: center;
      p {
        padding-top: 20px;
        font-size: 16px;
        color: #333333;
        // font-weight: bold;
      }
    }
  }
  .handleTable {
    padding: 20px 25px 5px 25px;
    height: 32px;
    .handleTableLeft {
      float: left;
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
    .handleTableRight {
      float: right;
      .bedImg {
        cursor: pointer;
        width: 20px;
        height: 20px;
        margin-right: 20px;
      }
      > img {
        cursor: pointer;
        width: 20px;

        height: 20px;
        margin-right: 20px;
      }
      > span {
        img {
          cursor: pointer;
          width: 20px;
          height: 20px;
        }
      }
    }
  }
  .pageStyle {
    text-align: right;
    margin-top: 10px;
    /deep/.el-pagination.is-background .el-pager li:not(.disabled).active {
      background-color: @blueMain;
    }
    span {
      display: inline-block;
      margin-top: 7px;
    }
    .pageNum {
      float: right;
    }
  }
  // .img-box {
  // }
}
</style>

