<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="130px"
    class="doctor-advice-form demo-ruleForm"
    :class="{'borderStyle':isBorder}"
  >
    <el-form-item label="会诊类别" prop="TypeCode" class="all">
      <el-select v-model="ruleForm.TypeCode" placeholder="请选择" @change="selectConType" automatic-dropdown>
        <el-option v-for="item in typeData" :key="item.key" :label="item.Value" :value="item.Key"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="会诊项目" prop="DictItemCode" class="all">
      <el-select v-model="ruleForm.DictItemCode" placeholder="请选择" @change="selectConFee" automatic-dropdown>
        <el-option
          v-for="item in itemFeeList"
          :key="item.Id"
          :label="item.ItemName"
          :value="item.ItemCode"
        >
          <span style="float: left">{{ item.ItemName }}</span>
          <span
            style="float: right; color: #8492a6; font-size: 13px"
          >{{(+item.Price).toFixed(2)}}/{{item.Unit}}</span>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="拟邀会诊医疗机构" prop="HospitalCode" v-if="ruleForm.TypeCode==3" class="all">
      <el-select v-model="ruleForm.HospitalCode" placeholder="请选择" automatic-dropdown>
        <el-option
          v-for="item in allHospital"
          :key="item.Key"
          :label="item.Value"
          :value="item.Key"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="拟邀科室" prop="ConsultationDetails" class="all">
      <el-select
        v-model="ruleForm.ConsultationDetails"
        multiple
        placeholder="请选择"
        filterable
        remote
        :remote-method="depRemoteMethod"
        @focus="depFocus"
        ref="department"
      >
        <el-option
          v-for="item in allDepartment"
          :key="item.Code"
          :label="item.Name"
          :value="item.Code"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="会诊目的" prop="Target" class="all">
      <el-select
        v-model="ruleForm.Target"
        filterable
        allow-create
        default-first-option
        @change="selectTarget"
        placeholder="请选择"
      >
        <el-option
          v-for="item in targetData"
          :key="item.Key"
          :label="item.Value"
          :value="item.Value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="会诊时间" prop="StartDate">
      <el-date-picker
        v-model="ruleForm.StartDate"
        :clearable="false"
        :picker-options="pickerOptions"
        @change="changeTime"
        type="datetime"
        format="yyyy-MM-dd HH:mm"
        value-format="yyyy-MM-dd HH:mm"
        placeholder="选择日期时间"
        default-time="12:00"
      ></el-date-picker>
    </el-form-item>
    <el-form-item label="会诊地点" prop="LocationCode">
      <el-select v-model="ruleForm.LocationCode" placeholder="请选择" automatic-dropdown>
        <el-option v-for="item in siteData" :key="item.Key" :label="item.Value" :value="item.Key"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="会诊费用" prop="Fee">
      <p>{{feeNow}}</p>
    </el-form-item>
    <el-form-item label="会诊联系人" prop="ContactName">
      <el-select
        v-model="ruleForm.ContactName"
        @change="getDoctor"
        @focus="focus"
        default-first-option
        filterable
        remote
        value-key="DoctorId"
        placeholder="请输入姓名"
        :remote-method="remoteMethod"
      >
        <el-option
          v-for="(item,index) in doctorList"
          :key="item.DoctorId"
          :label="item.DoctorName"
          :value="item"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="联系电话" prop="ContactPhone">
      <el-input placeholder="请输入联系电话" v-model="ruleForm.ContactPhone"></el-input>
    </el-form-item>
    <slot :submitForm="submitForm"></slot>
  </el-form>
