<template>
  <div class="new-operation">
    <el-form
      :model="ruleForm"
      :rules="isVerification?rules:rulesNull"
      ref="newOperation"
      label-width="95px"
      :class="{'demo-ruleForm':isBorder}"
    >
      <div class="content">
        <div class="item">
          <el-form-item label="术前诊断" prop="DiagnosisName">
                   <el-select
          v-model="ruleForm.DiagnosisName"
          placeholder="请选择"
          filterable
          default-first-option
        >
          <el-option
            v-for="item in diagnoseList"
            :key="item.Id"
            :label="item.DiagnosisName"
            :value="item.DiagnosisName"
          ></el-option>
        </el-select>
            <!-- <el-input v-model="ruleForm.DiagnosisName" placeholder="请输入术前诊断" ref="aad"></el-input> -->
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="拟施手术" prop="OperationName">
            <el-select
              :automatic-dropdown="true"
              v-model="ruleForm.OperationName"
              placeholder="请输入关键词"
              @change="selectOperationName"
              filterable
              remote
              reserve-keyword
              :remote-method="remoteplanList"
            >
              <el-option
                v-for="(item,index) in planData"
                :key="index"
                :label="item.Key"
                :value="item.Key"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="手术等级" prop="OperationLevel">
            <el-select
              v-model="ruleForm.OperationLevel"
              placeholder="请选择"
              :automatic-dropdown="true"
            >
              <el-option
                v-for="item in dictData.OperationLevel"
                :key="item.Value"
                :label="item.Key"
                :value="item.Value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="手术类型" prop="OperationType">
            <el-select
              v-model="ruleForm.OperationType"
              :automatic-dropdown="true"
              placeholder="请选择"
            >
              <el-option
                v-for="item in dictData.OperationType"
                :key="item.Value"
                :label="item.Key"
                :value="item.Value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="手术室" prop="OperationRoom">
            <el-select
              v-model="ruleForm.OperationRoom"
              :automatic-dropdown="true"
              placeholder="请选择"
            >
              <el-option
                v-for="item in dictData.OperationRoom"
                :key="item.Value"
                :label="item.Key"
                :value="item.Value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="手术部位" prop="OperationHumanBody">
            <el-select
              v-model="ruleForm.OperationHumanBody"
              :automatic-dropdown="true"
              placeholder="请选择"
            >
              <el-option
                v-for="item in dictData.OperationHumanBody"
                :key="item.Value"
                :label="item.Key"
                :value="item.Value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="手术台次" prop="OperationCountNo">
            <el-select
              :automatic-dropdown="true"
              v-model="ruleForm.OperationCountNo"
              placeholder="请选择"
              filterable
              allow-create
              default-first-option
            >
              <el-option v-for="item in 10" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="拟手术时间" prop="ExpectOperationTime">
            <el-date-picker
              :clearable="false"
              :picker-options="pickerOptions"
              v-model="ruleForm.ExpectOperationTime"
              type="datetime"
              placeholder="选择日期时间"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
            ></el-date-picker>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="体位" prop="OperationHumanPosition">
            <el-select
              v-model="ruleForm.OperationHumanPosition"
              placeholder="请选择"
              :automatic-dropdown="true"
            >
              <el-option
                v-for="item in dictData.OperationHumanPosition"
                :key="item.Value"
                :label="item.Key"
                :value="item.Value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="切口等级" prop="IncisionLevel">
            <el-select
              v-model="ruleForm.IncisionLevel"
              placeholder="请选择"
              :automatic-dropdown="true"
            >
              <el-option
                v-for="item in dictData.OperationIncisionLevel"
                :key="item.Value"
                :label="item.Key"
                :value="item.Value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="备血" prop="IsBloodPreparation">
            <el-radio-group v-model="ruleForm.IsBloodPreparation">
              <el-radio :label="true" border>有</el-radio>
              <el-radio :label="false" border>无</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="item bloodTypeName">
          <el-form-item label="血型" prop="BloodTypeCode">
            <el-select
              v-model="ruleForm.BloodTypeCode"
              placeholder="请选择"
              @change="selectBloodType"
              :automatic-dropdown="true"
            >
              <el-option
                v-for="item in dictData.BloodTypeModel"
                :key="item.Value"
                :label="item.Key"
                :value="item.Value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="RH" prop="RH" class="rh">
            <el-radio-group v-model="ruleForm.RH" ref="a">
              <el-radio label="阴性" border>阴</el-radio>
              <el-radio label="阳性" border>阳</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="主刀医生" prop="MianDoctorId">
            <el-select
              v-model="ruleForm.MianDoctorId"
              placeholder="请选择"
              filterable
              remote
              :loading="loading"
              :automatic-dropdown="true"
              default-first-option
              @focus="doctorList=defaultDoctorList"
              :remote-method="selectDoct"
            >
              <el-option
                v-for="item in doctorList"
                :key="item.Id"
                :label="item.Name"
                :value="item.Id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="指导医师" prop="InstructDoctorId ">
            <el-select
              v-model="ruleForm.InstructDoctorId"
              placeholder="请选择"
              filterable
              remote
              :automatic-dropdown="true"
              :loading="loading"
              default-first-option
              @focus="doctorList=defaultDoctorList"
              :remote-method="selectDoct"
            >
              <el-option
                v-for="item in doctorList"
                :key="item.Id"
                :label="item.Name"
                :value="item.Id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="手术一助" prop="FirstAssistantId">
            <el-select
              v-model="ruleForm.FirstAssistantId"
              placeholder="请选择"
              filterable
              remote
              :automatic-dropdown="true"
              :loading="loading"
              default-first-option
              @focus="doctorList=defaultDoctorList"
              :remote-method="selectDoct"
            >
              <el-option
                v-for="item in doctorList"
                :key="item.Id"
                :label="item.Name"
                :value="item.Id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="手术二助" prop="SecondAssistantId">
            <el-select
              v-model="ruleForm.SecondAssistantId"
              placeholder="请选择"
              filterable
              remote
              :automatic-dropdown="true"
              :loading="loading"
              default-first-option
              @focus="doctorList=defaultDoctorList"
              :remote-method="selectDoct"
            >
              <el-option
                v-for="item in doctorList"
                :key="item.Id"
                :label="item.Name"
                :value="item.Id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="麻醉医师" prop="AnesthesiaDoctorId ">
            <el-select
              v-model="ruleForm.AnesthesiaDoctorId"
              placeholder="请选择"
              filterable
              remote
              :automatic-dropdown="true"
              :loading="loading"
              default-first-option
              @focus="doctorList=defaultDoctorList"
              :remote-method="selectDoct"
            >
              <el-option
                v-for="item in doctorList"
                :key="item.Id"
                :label="item.Name"
                :value="item.Id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="麻醉助手" prop="AnesthesiaAssistantId">
            <el-select
              v-model="ruleForm.AnesthesiaAssistantId"
              placeholder="请选择"
              filterable
              remote
              :automatic-dropdown="true"
              :loading="loading"
              default-first-option
              @focus="doctorList=defaultDoctorList"
              :remote-method="selectDoct"
            >
              <el-option
                v-for="item in doctorList"
                :key="item.Id"
                :label="item.Name"
                :value="item.Id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="麻醉方式" prop="AnesthesiaType">
            <el-select
              v-model="ruleForm.AnesthesiaType"
              placeholder="请选择"
              :automatic-dropdown="true"
            >
              <el-option
                v-for="item in dictData.OperationAnesthesia"
                :key="item.Value"
                :label="item.Key"
                :value="item.Value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="麻醉时间" prop="AnesthesiaTime">
            <el-date-picker
              v-model="ruleForm.AnesthesiaTime"
              :clearable="false"
              :picker-options="pickerOptions"
              type="datetime"
              placeholder="选择日期时间"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              default-time="12:00:00"
            ></el-date-picker>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="巡回护士" prop="CircuitNurseId">
            <el-select
              v-model="ruleForm.CircuitNurseId"
              placeholder="请选择"
              filterable
              remote
              :automatic-dropdown="true"
              :loading="loading"
              default-first-option
              @focus="nurseList=defaultNurseList"
              :remote-method="selectNurse"
            >
              <el-option
                v-for="item in nurseList"
                :key="item.Id"
                :label="item.Name"
                :value="item.Id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="机械护士" prop="InstrumentNurseId">
            <el-select
              v-model="ruleForm.InstrumentNurseId"
              placeholder="请选择"
              filterable
              remote
              :automatic-dropdown="true"
              @focus="nurseList=defaultNurseList"
              :loading="loading"
              default-first-option
              :remote-method="selectNurse"
            >
              <el-option
                v-for="item in nurseList"
                :key="item.Id"
                :label="item.Name"
                :value="item.Id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="异物置入物" prop="ForeignBodyImplants">
            <el-select
              v-model="ruleForm.ForeignBodyImplants"
              placeholder="请选择"
              :automatic-dropdown="true"
            >
              <el-option
                v-for="item in foreignMatter"
                :key="item.Value"
                :label="item.Key"
                :value="item.Value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="多重耐药菌" prop="MDRO">
            <el-select v-model="ruleForm.MDRO" placeholder="请选择" :automatic-dropdown="true">
              <el-option
                v-for="item in mdrOptions"
                :key="item.Value"
                :label="item.Key"
                :value="item.Value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="乙肝" prop="HBV">
            <el-select v-model="ruleForm.HBV" placeholder="请选择" :automatic-dropdown="true">
              <el-option
                v-for="item in options"
                :key="item.Value"
                :label="item.Key"
                :value="item.Value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="丙肝" prop="HCV">
            <el-select v-model="ruleForm.HCV" placeholder="请选择" :automatic-dropdown="true">
              <el-option
                v-for="item in options"
                :key="item.Value"
                :label="item.Key"
                :value="item.Value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="梅毒" prop="RPR">
            <el-select v-model="ruleForm.RPR" placeholder="请选择" :automatic-dropdown="true">
              <el-option
                v-for="item in options"
                :key="item.Value"
                :label="item.Key"
                :value="item.Value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="艾滋" prop="HIV">
            <el-select v-model="ruleForm.HIV" placeholder="请选择" :automatic-dropdown="true">
              <el-option
                v-for="item in options"
                :key="item.Value"
                :label="item.Key"
                :value="item.Value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="申请时间" prop="ApplyTime">
            <el-date-picker
              v-model="ruleForm.ApplyTime"
              :clearable="false"
              :picker-options="pickerOptions"
              @change="changeTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              placeholder="选择日期时间"
              default-time="12:00:00"
            ></el-date-picker>
          </el-form-item>
        </div>
      </div>
      <div class="remark">
        <el-form-item label="说明" prop="Description">
          <el-input v-model="explain" placeholder="请输入"></el-input>
        </el-form-item>
      </div>
      <div class="remark">
        <el-form-item label="备注" prop="Remark">
          <el-select
            v-model="ruleForm.Remark"
            placeholder="请选择"
            filterable
            :automatic-dropdown="true"
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
      </div>
      <slot :submitForm="submitForm"></slot>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { GetFormatDateTime } from "@/utils/public";
