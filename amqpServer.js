/**
 * Created by wsd on 17/2/23.
 */

  //express_demo.js 文件
var express = require('express');
var cors = require('cors')
var amqp = require('amqplib');
var fnv = require('fnv-plus');
var Web3 = require("web3");//引入web3
var web3 = new Web3();//声明
web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));///连接以太坊
var MyContract = web3.eth.contract([
  {
    "constant": true,
    "inputs": [
      {
        "name": "hardwareId",
        "type": "uint256"
      },
      {
        "name": "numAlerts",
        "type": "uint256"
      }
    ],
    "name": "getAlertInfo",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "type": "function",
    "stateMutability": "view"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "hardwareId",
        "type": "uint256"
      },
      {
        "name": "numAlerts",
        "type": "uint256"
      }
    ],
    "name": "getDeviceInfo",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      },
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "type": "function",
    "stateMutability": "view"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getNumDevices",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "type": "function",
    "stateMutability": "view"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "numDevices",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "type": "function",
    "stateMutability": "view"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "numAlerts",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "type": "function",
    "stateMutability": "view"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "hardwareId",
        "type": "uint256"
      }
    ],
    "name": "newDevice",
    "outputs": [
      {
        "name": "deviceId",
        "type": "uint256"
      }
    ],
    "payable": false,
    "type": "function",
    "stateMutability": "nonpayable"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "hardwareId",
        "type": "uint256"
      },
      {
        "name": "alertMsgs",
        "type": "string"
      }
    ],
    "name": "newAlertMessage",
    "outputs": [],
    "payable": true,
    "type": "function",
    "stateMutability": "payable"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "_state",
        "type": "uint256"
      }
    ],
    "name": "Inited",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "_from",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_state",
        "type": "uint256"
      }
    ],
    "name": "subscribed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "_from",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_state",
        "type": "uint256"
      }
    ],
    "name": "backed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "_from",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_state",
        "type": "uint256"
      }
    ],
    "name": "claimed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "_from",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_state",
        "type": "uint256"
      }
    ],
    "name": "oracleDeclareClaimed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "_from",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_numDevices",
        "type": "uint256"
      }
    ],
    "name": "newDeviced",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "from",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "SentMoney",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "from",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Minted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "_from",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_to",
        "type": "address"
      }
    ],
    "name": "SetOracled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "_from",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_numAlerts",
        "type": "uint256"
      }
    ],
    "name": "NewInsuranced",
    "type": "event"
  }
]);

var app = express();

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.get('/products', function (req, res, next) {
  console.log(req.query.hardwareId)
  let hardwareId = req.query.hardwareId;
  let hardId = fnv.hash(hardwareId, 64).dec()
  let alertList = [];
  let resData = {
    "numResults":0,
    "results":[]
  };
  let singleAlert = '';
  let alertNum = myContractInstance.getDeviceInfo(hardId, 0).toString().split(",")[1];
  for(let i=0;i<alertNum;i++){
    singleAlert = JSON.parse(myContractInstance.getAlertInfo(hardId, i).toString());
    alertList.push(singleAlert);
  }
  resData.numResults=alertNum;
  resData.results = alertList;

  res.send(resData);
})




var server = app.listen(8099, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})

//智能合约部署的地址
var myContractInstance = MyContract.at("0xbc2d281f97e9b982ae556f3839c0fe2b2b316c7b");



amqp.connect('amqp://127.0.0.1').then(function (conn) {
  process.once('SIGN', function () {
    conn.close();
  });
  //连接成功后创建通道
  return conn.createChannel().then(function (ch) {
    var ok = ch.assertQueue('hello', {durable: false}).then(function (_qok) {
      return ch.consume('hello', function (msg) {

        let hardwareId = JSON.parse(msg.content.toString()).hardwareId;
        let hardid = fnv.hash(hardwareId, 64).dec();

        let alertMsg = msg.content.toString();

        //向以太坊存储信息，如果设备已有，则只添加信息，如果设备没有，则创建设备

        let responseHardId = myContractInstance.getDeviceInfo(hardid,0).toString().split(",")[0];
        if(responseHardId == (hardid+'')){
         newAlerts=myContractInstance.newAlertMessage.sendTransaction(hardid,alertMsg,{from: web3.eth.accounts[0],gas:4700000});
        }else{
         myContractInstance.newDevice.sendTransaction(hardid,{from: web3.eth.accounts[0],gas:4700000});
         myContractInstance.newAlertMessage.sendTransaction(hardid,alertMsg,{from: web3.eth.accounts[0],gas:4700000});
        }

        // console.log(myContractInstance.getDeviceInfo(hardid, 0).toString());
        // console.log(JSON.stringify(JSON.parse(myContractInstance.getAlertInfo(hardid, 0).toString())));
        // console.log(myContractInstance.getNumDevices().toString());
        // resData = JSON.stringify(JSON.parse(myContractInstance.getAlertInfo(hardid, 0).toString()));
        // console.log(resData);


      }, {noAck: true});
    });
    return ok.then(function (_consumeOk) {
      console.log('[*] Waiting for message. To exit press CRTL+C');
    });
  });
}).then(null, console.warn);//如果报错打印报错信息

