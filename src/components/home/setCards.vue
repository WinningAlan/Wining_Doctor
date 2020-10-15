<template>
  <div class="setCards">
    <div class="setCardsContent">
      <div class="select">
        首页显示
        <span>拖拽以调整顺序</span>
      </div>

      <ul class="selectCard">
        <draggable
          v-model="selectCards"
          :options="{animation:500}"
          group="card"
          style="overflow:hidden"
        >
          <li v-for="(item,index) in selectCards" :key="index">&nbsp;&nbsp;&nbsp;{{item.Name}}</li>
        </draggable>
      </ul>
      <div class="unselect">
        首页隐藏
        <span>拖拽以添加到首页显示</span>
      </div>
      <ul class="unselectCard">
        <draggable
          v-model="unSelectCards"
          :options="{animation:500}"
          group="card"
          style="overflow:hidden"
        >
          <li v-for="(item,index) in unSelectCards" :key="index">&nbsp;&nbsp;&nbsp;{{item.Name}}</li>
        </draggable>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import draggable from "vuedraggable";
export default {
  components: {
    draggable
  },
  data() {
    return {
      allCards: [],
      selectCards: [],
      unSelectCards: []
    };
  },
    props: {
    initialize: Boolean
  },
    watch: {
    initialize: {
      handler: function(val, oldVal) {
        if (val) {
      this.allCards = JSON.parse(JSON.stringify(this.cards));
      this.selectCards=[]
      this.unSelectCards=[]
    this.allCards.forEach(item => {
      if (item.Ifcover) {
        this.selectCards.push(item);
      } else {
        this.unSelectCards.push(item);
      }
    });
        }
      },
      immediate: true
    },

  },
  methods: {
    async save() {
      let arr = []
      let all = [];
      this.selectCards.forEach(item => {
        item.Ifcover = true;
        all.push(item);
        arr.push(item.Code)
      });
      this.unSelectCards.forEach(item => {
        item.Ifcover = false;
        all.push(item);
      });
      let obj = {
        DiagnosisAreaType: this.selectArea.DiagnosisAreaType,
        ItemCode: arr
      };
      this.$store.commit("home/SET_CARDS", all);
      let result = await this.$Api.patientSummaryConfig(obj)
      if(result.Status) {
        return true
        this.$msg.success('操作成功')
      }
    }
  },
  computed: {
    ...mapGetters({
      cards: "home/GET_CARDS",
      selectArea:"home/GET_SELECTAREA"
    })
  }
};
</script>
<style lang="less" scoped>
.setCards {
  /deep/.el-dialog .el-dialog__header {
    border-bottom: none;
  }
  .card {
    overflow: hidden;
    li {
      float: left;
      margin: 0 10px 10px 0;
      width: 120px;
      //text-align: center;
      height: 32px;
      line-height: 32px;
      cursor: pointer;
      border-radius: 4px;
    }
  }
  .setCardsContent {
    padding: 10px 25px;
    height: 300px;
    overflow: auto;
    .select,
    .unselect {
      margin-bottom: 10px;
      font-size: 15px;
      color: #333;
      font-weight: bold;
      span {
        color: #999999;
        font-size: 14px;
        margin-left: 10px;
        font-weight: normal;
      }
    }
    .selectCard {
      .card;
      li {
        border: 1px solid @blueMain;
        color: @blueMain;
      }
    }
    .unselectCard {
      .card;
      li {
        border: 1px solid #eee;
        color: #333;
      }
    }
  }
}
</style>