<template>
  <div class="inspectDoctorAdvice doctor-advice">
    <doctorAdviceTable
      :columns="columns"
      :tableData="tableData"
      :orderType="7"
      :callback="callback"
    >
      <template slot="adviceName" slot-scope="{scope}">
        <template v-if="!scope.row._edit">{{scope.row.DictItemName}}</template>
        <slot
          name="change"
          :index="scope.row._index"
          :itemName="scope.row.DictItemName"
          :departmentCode="departmentCode"
          :categoryNo="categoryNo"
          v-else
        />
      </template>
      <template slot="InsuranceUseFlag" slot-scope="{scope}">
        <el-checkbox
          v-model="scope.row.InsuranceUseFlag"
        ></el-checkbox>
      </template>
    </doctorAdviceTable>
    <slot name="search" :departmentCode="departmentCode" :categoryNo="categoryNo" />
    <h2>共性编辑</h2>
    <el-form
      :model="commonData"
      :rules="isVerification?rules:rulesNull"
      ref="inspectDoctorAdvice"
      label-position="right"
      label-width="80px"
      class="doctor-advice-form"
    >
      <el-form-item label="临床摘要" prop="Attention" class="all attention">
        <el-input
          type="textarea"
          v-model="commonData.Attention"
          placeholder="请输入内容"
          autosize
          resize="none"
          maxlength="500"
        ></el-input>
        <div class="textarea-num">
          <span :class="{red:wordLength>500}">{{wordLength}}</span>
          <span>/500</span>
        </div>
        <!-- <el-select
          v-model="commonData.Attention"
          placeholder="请输入临床摘要"
          filterable
          allow-create
          default-first-option
          popper-class="selectAttentionOperation"
        >
          <el-option
            v-for="item in abstractOptions"
            :key="item.Value"
            :label="item.Text"
            :value="item.Text"
          ></el-option>
        </el-select>-->
      </el-form-item>
      <el-form-item label="诊断" prop="Diagnosis" class="all">
        <!-- <searchDiagnose :checkedData.sync="commonData.Diagnosis" :isMultiple="true"></searchDiagnose> -->
        <el-select
          v-model="commonData.Diagnosis"
          placeholder="请选择"
          multiple
          filterable
          allow-create
          default-first-option
        >
          <el-option
            v-for="item in diagnoseList"
            :key="item.Id"
            :label="item.DiagnosisName"
            :value="item.DiagnosisName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="检查目的" prop="Target">
        <el-select v-model="commonData.Target" placeholder="请选择" automatic-dropdown>
          <el-option
            v-for="item in purposeOptions"
            :key="item.Value"
            :label="item.Text"
            :value="item.Text"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="媒介项目" prop="Medium">
        <el-select v-model="commonData.Medium" placeholder="请选择" automatic-dropdown>
          <el-option
            v-for="item in mediaProjectsOptions"
            :key="item.Value"
            :label="item.Text"
            :value="item.Text"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="造影剂" prop="ContrastAgent">
        <el-select v-model="commonData.ContrastAgent" placeholder="请选择" automatic-dropdown>
          <el-option
            v-for="item in contrastMediumOptions"
            :key="item.Value"
            :label="item.Text"
            :value="item.Text"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="检查科室" prop="ExcuteDepartment">
        <el-select
          v-model="commonData.ExcuteDepartment"
          placeholder="请选择"
          @change="selectRequestId"
          automatic-dropdown
        >
          <el-option
            v-for="item in deparmentOps"
            :key="item.Code"
            :label="item.Name"
            :value="item.Code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申请时间" prop="ApplyTime">
        <el-date-picker
          :clearable="false"
          :picker-options="pickerOptions"
          v-model="commonData.ApplyTime"
          @change="changeTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
          placeholder="选择日期时间"
          default-time="12:00:00"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="恶性肿瘤" prop="MalignantFlag" v-if="isMalignantFlag==1">
       <el-radio-group v-model="commonData.MalignantFlag ">
         <el-radio label="1" >是</el-radio>
         <el-radio label="0" >否</el-radio>
       </el-radio-group>
      </el-form-item>
      <el-form-item label="其他">
        <el-checkbox v-model="commonData.IsEmergency ">加急</el-checkbox>
        <el-checkbox v-model="commonData.IsBed ">床旁</el-checkbox>
      </el-form-item>
      <el-form-item label="备注" prop="Remark" class="all">
        <el-select
          v-model="commonData.Remark"
          placeholder="请选择"
          filterable
          allow-create
          default-first-option
        >
          <el-option
            v-for="item in remarkOptions"
            :key="item.Value"
            :label="item.Text"
            :value="item.Text"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <slot :submitForm="submitForm" />
  </div>
