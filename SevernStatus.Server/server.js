var http = require('http');
var requestImport = require('request');
var url = require('url');

var xpath = require('xpath')
var dom = require('xmldom').DOMParser

const PORT=5000; 



//We need a function which handles requests and send response
function handleRequest(request, response){
		
	if( request.url.indexOf('favicon.ico') > -1)
	{
		console.log('facicon request cancelled');
		response.end();
		return;
	}
		
	var queryData = url.parse(request.url, true).query;	
	if( !queryData.road)
	{
		response.end('expected parameter: road=[roadname]');
		return;
	}
	
	var road = queryData.road.toUpperCase();
	var format = 'text';
	
	if(queryData.format)
	{
		format = queryData.format.toUpperCase();
	}
	
	requestImport('http://m.highways.gov.uk/feeds/rss/UnplannedEvents/South%20West.xml', function (error, innerResponse, body)
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
			//console.log("contains " + road + ": " + (xml.indexOf(road) > -1));
			
			if(format === 'XML'){
				response.end(xml);
				return;
			}
			
			var doc = new dom().parseFromString(xml);
			//console.log(doc);
			
			var nodes = xpath.select('//item[./road="' + road + '"]/description', doc);
			console.log('result length: ' + nodes.length);
			
			if(nodes.length===0)
			{
				console.log("No notifications found for " + road);
				response.end("No notifications found for " + road);
				return;
			}
			
			var output =[] ;
			
			var i =0;
			while ( i < nodes.length ) {		
				
				//console.log('nodes[' + i + '].data: ' + nodes[i].firstChild.data);
			
				var item = nodes[i].firstChild.data;				
				output.push(item);
				i++;				
			};
			
			//console.log('nodes[0].data: ' + nodes[0].firstChild.data);
			// console.log("node: " + nodes[0].toString())
						
			response.end(output.join("\n\n"));
		}
	});		
	
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
	console.log("Server listening on port: %s", PORT);
});	


