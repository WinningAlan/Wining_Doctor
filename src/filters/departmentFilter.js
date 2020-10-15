
export default (val,arr)=>{
    for(var i = 0;i<arr.length;i++){
        if(val===arr[i].Code){
            return arr[i].Name
        }
    }
}