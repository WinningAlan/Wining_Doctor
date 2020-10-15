export default [{
  path: '/personal',
  name: 'personal',
  component: () => import('@/views/Personal/index'),
  meta: {
    keepAlive: false,
    deepth: 1
  },
  children: [{
      path: 'orderPackage',
      name: 'orderPackage',
      component: () => import('@/views/Personal/orderPackage'),
      meta: {
        keepAlive: false,
        deepth: 2
      }
    },
    {
      path: 'medicalTemplate',
      name: 'medicalTemplate',
      component: () => import('@/views/Personal/medicalTemplate'),
      meta: {
        keepAlive: false,
        deepth: 2
      }
    }
  ]
}]