import { nurseKey, doctorKey } from "../../../module/staticData";
export default {
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() <
            +new Date(GetFormatDateTime("yyyy/MM/dd", new Date()) + " 00:00:00")
          );
          // return time.getTime() <= Date.now();
        }
      },
      planData: [], //拟施数据
      diagnosticsOption: [
        { Text: "感冒", Value: "1" },
        { Text: "发烧", Value: "2" }
      ], //诊断数据
      options: [
        {
          key: "未知",
          Value: "未知"
        },
        {
          key: "阴性",
          Value: "阴性"
        },
        {
          key: "阳性",
          Value: "阳性"
        }
      ], //病毒下拉框的数据
      foreignMatter: [
        {
          Key: "有",
          Value: "有"
        },
        {
          Key: "无",
          Value: "无"
        }
      ], //异物字典量
      mdrOptions: [
        {
          Key: "未报告",
          Value: "未报告"
        },
        {
          Key: "是",
          Value: "是"
        },
        {
          Key: "否",
          Value: "否"
        }
      ], //多重耐药菌字典量

      rules: {
        DiagnosisName: [
          { required: true, message: "手前诊断不能为空", trigger: "change" }
        ],
        OperationName: [
          { required: true, message: "请选择手术名称", trigger: "change" }
        ],
        OperationType: [
          { required: true, message: "请选择手术类型", trigger: "change" }
        ],
        OperationRoom: [
          { required: true, message: "请选择手术室", trigger: "change" }
        ],
        OperationHumanBody: [
          { required: true, message: "请选择手术部位", trigger: "change" }
        ],
        OperationCountNo: [
          { required: true, message: "请选择手术台次", trigger: "change" }
        ],
        ExpectOperationTime: [
          { required: true, message: "请选择手术时间", trigger: "change" }
        ],
        OperationHumanPosition: [
          { required: true, message: "请选择手术体位", trigger: "change" }
        ],
        BloodTypeCode: [
          { required: true, message: "请选择血型", trigger: "change" }
        ],
        RH: [{ required: true, message: "请选择RH", trigger: "change" }],
        MianDoctorId: [
          { required: true, message: "请选择主刀医生", trigger: "change" }
        ],
        AnesthesiaType: [
          { required: true, message: "请选择麻醉方式", trigger: "change" }
        ],
        HBV: [{ required: true, message: "请选择乙肝", trigger: "change" }],
        HCV: [{ required: true, message: "请选择丙肝", trigger: "change" }],
        RPR: [{ required: true, message: "请选择梅毒", trigger: "change" }],
        HIV: [{ required: true, message: "请选择艾滋", trigger: "change" }],
        ApplyTime: [
          { required: true, message: "请选申请时间", trigger: "change" }
        ]
      },
      rulesNull: {},
      dictData: {
        BloodTypeModel: [], //血型
        OperationAnesthesia: [], //麻醉方式
        OperationHumanBody: [], //手术部位
        OperationHumanPosition: [], //体位
        OperationIncisionLevel: [], //切口等级
        OperationLevel: [], //手术等级
        OperationRoom: [], //手术室
        OperationType: [] //手术类型
      }, //其他字典量
      defaultDoctorList: [], //默认医生的数据
      doctorList: [], //医生的列表
      defaultNurseList: [], //默认护士的列表
      nurseList: [], //巡回护士/机械护士列表
      loading: false, //搜索loading
      ruleForm: {
        Id: "00000000-0000-0000-0000-000000000000",
        InHospitalId: "",
        DiagnosisAreaType: "",
        DiagnosisName: "",
        DiagnosisCode: "",
        OperationName: "",
        OperationCode: "",
        OperationLevel: "",
        OperationType: "",
        OperationRoom: "",
        OperationHumanBody: "",
        ExpectOperationTime: GetFormatDateTime(),
        OperationCountNo: "",
        OperationHumanPosition: "",
        IncisionLevel: "",
        IsBloodPreparation: true,
        BloodTypeName: "",
        BloodTypeCode: "",
        RH: "阴性",
        MianDoctorId: "",
        FirstAssistantId: null,
        SecondAssistantId: null,
        AnesthesiaDoctorId: null,
        AnesthesiaAssistantId: null,
        AnesthesiaType: "",
        AnesthesiaTime: null,
        CircuitNurseId: null,
        InstrumentNurseId: null,
        ForeignBodyImplants: "",
        InstructDoctorId: null,
        MDRO: "",
        HBV: "阴性",
        HCV: "阴性",
        HIV: "阴性",
        RPR: "阴性",
        Remark: "",
        Description: "",
        ApplyTime: "",
        IsAdditional: false
      },
      diagnoseList:[],//全部诊断

    };
  },
  props: {
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
    isBorder:{
      type:Boolean,
      default:true
    }
  },
  computed: {
    ...mapGetters({
      patientMsg: "public/GET_PATIENTMSG",
      selectArea: "home/GET_SELECTAREA" //所在区域
    }),
    //备注选项
    remarkOptions: function(value) {
      return this.$store.getters["public/getDic"]("OperationRemark").filter(
        el => el.Value !== -1
      );
    },
    explain: {
      // getter
      get: function() {
        let anesthesiaName = "###";
        this.dictData.OperationAnesthesia.forEach(item => {
          if (item.Value === this.ruleForm.AnesthesiaType) {
            anesthesiaName = item.Key;
          }
        });
        let time =GetFormatDateTime(
          "yyyy-MM-dd HH:mm",
          new Date(this.ruleForm.ExpectOperationTime)
        )
        this.ruleForm.Description = `拟于${time}在${anesthesiaName}方式下行${
          this.ruleForm.OperationName ? this.ruleForm.OperationName : "###"
        }手术`;
        return this.ruleForm.Description;
      },
      // setter
      set: function(newValue) {
        this.ruleForm.Description = newValue;
      }
    }
  },
  watch: {
    commonObj: {
      handler: function(val, oldVal) {
        for (const key in val) {
          this.ruleForm[key] = val[key];
        }
        this.isFirst1 = true;
        this.isFirst2 = true;
        this.getNurseList("", 1);
        this.getDoctorUser("", 1);
        // this.getKeyName(2);
        // this.getKeyName(1);
      },
      immediate: true,
      deep: true
    },
    patientMsg: {
      handler(val) {
        if (this.isVerification&&val.Diagnosis&&!this.isChange) {
          this.ruleForm.DiagnosisName = val.Diagnosis?val.Diagnosis.split(';')[0]:'';
          this.ruleForm.DiagnosisCode = val.DiagnosisCode?val.DiagnosisCode.split(';')[0]:'';
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.getOldSubmit()
    this.ruleForm.DiagnosisAreaType = this.selectArea.DiagnosisAreaType;
    this.nowTime = this.ruleForm.ApplyTime = this.ruleForm.ApplyTime
      ? this.ruleForm.ApplyTime
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
    //获取拟定手术的字典量
    this.$Api.getOperationD({}).then(res => {
      console.log(res);
      if (res.Status) {
        this.planData = res.Data;
      }
    });
    //其他字典量
    this.$Api.getOperationOtherD({}).then(res => {
      if (res.Status) {
        this.dictData = res.Data;
        console.log(res.Data);
      }
    });

    // this.getNurseList("", 1);
    // this.getDoctorUser("", 1);
  },
  methods: {
    getKeyName(type) {
      this["isFirst" + type] = false;
      // type=1,医生，2是护士
      let keyArr = type === 1 ? doctorKey : nurseKey;
      let arr = [];
      console.log(
        this[type === 1 ? "defaultDoctorList" : "defaultNurseList"],
        "keyArr"
      );
      keyArr.forEach(el => {
        if (this.ruleForm[el] && !arr.includes(this.ruleForm[el])) {
          arr.push(this.ruleForm[el]);
        }
      });
      this[type === 1 ? "doctorList" : "nurseList"] = [
        ...this[type === 1 ? "defaultDoctorList" : "defaultNurseList"]
      ];
      arr.forEach(item => {
        let off = true;
        this[type === 1 ? "defaultDoctorList" : "defaultNurseList"].forEach(
          el => {
            if (item === el.Id) {
              off = false;
            }
          }
        );

        off && this[type === 1 ? "getDoctorUser" : "getNurseList"](item, 2);
      });
      console.log(arr, "arr");
    },
    getDoctorUser(val, type) {
      //医生字典量
      val = val ? { content: val } : {};
      this.loading = true;
      this.$Api.getDoctorUser(val).then(res => {
        this.loading = false;
        if (res.Status) {
          if (type === 1) {
            this.defaultDoctorList = res.Data || [];
            this.isFirst1 && this.getKeyName(1);
          } else if (type === 2) {
            this.defaultDoctorList.push(...res.Data);
            this.doctorList = this.defaultDoctorList;
            // this.defaultDoctorList.push(res.Data)
          } else {
            this.doctorList = res.Data || [];
          }
        }
      });
    },
    //获取护士成员列表
    getNurseList(val, type) {
      val = val ? { content: val } : {};
      this.loading = true;
      this.$Api.getNurseList(val).then(res => {
        this.loading = false;

        console.log(res);
        if (res.Status) {
          if (type === 1) {
            this.isFirst2 && this.getKeyName(2);

            this.defaultNurseList = res.Data || [];
          } else if (type === 2) {
            this.defaultNurseList.push(...res.Data);
            this.nurseList = this.defaultDoctorList;
          } else {
            this.nurseList = res.Data || [];
          }
        }
      });
    },
    //拟施手术的code绑定
    selectOperationName(val) {
      console.log(val);
      for (var i = 0; i < this.planData.length; i++) {
        if (this.planData[i].Key === val) {
          this.ruleForm.OperationCode = this.planData[i].Value;
        }
      }
    },
    //下拉搜素拟施瘦素名称
    remoteplanList(val) {
      this.$Api.getOperationD({ content: val }).then(res => {
        console.log(res);
        if (res.Status) {
          this.planData = res.Data;
        }
      });
    },
    //医生下拉搜索
    selectDoct(query) {
      // console.log(val);
      query = query && query.replace(/\s+/g, "");
      if (query) {
        this.getDoctorUser(query);
      } else {
        this.doctorList = this.defaultNurseList;
      }
    },
    //护士下拉搜素
    selectNurse(query) {
      query = query && query.replace(/\s+/g, "");
      if (query) {
        this.getNurseList(query);
      } else {
        this.nurseList = this.defaultNurseList;
      }
    },
    //血液类型的下拉框
    selectBloodType(val) {
      console.log(val);
      for (var i = 0; i < this.dictData.BloodTypeModel.length; i++) {
        if (this.dictData.BloodTypeModel[i].Value === val) {
          this.ruleForm.BloodTypeName = this.dictData.BloodTypeModel[i].Key;
        }
      }
      console.log(this.ruleForm);
    },
    submitForm() {
      return new Promise((resolve, reject) => {
        this.$refs.newOperation.validate((valid, obj) => {
          console.log(valid);
          if (valid) {
            this.diagnoseList.forEach(el=>{
              if(el.DiagnosisName===this.ruleForm.DiagnosisName){
                this.ruleForm.DiagnosisCode=el.DiagnosisCode
              }
            })
            let doctorOrderMain = { ...this.ruleForm };
            doctorOrderMain.InHospitalId =
              this.$route.query.id || "00000000-0000-0000-0000-000000000000";
            doctorOrderMain.OperationCountNo =
              doctorOrderMain.OperationCountNo || 0;
            // this.commonData.OrderType =this.tableData[0]
            resolve(doctorOrderMain);
          } else {
            resolve(false);
            console.log("error submit!!");
          }
        });
      });
    },
    //判断申请时间的
    changeTime(el) {
      if (+new Date(el) < +new Date(this.patientMsg.InHospTime)) {
        this.$msg.info("开始时间不允许早于患者入科时间！");
        this.ruleForm.ApplyTime = GetFormatDateTime(
          "yyyy/MM/dd HH:mm",
          new Date(this.patientMsg.InHospTime)
        );
      }
      //  是否是补录医嘱
      this.ruleForm.IsAdditional =
        parseInt(+new Date(el) / 60000) <
        parseInt(+new Date(this.nowTime) / 60000);
    },
            // 获取诊断数据
        getOldSubmit() {
        this.$route.query.id&& this.$Api
        .getHistoryDiagnoseList({ inHouseId: this.$route.query.id })
        .then(res => {
            this.diagnoseList = res.Data||[];
            console.log(this.diagnoseList,'this.diagnoseList');
        });
    },
  }
};
</script>
<style lang="less" scoped>
.new-operation {
  height: 100%;
  padding-top: 10px;
  font-size: 14px;
  box-sizing: border-box;
  .demo-ruleForm{
    border: 1px solid #0071e7;
    margin-top: 20px;
    -webkit-box-shadow: 0 1px 4px 2px rgba(165, 189, 247, 0.8);
    box-shadow: 0 1px 4px 2px rgba(165, 189, 247, 0.8);
    padding: 10px 10px 0 10px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 100%;
  }
  .content {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .item {
      width: 400px;
      /deep/ .el-input__inner {
        width: 270px;
        background: #f3f5f9;
        border-radius: 2px;
        border: none;
      }
      /deep/ .el-form-item__label {
        color: #000622;
        opacity: 0.6;
      }
      /deep/ .el-radio {
        width: 56px;
        border-radius: 2px;
      }
      /deep/ .el-radio__input {
        display: none;
      }
      /deep/ .el-date-editor {
        width: 270px;
      }
    }
    .bloodTypeName {
      display: flex;
      .el-select {
        width: 100px;
      }
      /deep/.el-input__inner {
        width: 100px;
        background: #f3f5f9;
        border-radius: 2px;
        border: none;
      }
      .rh {
        /deep/.el-form-item__label {
          width: 50px !important;
        }
        /deep/ .el-form-item__content {
          margin-left: 50px !important;
        }
      }
    }
  }
  .remark {
    .el-input,
    .el-select {
      width: 98%;
    }
    /deep/ .el-input__inner {
      background: #f3f5f9;
      border-radius: 2px;
      border: none;
    }
    /deep/ .el-form-item__label {
      color: #000622;
      opacity: 0.6;
    }
  }
  .content:after {
    content: "";
    display: block;
    width: 400px;
    height: 0px;
  }
}
</style>