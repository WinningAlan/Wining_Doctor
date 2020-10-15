import home from '@/views/Home/index';

export default [
  // 首页
  {
    path: '/home',
    name: 'home',
    component: home,
    meta: {
      keepAlive: false,
      deepth: 1
    }
  }

];
