// 年龄
export default (year, month) => {
    if (!year && !month) return '0岁'
    if (year >= 3) {
      return year + '岁'
    } else if (year >= 1) {
      return `${year}岁${month?parseInt(month):0}月`
    } else {
  
      month = month ? month : '0';
      let i = month.indexOf('*')
      let m = i > -1 ? month.slice(0, i) : 0;
      let d = month.indexOf('/') > -1 ? month.slice(i + 1, month.indexOf('/')) : 0;
      return m < 1 ? `${d}天` : `${m}月${d}天`;
    }
  }