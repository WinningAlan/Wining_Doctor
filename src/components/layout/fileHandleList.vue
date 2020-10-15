<template>
  <div class="fileHandleList">
    <el-tabs @tab-click="handleClick(currentType)" v-model="currentType">
      <el-tab-pane label="护理文书" name="1">
        <div class="treeAll">
          <tree
            v-for="(item, index) in docList"
            :key="index"
            :activeItem="currentLeafId"
            :treeData="item"
            :selectLeaf="selectLeaf"
            type="1"
          ></tree>
        </div>
      </el-tab-pane>
      <el-tab-pane label="护理评估" name="2">
        <div class="treeAll">
          <tree
            v-for="(item, index) in evaluList"
            :key="index"
            :activeItem="currentLeafId"
            :treeData="item"
            :selectLeaf="selectLeaf"
            type="2"
          ></tree>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import tree from "./tree";
import { mapGetters } from "vuex";
export default {
  name: "fileHandleList", //护理文书目录
  components: {
    tree
  },
  props: {
    patientData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      currentLeafId: "", //选中的Id
      currentType: "1",
      docList: [], //护理文书数据
      evaluList: [] // 护理评估数据
    };
  },
created(){
  // this.handleClick('1',true)
},
  methods: {
    // 获取当前患者的文书列表
    getDocList(isFirst) {
      if (!this.patientData.InHouseId) return;
    this.$Api.getDocList({inHospPatId:this.patientData.InHouseId}).then(res => {
        this.docList = res.Data || [];
        if (isFirst&&this.docList.length) {
          let obj=this.docList[0].DocList[0];
          this.selectLeaf(obj.DocId,'1',obj.Number)
        }
        !res.Status && this.$msg.warning(res.Message);
      });
    },
    // 获取当前患者的评估列表
    getEvaluList() {
      if (!this.patientData.InHouseId) return;
      this.$Api.getEvaluList({inHospPatId:this.patientData.InHouseId}).then(res => {
        this.evaluList = res.Data || [];
        !res.Status && this.$msg.warning(res.Status);
      });
    },

    // type 1 护理文书  2 护理评估
    selectLeaf(documentId, objectType, pageIndex) {
  
      this.currentLeafId = documentId;
      let obj = {
        objectType,
        inHospPatId: this.patientData.InHouseId,
        pageIndex,
        patientId: this.patientData.PatientId,
        originUrl: window.location.protocol + "\\" + window.location.host,
        createUser: this.userId,
        documentId,
        mark:true
      };
    this.$parent.setIframeUrl(obj,'EditPage')
    },
    handleClick(val,isFirst) {
      console.log('object');
      this.currentType = val;
      if (val === "1") {
        this.getDocList(isFirst);
      } else {
        this.getEvaluList();
      }
    }
  },
  computed: {
    ...mapGetters({
      user:"public/GET_USER"
    }),
    userId: function() {
      return this.user.UserInfo.Id;
    }
  },
  watch: {
    // showLoad: {
    //   immediate: true,
    //   handler: function(newValue) {
    //     this.showLoading = newValue;
    //   }
    // }
  }
};
</script>

<style lang="less" scoped>
.fileHandleList {
  position: relative;
  height: 100%;
  width: 232px;
  float: left;
  box-shadow: 0 0 5px 0 rgba(57, 109, 178, 0.5);
  /deep/ .el-tab-pane {
    height: 100%;
    overflow: hidden;
  }
  .treeAll {
    height: calc(~"(100% - 21px)");
    overflow: auto;
    background: #fff;
  }
  /deep/ .el-tabs__active-bar {
    height: 0;
  }
  /deep/ .el-tabs .el-tabs__item {
    width: 116px;
  }
  /deep/ .el-tabs__content {
    overflow: auto;
    height: calc(~"(100% - 63px)");
  }
}
</style>
  
