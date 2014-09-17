Ext.ns("mOQOLD");
var choosedCalType = '';
mOQOLD.Settings = Ext.extend(Ext.form.FormPanel, {
	scroll: "vertical",
	defaults: {
		required: true,
		labelAlign: 'top',
		labelWidth: 280
	},

	backCard: 'mainmenu',

	initComponent: function () {

		this.dockedItems = [
        {
        	xtype: 'toolbar',
        	ui: 'light',
        	dock: 'top',
        	title: "Set-Up",
        	items: [{ xtype: 'moqold.back-button', handler: this.doSave, scope: this}]
        }
        ];

		this.buildItems();

		mOQOLD.Settings.superclass.initComponent.call(this);
	},

	goPrev: function () {
		mOQOLD.Usability.update("Settings: Back button clicked");
		mOQOLD.Main.flipPage({ targetCard: this.backCard });
	},

	loadRec: function () {
		var store = mOQOLD.stores.SiteSpecificOffline;
		this.rec = store.findByExact('orgID', mOQOLD.LoginRec.get('orgID'));
		this.load(this.rec);
		this.load(mOQOLD.DefaultRec);
	},

	buildItems: function () {
		var items = [
		{
			xtype: "selectfield",
			label: "Activity View",
			enableToggle: true,
			name: 'calendarType',
			options: [
                {
                	text: "Day",
                	value: 'daily'
                },
                {
                	text: "Month",
                	value: 'monthly'
                }
                ]
		},
        {
        	xtype: "colorpickerfield",
        	name: "colorCode",
        	label: "My Color",
        	colors: mOQOLD.Colors
        },
        {
        	xtype: "selectfield",
        	name: "nameDisplay",
        	label: "Participant Name Display",
        	options: [
				{
					text: "First Name, Last Name",
					value: 1
				},
				{
					text: "Last Name, First Name",
					value: 2
				}
            ]
        },
		{
			xtype: "selectfield",
			label: "Debug Mode",
			name: 'debugType',
			options: [
                {
                	text: "On",
                	value: 1
                },
                {
                	text: "Off",
                	value: 2
                }
                ]
		}, {
			xtype: "selectfield",
			label: "Session Time",
			name: 'sessionTimeVal',
			options: [
                {
                	text: "1 Hr",
                	value: 60
                },
                {
                	text: "1 Hr 30 mins",
                	value: 90
                },
                {
                	text: "2 Hr",
                	value: 120
                },
                ]
		},
		    {
		    	xtype: "fieldset",
		    	title: "CAUTION",
		    	items: [

            {
            	xtype: "button",
            	text: "Clear Local Storage",
            	ui: "decline",
            	scope: this,
            	handler: this.clearLocalConfirm
            }
            ]
		    }
        ];

		this.on("afterlayout", this.loadRec, this);
		this.on("activate", this.loadRec, this);

		this.items = items;
	},

	clearLocalConfirm: function () {
		mOQOLD.Usability.update("Settings: Clear local storage clicked");
		mOQOLD.FixedMsgBox.confirm("Confirm Clear", "Are you sure you want to clear all local data? You will be Logged out, Do you want to continue?", this.doLocalClear, this);
	},

	doLocalClear: function (btn) {
		if (btn === "yes") {
			mOQOLD.Usability.update("Settings: Local Storage cleared");
			window.localStorage.clear();
			this.clearAllStores();
			mOQOLD.Main.doLogout();
			mOQOLD.Main.handleLoginChange(false);
			Ext.getCmp('loginForm').reset();
			mOQOLD.Main.showLoginPage(); //Flipping to Login Screen
		}
	},

	clearAllStores: function () {
		var stores = mOQOLD.stores;
		var store, name;
		for (name in stores) {
			store = stores[name];
			store.clearData();
		}
	},

	doSave: function () {
		mOQOLD.Usability.update("Settings: Save");
		var values = this.getValues();
		var errorFields = [];

		if (Ext.isEmpty(values.calendarType)) {
			errorFields.push("Activity View");
		}

		if (Ext.isEmpty(values.colorCode)) {
			errorFields.push("Color");
		}

		if (Ext.isEmpty(values.nameDisplay)) {
			errorFields.push("Name Display");
		}

		if (Ext.isEmpty(values.debugType)) {
			errorFields.push("Debug");
		}


		if (errorFields.length == 0) {
			mOQOLD.DefaultRec.set("calendarType", values.calendarType);
			mOQOLD.DefaultRec.set("nameDisplay", values.nameDisplay);
			mOQOLD.DefaultRec.set("colorCode", values.colorCode);
			mOQOLD.DefaultRec.set("debugType", values.debugType);
			mOQOLD.currentSessionTimeOutValue = (parseInt(values.sessionTimeVal) * 60);
			mOQOLD.DefaultRec.set("sessionTimeVal", parseInt(values.sessionTimeVal));

			mOQOLD.stores.DefaultOffline.sync();
			var params = {
				extAction: "SiteConfigurationAPI",
				extMethod: "saveForm",
				extTID: 0,
				extUpload: false,
				extType: "rpc"
			};
			params.offline = true;
			params.newItem = (typeof this.rec === "object") ? false : true;
			Ext.applyIf(params, values);
			if (typeof this.rec === "object") {
				this.rec.set(params);
			} else {
				mOQOLD.stores.SiteSpecificOffline.add(params);
			}
			mOQOLD.stores.SiteSpecificOffline.sync();

			//reset the timer with new data
			if (mOQOLD.currentSessionTimeOutValue && mOQOLD.currentSessionTimeOutValue > 0) {
				mOQOLD.sessionTimeOutTask.delay(mOQOLD.currentSessionTimeOutValue * 1000);
			}
			this.goPrev();

		} else {

			errMsg = "Following fields are required:\r\n" + errorFields.join(", ") + ".\r\nDo you want to abort?";
			mOQOLD.FixedMsgBox.show({
				title: 'Error!',
				msg: errMsg,
				width: 300,
				buttons: Ext.MessageBox.YESNO,
				fn: function (btn, text) {
					if (btn == 'yes') {
						this.goPrev();
					}
				},
				scope: this
			});
		}

		delete values.calendarType;

		var params = {
			extAction: "SiteConfigurationAPI",
			extMethod: "saveForm",
			extTID: 0,
			extUpload: false,
			extType: "rpc"
		};

		Ext.applyIf(params, values);

		if (mOQOLD.checkOnline()) {
			if (mOQOLD.enableMask) {
				this.Mask = new Ext.LoadMask(Ext.getBody(), {
					msg: "Saving form..."
				});
				this.Mask.show();
			}
			Ext.Ajax.request({
				url: "../index.php/direct/router",
				params: params,
				scope: this,
				success: this.onSaveReturn
			});
			return false;
		} else {
			return true;
		}
	},

	onSaveReturn: function (response) {
		var result = Ext.decode(response.responseText).result;
		if (mOQOLD.enableMask) {
			this.Mask.hide();
		}
		if (result.success) {
			if (typeof this.rec === "object") {
				var data = result.data;
				this.rec.set(data);
			}
			mOQOLD.Main.flipPage({ targetCard: this.backCard });
		} else {
			mOQOLD.Usability.update("Settings: Save failed");
			mOQOLD.FixedMsgBox.alert("Saving form", "Something went wrong!");
		}
	}
});

Ext.reg("moqold.settings", mOQOLD.Settings);
