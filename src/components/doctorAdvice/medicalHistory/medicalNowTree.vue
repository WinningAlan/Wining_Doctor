<template>
  <el-tree
    class="medical-now-tree"
    :class="{paragraph:type==='paragraph'}"
    :data="treeData"
    :props="defaultProps"
    :node-key="nodeKey"
    :highlight-current="isHig"
    :default-checked-keys="checkList"
    :ref="type"
    @current-change="currentChange"
    @check-change="checkChange"
    v-bind="$attrs"
    v-on="$listeners"
    @node-expand="nodeExpand"
    @node-click="leafClick"
    @check="checkNode"
  >
    <span slot-scope="{ node, data }">
      <!-- :disabled="node.label.length<=19" -->
      <el-tooltip
        effect="light"
        :open-delay="400"
        placement="right"
        popper-class="paragraph-warp"
        v-if="type==='medicalHistoryNow'"
      >
        <div slot="content" class="span-ellipsis">{{node.label}}</div>
        <div class="warp">
        <p :class="{disabled:node.disabled}" class="textEllipsis">
          {{node.label}}
        </p>
         <span class="icon" v-if="node.disabled">废</span>
        </div>

      </el-tooltip>
      <!-- <el-tooltip
        effect="light"
        :open-delay="400"
        :disabled="!!data.MedicalRecordInfos"
        placement="right"
        popper-class="paragraph-warp"
        v-else-if="type==='paragraph'"
      >
        <div
          slot="content"
          style="width:230px;line-height: 22px;overflow:auto;max-height:80vh;"
        >{{node.label}}</div>
        <div :class="data.MedicalRecordInfos?'':'paragraph-text'">{{node.label}}</div>
      </el-tooltip> -->
      <el-tooltip
        effect="light"
        :open-delay="400"
        :disabled="!!data.PersonalMedicalRecordSectionModels"
        placement="right"
        popper-class="paragraph-warp"
        v-else-if="type==='paragraph'"
      >
        <div
          slot="content"
          style="width:230px;line-height: 22px;overflow:auto;max-height:80vh;"
        >{{data.SectionContent}}</div>
        <div :class="data.PersonalMedicalRecordSectionModels?'':'paragraph-text'">{{node.label}}</div>
      </el-tooltip>
      <el-tooltip
        effect="light"
        :open-delay="400"
        placement="right"
        popper-class="paragraph-warp"
        v-else-if="type==='examine' || type==='checkout'||type==='package'"
      >
      <div slot="content" class="span-ellipsis">{{node.label}}</div>
      <span :class="[node.checked&&node.childNodes.length==0?'selectNode':'']">{{node.label}}
      </span>
        <!-- <div slot="content" class="span-ellipsis">{{node.label}}</div>

        <div class="check-font" @click.self="node.data.isCheck=!node.data.isCheck;selectNode($event,node)">
          <el-checkbox
            v-model="node.data.isCheck"
            @change="selectNode($event,node)"
            v-if="node.data.ItemCode"
          >{{node.label}}</el-checkbox>
          <span v-else>{{node.label}}</span>
        </div> -->
      </el-tooltip>
      <!-- <el-tooltip
        effect="light"
        :open-delay="400"
        placement="right"
        popper-class="paragraph-warp"
        v-else-if="type==='package'"
      >
        <div slot="content" class="span-ellipsis">{{node.label}}</div>
        <div class="check-font">
          <el-checkbox
            v-model="node.data.isCheck"
            @change="selectNode($event,node)"
            v-if="!node.data.detailInfoList"
          >{{node.label}}</el-checkbox>
          <span v-else>{{node.label}}</span>
        </div>
      </el-tooltip> -->
      <p v-else-if="type==='medicalHistoryOld'">
        <span>{{node.label}}</span>
        <slot :scope="data" name="medicalHistoryOld" v-if="data.MedicalRecordInfos" />
      </p>
      <!-- <template v-else>{{node.label}}</template> -->
      <el-tooltip
        effect="light"
        :open-delay="400"
        placement="left"
        :content="node.label"
        v-else-if="type==='templateAlter'"
      >
        <!-- <div slot="content" class="span-ellipsis">{{node.label}}</div> -->
        <div>{{node.label}}</div>
      </el-tooltip>
      <template v-else>{{node.label}}</template>
    </span>
  </el-tree>
</template>

