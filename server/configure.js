/*-----------------------------------------------------
* File: configure.js
* Purpose: To configure our server
* -----------------------------------------------------*/

var path = require ('path'),
	routes = require('./routes'),
	exphbs = require('express-handlebars'),
	express = require('express'),
	bodyParser = require ('body-parser'),
	cookieParser = require ('cookie-parser'),
	morgan = require ('morgan'),
	methodOverride = require('method-override'),
	moment=require('moment'),
	multer = require('multer');
	errorHandler = require ('errorhandler');

module.exports = function(app){
	app.use(morgan('dev'));
	app.use(multer({
			dest: path.resolve('./public/upload/temp/')}).single('file'));
	app.use(bodyParser.urlencoded({'extended':true}));
	app.use(bodyParser.json());
	app.use(methodOverride());
	app.use(cookieParser('Abrakadabara'));
	routes(app);
	app.use('/public/', express.static(path.join(__dirname,'../public')));


	if('development'===app.get('env')){
		app.use(errorHandler());

	}
	//Register Handlerbars to render our HTML pages dynamically
	app.engine('handlebars', exphbs.create({
		defaultLayout: 'main',
		layoutsDir: app.get('views')+ '/layouts',
		partialsDir: [app.get('views') + '/partials'],
		helpers:{
			timeago: function(timestamp){
				return moment(timestamp).startOf('minute').fromNow();
				}
			}
		}).engine);
	app.set('view engine', 'handlebars');

	return app;
};
