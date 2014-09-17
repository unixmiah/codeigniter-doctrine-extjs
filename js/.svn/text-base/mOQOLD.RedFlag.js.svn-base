Ext.ns("mOQOLD");

mOQOLD.RedFlag = new mOQOLD.MaintenanceGridAbstract({
	title: "Red Flag Report",
	formButtons: ["save", "cancel"],
	baseAPI: "RedFlagAPI",

	getFormConfig: function () {
		return {
			defaultType: "compositefield"
		};
	},

	createGrid: null,

	getFormItems: function () {
		var staffStoreConfig = {
			storeId: "StaffList",
			autoLoad: true,
			api: {
				read: Ext.app["ContactAPI"].listAll
			}
		};

		return [
			{ fieldLabel: "Score Type", labelAlign: "right", items: [
				{ xtype: "ux.combo", comboType: "scoreType", flex: 1 },
				{ xtype: "displayfield", width: 150, cls: "composite-label", value: "less or equal to:" },
				{ xtype: "ux.combo", comboType: "qol", name: "scoreValue" }
			]
			},
			{ fieldLabel: "during last", labelAlign: "right", items: [
				{ xtype: "ux.combo", comboType: "days", flex: 1, name: "duration", fieldLabel: "Days", hideLabel: true },
				{ xtype: "displayfield", width: 50, cls: "composite-label", name: "unit" },
				{ xtype: "displayfield", flex: 1, value: " " }
			]
			},
			{ xtype: "checkboxcombo", fieldLabel: "Send Red Flag Reports to", mode: "local", valueField: "ID", displayField: "fullName", hiddenName: "staffList", allowBlank: false, submitValue: false, name: "staffListTmp", store: mOQOLD.Stores.createStore(staffStoreConfig) }
		];
	},

	onSaveForm: function () {
		if (!this.permissionCheck("update")) {
			return;
		}
		var form = this.form;
		var cmp = form.getComponent(2);
		var params = {
			staffList: cmp.getValue()
		};

		var basic = form.getForm();

		if (basic.isValid()) {
			this.msgBox = Ext.Msg.wait("Sending...", "Saving Form");
			basic.submit({
				scope: this,
				params: params,
				success: this.onSendComplete,
				failure: this.onSendFailure
			});
		}
	}
});