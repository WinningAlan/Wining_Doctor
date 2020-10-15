<template>
  <div class="allergy">
    <div class="header cl">
      <div class="icon-list">
        <el-tooltip slot="reference" placement="top" effect="light" content="新增">
          <svg-icon iconClass="add" class="wh40" @click="add" v-if="activeIndex!=6"></svg-icon>
        </el-tooltip>
      </div>
    </div>
    <div class="table">
      <tableCommon
        :tableData="tableData"
        :columns="columns"
        @row-click="rowClick"
        ref="allergyTable"
      >
        <template slot="HisMedId" slot-scope="{scope}" v-if="activeIndex==1 || activeIndex==5">
          <el-select
            v-model="scope.row.MedicineName"
            v-if="scope.row._isEdit"
            @change="selectDrug($event,scope.row)"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            @focus="remoteMethod(null)"
          >
            <el-option
              v-for="item in allMedicines"
              :key="item.Id"
              :label="item.MedicineName"
              :value="[{...item}]"
            ></el-option>
          </el-select>

          <span v-else>{{scope.row.MedicineName}}</span>
        </template>
        <template
          slot="Code"
          slot-scope="{scope}"
          v-if="activeIndex==3 || activeIndex==2 || activeIndex==4"
        >
          <el-select
            v-model="scope.row.Code"
            v-if="scope.row._isEdit"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethodList"
            @focus="changDic"
          >
            <el-option
              v-for="item in allOption"
              :key="item.Value"
              :label="item.Text"
              :value="item.Value.toString()"
            ></el-option>
          </el-select>
          <span v-else>{{scope.row.Name}}</span>
        </template>
        <template slot="dd" slot-scope="{scope}">
          <p class="operation" v-if="scope.row">
            <span @click="edit(scope.row)" v-if="!scope.row._isEdit">修改</span>
            <span @click="save(scope.row)" v-else>保存</span>
            <span @click="del(scope.row,scope.$index)">删除</span>
          </p>
        </template>
      </tableCommon>
    </div>
    <div class="tabs-table cl">
      <p
        v-for="(item,index) in tabsList"
        :key="index"
        :class="{active:activeIndex==item.value}"
        @click="tabsTable(item)"
      >
        {{item.text}}
        <span v-if="index!==tabsList.length-1">|</span>
      </p>
    </div>
  </div>
