//Lets require/import the HTTP module
var http = require('http');
var requestImport = require('request');

var xpath = require('xpath')
var dom = require('xmldom').DOMParser
 

//Lets define a port we want to listen to
//const PORT=8080; 
//
//var options = {
//  host: 'www.google.co.uk',
//  port: 80,
//  path: '/search?q=hello'
//};

//We need a function which handles requests and send response
//function handleRequest(request, response){
	
	// request.url
	//console.log('About to start external request for ' + request.url);
		
	requestImport('http://hatrafficinfo.dft.gov.uk/feeds/datex/England/UnplannedEvent/content.xml', function (error, innerResponse, body)
	{		
		console.log('Inside request body');
		
		console.log('' + innerResponse ==null);
		console.log('error:' + error);
		console.log('statusCode' + innerResponse.statusCode);
		
		if (!error && innerResponse.statusCode === 200)
		{
			console.log('200 OK');
			
			var xml = body.replace('&nbsp;','').replace('&copy;','');
			console.log(xml);
			console.log("contains M48: " + xml.indexOf("xml") > -1);
			
			var doc = new dom().parseFromString(xml);
			
			var nodes = xpath.select('//situation[//groupOfLocations//descriptor/value="M48"]//nonGeneralPublicComment/comment/value', doc);
			console.log(nodes.length);
			// console.log(nodes[0].localName + ": " + nodes[0].firstChild.data)
			// console.log("node: " + nodes[0].toString())
						
			response.end(nodes[0].localName + ": " + nodes[0].data);
		}
	});		
	
//}

//Create a server
//var server = http.createServer(handleRequest);

//Lets start our server
//server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
   // console.log("Server listening on: http://localhost:%s", PORT);
//});	


