<template>
    <div class="personal">
        <div class="personalLeft">
            <sidebar :navList="navData" :isDoCollapse="false"></sidebar>
        </div>
        <div class="personalRight">
            <app-main></app-main>
            <!-- <router-view></router-view> -->
        </div>
    </div>
</template>
<script>
import sidebar from "@/views/Layout/sidebar.vue";
import appMain from "@/views/Layout/appMain.vue";
import {mapGetters} from 'vuex'
export default {
    components:{
        sidebar,
        appMain
    },
    data() {
        return{
            navData:[]
        }
    },
    computed:{
        ...mapGetters({
            navList: "public/GET_NAVLIST",
        })
    },
    beforeRouteEnter(to,from,next) {
        next(ve => {
            let name = to.path.split("/")[1]
            for(let index=0;index<ve.navList.length;index++) {
                let ele = ve.navList[index];
                if(name===ele.UiRouter) {
                    ve.navData = ele.Children
                    return
                }
            }
        })
    }
}
</script>
<style lang="less" scoped>
.personal{
    display: flex;
    border-top: 10px solid #dfe7f5;
    .personalLeft{
        box-shadow: 5px 0px 5px #e0e0e0;
    }
    .personalRight{
        flex:1;
        .app-main{
            height: calc(~"(100% - 20px)");
        }
    }
}
</style>