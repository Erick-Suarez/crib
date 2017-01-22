/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */

/*
Node.js application for connecting the Intel Edison Arduino to IBM Bluemix.
Sends data from an analog sensor on analog pin zero.
Requires registration on Bluemix. Edit the following to your Bluemix registration values:
ORG
TYPE
ID
AUTHTOKEN
*/

var mraa = require('mraa');

var ORG = '8d8zxo';
var TYPE = 'lcdTempBoard';
var ID = 'tempBoard';
var AUTHTOKEN = '12345678';

//Uses mqtt.js, see package.json. More info at: 
//https://www.npmjs.com/package/mqtt
var mqtt    = require('mqtt');

var PROTOCOL = 'mqtt';
var BROKER = ORG + '.messaging.internetofthings.ibmcloud.com';
var PORT = 1883;

//Create the url string
var URL = PROTOCOL + '://' + BROKER;
URL += ':' + PORT; 
//URL is e.g. 'mqtt://xrxlila.messaging.internetofthings.ibmcloud.com:1883'

var CLIENTID= 'd:' + ORG;
CLIENTID += ':' + TYPE;
CLIENTID += ':' + ID;
//CLIENTID -s e.g. d:xrxila:edison-air:784b87a801e9

var AUTHMETHOD = 'use-token-auth';

var client  = mqtt.connect(URL, { clientId: CLIENTID, username: AUTHMETHOD, password: AUTHTOKEN });
var state = 'off'
    
var TOPIC = 'iot-2/evt/status/fmt/json';
console.log(TOPIC);

    client.on('connect', function ()  {
        client.subscribe('iot-2/cmd/+/fmt/json');
        setInterval(function(){
        }, 2000);//Keeps publishing every 2000 milliseconds.
});

client.on('message', function(topic, message){
    console.log("Message: " + message.toString());
    console.log("Topic: " + topic.toString());
    var theData = JSON.parse("" + message.toString());
    
    var motor = new mraa.Pwm(3);
    
    var exec = require('child_process').exec; 
        var cmd = 'killall python &';
        exec(cmd, function(error, stdout, stderr){
            
        });
    
    if (topic.toString() == "iot-2/cmd/setFanPwm/fmt/json"){
        motor.enable(true);
        motor.write(1.0);
        setTimeout(function(){motor.write(theData.fanPwm);}, 20);
    } else if (topic.toString() == 'iot-2/cmd/setText/fmt/json'){
        var text = theData.payload;
        var display = require('intel-edison-lcd-rgb-backlight-display-helper');
        display.set(2, 16);
        display.clearWords();
        display.setColor('white');
        display.write([text]);
    }
    else if (topic.toString() == "iot-2/cmd/displayTemp/fmt/json"){
        var exec = require('child_process').exec; 
        var cmd = 'python /home/root/temp.py &';
        exec(cmd, function(error, stdout, stderr){
            
        });
    }
    else {
        console.log(theData.payload);
    }
});

client.on('error', function(){
    console.log("Connection Error!");
});



    
    
    

    
                    