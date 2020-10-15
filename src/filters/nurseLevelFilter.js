export default (level) => {
    level = level + ''
    switch (level) {
        case "9":
            return "特级";
        case "1":
            return "一级";
        case "2":
            return "二级";
        case "3":
            return "三级";
        default:
            return ''
        // case "4":
        //     return "四级";
        // default:
        //     return "四级"
    }
}