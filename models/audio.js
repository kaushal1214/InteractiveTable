var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var DeviceSchema =new Schema({
	name:		{type: String},
	id:		{type: String},
	timestamp:	{type: Date ,'default': Date.now}
});1

module.exports= mongoose.model('Audio',DeviceSchema);
