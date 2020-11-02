<template>
  <div class="childPageContent">
    <slot name="close"></slot>
    <div class="orderPackageParams">
      <el-form
        :model="orderPackageParams"
        :rules="rules"
        ref="editOrderPackage"
        label-width="60px"
        :disabled="!showEdit"
      >
        <el-form-item label="名称" prop="PackageName">
          <el-input v-model="orderPackageParams.PackageName"></el-input>
        </el-form-item>
        <el-form-item label="范围" prop="PackageRangeCode">
          <el-radio
            v-model="rangeRadio"
            :label="(item.Value)"
            v-for="(item,index) in orderPackageRange"
            :key="index"
            v-show="!(item.Value==2&&userRightList.IsHasDeptRight==false)"
          >{{item.Text}}</el-radio>
        </el-form-item>
        <el-form-item label="类别" prop="PackageCategoryCode">
          <el-select v-model="orderPackageParams.PackageCategoryCode" placeholder="请选择">
            <el-option
              v-for="(item,index) in orderPackageType"
              :key="index"
              :label="item.Text"
              :value="item.Value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="advice-content">
      <div>
        <doctor-advice-list
          :tableData="orderPackageData"
          :isDrop="true"
          class="drop"
          ref="drops"
          v-bind.sync="filters"
          :show-header="true"
          :isPackage="true"
          :isSelection="false"
          @row-click="editAdvice"
          :showEdit="showEdit"
        >
          <component
            :is="componentsName[tableRowData.OrderType]"
            :editIndex="editIndex"
            slot-scope="{scope}"
            ref="doctorAdvice"
            v-if="scope.row._isEdit"
            slot="expand"
            :isChange="true"
            :tableData="newAdviceList"
            :commonObj="commonObj"
            :isVerification="false"
          >
            <searchDoctorAdvice
              slot="change"
              slot-scope="{index,itemName,departmentCode,categoryNo}"
              :departmentCode="departmentCode"
              :categoryNo="categoryNo"
              :adviceName="tableRowData.OrderType"
              :index="index"
              :itemName="itemName"
              :callBack="add"
            ></searchDoctorAdvice>
            <searchDoctorAdvice
              slot="search"
              :adviceName="tableRowData.OrderType"
              slot-scope="{departmentCode,categoryNo}"
              :categoryNo="categoryNo"
              :departmentCode="departmentCode"
              :callBack="add"
            ></searchDoctorAdvice>
            <p class="advice-button" slot-scope="{submitForm}">
              <el-button type="primary" @click="save(submitForm)">确认</el-button>
              <el-button type="primary" plain @click="cancel('change')">取消</el-button>
            </p>
          </component>
        </doctor-advice-list>
      </div>
      <template v-if="showEdit&&!isEdit">
        <h2>新增医嘱</h2>
        <searchDoctorAdvice
          v-if="isAdd"
          :adviceName.sync="adviceBigName"
          :callBack="add"
          :isShow="true"
        ></searchDoctorAdvice>
      </template>
      <component
       :editIndex="editIndex"
        :is="componentsName[adviceName]"
        v-if="!isAdd"
        ref="addComponent"
        :tableData="newAdviceList"
        :commonObj="commonObj"
        :isAdvice="isConAdvice"
        :isVerification="false"
      >
        <searchDoctorAdvice
          slot="change"
          slot-scope="{index,itemName,departmentCode,categoryNo}"
          :adviceName.sync="adviceName"
          :index="index"
          :departmentCode="departmentCode"
          :categoryNo="categoryNo"
          :itemName="itemName"
          :callBack="add"
        ></searchDoctorAdvice>
        <searchDoctorAdvice
          slot-scope="{departmentCode,categoryNo}"
          :departmentCode="departmentCode"
          slot="search"
          :categoryNo="categoryNo"
          :adviceName.sync="adviceName"
          :callBack="add"
        ></searchDoctorAdvice>
        <p class="advice-button" slot-scope="{submitForm}">
          <el-button type="primary" @click="save(submitForm)">确认</el-button>
          <el-button type="primary" plain @click="cancel('add')">取消</el-button>
        </p>
      </component>
    </div>
    <slot name="btn" :checkForm="checkForm"></slot>
  </div>
</template>
<script>
import testDoctorAdvice from "../../components/doctorAdvice/openDoctorAdvice/testDoctorAdvice.vue";
import inspectDoctorAdvice from "../../components/doctorAdvice/openDoctorAdvice/inspectDoctorAdvice.vue";
import treatDoctorAdvice from "../../components/doctorAdvice/openDoctorAdvice/treatDoctorAdvice.vue";
import drugDoctorAdvice from "../../components/doctorAdvice/openDoctorAdvice/drugDoctorAdvice.vue";
import bloodDoctorAdvice from "../../components/doctorAdvice/openDoctorAdvice/bloodDoctorAdvice.vue";

