export default (value) => {
    // 转换成 时  分
      let val = parseInt(value)
      let hour = Math.floor((val)/3600)
      let min = Math.floor((val - (hour*3600))/60)
      return hour+'h'+min+'min'
}