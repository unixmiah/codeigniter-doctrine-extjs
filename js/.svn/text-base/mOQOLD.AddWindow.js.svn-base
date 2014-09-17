Ext.ns("mOQOLD");

mOQOLD.AddWindow = new mOQOLD.MaintenanceGridAbstract({
	baseAPI: "UserAPI",
	getFormAPI: Ext.emptyFn,
	id: 0,
	getFormConfig: function () {
		return {
			autoLoadForm: false
		};
	},

	createWindow: function (rec) {
		var form = this.createForm(true);

		if (typeof rec !== "undefined") {
			form.getForm().loadRecord(rec);
		}

		var showWin = new Ext.Window({
			modal: true,
			width: 400,
			autoHeight: true,
			title: "Add " + this.title,
			items: form
		});

		showWin.on({
			scope: this,
			beforedestroy: this.onWindowDestroy
		});
		this.addWindow = showWin;
		return this.addWindow;
	},

	onSendUser: function () {
		this.onSaveForm("", true);
	},

	onWindowDestroy: function () {
		delete this.addWindow;
	},

	onCancelForm: function () {
		mOQOLD.Main.logAction({ pageName: this.pageName, action: 'cancel' });
		this.addWindow.close();
	},

	onSaveForm: function (params, doSendUser) {

		mOQOLD.Main.logAction({ pageName: this.pageName, action: 'save' });

		var grid = this.grid;
		var store = grid.getStore();

		var form = this.addWindow.getComponent(0);
		var basic = form.getForm();

		if (basic.isValid() === false) {
			return;
		}

		var data = basic.getValues();

		for (var name in this.addParams) {
			data[name] = this.addParams[name];
		}

		if (typeof params === "object") {
			for (var i = 0; i < params.length; i++) {
				var param = params[i];
				data[param.key] = param.value;
			}
		}

		var rec = new store.recordType(data);

		if (doSendUser === true) {
			store.on("write", this.doSendUser, this, { single: true });
		}

		store.add(rec);

		this.addWindow.close();
	},

	doSendUser: function (store, action, result, res, rec) {
		if (action === "create") {
			var baseApi = this.getBaseApi();

			baseApi.sendToUser(result[0]);
		}
	}
});