var Models = require('../models');
var fs = require('fs'),
    path = require('path');

module.exports ={
	index: function(req,res){
		var viewModel ={
			artefact:{}
		}
		Models.Artefacts.findOne({_id: {$regex: req.params.art_id}},function(err,docs){
			if(err)
			{
				console.log(err);
			}
			if(docs)
			{
				viewModel.artefact =docs;
				res.render('artefact_view',viewModel);
			}
			else{
				res.redirect("/");
			}
		});
	},
 	show_audio: function(req,res){
                var viewModel ={
                        audio:{}
                }
                Models.Audios.findOne({_id: {$regex: req.params.audio_id}},function(err,docs){
                        if(err)
                        {
                                console.log(err);
                        }
                        if(docs)
                        {
				console.log(docs);
                                viewModel.audio = docs;
                                res.render('audio_view',viewModel);
                        }
                        else{
                                res.redirect("/");
                        }
                });
        },



	/*---------------------------------------------
	 * GET to show GUI for adding Artefact details
	 *---------------------------------------------*/
	artefact: function(req,res){
		var model = {
				Artefacts:{}
  			};
		Models.Artefacts.find({},function(err,data){
			if(err)
				console.log(err);
			else
			{
				model.Artefacts=data;
				res.render('artefact',model);
			}
		});
	},

	/*-----------------------------------
	 * POST request to Save audio file
	 *----------------------------------*/
	create_audio: function(req,res){

		//TODO upload the file on the Server.
		 var saveDevice = function(){
                        var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
                        var devUrl= '';
                        for ( var i =0; i<=6  ; i +=1)
                        {
                                devUrl += possible.charAt(Math.floor(Math.random()*possible.length));
                        }
                        Models.Audios.find({_id:devUrl},function(err,docs){
                                if(docs.length > 0)
                                {
                                        saveDevice();
                                }
                                else
                                {
                                        var newDev = new Models.Audios({
                                                name: req.body.name,
                                                _id: devUrl
                                        });

					var tempPath = req.file.path,
						ext = path.extname(req.file.originalname).toLowerCase(),
						targetPath = path.resolve('./public/upload/audio/' + devUrl + ext);

					if(ext==='.mp3')
					{
						fs.rename(tempPath, targetPath, function(err){
						if(!err)
						{
		                                        newDev.save(function(err,dev){
								if(!err)
	                		                                res.redirect('/addaudio');
								else
									console.log(err);
                                		        });
						}
						else
							console.log(err);
						});
					}
					else
					{
						fs.unlink(tempPath, function(err){
							if(!err)
							res.json(500,{error: 'Only mp3 files are allowed.'});

						});
					}
                                }
                        });

                };
                saveDevice();
	},

	/*-----------------------------------
	 * POST request to save an artefact
   	 *----------------------------------*/
	create: function(req, res){
		var saveDevice = function(){
			var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
			var devUrl= '';
			for ( var i =0; i<=6  ; i +=1)
			{
				devUrl += possible.charAt(Math.floor(Math.random()*possible.length));
			}
			Models.Artefacts.find({_id:devUrl},function(err,docs){
				if(docs.length > 0)
				{
					saveDevice();
				}
				else
				{
					var newDev = new Models.Artefacts({
						name: req.body.name,
						description: req.body.des,
						audiofile:"Not Associated",
						audiofileid:"Not Associated",
						RFID:req.body.RFID,
						_id: devUrl
					});
					newDev.save(function(err,dev){
						res.redirect('/addArtefact');
					});
				}
			});

		};
		saveDevice();

	},

	/*-----------------------------------
	 * POST request to save the playlist
	 *-----------------------------------*/
	visualizer: function(req,res){
		        res.render('visualizer');

	},
	/*----------------------------------------
	 * GET to show GUI for saving Audio file
         *---------------------------------------*/
	audio: function(req,res){

		 var model = {
                                Audios:{}
                        };
                Models.Audios.find({},function(err,data){
                        console.log(data);
                        if(err)
                                console.log(err);
                        else
                        {
                                model.Audios=data;
                                res.render('audio',model);
                        }
                });


	},

	delete: function(req,res){
		Models.Artefacts.remove({_id:{$regex: req.params.device_id}},function(err,docs){
			if(err) console.log(err);
			console.log("Device has been removed.");
		});
		res.send('DELETED');
	}

};
