//引入axios
import axios from 'axios'
// 获取 session 
import { getSession ,setSession} from './storage';
import {
  msg,
} from './msg';
const defaultTimeOut = getSession('timeOut') || 10000;

const pending = {}
//请求拦截器
const CancelToken = axios.CancelToken
const removePending = (key, isRequest = false) => {
  if (pending[key] && isRequest) {
    pending[key]('取消重复请求'+decodeURIComponent(key))
  }
  delete pending[key]
}
const getRequestIdentify = (config, isReuest = false) => {
  let url = config.url
  if (isReuest) {
    url = config.baseURL + config.url
  }
  return config.method === 'get' ? encodeURIComponent(url + JSON.stringify(config.params)) : encodeURIComponent(url+JSON.stringify(config.data))
}



  axios.interceptors.request.use(config => {
    // 拦截重复请求(即当前正在进行的相同请求)
    let requestData = getRequestIdentify(config, true)
    removePending(requestData, true)
    config.cancelToken = new CancelToken((c) => {
      pending[requestData] = c
    })
    // console.log(config,'config',pending);

    // 携带token
    const user = getSession('user')
    // &&process.env.NODE_ENV === 'production'
    if (user) {
      config.headers.Authorization = user.Token;
  }
  
      return config
}, error => {
    return Promise.reject(error)
})
//响应拦截器即异常处理
axios.interceptors.response.use(response => {
    // 把已经完成的请求从 pending 中移除
    let requestData = getRequestIdentify(response.config)
    removePending(requestData)
    return response
}, err => {
  console.log(err,err.response,"error");
    
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = '错误请求'
          break;
        case 401:
          err.message = '未授权，请重新登录'
          window.location.href = "./#/login"    
          break;
        case 403:
          err.message = '拒绝访问'
          break;
        case 404:
          err.message = '请求错误,未找到该资源'
          break;
        case 405:
          err.message = '请求方法未允许'
          break;
        case 408:
          err.message = '请求超时'
          break;
        case 500:
          err.message = '服务器端出错'
          break;
        case 501:
          err.message = '网络未实现'
          break;
        case 502:
          err.message = '网络错误'
          break;
        case 503:
          err.message = '服务不可用'
          break;
        case 504:
          err.message = '网络超时'
          break;
        case 505:
          err.message = 'http版本不支持该请求'
          break;
        default:
          err.message = `连接错误${err.response.status}`
      }
      process.env.NODE_ENV === 'production'&&msg.error(err.message)
    } else {
      
      if (err.message.indexOf('timeout') >= 0) {
        msg.warning('请求超时,请重试！')
        return Promise.reject(err.response)
      }
    }
      return Promise.resolve(err.response)
})
// 设置基础请求地址
// axios.defaults.baseURL = 'http://172.16.0.161:8081'
//设置默认请求头
axios.defaults.headers = {
    'content-type': 'application/json',
    // 'X-Requested-With': 'XMLHttpRequest'
}
// 设置请求超时


// params //携带的参数
//   url //必传 接口地址
//   type //必传 请求方式
//   urlType // 可选 IP地址 默认当前系统ip
//   isCache // 可选 默认值 false 是否要缓存


export const ajax = (params, url, type='get',urlType='Doctor',isCache=false,timeout) => { 

  let con = type === 'get' ? 'params' : 'data'
  axios.defaults.timeout = timeout||defaultTimeOut
  axios.defaults.baseURL = window.URLCONFIG[urlType]
  // axios.defaults.baseURL = './'+'Doctor'

// 开发环境强制不缓存
  if (process.env.NODE_ENV !== 'production') {
    isCache =  false;
  } 

  const key = url + "" + JSON.stringify(params);
  const cacheRes = getSession(key);
  let result = axios({
          method: type,
          url:url,
          [con]: params,
        });
  return new Promise((resolve, reject) => {
    if (isCache && cacheRes) {
        resolve(cacheRes)
      } else {
        result.then(res => {
          if (res) {
            if (isCache) {
              res.Status&&setSession(key,res.data)
            } 
            resolve(res.data)
             if(res.data.Msg===null){
               return 
             }
            // !res.data.Status&&console.log(res.data.Message,'res.data.Message');
            !res.data.Status&&url.indexOf('OrderSubmit')<0&&url.indexOf('localhost')<0&&msg.warning(res.data.Message)
          } else {
            url.indexOf('localhost')>-1&&reject()
          }

        }).catch(e => {
          // if (process.env.NODE_ENV == 'development') msg.error('请求错误！');
          reject(e)

        });
      }
  })
}