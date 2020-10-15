import {ajax} from './ajax';
// 是否是闰年
export const isLeapYear = (year) => {
  return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0
}
// 获取随机令牌
const leapYearData = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
const commonYearData = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
export const newGuid = () => {
  var guid = "";
  for (var i = 1; i <= 32; i++) {
    var n = Math.floor(Math.random() * 16.0).toString(16);
    guid += n;
  }
  return guid;
}
// 浮点计算 op（+，-，/，*）n,m为数字
export const floatCalculate = (m, n, op) => {
  var a = (m + ""), //将m转化为字符
    b = (n + ""), //将n转化为字符
    x = 1,
    y = 1,
    c = 1;
  if (a.indexOf(".") > 0) {
    x = Math.pow(10, a.length - a.indexOf(".") - 1); //m的小数位位数作为10的幂
  }
  if (b.indexOf(".") > 0) {
    y = Math.pow(10, b.length - b.indexOf(".") - 1); //n的小数位位数作为10的幂
  }
  switch (op) {
    case '+':
    case '-':
      c = Math.max(x, y);
      m = Math.round(m * c);
      n = Math.round(n * c);
      break;
    case '*':
      c = x * y
      m = Math.round(m * x);
      n = Math.round(n * y);
      break;
    case '/':
      c = Math.max(x, y);
      m = Math.round(m * c);
      n = Math.round(n * c);
      c = 1;
      break;
  }
  return eval("(" + m + op + ' ' + n + ")/" + c);
}
// 获取服务器时间 format 可选 默认 "yyyy/MM/dd HH:mm:ss" 指定时间格式 
// export const getServerDateTime = (format) => {
//   var f = format || "yyyy/MM/dd HH:mm:ss";
//   const option = {
//     url: "/ClientData/GetCurrentDateTime",
//     data: {
//       'format': f
//     },
//     type: 'post'
//   }
//   ajax(option).then(date => date.data);

// }
//日期格式化
export const changeDateTimeFormat = (date) => {
  date = new Date(date);
  if (date && date != '') {
    var year = date.getFullYear(),
      month = date.getMonth() + 1,
      day = date.getDate(),
      hour = date.getHours(),
      min = date.getMinutes(),
      sec = date.getSeconds();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    if (hour < 10) {
      hour = "0" + hour;
    }
    if (min < 10) {
      min = "0" + min;
    }
    if (sec < 10) {
      sec = "0" + sec;
    }
    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
  }
}
// 日期格式化 str可选默认 "yyyy/MM/dd HH:mm:ss" dt 可选默认当前本地时间
export const GetFormatDateTime = (str, dt) => {
  if (!str) str = "yyyy-MM-dd HH:mm";
  var d;
  if (dt && dt.constructor.name == "Date") {
    d = dt;
  } else {
    d = new Date();
  }
  str = Replace(str, "yyyy", d.getFullYear());
  str = Replace(str, "MM", createZero(d.getMonth() + 1));
  str = Replace(str, "dd", createZero(d.getDate()));
  str = Replace(str, "HH", createZero(d.getHours()));
  str = Replace(str, "mm", createZero(d.getMinutes()));
  str = Replace(str, "ss", createZero(d.getSeconds()));
  return str;
}
// 返回两位数的年份 
export const GetHarfYear = date => {
  var v = date.getFullYear() + '';
  return v.slice(2);
}
// 替换字符串 
export const Replace = (str, from, to) => {
  return str.split(from).join(to);
}
// 补零
export const createZero = n => {
  if (n.length < 2 || n < 10) {
    return n = "0" + n;
  } else {
    return n = "" + n;
  }
}

