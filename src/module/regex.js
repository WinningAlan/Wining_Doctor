// 必选参数
export const required = {
  required: true,
  message: '不允许为空',
  trigger: 'blur'}

export const requiredFalse = {
  required: false,
  message: '',
  trigger: 'blur'}
  //邮箱的正则
export const mailReg = [{
    pattern: /(^$)|^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
    message: '格式错误',
    trigger: 'blur'
  }]
  //网络地址
  export const httpReg = [required, {
    pattern: /^(http:\/\/localhost|(([1-9]|1[0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.)(([0-9]{1,2}|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){2}([1-9]|[1-9][0-9]|1[0-9]{2}|2[0-5][0-9]|25[0-4]))$/,
    message: '格式错误',
    trigger: 'blur'
  }]
//手机号正则
export const phoneReg = [{
    pattern: /(^$)|(^(?:\d+|\-){7,}$)|(1[34578]\d{9})/,
    message: '格式错误',
    trigger: 'blur'
  }]
//姓名正则
export const nameReg = [required, {
    pattern: /^([\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20})|[a-z]+$/,
    message: '格式错误',
    trigger: 'blur'
  }]
// 接口地址正则
export const urlReg = [required, {
  // pattern: /^((http|ftp|https):\/\/)(localhost|(([1-9]|1[0-9]|1[1-9]{2}|2[0-4][0-9]|25[0-5])\.)(([0-9]{1,2}|1[1-9]{2}|2[0-4][0-9]|25[0-5])\.){2}([1-9]|[1-9][0-9]|1[1-9]{2}|2[0-5][0-9]|25[0-4]):[1-9][\d]*([\/][a-z]+)*)$/,
  // message: '格式错误',
  // trigger: 'blur'
}]
// 身份证号正则
export const idNum = [{
  pattern:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
  message:'格式错误',
  trigger:'blur'
}]


