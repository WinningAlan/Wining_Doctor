/**
 * Created by mr on 2018/12/18.
 */
import Vue from 'vue';
import Vuex from 'vuex';
import VuexConfig from './modules'; // 引入业务逻辑模块

Vue.use(Vuex);
export default new Vuex.Store({
  modules: VuexConfig,
});
