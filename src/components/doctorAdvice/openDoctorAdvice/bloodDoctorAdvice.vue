<template>
  <div class="bloodDoctorAdvice doctor-advice">
    <el-form
      :model="commonData"
      :rules="isVerification?rules:rulesNull"
      ref="inspectDoctorAdvice"
      label-position="right"
      label-width="80px"
      class="doctor-advice-form"
    >
      <el-form-item label="血型" class="blood-type">
        <el-select v-model="commonData.BloodType" placeholder="请选择" automatic-dropdown>
          <el-option
            v-for="item in bloodTypeOptions"
            :key="item.Code"
            :label="item.Name"
            :value="item.Code"
          ></el-option>
        </el-select>
        <el-form-item label="RH" prop="RH" class="effective">
          <el-radio-group v-model="commonData.RH" text-color="#0071E7" fill="rgba(0,113,231,0.10)">
            <el-radio-button label="阴性">阴</el-radio-button>
          </el-radio-group>
          <el-radio-group v-model="commonData.RH" text-color="#0071E7" fill="rgba(0,113,231,0.10)">
            <el-radio-button label="阳性">阳</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form-item>
      <el-form-item label="不规则抗体筛查" prop="IrregularAntibodyScreening" class="effective screening">
        <el-radio-group
          v-model="commonData.IrregularAntibodyScreening"
          text-color="#0071E7"
          fill="rgba(0,113,231,0.10)"
        >
          <el-radio-button :label="true">是</el-radio-button>
        </el-radio-group>
        <el-radio-group
          v-model="commonData.IrregularAntibodyScreening"
          text-color="#0071E7"
          fill="rgba(0,113,231,0.10)"
        >
          <el-radio-button :label="false">否</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="血源" prop="BloodSource" class="effective blood-type">
        <el-select v-model="commonData.BloodSource" placeholder="请选择" automatic-dropdown>
          <el-option
            v-for="item in bloodsourceOptions"
            :key="item.Value"
            :label="item.Text"
            :value="item.Value+''"
          ></el-option>
        </el-select>
        <el-form-item label="目的" prop="Target" class="effective">
          <el-radio-group
            v-model="commonData.Target"
            text-color="#0071E7"
            fill="rgba(0,113,231,0.10)"
          >
            <el-radio-button label="手术">手术</el-radio-button>
          </el-radio-group>
          <el-radio-group
            v-model="commonData.Target"
            text-color="#0071E7"
            fill="rgba(0,113,231,0.10)"
          >
            <el-radio-button label="治疗">治疗</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form-item>

      <el-form-item label="其他" prop="donateBlood" class="rests">
        <el-checkbox-group v-model="commonData.BloodTransfusion">
          <el-checkbox-button :label="true">输血史</el-checkbox-button>
        </el-checkbox-group>
        <el-checkbox-group v-model="commonData.BloodDonationHistory">
          <el-checkbox-button :label="true">献血史</el-checkbox-button>
        </el-checkbox-group>
        <el-checkbox-group v-model="commonData.Pregnancy">
          <el-checkbox-button :label="true">孕</el-checkbox-button>
        </el-checkbox-group>
        <el-checkbox-group v-model="commonData.Fecunditv">
          <el-checkbox-button :label="true">产</el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        :label="item.text"
        :prop="item.key"
        v-for="(item, index) in bloodData"
        :key="index"
        class="unit"
      >
        <!-- <el-input-number
          v-if="item.type==='number'"
          v-model="commonData[item.key]"
          :controls="false"
        ></el-input-number>-->

        <el-input v-model="commonData[item.key]" placeholder="请输入内容"></el-input>
        <!-- <span class="item" v-if="item.unit">{{item.unit}}</span> -->
      </el-form-item>

      <el-form-item label="用血时间" prop="UseTime">
        <el-date-picker
          :clearable="false"
          :picker-options="pickerOptions"
          v-model="commonData.UseTime"
          @change="changeTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
          placeholder="选择日期时间"
          default-time="12:00:00"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="执行科室" prop="ExcuteDepartment" class="effective">
        <el-select v-model="commonData.ExcuteDepartment" placeholder="请选择" automatic-dropdown >
          <el-option
            v-for="item in allDep"
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
          @change="changeTime"
          v-model="commonData.ApplyTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
          placeholder="选择日期时间"
          default-time="12:00:00"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <doctorAdviceTable
      :columns="columns"
      :tableData="tableData"
      type="index"
      :columnsIndex="1"
      :orderType="4"
    >
      <template slot="Alias" slot-scope="{scope}">
        <template v-if="!scope.row._edit">{{scope.row.ItemName}}</template>
        <slot
          name="change"
          :index="scope.row._index"
          :itemName="scope.row.ItemName"
          :departmentCode="departmentCode"
          v-else
        />
      </template>
      <template slot="remarks" slot-scope="{scope}">
        <el-input-number
          v-model="scope.row.Count"
          placeholder="数量"
          :min="1"
          controls-position="right"
        ></el-input-number>
        {{scope.row.Unit}}
      </template>
      <template slot="BloodWay" slot-scope="{scope}">
        <el-select v-model="scope.row.BloodWay" placeholder="请选择" automatic-dropdown>
          <el-option
            v-for="(item,index) in BloodWay"
            :key="index"
            :label="item.Text"
            :value="item.Value+''"
          ></el-option>
        </el-select>
      </template>
    </doctorAdviceTable>
    <slot name="search" :departmentCode="departmentCode" />

    <slot :submitForm="submitForm"/>
  </div>
