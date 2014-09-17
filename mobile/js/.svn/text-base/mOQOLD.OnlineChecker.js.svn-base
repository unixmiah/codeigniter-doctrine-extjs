Ext.ns("mOQOLD");

mOQOLD.OnlineChecker = {
	stop: false,
	
	start: function() {
		this.stop = false;
		this.task = new Ext.util.DelayedTask(this.runTask, this);
		this.task.delay(1000);
	},
	
	runTask: function() {
		if (mOQOLD.checkOnline()) {
			var login = this.checkLogin();
			if (login === 2) {
				if (typeof mOQOLD.Main.Login === "undefined") {
					mOQOLD.Main.showLogin("Must Authenticate Online");
				}
			} else if (login === 1) {
				this.doStoreCheck();
			}
		}
		if (!this.stop) {
			this.start();
		}
	},
	
	isRunning: function() {
		return typeof this.task === "object";
	},
	
	checkLogin: function() {
		if (!mOQOLD.LoggedIn) {
			return false;
		} else if (mOQOLD.LoggedIn === "offline") {
			return 2;
		} else if (mOQOLD.LoggedIn === "online") {
			return 1;
		}
	},
	
	stopTask: function() {
		this.stop = true;
	},
	
	doStoreCheck: function() {
		var stores = mOQOLD.stores;
		var store;
		
		for (var name in stores) {
			store = stores[name];
			if (store.offline) {
				var rec = store.findRecord("offline", true);
				if (typeof rec === "object" && rec !== null) {
					this.stopTask();
					this.formRequest(rec, store);
				}
			}
		}
	},
	
	formRequest: function(rec, store) {
		var params = {
			extAction: store.api,
			extMethod: "saveForm",
			extTID: 0,
			extUpload: false,
			extType: "rpc"
		};
		
		var data = rec.data;
		
		if (data.newItem) {
			delete data.ID;
		}
		
		Ext.applyIf(params, data);
		
		for (var key in params) {
			if (Ext.isDate(params[key])) {
				params[key] = params[key].format("Y-m-d");
			}
		}
		
		var onlineStore = mOQOLD.stores[store.onlineStore];
		if (typeof onlineStore !== "object") {
			this.start();
			return ;
		}
		
		Ext.Ajax.request({
			url: "../index.php/direct/router",
			params: params,
			scope: this,
			success: function(response) {
				var result = Ext.decode(response.responseText).result;
				if (result.success) {
					rec.set(result.data);
					onlineStore.add(result.data);
					this.start();
				}
			},
			failure: function() {
				this.start();
			}
		});
	}
};