<script>
import { GetFormatDateTime, type } from "@/utils/public";
export default {
  name: "medicalNowTree",
  props: {
    treeData: {
      type: Array,
      required: true
    },
    children: {
      type: String
      // required: true
    },
    // 回调
    callBack: {
      type: Function,
      default: () => {}
    },
    type: {
      type: String
    },
    // tree的nodeKey
    nodeKey: {
      type: String,
      default: "Id"
    },
    isHig: {
      type: Boolean,
      default: true
    },
    selectCallback: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      checkList: [],
      ischeck: true
    };
  },
  watch: {
    treeData() {
      console.log("变化", this.activePrescription, this.treeData);
      this.$nextTick(() => {
        this.activePrescription &&
          this.getNode().setCurrentKey(this.activePrescription[this.nodeKey]);
      });
    }
  },
  mounted() {
    console.log(this.treeData, "s树状列表展示");
  },
  computed: {
    defaultProps() {
      if (this.type === "medicalHistoryOld") {
        return {
          children: "MedicalRecordInfos",
          label: (data, node) => {
            if (data.MedicalRecordInfos) {
              return `${GetFormatDateTime(
                "yyyy/MM/dd",
                new Date(data.InHospTime)
              )} ${data.DepartmentName ? data.DepartmentName : ""}`;
            } else {
              // return GetFormatDateTime('MM/dd HH:mm',new Date(data.CreateTime))+' '+data.TemplateName+' '+data.StatusDesc
              return (
                GetFormatDateTime("MM/dd HH:mm", new Date(data.CreateTime)) +
                " " +
                data.TemplateName
              );
            }
          }
        };
      } else if (this.type === "medicalHistoryNow") {
        return {
          children: "MedicalRecordInfos",
          label: (data, node) => {
            if (data.MedicalRecordInfos) {
              return data.AreaName;
            } else {
              // return GetFormatDateTime('MM/dd HH:mm',new Date(data.CreateTime))+' '+data.TemplateName+' '+data.StatusDesc
              return (
                GetFormatDateTime("MM/dd HH:mm", new Date(data.CreateTime)) +
                " " +
                data.TemplateName
              );
            }
          },
          disabled: (data, node) => {
            return data.MedicalRecordInfos ? false : data.Status === 3;
          }
        };
      } else if (this.type === "paragraph") {
        return {
          // children: "MedicalRecordInfos",
          // label: "SectionContent"
          children: "PersonalMedicalRecordSectionModels",
          label: "Name"
        };
      } else if (this.type === "prescription") {
        return {
          children: "MenuContentList",
          label: (data, node) => {
            if (data.MenuContentList) {
             return data.Describe
            } else {
              return (
                GetFormatDateTime(
                  "MM/dd HH:mm",
                  new Date(data.PrescriptionCreateTime)
                ) +
                " " +
                data.PrescriptionTypeName +
                " " +
                data.PrescriptionStatusName
              );
            }
          }
        };
      } else if (this.type === "templateAlter") {
        return {
          children: "MedList",
          label: data => (data.MedList ? data.CategoryName : data.TemplateName)
        };
      } else if (this.type === "orderPackage" || this.type === "package") {
        console.log("treeData", this.treeData);
        return {
          children: "detailInfoList",
          label: "Name"
        };
      } else if (this.type === "historyDoctorAdvice") {
        return {
          children: "children",
          label: "label"
        };
      } else if (this.type === "examine" || this.type === "checkout") {
        console.log(1111);
        return {
          children: "ChildCategory",
          label: "Name"
        };
      }  else if (this.type === "treatmentSingle") {
        return {
          children: "Content",
          label: (data, node) => {
                console.log(new Date(data.InHouseTime),data.InHouseTime,9999999999);

            if (data.Content) {
              let now = data.OutHospTime
                ? GetFormatDateTime("yyyy/MM/dd", new Date(data.OutHospTime))
                : "至今";
              return (
                GetFormatDateTime("yyyy/MM/dd", new Date(data.InHouseTime)) +
                " - " +
                now
              );
            } else {
              return (
                GetFormatDateTime(
                  "MM/dd HH:mm",
                  new Date(data.OrderTime)
                ) +
                " " +
                "治疗单"+" "+data.PrescriptionStatusName
              );
            }
          }
        };
      }
      else {
        return {
          children: "List",
          label: "Name"
        };
      }
    }
  },
  methods: {
    nodeExpand(a,b,c){
console.log(a,b,c);
    },
    checkNode(data,checkedList) {
      console.log(data,'复选框选中节点',checkedList)
        if(this.type==='package'&&data.detailInfoList)return
      let dataId = data.Id
      let obj= checkedList.checkedNodes.find(item => {
        return item.Id==dataId
      })
      console.log(obj)
      if(obj) {
        this.selectNode(true,{data:data})
      }else{
        this.selectNode(false,{data:data})
      }
      
    },
    leafClick(data,node) {
    console.log(data,'选中叶子节点',node,this.children)
      // node.checked=!node.checked
      // this.$set(node.data,'isCheck',!node.data.isCheck)
      if(this.type==='package'&&data.detailInfoList)return
      this.selectNode(node.checked,node)
    },
    getNode() {
      return this.$refs[this.type];
    },
    // 选择变化
    checkChange() {
      this.checkList = this.getNode().getCheckedKeys(true);
    },
    // 当前选中节点变化时触发的事件
    currentChange(data, Node) {
      console.log(
        data,
        Node,
        "当前选中节点变化时触发的事件",
        this.type,
        this.activePrescription
      );
      if (!data[this.children] || data[this.children].length == 0) {
        let parentKey = typeof Node === "object" ? Node.parent.key : Node;
        if (
          (this.activePrescription &&
            this.activePrescription[this.nodeKey] !== data[this.nodeKey]) ||
          !this.activePrescription ||
          this.type === "paragraph"
        ) {
          this.callBack(data, this.type, parentKey);
        }
        this.activePrescription = data;
      } else {
        this.getNode().setCurrentNode(Node);
        this.activePrescription &&
          this.getNode().setCurrentKey(this.activePrescription[this.nodeKey]);
      }
    },
    selectNode(val, node) {
      this.selectCallback(val, node.data);
    }
  }
};
</script>
<style  lang='less'>
.medical-now-tree {
  padding-bottom: 10px;
  .span-ellipsis {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  /deep/ .el-tree-node:focus > .el-tree-node__content {
    background: #fff;
  }
  /deep/.el-tree-node__content>.el-checkbox{
    display: none;
  }
  /deep/.el-tree-node__expand-icon.is-leaf + .el-checkbox{
    display:inline-block;
  }
  .selectNode{
    color: #0071e7;
  }
  &.el-tree--highlight-current
    /deep/
    .el-tree-node.is-current
    > .el-tree-node__content {
    background: #0071e7 !important;
    border-color: #0071e7;

    color: #fff;
    .disabled {
      color: #fff;
    }
  }
  // /deep/ .el-tree-node__content {
  //   padding-left: 20px !important;
  // }
  /deep/ .el-tree-node.is-expanded {
    .my-icon {
      display: inline-block;
    }
  }
  /deep/ .el-tree-node__content {
    height: 32px;
    line-height: 32px;
    border-bottom: 1px solid #dfe7f5;
  }
  &.paragraph {
    /deep/ .el-tree-node__children .el-tree-node__content {
      height: auto;
      //   line-height: 22px;
      border-bottom: 1px solid #dfe7f5;
    }
  }
  // .el-tree-node__children .paragraph-text {
  //   overflow: hidden;
  //   text-overflow: ellipsis;
  //   display: -webkit-box;
  //   line-height: 22px;

  //   // min-height: 32px;
  //   width: 188px;
  //   -webkit-line-clamp: 3;
  //   -webkit-box-orient: vertical;
  //   white-space: normal;
  //   max-height: 66px;
  //   // overflow: hidden;
  // }
  .warp{
    width: 167px;
    position: relative;
        > .icon {
      // float: left;
      position: absolute;
      top: 0;
      left: -24px;
      // top: 5px;
      z-index: 100;
      margin-top: 8px;
      margin-right: 5px;
      color: #fff;
      width: 17px;
      height: 17px;
      background: #f52c2c;
      border-radius: 2px;
      line-height: 17px;
      text-align: center;
      // color: #F52C2C
    }
  }
  .textEllipsis {
    .textEllipsis(167px);
  }
  .disabled {
    color: rgba(0, 6, 34, 0.5);
    // position: relative;

  }
  .check-font {
    /deep/ .el-checkbox {
      margin-left: -10px;
    }
    /deep/.el-checkbox__label {
      font-size: 12px;
      margin-left: -5px;
    }
  }
}
</style>
