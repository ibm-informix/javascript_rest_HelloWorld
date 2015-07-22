/*-
 * Javascript Sample Application: Connection to Informix with REST
 */

/*-
 * Topics
 * 1 Create a collection
 * 2 Inserts
 * 2.1 Insert a single document into a collection
 * 2.2 Insert multiple documents into a collection
 * 3 Queries
 * 3.1 Find documents in a collection that match a query condition
 * 3.2 Find all documents in a collection
 * 4 Update documents in a collection
 * 5 Delete documents in a collection
 * 6 List all collections in a database
 * 7 Drop a collection
 */

var express = require('express');
var app = express();
var https = require('http');
var commands = [];
//var myCert = require('fs').readFileSync("");
var host;
var port = process.env.VCAP_APP_PORT || 8881;
var database;
var username;
var password;

function doEverything(res) {
	parseVcap();
	var collectionOptions = {
			host : host,
			path : database,
			port : port,
			method : 'POST',
			headers: {
			     'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
			   } 
	};
	
	function createCollection(err) {
		//1 Create a collection
		commands.push("\n1 Create a collection");
		
		var request = https.request(collectionOptions, function(response) {
			if (err){
			return console.error("error: ", err.message);
		}
			var outputString = '';
			response.on('data', function(chunk) {
				outputString += chunk;
			});
	
			response.on('end', function() {
				commands.push("\tCreate Collection: " + outputString);
				createDocument();
			});
		});
		request.write("{'name':'mycollection'}");
		request.end();
	}
	
	function createDocument() {
		//2 Inserts
		commands.push("\n2 Inserts");
		//2.1 Insert a single document into a collection
		commands.push("2.1 Insert a single document into a collection");
	
		collectionOptions.path = database + "/mycollection";
		
		var request = https.request(collectionOptions, function(response) {
			var outputString = '';
			response.on('data', function(chunk) {
				outputString += chunk;
			});
	
			response.on('end', function() {
				commands.push("\tCreate Document: " + outputString);
				createMultipleDocument();
			});
		});
		request.write("{'name':'user1','number':1}");
		request.end();
	}
	
	function createMultipleDocument() {
		//2.2 Insert multiple documents into a collection
		commands.push("2.2 Insert multiple documents into a collection");
	
		var request = https.request(collectionOptions,
				function(response) {
					var outputString = '';
					response.on('data', function(chunk) {
						outputString += chunk;
					});
	
					response.on('end', function() {
						commands.push("\tCreate Multiple Documents: "
								+ outputString);
						listDocument();
					});
				});
		request.write("[{'name':'user2','number':2},{'name':'user3','number':3}]");
		request.end();
	}
	
	function listDocument() {
		//Queries
		commands.push("\n3 Queries");
		//3.1 Find documents in a collection that match a query condition
		commands.push("3.1 Find documents in a collection that match a query condition");
	
		collectionOptions.path = database + "/mycollection?query={number:3}";
		collectionOptions.method = 'GET'
	
		https.request(collectionOptions, function(response) {
			var outputString = '';
			response.on('data', function(chunk) {
				outputString += chunk;
			});
	
			response.on('end', function() {
				commands.push("\tList Document: " + outputString);
				listAllDocuments();
			});
		}).end();
	}
	
	function listAllDocuments() {
		//3.2 Find all documents in a collection
		commands.push("3.2 Find all documents in a collection");
	
		collectionOptions.path = database + "/mycollection";
		
		https.request(collectionOptions, function(response) {
			var outputString = '';
			response.on('data', function(chunk) {
				outputString += chunk;
			});
	
			response.on('end', function() {
				commands.push("\tList Documents: " + outputString);
				updateDocument();
			});
		}).end();
	}
	
	function updateDocument() {
		//4 Update documents in a collection
		commands.push("\n4 Update documents in a collection");
		
		collectionOptions.path = database + "/mycollection/?query={number:1}";
		
		var request = https.request(collectionOptions, function(response) {
			var outputString = '';
			response.on('data', function(chunk) {
				outputString += chunk;
			});
	
			response.on('end', function() {
				commands.push("\tUpdate Document: " + outputString);
				deleteDocument();
			});
		});
		request.write("{'name':'user1','number':4}");
		request.end();
	
	}
	
	function deleteDocument() {
		//5 Delete documents in a collection
		commands.push("\n5 Delete documents in a collection");
		
		collectionOptions.path = database + "/mycollection?query={number:3}";
		collectionOptions.method = "DELETE";
		
		https.request(collectionOptions, function(response) {
			var outputString = '';
			response.on('data', function(chunk) {
				outputString += chunk;
			});
	
			response.on('end', function() {
				commands.push("\tDelete Document: " + outputString);
				listAllCollections();
			});
		}).end();
	
	}
	
	function listAllCollections() {
		//6 List all collections in a database
		commands.push("\n6 List all collections in a database");
	
		collectionOptions.path = database;
		collectionOptions.method = 'GET';
	
		https.request(collectionOptions, function(response) {
			var outputString = '';
			response.on('data', function(chunk) {
				outputString += chunk;
			});
	
			response.on('end', function() {
				commands.push("\tList Collections: " + outputString);
				deleteCollection();
			});
		}).end();
	}
	
	function deleteCollection() {
		//7 Drop a collection
		commands.push("\n7 Drop a collection");
	
		collectionOptions.path = database + "/mycollection";
		collectionOptions.method = "DELETE";
	
		https.request(collectionOptions, function(response) {
			var outputString = '';
			response.on('data', function(chunk) {
				outputString += chunk;
			});
	
			response.on('end', function() {
				commands.push("\tDelete Collection: " + outputString);
				printLog();
			});
		}).end();
	
	}
	
	function printLog() {
		for (var i = 0; i < commands.length; i++){
			console.log(commands[i]);
		}
	}
	
//	function printBrowser(){
//		app.set('view engine', 'ejs');
//		res.render('index.ejs', {commands: commands});
//	}
	
	//start functions	
	createCollection();
}

function parseVcap(){
//	var vcap_services = JSON.parse(process.env.VCAP_SERVICES);
//	var credentials = vcap_services['altadb-dev'][0].credentials;
//	var ssl = false;
//	database = credentials.db;
//	host = credentials.host;
//	username = credentials.username;
//	password = credentials.password;
//	
//	if (ssl){
//		restport = credentials.ssl_drda_port;
//	}
//	else{
//	    restport = credentials.drda_port;  
//	}
}
doEverything();

app.get('/databasetest', function(req, res) {
	doEverything(res);
});

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/views/index.html');
});

app.listen(port);

