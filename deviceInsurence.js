
pragma solidity ^0.4.2;
contract Insurance {
    //设备告警信息
    struct deviceAlerts{
       string alertMsgs;
    }
    
	struct Device{
	    uint hardwareId;
	    uint numAlerts;
	    mapping(uint=>deviceAlerts) devAlerts;
	}
	
	uint public   numDevices;
	uint public   numAlerts;
	mapping(uint=>Device)   devices;

	
	//create a new device  if the device never haved
	function newDevice(uint hardwareId) returns (uint deviceId) {
        deviceId = numDevices++; 
        devices[hardwareId]=Device(hardwareId,0);
         newDeviced(msg.sender,numDevices);
    }
    //add alert message 
    function newAlertMessage(uint hardwareId,string alertMsgs)payable{
        Device storage u=devices[hardwareId];
        u.devAlerts[u.numAlerts++]=deviceAlerts(alertMsgs);
         NewInsuranced(msg.sender,u.numAlerts);
    }
	
	
	//get device info  
	function getDeviceInfo(uint hardwareId,uint numAlerts)constant returns(uint,uint)
	{
	    Device storage u=devices[hardwareId];
	    return ( u.hardwareId, u.numAlerts);
	}
	//get alert info for per device
	function getAlertInfo(uint hardwareId,uint numAlerts)constant returns(string)
	{
	    Device storage u=devices[hardwareId];
	    return(
	    u.devAlerts[numAlerts].alertMsgs,
	        );
	}
	
	//get the number of devices
	function getNumDevices() constant returns (uint) {
        return numDevices;
    }
    // function getNumAlerts()constant returns(uint){
    //     return  numAlerts;
    // }
  
 

    event Inited(uint _state);
    event subscribed(address _from,uint _state);
    event backed(address _from ,uint _state);
    event claimed(address _from,uint _state);
    event oracleDeclareClaimed(address _from ,uint _state);
    event newDeviced(address _from,uint _numDevices);
    event SentMoney(address from, address to, uint amount);
    event Minted(address from,address to,uint amount);
    event SetOracled(address _from,address _to);
    event NewInsuranced(address _from,uint _numAlerts);








}