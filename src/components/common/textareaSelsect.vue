<template>
  <div class="textareaSelsect">
    <el-popover placement="bottom-start" v-model="isShow" popper-class="textarea-warp" trigger="manual" :visible-arrow="false"  ref="popover" :width='width' >
        <ul class="el-scrollbar__view el-select-dropdown__list" @click="select">
            <li class="el-select-dropdown__item" v-for="item in selectList" :class="{selected:item.value==value}" :key="item.value" :data-id="item.value">{{item.text}}</li>
        </ul>
    </el-popover>
    <el-input
    ref="textarea"
      type="textarea"
      v-popover:popover
      @focus="isShow=true"
      @blur="isShow=false"
      autosize
      resize="none"
      placeholder="请输入内容"
      :value="value"
      @input="$emit('input', $event)"
    ></el-input>
  </div>
</template>

<script>
export default {
  name: "textareaSelsect",
  props:{
      selectList:{
          type:Array,
          default:()=>{
              return []
          }
      },
      value:""
  },
  data() {
    return {
        // value:'',
        width:'',
        isShow:false
    };
  },
  mounted() {
      this.width=this.$refs.textarea.$el.offsetWidth
      console.log(this.$refs.textarea.$el.offsetWidth);
  },
  methods: {
      select(el){
          let target=el.target;
          if (target.tagName==='LI') {
              this.$emit('input',target.dataset.id)
            //  this. value=target.dataset.id
            //  this.isShow=false
          }
      }
  }
};
</script>
<style  lang='less'>
.textarea-warp.el-popover{
    padding: 0;
    transform: translateY(-10px);
}
.textareaSelsect{
    .el-textarea .el-textarea__inner{
        border:none;
        background:  @controlBg; 
    }
}
</style>
