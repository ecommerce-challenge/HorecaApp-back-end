// getting one Item from ERPNext by barcode
exports.scanItem = function(socket, db, client, erp)
{
	socket.on("scanItem", function (data, callback)
	{
		client.invoke("GET", erp.url, erp.user, erp.password, "/api/resource/Item", {"filters" : [["Item", "barcode", "=", data]]},
		function(error, res, more)
		{
			if(error)
				callback(null);
			else
			{
				var action = "/api/resource/Item/";

				if(res.data.length != 0)
					action += res.data[0].name;
				else
					action += "-1";

				client.invoke("GET", erp.url, erp.user, erp.password, action,
				function(error, res, more)
				{
					if(error)
						callback(null);
					else
						callback(res);
					
					console.log(res);
				});
			}
		});

		console.log("[socket.io] - ERPNEXT -> Item " + data + " fetched");
	});
};

// getting all Items from ERPNext
exports.getItems = function(socket, db, client, erp)
{
	socket.on("getItems", function(callback)
	{
		client.invoke("GET", erp.url, erp.user, erp.password, "/api/resource/Item", {"fields" : ["barcode", "item_name", "item_code", "brand", "description", "default_supplier", "image"]},
		function(error, res, more)
		{
			if(error)
				callback(null);
			else
				callback(res);
			
			console.log(res);
		});

		console.log("[socket.io] - ERPNEXT -> All Items fetched");
	});
};