//判断数据类型
export const type = target => {
  var tp = {
    "[object Array]": "array",
    "[object Object]": "object",
    "[object Boolean]": "boolean",
    "[object Number]": "number",
    "[object Function]": "function",
    "[object String]": "string"
  }
  if (target === null) {
    return 'null';
  }
  if (typeof target == 'object') {
    var str = Object.prototype.toString.call(target);
    return tp[str]
  } else {
    return typeof target;
  }
}
//对象深度拷贝 除函数
export const deepCope = (obj, target) => {
  target = target || {};
  var tostr = Object.prototype.toString;
  var arrStr = "[object Array]"
  for (var value in obj) {
    if (obj.hasOwnProperty(value)) {
      if (obj[value] !== null && typeof obj[value] == 'object') {
        target[value] = tostr.call(obj[value]) == arrStr ? [] : {};
        deepCope(obj[value], target[value]);
      } else {
        target[value] = obj[value];
      }
    }
  }
  return target;
}
//数字千分位分割
export const numFormat = num => {
  var c = (num.toString().indexOf('.') !== -1) ? num.toLocaleString() : num.toString().replace(
    /(\d)(?=(?:\d{3})+$)/g, '$1,');
  return c;
}
//根据传入的参数转换数字格式 1=>'###.###'=>001.000
export const changeNumFormat = (num, format) => {
  let arr = format.split('.')
  let alen = arr[0].length
  let blen = arr[1] ? arr[1].length : 0
  num = num.toFixed(blen)
  for (let i = 0; i < alen - num.split(".")[0].length; i++) {
    num = "0" + num
  }
  return num
}
// 数组去重
export const noRepeat = arr => {
  let set = new Set(arr)
  return Array.from(set)
}
// 身份证验证15,18位
export const identityCodeValid = (code) => {
  if (code.length != 15 && code.length != 18) {
    return {
      pass: false,
      message: '身份证号格式错误'
    }
  }
  let tip = "";
  let pass = true;
  if (!/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(
      code)) {
    tip = "身份证号格式错误";
    pass = false;
  } else if (!city[code.substr(0, 2)]) {
    tip = "身份证地址编码错误";
    pass = false;
  } else {
    //18位身份证需要验证最后一位校验位
    if (code.length == 18) {
      code = code.split('');
      //∑(ai×Wi)(mod 11)

      let sum = 0;
      let ai = 0;
      let wi = 0;
      for (let i = 0; i < 17; i++) {
        ai = code[i];
        wi = factor[i];
        sum += ai * wi;
      }
      let last = parity[sum % 11];
      console.log(last);
      if (last != code[17].toUpperCase()) {
        tip = "身份证校验位错误";
        pass = false;
      }
    }
  }
  // if (!pass) alert(tip);
  return {
    pass,
    message: tip
  };
}
// 快速数组排序 arr 必传 bl 可选 默认false->升序
export const sort = (arr, bl) => {
  if (arr.length <= 1) return arr;
  let n = arr.splice(0, 1)[0];
  let left = []
  let right = []
  arr.map(val => {
    if (val <= n) {
      left.push(val)
    } else {
      right.push(val)
    }
  })
  if (bl) {
    return sort(right, bl).concat([n], sort(left, bl))
  } else {
    return sort(left, bl).concat([n], sort(right, bl))
  }
}
// 函数节流 fun 回调函数 必传 delay 延迟时间 必传 其他参数为回调函数的参数，不管传入的参数是什么最终传入回调函数的是一个数组
// 用法  const throttleElg = throttle(()=>console.log(1),1000)
// 调用 throttleElg()
// export const throttle = (fun, delay, ...rest) => {
//   let last = null;
//   return () => {
//     const now = +new Date();
//     if (now - last > delay||!last) {
//       fun(rest)
//       last = now;
//     }
//   }
// }
export const throttle = (fun, delay, ...rest) => {
  let last = null;
  return (...value) => {
    const now = +new Date();
    if (now - last > delay||!last) {
      fun(...value,...rest)
      last = now;
    }
  }
}
// 函数防抖 fun 回调函数 必传 delay 间隔时间 必传 其他参数为回调函数的参数，不管传入的参数是什么最终传入回调函数的是一个数组
// 用法  const debouceElg = debouce(()=>console.log(1),1000)
// 调用 debouceElg()
export const debouce = (fun, delay, ...rest) => {
  let timer = null;
  return () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fun(...rest)
    }, delay);
  }
}
// export const debouce = (fn, delay) => {
//   let timer = null
//   return function (queryString, cb) {
//     clearTimeout(timer)
//     timer = setTimeout(fn(queryString, cb), delay)
//   }
// }
// 函数节流 点击多次，在一个时间周期内只触发一次
// export const throttle = (fn,gapTime)=>{
//   let lastTime = null
//   return function() {
//     let nowTime = +new Data()
//     if(nowTime-lastTime>gapTime||!lastTime) {
//       fn()
//       lastTime = nowTime
//     }
//   }
// }
// 传入字符串逻辑和目标返回布尔值
export const getBl = (str, num) => {
  var arr = []
  if (str.indexOf('-') >= 0) {
    arr = str.split('-')
    return num >= arr[0] && num <= arr[1]
  }
  return eval(num + str)
}

