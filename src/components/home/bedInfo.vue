<template>
    <div class="bedInfo">
        <pull-to @infinite-scroll="getPatientList">
         <div class="noData" v-if="patientList.length==0&&showPatListLoading==false">
         <svg-icon iconClass="searchNoData" class="noDataImg"></svg-icon>
         <div class="noDataWord">没有找到符合条件的结果</div>
    </div>
            <bed-card v-for="(item,index) in patientList" :key="index" :patInfo="item" v-bind="$attrs"></bed-card>
        </pull-to>
    </div>
</template>
<script>
import bedCard from '@/components/home/bedCard'
import {mapGetters} from 'vuex'
import PullTo from "vue-pull-to";
export default {
    components:{
        bedCard,
        PullTo
    },
    data() {
        return{}
    },
    props:{
        getPatientList:Function,//
        showPatListLoading:Boolean,//
    },
    computed:{
        ...mapGetters({
            patientList:'public/GET_PATIENTTABLELIST'
        })
    }
}
</script>
<style scoped lang="less">
.bedInfo{
    padding: 0 13px 0 15px;
    height: calc(~"(100% - 20px)");
    //height: 100%;
    .noData{
    //height: 100%;
    text-align: center;
    margin-top:30px;
    .noDataImg{
      width:200px;
      height: 150px;
    }
    .noDataWord{
      margin-top:15px;
      text-align: center;
      font-size: 14px;
      color:#000;
    }
  }
}
</style>
