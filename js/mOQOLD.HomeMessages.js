Ext.ns("mOQOLD");

mOQOLD.HomeMessages = Ext.extend(Ext.ux.Portlet, {
	height: 200,
	layout: "fit",
	title: "Message Center",
	initComponent: function () {
		var messages = new mOQOLD.MaintenanceGridAbstract({
			title: "Message",
			baseAPI: "MessageAPI",
			gridActions: ["view"],
			defaultSort: "expireDate",

			getGridConfig: function () {
				return {
					hideTitle: true
				};
			},

			defaultSort: "expireDate",

			getHybridConfig: function () {
				return [
					{ dataIndex: "ID", type: "int", hidden: true },
					{ dataIndex: "subject", type: "string", header: "Subject" },
					{ dataIndex: "message", type: "string" },
					{ dataIndex: "mfrom", type: "string", header: "From" },
					{ dataIndex: "mto", type: "string" },
					{ dataIndex: "expireDate", type: "date" }
				];
			},

			dateRenderer: function (value) {
				var date = new Date(value);
				date = date.format("l F j Y");
				return date;
			},

			onView: function (grid, rowIndex, colIndex) {
				var store = grid.getStore();
				this.currec = store.getAt(rowIndex);
				this.getNameForId(this.currec);

			},
			getNameForId: function (rec) {
				var toName = rec.get("mto");
				if (Ext.isEmpty(toName)) {
					this.showEditWindow({success:true, login: 'ALL STAFF'});
				} else {
					Ext.app.UserAPI.getNameForID(toName, this.showEditWindow, this);
				}
			},
			showEditWindow: function (res) {
				if (res.success) {
					var html = "<b>To:</b> " + res.login;
					html += "<br><b>From:</b> " + this.currec.get("mfrom");
					html += "<hr><b>Message:</b> " + this.currec.get("message");

					var win = new Ext.Window({
						modal: true,
						width: 300,
						height: 300,
						autoScroll: true,
						title: this.currec.get("subject"),
						html: html
					});
					win.show();
				} else {
					Ext.Msg.alert("ID Error", res.msg);
				}

			},
			onReply: function (grid, rowIndex, colIndex) {
				var store = grid.getStore();
				var rec = store.getAt(rowIndex);

				var messageWin = mOQOLD.MessageWindow;
				messageWin.store = store;
				var win = messageWin.createWindow(rec);
				win.show();
			},

			addAddButton: Ext.emptyFn,
			createForm: null
		});

		this.items = messages.createPanel();

		mOQOLD.HomeMessages.superclass.initComponent.call(this);

		this.on("afterrender", this.addAddButton, this);
	},

	addAddButton: function () {
		var el = this.header.insertHtml("beforeEnd", "<span style='float:right;margin-right: 10px;'></span>", true);

		new Ext.Button({
			renderTo: el,
			text: "New",
			scope: this,
			handler: this.newMessage,
			disabled: !mOQOLD.Security.hasPermission("Message", "create")
		});
	},

	newMessage: function () {
		var grid = this.getComponent(0);
		var store = grid.getStore();
		var messageWin = mOQOLD.MessageWindow;
		messageWin.store = store;
		var win = messageWin.createWindow();
		win.show();
	}
});

mOQOLD.MessageWindow = new mOQOLD.MaintenanceGridAbstract({
	formButtons: ["send", "cancel"],

	baseAPI: "MessageAPI",

	getFormButtonConfigs: function () {
		return {
			send: { text: "Send", scope: this, handler: this.onSubmitWindow },
			cancel: { text: "Cancel", scope: this, handler: this.onCancelWindow }
		};
	},

	getFormConfig: function () {
		return {
			labelWidth: 60,
			autoLoadForm: false,
			defaults: {
				anchor: "-20",
				allowBlank: false
			}
		};
	},

	getFormItems: function () {
		var today = new Date();
		var expire = new Date(today.setMonth(today.getMonth() + 1));
		expire = expire.format("Y-m-d");

		var items = [
			{ xtype: "ux.combo", fieldLabel: "To", comboType: "user", name: "mto", hiddenName: "mto" , insert: { fullName: "ALL STAFF"} },
			{ fieldLabel: "Subject", name: "subject", maxLength: 45 },
			{ xtype: "datefield", fieldLabel: "Expire On", name: "formattedDate", value: expire },
			{ xtype: "textarea", fieldLabel: "Message", name: "message", grow: true, growMin: 60, growMax: 175,maxLength:45 }
		//{ xtype: "hidden", name: "mfrom", value: "unixmiah" },
		//{ xtype: "hidden", name: "orgID", value: "1" }
		];
		if (typeof this.rec === "object") {
			var rec = this.rec;

			var text = "\n\n";
			text += "---------------------------\n";
			text += rec.get("message");

			items.push({ xtype: "hidden", name: "replyID", value: id });
			items[0].value = rec.get("mfrom");
			items[1].value = "RE: " + rec.get("subject");
			items[3].value = text;
		}
		return items;
	},

	createWindow: function (rec) {
		var title = "New Message";
		if (typeof rec === "object") {
			this.rec = rec;
			title = "Reply";
		}
		var form = this.createForm(true);

		var showWin = new Ext.Window({
			modal: true,
			width: 400,
			title: title,
			items: form
		});

		showWin.on({
			scope: this,
			beforedestroy: this.onWindowDestroy
		});
		this.sendWindow = showWin;
		return this.sendWindow;
	},

	onWindowDestroy: function () {
		delete this.rec;
		delete this.sendWindow;
	},

	onCancelWindow: function () {
		this.sendWindow.close();
	},

	onSubmitWindow: function () {
		var win = this.sendWindow;
		var form = win.getComponent(0);
		form = form.getForm();

		if (!form.isValid()) {
			return;
		}

		var values = form.getValues();
		var expireDate = new Date(values.formattedDate).format("Y-m-d");

		if (form.isValid()) {
			this.msgBox = Ext.Msg.wait("Sending...", "Sending Message");
			form.submit({
				params: {
					expireDate: expireDate
				},
				scope: this,
				success: this.onSubmitWindowSuccess,
				failure: this.onSubmitWindowFailure
			});
		}
	},

	onSubmitWindowSuccess: function (form, action) {
		var result = action.result;
		this.msgBox.hide();

		this.msgBox = null;

		var message = result.success ? "Successfully sent" : "Something went wrong";
		Ext.Msg.alert("Sending Message", message);

		this.sendWindow.close();
		this.store.reload();
	},

	onSubmitWindowFailure: function () {
		this.msgBox.hide();

		this.msgBox = null;

		Ext.Msg.alert("Sending Message", "Something went wrong");
	}
});