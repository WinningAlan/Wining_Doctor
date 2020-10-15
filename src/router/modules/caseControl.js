// write your comment here...
export default [
  {
    path: '/caseControl',
    name: 'caseControl',

    component: () => import('@/views/CaseControl/index'),
    meta: {
      keepAlive: true,
      deepth: 1
    }
  }
]
