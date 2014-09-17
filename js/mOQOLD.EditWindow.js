Ext.ns("mOQOLD");

mOQOLD.EditWindow = new mOQOLD.MaintenanceGridAbstract({
	baseAPI: "UserAPI",
	getFormAPI: null,
	getFormConfig: function() {
		return {
			autoLoadForm: false
		};
	},
	
	createWindow: function() {
		var form = this.createForm(true);
		
		var showWin = new Ext.Window({
			modal: true,
			width: 400,
			title: "Edit " + this.title,
			items: form
		});
		
		showWin.on({
			scope: this,
			beforedestroy: this.onWindowDestroy
		});
		this.editWindow = showWin;
		return this.editWindow;
	},
	
	onSendUser: function() {
		this.onSaveForm(true);
	},
	
	onWindowDestroy: function () {
		delete this.grid;
		delete this.rec;
		delete this.editWindow;
	},

	onCancelForm: function () {
		this.editWindow.close();
	},

	onSaveForm: function (doSendUser) {
		var rec = this.rec;
		var store = rec.store;
		var window = this.editWindow;

		var form = window.getComponent(0).getForm();
		
		if (form.isValid() === false) {
			return ;
		}
		
		var values = form.getValues();
		
		rec.beginEdit();
		
		for (var name in values) {
			var value = values[name];
			if (value !== rec.get(name)) {
				rec.set(name, value);
			}
		}
		
		if (doSendUser === true) {
			store.on("write", this.doSendUser, this, { single: true });
		}
		
		rec.endEdit();
		
		window.close();
	},
	
	doSendUser: function(store, action, result, res, rec) {
		if (action === "update") {
			var baseApi = this.getBaseApi();
			
			baseApi.sendToUser(result[0]);
		}
	}
});