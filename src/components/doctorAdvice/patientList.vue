<template>
  <div class="patient-list">
    <div class="top">
      <el-input
        :placeholder="selectArea.DiagnosisAreaType===3?'姓名/ID号/卡号/病历号':'姓名/ID号/床位号/卡号/病历号'"
        v-model="searchData"
        @input="searchList()"
        @keyup.enter.native="searchClick()"
      >
        <i slot="suffix" class="el-input__icon search" @click="searchClick()"></i>
      </el-input>
    </div>

    <el-radio-group
      v-model="acitive"
      class="patient-list-nav"
      @change="searchClick"
      :class="{two:navData.length==2}"
    >
      <el-radio-button v-for="item in navData" :label="item.value" :key="item.value">{{item.text}}</el-radio-button>
    </el-radio-group>
    <div class="listContent">
      <pull-to @infinite-scroll="getPatientsList" class="msgScroll">
        <p
          v-for="(item,index) in patientInfo"
          :key="item.InHouseId"
          ref="checkBox"
          class="patientInfo"
          :class="{active:patientId==item.InHouseId}"
          :id="item.InHouseId"
          @click="check(item,index)"
        >
          <patient-info-other :info="item" :docMedicalCar="docMedicalCar"></patient-info-other>
        </p>
      </pull-to>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import patientInfoOther from "./patientInfoOther";
import { birthdayToAge, debouce } from "@/utils/public";
import PullTo from "vue-pull-to";
import { setSession } from "@/utils/storage";