</template>
<script>
import tableCommon from "../../common/tableCommon";
import { GetFormatDateTime } from "@/utils/public";
import { allergyOption } from "../../../module/staticData";
import { mapGetters } from "vuex";
import {
  drugColumns,
  foodColumns,
  takeColumns,
  elseColumns,
  untowardColumns,
  historyColumns
} from "../../../module/patientInfo";
export default {
  name: "allergy",
  components: {
    tableCommon
  },
  data() {
    this.num = 0;
    return {
      activeIndex: 1, //却换显示当前的展示的过敏列表
      tableData: [], //表格的数据
      columns: drugColumns, //表头的数据
      rowData: {}, //选中的表头
      tabsList: allergyOption, //却换不同的表格列表
      allMedicines: [], //获取所有的药瓶
      allergytype: [], //过敏类型
      options: {
        2: [],
        3: [],
        4: [],
        5: [],
        6: []
      }, //字典量的数据保存
      allOption: []
    };
  },
  created() {
    this.getMedicine();
    //造影剂的字典量
    this.getDictionary("allergytype").then(res => {
      if (res.Status) {
        drugColumns[4].options = res.Data;
        foodColumns[3].options = res.Data;
        takeColumns[3].options = res.Data;
        elseColumns[3].options = res.Data;
        historyColumns[4].options = res.Data;
        this.allergytype = res.Data;
      }
    });
    this.getDictionary("severitytype").then(res => {
      if (res.Status) {
        untowardColumns[3].options = res.Data;
      }
    });
  },
  computed: {
    ...mapGetters({
      patientMsg: "public/GET_PATIENTMSG"
    })
  },
  filters: {
    //过滤过敏选项
    filterData(val, arr) {
      let str = "";
      arr &&
        arr.forEach(item => {
          if (val == item.Value) {
            str = item.Text;
          }
        });
      return str || val;
    }
  },
  methods: {
    //新增数据
    add() {
      if (this.activeIndex === 1) {
        this.tableData.unshift({
          InHouseId: this.$route.query.id,
          PatientId: this.patientMsg.PatientId,
          HisMedId: "",
          MedicineName: "",
          SkinTestTime: GetFormatDateTime(),
          StartTime: GetFormatDateTime(),
          EndTime: GetFormatDateTime(),
          AllergyType: "",
          Id: this.num--,
          _isEdit: true
        });
      }
      if (this.activeIndex === 2) {
        this.tableData.unshift({
          InHouseId: this.$route.query.id,
          PatientId: this.patientMsg.PatientId,
          Code: "",
          InputTime: GetFormatDateTime(),
          StartTime: GetFormatDateTime(),
          AllergyType: "",
          Id: this.num--,
          _isEdit: true
        });
      }
      if (this.activeIndex === 3) {
        this.tableData.unshift({
          InHouseId: this.$route.query.id,
          PatientId: this.patientMsg.PatientId,
          Code: "",
          InputTime: GetFormatDateTime(),
          StartTime: GetFormatDateTime(),
          AllergyType: "",
          Id: this.num--,
          _isEdit: true
        });
      }
      if (this.activeIndex === 4) {
        this.tableData.unshift({
          InHouseId: this.$route.query.id,
          PatientId: this.patientMsg.PatientId,
          Code: "",
          InputTime: GetFormatDateTime(),
          StartTime: GetFormatDateTime(),
          AllergyType: "",
          Id: this.num--,
          _isEdit: true
        });
      }
      if (this.activeIndex === 5) {
        this.tableData.unshift({
          InHouseId: this.$route.query.id,
          PatientId: this.patientMsg.PatientId,
          StartTime: GetFormatDateTime(),
          MedicineName: "",
          SeverityType: "",
          Reason: "",
          Symptom: "",
          HisMedId: "",
          IdmId: "",
          Id: this.num--,
          _isEdit: true
        });
      }
    },
    //编辑数据
    edit(row) {
      this.$refs.allergyTable.edit(row);
    },
    //保存
    save(row) {
      if (this.activeIndex == 1) {
        if (
          row.HisMedId &&
          row.AllergyType &&
          row.SkinTestTime &&
          row.StartTime &&
          row.EndTime
        ) {
          let type =
            typeof row.Id == "number" ? "addMedicine" : "updataMedicine";
          this.$refs.allergyTable.save(row, type, [], () => {
            this.getMedicine();
          });
        } else {
          this.$msg.warning("过敏药物和过敏类型和时间均为必填项！");
        }
      }
      if (this.activeIndex == 2) {
        if (row.Code && row.AllergyType && row.StartTime && row.InputTime) {
          let type =
            typeof row.Id == "number" ? "addFoodAllergy" : "upDataFoodAllergy";
          this.$refs.allergyTable.save(row, type, [], () => {
            this.getFoodAllergy();
          });
        } else {
          this.$msg.warning("过敏食物名称和过敏类型和时间均为必填项！");
        }
      }
      if (this.activeIndex == 3) {
        if (row.Code && row.AllergyType && row.StartTime && row.InputTime) {
          let type =
            typeof row.Id == "number"
              ? "addContrasAllergy"
              : "upDataContrasAllergy";
          this.$refs.allergyTable.save(row, type, [], () => {
            this.getContrasAllergy();
          });
        } else {
          this.$msg.warning("过敏照影剂名称和过敏类型和时间均为必填项！");
        }
      }
      if (this.activeIndex == 4) {
        if (row.Code && row.AllergyType && row.StartTime && row.InputTime) {
          let type =
            typeof row.Id == "number"
              ? "addOtherAllergy"
              : "upDataOtherAllergy";
          this.$refs.allergyTable.save(row, type, [], () => {
            this.getOtherAllergy();
          });
        } else {
          this.$msg.warning("其他过敏源名称和过敏类型和时间均为必填项！");
        }
      }
      if (this.activeIndex == 5) {
        if (row.HisMedId && row.SeverityType && row.StartTime) {
          let type = typeof row.Id == "number" ? "addDrug" : "upDataDrug";
          this.$refs.allergyTable.save(row, type, [], () => {
            this.getDrugList();
          });
        } else {
          this.$msg.warning("药品名称和严重程度和发生日期为必填项！");
        }
      }
    },
    //删除
    del(row, index) {
      if (this.activeIndex == 1) {
        this.$refs.allergyTable.delete(row, index, "delMedicine");
      }
      if (this.activeIndex == 2) {
        this.$refs.allergyTable.delete(row, index, "delFoodAllergy");
      }
      if (this.activeIndex == 3) {
        this.$refs.allergyTable.delete(row, index, "delContrasAllergy");
      }
      if (this.activeIndex == 4) {
        this.$refs.allergyTable.delete(row, index, "delOtherAllergy");
      }
      if (this.activeIndex == 5) {
        this.$refs.allergyTable.delete(row, index, "delDrug");
      }
    },
    //点击单行
    rowClick(row) {
      this.rowData = row;
      console.log(row);
    },
    //切换显示不同的表格
    tabsTable(val) {
      if (val.value === 1) {
        this.columns = drugColumns;
        this.getMedicine();
      }
      if (val.value === 2) {
        this.columns = foodColumns;
        this.getFoodAllergy();
      }
      if (val.value === 3) {
        this.columns = takeColumns;
        this.getContrasAllergy();
      }
      if (val.value === 4) {
        this.columns = elseColumns;
        this.getOtherAllergy();
      }
      if (val.value === 5) {
        this.columns = untowardColumns;
        this.getDrugList();
      }
      if (val.value === 6) {
        this.columns = historyColumns;
        this.getAllergyHistories();
      }
      this.activeIndex = val.value;
    },
    //获取所有药瓶的的字典量
    getAllMedicines(val) {
      this.$Api.getAllMedicines({ "conditionDto.name": val }).then(res => {
        if (res.Status) {
          console.log(res);
          this.allMedicines = res.Data;
        }
      });
    },
    //获取字典量的数据
    async getDictionary(str) {
      let data = {
        tableName: "Sys_Dictionary",
        PageIndex: 1,
        PageSize: 99999,
        IsAsc: true,
        OrderField: "Value",
        list: [
          {
            FieldName: "Code",
            FieldValue: str,
            OperatorStr: "="
          }
        ]
      };
      let res = await this.$Api.getSeverity(data);
      return res;
    },
    //获取所有的药品过敏列表
    getMedicine() {
      this.$Api.getMedicine({ InHouseId: this.$route.query.id }).then(res => {
        if (res.Status) {
          this.tableData = res.Data || [];
        }
      });
    },
    //获取造影剂的信息
    getContrasAllergy() {
      this.$Api
        .getContrasAllergy({ InHouseId: this.$route.query.id })
        .then(res => {
          if (res.Status) {
            this.tableData = res.Data || [];
          }
        });
    },
    //获取食物的过敏信息
    getFoodAllergy() {
      this.$Api
        .getFoodAllergy({ InHouseId: this.$route.query.id })
        .then(res => {
          if (res.Status) {
            this.tableData = res.Data || [];
          }
        });
    },
    //其他过敏信息
    getOtherAllergy() {
      this.$Api
        .getOtherAllergy({ InHouseId: this.$route.query.id })
        .then(res => {
          if (res.Status) {
            this.tableData = res.Data;
          }
        });
    },
    //获取药品不良反应
    getDrugList() {
      this.$Api.getDrugList({ InHouseId: this.$route.query.id }).then(res => {
        if (res.Status) {
          this.tableData = res.Data;
        }
      });
    },
    //获取过敏的历史信息
    getAllergyHistories() {
      this.$Api
        .getAllergyHistories({ patientId: this.patientMsg.PatientId })
        .then(res => {
          if (res.Status) {
            console.log(res);
            this.tableData = res.Data;
          }
        });
    },
    //筛选药品的信息
    selectDrug(val, row) {
      console.log(val, row);
      row.HisMedId = val[0].HisMedId;
      row.IdmId = val[0].IdmId;
      row.MedicineName = val[0].MedicineName;
    },
    //下拉收索的函数
    remoteMethod(val) {
      this.getAllMedicines(val);
      // if (val) {
      //   this.getAllMedicines(val);
      // }
    },
    //搜索过敏信息的数据
    remoteMethodList(val) {
      console.log(val, val);
      this.allOption = [];
      if (this.activeIndex === 2) {
        this.getFoodDicList(val);
      } else if (this.activeIndex === 3) {
        this.getMediumDicList(val);
      } else if (this.activeIndex === 4) {
        this.getOtherDicList(val);
      }
    },
    changDic() {
      console.log('111111111111')
      this.allOption = [];
      if (this.activeIndex === 2) {
        this.getFoodDicList(null);
      } else if (this.activeIndex === 3) {
        this.getMediumDicList(null);
      } else if (this.activeIndex === 4) {
        this.getOtherDicList(null);
      }
    },
    //获取食物过敏信息字典量
    getFoodDicList(val) {
      this.$Api.getFoodDicList({ keyWords: val?val:null }).then(res => {
        if (res.Status) {
          this.allOption = res.Data || [];
          console.log(this.allOption);
        }
      });
    },
    //获取造影剂过敏信息字典量
    getMediumDicList(val) {
      this.$Api.getMediumDicList({ keyWords: val?val:null }).then(res => {
        if (res.Status) {
          this.allOption = res.Data || [];
        }
      });
    },
    //获取其他过敏源过敏信息
    getOtherDicList(val) {
      this.$Api.getOtherDicList({ keyWords: val?val:null }).then(res => {
        if (res.Status) {
          this.allOption = res.Data || [];
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.icon-list {
  float: right;
  .wh40 {
    width: 20px;
    height: 20px;
    padding-left: 10px;
    color: #0071e7;
    cursor: pointer;
  }
}
.allergy {
  position: relative;
  height: 100%;
  // background: red;
  .tabs-table {
    position: absolute;
    left: 0;
    bottom: -40px;
    display: flex;
    p {
      padding: 10px;
      cursor: pointer;
      span {
        padding-left: 10px;
      }
    }
    .active {
      color: #0071e7;
      span {
        color: #333;
      }
    }
  }
  .table {
    height: ~"calc(100% - 50px)";
    overflow: auto;
  }
}
</style>