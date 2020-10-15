import Vue from 'vue';

// import './assets/styles/font-awesome.min.css'
import './assets/styles/index.less'
import {
  getSession
} from './utils/storage';
import './icons' // icon
import App from './App.vue';
import router from './router/index';
import store from './store/index';
import allApi from './api';
import './permission.js';
import {
  msg,
} from './utils/msg';

import './plugins/element.js'

import print from "./utils/print";
import timeFilter from './filters/timeFilter.js';
import sexFilter from './filters/sexFilter.js';
import changeSecondToTime from './filters/changeSecondToTime.js'
import nurseLevelFilter from './filters/nurseLevelFilter.js'
import msgStatus from "./filters/msgStatus.js"
import statusFilter from "./filters/statusFilter.js"
import publicFilter from "./operationFilter/publicFilter"
import userFilter from "./operationFilter/userFilter"
import departmentFilter from "./filters/departmentFilter";
import costFilter from "./filters/costFilter"
import ageFilter from './filters/ageFilter.js';
import birthDayFilter from "./filters/birthDayFilter.js"
import IMIS from './utils/IMIS';
Vue.filter('timeFilter', timeFilter);
Vue.filter('birthDayFilter', birthDayFilter);
Vue.filter('sexFilter', sexFilter);
Vue.filter('changeSecondToTime', changeSecondToTime)
Vue.filter('nurseLevelFilter', nurseLevelFilter)
Vue.filter('costFilter', costFilter)
Vue.filter('msgStatus', msgStatus)
Vue.filter('statusFilter', statusFilter)
Vue.filter("publicFilter", publicFilter)
Vue.filter("userFilter", userFilter)
Vue.filter("departmentFilter", departmentFilter)
Vue.filter("ageFilter", ageFilter)

Vue.use(print)
window.URLCONFIG = getSession("urlConfig") || {

  "Master": "http://172.16.0.161:17085",
  "DataPlatForm": "http://172.16.0.161:17082",
  "Nursing": "http://172.16.0.161:17086",
  "Triage": "http://172.16.0.161:17088",
  "Emr": "http://172.16.0.161:17084",
  "ChestPain": "http://172.16.0.161:17082",
  "DoctorAdvicePrint": "http://172.16.0.161:8080",
  "Stroke": "http://172.16.0.161:18090",
  "Quality": "http://172.16.0.161:17087",
  "Trauma": "http://172.16.0.161:17090",
  "Doctor": "http://172.16.0.161:17083",
  "Consultation": "http://172.16.0.161:17081"


}

Vue.config.productionTip = false;
Vue.prototype.$msg = msg;
Vue.prototype.$Api = allApi;
Vue.prototype.$IMIS = new IMIS();

console.log(store.state)
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
