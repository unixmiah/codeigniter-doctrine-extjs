Ext.ns("Ext.data");

Ext.data.DirectProxy = Ext.extend(Ext.data.AjaxProxy, {
	url: "../index.php/direct/router",
	methodList: {
		"create": "update",
		"read": "listAll",
		"update": "update",
		"destroy": "delete"
	},
	actionMethods: {
		create: 'POST',
		read: 'POST',
		update: 'POST',
		destroy: 'POST'
	},
	headers: {
		'Content-Type': 'application/json'
	},
	buildRequest: function (operation) {
		var params = Ext.applyIf(operation.params || {}, this.extraParams || {});
		params = Ext.applyIf(params, this.getParams(params, operation));

		var requestParams = {
			action: this.api,
			data: [params],
			method: this.methodList[operation.action],
			tid: 0,
			type: "rpc"
		};

		var request = new Ext.data.Request({
			action: operation.action,
			records: operation.records,
			operation: operation,
			jsonData: requestParams
		});

		request.url = this.buildUrl(request);


		operation.request = request;

		return request;
	}
});
Ext.data.ProxyMgr.registerType('direct', Ext.data.DirectProxy);