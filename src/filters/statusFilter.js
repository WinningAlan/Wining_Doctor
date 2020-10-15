export default (num,type,arr) => {
    let str = '';
    for (let index = 0; index < arr.length; index++) {
        const el = arr[index];
        if (el.value===num) {
            str = el.text
            break
        }
    }
    return type===1&&num===5?'已执行':str
}