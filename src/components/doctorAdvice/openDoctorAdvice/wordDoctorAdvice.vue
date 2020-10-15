<template>
  <div class="wordDoctorAdvice doctor-advice">
    <doctorAdviceTable
      :columns="columns"
      :tableData="tableData"
      :orderType="22"
      row-key="WordsType"
    >
      <template slot="adviceName" slot-scope="{scope}">
        <template v-if="!scope.row._edit">{{scope.row.OrderContent}}</template>
        <slot name="change" :index="scope.row._index" :itemName="scope.row.OrderContent" v-else />
      </template>
      <template slot="Frequency" slot-scope="{scope}">
        <el-select v-model="scope.row.FrequencyCode" placeholder="请选择">
          <el-option
            v-for="item in frequencyOptions"
            :key="item.Code"
            :label="item.InputString"
            :value="item.Code"
          ></el-option>
        </el-select>
      </template>
    </doctorAdviceTable>

    <slot name="search" />
    <h2>共性编辑</h2>
    <el-form
      :model="commonData"
      :rules="isVerification?rules:rulesNull"
      ref="inspectDoctorAdvice"
      label-position="right"
      label-width="80px"
      class="doctor-advice-form"
    >
      <el-form-item label="开始时间" prop="StartTime">
        <el-date-picker
          :clearable="false"
          :picker-options="pickerOptions"
          v-model="commonData.StartTime"
          @change="changeTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
          placeholder="选择日期时间"
          default-time="12:00:00"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="长/临" prop="EffectiveTime" class="effective">
        <el-radio-group
          v-model="commonData.EffectiveTime"
          text-color="#0071E7"
          fill="rgba(0,113,231,0.10)"
        >
          <el-radio-button :label="2" :disabled="selectArea.DiagnosisAreaType === 3">长</el-radio-button>
        </el-radio-group>
        <el-radio-group
          v-model="commonData.EffectiveTime"
          text-color="#0071E7"
          fill="rgba(0,113,231,0.10)"
        >
          <el-radio-button :label="1">临</el-radio-button>
        </el-radio-group>
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
          >{{item.Text}}</el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <slot :submitForm="submitForm" />
  </div>
</template>

<script>
import { wordDoctorAdviceColumns } from "../../../module/tableColumns";
import doctorAdviceTable from "./doctorAdviceTable.vue";
import { GetFormatDateTime } from "@/utils/public";
import { mapGetters } from "vuex";

export default {
  name: "wordDoctorAdvice", //文字医嘱控件
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
        StartTime: [
          { required: true, message: "请输入开始时间", trigger: "change" }
        ],

        EffectiveTime: [
          { required: true, message: "请选择长/临", trigger: "change" }
        ]
      },
      rulesNull:{},
      columns: wordDoctorAdviceColumns,
      // tableData: wordDoctorAdviceData,
      commonData: {
        DiagnosisAreaType: "", //诊疗区大区
        OrderType: 5, //医嘱类别
        IsAdditional: false, //是否补录医嘱
        EffectiveTime: 2, //长/临
        StartTime: "", //开始时间
        Remark: "" //备注
      }, //公共数据
      frequencyOptions:[]

    };
  },
  watch: {
    commonObj: {
      handler: function(val, oldVal) {
        for (const key in val) {
          this.commonData[key] = val[key];
        }
      },
      immediate: true
    }
  },
  created() {
    this.getDictData();
    this.commonData.DiagnosisAreaType = this.selectArea.DiagnosisAreaType;
    this.nowTime = this.commonData.StartTime =this.commonData.StartTime?this.commonData.StartTime: GetFormatDateTime();
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
    if(this.selectArea.DiagnosisAreaType === 3) {
      this.commonData.EffectiveTime=1
    }
  },
  computed: {
    ...mapGetters({
      patientMsg: "public/GET_PATIENTMSG",
      selectArea: "home/GET_SELECTAREA" //所在区域
    }),
    //备注选项
        remarkOptions: function(value) {
      return this.$store.getters['public/getDic']("TextRemark").filter(el=>el.Value!==-1);
    }
  },
  methods: {
    changeTime(el) {
      if (+new Date(el) < +new Date(this.patientMsg.InHospTime)) {
        this.$msg.info("医嘱开始时间不允许早于患者入科时间！");
        this.commonData.StartTime = GetFormatDateTime(
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
    getDictData() {
      this.$Api.getFrequency().then(res => {
        this.frequencyOptions = res.Data || [];
      });
    },
    // 医嘱提交前验证
    submitForm() {
      return new Promise((resolve, reject) => {
        this.$refs.inspectDoctorAdvice.validate((valid, obj) => {
          console.log(obj);
          if (valid) {
            if (!this.tableData.filter(el=>!el.IsDeleted).length) {
              this.$msg.info("当前没有医嘱项目，请添加后再保存！");
              resolve(false);
            }
            // let doctorOrderMain = { ...this.commonData };

            this.commonData.InHouseId = this.$route.query.id;
            let arr = this.tableData.filter(item => {
              // item={...item,...this.commonData}
              for (const key in this.commonData) {
                item[key] = this.commonData[key];
              }
              return true;
            });
            // this.commonData.OrderType =this.tableData[0]
            resolve(arr);
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
