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
var TYPE = 'RGBLight';
var ID = 'RGBLight';
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
    console.log("Topic: " + topic.toString());
    console.log("Message: " + message.toString());
    var theData = JSON.parse("" + message.toString());
    
    var red = new mraa.Pwm(3);
    var green = new mraa.Pwm(5);
    var blue = new mraa.Pwm(6); 
    
    if (topic.toString() == "iot-2/cmd/setRGBColor/fmt/json"){
        red.enable(true);
        green.enable(true);
        blue.enable(true);
        red.write(Math.round(theData.color.red));
        green.write(Math.round(theData.color.green));
        blue.write(Math.round(theData.color.blue));
    }
    else if (topic.toString() == 'iot-2/cmd/setRGBPower/fmt/json'){
        red.enable(true); 
        green.enable(true);
        blue.enable(true);
        if (theData.enabled == true) {
            red.write(1);
            green.write(1);
            blue.write(1);
        } else {
            red.write(0.0);
            green.write(0.0);
            blue.write(0.0);
            setTimeout(function(){
                red.enable(false);
                green.enable(false);
                blue.enable(false);
            }, 20);
        }
    } else if (topic.toString() == 'iot-2/cmd/setText/fmt/json'){
        var text = theData.payload;
        var display = require('intel-edison-lcd-rgb-backlight-display-helper');
        display.set(2, 16);
        display.clearWords();
        display.setColor('white');
        display.write([text]);
    }
    else {
        console.log(theData);
    }
});

client.on('error', function(){
    console.log("Connection Error!");
});