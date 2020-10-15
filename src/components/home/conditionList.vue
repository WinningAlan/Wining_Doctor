<template>
  <div class="conditionList">
    <div class="left" @click="turnLeftOrRight(-1)" :class="{noClick:positions===0}"></div>
    <div class="conditionListContent" :style="{width:maxLength*250+'px'}">
      <div
        class="conditionListCardList"
        :style="{width:(conditionList.length+1)*250+'px',
        transform:`translatex(${-1*positions*250}px)`,
        transition:`transform 1s`}"
      >
        <div
          :class="{activeCard:active==index}"
          class="conditionListCard"
          v-for="(item,index) in conditionList"
          :key="index"
          @click="refreshData(item,index)"
        >
          <div class="conditionListCardLeft">{{item.Name}}</div>
          <div class="conditionListCardRight">{{item.Count}}</div>
        </div>
        <div class="conditionListCard" @click="cardAdd">
          <div class="cardAdd">
            <div>+</div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="right"
      @click="turnLeftOrRight(1)"
      :class="{noClick:(conditionList.length+1)<=(positions+maxLength)||((conditionList.length+1)-maxLength)<0}"
    ></div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  props: {
    getPatientList: Function
  },
  data() {
    return {
      active: 0, // 当前选中的卡片
      maxLength: 0, //最多显示的卡片数
      positions: 0, // 计算卡片偏移量
      conditionList: [], //展示概览卡片
      // cardContent: {} //当前选中的卡片
    };
  },
  methods: {
    // 轮播
    turnLeftOrRight(num) {
      if (num == -1 && this.positions == 0) {
        return;
      }
      if (
        num == 1 &&
        ((this.conditionList.length+1)<=(this.positions+this.maxLength)||((this.conditionList.length+1)-this.maxLength)<0)
      ) {
        return;
      }
      this.positions += num*this.maxLength;
      console.log(this.positions,999,num);
    },
    refreshData(item,index) {
      this.active = index;
      this.cardContent = item;
      this.check(item,index)
      this.$parent.$refs.head.getPatSummaryByDiagnosisArea(this.searchSelectDep)
    },
    // 选中卡片
    check(item, index) {
      this.active = index;
      this.cardContent = item;
      this.getPatientList(1);
    },
    // 添加新的卡片
    cardAdd() {
      let obj = {
        title: "编辑",
        width: "650px",
        component: "setCards",
        visible: true,
        data: this.cards
      };
      this.$store.commit("public/SET_DIALOGDATA", obj);
    }
  },
  mounted() {
    this.maxLength = Math.floor((document.body.clientWidth - 116) / 250);
  },
  computed: {
    ...mapGetters({
      cards: "home/GET_CARDS",
      selectArea: "home/GET_SELECTAREA",
      searchSelectDep:"home/GET_SEARCHSELECTDEP"
    }),
    //当前选中的卡片
        cardContent: {
      get: function() {
        return this.$store.getters["home/GET_CARDCONTENT"];
      },
      // setter
      set: function(newValue) {
        this.$store.commit("home/SET_CARDCONTENT", newValue);
      }
    }
  },
  watch: {
    selectArea:function(newValue) {
      this.active = 0
      this.positions=0
    },
    cards: {
      deep: true,
      handler: function(newValue) {
        console.log(newValue,'卡片',this.active,this.positions);
        // if(newValue.length==0) {
        //   return
        // }
        this.conditionList = [];
        newValue.forEach(item => {
          if (item.Ifcover) {
            this.conditionList.push(item);
          }
        });
        //this.positions=0
        if (this.conditionList.length > 0) {
          // let i=0;
          this.conditionList.forEach((el,index)=>{
            if(el.Code===this.cardContent.Code){
                this.active=index
            }
          })
          // this.check(this.conditionList[this.active], this.active);
        }else{
          this.positions = 0
          this.$store.commit("public/SET_PATIENTTABLELIST", []);
        }
      }
    }
  }
};
</script>
<style scoped lang="less">
.conditionList {
  padding: 0 25px;
  background-color: #dfe7f5;
  height: 110px;
  .conditionListContent {
    height: 110px;
    width: 100%;
    overflow: hidden;
    float: left;
    .conditionListCardList{
      animation: name duration timing-function delay iteration-count direction fill-mode;
    }
  }
  .arrow {
    width: 20px;
    background-color: white;
    height: 90px;
    margin-top: 10px;
    margin-bottom: 10px;
    position: relative;
    cursor: pointer;
  }
  .left {
    float: left;
    .arrow;
    margin-right: 10px;
    &::after {
      position: absolute;
      display: block;
      content: "";
      border-width: 10px;
      border-style: solid;
      border-color: transparent rgb(226, 226, 226) transparent transparent;
      top: 40%;
      left: -5px;
    }
  }
  .noClick {
    cursor: not-allowed !important;
    background: #f3f3f3 !important;
  }
  .right {
    float: left;
    margin-left: 10px;
    .arrow;
    &::after {
      position: absolute;
      display: block;
      content: "";
      border-width: 10px;
      border-style: solid;
      border-color: transparent transparent transparent #e2e2e2;
      top: 40%;
      left: 5px;
    }
  }
  // 选中卡片状态
  .activeCard {
    border-bottom: 4px solid @blueMain !important;
    color: @blueMain !important;
    &::after {
      content: "";
      display: block;
      width: 0;
      height: 0;
      border-width: 7px;
      border-style: solid;
      border-color: @blueMain transparent transparent transparent;
      position: absolute;
      top: 90px;
      left: 102px;
    }
  }
  .conditionListCard {
    cursor: pointer;
    float: left;
    margin: 10px 6.7px;
    width: 236px;
    height: 86px;
    border-bottom: 4px solid #fff;
    position: relative;
    border-radius: 2px;
    color: @wordColor;
    background: url("../../assets/imges/cardBg.png") no-repeat;
    background-size: 236px 90px;
    .conditionListCardLeft {
      float: left;
      font-size: 20px;
      height: 100%;
      line-height: 86px;
      padding-left: 16px;
    }
    .conditionListCardRight {
      float: right;
      font-size: 44px;
      font-weight: bold;
      height: 100%;
      line-height: 86px;
      opacity: 0.7;
      padding-right: 16px;
    }
    .cardAdd {
      width: 56px;
      height: 56px;
      border: 2px solid #f4f8fc;
      border-radius: 4px;
      font-size: 61px;
      font-weight: bold;
      color: #f4f8fc;
      margin-left: (236-56)/2px;
      margin-top: (90-56)/2px;
      > div {
        margin-top: -25px;
        margin-left: 4px;
      }
    }
  }
}
</style>