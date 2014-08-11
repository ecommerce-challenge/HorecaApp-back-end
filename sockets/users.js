// get all users
exports.getAllUsers = function(socket, db)
{
	socket.on("getAllUsers", function(callback)
	{
		console.log("[socket.io] - Getting all users");
		
		db.get("user").find({},
		function(err, docs)
		{
			if(err)
			{
				console.log("Unable to connect to the database");
			}
			else
			{	
				callback(docs);
			}
		});
	});
};