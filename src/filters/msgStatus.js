export default (val)=>{
    if(val===1){
        return "未读"
    }
    if(val===2){
        return "已读"
    }
   return "未发送"
}