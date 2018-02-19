/*---------------------------------------------------
* File: Server.js
* Purpose: To create a server using Express
*---------------------------------------------------*/

var app = require('express')();
//var app= express();
var http = require('http').Server(app);
var config = require('./server/configure');
var mongoose = require('mongoose');
var Models = require('./models');

var io = require('socket.io')(http);
var mqtt = require('mqtt');
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
        }

});



//Socket.io callback
io.on('connection', function(socket){
	console.log('A client is connected');

	socket.on("SONG CHANGED",function(data){
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
					}
					else
						socket.emit("SONG UPATED",{status:500});
				});
			}
		});
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
