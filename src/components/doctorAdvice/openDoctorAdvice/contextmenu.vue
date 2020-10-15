<template>
  <div
    class="contextmenu cl"
    v-show="visible"
    :style="{ left: left + 'px', top: top + 'px' }"
    @click.stop="() => {}"
  >
    <ul class="drug" v-show="drugList.length > 1">
      <li
        :class="{ active: item.HisMedId === activeDrug.HisMedId }"
        v-for="(item, index) in drugList"
        :key="index"
        @click="activeDrug = item"
      >
        {{ item.MedicineName }}
      </li>
    </ul>
    <ul>
      <li
        v-for="(item, index) in option"
        :key="index"
        @click="viewDetails(item.value)"
      >
        <a
          :href="activeDrug.ViewDrugDetailInfoUrl"
          target="_blank"
          v-if="shaoXingTwoHospital == 1 && activeDrug.ViewDrugDetailInfoUrl"
          >{{ item.text }}</a>
        <span v-else>{{ item.text }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "contextmenu", //右键菜单
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      drugList: [],
      activeDrug: {},
      option: [
        {
          text: "查看药品说明书",
          value: 11,
        },
        {
          text: "查看药品重要提示",
          value: 51,
        },
        {
          text: "查看中药材专论",
          value: 24,
        },
      ],
    };
  },
  watch: {
    visible(value) {
      if (value) {
        document.body.addEventListener("click", this.closeMenu);
      } else {
        document.body.removeEventListener("click", this.closeMenu);
      }
    },
  },
  computed: {
    ...mapGetters({
      shaoXingTwoHospital: "configuration/GET_shaoXingTwoHospital",
    }),
  },
  created() {
    if (this.shaoXingTwoHospital == 1) {
      this.option = [
        {
          text: "查看药品说明书",
          value: 11,
        },
      ];
    } else {
      this.option = [
        {
          text: "查看药品说明书",
          value: 11,
        },
        {
          text: "查看药品重要提示",
          value: 51,
        },
        {
          text: "查看中药材专论",
          value: 24,
        },
      ];
    }
  },

  methods: {
    // 查询药品详细信息
    viewDetails(value) {
      console.log(this.activeDrug,"this.activeDrug")
      if (
        this.shaoXingTwoHospital == 1 &&
        this.activeDrug.ViewDrugDetailInfoUrl
      )
        return;
      this.$parent.rationalDrugUse.hisQueryData(this.activeDrug, value);
      this.closeMenu();
      // console.log(this.$parent.rationalDrugUse.hisQueryData,value);
    },
    openMenu(row, e, offsetLeft, offsetWidth) {
      this.drugList = row;
      this.activeDrug = row[0];
      let menuMinWidth = 128;
      let menuMinHeight = 100;
      let maxWidth = document.body.offsetHeight - 70;
      let maxLeft = offsetWidth - menuMinWidth; // left boundary
      let maxtop = maxWidth - menuMinHeight;
      let left = e.clientX - offsetLeft; // 15: margin right
      let top = e.clientY - 60;
      this.$nextTick(() => {
        console.log(
          offsetLeft,
          offsetWidth,
          this.$el.offsetWidth,
          this.$el.offsetHeight
        );

        menuMinWidth = this.$el.offsetWidth;
        menuMinHeight = this.$el.offsetHeight;
        maxLeft = offsetWidth - menuMinWidth; // left boundary
        maxtop = maxWidth - menuMinHeight;
        if (left > maxLeft) {
          this.left = maxLeft;
        } else {
          this.left = left;
        }
        if (top > maxtop) {
          this.top = maxtop;
        } else {
          this.top = top;
        }
      });
      if (left > maxLeft) {
        this.left = maxLeft;
      } else {
        this.left = left;
      }
      if (top > maxtop) {
        this.top = maxtop;
      } else {
        this.top = top;
      }

      this.visible = true;
    },
    closeMenu() {
      this.visible = false;
    },
  },
};
</script>
<style scoped lang='less'>
.contextmenu {
  margin: 0;
  background: #fff;
  z-index: 3000;
  position: absolute;
  padding: 5px 0;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 400;
  min-height: 100px;
  color: #606266;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  ul {
    float: left;
    &.drug {
      border-right: 1px solid #eee;
      min-height: 100px;
    }
  }
  li {
    margin: 0;
    padding: 7px 16px;
    box-sizing: border-box;
    min-width: 128px;
    cursor: pointer;
    &:hover {
      background: #f5f7fa;
      color: #409eff;
    }
    &.active {
      color: #409eff;
      // font-weight: bold;
    }
  }
}
</style>
