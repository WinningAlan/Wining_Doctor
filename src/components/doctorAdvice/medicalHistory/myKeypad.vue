<template>
  <!-- <div class='myKeypad'></div> -->
  <el-popover
    placement="right-start"
    popper-class="my-keypad"
    width="130"
    :visible-arrow="false"
    trigger="focus"
  >
    <ul class="num-list">
      <li v-for="item in numList" :key="item" @click="keyClick(item)">{{item}}</li>
    </ul>

    <slot name="reference" slot="reference" />
  </el-popover>
</template>

<script>
export default {
  name: "myKeypad", //虚拟键盘
  props: {
    value: {
      required: true
    },
    focusIndex: {
    //   type: Number,
      required: true
    }
  },
  data() {
    return {
      numList: [7, 8, 9, 4, 5, 6, 1, 2, 3, "C", 0, "←"]
    };
  },
  methods: {
    keyClick(val) {
        console.log(this.value,this.focusIndex);
// return
      let str = this.value === undefined ? "" : this.value + "";
      let index=this.focusIndex>=str.length?str.length:this.focusIndex;
      index=index===undefined?0:index;
      console.log(index,str,val,val === "←",'stree');
      if (val === "C") {
        this.$emit("update:value", undefined);
      } else if (val === "←") {
          console.log(!index,index,'dd',str.substring(0, index - 1),str.substring(index, str.length),str);

        if (!index) return;
        str =
          str.substring(0, index - 1) +
          str.substring(index, str.length);
        index -=1;
        index = index < 0 ? 0 : index;
        str = str ? str : undefined;
        this.$emit("update:focusIndex", index);
        this.$emit("update:value", str);
      } else {
        str =
          str.substring(0, index) +
          val +
          str.substring(index, str.length);
        this.$emit("update:focusIndex", index + 1);
        this.$emit("update:value", str);
      }
    }
  }
};
</script>
<style  lang='less'>
.my-keypad {
  &.el-popover {
    padding: 0;
    transform: translateX(15px);
  }
  .num-list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 150px;
    align-content: center;
    line-height: 24px;
    > li {
      width: 50px;
      box-sizing: border-box;
      border-right: 2px solid #d2d6d8;
      border-bottom: 2px solid #d2d6d8;
      text-align: center;
      cursor: pointer;
      &:nth-child(3n + 3) {
        border-right: transparent;
      }
      &:nth-child(n + 10) {
        border-bottom: transparent;
      }
      &:hover {
        background: rgba(15, 128, 237, 0.2);
      }
    }
  }
}
</style>