</template>

<script>
import { bloodDoctorAdviceColumns } from "../../../module/tableColumns";
import { bloodDoctorAdviceData } from "../../../module/tableData";
import { bloodData } from "../../../module/staticData";
import doctorAdviceTable from "./doctorAdviceTable.vue";
import { GetFormatDateTime } from "@/utils/public";
import { mapGetters } from "vuex";

export default {
  name: "bloodDoctorAdvice", //用血医嘱控件
  components: {
    doctorAdviceTable
  },
  props: {
    tableData: {
      type: Array,
      required: true
    },
    commonObj: {
      type: Object,
      required: true
    },
    // 是否修改
    isChange: {
      type: Boolean,
      default: false
    },
    // 是否校验
    isVerification:{
      type:Boolean,
      default:true
    }
  },
  data() {
    return {
      blway: "",
      // 控制时间
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() <
            +new Date(GetFormatDateTime("yyyy/MM/dd", new Date()) + " 00:00:00")
          );
          // return time.getTime() <= Date.now();
        }
      },
      rules: {
        BloodType: [{ required: true, message: "请输入血型", trigger: "blur" }],
        BloodSource: [
          { required: true, message: "请输入血源", trigger: "change" }
        ],
        Target: [
          { required: true, message: "请输入输血目的", trigger: "change" }
        ],
        // Alt: [
        //   { required: true, message: "请输入检验结果", trigger: "blur" }
        // ],
        // HbsAg: [
        //   { required: true, message: "请输入检验结果", trigger: "blur" }
        // ],
        // HbsAb: [
        //   { required: true, message: "请输入检验结果", trigger: "blur" }
        // ],
        // HbeAg: [
        //   { required: true, message: "请输入检验结果", trigger: "blur" }
        // ],
        // HbeAb: [
        //   { required: true, message: "请输入检验结果", trigger: "blur" }
        // ],
        // HBcAb: [
        //   { required: true, message: "请输入检验结果", trigger: "blur" }
        // ],
        // AntiHcv: [
        //   { required: true, message: "请输入检验结果", trigger: "blur" }
        // ],
        // AntiHiv: [
        //   { required: true, message: "请输入检验结果", trigger: "blur" }
        // ],
        // Syphilis: [{ required: true, message: "请输入检验结果", trigger: "blur" }],
        // Leukocyte: [
        //   { required: true, message: "请输入检验结果", trigger: "blur" }
        // ],
        // Hemoglobin: [
        //   { required: true, message: "请输入检验结果", trigger: "blur" }
        // ],
        // Platelet: [
        //   { required: true, message: "请输入检验结果", trigger: "blur" }
        // ],
        UseTime: [
          { required: true, message: "请输入用血时间", trigger: "blur" }
        ],
        ApplyTime: [
          { required: true, message: "请输入申请时间", trigger: "blur" }
        ],
        ExcuteDepartment: [
          { required: true, message: "请输入执行科室", trigger: "change" }
        ],
        RH: [{ required: true, message: "请选择用法", trigger: "change" }]
      },
      rulesNull:{},
      columns: bloodDoctorAdviceColumns,
      // tableData: bloodDoctorAdviceData,
      bloodData: bloodData, //血常规静态数据
      commonData: {
        OrderType: 4, //医嘱类别
        Id: "00000000-0000-0000-0000-000000000000",
        InHouseId: "00000000-0000-0000-0000-000000000000",
        DiagnosisAreaType: 0,
        Target: "",
        BloodType: "",
        BloodSource: "",
        RH: "",
        Pregnancy: false,
        BloodTransfusion: false,
        BloodDonationHistory: false,
        Fecunditv: false,
        IrregularAntibodyScreening: false,
        Diagnosis: "",
        Alt: "",
        HbsAg: "",
        HbsAb: "",
        HbeAg: "",
        HbeAb: "",
        HBcAb: "",
        AntiHcv: "",
        AntiHiv: "",
        Syphilis: "",
        Leukocyte: "",
        Hemoglobin: "",
        Platelet: "",
        ApplyDepartment: 0,
        ApplyTime: "",
        UseTime: "",
        ExcuteDepartment: "",
        IsUrgent: true,
        HisNumber: ""
      } //公共数据 //数量单位选项
    };
  },
  created() {
    // this.getDictData();
    console.log(this.dict,'3333');
    this.commonData.DiagnosisAreaType = this.selectArea.DiagnosisAreaType;
    this.nowTime = this.commonData.ApplyTime =this.commonData.ApplyTime?this.commonData.ApplyTime: GetFormatDateTime();
    this.commonData.UseTime =this.commonData.UseTime?this.commonData.UseTime: GetFormatDateTime();

    // this.nowTime = this.commonData.UseTime = this.commonData.ApplyTime = GetFormatDateTime();
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
  computed: {
    ...mapGetters({
      patientMsg: "public/GET_PATIENTMSG",
      selectArea: "home/GET_SELECTAREA", //所在区域
      bloodTypeOptions: "public/GET_BLOODTYPES",
      allDep: "public/GET_ALLDEPARTMENTS",//执行科室
      // dict: "public/GET_DICTIONARIES" //字典数据
    }),
    departmentCode() {
      let arr = this.tableData.filter(item => !item.IsDeleted);
      return arr.length ? this.commonData.ExcuteDepartment : "";
    },
    bloodsourceOptions: function(value) {
      // return this.dict.BloodSource;
      return this.$store.getters['public/getDic']("BloodSource")&&this.$store.getters['public/getDic']("BloodSource").filter(el=>el.Value!==-1);
    },
    BloodWay: function(value) {
      return this.$store.getters['public/getDic']("BloodWay")&&this.$store.getters['public/getDic']("BloodWay").filter(el=>el.Value!==-1);
    }
  },
  watch: {
    commonObj: {
      handler: function(val, oldVal) {
        console.log(val, 8888);
        for (let key in val) {
          this.commonData[key] = val[key];
        }
        this.commonData.RH=this.commonData.RH?this.commonData.RH:'阳性'
      },
      immediate: true,
      deep: true
    }
    // tableData: function(newValue) {
    //   let arr = [];
    //   newValue.forEach(item => {
    //     if (!item.Deleted) {
    //       arr.push(item);
    //     }
    //   });
    //   if (arr.length == 0) {
    //     this.commonData.ExcuteDepartment = "";
    //   }
    // }
  },
  methods: {
    changeTime(el) {
      if (+new Date(el) < +new Date(this.patientMsg.InHospTime)) {
        this.$msg.info("申请时间不允许早于患者入科时间！");
        this.commonData.ApplyTime = GetFormatDateTime(
          "yyyy/MM/dd HH:mm",
          new Date(this.patientMsg.InHospTime)
        );
      }
      //  是否是补录医嘱
      this.commonData.IsAdditional =
        parseInt(+new Date(el) / 60000) <
        parseInt(+new Date(this.nowTime) / 60000);
      console.log(+new Date(el), "time", this.patientMsg.InHospTime);
      console.log(
        parseInt(+new Date(el) / 60000),
        parseInt(+new Date(this.nowTime) / 60000)
      );
    },
    // getDictData() {
    //   this.$Api.getFrequency().then(res => {
    //     this.frequencyOptions = res.Data || [];
    //   });
    // },
    // 医嘱提交前验证
    submitForm() {
      console.log(this.commonData);
      return new Promise((resolve, reject) => {
        this.$refs.inspectDoctorAdvice.validate((valid, obj) => {
          console.log(obj);
          if (valid) {
            if (!this.tableData.length) {
              this.$msg.info("当前没有医嘱项目，请添加后再保存！");
              resolve(false);
            }
            let doctorOrderMain = { ...this.commonData };

            doctorOrderMain.InHouseId = this.$route.query.id;
            // doctorOrderMain.Id = this.commonData.Id;
            doctorOrderMain.DiagnosisAreaType = this.selectArea.DiagnosisAreaType;
            doctorOrderMain.IsUrgent = true;
            doctorOrderMain.HisNumber = "";
            doctorOrderMain.Diagnosis = this.patientMsg.Diagnosis;
            resolve({
              BloodForm: doctorOrderMain,
              BloodFormDetails: this.tableData
            });
          } else {
            resolve(false);
            console.log("error submit!!");
          }
        });
      });
    }
  }
};
</script>
<style lang='less'>
@import url("./adviceStyle.less");
.bloodDoctorAdvice.doctor-advice {
  padding-top: 20px;
}
</style>
