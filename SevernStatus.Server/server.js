var http = require('http');
var requestImport = require('request');
var url = require('url');

var xpath = require('xpath')
var dom = require('xmldom').DOMParser

const PORT=5001; 



//We need a function which handles requests and send response
function handleRequest(request, response){
		
	if( request.url.indexOf('favicon.ico') > -1)
	{
		console.log('facicon request cancelled');
		response.end();
		return;
	}
		
	var queryData = url.parse(request.url, true).query;	
	var road = queryData.road.toUpperCase();
	
	requestImport('http://hatrafficinfo.dft.gov.uk/feeds/datex/England/UnplannedEvent/content.xml', function (error, innerResponse, body)
	{		
		//console.log('Inside request body');
		//
		//console.log('' + innerResponse ==null);
		//console.log('error:' + error);
		//console.log('statusCode' + innerResponse.statusCode);
		
		if (!error && innerResponse.statusCode === 200)
		{
			console.log('200 OK');
			
			var xml = body.replace('&nbsp;','').replace('&copy;','').replace(' xmlns="http://datex2.eu/schema/1_0/1_0" modelBaseVersion="1.0"', '');
			//console.log(xml);
			console.log("contains " + road + ": " + (xml.indexOf(road) > -1));
			
			var doc = new dom().parseFromString(xml);
			//console.log(doc);
			
			var nodes = xpath.select('//situation[.//groupOfLocations//descriptor/value="' + road + '"]//nonGeneralPublicComment/comment/value', doc);
			console.log('length: ' + nodes.length);
			
			if(nodes.length===0)
			{
				console.log("No notifications found for " + road);
				response.end("No notifications found for " + road);
				return;
			}
			
			console.log('nodes[0].data: ' + nodes[0].firstChild.data);
			// console.log("node: " + nodes[0].toString())
						
			response.end(nodes[0].firstChild.data);
		}
	});		
	
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
	console.log("Server listening on port: %s", PORT);
});	


