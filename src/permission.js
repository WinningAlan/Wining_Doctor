import router from './router'
// import routerList from './router/modules'; // 引入业务逻辑模块
import store from './store'
import {
  getSession,
  setSession
} from './utils/storage';
import userApi from '@/api/user';
let user = getSession("user");
store.commit("public/SET_USER", user);
// 所有权限的name
let routerConfig = store.getters['public/GET_PERMISSIONS'];

// 不参与权限的路由
let deftRouter = ['allMessage', 'lost']
// 所有权限的一级路由
// let navList = store.getters['public/GET_NAVLIST'].map(item => item.UiRouter);
let navList = ['home','caseControl','shiftDuty','personal','doctorAdvice'];

// let routerListName = routerList.map(item => item.name);
router.beforeEach((to, from, next) => {
  // console.log(to)
  // 开发环境下登录
  let name = to.name

  if (!user && process.env.NODE_ENV !== 'production') {
    userApi.login({
      // No: "007123",
      // Pwd: "Winning@",
      No: "012",
      Pwd: "Winning@",
      // No: "90066",
      // Pwd: "Winning@",
      HospitalAreaId:"ccec3b76-7e1f-e911-80cd-0050568e1b08"
    }).then(res => {
      setSession('user', res.Data);
      store.commit("public/SET_USER", res.Data);
      user = res.Data;
      routerConfig = store.getters['public/GET_PERMISSIONS'];

      // navList = store.getters['public/GET_NAVLIST'].map(item => item.UiRouter);
      // console.log(routerConfig, "routerConfig", navList);
      // console.log(name)
      // if (!name) {
      //   let deftName = navList[0] || 'lost'
      //   next({
      //     name: deftName
      //   })
      // } else {
      //   next()
      // }
      next()
    })
    return
  }
  if (!user && process.env.NODE_ENV === 'production') {
    window.location.href = "./#/login"
    return
  }
  // '/'默认跳转的页面

  // if (!name) {
  //   let deftName = navList[0] || 'lost'

  //   next({
  //     name: deftName
  //   })
  //   return;
  // }
  // 权限控制
  if (routerConfig.includes(name) || deftRouter.includes(name)) {
    next();
    // console.log(routerConfig, "a1", deftRouter, name,navList)
  } else {
    // '/'默认跳转路由
    let deftName = 'lozst'
    if (navList.includes(name)) {
      deftName = routerConfig[0] || 'lost'
    }

    next({
      name: deftName
    })
  }
})
