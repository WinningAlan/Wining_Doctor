<template>
  <div class="testDoctorAdvice doctor-advice">
    <doctorAdviceTable
      :columns="columns"
      :tableData="tableData"
      :type="isCheckedCharge ? 'expand' : ''"
      :orderType="8"
      :row-style="{ cursor: 'pointer' }"
      :callback="callback"
    >
      <template slot="adviceName" slot-scope="{ scope }">
        <template v-if="!scope.row._edit">{{
          scope.row.DictItemName
        }}</template>
        <slot
          name="change"
          :index="scope.row._index"
          :itemName="scope.row.DictItemName"
          :departmentCode="departmentCode"
          :categoryNo="categoryNo"
          v-else
        />
      </template>
      <template slot="SampleCode" slot-scope="{ scope }">
        <el-select
          v-model="scope.row.SampleCode"
          placeholder="请选择"
          @change="changeSample(scope.row, $event)"
        >
          <el-option
            v-for="(item, index) in scope.row.specimenOptions"
            :key="item"
            :label="item"
            :value="index"
            >{{ item }}</el-option
          >
        </el-select>
      </template>
      <template slot="Price" slot-scope="{ scope }">{{
        scope.row.CheckedList
          | priceFilter(scope.row.ChargeItems, scope.row.Price)
      }}</template>
      <template slot="InsuranceUseFlag" slot-scope="{ scope }">
        <el-checkbox v-model="scope.row.InsuranceUseFlag"></el-checkbox>
      </template>
    </doctorAdviceTable>
    <slot
      name="search"
      :departmentCode="departmentCode"
      :categoryNo="categoryNo"
    />

    <h2>共性编辑</h2>
    <el-form
      :model="commonData"
      :rules="isVerification ? rules : rulesNull"
      ref="inspectDoctorAdvice"
      label-position="right"
      label-width="80px"
      class="doctor-advice-form"
    >
      <el-form-item label="检验科室" prop="ExcuteDepartment">
        <el-select
          v-model="commonData.ExcuteDepartment"
          placeholder="请选择"
          automatic-dropdown
          @change="selectRequestId"
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
          type="datetime"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
          placeholder="选择日期时间"
          default-time="12:00:00"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="其他">
        <el-checkbox v-model="commonData.IsEmergency">加急</el-checkbox>
        <el-checkbox v-model="commonData.IsOtherTest">外院送检</el-checkbox>
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
            >{{ item.Text }}</el-option
          >
        </el-select>
      </el-form-item>
    </el-form>
    <slot :submitForm="submitForm" />
  </div>
</template>

