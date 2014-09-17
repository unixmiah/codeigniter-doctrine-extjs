Ext.ns("mOQOLD");

mOQOLD.OnlineChecker = {
	stop: false,

	start: function () {
		this.stop = false;
		this.task = new Ext.util.DelayedTask(this.runTask, this);
		this.task.delay(5000); //This will check every 5 secs.
	},

	runTask: function () {
		//if (mOQOLD.checkOnline()) {
		this.doStoreCheck();
		//}
		if (!this.stop) {
			this.start();
		}
	},

	isRunning: function () {
		return typeof this.task === "object";
	},

	stopTask: function () {
		this.stop = true;
	},
	startsWith: function (str, prefix) {
		return str.indexOf(prefix) === 0;
	},
	doStoreCheck: function () {
		if (mOQOLD.LoggedIn) {
			//this.syncStores();
			var stores = mOQOLD.stores;
			var store;

			for (var name in stores) {
				store = stores[name];
				if (store.offline) {
					var onlineStore = mOQOLD.stores[store.onlineStore];
					if (onlineStore) {
						var rec = store.findRecord("offline", true);
						if (typeof rec === "object" && rec !== null && mOQOLD.checkOnline()) {
							this.stopTask();
							this.formRequest(rec, store);
							return;
						}
					}
				}
			}

			this.updateBatchLog(15, false);

		}

	},
	updateBatchLog: function (count, isAll) {
		this.logCounter = (count) ? count : 15;

		var usabilityStore = mOQOLD.stores.Usability;
		if (isAll === true) { this.logCounter = usabilityStore.getCount(); }
		if (usabilityStore.getCount() >= this.logCounter) {
			this.stopTask();
			var recs = usabilityStore.getRange(0, this.logCounter);
			var i = 0;
			for (; i < recs.length; i++) {
				if (!recs[i].get('actionEtime')) {
					recs[i].set('actionEtime', new Date());
				}
			}
			this.usabilityFormRequest(recs, usabilityStore, { scope: this });
		}
	},
	usabilityFormRequest: function (recs, store, options) {
		options = options || {};
		var data = recs;
		var i;
		for (; i < data.length; i++) {
			if (data[i].newItem) {
				delete data[i].ID;
			}
		}

		var arr = [];
		Ext.each(data, function (record) {
			arr.push(record.data);
		});

		var params = {
			extAction: store.api || store.onlineApi,
			extMethod: "HandheldUsabilityLog",
			extTID: 0,
			extUpload: false,
			extType: "rpc",
			logData: Ext.encode(arr)
		};



		Ext.Ajax.request({
			url: "../index.php/direct/router",
			params: params,
			scope: this,
			success: this.onBatchUsabilitySuccess,
			failure: function () {
				this.start();
			}
		});
	},

	formRequest: function (rec, store, options) {
		options = options || {};

		var params = {
			extAction: store.api || store.onlineApi,
			extMethod: "saveForm",
			extTID: 0,
			extUpload: false,
			extType: "rpc"
		};

		var data = rec.data;

		if (data.newItem) {
			delete data.ID;
		}

		if (store.api === "ActivityDetailAPI") {
			data = this.processActivityDates(data);
		}
		Ext.applyIf(params, data);

		for (var key in params) {
			if (Ext.isDate(params[key])) {
				//params[key] = params[key].format("Y-m-d");
			}
		}

		Ext.Ajax.request({
			url: "../index.php/direct/router",
			params: params,
			scope: this,
			success: function (response, params) {
				var result = Ext.decode(response.responseText).result;
				//Ext.Msg.alert("Message", response.responseText);
				if (result.success) {
					Ext.apply(result.data, { newItem: false, offline: false });
					rec.set(result.data);
					if (data.newItem) {
						store.onlineStore.add(result.data);
					}
					if (options.success) {
						options.success.call(options.scope || this, rec, store, options);
					}
					this.start();
				} else {
					if (mOQOLD.Main.showDebug()) {
						mOQOLD.FixedMsgBox.alert('Remote Save Error', 'Failed while trying to save data to ' + params.extAction);
					}
					this.start();
				}
			},
			failure: function () {
				this.start();
			}
		});
	},
	onBatchUsabilitySuccess: function (response, params) {

		var result = Ext.decode(response.responseText);
		if (result.type === "rpc") {
			var usabilityStore = mOQOLD.stores.Usability;
			if (result.result.success) {
				usabilityStore.remove(usabilityStore.getRange(0, this.logCounter));
			}
		} else {
			//if this is true then there is some exception in saving this data.
			if (mOQOLD.Main.showDebug()) {
				mOQOLD.FixedMsgBox.alert('Remote Save ' + result.type, result.message);
			}
		}
		this.start();
	},
	processActivityDates: function (values) {

		values.endDate = values.startDate.clone();
		values.startDate = values.startDate.format("m/d/Y");
		values.endDate = values.endDate.format("m/d/Y");

		values.actDtlDuration = Math.floor((values.actDtlEtime.getTime() - values.actDtlStime.getTime()) / 1000 / 60);

		return values;
	}

};