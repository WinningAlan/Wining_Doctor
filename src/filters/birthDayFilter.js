export default (time)=>{
    if(time){
        if(time.indexOf("T")>0){
           let arr = time.split("T");
           return arr[0];
        }else{
            return time
        }
    }
}