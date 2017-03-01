	
	/**
	 * Module dependencies.
	 */
	
	var express = require('express')
	  , routes = require('./routes')
	  , user = require('./routes/user')
	  , http = require('http')
	  , path = require('path');
	
	var fs = require('fs'); 
	var app = express();
	var server=http.createServer(app);
	var io = require('socket.io')(server);
	var mysql      = require('mysql');
	var dbmon=require('dbmon');
	var connection = mysql.createConnection({
	  host     : 'sql6.freesqldatabase.com',
	  user     : 'sql6154810',
	  password : 'hT5fCtiysG',
	  database : 'sql6154810'
	});
	
	// all environments
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
	
	
	// development only
	if ('development' == app.get('env')) {
	  app.use(express.errorHandler());
	}
	
	
	app.get('/', routes.index);
	
	app.get('/users', user.list);
	
	app.get('/getVideo', function(re,res){
		
		res.render('test');
	});
	
	
	fs.readFile('./data/sampledata.json', 'utf8', onFileRead);
	
	connection.connect(function(err){
	if(!err) {
	    console.log("Database is connected ... nn");    
	} else {
	    console.log("Error connecting database ... nn");    
	}
	});
	
	
	
	function onFileRead(err, data) {  
		  if (err) throw err;
		  var currentPackage = JSON.parse(data);
		  console.log(currentPackage);
		}
	
	
	io.on('connection', function (socket) {
		  socket.emit('news', { hello: 'world' });
		  socket.on('my other event', function (data) {
		    console.log(data);
		  });
		  
		  
		  fs.watch('./data/sampledata.json', {
			  persistent: true
			}, function(event, filename) {
					console.log(event + " event occurred on " + filename);
					fs.readFile('./data/sampledata.json', 'utf8', function(err,data){
						console.log(JSON.parse(data));
						socket.emit('change in file',JSON.parse(data));
					});
					
			});
		  
		 
		  
		  socket.on('write my data in file',function(data){
			   console.log('write req '+data);
			  fs.readFile('./data/sampledata.json', 'utf8', function(err,fileData){
					var fileDataArray=JSON.parse(fileData);
					fileDataArray.push(data);
					var finalJson=JSON.stringify(fileDataArray);
					fs.writeFile('./data/sampledata.json', finalJson, 'utf8', function(err){
						if(err){throw err;}
						console.log('successfully written in file');
					});;
					
				});
		  	});
		  
	
	});
	
	
	
	
	
	server.listen(app.get('port'), function(){
	  console.log('Express server listening on port ' + app.get('port'));
	});
