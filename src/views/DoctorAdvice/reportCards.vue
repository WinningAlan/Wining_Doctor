<template>
 <div class='reportCards'>
   <textareaSelsect :selectList="selectList" style="width:150px" v-model="something"></textareaSelsect>
 </div>
</template>

<script>
import textareaSelsect from '../../components/common/textareaSelsect.vue'

export default {
  name:'reportCards',//报告卡
  components:{
textareaSelsect
  },
  data () {
    return {
      something:'',
      selectList:[
  {
    text: "待提交",
    value: 1
  },
  {
    text: "已提交",
    value: 2
  },
  {
    text: "已审核",
    value: 3
  },
  {
    text: "已退回",
    value: 4
  },
  {
    text: "执行中",
    value: 5
  },
  {
    text: "已停止",
    value: 6
  },
  {
    text: "已作废",
    value: 7
  }
]
    }
  },
 methods: {
  },
}

</script>
<style scoped lang='less'>
</style>
