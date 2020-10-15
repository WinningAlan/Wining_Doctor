export function changeEnter() {
    var inputs = document.getElementsByClassName('input');
    function init() {
        for(let i = 0; i < inputs.length; i++){
            inputs[i].onkeydown = focus(i)
        }     
    }
    var focus = function handle(i) {
        return function(event) {
            var next = (i + 1) < inputs.length ? i + 1 : 0;  // 判断是否为最后一个输入框，是则返回第一个，否则继续下一个
            var eve = event ? event : window.event;
            if (eve.keyCode === 13) {
                if (inputs[next].tagName === 'INPUT') {
                    inputs[next].focus();    //获取焦点
                } else {
                }
            }
        }
    }
    init()
}