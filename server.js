/*---------------------------------------------------
* File: Server.js
* Purpose: To create a server using Express
*---------------------------------------------------*/

var app = require('express')();
var http = require('http').Server(app);
var config = require('./server/configure');
var mongoose = require('mongoose');
var Models = require('./models');


//To run the commands
var cmd=require('node-cmd');

var io = require('socket.io')(http);
var mqtt = require('mqtt');
var path = require('path');
var mqtt_client  = mqtt.connect('mqtt:/\/127.0.0.1:1883');

mqtt_client.on('connect', function () {
  mqtt_client.subscribe('presence');
});

mqtt_client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString());
  io.emit('RFID value',{RFID:"1234567890"});
});


/*-----------------------------------
 *Purpose: To Read the serail data
 *------------------------------------*/
const Port = '/dev/ttyUSB0';
const SerialPort = require('serialport');

//const SerialPort = serialPort.SerialPort;
const Readline = SerialPort.parsers.Readline;
var port = new SerialPort(Port,{
        baudRate  : 9600
});
var parser = new Readline();
port.pipe(parser);

var id = [];
var len;
var temp;

//To Check the Audio start event
var START_SONG = false;

//Flowing mode
port.on('data', function(data){

        temp = data.toString('utf8');
        len = temp.split("").length;
        if(len == 1)
          id.push(temp);
        else
        {
          var value = temp.split("");
          var i = 0;
          while(i < len)
                {
                        id.push(value[i]);
                        i += 1;
                }
        }

        if(id.length ==12)
        {
                console.log("RFID read: " + id);
                var RFIDTag = id.join("");
                io.emit('RFID value',{RFID:RFIDTag});
                id =[];

		//To run the song based on the RFID tag value
		RunningtheSong(RFIDTag);
        }

});


/*-----------------------------
 * To run the song RFID tag
 *---------------------------*/
function RunningtheSong(tag)
{
	if(START_SONG)
	{
		console.log(tag);
		Models.Artefacts.findOne({RFID:tag},function(err,doc)
		{
			var filePath = path.resolve('./public/upload/audio/');
			var fileName = doc.audiofileid+'.mp3';
			var process = cmd.get('aplay '+filePath+'/'+fileName, function(err,data,stderr){
			if(!err)
				console.log("running the song: " + data);
			else
				console.log("ERROR: \n"+ err);
			});
		});
		console.log(process.pid);
	}
	else
		console.log("Song can not be started. Go to the Starter Page");
}


//Socket.io callback
io.on('connection', function(socket){

	console.log('A client is connected');

	socket.on("SONG CHANGED",function(data){
		console.log("Song changed");
		Models.Audios.findOne({_id:data.audio},function(err,doc)
		{
			if(!err)
			{
				var song_name=doc.name;
				Models.Artefacts.update({_id: data.artefact},{$set:{audiofileid:data.audio, audiofile:song_name}},function(err,doc){
					if(!err)
					{
						var SONG_DETAILS={artefact:data.artefact, song: song_name};
						socket.emit("SONG UPDATED",{status:200,SONG_DETAILS });
						console.log("Updated");
						RunningtheSong("1234567890");
					}
					else
						socket.emit("SONG UPATED",{status:500});
				});
			}
		});
	});
	socket.on("SONG_START", function(data){
		START_SONG = true;
		console.log("Song start fired!");
	});

	socket.on("SONG_STOP", function(data){
		START_SONG = false;
		console.log("Song stop fired!");
	});
});

app.set('port',process.env.PORT || 3300);
app.set('views',__dirname + '/views');
app = config(app);

mongoose.connect("mongodb://localhost/interactiveTable");
mongoose.connection.on('open',function(){
	console.log("Mongoose Connected");
});

http.listen(3300, function(){
  console.log('listening on *:3300');
});
