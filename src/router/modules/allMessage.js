// import analysis from '@/views/Analysis/index';
let allMessage = () => import('@/views/allMessage/index')

export default [
  // 统计分析
  {
    path: '/allMessage',
    name: 'allMessage',
    component: allMessage,
    meta: {
      keepAlive: false,
      deepth: 1
    }
  },
];
