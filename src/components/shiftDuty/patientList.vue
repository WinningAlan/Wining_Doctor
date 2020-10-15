<template>
  <div class="patientList">
    <div class="head" @click="unfoldOrFold">
      <svg-icon iconClass="patients" class="icon"></svg-icon>患者列表
    </div>
    <div class="search">
      <el-select
        v-model="selectDoctor"
        filterable
        placeholder="选择医生"
        @change="changeSelect"
        multiple
        collapse-tags
      >
        <el-option
          v-for="(item,index) in doctorList"
          :key="index"
          :label="item.Text"
          :value="item.Value"
        ></el-option>
      </el-select>
      <el-input
        placeholder="姓名/ID/病历号"
        suffix-icon="el-icon-search"
        v-model="keyWord"
        @change="changeSelect"
        @keyup.enter.native="changeSelect"
      ></el-input>
    </div>
    <div class="tab">
      <my-tabs :activeName.sync="selectData" :tabsList="tabsList" :width="87"></my-tabs>
    </div>

    <div class="patContent">
      <pull-to @infinite-scroll="getPatientsList" class="msgScroll">
        <div v-for="(item,index) in patientsList" :key="index" class="patContentItem">
          <!--护士交班界面显示-->
          <div class="selectStyle" v-if="activeName=='1'">
            <!--责任医生不是自己，且没被别人添加-->
            <svg-icon iconClass="jiahao" class="operationImg operationJia"
             v-if="item.DoctorId!=user.UserInfo.Id&&item.IsAdd==false"
              @click="addPat(item)"
               v-show="batchAdd==false"></svg-icon>
            <!--责任医生不是自己，且已被自己添加,且还未被交班状态=1-->
            <svg-icon iconClass="jianhao" class="operationImg operationJian"
             v-if="item.IsAdd&&item.DoctorId!=user.UserInfo.Id&&item.HandoverDoctorId==user.UserInfo.Id&&item.Status!=3"
              @click="reducePat(item)"
               v-show="batchAdd==false"></svg-icon>
            <!--1责任医生是自己，2责任医生不为自己且已被别的非责任医生添加，3已经被交班状态=3-->
            <svg-icon iconClass="jiahaoGray" class="operationImg operationGray"
             v-if="item.DoctorId==user.UserInfo.Id||(item.DoctorId!=user.UserInfo.Id&&item.IsAdd
              &&item.HandoverDoctorId!=user.UserInfo.Id)||(item.Status==3)"
               v-show="batchAdd==false"></svg-icon>
            <div class="checkStyle" v-show="batchAdd">
              <el-checkbox v-model="item.isChecked" :disabled="item.IsAdd" @change="handoverCheck"></el-checkbox>
            </div>
          </div>
          <!--晨交班界面显示-->
          <div v-else class="selectStyle">
            <svg-icon :iconClass="`jiahao`" class="operationImg operationJia"
             v-show="batchAdd==false"
              v-if="onlyReaderIdList.includes(item.InHospitalId)==false"
              @click="addPat(item)"></svg-icon>
            <svg-icon :iconClass="`jianhao`" class="operationImg operationJian"
             v-else @click="reducePat(item)" v-show="batchAdd==false"></svg-icon>
            <div class="checkStyle" v-show="batchAdd">
              <el-checkbox
                v-model="item.isChecked"
                :disabled="onlyReaderIdList.includes(item.InHospitalId)"
                @change="morningCheck"
              ></el-checkbox>
            </div>
          </div>

          <patient-info-other :info="item" :isShiftDuty="true" :isGray="(item.DoctorId==user.UserInfo.Id||(item.DoctorId!=user.UserInfo.Id&&item.IsAdd
              &&item.HandoverDoctorId!=user.UserInfo.Id)||(item.Status==3))&&activeName=='1'"  :docMedicalCar="docMedicalCar" ></patient-info-other>
        </div>
      </pull-to>
    </div>
    <div class="bottom">
      <div class="batchAdd" @click="batchAdd=true" v-show="batchAdd==false">批量添加</div>
      <div class="oprationBatchAdd" v-show="batchAdd==true">
        <div class="left">
          <el-checkbox v-model="selectAll" @change="selectAllPats">全选</el-checkbox>
        </div>
        <div class="right">
          <span class="wordStyle" @click="batchAdd=false">取消批量</span>
          <el-button type="primary" @click="addPatList">添加</el-button>
        </div>
      </div>
    </div>
    <!--  -->
  </div>