<script>
import { testDoctorAdviceColumns } from "../../../module/tableColumns";
// import { testDoctorAdviceData } from "../../../module/tableData";
import doctorAdviceTable from "./doctorAdviceTable.vue";
import { GetFormatDateTime, severalGroups } from "@/utils/public";
import { mapGetters } from "vuex";
export default {
  name: "testDoctorAdvice", //检验医嘱控件
  components: {
    doctorAdviceTable,
  },
  props: {
    tableData: {
      type: Array,
      required: true,
      default: () => {
        return [];
      },
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
    //删除一个回调函数
    callback: {
      type: Function,
      default: () => {},
    },
    editIndex: {
      type: Number,
      default: 0,
    },
  },
  filters: {
    priceFilter(checkArr, arr, price) {
      let num = 0;
      arr = arr || [];
      console.log(checkArr, "checkArrs");
      checkArr.forEach((item) => {
        arr.forEach((el) => {
          if (item === el.ChargeItemCode) {
            num += el.Price * el.Count;
          }
        });
      });
      if (!arr.length) num = price;
      return (+num).toFixed(2);
    },
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
      rules: {
        ApplyTime: [
          { required: true, message: "请输入申请时间", trigger: "blur" },
        ],
        ExcuteDepartment: [
          { required: true, message: "请选择科室", trigger: "change" },
        ],
      },
      rulesNull: {},
      columns: testDoctorAdviceColumns,
      // tableData: testDoctorAdviceData,
      commonData: {
        DiagnosisAreaType: "", //诊疗区大区
        OrderType: 8, //医嘱类别
        IsAdditional: false, //是否补录医嘱
        EffectiveTime: 1, //长/临
        ExcuteDepartment: "", //检验科室
        IsEmergency: "", //加急
        IsOtherTest: false, //外院送检
        Remark: "", //备注
        ApplyTime: "", //申请时间
      }, //公共数据
      // departmentOptions: [
      // ], //科室的选项

      specimenOptions: [], //标本选项
      tableLength: 0,
    };
  },
  created() {
    this.getDictData();
    this.commonData.DiagnosisAreaType = this.selectArea.DiagnosisAreaType;
    this.nowTime = this.commonData.ApplyTime = this.commonData.ApplyTime
      ? this.commonData.ApplyTime
      : GetFormatDateTime();

    // this.nowTime = this.commonData.ApplyTime = GetFormatDateTime();
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
  },
  computed: {
    ...mapGetters({
      departmentOptions: "public/GET_ALLDEP", //执行科室
      isCheckedCharge: "configuration/GET_ISCHECKEDCHARGE", //收费小项目是否可选
      patientMsg: "public/GET_PATIENTMSG",
      selectArea: "home/GET_SELECTAREA", //所在区域
    }),
    //备注选项
    remarkOptions: function (value) {
      return this.$store.getters["public/getDic"]("TestRemark").filter(
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
      console.log(this.tableData, arrDep, "this.tableData", this.patientMsg);
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
    // tableData: {
    //   handler(val, oldValue = []) {
    //     console.log(val, oldValue, "CategoryNoCategoryNoCategoryNo");
    //     if (val.length > oldValue.length) {
    //       // console.log("dskfdsh", val.length != oldValue.length);
    //       this.getSampleSetList();
    //     }
    //   },
    //   immediate: true,
    //   deep: true
    // },
    editIndex: {
      handler(val) {
        console.log(val, "tablelllllllll");
        this.getSampleSetList();
      },
      immediate: true,
    },
  },
  methods: {
    //获取单个的标本配置
    getSampleSetList() {
      let data = [];
      this.tableData.forEach((item, index) => {
        data.push({
          t: Math.random(),
          Code: item.DictItemCode,
          CategoryNo: item.ParentCategoryCode,
        });
      });
      this.$Api.getSampleSetList(data).then((res) => {
        if (res.Status) {
          let data = res.Data || {};
          this.tableData.forEach((item) => {
            this.$set(item, "specimenOptions", data[item.DictItemCode] || []);
            // item['specimenOptions'] = data[item.DictItemCode]
          });
        }
      });
    },
    changeSample(row, el) {
      this.specimenOptions.forEach((item) => {
        if (item.SampleCode === el) {
          row.SampleName = item.Name;
        }
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
      console.log(+new Date(el), "time", this.patientMsg.InHospTime);
      console.log(
        parseInt(+new Date(el) / 60000),
        parseInt(+new Date(this.nowTime) / 60000)
      );
    },
    getDictData() {
      // this.$Api.getEmergencyDepment().then(res => {
      //   this.departmentOptions = res.Data || [];
      // });
      this.$Api.getTestSampleList({ t: new Date().getTime() }).then((res) => {
        console.log("wqwwww", res);
        this.specimenOptions = res.Data || [];
      });
    },
    // 医嘱提交前验证
    submitForm() {
      return new Promise((resolve, reject) => {
        this.$refs.inspectDoctorAdvice.validate((valid, obj) => {
          console.log(obj);
          if (valid) {
            if (!this.tableData.filter((el) => !el.IsDeleted).length) {
              this.$msg.info("当前没有医嘱项目，请添加后再保存！");
              resolve(false);
            }
            let doctorOrderMain = { ...this.commonData };
            let orderId = doctorOrderMain.OrderId;
            delete doctorOrderMain.OrderId;
            this.tableData.filter((item) => {
              // if (item.CheckedList.length<item.ChildList.length) {
              // item.ChildItems=item.ChargeItems
              if (!item.ChildItems) {
                item.ChildItems = [];
              }
              item.ChildItems.forEach((el) => {
                //  el.Id=item.Id?item.Id:null;
                let off = true;
                item.CheckedList.forEach((a) => {
                  if (el.DictItemCode === a) {
                    off = false;
                  }
                });
                el.IsDeleted = off;
              });
              // }
              // else{
              // item.ChildItems=[]
              // }
              return true;
            });
            doctorOrderMain.InHouseId = this.$route.query.id;
            // this.commonData.OrderType =this.tableData[0]
            let obj = {};
            this.tableData.forEach((el) => {
              if (el.SampleCode && el.CustomizeTestApplyRule) {
                if (obj[el.SampleCode + el.CustomizeTestApplyRule]) {
                  obj[el.SampleCode + el.CustomizeTestApplyRule].push(el);
                } else {
                  obj[el.SampleCode + el.CustomizeTestApplyRule] = [el];
                }
              } else if (el.SampleCode && !el.CustomizeTestApplyRule) {
                if (obj[el.SampleCode]) {
                  obj[el.SampleCode].push(el);
                } else {
                  obj[el.SampleCode] = [el];
                }
              } else if (!el.SampleCode && el.CustomizeTestApplyRule) {
                if (obj[el.CustomizeTestApplyRule]) {
                  obj[el.CustomizeTestApplyRule].push(el);
                } else {
                  obj[el.CustomizeTestApplyRule] = [el];
                }
              } else {
                if (obj.all) {
                  obj.all.push(el);
                } else {
                  obj.all = [el];
                }
              }
            });
            let arr = [];

            console.log(obj, "11111obj");
            for (const key in obj) {
              arr.push({
                TestApplyMainModel: { ...doctorOrderMain },
                TestApplyDetailsModel: obj[key],
              });
            }
            if (orderId) {
              arr[0].TestApplyMainModel.OrderId = orderId;
            }
            console.log(arr, "dada");
            resolve(arr);
          } else {
            resolve(false);
            console.log("error submit!!");
          }
        });
      });
    },
    selectRequestId(val) {
      this.$emit("changrequestId", val);
    },
  },
};
</script>
<style lang='less'>
@import url("./adviceStyle.less");
// .testDoctorAdvice {
//   cursor: pointer;
// }
</style>
