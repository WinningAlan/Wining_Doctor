<!--
 * @Author: your name
 * @Date: 2020-09-22 10:09:48
 * @LastEditTime: 2020-09-22 10:54:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \EDIS\Doctor\src\components\common\promptMessage.vue
-->
<template>
  <div class="prompt-message">
    <div v-loading="true" element-loading-background="rgba(0, 0, 0, 0)"></div>
    <div class="text">{{option.message}}</div>
  </div>
</template>
<script>
export default {
  name: "promptMessage",
  props: {
    option: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="less" scoped>
.prompt-message{
  width:300px;
  height:140px;
  border: 1px solid blue;
  background:rgb(241,248,255);
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-content: center;
  text-align: center;
  padding-top:30px;
  box-sizing: border-box;
  .text{
    margin-top:50px;
    font-size: 14px;
  }
}
</style>
