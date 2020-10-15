<template>
  <div class="callbackPat">
    <div class="selectArea">
      <span>召回区域：</span>
      <el-select v-model="selectArea">
        <el-option
          v-for="(item,index) in AreaList"
          :key="index"
          :label="item.AreaName"
          :value="item.DiagnosisAreaId"
        ></el-option>
      </el-select>
    </div>
    <div class="selectBed">
      <span>床号：</span>
      <el-select v-model="selectBed">
        <el-option
          v-for="(item,index) in BedList"
          :key="index"
          :label="item.BedNo"
          :value="item.BedId"
        ></el-option>
      </el-select>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      selectArea: "",
      selectBed: "",
      AreaList: [] //区域
    };
  },
  created() {},
  computed: {
    ...mapGetters({
      dialogData: "public/GET_DIALOGDATA"
    }),
    BedList: function() {
      let obj = this.AreaList.find(item => {
        if (item.DiagnosisAreaId == this.selectArea) {
          return item;
        }
      });
      return obj && obj["BedInfos"];
    }
  },
  props: {
    initialize: Boolean
  },
  watch: {
    initialize: {
      handler: function(val, oldVal) {
        if (val) {
          this.$Api.getBedList().then(res => {
            if (res.Status) {
              console.log(res,'res');
              this.AreaList = res.Data||[];
            } else {
              this.$msg.warning(res.Message);
            }
          });
          this.selectArea =
            this.dialogData.data.DiagnosisAreaId || this.dialogData.data.AreaId;
          this.selectBed = this.dialogData.data.BedId || "";
        }
      },
      immediate: true
    },
    BedList: {
      handler: function(newValue) {
        let obj = undefined;
        if (newValue) {
            obj = newValue.find(item => {
          if (item.BedId == this.selectBed) {
            return item;
          }
        });
        }
        console.log(obj, "床位", newValue);
        if (!obj) {
          if (newValue&&newValue.length ) {
            this.selectBed = newValue[0].BedId;
          } else {
            this.selectBed = "";
          }
        }
      }
    }
  },
  methods: {
    async save() {
      if(!this.selectArea){
         this.$msg.info('未选择召回区域')
        return false
      }
      let params = {
        inHostpId: this.dialogData.data.Id||this.dialogData.data.InHouseId,
        bedId: this.selectBed || "00000000-0000-0000-0000-000000000000",
        DiagnosisAreaId: this.selectArea
      };
      try {
        let res = await this.$Api.patCallback(params);
        if (res.Status) {
          // 刷新界面
          //this.getPatientList();
          //使用状态管理异步操作
          this.$msg.success(res.Message);
          return true;
        } else {
          this.$msg.warning(res.Message);
          return false;
        }
      } catch (err) {
        return false;
        console.log(err);
      }
    }
  }
};
</script>
<style lang="less" scoped>
.callbackPat {
  padding: 20px 100px;
  span {
    width: 70px;
    text-align: right;
    display: inline-block;
  }
  .selectArea {
    margin-bottom: 20px;
  }
  .selectBed {
  }
}
</style>