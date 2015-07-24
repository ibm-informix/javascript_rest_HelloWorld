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

//external dependencies
var express = require('express');
var app = express();
var request = require('request');

//connection information
var host = '';
var port = process.env.VCAP_APP_PORT || 8881;
var database = '';
var username = '';
var password = '';
//if pasting url info use this format
//var url = "https://" + username + ":" + password + "@" + host + ":" + port + database;
var url = 'http://cloudqa:cloud4pass@baratheon.lenexa.ibm.com:8881/dbTest';

//program variables
var collection = 'mycollection';
var data = "";
var commands = [];

function doEverything(res) {
	//if connecting to database via bluemix use the parseVcap function
	//parseVcap();
	
	//start chain of function calls
	createCollection();
	
	function createCollection(err) {
		//1 Create a collection
		commands.push("\n1 Create a collection");
		
		//POST /collection
		data = {"name":collection};
		request.post({url: url, body: JSON.stringify(data)}, function(error, response, body){
					commands.push("   -  Create collection: " +  body);
					createDocument();
			});
		
	}
	
	function createDocument() {
		//2 Inserts
		commands.push("\n2 Inserts");
		//2.1 Insert a single document into a collection
		commands.push("2.1 Insert a single document into a collection");
		
		//POST /collection
		data = "{'name':'user1','number':1}";
		request.post({url: url + "/" + collection, body: data}, function(error, response, body){
					commands.push("   -  Create document: " +  body);
					createMultipleDocument();
			});
		
	}
	
	function createMultipleDocument() {
		//2.2 Insert multiple documents into a collection
		commands.push("2.2 Insert multiple documents into a collection");
		
		//POST /collection
		data = "[{'name':'user2','number':2},{'name':'user3','number':3}]";
		request.post({url: url + "/" + collection, body: data}, function(error, response, body){
					commands.push("   -  Create multiple documents: " +  body);
					listDocument();
			});
		
	}
	
	function listDocument() {
		//Queries
		commands.push("\n3 Queries");
		
		//3.1 Find documents in a collection that match a query condition
		commands.push("3.1 Find documents in a collection that match a query condition");
		
		//GET /collection?query{number:3}
		request.get(url + "/" + collection + "?query={number:3}", function(error, response, body){
			commands.push("   -  List documents: " +  body);
			listAllDocuments();
		});
	
	}
	
	function listAllDocuments() {
		//3.2 Find all documents in a collection
		commands.push("3.2 Find all documents in a collection");
		
		//GET /collection
		request.get(url + "/" + collection, function(error, response, body){
					commands.push("   -  List documents: " +  body);
					updateDocument();
			});
	
	}
	
	function updateDocument() {
		//4 Update documents in a collection
		commands.push("\n4 Update documents in a collection");
		
		//PUT /collection?query={number:1}
		data = "{'name':'user1','number':4}";
		request.post({url: url + "/" + collection + "?query={number:1}", body: data}, function(error, response, body){
					commands.push("   -  Update document: " +  body);
					deleteDocument();
			});
	
	}
	
	function deleteDocument() {
		//5 Delete documents in a collection
		commands.push("\n5 Delete documents in a collection");
		
		//DELETE /collection?query={number:3}
		request.del(url + "/" + collection + "?query={number:3}", function(error, response, body){
			commands.push("   -  Delete document: " +  body);
			listAllCollections();
		});
	
	}
	
	function listAllCollections() {
		//6 List all collections in a database
		commands.push("\n6 List all collections in a database");
		
		//GET /
		request.get(url, function(error, response, body){
			commands.push("   -  List all collections: " + body);
			deleteCollection();
		});

	}
	
	function deleteCollection() {
		//7 Drop a collection
		commands.push("\n7 Drop a collection");
		
		//DELETE /collection
		request.del(url + "/" + collection, function(error, response, body){
			commands.push("   -  Delete collection: " +  body);
			printLog();
		});
		
	}
	
	function printLog() {
		
		for (var i = 0; i < commands.length; i++){
			console.log(commands[i]);
		}
		
		printBrowser();
	}
	
	function printBrowser(){
		app.set('view engine', 'ejs');
		res.render('index.ejs', {commands: commands});
	}
}

function parseVcap(){
	
//	var vcap_services = JSON.parse(process.env.VCAP_SERVICES);
//	var credentials = vcap_services['timeseriesdatabase'][0].credentials;
//	var ssl = false;
//	database = credentials.db;
//	host = credentials.host;
//	username = credentials.username;
//	password = credentials.password;
//	
//	if (ssl){
//		url = credentials.ssl_rest_url
//		port = credentials.ssl_rest_port;
//	}
//	else{
//		url = credentials.rest_url
//	    port = credentials.rest_port;  
//	}
	
}

app.get('/databasetest', function(req, res) {
	doEverything(res);
});

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/views/index.html');
});

app.listen(3011, function() {
	console.log("Running ......");
});