import searchDoctorAdvice from "@/components/doctorAdvice/openDoctorAdvice/searchDoctorAdvice";
import doctorAdviceList from "@/components/doctorAdvice/openDoctorAdvice/doctorAdviceList";
import nurseDoctorAdvice from "@/components/doctorAdvice/openDoctorAdvice/nurseDoctorAdvice.vue";
import wordDoctorAdvice from "@/components/doctorAdvice/openDoctorAdvice/wordDoctorAdvice.vue";
import mealsDoctorAdvice from "@/components/doctorAdvice/openDoctorAdvice/mealsDoctorAdvice.vue";
import newOperation from "../../components/doctorAdvice/operation/newOperation.vue";
import newConsultation from "../../components/doctorAdvice/consultation/newCreate";
import { componentsName, adviceId, nurseName } from "../../module/staticData";
import { mapGetters } from "vuex";
const cancelMsg = {
  add: "该操作将取消新增医嘱,是否继续",
  change: "该操作将取消修改医嘱,是否继续",
  delete: "该操作将取消所有待提交的医嘱,是否继续"
};
export default {
  props: {
    orderPackageParams: {
      type: Object,
      default: function() {
        return {};
      }
    },
    orderPackageAllData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    showEdit: {
      type: Boolean,
      default: true
    },
    getPackageDetail: Function, //获取最新的套餐信息
    saveOrEditPackage: Function, //获取套餐列表
    cancelPackage: Function, //套餐取消
    delOrderIds: Array //暂时删除的医嘱列表
  },
  components: {
    searchDoctorAdvice,
    doctorAdviceList,
    nurseDoctorAdvice,
    wordDoctorAdvice,
    mealsDoctorAdvice,
    testDoctorAdvice,
    inspectDoctorAdvice,
    treatDoctorAdvice,
    drugDoctorAdvice,
    bloodDoctorAdvice,
    newOperation,
    newConsultation
  },
  data() {
    this.saveOrUpdateApiName = {
      "14": "saveOrUpdateDrugAdvicePackage",
      "5": "saveOrUpdateNursingAdvicePackage",
      "122": "saveOrUpdateWordsAdvicePackage",
      "3": "saveOrUpdateMealAdvicePackage",
      "0": "saveOrUpdateTreatAdvicePackage",
      "2": "saveOrUpdateTreatAdvicePackage",
      "6": "saveOrUpdateTreatAdvicePackage",
      "11": "saveOrUpdateTreatAdvicePackage",
      "12": "saveOrUpdateTreatAdvicePackage",
      "13": "saveOrUpdateTreatAdvicePackage",
      "20": "saveOrUpdateTreatAdvicePackage",
      "7": "saveOrUpdateCheckAdvicePackage",
      "15": "saveOrUpdateOperationAdvicePackage",
      "4": "saveOrUpdateBloodAdvicePackage",
      "1": "saveOrUpdateClinicsAdvicePackage",
      "8": "saveOrUpdateTestAdvicePackage",
      "31": "saveOrUpdateConsultationPackage"
    };
    return {
      filters: {
        effectiveChecked: [1, 2] //表格长/临字段筛选条件
      },
      rangeRadio: "1",
      isEdit: false,
      componentsName: componentsName,
      nurseName: nurseName,
      adviceId: adviceId,
      commonObj: {},
      rules: {
        PackageName: {
          required: true,
          message: "请输入医嘱套餐名称",
          trigger: "blur"
        },
        PackageRangeCode: {
          required: true,
          message: "请输入范围",
          trigger: "blur"
        },
        PackageCategoryCode: {
          required: true,
          message: "请输入类别",
          trigger: "blur"
        }
      },
      isAdd: true,
      adviceName: -1,
      adviceBigName: -1, //左侧下拉框医嘱类别
      newAdviceList: [],
      specimenOptions: [],
      tableRowData: {},
      ApplicationFormName: "",
      isConAdvice: true,//判断是否是新增会诊医嘱
      editIndex:0
    };
  },
  watch: {
    rangeRadio: function(newValue, oldValue) {
      this.orderPackageParams.PackageRangeCode = newValue;
    }
  },
  created() {
    this.getTestSampleList();
    if (this.orderPackageParams.PackageRangeCode != undefined) {
      this.rangeRadio = this.orderPackageParams.PackageRangeCode + "";
    } else {
      this.rangeRadio = "1";
    }
    //this.rangeRadio = this.orderPackageParams.PackageRangeCode==undefined?+''
    console.log(this.orderPackageRange);
    this.getDictData();
  },
  methods: {
    //编辑信息
    // 修改医嘱
    editAdvice(row, event, column) {
      if (!this.showEdit) {
        return;
      }
      // this.tableRowData = row;
      if (!this.isEdit && this.isAdd) {
        console.log(row, event, "8unnn");
        this.toTop = event.clientY;
        if (row.OrderType === 14) {
          this.$Api
            .getPackageAdviceDetail({ orderId: row.OrderId })
            .then(res => {
              if (res.Status) {
                // this.adviceName=row.OrderType;
                this.$set(row, "_isEdit", true);
                this.isEdit = true;
                this.tableRowData = row;
                console.log(res.Data);
                this.$refs.drops.rowExpansion(row, true);
                this.commonObj = res.Data.doctorOrderMain;
                this.commonObj.DiagnosisAreaType = this.selectArea.DiagnosisAreaType||1;
                this.newAdviceList = res.Data.doctorOrderDetails.filter(
                  item => {
                    let obj = item.SingleMedicinalInfo;
                    for (const key in obj) {
                      // console.log(key,obj[key]);
                      if (key !== "IsSelfProvided") {
                        item[key] = obj[key];
                      }
                    }
                 item.Price=item.Price/item.DrugStoreFactor*item[item.DosageUnitCategory===1?"InhospitalFactor": "OutPatientFactor"]

                 item.doseOption = Array.from(
                new Set([obj.SpecificationUnit, obj.MinimumUnit])
                  );
                  item.step={}
                  item.step[obj.SpecificationUnit]=+obj.SpecificationFactor
                  item.step[obj.MinimumUnit]=obj.SpecificationUnit===obj.MinimumUnit?+obj.SpecificationFactor:1
                    delete item.SingleMedicinalInfo;
                    return true;
                  }
                );
              } else {
                this.$msg.warning(res.Message);
              }
            });
          // 护理医嘱，膳食医嘱,治疗医嘱
        } else if (
          row.OrderType === 5 ||
          row.OrderType === 3 ||
          row.OrderType === 0 ||
          row.OrderType === 1||
          row.OrderType === 20||
         row.OrderType === 2 ||
          row.OrderType === 11||
          row.OrderType === 6||
          row.OrderType === 12||
          row.OrderType === 13
        ) {
          let data = {};
          data.OrderId = row.OrderId;
          data.Id = row.OrderId;
          data.OrderContent = row.OrderContent;
          data.Price = row.OrderDetails[0].Price;
          data.ItemId = row.OrderDetails[0].Id;
          data.ItemType = row.OrderDetails[0].ItemType;
          // data.ItemType=row.OrderType
          data.DictItemCode = row.OrderDetails[0].DictItemCode;
          data.Frequency = row.FrequencyText;
          data.FrequencyCode = row.FrequencyCode;
          // 膳食医嘱，治疗医嘱
          if (
            row.OrderType === 3 ||
            row.OrderType === 0 ||
                     row.OrderType === 2 ||
          row.OrderType === 11||
          row.OrderType === 6||
            row.OrderType === 1||row.OrderType === 20||row.OrderType === 12||
          row.OrderType === 13
          ) {
            data.Count = row.OrderDetails[0].Count;
            data.Unit = row.OrderDetails[0].Unit;
          }
          this.newAdviceList.push(data);
          this.commonObj = {};
          this.commonObj.ExcuteDepartment =
            row.OrderDetails[0].ExcuteDepartment;
          this.commonObj.StartTime = row.StartTime;
          this.commonObj.Remark = row.Remark;
          this.commonObj.IsAdditional = row.IsAdditional;
          this.commonObj.EffectiveTime = row.EffectiveTime;
          this.commonObj.NewDepartmentList = [this.commonObj.ExcuteDepartment]
          // 治疗医嘱
          if (row.OrderType === 0 ||row.OrderType === 1||
          row.OrderType === 20||row.OrderType === 12||
                   row.OrderType === 2 ||
          row.OrderType === 11||
          row.OrderType === 6||
          row.OrderType === 13) {
            this.commonObj.IsEmergency = row.IsEmergency;
            this.commonObj.IsBed = row.IsBed;
          }
          data.IsDeleted = false;
          this.$set(row, "_isEdit", true);
          this.isEdit = true;
          this.tableRowData = row;
          this.$refs.drops.rowExpansion(row, true);
        } else if (row.OrderType === 122) {
          // 文字医嘱
          let data = {};
          data.OrderId = row.OrderId;
          data.WordsType = row.WordsType;
          data.Id = row.OrderId;
          data.OrderContent = row.OrderContent;
          data.Frequency = row.FrequencyText;
          data.FrequencyCode = row.FrequencyCode;
          this.newAdviceList.push(data);
          this.commonObj = {};
          this.commonObj.StartTime = row.StartTime;
          this.commonObj.Remark = row.Remark;
          this.commonObj.IsAdditional = row.IsAdditional;
          this.commonObj.EffectiveTime = row.EffectiveTime;
          data.IsDeleted = false;
          this.$set(row, "_isEdit", true);
          this.isEdit = true;
          this.tableRowData = row;
          this.$refs.drops.rowExpansion(row, true);
          // 手术医嘱
        } else if (row.OrderType === 15) {
          console.log(row);
          this.$Api
            .getPackageOperationFormData({ formId: row.FormId })
            .then(res => {
              if (res.Status) {
                this.commonObj = res.Data;
                this.$set(row, "_isEdit", true);
                this.isEdit = true;
                this.tableRowData = row;
                this.$refs.drops.rowExpansion(row, true);
              } else {
                this.$msg.warning(res.Message);
              }
            });
        } else if (row.OrderType === 7) {
          // 检查医嘱
          let arr = JSON.parse(JSON.stringify(row.OrderDetails));
          arr.forEach(el => {
            el.OrderId = el.ItemId;
            el.IsDeleted = false;
            // el["NewDepartmentList"] = el.Department.split(",");
          });
          row.CheckFormModel.Diagnosis =
            typeof row.CheckFormModel.Diagnosis === "string"
              ? row.CheckFormModel.Diagnosis.split(",")
              : row.CheckFormModel.Diagnosis;

          this.commonObj = row.CheckFormModel;
          this.commonObj.OrderId = row.OrderId;
          this.newAdviceList = arr;
          this.$set(row, "_isEdit", true);
          this.isEdit = true;
          this.tableRowData = row;
          this.$refs.drops.rowExpansion(row, true);
        } else if (row.OrderType === 8) {
          // 检验医嘱
          let arr = JSON.parse(JSON.stringify(row.OrderDetails));
          arr.forEach(el => {
            el.CheckedList = [];
            // el["NewDepartmentList"] = el.Department.split(",");
            if (el.ChildItems == null) {
              el.ChildItems = [];
            }
            el.ChildItems.forEach(a => {
              el.CheckedList.push(a.DictItemCode);
            });
            // el.IsDeleted=false
          });
          // row.CheckFormModel.Diagnosis= row.CheckFormModel.Diagnosis.split(',')
          this.commonObj = row.TestFormModel;
          this.commonObj.OrderId = row.OrderId;
          this.commonObj.FormId = row.FormId;

          this.newAdviceList = arr;
          this.$set(row, "_isEdit", true);
          this.isEdit = true;
          this.tableRowData = row;
          this.$refs.drops.rowExpansion(row, true);
        } else if (row.OrderType === 4) {
          // 用血
          console.log(row);
          this.$Api
            .getPackageBloodData({ BloodFormId: row.FormId })
            .then(res => {
              if (res.Status) {
                console.log(res, "res");
                this.commonObj = res.Data.DoctorBloodFormEntity;
                this.newAdviceList = res.Data.DoctorBloodFormDetailsList;
                //     this.commonObj=res.Data
                this.$set(row, "_isEdit", true);
                this.isEdit = true;
                this.tableRowData = row;
                this.$refs.drops.rowExpansion(row, true);
              } else {
                this.$msg.warning(res.Message);
              }
            });
        } else if (row.OrderType === 31) {
          this.$Api
            .gettPackageConsultationInfo({ ConsultationId: row.ConsultationId })
            .then(res => {
              if (res.Status) {
                console.log(res, "res");
                this.isConAdvice = false; //判断是否是新增会诊医嘱
                var arr = [];
                for (let i = 0; i < res.Data.ConsultationDetails.length; i++) {
                  arr.push(res.Data.ConsultationDetails[i].DepartmentCode);
                }
                res.Data.ConsultationDetails = arr;
                this.commonObj = res.Data;
                this.$set(row, "_isEdit", true);
                this.isEdit = true;
                console.log("row", row);
                this.tableRowData = row;
                this.$refs.drops.rowExpansion(row, true);
              } else {
                this.$msg.warning(res.Message);
              }
            });
        }
      }
    },
    // 新增医嘱
    add(item, index) {
      console.log(index, "编辑或新增");
      console.log(item);
      if (typeof item === "string") {
        item = {
          ItemName: item,
          WordsType: 99,
          ItemType: 122
        };
      }
      // 不允许重复医嘱项目
      this.adviceName = +item.ItemType;

      let off = true;
      let idName = item.ItemType !== 122 ? "HisMedId" : "WordsType";
      this.newAdviceList
        .filter(a => !a.IsDeleted)
        .forEach((el, i) => {
          console.log(
            el,
            el[this.adviceId[item.ItemType]],
            item[idName],
            "opkn"
          );
          if (el[this.adviceId[item.ItemType]] == item[idName] && i !== index) {
            off = false;
          }
        });
      if (!off) return this.$msg.info("该医嘱项目已存在！");
      console.log(item, index, "add");
      // 药品医嘱
      this.commonObj = {};
      if (item.ItemType === 14) {
        this.$Api
          .getDrugDetails({ hisMedicinalId: item.HisMedId })
          .then(res => {
            if (res.Status && res.Data) {
              let data = res.Data;
              data.Id = "00000000-0000-0000-0000-000000000000";
              data.MedicalInsuranceControlFlag=item.MedicalInsuranceControlFlag//医保限制标志
              data.Memo=item.Memo//医保限制标志
              data.ReimbursementType=item.ReimbursementType||0//医保审核标志 0为默认，1为医保，2为自费
              data.doseOption = Array.from(
                new Set([data.SpecificationUnit, data.MinimumUnit])
              );
              data.step={}
              data.step[data.SpecificationUnit]=+data.SpecificationFactor
              data.step[data.MinimumUnit]=data.SpecificationUnit===data.MinimumUnit?+data.SpecificationFactor:1
              data.MedicinalUsageList = data.MedicinalUsageList || [];
              // data.numberOption = Array.from(
              //   new Set([data.OutPatientUnit, data.MinimumUnit])
              // );
              // 是否含有静滴用法
              let hasJd = true;
              data.MedicinalUsageList.forEach(el => {
                if (el.Text === "静滴") {
                  data.UsageText = el.Text;
                  data.UsageCode = el.Value;
                  hasJd = false;
                }
              });
              if (hasJd && data.MedicinalUsageList.length) {
                data.UsageText = data.MedicinalUsageList[0].Text;
                data.UsageCode = data.MedicinalUsageList[0].Value;
              }
              data.Dose = data.SpecificationFactor;
              data.Unit = data.SpecificationUnit;
              console.log(data.Unit, "药品医嘱单位unit");
              data.Dosage = 1;
              data.FirstDayDosageNum = 1;

              // 门诊单位或住院单位
              data.DosageUnit = data.OutPatientUnit;
              data.DosageUnitCategory = 2; //是门诊单位还是住院单位
              if (this.drupUnit === "1") {
                data.DosageUnit =
                  this.selectArea.DiagnosisAreaType === 3
                    ? data.OutPatientUnit
                    : data.InhospitalUnit;
                data.DosageUnitCategory =
                  this.selectArea.DiagnosisAreaType === 3 ? 2 : 1; //是门诊单位还是住院单位
              }
                      let n =
                data[
                  data.DosageUnitCategory === 1
                    ? "InhospitalFactor"
                    : "OutPatientFactor"
                ] || 1;
              data.Price = (data.Price / data.DrugStoreFactor) * n;
              data.frequency = this.STObj; //默认频次

              data.IsSkinTest = !!data.SkinTestFlag; /// 是否皮试
              data.IsSelfProvided = false; //是否是自带药品
              data.IsAntimicrobial = data.SpecialCode === 9; //是否是抗菌药
              // data.
              let off = this.isAdd;
              // 医嘱新增
              if (index < 0) {
                this.newAdviceList.push(data);
                console.log(res.Data);
                this.isAdd = this.isEdit;
                if (this.newAdviceList.length === 1) {
                  this.commonObj = {
                    UsageCode: data.UsageCode, //用法代码
                    UsageText: data.UsageText, //用法文本
                    PharmacyNumber: data.PharmacyCode //药房
                  };
                }
                this.$refs.addComponent &&
                  this.$refs.addComponent.computeNum &&
                  this.$refs.addComponent.computeNum(data);
              } else {
                // 修改
                let obj = this.newAdviceList[index];
                for (const key in data) {
                  if (obj.hasOwnProperty(key)) {
                    obj[key] = data[key];
                  }
                }
                if (
                  index === 0 &&
                  this.newAdviceList.filter(item => !item.IsDeleted).length ===
                    1
                ) {
                  this.commonObj = {
                    UsageCode: obj.UsageCode, //用法代码
                    UsageText: obj.UsageText, //用法文本
                    PharmacyNumber: obj.PharmacyCode //药房
                    // MedicinalUsageList:obj.MedicinalUsageList,//用法字典
                  };
                } else {
                  this.commonObj = { t: +new Date() };
                }

                obj._edit = false;
              }
            } else {
              this.$msg.warning(res.Message);
            }
          });
        // 护理医嘱
      } else if (item.ItemType === 5) {
        // 不允许同时添加多个等级护理医嘱
        let off = true;
        this.newAdviceList
          .filter(item => !item.IsDeleted)
          .forEach((el, i) => {
            if (this.nurseName.includes(el.OrderContent) && i !== index) {
              off = false;
            }
          });
        if (!off && this.nurseName.includes(item.ItemName))
          return this.$msg.info("不允许同时添加多个等级护理医嘱");
        // 增加或修改
        let data = index < 0 ? {} : this.newAdviceList[index];
        data.OrderContent = item.ItemName;
        data.Price = item.Price;
        data.ItemType = item.OrderItemType;
        data.DictItemCode = item.HisMedId;
        data.Frequency = "QD";
        data.FrequencyCode = this.FrequencyCode;

        data.IsDeleted = false;
        data._edit = false;
        index < 0 && this.newAdviceList.push(data);
        this.commonObj.ExcuteDepartment = item.Department;
        this.isAdd = this.isEdit;
      } else if (item.ItemType === 122) {
        // 文字医嘱
        let data = index < 0 ? {} : this.newAdviceList[index];
        data.WordsType = item.WordsType;
        data.OrderContent = item.ItemName;
         data.Frequency = "QD";
        data.FrequencyCode = this.FrequencyCode;

        data.IsDeleted = false;
        data._edit = false;
        index < 0 && this.newAdviceList.push(data);
        this.isAdd = this.isEdit;
        // FrequencyCode
      } else if (
        item.ItemType === 3 ||
        item.ItemType === 0 ||
        item.ItemType === 1||
        item.ItemType === 2 ||
        item.ItemType === 11||
        item.ItemType === 6||
        item.ItemType === 12||
        item.ItemType === 13||
        item.ItemType === 20
      ) {
        // 膳食医嘱,治疗医嘱，手术项目
        let data = index < 0 ? {} : this.newAdviceList[index];
        data.DictItemCode = item.HisMedId;
        data.OrderContent = item.ItemName;
        data.Price = item.Price;
        data.ItemType = item.OrderItemType;
        data.Count = 1;
        data.Unit = item.DrugStoreUnit;
        // data.DoseUnit = item.DrugStoreUnit;
        // data.Dose = 1;
        // data.Frequency='QD'
        data.FrequencyCode = item.ItemType === 3 ? this.FrequencyCode : this.ST;
        data.IsDeleted = false;
        data._edit = false;
        index < 0 && this.newAdviceList.push(data);
        this.commonObj.ExcuteDepartment = item.Department;
        this.commonObj.NewDepartmentList=[]
        item.Department=item.Department||''
        this.commonObj.NewDepartmentList =item.Department?[...new Set(item.Department.split(","))]:[];
        this.commonObj.ExcuteDepartment = this.commonObj.NewDepartmentList[0]||'';
        this.isAdd = this.isEdit;
      } else if (item.ItemType === 7) {
        // 检查医嘱
        this.$Api
          .getParentCode({ code: item.CategoryNo, type: 7 })
          .then(list => {
            if (!this.newAdviceList.length) {
              this.ApplicationFormName = list.Data || "检查申请单";
            }
            let data = index < 0 ? {} : this.newAdviceList[index];
            data.DictItemCode = item.HisMedId;
            data.ItemType = item.OrderItemType;
            data.DictItemName = item.ItemName;
            data.Price = item.Price;
            data["NewDepartmentList"] =item.Department? [
              ...new Set(item.Department.split(","))
            ]:[];
            data["ParentCategoryCode"] = item.CategoryNo;
            data.IsDeleted = false;
            data._edit = false;
            index < 0 && this.newAdviceList.push(data);
            this.commonObj.ExcuteDepartment = "";
            this.isAdd = this.isEdit;
          });
      } else if (item.ItemType === 8) {
        // 检验医嘱

        this.$Api
          .getChargeItems({ ClinicItemCode: item.HisMedId })
          .then(res => {
            if (res.Status) {
              let arr = res.Data;
              this.$Api
                .getParentCode({ code: item.CategoryNo, type: 8 })
                .then(list => {
                  if (!this.newAdviceList.length) {
                    this.ApplicationFormName = list.Data || "检验申请单";
                  }
                  let data = index < 0 ? {} : this.newAdviceList[index];
                  
                  data.DictItemCode = item.HisMedId;
                  data.ChargeItems = arr;
                  data.CheckedList = [];
                  data.ChildItems = [];
                  data["NewDepartmentList"] =item.Department? [
                    ...new Set(item.Department.split(","))
                  ]:[];
                  data.CustomizeTestApplyRule = item.CustomizeTestApplyRule
                  data["ParentCategoryCode"] = item.CategoryNo;
                  arr.forEach(el => {
                    data.CheckedList.push(el.ChargeItemCode);
                    data.ChildItems.push({
                      DictItemCode: el.ChargeItemCode,
                      DictItemName: el.ChargeItemName,
                      IsDeleted: true
                    });
                  });
                  data.ItemType = item.OrderItemType;
                  data.DictItemName = item.ItemName;
                  data.Attention = "";
                  let sampleName = ""
                  if (item.PreSampleCode) {
                      for (let j = 0; j < this.specimenOptions.length; j++) {
                        if (
                          item.PreSampleCode[0] ===
                          this.specimenOptions[j].SampleCode
                        ) {
                          sampleName= this.specimenOptions[j].Name
                        }
                      }
                  }
                  data["SampleCode"] = item.PreSampleCode?item.PreSampleCode[0] : '';
                  data["SampleName"] = sampleName || "";
                  data.Price = item.Price;
                  data.IsDeleted = false;
                  data._edit = false;
                  index < 0 && this.newAdviceList.push(data);
                  // this.commonObj.ExcuteDepartment = "";
                   this.commonObj = { ExcuteDepartment: "",IsEmergency:this.testItemCodeList.includes(item.HisMedId) };
                  this.isAdd = this.isEdit;
                  this.editIndex = Math.random();

                });
            } else {
              this.$msg.warning(res.Message);
            }
          });
      } else if (item.ItemType === 4) {
        // 用血医嘱
        let data =
          index < 0
            ? {
                BloodFormId: "00000000-0000-0000-0000-000000000000",
                Id: "00000000-0000-0000-0000-000000000000"
              }
            : this.newAdviceList[index];
        data.ItemName = item.ItemName;
        data.ItemCode = item.HisMedId;
        data.Unit = item.DrugStoreUnit;
        data.ItemType = item.OrderItemType;
        data.Price = item.Price;
        data.Count = 1;
        data._edit = false;
        data.BloodWay = "";
        this.commonObj = {};
        index < 0 && this.newAdviceList.push(data);
        this.commonObj.ExcuteDepartment = item.Department;
        this.isAdd = this.isEdit;
      } else if (item.ItemType === 15) {
        // 手术申请单
        this.commonObj.OperationName = item.ItemName;
        this.commonObj.OperationCode = item.HisMedId;
        this.isAdd = this.isEdit;
      } else if (item.ItemType === 31) {
        this.isConAdvice = true;
        console.log(item, "item........");
        this.commonObj = {};
        this.commonObj.DictItemCode = item.ClinicItemCode;
        //  this.commonObj.TypeCode =
        this.isAdd = this.isEdit;
      }
      console.log(this.newAdviceList);
    },
    // 获取频次代码
    getDictData() {
      this.$Api.getFrequency().then(res => {
        let arr = res.Data || [];
        arr.forEach(item => {
          if (item.InputString === "QD") {
            this.FrequencyCode = item.Code;
          } else if (item.InputString === "BID") {
            this.BID = item;
          } else if (item.InputString === "ST") {
            this.ST = item.Code;
            this.STObj = item;

          }
        });
        if (!res.Status) {
          this.msg.warning(res.Message);
        }
      });
    },
    // 获取标本信息
    getTestSampleList() {
      this.$Api.getTestSampleList().then(res => {
        this.specimenOptions = res.Data || [];
        if (!res.Status) {
          this.$msg.warning(res.Message);
        }
      });
    },
    // 判断护理医嘱是否有等级护理
    hasGradeNursing(arr) {
      if (arr == null) {
        return;
      }
      for (let i = 0; i < arr.length; i++) {
        const el = arr[i];
        if (this.nurseName.includes(el.OrderContent))
          return { row: el, index: i };
      }
      return false;
    },
    //  医嘱保存
    async save(submitForm) {
      let list = await submitForm();

      let data = JSON.parse(JSON.stringify(list));
      console.log(data);
      if (data) {
        let type = this.isEdit ? this.tableRowData.OrderType : this.adviceName;
        if (type === 5) {
          // 护理医嘱-等级护理互斥原则
          let newGradeNursing = this.hasGradeNursing(data.Orders);
          let oldGradeNursing = this.hasGradeNursing(this.orderPackageData);
          if (
            newGradeNursing &&
            oldGradeNursing &&
            newGradeNursing.row.OrderId !== oldGradeNursing.row.OrderId
          )
            return this.$msg.info(
              "待提交医嘱中已有等级护理，不可再添加等级护理！"
            );
        }
       if (type === 7) {
          data.ApplicationFormName = this.ApplicationFormName||data.Details.ApplicationFormName;
          data.ApplicationFormNo = data.Details.ExcuteDepartment;
        }
        if (type === 8) {
          data.forEach(el=>{
          el.ApplicationFormName = this.ApplicationFormName||el.TestApplyMainModel.ApplicationFormName;
          el.ApplicationFormNo = el.TestApplyMainModel.ExcuteDepartment;
          })

        }
        if (type === 31) {
          let arr = [];
          for (let i = 0; i < data.ConsultationDetails.length; i++) {
            arr.push({
              DepartmentCode: data.ConsultationDetails[i]
            });
          }
          data.ConsultationDetails = arr;
        }
        let api = this.saveOrUpdateApiName[type];
        let parmas = {
          OrderPackageId:
            this.orderPackageParams.OrderPackageId == undefined
              ? "00000000-0000-0000-0000-000000000000"
              : this.orderPackageParams.OrderPackageId
        };
        console.log(parmas, data, "this.isConAdvice = false");
        this.$Api[api](parmas, data).then(res => {
          this.$msg[res.Status ? "success" : "warning"](res.Message);
          if (res.Status) {
            this.isAdd = true;
            this.newAdviceList = [];
            this.commonObj = {};
            this.ApplicationFormName = "";
            this.isEdit &&
              this.$refs.drops.rowExpansion(this.tableRowData, false);
            this.tableRowData = {};
            this.isEdit = false;
            this.getPackageDetail(parmas.OrderPackageId, 2);
          }
        });
      }
    },
    //  医嘱取消
    cancel(type) {
      this.$confirm(cancelMsg[type], "", {
        type: "warning"
      })
        .then(() => {
          // 取消新增医嘱
          if (type === "add") {
            this.isAdd = true;
            this.newAdviceList = [];
            this.commonObj = {};
            // 取消修改医嘱
          } else if (type === "change") {
            // this.isEdit=false
            this.$refs.drops.rowExpansion(this.tableRowData, false);
            this.$nextTick(() => {
              this.isEdit = false;
              this.tableRowData._isEdit = false;
              this.newAdviceList = [];
              this.commonObj = {};
            });
            // 取消提交
          } else {
            this.deleteAdviceList([]);
          }
          // this.tableData.splice(index, 1);
          console.log(11);
          // this.$msg.success("取消新增记录成功");
        })
        .catch(() => {
          this.$msg.info("已取消操作");
        });
    },
    // 取消待提交的医嘱
    deleteAdviceList(orderIdList, index) {
      console.log(index);
      if (!this.showEdit) {
        return;
      }
      let item = this.orderPackageData.splice(index, 1);
      this.delOrderIds.push(item[0].OrderId);
      this.$Api.deleteOrderPackageItem(orderIdList).then(res => {
        this.$msg[res.Status ? "success" : "warning"](res.Message);
      });
    },
    // 套餐保存提交前校验下提交项是否验证通过
    checkForm() {
      this.orderPackageParams.PackageRangeCode = this.rangeRadio;
      return new Promise((resolve, reject) => {
        if (
          this.orderPackageParams.PackageRangeCode != "" &&
          this.orderPackageParams.PackageRangeCode != undefined &&
          this.orderPackageParams.PackageName != "" &&
          this.orderPackageParams.PackageName != undefined &&
          this.orderPackageParams.PackageCategoryCode != "" &&
          this.orderPackageParams.PackageCategoryCode != undefined
        ) {
          if (this.orderPackageData.length == 0) {
            this.$msg.warning("请添加医嘱");
            reject(false);
            return;
          }
          resolve(true);
        } else {
          this.$msg.warning("请把信息填写完全");
          reject(false);
        }
      });
    }
  },
  computed: {
    ...mapGetters({
      drupUnit: "configuration/GET_DRUPUNIT", //抢救留观药品数量单位
      selectArea: "home/GET_SELECTAREA", //所在区域
      orderPackageRange: "orderpackages/GET_ORDERPACKAGERANGE",
      orderPackageType: "orderpackages/GET_ORDERPACKAGETYPE",
      userRightList: "public/GET_USERRIGHTLIST",
      testItemCodeList:"doctoradvice/GET_TESTITEMCODELIST"
    }),
    orderPackageData: {
      get: function() {
        console.log(this.orderPackageAllData, "全部说句");
        let arr = this.orderPackageAllData.filter(item => {
          return this.filters.effectiveChecked.includes(item.EffectiveTime);
        });
        console.log(arr, "过滤说句");
        return arr;
      },
      set: function(newValue) {
        return newValue;
      }
    }
  },
  // beforeRouteUpdate() {}
  // beforeRouteLeave(to,from,next) {
  //   console.log('组件内路由守卫')
  //   if(!this.showEdit) {
  //       next()
  //     }
  //    this.$confirm('是否保存当前最新编辑数据？',"提示",{
  //     confirmButtonText: "是",
  //       cancelButtonText: "否",
  //       type: "warning"
  //   }).then(() => {
  //     this.saveOrEditPackage(this.checkForm)
  //     next()
  //   }).catch(() => {
  //     let params = this.orderPackageParams.OrderPackageId == undefined
  //             ? "00000000-0000-0000-0000-000000000000"
  //             : this.orderPackageParams.OrderPackageId;
  //         this.cancelPackage(params)
  //         next()
  //   })
  // },
  beforeDestroy() {
    if (!this.showEdit) {
      return;
    }
    this.$confirm("是否保存当前最新编辑数据？", "提示", {
      confirmButtonText: "是",
      cancelButtonText: "否",
      type: "warning"
    })
      .then(() => {
        this.checkForm()
          .then(res => {
            if (res) {
              this.saveOrEditPackage(this.checkForm);
            }
          })
          .catch(err => {
            let params =
              this.orderPackageParams.OrderPackageId == undefined
                ? "00000000-0000-0000-0000-000000000000"
                : this.orderPackageParams.OrderPackageId;
            this.cancelPackage(params);
          });
      })
      .catch(() => {
        let params =
          this.orderPackageParams.OrderPackageId == undefined
            ? "00000000-0000-0000-0000-000000000000"
            : this.orderPackageParams.OrderPackageId;
        this.cancelPackage(params);
      });
  },
  destroyed() {
    // 组件销毁
    console.log(this.$parent);
    console.log(this.orderPackageParams, "销毁钩子函数");
    //this.cancelPackage('6dc58489-616e-4f84-b7df-4fc83aa00b50')
  }
};
</script>>
<style lang="less">
@import url("../doctorAdvice/openDoctorAdvice/adviceStyle.less");
.childPageContent {
  width: 100%;
  height: calc(~"(100% - 50px)");
  overflow: auto;

  .orderPackageParams {
    padding: 5px 20px 0 20px;
  }
  .advice-content {
    box-sizing: border-box;
    padding: 10px 20px;
    h2 {
      font-size: 14px;
      color: #000622;
      padding: 15px 0;
      font-weight: 700;
    }
    .advice-button {
      text-align: right;
      padding: 10px 0;
    }
  }
}
</style>