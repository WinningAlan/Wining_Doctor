
export default [
  // 患者详情
  {
    path: '/doctorAdvice',
    name: 'doctorAdvice',
    component: () => import('@/views/Layout/index'),
    meta: {
      keepAlive: false,
      deepth: 2
    },
    children: [
      {
        path: 'patients',
        name: 'patients',
        component: () => import('@/views/DoctorAdvice/patients'),
        meta: {
          keepAlive: false,
          deepth: 3
        }
      },
      {
        path: 'openDoctorAdvice',
        name: 'openDoctorAdvice',
        component: () => import('@/views/DoctorAdvice/openDoctorAdvice'),
        meta: {
          keepAlive: false,
          deepth: 3
        }
      },

 
      {
        path: 'examine',
        name: 'examine',
        component: () => import('@/views/DoctorAdvice/examine'),
        meta: {
          keepAlive: false,
          deepth: 3
        }
      },
      {
        path: 'blood',
        name: 'blood',
        component: () => import('@/views/DoctorAdvice/blood'),
        meta: {
          keepAlive: false,
          deepth: 3
        }
      },
      {
        path: 'operation',
        name: 'operation',
        component: () => import('@/views/DoctorAdvice/operation'),
        meta: {
          keepAlive: false,
          deepth: 3
        }
      },
      {
        path: 'checkout',
        name: 'checkout',
        component: () => import('@/views/DoctorAdvice/checkout'),
        meta: {
          keepAlive: false,
          deepth: 3
        }
      },
      {
        path: 'diagnose',
        name: 'diagnose',
        component: () => import('@/views/DoctorAdvice/diagnose'),
        meta: {
          keepAlive: false,
          deepth: 3
        }
      },
      {
        path: 'medicalHistory',
        name: 'medicalHistory',
        component: () => import('@/views/DoctorAdvice/medicalHistory'),
        meta: {
          keepAlive: false,
          deepth: 3
        }
      },
      {
        path: 'consultation',
        name: 'consultation',
        component: () => import('@/views/DoctorAdvice/consultation'),
        meta: {
          keepAlive: false,
          deepth: 3
        }
      },

      {
        path: 'invoices',
        name: 'invoices',
        component: () => import('@/views/DoctorAdvice/invoices'),
        meta: {
          keepAlive: false,
          deepth: 3
        }
      },
      {
        path: 'reportCards',
        name: 'reportCards',
        component: () => import('@/views/DoctorAdvice/reportCards'),
        meta: {
          keepAlive: false,
          deepth: 3
        }
      },
      // {
      //   path: 'goArea',
      //   name: 'goArea',
      //   component: () => import('@/views/Home/goArea')
      // },
      // {
      //   path: 'dictionaries',
      //   name: 'dictionaries',
      //   component: () => import('@/views/Home/dictionaries')
      // },

    ],
    // 默认跳转
    // redirect: {name:'district'},
  }

];
