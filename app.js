// global variables
var users = {};
var erp = {"url" : "https://horecajeppie.frappecloud.com", "user" : "jesper.meijering@hva.nl", "password" : "1234janjoost"};

// module dependencies
var http = require("http");
var path = require("path");
var express = require("express");
var app = express();
var server = http.createServer(app);
var io = require("socket.io").listen(server);
var mongo = require("mongodb");
var monk = require("monk");
var db = monk("root:bitnami@localhost:27017/admin");
var BSON = require('mongodb').BSONPure;

// connect to the python server
var zerorpc = require("zerorpc");
var client = new zerorpc.Client();
client.connect("tcp://127.0.0.1:4242");

// all environments
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.favicon());
app.use(express.logger("dev"));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser("your secret here"));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, "public")));

// development only
if ("development" == app.get("env"))
{
	app.use(express.errorHandler());
}

// [GET] routes
app.get("/",					require("./routes/index").index);

// client / server interaction
io.set('log level', 1);
io.sockets.on("connection", function(socket)
{
	socket.on("joinRoom", function(data, callback)
	{
		socket.userID = data.userID;
		socket.username = data.username;
		users[socket.username] = socket;
	});

	require("./sockets/index").login(socket, db);
	require("./sockets/inventory").getItems(socket, db, client, erp);
	require("./sockets/inventory").scanItem(socket, db, client, erp);
	require("./sockets/orders").getSuppliers(io, socket, client, erp);
	require("./sockets/orders").getPurchaseOrder(socket, db, client, erp);
	require("./sockets/orders").getPurchaseOrders(socket, db, client, erp);
	require("./sockets/orders").getPurchaseHistory(socket, db, client, erp);
	require("./sockets/orders").insertPurchaseOrder(io, socket, db, client, erp);
	require("./sockets/users").getAllUsers(socket, db);
	require("./sockets/messages").getConversation(socket, db);
	require("./sockets/messages").getUnreadMessages(socket, db);
	require("./sockets/messages").markAsRead(socket, db);
	require("./sockets/messages").sendMessage(socket, db, users);

	// log all the sockets that exist
	io.sockets.clients().forEach(function(s)
	{
		console.log("Socket connected: " + s.id);
	});
});

// create the server
server.listen(app.get("port"), function()
{
	console.log("Express server listening on port " + app.get("port"));
});