// 图表数据过滤空值
export const getArr = (arr) => {
  for (let index = 0; index < arr.length; index++) {
    const element = arr[index].ItemDetails;
    for (let i = 0; i < element.length; i++) {
      if (!element[i].Name) {
        element.splice(i, 1);
        i--;
      }
    }
  }
  return arr;
}
//获取年月日
export const changeDateTimeDay = (date, format = "-") => {
  date = new Date(date);
  if (date && date != '') {
    var year = date.getFullYear(),
      month = date.getMonth() + 1,
      day = date.getDate(),
      hour = date.getHours(),
      min = date.getMinutes(),
      sec = date.getSeconds();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    if (hour < 10) {
      hour = "0" + hour;
    }
    if (min < 10) {
      min = "0" + min;
    }
    if (sec < 10) {
      sec = "0" + sec;
    }
    return year + format + month + format + day;
  }
}

// 切割年月日
export const getAge = age => {
  let arr = []
  let year = age.split("岁")
  let mon;
  if (year.length > 1) {
    arr.push(year[0])
    mon = year[1].split('月')
    if (mon.length > 0) {
      arr.push(mon[0])
      arr.push(mon[1].replace('日', ''))
    } else {
      arr.push('')
      arr.push(mon[0].replace("日", ''))
    }
  } else {
    arr.push('')
    mon = year[0].split("月")
    if (mon.length > 0) {
      arr.push(mon[0])
      arr.push(mon[1].replace('日', ''))
    } else {
      arr.push('')
      arr.push(mon[0].replace("日", ''))
    }
  }
  return arr
}
// 获取24小时区间数据的时间数组
export const getTimeOfDay = () => {
  let arr = []
  let d = GetFormatDateTime("yyyy/MM/dd HH:mm:ss", new Date(+new Date() + 300000))
  arr.push(GetFormatDateTime("yyyy/MM/dd HH:mm:ss", new Date(new Date() - 86400000 + 300000)))
  arr.push(d)
  return arr
}
// // 获取当日00:00:00到23:59:59的时间数组
export const getTimeOfToday = () => {
  let arr = []
  let d = GetFormatDateTime("yyyy/MM/dd", new Date())
  arr.push(GetFormatDateTime("yyyy/MM/dd HH:mm:ss", new Date(d)))
  arr.push(GetFormatDateTime("yyyy/MM/dd HH:mm:ss", new Date(d + " 23:59:59")))
  return arr
}
// 图表数据x轴格式化
export const getDefulaData = (value) => {
  // 格式化成月/日,时间
  if (value == 0) {
    return ''
  }
  var date = new Date(value);
  var texts = [date.getMonth() + 1, date.getDate()];
  texts = texts.map(item => {
    if (item > 9) {
      return item
    } else {
      return "0" + item
    }
  })
  return texts.join("/") + "\n" + createZero(date.getHours()) + ":" + createZero(date
  .getMinutes());
}
// 格式化成年/月/日，
export const getDay = (value) => {
  let texts = value.split("-")
  texts[1] = createZero(texts[1])
  texts[2] = createZero(texts[2])

  return texts.join("/");
}
// 根据时间获取与当前时间差，返回时间格式HH:mm:ss 
export const getDifferenceTime = (time, nowTime) => {
  nowTime = +new Date(nowTime)
  time = +new Date(time);
  if (isNaN(time)) return '';
  let num = Math.abs(nowTime - time);
  let [h, m, s] = [];
  s = parseInt(num / 1000);
  if (s < 60) {
    m = 0
  } else {
    m = parseInt(s / 60);
    s = s - m * 60
  }
  if (m < 60) {
    h = 0
  } else {
    h = parseInt(m / 60)
    m = m - h * 60
  }
  return `${createZero(h)}:${createZero(m)}:${createZero(s)}`
}
// 获取键盘快捷键方法
export const getKeyCode = (e) => {
  let str = '';
  // Ctrl组合键
  if (e.ctrlKey) {
    switch (e.keyCode) {
      case 78:
        str = 'add'
        break;
      case 83:
        str = 'save'
        break;
    }
  } else {
    switch (e.keyCode) {
      case 45:
        str = 'insert'
        break;
      case 46:
        str = 'delete'
        break;
      case 174:
        str = 'edit'
        break;
    }
  }
  return str
}

