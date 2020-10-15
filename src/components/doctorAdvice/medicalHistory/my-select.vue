<template functional> 
  <el-popover placement="bottom-start" width="86" trigger="hover" popper-class="my-select"  :disabled="props.disabled"  
   >
    <ul class="my-select-list">
      <li v-for="(item, index) in props.selectData.list" :key="index" @click="props.itemClick(item.value,props.type)">{{item.text}}</li>
    </ul>
    <span slot="reference" class="my-select-button" :class="{disabled:props.disabled}">{{props.selectData.name}}</span>
  </el-popover>
</template>


<style lang='less'>
.my-select {
  min-width: 86px !important;
  box-sizing: border-box;
  padding: 0;
  .my-select-list {
    font-size: 14px;
    color: #000622;
    > li {
      cursor: pointer;
      line-height: 32px;
      padding: 0 10px;
      &:hover {
        background: #f5f7fa;
      }
    }
  }
}

.my-select-button {
  // opacity: 0.6;
  background: #f3f5f9;
  border: 1px solid rgba(0, 113, 231, 0.9);
  border-radius: 2px;
  box-sizing: border-box;
  display: block;
  color: rgba(0, 113, 231, 0.9);
  height: 26px;
  width: 86px;
  cursor: pointer;
  position: relative;
  line-height: 24px;
  padding-left: 6px;
&.disabled{
  cursor: not-allowed;
    color: rgba(25, 137, 250, 0.4);
    // background-color: #ecf5ff;
    border-color: rgba(25, 137, 250, 0.4);
}
  &::after {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-width: 8px;
    border-style: solid;
    border-color: #c5d0d9 transparent transparent transparent;
    right: 6px;
    top: 9px;
  }
}
</style>
