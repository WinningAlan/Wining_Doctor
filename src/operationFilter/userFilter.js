export default (val,arr)=>{
    if(val && arr.length>0){
        for(var i = 0;i<arr.length;i++){
            if(arr[i].Id===val){
              return arr[i].Name
            }
        }
    }else{
        return ""
    }
}