var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var DeviceSchema =new Schema({
	name:		{type: String},
	description: 	{type: String},
	_id:		{type: String},
	audiofile:	{type: String},
	audiofileid:	{type: String},
	RFID:		{type: String},
	timestamp:	{type: Date ,'default': Date.now}
});1

module.exports= mongoose.model('Artefact',DeviceSchema);
