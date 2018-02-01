// HTTP Portion
var http = require('http');
var fs = require('fs'); // Using the filesystem module
var httpServer = http.createServer(requestHandler);
var url = require('url');
httpServer.listen(9000);

function requestHandler(req, res) {

	var parsedUrl = url.parse(req.url);
	console.log("The Request is: " + parsedUrl.pathname);

	fs.readFile(__dirname + parsedUrl.pathname,
		// Callback function for reading
		function (err, data) {
			// if there is an error
			if (err) {
				res.writeHead(500);
				return res.end('Error loading ' + parsedUrl.pathname);
			}
			// Otherwise, send the data, the contents of the file
			res.writeHead(200);
			res.end(data);
  		}
  	);
  	// res.writeHead(200);
  	// res.end("Life is wonderful");
}


/**************** WebSocket Portion **************************/

//Install by running npm install socket.io in terminal


// WebSockets work with the HTTP server
var io = require('socket.io').listen(httpServer);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
	// We are given a websocket object in our function
	function (socket) {

		console.log("We have a new client: " + socket.id);

		socket.on('name', function(name_data) {
			// Data comes in as whatever was sent, including objects
			console.log("Received opponent name: " + name_data);

			socket.broadcast.emit('gotName', name_data); //Send to everyone, but not me
		});


    socket.on('score', function(data) {
			// Data comes in as whatever was sent, including objects
			console.log("Received score: " + data);

      //io.emit('gotScore', data); //Send to everyone including me
			socket.broadcast.emit('gotScore', data); //Send to everyone, but not me
		});

		socket.on('disconnect', function() {
			console.log("Client has disconnected " + socket.id);
		});
	}
);

//http://bit.ly/2GtLGdy