</template>

<script>
import { inspectDoctorAdviceColumns } from "../../../module/tableColumns";
// import { inspectDoctorAdviceData } from "../../../module/tableData";
import doctorAdviceTable from "./doctorAdviceTable.vue";
import { GetFormatDateTime, type, severalGroups } from "@/utils/public";
import { mapGetters } from "vuex";
import searchDiagnose from "../diagnose/searchDiagnose.vue";
export default {
  name: "inspectDoctorAdvice", //检查医嘱控件
  components: {
    doctorAdviceTable,
    searchDiagnose,
  },
  props: {
    tableData: {
      type: Array,
      required: true,
    },
    commonObj: {
      type: Object,
      required: true,
    },
    // 是否修改
    isChange: {
      type: Boolean,
      default: false,
    },
    // 是否校验
    isVerification: {
      type: Boolean,
      default: true,
    },
    //删除的回调函数
    callback: {
      type: Function,
      default: () => {},
    },
    //共性编辑的数据
    generalEditor: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // requestId:{
    //   type:String,
    //   default:''
    // }
  },
  data() {
    return {
      // 控制时间
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() <
            +new Date(GetFormatDateTime("yyyy/MM/dd", new Date()) + " 00:00:00")
          );
          // return time.getTime() <= Date.now();
        },
      },
      columns: inspectDoctorAdviceColumns,
      // tableData: inspectDoctorAdviceData,
      rules: {
        Attention: [
          { required: true, message: "请输入临床摘要", trigger: "change" },
        ],
        Diagnosis: [
          { required: true, message: "请选择诊断", trigger: "change" },
        ],
        Target: [
          { required: true, message: "请选择检查目的", trigger: "change" },
        ],
        ExcuteDepartment: [
          { required: true, message: "请选择检查科室", trigger: "change" },
        ],
      },
      rulesNull: {},
      commonData: {
        DiagnosisAreaType: "", //诊疗区大区
        OrderType: 7, //医嘱类别
        IsAdditional: false, //是否补录医嘱
        EffectiveTime: 1, //长/临
        Attention: "", //临床摘要
        Diagnosis: [], //诊断
        DiagnosisCode: [], //诊断code
        Target: "明确诊断", //检查目的
        Medium: "", //媒介项目
        ContrastAgent: "", //造影剂
        ExcuteDepartment: "", //检查科室
        IsEmergency: false, //加急
        IsBed: false, //床旁
        Remark: "", //备注
        ApplyTime: "", //申请时间
        depStr: "",
        MalignantFlag:0,
      }, //公共数据s
      diagnoseList: [], //诊断数据
      departmentParentList: [],
    };
  },
  created() {
    this.commonData.Diagnosis = [];
    this.getOldSubmit();
    this.commonData.DiagnosisAreaType = this.selectArea.DiagnosisAreaType;
    this.nowTime = this.commonData.ApplyTime = this.commonData.ApplyTime
      ? this.commonData.ApplyTime
      : GetFormatDateTime();
    this.isVerification && this.getAttention();
    this.pickerOptions.disabledDate = (time) => {
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
    // if (
    //   this.isVerification &&
    //   (!this.commonData.Diagnosis ||
    //     (this.commonData.Diagnosis && this.commonData.Diagnosis.length == 0)) &&
    //   this.patientMsg.Diagnosis &&
    //   this.patientMsg.Diagnosis.length != 0
    // ) {
    //   this.commonData.Diagnosis = this.patientMsg.Diagnosis.slice(
    //     0,
    //     this.patientMsg.Diagnosis.length - 1
    //   ).split(";");
    //   this.commonData.DiagnosisCode = this.patientMsg.DiagnosisCode.slice(
    //     0,
    //     this.patientMsg.DiagnosisCode.length - 1
    //   ).split(";");
    // }
  },
  computed: {
    ...mapGetters({
      departmentOptions: "public/GET_ALLDEP", //执行科室
      patientMsg: "public/GET_PATIENTMSG",
      selectArea: "home/GET_SELECTAREA", //所在区域
      isMalignantFlag:"configuration/GET_ISMALIGNANTFLAG"
    }),
    //媒介项目的选项
    mediaProjectsOptions: function (value) {
      return this.$store.getters["public/getDic"]("Vector").filter(
        (el) => el.Value !== -1
      );
    },
    //造影剂的选项
    contrastMediumOptions: function (value) {
      return this.$store.getters["public/getDic"]("ContrastAgent").filter(
        (el) => el.Value !== -1
      );
    },
    // 临床摘要文字长度
    wordLength() {
      return this.commonData.Attention.length;
    },
    // //临床摘要的选项
    // abstractOptions: function(value) {
    //   return this.$store.getters["public/getDic"]("ClinicalSummary").filter(
    //     el => el.Value !== -1
    //   );
    // },
    //检查目的选项
    purposeOptions: function (value) {
      return this.$store.getters["public/getDic"]("PurposeOfTest").filter(
        (el) => el.Value !== -1
      );
    },
    //备注选项
    remarkOptions: function (value) {
      return this.$store.getters["public/getDic"]("CheckRemark").filter(
        (el) => el.Value !== -1
      );
    },
    departmentCode() {
      let arr = this.tableData.filter((item) => !item.IsDeleted);
      return arr.length ? this.commonData.ExcuteDepartment : "";
    },
    categoryNo() {
      return this.tableData[0] ? this.tableData[0].ParentCategoryCode : "";
    },
    deparmentOps() {
      let arrDep = severalGroups(this.tableData, "NewDepartmentList");
      if (this.$route.query.id && this.patientMsg.RegistId) {
        this.patientMsg.RegisterInfoList.forEach((el) => {
          if (this.patientMsg.RegistId === el.HisRegistId) {
            !arrDep.includes(el.RegDepartmentCode) &&
              arrDep.push(el.RegDepartmentCode);
          }
        });
      }
      if (arrDep.length) {
        this.commonData.ExcuteDepartment = this.commonData.ExcuteDepartment
          ? this.commonData.ExcuteDepartment
          : arrDep[0];
      }
      let departmentList = [];
      this.$emit("changrequestId", this.commonData.ExcuteDepartment);
      arrDep.forEach((item) => {
        this.departmentOptions.forEach((el) => {
          if (el.Code == item) {
            departmentList.push(el);
          }
        });
      });
      return departmentList;
    },
  },
  watch: {
    commonObj: {
      handler: function (val, oldVal) {
        for (const key in val) {
          this.commonData[key] = val[key];
        }
      },
      immediate: true,
      deep: true,
    },
    patientMsg: {
      handler(val) {
        if (this.isVerification && !this.isChange && val.Diagnosis) {
          this.commonData.Diagnosis = val.Diagnosis.slice(
            0,
            val.Diagnosis.length - 1
          ).split(";");
          this.commonData.DiagnosisCode = val.DiagnosisCode.slice(
            0,
            val.DiagnosisCode.length - 1
          ).split(";");
          this.getOldSubmit();
        }
      },
      immediate: true,
      deep: true,
    },
    // generalEditor: {
    //   handler(val) {
    //     console.log(val, "val");
    //   }
    // }
  },
  methods: {
    // 获取临床摘要信息
    getAttention() {
      this.$Api
        .getAttention({
          itemName: "临床摘要",
          inHospPatId: this.$route.query.id,
        })
        .then((res) => {
          let data = res.Data || [];
          let mainSuit = "";
          let phi = "";
          let healthCheckup = "";
          data.forEach((el) => {
            if (el.title === "主诉:" || el.title === "主诉：") {
              mainSuit += `${el.name}、`;
            } else if (el.title === "现病史:" || el.title === "现病史：") {
              phi += `${el.name}、`;
            } else if (el.title === "体格检查:" || el.title === "体格检查：") {
              let arr = el.sjyname.split("（");
              arr[0] += `：${el.name}`;
              healthCheckup += arr.join("（") + "、";
            }
          });
          mainSuit = mainSuit.substring(0, mainSuit.length - 1);
          phi = phi.substring(0, phi.length - 1);
          healthCheckup = healthCheckup.substring(0, healthCheckup.length - 1);
          let str = `${mainSuit}${mainSuit && "\n"}${phi}${
            phi && "\n"
          }${healthCheckup}${healthCheckup && "\n"}`;
          str = str.substring(0, str.length - 1);
          this.commonData.Attention = this.commonData.Attention || str;
        });
    },
    changeTime(el) {
      if (+new Date(el) < +new Date(this.patientMsg.InHospTime)) {
        this.$msg.info("医嘱开始时间不允许早于患者入科时间！");
        this.commonData.ApplyTime = GetFormatDateTime(
          "yyyy/MM/dd HH:mm",
          new Date(this.patientMsg.InHospTime)
        );
      }
      //  是否是补录医嘱
      this.commonData.IsAdditional =
        parseInt(+new Date(el) / 60000) <
        parseInt(+new Date(this.nowTime) / 60000);
    },
    // 医嘱提交前验证
    submitForm() {
      return new Promise((resolve, reject) => {
        this.$refs.inspectDoctorAdvice.validate((valid, obj) => {
          console.log(obj);
          if (valid) {
            if (!this.tableData.filter((el) => !el.IsDeleted).length) {
              this.$msg.info("当前没有医嘱项目，请添加后再保存！");
              return resolve(false);
            }
            if (this.wordLength > 500) {
              setTimeout(() => {
                this.$msg.info("临床摘要内容超出长度限制，请修改！");
              }, 0);
              return resolve(false);
            }
            let doctorOrderMain = { ...this.commonData };
            let objName = [];
            doctorOrderMain.Diagnosis.forEach((item) => {
              this.diagnoseList.forEach((el, index) => {
                if (item === el.DiagnosisName) {
                  objName[index] = el;
                }
              });
            });
            doctorOrderMain.Diagnosis = "";
            doctorOrderMain.DiagnosisCode = "";
            objName.forEach((val) => {
              if (val) {
                doctorOrderMain.Diagnosis += val.DiagnosisName + ";";
                doctorOrderMain.DiagnosisCode += val.DiagnosisCode + ";";
              }
            });
            doctorOrderMain.InHouseId = this.$route.query.id;
            resolve({
              Details: doctorOrderMain,
              Items: this.tableData,
            });
          } else {
            resolve(false);
            console.log("error submit!!");
          }
        });
      });
    },
    selectRequestId(val) {
      this.requestId = val;
      this.$emit("changrequestId", val);
    },
    // 获取诊断数据
    getOldSubmit() {
      this.$route.query.id &&
        this.$Api
          .getHistoryDiagnoseList({ inHouseId: this.$route.query.id })
          .then((res) => {
            this.diagnoseList = res.Data || [];
            if (
              this.isVerification &&
              (!this.commonData.Diagnosis ||
                (this.commonData.Diagnosis &&
                  this.commonData.Diagnosis.length === 0)) &&
              this.diagnoseList.length
            ) {
              this.commonData.Diagnosis = this.diagnoseList.map(
                (el) => el.DiagnosisName
              );
              this.commonData.DiagnosisCode = this.diagnoseList.map(
                (el) => el.DiagnosisCode
              );
            }
          });
    },
  },
};
</script>
<style  lang='less'>
@import url("./adviceStyle.less");
</style>
