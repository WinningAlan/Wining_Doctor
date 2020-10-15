<template>
    <div class="feed-back">
         <div class="title">反馈内容:</div>
         <div class="content">{{feedBackData.FeedBack}}</div>
    </div>
</template>
<script>
export default {
    props:{
        feedBackData:{
            type:Object,
            default:()=>{
                return {}
            }
        }
    }
}
</script>
<style lang="less" scoped>
 .feed-back{
     padding: 30px 20px;
     display: flex;
     .title{
         padding-right:10px;
     }
 }
</style>