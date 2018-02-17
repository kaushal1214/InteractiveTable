var Models = require('../models');
var sidebar = require('../helpers/sidebar');
//Code for Websocktes
var websocket = require('ws').Server,
	wss = new websocket({port:8888});
var SOCKET =false;
var socket;
//Connection Event 
wss.on('connection', function connection(ws){
	SOCKET = true;
	socket = ws;
	ws.on('message', function incoming(message){
		console.log('received: %s',message);
		ws.send('Hello from the server');
	});
});

module.exports ={
	index: function(req,res){
		var viewModel ={
			book:{}
		}
		Models.Books.findOne({id: {$regex: req.params.device_id}},function(err,docs){
			if(err)
			{
				console.log(err);
			}
			if(docs)
			{
				viewModel.book =docs;
				sidebar(viewModel,function(viewModel){
					res.render('book',viewModel);
				});
				
			}
			else{
				res.redirect("/");
			}
		});
	
	},
	gigapan: function(req,res){
//	var data = JSON.parse(req.body);
	console.log(req.body.pointID);
	res.send(200);
	},
	create: function(req, res){
		var saveDevice = function(){
			var devUrl= req.body.RFID;
			Models.Books.find({id:devUrl},function(err,docs){
				if(docs.length > 0)
				{
					saveDevice();
				}
				else
				{
					var newDev = new Models.Books({
						name: req.body.title,
						description: req.body.des,
						type: req.body.books,
						id: req.body.RFID
					});
					newDev.save(function(err,dev){
						res.redirect('/books/'+devUrl);
					});
				}
			});

		};
		saveDevice();

	},
	returnBook: function(req,res){
		Models.Books.findOne({id: {$regex: req.params.device_id}},function(err, docs){
			if(err){
				console.log(err);
			}
			if(docs)
			{
				res.json(docs);

			}
			else
				res.json({Status:'Ok'});
		});

	},
	users: function(req,res,next){
		res.send('Users page');
	},

	delete: function(req,res){
		Models.Books.remove({id:{$regex: req.params.device_id}},function(err,docs){
			if(err) console.log(err);
			console.log("Device has been removed.");
		});
		res.send('DELETED');
	},
	issueBook: function(req,res){
		res.send('Book issue Page');
	}
};