</template>
<script>
import { mapGetters } from "vuex";
import { GetFormatDateTime, changeDateTimeFormat, type } from "@/utils/public";
import { getSession } from "../../../utils/storage";
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
      ruleForm: {
        InHouseId: "",
        TypeCode: "",
        Target: "",
        TargetCode: "",
        StartDate: "",
        LocationCode: "",
        HospitalCode: "",
        Fee: 0,
        ConsultationDetails: [],
        ContactName: "",
        ContactPhone: "",
        ContactId: "",
        DictItemCode: "",
        ConsultationId: "00000000-0000-0000-0000-000000000000"
      },
      rules: {
        DictItemCode: [
          { required: true, message: "请选择会诊项目", trigger: "change" }
        ],
        TypeCode: [
          { required: true, message: "请选择会诊类别", trigger: "change" }
        ],
        Target: [
          { required: true, message: "请选择会诊目的", trigger: "change" }
        ],
        StartDate: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        ConsultationDetails: [
          { required: true, message: "请选择拟邀科室", trigger: "change" }
        ],
        LocationCode: [
          { required: true, message: "请选择会诊地点", trigger: "change" }
        ],
        DictItemCode: [
          { required: true, message: "请选择会诊项目", trigger: "change" }
        ]
      },
      siteData: [], //会诊地点的字典量
      typeData: [], //会诊类型的字典量
      targetData: [], //会诊目标的字典量
      allHospital: [], //会诊医院的字典量
      allDepartment: [], //会诊科室的字典量
      nowTime: "", //现在的时间
      options: [],
      doctorList: [],
      itemFeeList: [] //会诊收费项目的列表
    };
  },
  created() {
    console.log("this.user", this.user);
    if (!this.isVerification) {
      this.rules = {
        ConsultationDetails: [
          { required: true, message: "请选择拟邀科室", trigger: "change" }
        ]
      };
    }
    //获取字典量的
    this.nowTime = this.ruleForm.StartDate = this.ruleForm.StartDate
      ? this.ruleForm.StartDate
      : GetFormatDateTime("yyyy/MM/dd HH:mm", new Date(+new Date() + 600000));
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
    this.getDictionaries();
    if (!this.ruleForm.ContactName || !this.ruleForm.ContactId) {
      this.ruleForm.ContactName = this.user.UserInfo.Name;
      this.ruleForm.ContactId = this.user.UserInfo.Id;
    }
    if (!this.ruleForm.ContactPhone) {
      this.ruleForm.ContactPhone = this.user.UserInfo.Telphone;
    }
    this.getFeeByTypeCodeList();
    this.depRemoteMethod()
    // this.$nextTick(() => {
    //   document
    //     .querySelector(".advice-list .el-input__inner")
    //     .addEventListener("keydown", this.keydown, false);
    //   this.$refs.department.toggleMenu = function(el) {
    //     // console.log(el,'uuu');
    //     if (el) return false;
    //     if (!this.selectDisabled) {
    //       if (this.menuVisibleOnFocus) {
    //         this.menuVisibleOnFocus = false;
    //       } else {
    //         this.visible = !this.visible;
    //       }
    //       if (this.visible) {
    //         (this.$refs.input || this.$refs.reference).focus();
    //       }
    //     }
    //   };
    // });
  },
  methods: {
    depFocus() {
      this.depRemoteMethod();
    },
    depRemoteMethod(keyword = null) {
      this.$Api.getConAllDepartment({ KeyWords: keyword==''?null: keyword}).then(res => {
        if (res.Status) {
          this.allDepartment = res.Data || [];
        }
      });
    },
    //项目类型的修改
    selectConFee(val) {
      this.itemFeeList.forEach(item => {
        if (item.ItemCode === val) {
          this.ruleForm.TypeCode = item.ConsultationTypeCode;
        }
      });
    },
    //获取项目的数据
    getFeeByTypeCodeList(code) {
      this.$Api.getFeeByTypeCodeList({ typeCode: code || null }).then(res => {
        if (res.Status) {
          this.itemFeeList = res.Data || [];
          if (code) {
            this.ruleForm.DictItemCode = this.itemFeeList[0]
              ? this.itemFeeList[0].ItemCode
              : "";
          }
          if (this.isAdvice && this.ruleForm.DictItemCode) {
            console.log("qqqqqqq");

            this.selectConFee(this.ruleForm.DictItemCode);
          }
        }
      });
    },
    submitForm() {
      return new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate((valid, obj) => {
          console.log(valid);
          if (valid) {
            let doctorOrderMain = { ...this.ruleForm };
            doctorOrderMain.InHouseId =
              this.$route.query.id || "00000000-0000-0000-0000-000000000000";
            // this.commonData.OrderType =this.tableData[0]
            resolve(doctorOrderMain);
          } else {
            resolve(false);
            console.log("error submit!!");
          }
        });
      });
    },
    resetForm(formName) {
      this.$refs.ruleForm.resetFields();
    },
    //获取字典量
    getDictionaries() {
      this.$Api.getConSite({ isJudgeEnable: true }).then(res => {
        if (res.Status) {
          this.siteData = res.Data || [];
          this.ruleForm.LocationCode = this.ruleForm.LocationCode
            ? this.ruleForm.LocationCode
            : this.siteData[0].Key;
        }
      });
      this.$Api.getConType({}).then(res => {
        if (res.Status) {
          console.log(res, "data");
          this.typeData = res.Data || [];
        }
      });
      this.$Api.getConTarget({}).then(res => {
        if (res.Status) {
          this.targetData = res.Data || [];
        }
      });
      // this.$Api.getConAllDepartment({}).then(res => {
      //   if (res.Status) {
      //     this.allDepartment = res.Data || [];
      //   }
      // });
      this.$Api.getConAllHospital().then(res => {
        if (res.Status) {
          this.allHospital = res.Data || [];
        }
      });
    },
    //判断申请时间的
    changeTime(el) {
      if (+new Date(el) < +new Date(this.patientMsg.InHospTime)) {
        this.$msg.info("开始时间不允许早于患者入科时间！");
        this.ruleForm.StartDate = GetFormatDateTime(
          "yyyy/MM/dd HH:mm",
          new Date(this.patientMsg.InHospTime)
        );
      }
      // //  是否是补录医嘱
      // this.ruleForm.IsAdditional =
      //   parseInt(+new Date(el) / 60000) <
      //   parseInt(+new Date(this.nowTime) / 60000);
    },
    //会诊目的选着框数据处理
    selectTarget(val) {
      if (val) {
        this.targetData.forEach(item => {
          if (item.Value == val) {
            this.ruleForm.TargetCode = item.Key;
          }
        });
      }
    },
    //下拉搜素医生
    remoteMethod(val) {
      console.log(val);
      this.getDoctorName(val);
    },
    getDoctor(val) {
      console.log("val", val);
      if (val) {
        this.ruleForm.ContactName = val.DoctorName;
        this.ruleForm.ContactId = val.DoctorId;
      }
      console.log(this.ruleForm);
    },
    focus() {
      this.getDoctorName("");
    },
    getDoctorName(val) {
      this.$Api
        .searchUser({
          InHouseId: this.$route.query.id,
          DoctorName: val
        })
        .then(res => {
          console.log("res", res);
          if (res.Status) {
            this.doctorList = res.Data || [];
          }
        });
    },
    //会诊类别
    selectConType(val) {
      this.ruleForm.DictItemCode = "";
      this.getFeeByTypeCodeList(val);
    }
  },
  watch: {
    commonObj: {
      handler: function(val, oldVal) {
        for (const key in val) {
          if (this.ruleForm.hasOwnProperty(key)) {
            this.ruleForm[key] = val[key];
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  props: {
    commonObj: {
      type: Object,
      default: () => {
        return {};
      }
    },
    isBorder: {
      type: Boolean,
      default: true
    },
    // 是否校验
    isVerification: {
      type: Boolean,
      default: true
    },
    isAdvice: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      user: "public/GET_USER",
      patientMsg: "public/GET_PATIENTMSG",
      selectArea: "home/GET_SELECTAREA" //所在区域
    }),
    feeNow() {
      let typeObj = this.itemFeeList.find(item => {
        if (item.ItemCode === this.ruleForm.DictItemCode) {
          return item;
        }
      });
      if (typeObj) {
        //按科室收费
        if (typeObj.BillingMethod == 1) {
          this.ruleForm.Fee = (
            this.ruleForm.ConsultationDetails.length * typeObj.Price
          ).toFixed(2);
          return (
            this.ruleForm.ConsultationDetails.length * typeObj.Price
          ).toFixed(2);
        } else {
          //按次数收费
          this.ruleForm.Fee = typeObj.Price.toFixed(2);
          return typeObj.Price.toFixed(2);
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
.demo-ruleForm {
  margin-top: 20px;
  /deep/ .el-input__inner {
    background: #f2f2f2;
    border: none;
    border-radius: 0;
  }
}
.borderStyle {
  border: 1px solid #0071e7;
  margin-top: 20px;
  -webkit-box-shadow: 0 1px 4px 2px rgba(165, 189, 247, 0.8);
  box-shadow: 0 1px 4px 2px rgba(165, 189, 247, 0.8);
  padding: 0 10px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
}
@import url("../openDoctorAdvice/adviceStyle.less");
</style>