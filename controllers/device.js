var Models = require('../models');

module.exports ={
	index: function(req,res){
		var viewModel ={
			artefact:{}
		}
		Models.Artefacts.findOne({id: {$regex: req.params.art_id}},function(err,docs){
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
                Models.Audios.findOne({id: {$regex: req.params.audio_id}},function(err,docs){
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
	create_audio: function(req,res){
		//TODO upload the file on the Server.
		 var saveDevice = function(){
                        var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
                        var devUrl= '';
                        for ( var i =0; i<=6  ; i +=1)
                        {
                                devUrl += possible.charAt(Math.floor(Math.random()*possible.length));
                        }
                        Models.Audios.find({id:devUrl},function(err,docs){
                                if(docs.length > 0)
                                {
                                        saveDevice();
                                }
                                else
                                {
                                        var newDev = new Models.Audios({
                                                name: req.body.name,
                                                id: devUrl
                                        });
                                        newDev.save(function(err,dev){
                                                res.redirect('/addaudio');
                                        });
                                }
                        });

                };
                saveDevice();



	},
	create: function(req, res){
		var saveDevice = function(){
			var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
			var devUrl= '';
			for ( var i =0; i<=6  ; i +=1)
			{
				devUrl += possible.charAt(Math.floor(Math.random()*possible.length));
			}
			Models.Artefacts.find({id:devUrl},function(err,docs){
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
						RFID:req.body.RFID,
						id: devUrl
					});
					newDev.save(function(err,dev){
						res.redirect('/addArtefact');
					});
				}
			});

		};
		saveDevice();

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
		Models.Artefacts.remove({id:{$regex: req.params.device_id}},function(err,docs){
			if(err) console.log(err);
			console.log("Device has been removed.");
		});
		res.send('DELETED');
	}

};