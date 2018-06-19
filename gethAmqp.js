/**
 * Created by wsd on 17/2/23.
 */
var amqp = require('amqplib');
var when = require('when');
var fnv = require('fnv-plus');
Date.prototype.pattern=function(fmt) {         
    var o = {         
    "M+" : this.getMonth()+1, //月份         
    "d+" : this.getDate(), //日         
    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时         
    "H+" : this.getHours(), //小时         
    "m+" : this.getMinutes(), //分         
    "s+" : this.getSeconds(), //秒         
    "q+" : Math.floor((this.getMonth()+3)/3), //季度         
    "S" : this.getMilliseconds() //毫秒         
    };         
    var week = {         
    "0" : "/u65e5",         
    "1" : "/u4e00",         
    "2" : "/u4e8c",         
    "3" : "/u4e09",         
    "4" : "/u56db",         
    "5" : "/u4e94",         
    "6" : "/u516d"        
    };         
    if(/(y+)/.test(fmt)){         
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));         
    }         
    if(/(E+)/.test(fmt)){         
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);         
    }         
    for(var k in o){         
        if(new RegExp("("+ k +")").test(fmt)){         
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));         
        }         
    }         
    return fmt;         
}       
//连接本地消息队列服务
amqp.connect('amqp://localhost').then(function(conn){
//创建通道，让when立即执行promise
  return when(conn.createChannel().then(function(ch){
    var q = 'hello';
    var msg = 'Hello World';
    var time = new Date().pattern("yyyy-MM-dd hh:mm:ss");


    var data = '{"hardwareId": "hard4", "type": "DeviceAlert","request": {"type": "engine.overPa","level": "Warning","message": "The engine is about to overheat!! Turn the machine off!","updateState": true,"eventDate": '+'"'+time.toString()+'"'+',"metadata":{"name1":"value1"}}}'

  //监听q队列，设置持久化为false。
    return ch.assertQueue(q,{durable: false}).then(function(_qok){
  //监听成功后向队列发送消息，这里我们就简单发送一个字符串。发送完毕后关闭通道。
      ch.sendToQueue(q,new Buffer(data));
      console.log(" [x] Sent '%s'",data);

      return ch.close()
    });
  })).ensure(function(){ //ensure是promise.finally的别名，不管promise的状态如何都会执行的函数
//这里我们把连接关闭
    conn.close();
  });
}).then(null,console.warn);