//将阿拉伯数值转化为大写字母
export const numTostr = (num) => {
  if (isNaN(Number(num))) {
    return;
  };
  let tmpnewchar = ''; // 最后结果
  let numStr = Number(num).toString().split(".")[0]; // 数字转化字符串
  if (/^-/.test(numStr)) {
    tmpnewchar = '负';
    numStr = numStr.replace(/^-/g, '');
  };
  let bigNum = ['亿', '万', '千', '百', '十']; // 定义单位数组
  let bigNumSlice = []; // 定义被截取后的单位数组
  let sliceStar = numStr.length - 1; // 定义被截取的位置
  let numAry = []; // 定义数字字符串分隔成数组


  let change = function (num) {
    let no = '';
    switch (num) {
      case "0":
        no = "零";
        break;
      case "1":
        no = "一";
        break;
      case "2":
        no = "二";
        break;
      case "3":
        no = "三";
        break;
      case "4":
        no = "四";
        break;
      case "5":
        no = "五";
        break;
      case "6":
        no = "六";
        break;
      case "7":
        no = "七";
        break;
      case "8":
        no = "八";
        break;
      case "9":
        no = "九";
        break;
    };
    return no;
  };
  if (sliceStar > 0) {
    numAry = numStr.replace(/0+$/g, '').split("");
    bigNumSlice = bigNum.slice(-sliceStar);
    numAry.map(function (value, index) {
      if (bigNumSlice[index] && change(value) != '零') {
        tmpnewchar = tmpnewchar + change(value) + bigNumSlice[index]
      } else {
        tmpnewchar = tmpnewchar + change(value)
      };
    });
    if (/零$/.test(tmpnewchar)) {
      tmpnewchar = tmpnewchar.replace(/零$/g, '');
    };
    if (/零+/.test(tmpnewchar)) {
      tmpnewchar = tmpnewchar.replace(/零+/g, '零');
    };
    if (/^一十/.test(tmpnewchar)) {
      tmpnewchar = tmpnewchar.replace(/^一十/g, '十');
    };
  } else {
    tmpnewchar = change(numStr)
  };
  return tmpnewchar;
};
export const getDayList = (day1, day2) => {
  var getDate = function (str) {
    var tempDate = new Date();
    var list = str.split("/");
    tempDate.setFullYear(list[0]);
    tempDate.setMonth(list[1] - 1);
    tempDate.setDate(list[2]);
    return tempDate;
  }
  var zero = function (val) {
    if (val < 10) {
      return "0" + val
    } else {
      return "" + val
    }
  }
  var date1 = getDate(day1);
  var date2 = getDate(day2);
  console.log("date", date1, date2)
  if (date1 > date2) {
    var tempDate = date1;
    date1 = date2;
    date2 = tempDate;
  }
  date1.setDate(date1.getDate() + 1);
  var dateArr = [];
  var i = 0;
  console.log(date1.getFullYear(), date2.getFullYear(), date1.getMonth(), date2.getMonth(), date1
    .getDate(), date2
    .getDate())
  while (!(date1.getFullYear() == date2.getFullYear() &&
      date1.getMonth() == date2.getMonth() && date1.getDate() == date2
      .getDate())) {
    var dayStr = date1.getDate().toString();
    if (dayStr.length == 1) {
      dayStr = "0" + dayStr;
    }
    console.log(zero(date1.getMonth() + 1))
    dateArr[i] = date1.getFullYear() + "/" + (zero(date1.getMonth() + 1)) + "/" +
      dayStr;
    i++;
    date1.setDate(date1.getDate() + 1);
  }
  dateArr.splice(0, 0, day1)
  dateArr.push(day2);
  return dateArr;
}