</template>
<script>
import myTabs from "@/components/common/my-tabs.vue";
import patientInfoOther from "@/components/doctorAdvice/patientInfoOther";
import { mapGetters } from "vuex";
import PullTo from "vue-pull-to";
export default {
  components: {
    myTabs,
    patientInfoOther,
    PullTo
  },
  props: {
    activeName: String,
    editPatientList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    unfoldOrFold:Function,
  },
  data() {
    return {
      selectData: "",
      item: {},
      doctorList: [],
      keyWord: "", //查询关键字
      selectAll: false,
      batchAdd: false,
      selectDoctor: [], //筛选医生
      pageIndex: 1, //页码
      pageSize: 10, //页数
      patientsList: [], //患者列表
      noRefresh: false, //是否继续刷新
      selectPatList: [], //批量添加数组
      onlyReaderIdList: [] //晨班报告中只读的患者列表
    };
  },
  methods: {
    // 医生交班 复选框
    handoverCheck(value) {
      let count1 = 0
      let count2 = 0
      this.patientsList.forEach(item => {
        if(item.isChecked) {
          count1++
        }
        if(item.IsAdd) {
          count2++
        }
      })
      if(count1+count2==this.patientsList.length) {
        this.selectAll = true
      }else{
        this.selectAll = false
      }
    },
    // 陈搅拌复选框
    morningCheck(value) {
      
      let arr = this.patientsList.find(item => {
          return item.isChecked  == false
        })
        console.log(arr,'晨交班')
        if(arr) {
          this.selectAll = false
        }else{
          this.selectAll = true
        }
    },
    // 批量添加
    addPatList() {
      if (this.activeName == "3") {
        // 晨交班
        this.patientsList.forEach(item => {
          if (item.isChecked == true) {
            if(!this.onlyReaderIdList.includes(item.InHospitalId)) {
              this.editPatientList.push(item);
            }
          }
        });
        return;
      } else if (this.activeName == "1") {
        let arr = [];
        this.patientsList.forEach(item => {
          if (item.isChecked == true && item.IsAdd == false) {
            arr.push(item.InHospitalId);
          }
        });
        if(arr.length==0) {
          this.$msg.warning('请选择要患者')
          return
        }
        this.$Api.addToHandoverPatList(arr).then(res => {
          this.$msg[res.Status ? "success" : "warning"](res.Message);
          if (res.Status) {
            this.pageIndex = 1;
            this.noRefresh = false;
            this.getPatientsList();
            // 重新获取表格数据
            this.$parent.getHandoverPatList();
          }
        });
      }
    },
    // 全选患者
    selectAllPats(value) {
      if (value) {
        //this.selectPatList = []
        if (this.activeName == "3") {
          // 晨交班
          this.patientsList.forEach(item => {
            item.isChecked = true;
          });
        } else if (this.activeName == "1") {
          this.patientsList.forEach(item => {
            if (!item.IsAdd) {
              item.isChecked = true;
            } else {
              item.isChecked = false;
            }
          });
        }

        console.log(this.patientsList, "患者列表");
      } else {
        this.patientsList.forEach(item => {
          item.isChecked = false;
        });
      }
    },
    // 从患者列表里面添加新患者
    addPat(item) {
      if (this.activeName == "1") {
        // 交班
        console.log(item, "添加");
        let params = [item.InHospitalId];
        this.$Api.addToHandoverPatList(params).then(res => {
          this.$msg[res.Status ? "success" : "warning"](res.Message);
          if (res.Status) {
            // 重新获取表格数据
            this.noRefresh = false
            this.pageIndex = 1
            this.getPatientsList()
            this.$parent.getHandoverPatList();
          }
        });
      } else if (this.activeName == "3") {
        // 晨班
        this.editPatientList.push(item)
      }
    },
    // 从患者列表恢复患者
    reducePat(item) {
      if (this.activeName == "3") {
        // 晨交班
        let inde = 0
        this.editPatientList.forEach((ii,index) => {
          if(ii.InHospitalId==item.InHospitalId) {
            inde = index
          }
        })
        this.editPatientList.splice(inde,1)
        
      } else if (this.activeName == "1") {
        // 交班
        let params = {
          inHosPatId: item.InHospitalId
        };
        this.$Api.removeFromHancoverPatList(params).then(res => {
          this.$msg[res.Status ? "success" : "warning"](res.Message);
          if (res.Status) {
            this.noRefresh = false
            this.pageIndex = 1
            this.getPatientsList()
            // 重新获取表格数据
            this.$parent.getHandoverPatList();
          }
        });
      }
    },
    getDoctorList() {
      this.$Api.getShiftDutyDoctorList().then(res => {
        if (res.Status) {
          this.doctorList = res.Data;
        } else {
          this.doctorList = [];
        }
      });
    },
    getPatientsList() {
      if (this.noRefresh) {
        return;
      }
      let params = {
        "KeyWord": this.keyWord,
        "DiagnosisAreaType": this.selectData,
        "DoctorIds": this.selectDoctor,
        "PageIndex": this.pageIndex,
        "PageSize": this.pageSize,
      };
      this.$Api.getShiftDutyPatList(params).then(res => {
        if (res.Status) {
          if(res.Count==0) {
            this.patientsList = []
            return
          }
          let count = Math.ceil(res.Count / this.pageSize);
          if (count < this.pageIndex) {
            this.noRefresh = true;
            return;
          }
          if (this.pageIndex == 1) {
            this.patientsList = res.Data;
            this.patientsList.forEach(item => {
              this.$set(item, "isChecked", false);
            });
          } else {
            res.Data.forEach(item => {
              if(this.selectAll) {
                this.$set(item, "isChecked", true);
              }else{
                this.$set(item, "isChecked", false);
              }
              this.patientsList.push(item);
            });
          }
          this.pageIndex++;
        }else{
          this.$msg.warning(res.Message)
          this.patientsList = []
        }
      });
    },
    //
    changeSelect() {
      this.pageIndex = 1;
      this.noRefresh = false;
      this.getPatientsList();
    }
  },
  mounted() {
    this.getPatientsList();
    this.getDoctorList();
    console.log(this.docMedicalCar,"docMedicalCar")
  },
  watch: {
    selectData: function(newValue) {
      this.pageIndex = 1;
      this.noRefresh = false;
      this.selectAll = false
      this.getPatientsList();
    },
    activeName: function(newValue) {
      this.pageIndex = 1;
      this.noRefresh = false;
      this.batchAdd = false
      this.selectAll = false
      this.getPatientsList();
    },
    editPatientList: {
      immediate: true,
      handler: function(newValue) {
        this.onlyReaderIdList = [];
        newValue.forEach(item => {
          this.onlyReaderIdList.push(item.InHospitalId);
        });
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters({
      user: "public/GET_USER",
      morningSelectPatList: "shiftduty/GET_SELECTPATLIST",
      docMedicalCar: "configuration/GET_DOCMEDICALCAR"
    }),
    tabsList: function() {
      let arr = [{ value: 0, label: "全部" }];
      this.user.DiagnosisAreas.forEach(item => {
        if (item.DiagnosisAreaType == 3) {
          return;
        }
        let obj = { value: "", label: "" };
        obj.value = item.DiagnosisAreaType;
        obj.label = item.DiagnosisAreaName;
        arr.push(obj);
      });
      return arr;
    }
  }
};
</script>
<style lang="less" scoped>
.patientList {
  padding: 0 10px;
  height: 100%;
  .wordStyle {
    font-size: 13px;
    color: #0071e7;
    cursor: pointer;
  }
  .head {
    padding: 14px 0;
    height: 32px;
    line-height: 32px;
    .wordStyle;
    .icon {
      font-size: 20px;
      float: left;
      padding-top: 6px;
      padding-right: 10px;
    }
  }
  .search {
    /deep/.el-select > .el-input {
      width: 120px;
      margin-right: 10px;
    }
    /deep/.el-input--small {
      width: 135px;
    }
  }
  .patContent {
    height: calc(~"(100vh - 250px)");
    overflow: auto;
    box-sizing: border-box;
    padding-top: 20px;
    padding-bottom: 5px;
    .patContentItem {
      overflow: hidden;
      margin-bottom: 10px;
      .selectStyle {
        float: left;
        margin-top: 40px;
        .operationImg{
          width: 24px;
          height: 24px;
          cursor: pointer;
        }
        .operationJia{
          color:#0071e7;
        }
        .operationJian{
          color:#0071e7;
        }
        .operationGray{
          color:#e0e0e0;
          cursor: auto;
        }
        img {
          width: 24px;
          height: 24px;
          cursor: pointer;
        }
        
      }
      /deep/.patient-info-other {
        float: right;
      }
    }
  }
  .bottom {
    height: 50px;
    line-height: 50px;
    box-shadow: 0px -2px 2px #f2f2f2;
    padding: 0 10px;
    //border-top: 1px solid #409eff;
    .batchAdd {
      .wordStyle;
      float: right;
    }
    .oprationBatchAdd {
      .left {
        float: left;
      }
      .right {
        float: right;
        span {
          margin-right: 20px;
        }
      }
    }
  }
}
</style>