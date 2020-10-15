export default [
  // 默认页面
  {
    path: '/',
    redirect: '/home',
    hidden: true,
  },
  // 404
  {
    path: '*',
    name: 'lost',
    component: () => import('@/views/404'),
    meta: {
      keepAlive: false,
      deepth: 1
    }
  },
];
