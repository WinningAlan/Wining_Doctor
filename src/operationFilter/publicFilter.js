export default (val,arr)=>{
    if(arr.length>0 && val){
        for(var i = 0;i<arr.length;i++){
            if(arr[i].Value==val){
                return arr[i].Key
            }
        }
    }else{
        return ''
    }
}