var express = require('express'),
	router= express.Router(),
	home = require('../controllers/home'),
	image = require('../controllers/device');

module.exports = function(app){
	router.get('/',home.index);
	router.get('/artefact/:art_id',image.index);
	router.get('/audio/:audio_id',image.show_audio);
	router.get('/addaudio',image.audio);
	router.get('/addartefact',image.artefact);

	/*-------------------------------------
	 * POST request to upload an artefact
	 *------------------------------------*/
	router.post('/uploadArtefact',image.create);

	/*---------------------------------
	 * POST request to save Audio files
	 *---------------------------------*/
	router.post('/uploadAudio',image.create_audio);

	/*----------------------------------------------
	 * POST request to Delete a Artefact/Audio file
	 *----------------------------------------------*/
	router.post('/books/:device_id/delete',image.delete);

	/*-----------------------------
	 * POST to save the playlist
	 *---------------------------*/
	router.post('/savePlaylist',image.savePlaylist);
	app.use(router);
};