export default {
  components: {
    patientInfoOther,
    PullTo
  },
  computed: {
    ...mapGetters({
      selectArea: "home/GET_SELECTAREA", //所在区域
      updatePatientList: "public/GET_UPDATEPATIENTLIST", //更新患者列
      user: "public/GET_USER",
      docMedicalCar: "configuration/GET_DOCMEDICALCAR"
    }),
    // 科室权限
    departmentCode() {
      let user = this.$store.getters["public/GET_USER"];
      let arr = [];
      user &&
        user.Departments.forEach(todo => {
          arr.push(todo.Code.replace(/ /g, ""));
        });
      return arr;
    },
    patientId() {
      return this.$route.query.id;
    }
  },
  watch: {
    updatePatientList(val) {
      this.pageIndex = 1;
      this.getPatientsList();
    }
  },
  data() {
    return {
      searchData: "",
      acitive: 1,
      isShow: true,
      pageIndex: 1,
      navData: [],
      patientInfo: [],
      bottomConfig: {
        pullText: "上拉加载",
        triggerText: "释放更新",
        loadingText: "加载中...",
        doneText: "加载完成",
        failText: "加载失败",
        loadedStayTime: 400,
        stayDistance: 50,
        triggerDistance: 70
      }
    };
  },
  created() {
    this.debouceElg = debouce(this.searchClick, 500);

    if (this.selectArea.DiagnosisAreaType == 3) {
      this.navData = [
        {
          text: "待接诊",
          value: "ClinicNotReception"
        },
        {
          text: "就诊中",
          value: "ClinicInReception"
        },
        {
          text: "就诊结束",
          value: "ClinicEndReception"
        }
      ];
      this.acitive = "ClinicInReception";
    } else {
      this.navData = [
        {
          text: "全部",
          value: -1
        },
        {
          text: "重点关注",
          value: 1
        }
      ];
      this.acitive = -1;
    }
    this.getPatientsList();
  },
  methods: {
    // 获取患者列表
    getPatientsList() {
      if (this.pageIndex < 1) return;
      let data, apiName;

      if (this.selectArea.DiagnosisAreaType === 3) {
        apiName = "getClinicPatient";
        data = {
          QueryType: this.acitive,
          DiagnosisAreaType: this.selectArea.DiagnosisAreaType,
          JustMe: false,
          PageIndex: this.pageIndex,
          PageSize: 10,
          Deps: this.departmentCode,
          UserId: this.user.UserInfo.Id
        };
        if (this.searchData) {
          data.QueryKey = this.searchData;
        }
      } else {
        apiName = "getPatientsList";

        data = {
          diagnosisAreaType: this.selectArea.DiagnosisAreaType, //诊疗区类型
          // receptionStatus:this.acitive,//接诊状态
          // attentionTag:this.acitive,//是否重点关注
          attentionTag: this.acitive,
          pageSize: 10,
          pageIndex: this.pageIndex,
          isAsc: true
        };
        if (this.searchData) {
          data.keyWord = this.searchData;
        }
      }

      this.$Api[apiName](data).then(res => {
        if (res.Status) {
          let data = res.Data || [];
          data.forEach(el => {
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
          this.selectArea.DiagnosisAreaType === 3 &&
            data.forEach(el => {
              el.InHouseId =
                this.acitive === "ClinicNotReception"
                  ? el.PatientId + el.TriageId + el.HisRegisterId
                  : el.Id;
              el.AreaType = 3;
            });
          let totalPage = Math.ceil(res.Count / 10);
          if (this.pageIndex === 1) {
            this.patientInfo = data;
          } else if (this.pageIndex <= totalPage) {
            this.patientInfo = this.patientInfo.concat(data);
          }
          res.Count <= this.pageIndex * 10
            ? (this.pageIndex = -1)
            : this.pageIndex++;
        } else {
          this.patientInfo = [];
        }
      });
    },

    //搜索,切换
    searchClick() {
      this.pageIndex = 1;
      this.getPatientsList();
    },

    // 点击事件
    async check(item, index, time) {
      if (
        this.acitive === "ClinicNotReception" &&
        this.selectArea.DiagnosisAreaType === 3
      ) {
        let paramsPat = {
          TriageId: item.TriageId,
          ActiveRegistId: item.ActiveRegistId
        };
        try {
        let rr = await this.$Api.getPersonMessageById(paramsPat)
         if (rr.Status&&rr.Data&&rr.Data.length) {
          row = rr.Data[0]
        }
        } catch (error) {
          console.log(error,'error');
        }
        console.log("接诊");
        let res = await this.patReceive(
          item.TriageId,
          item.PatientId,
          item.ActiveRegistId,
          item.DepartmentCode,
          item.TriageLevel
        );

        if (res.Status) {
          item.InHouseId = res.Data;
          this.patientInfo.splice(index, 1);
        } else {
          this.$msg.warning(res.Message);
          return;
        }
      }
      let route = this.$route;
      item.AreaType = item.AreaType || this.selectArea.DiagnosisAreaType;
      setSession("currentPat", { currentPat: item });
      if (route.query.id === item.InHouseId) return;
      this.$store.commit("public/SET_PATIENTMSG", item);

      this.$router.push({
        name: route.name,
        query: { ...route.query, id: item.InHouseId }
      });
    },
    // 急门诊患者接诊
    async patReceive(
      triageId,
      patientId,
      registerId,
      departmentCode,
      triageLevel
    ) {
      console.log(arguments);
      return this.$Api.patReceive({
        triageId,
        patientId,
        registerId,
        departmentCode,
        triageLevel
      });
    },
    searchList() {
      this.debouceElg();
    }
  }
};
</script>

<style lang="less" scoped>
.patient-list {
  padding: 10px 0px 0 10px;
  box-sizing: border-box;
  // margin-top: 10px;
  border-top: 10px solid @mainBg;
  // position: relative;
  // &::before{
  //   content: '';
  //   position: absolute;
  //   height: 0;
  //   width: 0;
  //         border-width: 7px;
  //     border-style: solid;
  //     border-color:  transparent  transparent #0071e7 transparent;
  //     top: -10px;
  //     z-index: 10;
  // }
  // border-right: 10px solid @mainBg;
  height: 100%;
  overflow-y: hidden;
  box-sizing: border-box;
  width: 250px;
  transition: all 0.3s cubic-bezier(0.65, 0.05, 0.36, 1);
  &.hide {
    width: 0;
    padding: 0;
    border-right: none;
  }
  .patient-list-nav {
    margin-bottom: 20px;

    /deep/ .el-radio-button__inner {
      width: 230/3px;
      display: inline-block;
      line-height: 30px;
      text-align: center;
      padding: 0;
    }
    &.two {
      /deep/ .el-radio-button__inner {
        width: 230/2px;
      }
    }
  }
  .listContent {
    height: calc(~"(100% - 114px)");
    overflow: hidden;

    /deep/ .vue-pull-to-wrapper > .scroll-container[data-v-81faaf1a] {
      // width: 100%;

      padding-bottom: 30px;
      padding-right: 10px;
    }
  }
  .top {
    width: 100%;
    padding-right: 10px;
    box-sizing: border-box;
  }
  /deep/ .el-input {
    width: 100%;
    margin-bottom: 17px;
    .el-input__inner {
      background: #f2f2f2;
    }
  }
  .search {
    background-image: url("../../assets/imges/search.svg");
    background-repeat: no-repeat;
    display: inline-block;
    margin-top: 5px;
    cursor: pointer;
  }
  .patientInfo {
    margin-bottom: 9px;
    width: 230px;
    &:hover {
      background: rgba(0, 113, 231, 0.1);
      //  /deep/ .patient-info-other{
      //     border-color: #E0E0E0;
      //   }
    }
    &.active {
      background: rgba(0, 113, 231, 0.2);
      // /deep/  .patient-info-other{
      //   border-color: #0071E7 ;
      // }
    }
  }
}
</style>

