var Models = require('../models');

module.exports = {
	index: function(req,res){
		var viewModel = {
			Artefacts: [{Audios: {}}]
		};
		Models.Artefacts.find({},function(err,docs)
		{
			if(err)
				console.log(err);
			else if(docs)
			{	viewModel.Artefacts= docs;
				Models.Audios.find({},function(err,data)
				{
					if(err)
						console.log(err);
					else if(docs)
					{
						for(var i=0;i<viewModel.Artefacts.length;i++)
						{
							viewModel.Artefacts[i].Audios = data;
						}
						res.render('index',viewModel);
					}
				});
			}
		});
	}
};
