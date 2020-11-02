<template>
  <div class="drugDoctorAdvice doctor-advice">
    <doctorAdviceTable
      :orderType="14"
      :columns="columns"
      :tableData="tableData"
      row-key="HisMedId"
      @row-contextmenu="contextmenu"
      :row-class-name="rowClass"
    >
      <template slot="adviceName" slot-scope="{scope}">
        <template v-if="!scope.row._edit">
          <span v-if="scope.row.Insurance">[{{scope.row.Insurance}}]</span>
          <span v-if="scope.row.SpecialName!=='普通'">[{{scope.row.SpecialName}}]</span>
          {{scope.row.MedicineName+' '+scope.row.SpecificationName}}
        </template>
        <slot name="change" :index="scope.row._index" :itemName="scope.row.MedicineName" v-else />
      </template>
      <template slot="specimen" slot-scope="{scope}">
        <el-input-number
          v-model="scope.row.Dose"
          placeholder="剂量"
          :min="0"
          :step="scope.row.step[scope.row.Unit]"
          @change="computeNum(scope.row)"
          controls-position="right"
        ></el-input-number>
        <el-select
          v-model="scope.row.Unit"
          placeholder="请选择"
          @change="computeNum(scope.row,'unit')"
        >
          <el-option
            v-for="(items,index) in scope.row.doseOption "
            :key="index"
            :label="items"
            :value="items"
          ></el-option>
        </el-select>
      </template>
      <template slot="remarks" slot-scope="{scope}">
        <el-input-number
          v-if="commonData.DiagnosisAreaType===3||commonData.IsOutHospitalMedicine"
          v-model="scope.row.Dosage"
          placeholder="数量"
          :min="1"
          :precision="0"
          @change="changeDosage(scope.row,$event)"
          class="dosage"
          controls-position="right"
        ></el-input-number>
        <span v-else>{{scope.row.Dosage}}</span>

        {{scope.row.DosageUnit}}
      </template>
      <template slot="ReimbursementType" slot-scope="{scope}">
        <el-checkbox
          v-model="scope.row.ReimbursementType"
          :true-label="1"
          :false-label="2"
          :disabled="!scope.row.MedicalInsuranceControlFlag"
        ></el-checkbox>
      </template>
      <template slot="InsuranceUseFlag" slot-scope="{scope}">
        <el-checkbox
          v-model="scope.row.InsuranceUseFlag"
        ></el-checkbox>
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
      <el-form-item label="用法" prop="UsageCode" class="usage">
        <el-select
          v-model="commonData.UsageCode"
          placeholder="请选择"
          filterable
          default-first-option
          @visible-change="remoteMethod('',$event)"
          :filter-method="remoteMethod"
        >
          <el-option
            v-for="item in usageList"
            :key="item.Value"
            :label="item.Text"
            :value="item.Value"
          >
            <span style="float: left">{{item.Text}}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{item.Value}}</span>
          </el-option>
        </el-select>
        <el-input-number
          :disabled="commonData.UsageText!=='静滴'"
          :step="10"
          v-model="commonData.DrippingSpeed"
          controls-position="right"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="频次" prop="FrequencyCode">
        <el-select
          v-model="frequency"
          placeholder="请选择"
          value-key="Code"
          automatic-dropdown
          filterable
          @change="setFrequencyCode"
        >
          <el-option
            v-for="item in frequencyOptions"
            :key="item.Code"
            :label="item.InputString"
            :value="item"
          >{{item.InputString}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="执行时间" prop="ExcuteTimePeriod" class="excute-time">
        <el-select
          v-if="frequency.Unit==='W'"
          v-model="timeArr[0]"
          placeholder="请选择"
          @change="setExcuteTime"
        >
          <el-option
            v-for="item in weekOptions"
            :key="item.Value"
            :disabled="item.Value>endTime"
            :label="item.Text"
            :value="item.Value"
          >{{item.Text}}</el-option>
        </el-select>
        <el-time-select
          v-else
          :clearable="false"
          :disabled="!timeArr.length||specialUnit.includes(frequency.Unit)"
          v-model="timeArr[0]"
          :picker-options="endTime"
          @change="setExcuteTime"
          placeholder="请选择"
        ></el-time-select>
        <span class="text">{{timeText}}</span>
      </el-form-item>
      <el-form-item label="首日次数" prop="FirstDayTimes" class="first-day">
        <el-input-number
          :disabled="isDH"
          v-model="commonData.FirstDayTimes"
          controls-position="right"
          :min="commonData.MinNumber"
          :max="commonData.firstMaxNum"
          @change="changeNum(tableData,$event)"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="天数" prop="OrderDays" class="order-days">
        <el-input-number
          :disabled="!(commonData.DiagnosisAreaType===3||commonData.IsOutHospitalMedicine)"
          @change="computeNum(tableData,'OrderDays',$event)"
          v-model="commonData.OrderDays"
          controls-position="right"
          :min="1"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="药房" prop="PharmacyNumber">
        <el-select v-model="commonData.PharmacyNumber" placeholder="请选择" automatic-dropdown>
          <el-option
            v-for="item in pharmacyOptions"
            :key="item.Value"
            :label="item.Text"
            :value="item.Value"
          >{{item.Text}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="长/临" prop="EffectiveTime" class="effective">
        <el-radio-group
          v-model="commonData.EffectiveTime"
          text-color="#0071E7"
          fill="rgba(0,113,231,0.10)"
        >
          <el-radio-button
            :label="2"
            :disabled="commonData.DiagnosisAreaType === 3 ||commonData.IsOutHospitalMedicine"
          >长</el-radio-button>
          <el-radio-button :label="1">临</el-radio-button>
        </el-radio-group>
        <!-- <el-radio-group
          v-model="commonData.EffectiveTime"
          text-color="#0071E7"
          fill="rgba(0,113,231,0.10)"
        >
         
        </el-radio-group>-->
        <el-checkbox v-model="commonData.IsOutHospitalMedicine" @change="changeIsOut">出院带药</el-checkbox>
      </el-form-item>
      <!-- <el-form-item label="嘱托" prop="Remark" class="all">
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
      </el-form-item>-->
    </el-form>
    <div class="el-form-item el-form-item--small all">
      <label class="el-form-item__label" style="width: 80px;">嘱托</label>
      <div class="el-form-item__content" style="margin-left: 80px;">
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
      </div>
    </div>
    <slot :submitForm="submitForm" />
  </div>
</template>

<script>
import { drugDoctorAdviceColumns } from "../../../module/tableColumns";
import { drugDoctorAdviceData } from "../../../module/tableData";
import doctorAdviceTable from "./doctorAdviceTable.vue";
import { createZero, GetFormatDateTime, type } from "@/utils/public";
import { mapGetters } from "vuex";
const dictType = ["Frequency", "OrderUsage", "Pharmacy"];
const optionType = ["frequencyOptions", "usageArr", "pharmacyOptions"];
export default {
  name: "drugDoctorAdvice", //药品医嘱控件
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
    isVerification: {
      type: Boolean,
      default: true
    },
    // 右击回调
    contextmenu: {
      type: Function,
      default: function() {}
    }
  },
  created() {
    console.log(
      this.tableData,
      "药品医嘱药品医嘱",
      this.commonData.EffectiveTime
    );
    this.commonData.DiagnosisAreaType = this.patientMsg.AreaType;

    if (!this.isVerification) {
      this.commonData.DiagnosisAreaType =
        this.selectArea.DiagnosisAreaType || 1;
    }
    this.commonData.OrderDays =
      this.commonData.DiagnosisAreaType === 3 ? 1 : undefined;
    this.getDictData();
    this.nowTime = this.commonData.StartTime = this.commonData.StartTime
      ? this.commonData.StartTime
      : GetFormatDateTime();
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
  watch: {
    commonObj(newVal) {
      for (const key in newVal) {
        console.log(key);
        if (this.commonData.hasOwnProperty(key)) {
          this.commonData[key] = newVal[key];
        }
      }
      this.computeNum(this.tableData);
    },
    "commonData.EffectiveTime"(val) {
      console.log("commonData.EffectiveTime", val);
      if (val == 2) {
        this.commonData.MinNumber = 0;
      } else {
        this.commonData.MinNumber = this.commonData.OrderDays > 1 ? 0 : 1;
        this.commonData.FirstDayTimes = this.commonData.FirstDayTimes
          ? this.commonData.FirstDayTimes
          : 1;
      }
      this.computeNum(this.tableData);
    },
    "commonData.UsageCode"(newVal) {
      // console.log(newVal);
      for (let index = 0; index < this.usageOptions.length; index++) {
        const el = this.usageOptions[index];
        if (el.Value === newVal) {
          this.commonData.UsageText = el.Text;
          if (el.Text !== "静滴") {
            this.commonData.DrippingSpeed = undefined;
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      selectArea: "home/GET_SELECTAREA", //所在区域
      patientMsg: "public/GET_PATIENTMSG"
    }),
    //备注选项
    remarkOptions: function(value) {
      let arr = this.$store.getters["public/getDic"]("Entrust") || [];
      return arr.filter(el => el.Value !== -1);
    },
    //  //用法的选项
    usageOptions() {
      console.log(this.tableData, 22);
      return this.tableData[0]
        ? this.tableData[0].MedicinalUsageList[0]
          ? this.tableData[0].MedicinalUsageList
          : this.usageArr
        : [];
    },
    // 执行时间文本部分
    timeText() {
      if (this.frequency.Unit === "W") {
        let arr = [...this.timeArr];
        arr.forEach((el, index) => {
          arr[index] = this.weekOptions[el - 1].Text;
        });
        return arr.slice(1).join("/");
      } else {
        return this.timeArr.slice(1).join("/");
      }
    },
    // 执行时间选择范围
    endTime() {
      let type = this.frequency.Unit;
      if (this.timeArr.length > 1) {
        let count =
          type === "H" ? this.timeArr.length : this.frequency.Count - 1;
        return type === "W"
          ? 7 - (this.frequency.Count - 1) * this.timeLag
          : {
              start: "00:00",
              step: "01:00",
              end: createZero(24 - count * this.timeLag) + ":00"
            };
      } else {
        return type === "W"
          ? 7
          : {
              start: "00:00",
              step: "01:00",
              end: "23:59"
            };
      }
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
      rowClass({ row }) {
        // console.log(row,'row',row.StockNum>0);
        return row.StockNum > 0 ? "" : "disabled";
        // return {background: '#F0F0F0'};
      },
      rules: {
        StartTime: [
          { required: true, message: "请输入开始时间", trigger: "blur" }
        ],
        UsageCode: [
          { required: true, message: "请选择用法", trigger: "change" }
        ],
        FrequencyCode: [
          { required: true, message: "请选择频次", trigger: "change" }
        ],
        ExcuteTimePeriod: [
          { required: true, message: "请选择执行时间", trigger: "change" }
        ],
        // PharmacyNumber: [
        //   { required: true, message: "请选择药房", trigger: "change" }
        // ],
        EffectiveTime: [
          { required: true, message: "请选择长/临", trigger: "change" }
        ]
      },
      rulesNull: {},
      columns: drugDoctorAdviceColumns,
      frequency: "", //选中的频次对象
      timeArr: [], //执行时间中间值
      specialUnit: ["1D", "2D", "3D", "ST", "T", "4D"],
      timeLag: 8, //执行时间间隔
      isDH: false,
      // tableData: drugDoctorAdviceData,
      commonData: {
        MinNumber: 0,
        OrderType: 14, //医嘱类别
        MaxNumber: 100, //每日最大执行次数
        firstMaxNum: 100, //首日最大执行次数
        DiagnosisAreaType: "", //诊疗区大区
        IsAdditional: false, //是否是补录医嘱
        InHouseId: "", //患者入科id
        StartTime: "", //医嘱开始时间
        EndTime: "", //医嘱结束时间
        DrippingSpeed: undefined, //滴速
        UsageCode: "", //用法代码
        UsageText: "", //用法文本
        FrequencyCode: "", //频次代码
        FrequencyText: "", //频次文本
        ExcuteTimePeriod: "", //执行时间段
        FirstDayTimes: 1, //首日次数
        OrderDays: undefined, //医嘱天数
        PharmacyNumber: "", //药房
        EffectiveTime: 1, //长/临
        IsOutHospitalMedicine: false, //是否出院带药
        Remark: "" //嘱托
      }, //公共数据
      usageArr: [], //全部用法
      pharmacyOptions: [], //药房选项
      weekOptions: [
        {
          Text: "周一",
          Value: 1
        },
        {
          Text: "周二",
          Value: 2
        },
        {
          Text: "周三",
          Value: 3
        },
        {
          Text: "周四",
          Value: 4
        },
        {
          Text: "周五",
          Value: 5
        },
        {
          Text: "周六",
          Value: 6
        },
        {
          Text: "周日",
          Value: 7
        }
      ], //天数的选项
      statusOptions: [
        {
          Text: "长期",
          Value: 2
        },
        {
          Text: "临时",
          Value: 1
        }
      ], //长/临的选项
      frequencyOptions: [], //频次的选项
      speedOptions: [], //滴速的选项
      // remarkOptions: [], //备注的选项
      selectEl: {}, //选中的频次数据
      usageList: [] //搜索的用法
    };
  },
  methods: {
    changeDosage(row, val) {
      console.log(row, val, "changeDosage");
      row.FirstDayDosageNum = val;
    },
    // 计算药品数量
    computeNum(row, name, val) {
      if (name === "unit") {
        // this.commonData.Dose
        row.Dose =
          row.Unit === row.SpecificationUnit
            ? row.Dose * row.SpecificationFactor
            : parseInt(row.Dose / row.SpecificationFactor);
        console.log(row.Unit);
      }
      console.log(row, this.commonData, "commonData");
      if (name === "OrderDays") {
        if (this.commonData.EffectiveTime == 2) {
          this.commonData.MinNumber = 0;
        } else {
          if (!this.commonData.FirstDayTimes) {
            this.commonData.FirstDayTimes =
              val > 1 ? this.commonData.FirstDayTimes : 1;
          }
          this.commonData.MinNumber = val > 1 ? 0 : 1;
        }
      }
      let day = this.commonData.OrderDays || 1;
      let max = this.commonData.FrequencyCode ? this.commonData.MaxNumber : 1; //每日最多次数
      let arr = type(row) === "object" ? [row] : row;
      arr.forEach(item => {
        let num = item.Dose * max * day;
        // item.Dose * max * (this.commonData.EffectiveTime === 2 ? 1 : day);
        // 首日用量
        if (this.commonData.DiagnosisAreaType === 3) {
          if (day <= 1) {
            this.commonData.FirstDayTimes = this.commonData.FirstDayTimes || 1;
          }
          // num = num - item.Dose * (max - this.commonData.FirstDayTimes);
        }
        let firstNum =
          item.Dose *
          this.commonData.FirstDayTimes *
          (this.commonData.EffectiveTime === 2 ? 1 : day);

        item.DosageUnitCategory =
          item.DosageUnit === item.InhospitalUnit ? 1 : 2;
        console.log(
          firstNum,
          num,
          item.Dose,
          "firstNum",
          this.commonData.FirstDayTimes
        );
        // 换算成最小单位的数量
        let minNum;
        let firstMinNum;
        // 剂量单位=规格单位
        if (item.Unit === item.SpecificationUnit) {
          minNum = Math.ceil((num / item.SpecificationFactor).toFixed(4));
          firstMinNum = Math.ceil(
            (firstNum / item.SpecificationFactor).toFixed(4)
          );
        } else {
          // 剂量单位=最小单位
          minNum = Math.ceil(num.toFixed(4));
          firstMinNum = Math.ceil(firstNum.toFixed(4));
        }
        // 换算成数量单位
        let lastNum;
        let firstLastNum;
        // 数量单位=门诊单位
        if (item.DosageUnitCategory === 2) {
          lastNum = Math.ceil(minNum / item.OutPatientFactor);
          firstLastNum = Math.ceil(firstMinNum / item.OutPatientFactor);
        } else {
          // 数量单位=最小单位
          lastNum = Math.ceil(minNum / item.InhospitalFactor);
          firstLastNum = Math.ceil(firstMinNum / item.InhospitalFactor);
        }
        if (
          this.commonData.DiagnosisAreaType === 3 ||
          this.commonData.IsOutHospitalMedicine
        ) {
          item.Dosage = lastNum;
          //        item.FirstDayDosageNum =
          // this.commonData.EffectiveTime === 1 ? lastNum : firstLastNum;
          item.FirstDayDosageNum = lastNum;
          console.log(111);
        } else {
          item.Dosage =
            this.commonData.EffectiveTime === 2 ? lastNum : firstLastNum;
          item.FirstDayDosageNum = firstLastNum;
        }

        console.log(
          row,
          this.commonData.DiagnosisAreaType,
          lastNum,
          num,
          minNum,
          "12",
          firstLastNum,
          this.commonData.EffectiveTime
        );
      });
    },
    // 处理时间
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
      if (this.specialUnit.includes(this.frequency.Unit)) {
        let time = this.frequency.DataTime;
        let t = GetFormatDateTime(
          "yyyy/MM/dd HH:mm",
          new Date(this.commonData.StartTime)
        ).split(" ")[1];
        t = time && time.indexOf(":") > -1 ? time : t;
        this.commonData.ExcuteTimePeriod = t;
        this.timeArr = [t];
      }
      this.figureUp();
      // this.setFrequencyCode(this.selectEl);
    },
    // 处理执行时间
    setExcuteTime(el) {
      console.log(this.timeArr, "setExcuteTime");
      let type = this.frequency.Unit;
      if (this.timeArr.length < 2 && type !== "H") {
        this.commonData.ExcuteTimePeriod = el + "";
      } else if (this.timeArr.length > 1) {
        if (type === "D") {
          this.timeArr = this.timeArr.map((item, index) => {
            let num = createZero(parseInt(el) + this.timeLag * index);
            return num == 24 ? "23:59" : num + ":00";
          });
          this.commonData.ExcuteTimePeriod = this.timeArr.join(",");
        } else if (type === "W") {
          this.timeArr = this.timeArr.map((item, index) => {
            // let num=createZero(parseInt(el)+this.timeLag*index)
            return el + this.timeLag * index;
          });
          let arr = [...this.timeArr];
          arr.forEach((item, index) => {
            arr[index] += ";08:00";
          });
          console.log(arr);
          this.commonData.ExcuteTimePeriod = arr.join(",");
        }
      }
      this.figureUp();
      this.computeNum(this.tableData);
    },
    //频次处理函数
    setFrequencyCode(el, time, bl) {
     
      time = time || el.DateTime;
      this.selectEl = el;
      this.commonData.FrequencyCode = el.Code;
      this.commonData.FrequencyText = el.InputString;
      this.commonData.ExcuteTimePeriod = time;
      let maxNum = 0;
      if (el.Unit === "H") {
        this.timeArr = [];
        let num = 0;
        maxNum = (el.Count * 24) / el.Number;
        this.timeLag = el.Number;
        let timeListarr = this.selectTimeArr((el.Count * 24) / el.Number);
        for (let i = 0; i < timeListarr.length; i++) {
          this.timeArr.push(timeListarr[i].slice(11));
        }
      } else if (el.Unit === "D") {
        this.timeArr = time.split(",");
        maxNum = el.Count * el.Number;
        if (this.timeArr.length > 1) {
          this.timeLag = parseInt(this.timeArr[1]) - parseInt(this.timeArr[0]);
        }
      } else if (el.Unit === "W") {
        maxNum = 1;
        this.timeArr = [];
        let arr = time.split(",");
        arr.forEach(item => {
          this.timeArr.push(+item.split(";")[0]);
        });
        if (this.timeArr.length > 1) {
          this.timeLag = this.timeArr[1] - this.timeArr[0];
        }
        this.commonData.firstMaxNum = this.commonData.FirstDayTimes = 1;
        this.isDH = true;
      } else {
        this.commonData.firstMaxNum = this.commonData.FirstDayTimes = 1;
        this.isDH = true;
        maxNum = 1;
        let t = GetFormatDateTime(
          "yyyy/MM/dd HH:mm",
          new Date(this.commonData.StartTime)
        ).split(" ")[1];
        t = time && time.indexOf(":") > -1 ? time : t;
        this.commonData.ExcuteTimePeriod = t;
        this.timeArr = [t];
      }
      if (el.InputString === "ST" || el.InputString === "once") {
        this.commonData.EffectiveTime = bl ? this.commonData.EffectiveTime : 1;
      } else {
        // this.commonData.EffectiveTime=(bl||this.commonData.DiagnosisAreaType===3)?this.commonData.EffectiveTime:2
      }
      this.commonData.MaxNumber = maxNum;
      this.figureUp(bl);
      
      if (!bl) {
        this.computeNum(this.tableData);
      }
    },
    // 获取静态数据
    getDictData() {
      console.log(1111111111, this.isChange);
      dictType.forEach((item, index) => {
        if (item === "Frequency") {
          this.$Api.getFrequency().then(res => {
            this.frequencyOptions = res.Data || [];
            // 医嘱修改数据还原
            if (this.isChange) {
              console.log(this.commonObj, "this.commonObj");
              for (const key in this.commonObj) {
                this.commonData[key] = this.commonObj[key];
              }
              this.commonData.OrderDays = this.commonData.OrderDays
                ? this.commonData.OrderDays
                : undefined;
              this.commonData.DrippingSpeed = this.commonData.DrippingSpeed
                ? this.commonData.DrippingSpeed
                : undefined;
              this.frequency = this.frequencyOptions.filter(item => {
                return item.Code === this.commonObj.FrequencyCode;
              })[0];
              this.setFrequencyCode(
                this.frequency,
                this.commonObj.ExcuteTimePeriod,
                this.isChange
              );
              // 医嘱新增
            } else {
              this.commonData.UsageText = this.tableData[0].UsageText;
              this.commonData.UsageCode = this.tableData[0].UsageCode;
              this.commonData.PharmacyNumber = this.tableData[0].PharmacyCode;
              this.frequency = this.tableData[0].frequency;

              this.setFrequencyCode(this.frequency);
            }
          });
        } else {
          this.$Api.getDictData({ dictType: item }).then(res => {
            this[optionType[index]] = res.Data || [];
            if (optionType[index] === "usageArr") {
              this.usageList = this.usageArr;
            }
          });
        }
      });
    },
    // 医嘱提交前验证
    submitForm() {
      return new Promise((resolve, reject) => {
        this.$refs.inspectDoctorAdvice.validate((valid, obj) => {
          console.log(obj);
          if (valid) {
            if (!this.tableData.length) {
              this.$msg.info("当前没有医嘱项目，请添加后再保存！");
              resolve(false);
            }
            let doctorOrderMain = { ...this.commonData };
            if (this.commonData.DiagnosisAreaType === 3) {
              let start = new Date(doctorOrderMain.StartTime);
              // start.setHours(0)
              // start.setMinutes(0)
              //  start.setSeconds(0)
              let end = new Date(
                +start +
                  (doctorOrderMain.OrderDays ? doctorOrderMain.OrderDays : 1) *
                    86400000
              );
              doctorOrderMain.EndTime = GetFormatDateTime(
                "yyyy-MM-dd HH:mm",
                end
              );
            } else {
              doctorOrderMain.EndTime = "";
            }
            doctorOrderMain.OrderDays =
              doctorOrderMain.OrderDays === undefined
                ? 0
                : doctorOrderMain.OrderDays;
            doctorOrderMain.InHouseId = this.$route.query.id;
            // this.commonData.OrderType =this.tableData[0]
            resolve({
              doctorOrderMain: doctorOrderMain,
              doctorOrderDetails: this.tableData
            });
          } else {
            resolve(false);
            console.log("error submit!!");
          }
        });
      });
    },
    //格式化日期
    format(val) {
      let data = new Date(val);
      let initDate = new Date(this.commonData.StartTime);
      let y = initDate.getFullYear();
      let mon = initDate.getMonth() + 1;
      let day = initDate.getDate();
      let h = data.getHours();
      let min = data.getMinutes();
      return (
        createZero(y) +
        "-" +
        createZero(mon) +
        "-" +
        createZero(day) +
        " " +
        createZero(h) +
        ":" +
        createZero(min)
      );
    },

    //将时间划分不同的时间段
    selectTimeArr(amount) {
      let temp = [];
      // amount=parseInt(amount)
      var totalTime = 24 * 3600 * 1000;
      var spanTime = totalTime / amount;
      var startTime = new Date();
      startTime.setHours(0, 0, 0, 0);
      var currentTime = startTime.getTime();
      for (let i = 0; i < amount; i++) {
        temp.push(this.format(currentTime + i * spanTime));
      }
      // let perData = temp.pop();
      // temp.unshift(perData);
      return temp;
    },
    figureUp(bl) {
      //  return
      console.log(bl,'figureUp',this.commonData.FirstDayTimes);
      let el = this.selectEl;
      let maxNum = 0;
      if (el.Unit === "D" || el.Unit === "H") {
        let timeList = [...this.timeArr];
        let num = 0;
        let initDate = new Date(this.commonData.StartTime);
        let y = initDate.getFullYear();
        let mon = initDate.getMonth() + 1;
        let day = initDate.getDate();
        timeList.forEach(item => {
          item =
            createZero(y) +
            "-" +
            createZero(mon) +
            "-" +
            createZero(day) +
            " " +
            item;
          if (
            new Date(this.commonData.StartTime).getTime() <=
            new Date(item).getTime()
          ) {
            num++;
          }
        });
        maxNum = timeList.length;
        if (num >= maxNum) {
          this.commonData.firstMaxNum = num;
          if (!bl) {
            this.commonData.FirstDayTimes = num;
          }
        } else {
          this.commonData.firstMaxNum = num + 1;
          if (!bl) {
            this.commonData.FirstDayTimes = num;
          }
        }
        if (this.commonData.EffectiveTime == 2) {
          if (!bl) {
            this.commonData.FirstDayTimes = this.commonData.FirstDayTimes
              ? this.commonData.FirstDayTimes
              : 1;
          }
          this.commonData.MinNumber = 0;
        } else {
          this.commonData.MinNumber = 1;
          if (!bl) {
          this.commonData.FirstDayTimes = num || 1;
          }
        }
        this.isDH = false;
      } else {
        this.commonData.firstMaxNum = 1;
        this.souNum = 1;
        if (!bl) {
          this.commonData.FirstDayTimes = 1;
        }

        this.isDH = true;
        console.log(
          this.commonData.FirstDayTimes,
          "this.commonData.FirstDayTimes"
        );
      }
    },
    // 首日次数处理
    changeNum(row, currentValue, oldValue) {
      console.log("object", row, currentValue, oldValue);
      if (currentValue === undefined) {
        this.$nextTick(() => {
          this.commonData.FirstDayTimes = this.commonData.MinNumber;
          this.computeNum(row);
        });
      } else {
        this.computeNum(row);
      }
    },
    changeIsOut(val) {
      if (val) {
        this.commonData.EffectiveTime = 1;
        this.commonData.OrderDays = this.commonData.OrderDays || 1;
        this.commonData.DiagnosisAreaType !== 3 &&
          this.computeNum(
            this.tableData,
            "OrderDays",
            this.commonData.OrderDays
          );
      } else {
        if (this.commonData.DiagnosisAreaType !== 3) {
          this.commonData.OrderDays = undefined;
          this.computeNum(this.tableData, "OrderDays", 0);
        }
      }
    },
    // 频次搜索
    remoteMethod(val,bl) {
      val = val && val.replace(/(^\s*)|(\s*$)/g, "");
      console.log(val,'val',bl);
      if (!val&&bl!==false) {
        this.usageList = this.usageOptions;
        return
      }
      this.usageList = this.usageOptions.filter(item => {
          console.log( this.usageList," this.usageList")
        let hasCode=item.InputCode&&item.InputCode.toLowerCase().indexOf(val.toLowerCase()) > -1
        return (
           hasCode||item.Text.indexOf(val.toLowerCase()) > -1 ||
           item.Value.indexOf(val.toLowerCase()) > -1
        );
      });
      console.log( this.usageList," this.usageList")
    }
  }
};
</script>
<style scoped lang='less'>
.drugDoctorAdvice {
  .el-table {
    .el-select {
      width: 48%;

      /deep/ .el-input__inner {
        padding-right: 30px;
        padding-left: 5px;
      }
    }
    .el-input-number {
      width: 48%;
      margin-right: 4%;
      &.is-controls-right /deep/ .el-input__inner {
        padding-right: 25px;
        padding-left: 5px;
      }
      &.dosage {
        width: 70%;
      }
    }
  }
  /deep/.el-radio-button__inner {
    margin-left: 20px;
    border-radius: 0;
    border: 1px solid #ccc;
  }
}
</style>
