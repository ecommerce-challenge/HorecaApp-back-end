// logging in
exports.login = function(socket, db)
{
	socket.on("login", function(data, callback)
	{
		console.log("Someone is attempting to login");
		
		db.get("user").find
		({
			"username" : data.username,
			"password" : data.password
		},
		function(err, docs)
		{
			if(err)
			{
				console.log("Unable to connect to the database");
			}
			else
			{
				if(Object.keys(docs).length != 0)
				{
					if(data.username == docs[0].username && data.password == docs[0].password)
					{
						console.log(data.username + " has logged in");
						callback({"user" : docs[0]});
					}
				}
				else
				{
					callback
					({
						"user" : null
					});
				}
			}
		});
	});
};