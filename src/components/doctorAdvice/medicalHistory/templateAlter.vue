<template>
  <div class="templateAlter">
    <div class="tree-left">
      <div class="search">
        <el-input placeholder="请输入内容" v-model.trim="treeName" suffix-icon="el-icon-search"></el-input>
        <p class="cl">
          <el-tooltip class="item" effect="dark" :open-delay="400" content="删除" placement="top">
            <svg-icon iconClass="del" class="my-icon" @click="del"></svg-icon>
          </el-tooltip>
        </p>
      </div>
      <medicalNowTree
        ref="treeList"
        v-if="initialize"
        class="treeList"
        :filter-node-method="filterNode"
        :default-expanded-keys="expandedKeys"
        :callBack="handleNodeClick"
        :treeData="treeList"
        children="MedList"
        type="templateAlter"
      ></medicalNowTree>
    </div>
    <div
      class="template-alter-right"
      v-loading="showLoading"
      element-loading-text="拼命加载中"
      element-loading-background="rgba(200, 200, 200, 0.6)"
    >
      <iframe
        ref="iframe"
        class="iframeStyle"
        :src="url"
        scrolling="yes"
        frameborder="0"
        id="templateAlter"
      ></iframe>
    </div>
  </div>
</template>

<script>
import medicalNowTree from "./medicalNowTree.vue";
import { mapGetters } from "vuex";
import { getServerTimeRandom } from "@/utils/public";
export default {
  name: "templateAlter", //医嘱模板
  components: {
    medicalNowTree
  },
  props: ["initialize"],
  data() {
    return {
      treeName: "",
      treeList: [],
      activePrescription: {},
      expandedKeys: [],
      url: ""
    };
  },
  computed: {
    ...mapGetters({
      patientMsg: "public/GET_PATIENTMSG",
      user: "public/GET_USER",
      showLoading: "public/GET_SHOWLOADING",
      isSignName: "public/GET_ISSIGNNAME", //是否启用
      selectArea: "home/GET_SELECTAREA" //所在区域
    })
  },
  created() {
    this.getTemplateList();
  },

  watch: {
    treeName(val) {
      this.$refs.treeList.getNode().filter(val);
    },
    initialize(bl) {
      bl && this.getTemplateList();
      this.treeName = "";
      this.activePrescription = {};
    }
  },
  methods: {
    // 模板搜索
    filterNode(value, data) {
      if (!value) return true;
      console.log(data);
      // return true
      return (
        (data.CategoryName && data.CategoryName.indexOf(value) !== -1) ||
        (data.TemplateName && data.TemplateName.indexOf(value) !== -1)
      );
    },
    // 点击树形节点
    handleNodeClick(data, type, parentId) {
      this.activePrescription = data;
      this.expandedKeys = [parentId];
      this.$store.commit("public/SET_SHOWLOADING", true);

      let str = "";
      let obj = {
        patientId: this.patientMsg.PatientId,
        inHospPatId: this.patientMsg.InHouseId,
        areaType: this.patientMsg.AreaType,
        templateId: this.activePrescription.Id,
        oriTemplateId: this.activePrescription.OriTemplateId,
        createUser: this.user.UserInfo.Id,
        readOnly: true,
        isSignName: !!this.isSignName,
        originUrl: window.location.protocol + "\\" + window.location.host,
        objectType: 12
      };
      for (const key in obj) {
        str += `${key}=${obj[key]}&`;
      }
      str = str.substring(0, str.length - 1);
      let url = `${URLCONFIG.Emr}/Nursing/EditPage.aspx?${str}`;
      if (url == this.url) {
        this.$store.commit("public/SET_SHOWLOADING", false);

        return;
      }
      getServerTimeRandom(url).then(res => {
        this.url = res;
      });
    },
    //模板树
    getTemplateList() {
      this.$Api
        .getTemplateList({ areaId: this.patientMsg.AreaId })
        .then(res => {
          if (res.Status) {
            let data = res.Data;
            console.log(res.Data, "dada");
            this.treeList = [];
            console.log("data.Per", data.Per);
            console.log(
              this.setMealCheck(data.Com),
              "this.setMealCheck(data.Per)"
            );
            data.Per &&
              data.Per.length &&
              this.treeList.push({
                CategoryName: "个人模板",
                Id: "1",
                MedList: data.Per
              });
            data.Com &&
              data.Com.length &&
              this.treeList.push({
                CategoryName: "科室模板",
                Id: "2",
                MedList: this.setMealCheck(data.Com)
              });

            if (!this.activePrescription.Id && this.treeList.length) {
              let nodeData = this.getNodeKey(
                this.treeList[0],
                this.treeList[0].Id
              );
              this.$nextTick(() => {
                this.$refs.treeList.currentChange(nodeData.data, nodeData.id);
              });
            }
          } else {
            this.$msg.warning(res.Message);
          }
        });
    },
    // 获取默认展开项
    getNodeKey(data, id) {
      console.log(data, id);
      if (data.hasOwnProperty("MedList") && data.MedList.length) {
        return this.getNodeKey(data.MedList[0], data.Id);
      } else {
        return { data, id };
      }
    },
    //递归改变数据的
    setMealCheck(data = []) {
      for (var i = 0; i < data.length; i++) {
        data[i]["MedList"] = data[i].ChildCategory;
        if (data[i].ChildCategory.length) {
          this.setMealCheck(data[i].ChildCategory);
        }
      }
      return data;
    },
    // 删除个人病历模板
    del() {
      if (this.activePrescription.ParentId)return this.$msg.info('科室模板不可删除')
      if(this.activePrescription.Id){
        console.log('删除个人病历');
        this.$Api.delTemplate({templateId:this.activePrescription.Id}).then(res=>{
          this.$msg[res.Status ? "success" : "warning"](res.Message);
          if(res.Status){
            this.activePrescription={}
             this.getTemplateList()
          }
          console.log(res);
        })
      }
      console.log(this.activePrescription);
    }
  }
};
</script>
<style scoped lang='less'>
.templateAlter {
  height: 550px;
  height: calc(90vh - 100px);
  padding-top: 10px;
  .tree-left {
    width: 251px;
    float: left;
    box-sizing: border-box;
    border-right: 1px solid #dfe7f5;
    padding: 0px 10px;
    .treeList {
      height: 510px;
      height: calc(90vh - 140px);

      overflow: auto;
    }
  }
  .template-alter-right {
    overflow: hidden;
    height: 100%;
    overflow: hidden;

    box-sizing: border-box;
    padding: 20px;
    .iframeStyle {
      height: 100%;
      width: 100%;
    }
  }
  .search {
    border-bottom: 1px solid #dfe7f5;
    p{
      padding: 5px;
    }
    /deep/ .el-input {
      .el-input__inner {
        border: none;
      }
      .el-icon-search {
        font-size: 20px;
        color: #dfe7f5;
        font-weight: bold;
        // cursor: pointer;
      }
    }
  }
  .my-icon {
    color: rgba(0, 113, 231, 0.7);
    font-size: 18px;
    cursor: pointer;
    float: right;

    margin: 6px 0 0 15px;
  }
}
</style>