// 根据生日获取年龄
export const birthdayToAge = (birthday) => {
  birthday = GetFormatDateTime('yyyy-MM-dd', new Date(birthday));
  let now = GetFormatDateTime('yyyy-MM-dd', new Date());
  let bArr = birthday.split('-');
  let nArr = now.split('-');
  bArr.forEach((el, i) => {
    bArr[i] = parseInt(el)
  })
  nArr.forEach((el, i) => {
    nArr[i] = parseInt(el)
  })
  let y, m, d;
  y = -(bArr[0] - nArr[0])
  m = -(bArr[1] - nArr[1])
  d = -(bArr[2] - nArr[2])
  if (d < 0) {
    d += isLeapYear(bArr[0]) ? leapYearData[bArr[1] - 1] : commonYearData[bArr[1] - 1]
    m -= 1
  }
  if (m < 0) {
    m += 12
    y -= 1
  }
  return {
    year: y,
    month: m,
    day: d
  }
}
// 根据身份证获取年龄，生日
export const getBirthday = idCard => {
  console.log(idCard);
  idCard = idCard + ''
  let sex = 0;
  if (idCard.length === 15) {
    sex = idCard[14] % 2 === 0 ? 2 : 1
    idCard = idCard.substring(0, 9) + 19 + idCard.substring(9);

  } else {
    sex = idCard[16] % 2 === 0 ? 2 : 1
  }
  let obj = {}
  obj.ageYearValue = idCard.substring(6, 10) + "/" + idCard.substring(10, 12) + "/" + idCard
    .substring(12, 14)
  let age = birthdayToAge(obj.ageYearValue)
  obj.ageValue = age.year
  obj.monthValue = age.month
  obj.dayValue = age.day
  obj.PatGenderCode = sex
  return obj
}
//加权因子
const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
//校验位
const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
const city = {
  11: "北京",
  12: "天津",
  13: "河北",
  14: "山西",
  15: "内蒙古",
  21: "辽宁",
  22: "吉林",
  23: "黑龙江 ",
  31: "上海",
  32: "江苏",
  33: "浙江",
  34: "安徽",
  35: "福建",
  36: "江西",
  37: "山东",
  41: "河南",
  42: "湖北 ",
  43: "湖南",
  44: "广东",
  45: "广西",
  46: "海南",
  50: "重庆",
  51: "四川",
  52: "贵州",
  53: "云南",
  54: "西藏 ",
  61: "陕西",
  62: "甘肃",
  63: "青海",
  64: "宁夏",
  65: "新疆",
  71: "台湾",
  81: "香港",
  82: "澳门",
  91: "国外 "
};
// 获取本地ip地址
export function getYourIP(getIP){
  var RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
  if (RTCPeerConnection){(function () {
      var rtc = new RTCPeerConnection({iceServers:[]});
      if (1 || window.mozRTCPeerConnection) {     
          rtc.createDataChannel('', {reliable:false});
      };
      
      rtc.onicecandidate = function (evt) {
          if (evt.candidate) grepSDP("a="+evt.candidate.candidate);
      };
      rtc.createOffer(function (offerDesc) {
          grepSDP(offerDesc.sdp);
          rtc.setLocalDescription(offerDesc);
      }, function (e) { console.warn("offer failed", e); });
      
      
      var addrs = Object.create(null);
      addrs["0.0.0.0"] = false;
      function updateDisplay(newAddr) {
          if (newAddr in addrs) return;
          else addrs[newAddr] = true;
          var displayAddrs = Object.keys(addrs).filter(function (k) { return addrs[k]; });
          for(var i = 0; i < displayAddrs.length; i++){
              if(displayAddrs[i].length > 16){
                  displayAddrs.splice(i, 1);
                  i--;
              }
          }
          getIP(displayAddrs[0])
      }
      function grepSDP(sdp) {
          var hosts = [];
          sdp.split('\r\n').forEach(function (line, index, arr) { 
             if (~line.indexOf("a=candidate")) {    
                  var parts = line.split(' '),       
                      addr = parts[4],
                      type = parts[7];
                  if (type === 'host') updateDisplay(addr);
              } else if (~line.indexOf("c=")) {       
                  var parts = line.split(' '),
                      addr = parts[2];
                  updateDisplay(addr);
              }
          });
      }
  })()
}
}
export const severalGroups = (arr=[],str)=>{
   let listDep = [];
   for(let i = 0;i<arr.length;i++){
    arr[i][str]&& listDep.push(...arr[i][str])
   }
  let arr_number = {};  
  let depList = []
    for(var i = 0 ; i < listDep.length ; i++){  
        if(arr_number[listDep[i]]){  
            arr_number[listDep[i]]++  
        }  
        else{  
            arr_number[listDep[i]] = 1 ;  
      }
      arr.length===arr_number[listDep[i]]&&depList.push(listDep[i])
    }
  //   for(let key in arr_number){
  //     if(arr_number[key]===arr.length){
  //        depList.push(key)
  //     }
  // }
  return depList
}
    // 获取服务器时间
    export async function getServerTimeRandom(val) {
      try {
        let res= await ajax(
          {t:Math.random()},"/api/v1/Tool/ServerTimeRandom",'get','Master'
        )
        console.log(`${val}&&AuthNumber=${res.Data}`,'`${val}&&AuthNumber=${res.Data}`');
        return `${val}&&AuthNumber=${res.Data}`
      } catch (error) {
        return val
      }
}
export const IframeOnClick = {  
  resolution: 500,  
  iframes: [],  
  interval: null,  
  Iframe: function() {  
      this.element = arguments[0];  
      this.cb = arguments[1];   
      this.hasTracked = false;  
  },  
  track: function(element, cb) {  
    this.iframes=[]
      this.iframes.push(new this.Iframe(element, cb));  
      if (!this.interval) {  
          var _this = this;  
          this.interval = setInterval(function() { _this.checkClick(); }, this.resolution);  
      }  
  },  
  checkClick: function() {  
      if (document.activeElement) {  
          var activeElement = document.activeElement;  
          for (var i in this.iframes) {  
              if (activeElement === this.iframes[i].element) { // user is in this Iframe  
                  if (this.iframes[i].hasTracked == false) {   
                      this.iframes[i].cb.apply(window, []);   
                      this.iframes[i].hasTracked = true;  
                  }  
              } else {  
                  this.iframes[i].hasTracked = false;  
              }  
          }  
      }  
  },
  clear:function(){
    clearInterval(this.interval)
    this.interval=null
  }  
}; 
//  导出通用函数
export const exportData = (url,fileName,callback) => {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);    // 也可用POST方式
  xhr.responseType = "blob";
  xhr.onload = function () {
      if (this.status === 200) {
          var blob = this.response;
          if (navigator.msSaveBlob == null) {
              var a = document.createElement('a');
              // var headerName = xhr.getResponseHeader("Content-disposition");
              // var fileName = decodeURIComponent(headerName.substring(20));
               a.setAttribute("download", "出科患者");
              a.href = URL.createObjectURL(blob);
              a.click();
              URL.revokeObjectURL(a.href);
              a.remove()
          } else {
              navigator.msSaveBlob(blob, fileName);
          }
      }
      callback()
  };
  xhr.send()
}
export const  birthDayTime = (data)=>{
  let zero = function (val) {
    if (val < 10) {
      return "0" + val
    } else {
      return "" + val
    }
  }
  if(data){
     let time = new Date(data);
     let year = time.getFullYear();
     let month = time.getMonth() + 1;
     let day = time.getDate();
     return `${year}${zero(month)}${zero(day)}`
  }
  return ""
}