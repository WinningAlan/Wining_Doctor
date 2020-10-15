import {
  Message
} from 'element-ui';
// msg 必传字段 ，time默认2000毫秒

export const msg = {
  success: function (msg, time = 3000) {
   
    this.m&&this.m.close()
    this.m = Message.success({
      message: msg,
      duration: time,
      center: true
    })
  },
  error: function (msg, time = 3000) {
    this.m&&this.m.close()
    this.m = Message.error({
      message: msg,
      duration: time,
      center: true
    })
  },
  warning: function (msg, time = 3000) {
    this.m&&this.m.close()
    this.m = Message.warning({
      message: msg,
      duration: time,
      center: true
    })
  },
  info: function (msg, time = 3000) {
    this.m&&this.m.close()
    this.m = Message.info({
      message: msg,
      duration: time,
      center: true
    })
  },
}



// 参数	        说明	                            类型	                可选值	    默认值
// message	    消息文字	                        string / VNode	        —	        —
// type	        主题	                            string	                success/warning/info/error	info
// iconClass	自定义图标的类名，会覆盖 type	      string	—	—
// dangerouslyUseHTMLString	是否将 message 属性作为 HTML 片段处理	boolean	  —	        false
// customClass	自定义类名	                         string                  —	        —
// duration	    显示时间, 毫秒。设为 0 则不会自动关闭	number	               —	       3000
// showClose	是否显示关闭按钮	                    boolean	              —	        false
// center	    文字是否居中	                        boolean	              —	        false
// onClose	    关闭时的回调函数, 参数为被关闭的 message 实例	function	    —	        —
