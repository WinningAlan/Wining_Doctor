import Vue from 'vue';
import VueRouter from 'vue-router';
import RouterConfig from './modules'; // 引入业务逻辑模块
import CommonRouters from './common';

Vue.use(VueRouter);
export default new VueRouter({
  mode: 'hash', // 需要服务端支持
  scrollBehavior: () => ({ y: 0 }),
  base:"/Content/Doctor",
  routes: RouterConfig.concat(CommonRouters),
});
