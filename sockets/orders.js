// inserting a Purchase Order in ERPNext
exports.insertPurchaseOrder = function(io, socket, db, client, erp)
{
	socket.on("insertPurchaseOrder", function(data, callback)
	{
		client.invoke("POST", erp.url, erp.user, erp.password, "/api/resource/Purchase Order", {"data" : data},
		function(error, res, more)
		{
			if(error)
				callback(null);
			else
			{
				data.po_details.forEach(function(i)
				{
					db.get("purchase_history").update
					({"username" : socket.username, "item_code" : i.item_code},
					{
						$set :
						{
							"item_code" : i.item_code,
							"item_name" : i.item_name,
							"barcode" : i.barcode,
							"brand" : i.brand,
							"description" : i.description,
							"image" : i.image,
							"default_supplier" : i.default_supplier
						},
						$inc : {"qty" : parseInt(i.qty)}
					},
					{upsert : true});
				});

				callback(res);
			}
			
			console.log(res);
		});

		console.log("[socket.io] - ERPNEXT -> Inserted a Purchase Order");
	});
}

// getting all Suppliers from ERPNext
exports.getSuppliers = function(io, socket, client, erp)
{
	socket.on("getSuppliers", function(callback)
	{
		client.invoke("GET", erp.url, erp.user, erp.password, "/api/resource/Supplier",
		function(error, res, more)
		{
			if(error)
				callback(null);
			else
				callback(res);
			
			console.log(res);
		});

		console.log("[socket.io] - ERPNEXT -> Fetched all suppliers");
	});
}

// getting one Purchase Order from ERPNext
exports.getPurchaseOrder = function(socket, db, client, erp)
{
	socket.on("getPurchaseOrder", function(data, callback)
	{
		client.invoke("GET", erp.url, erp.user, erp.password, ("/api/resource/Purchase Order/" + data),
		function(error, res, more)
		{
			if(error)
				callback(null);
			else
				callback(res);
			
			console.log(res);
		});

		console.log("[socket.io] - ERPNEXT -> Purchase Order " + data + " fetched");
	});
};

// getting all Purchase Orders from ERPNext
exports.getPurchaseOrders = function(socket, db, client, erp)
{
	socket.on("getPurchaseOrders", function(callback)
	{
		client.invoke("GET", erp.url, erp.user, erp.password, "/api/resource/Purchase Order", {"fields" : ["name", "supplier", "creation", "owner", "status"]},
		function(error, res, more)
		{
			if(error)
				callback(null);
			else
				callback(res);
			
			console.log(res);
		});

		console.log("[socket.io] - ERPNEXT -> All Purchase Orders fetched");
	});
};

// getting the history of purchases from MongoDB
exports.getPurchaseHistory = function(socket, db, client, erp)
{
	socket.on("getPurchaseHistory", function(callback)
	{
		db.get("purchase_history").find
		({"username" : socket.username},
		{sort : {"qty": -1}},
		function(err, docs)
		{
			if(err)
				callback(null);
			else
				callback(docs);
		});

		console.log("[socket.io] - MONGODB -> Purchase history fetched");
	});
};