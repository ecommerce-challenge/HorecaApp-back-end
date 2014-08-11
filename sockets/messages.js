// getting a conversation
exports.getConversation = function(socket, db)
{
	socket.on("getConversation", function(data, callback)
	{
		console.log("[socket.io] - Getting conversation");

		db.get("message").find
		({
			"sender" : data.currentUser,
			"receiver" : data.contact
		},
		function(err, sent)
		{
			if(err)
			{
				console.log("Unable to connect to the database");
			}
			else
			{	
				db.get("message").find
				({
					"sender" : data.contact,
					"receiver" : data.currentUser
				},
				function(err, received)
				{
					callback
					({
						"sent" : sent,
						"received" : received
					});
				});
			}
		});	
	});
};

// getting all unread messages
exports.getUnreadMessages = function(socket, db)
{
	socket.on("getUnreadMessages", function(data, callback)
	{
		console.log("[socket.io] - Getting unread messages");

		db.get("message").find
		({
			"receiver" : data.currentUser,
			"read" : false
		},
		function(err, unread)
		{
			if(err)
				callback(null);
			else
				callback(unread);
		});	
	});
};

// setting all messages from a certain conversation to read
exports.markAsRead = function(socket, db)
{
	socket.on("markAsRead", function(data, callback)
	{
		console.log("[socket.io] - Marking messages as read");

		db.get("message").update({"sender" : data.sender, "receiver" : data.currentUser},
		{
			$set : {"read" : true}
		},
		{"multi" : true});
	});
};

// sending a message
exports.sendMessage = function(socket, db, users)
{
	socket.on("sendMessage", function(data, callback)
	{
		var d =  new Date();
		var time = ("0" + d.getDate()).slice(-2) + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear() + " - " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);
		console.log("[socket.io] - Sending a message");

		db.get("message").insert
		({
			"sender" : data.currentUser,
			"receiver" : data.contact,
			"message" : data.message,
			"time" : time,
			"read" : false
		},
		function(err, message)
		{
			if(err)
			{
				console.log("Unable to connect to the database");
			}
			else
			{
				if(data.contact in users)
				{
					users[data.contact].emit("messageReceived", message);
				}

				callback(message);
			}
		});
	});
};