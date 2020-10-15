export default [
    {
    path:'/shiftDuty',
    name:'shiftDuty',
        component: () => import('@/views/ShiftDuty/index'),
        meta: {
            keepAlive: false,
            deepth: 1
          }
    }
]