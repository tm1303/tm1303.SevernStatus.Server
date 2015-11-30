//Lets require/import the HTTP module
var http = require('http');
var requestImport = require('request');

//Lets define a port we want to listen to
const PORT=8080; 

var options = {
  host: 'www.google.co.uk',
  port: 80,
  path: '/search?q=hello'
};

//We need a function which handles requests and send response
function handleRequest(request, response){
	
	// request.url
	console.log('About to start external request for ' + request.url);
		
	requestImport('http://www.google.com', function (error, innerResponse, body)
	{		
		console.log('Inside request body');
		
		if (!error && innerResponse.statusCode == 200)
		{
			console.log('200 OK');
			//console.log(body) // Show the HTML for the Google homepage. 
						
			response.end(body);
		}
	});		
	
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});	


