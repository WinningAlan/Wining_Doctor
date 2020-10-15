// 提供具名插槽 content 和默认插槽 props详见下方注释 ---zhangfeng 2018.12.13
// 对弹窗进行优化,减少porps,仅定义title、visible、top、custom、isfooter、btn,其他属性事件可根据element文档的中的介绍
// 直接加载组件上，该组件会自动继承
<template>
  <el-dialog
    v-bind="$attrs"
    v-on="$listeners"
    :top="top"
    :visible="visible"
    :show-close='false'
    :append-to-body="true"
    :lock-scroll="false"
    :class="custom?{[custom]:true}:''"
    ref="myRef"
  >
    <template slot="title" v-if="title">
      <span class="el-dialog__title">{{title}}</span>
      <button type="button" aria-label="Close" class="el-dialog__headerbtn" @click="close(false)" v-if="!isDeclareComponent">
        <i class="el-dialog__close el-icon el-icon-close"></i>
      </button>
    </template>
    <slot></slot>

    <slot name="content"></slot>
    <div slot="footer" class="dialog-footer" v-if="isfooter">
      <el-button @click="close(false)" v-if="btn.length!==1&&!isDeclareComponent">{{btn[1]? btn[1]:'取 消'}}</el-button>
      <el-button type="primary" @click="close(true)" :disabled="activeType!==100">{{btn[0]?btn[0] :'确 定'}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
function bodyScroll(event) {
  event.preventDefault();
}
export default {
  name: "myAlter",
  mounted() {
    window.addEventListener("resize", this.listenResize, false);
  },
  destroyed() {
    window.removeEventListener("resize", this.listenResize, false);
  },
  methods: {
    close(bl=false) {
      console.log("object");
      this.callback(bl);
    },
    listenResize() {
      this.setDomPosition();
    },
    setDomPosition() {
      if (document.getElementsByClassName("el-dialog").length == 0) {
        return;
      }
      let domList = document.getElementsByClassName("el-dialog");

      domList = Array.prototype.slice.call(domList);
      domList.forEach(dom => {
        let domHeight = dom.offsetHeight;
        let domWidth = dom.offsetWidth;
        let left = (document.documentElement.clientWidth - domWidth) / 2;
        let top = (document.documentElement.clientHeight - domHeight) / 2;

        dom.style.top = top + "px";
        dom.style.left = left + "px";
      });
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogFormVisible = val;
        if (val) {
          document.body.addEventListener("scroll", bodyScroll, false);
        } else {
          document.body.removeEventListener("scroll", bodyScroll, false);
        }
      },
      immediate: true
    }
  },
  updated() {
    if (this.visible) {
      this.setDomPosition();
    }
  },
  props: {
    // 必传 弹窗头部内容
    title: {
      type: String,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    },
        // 必传 控制弹窗开关和确认后的处理逻辑，回调函数的参数第一个表示取消还是保存
    callback: {
      type: Function,
      required: true
    },
        // 弹窗底部按钮文字内容 ，默认2个按钮 ‘取消’ ‘确定’
    btn: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 是否显示弹窗底部 默认显示
    isfooter: {
      type: Boolean,
      default: true
    },
        // 弹窗主体margin-top值 默认0
    top: {
      type: String,
      default: "0"
    },
        // 自定义样式
    custom: {
      type: String,
      default: ""
    },
    activeType:{
      type:Number,
      default:100
    },
    //新冠申报用户信息需要特殊化按钮
    isDeclareComponent:{
      type: Boolean,
      default: false
    } 
  }
};
</script>
<style lang="less" scoped>
/deep/ .el-dialog{
 .el-dialog__header {
  padding: 0;
  margin: 0 19px;
  border-bottom: 1px dotted #cecece;
.el-dialog__title {
  font-size: 16px;
  color: #666666;
  line-height: 47px;
  height: 47px;
}
.el-dialog__headerbtn .el-dialog__close {
  font-size: 24px;
}
.el-dialog__headerbtn {
  top: 0px;
  width: 48px;
  height: 48px;
}
}
}

/deep/ .el-dialog {
  backface-visibility: hidden;
  top: 50%;
  position: absolute;
  left: 50%;

  margin: 0;
  transition-duration: 0;

  // transform: translate(-50%,-50%);
}
/deep/ .el-dialog__footer {
  height: 58px;
  box-shadow: 0 -2px 7px 0 rgba(102, 136, 169, 0.16);
  padding: 11px 0;
}
/deep/ .el-dialog__body {
  padding: 0px;
  // max-height: 658px;
  // overflow: auto;
}
/deep/ .el-dialog--center .el-dialog__body {
  padding: 0;
}
/deep/ .el-button {
  width: 88px;
  height: 36px;
  margin-right: 21px;
  line-height: 12px;
  font-size: 16px;
}
/deep/ .el-button--primary {
  background: #1989fa;
  border-radius: 3px;
}
/deep/ .el-button + .el-button {
  margin-left: 0;
}
/deep/ .el-button--default {
  border: 1px solid #1989fa;
  border-radius: 3px;
  color: #1989fa;
}
.title /deep/ .el-dialog__header {
  border: none;
  .el-dialog__title {
    font-size: 14px;
    font-weight: bold;
    border-left: 3px solid #0f80ed;
    padding-left: 20px;
    color: #333333;
  }
}
// .glitter /deep/ .el-dialog {
//   transform: none;
//   margin-top: 130px!important;
//   top: 0;
// }
// .glitters /deep/ .el-dialog {
//   transform: none;
//   margin-top: 180px!important;
//   top: 0;
// }
</style>
