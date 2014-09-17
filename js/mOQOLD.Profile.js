Ext.ns("mOQOLD");

mOQOLD.Profile = new mOQOLD.MaintenanceGridAbstract({
	title: "My Profile",
	baseAPI: "ProfileAPI",
	formButtons: ["save", "clear"],

	getFormConfig: function () {
		return {
			trackResetOnLoad: true,
			labelAlign: "right",
			labelWidth: 125
		};
	},

	createGrid: null,

	onSaveForm: function () {
		if (!this.permissionCheck("update")) {
			return;
		}
		var form = this.form;
		var fieldset = form.getComponent(1);

		var currPass = fieldset.getComponent(0);
		var currPassValue = currPass.getValue();
		var newPass = fieldset.getComponent(1);
		var newPassValue = newPass.getValue();
		var newPass1 = fieldset.getComponent(2);
		var newPass1Value = newPass1.getValue();

		if (currPassValue !== "") {
			if (newPassValue !== newPass1Value || newPassValue === "" || newPassValue === "") {
				Ext.MessageBox.alert("New Password", "New passwords do not match or are empty!");
				newPass.markInvalid();
				newPass1.markInvalid();
				return;
			}
		} else {
			if (newPassValue !== "" || newPass1Value != "") {
				Ext.MessageBox.alert("New Password", "If you want to change your password, you must enter your current password!");
				currPass.markInvalid();
				newPass.clearInvalid();
				newPass1.clearInvalid();
				return;
			}
		}

		currPass.clearInvalid();
		newPass.clearInvalid();
		newPass1.clearInvalid();

		var form = form.getForm();
		if (form.isValid()) {
			this.msgBox = Ext.Msg.wait('Sending...', 'Saving Form');
			form.submit({
				scope: this,
				success: this.onSendComplete,
				failure: this.onSendFailure
			});
		}
	},

	getFormItems: function () {
		var items = [];

		var enterListener = {
			scope: this,
			specialkey: function (f, e) {
				if (e.getKey() === e.ENTER) {
					this.onSaveForm();
				}
			}
		};

		var defaults = {
			anchor: "-20",
			allowBlank: false,
			defaults: {
				allowBlank: false
			},
			listeners: enterListener
		};

		var first = [
			{ fieldLabel: "First Name", xtype: "compositefield", labelAlign: "right", items: [
				{ xtype: "textfield", flex: 1, name: "firstName", maxLength:45, maxLengthText:'First Name should be less than 45 characters' },
				{ xtype: "displayfield", width: 75, cls: "composite-label", value: "Last Name:" },
				{ xtype: "textfield", flex: 1, name: "lastName", maxLength: 45, maxLengthText: 'Last Name should be less than 45 characters' }
			]
			},
			{ fieldLabel: "Phone", xtype: "compositefield", labelAlign: "right", items: [
				{ xtype: "textfield", flex: 1, name: "phoneNumber", vtype: 'phone' },
				{ xtype: "displayfield", width: 75, cls: "composite-label", value: "Cell Phone:" },
				{ xtype: "textfield", flex: 1, name: "cellNumber", allowBlank: true, vtype: 'phone' }
			]
			},
			{ fieldLabel: "Email", name: "email", vtype: "email", vtype: 'email', maxLength:45, maxLengthText:'Email should be less than 45 characters' },
			{ fieldLabel: "Address", name: "address1", maxLength:45, maxLengthText:'Address 1 should be less than 45 characters' },
			{ fieldLabel: "Address 2", xtype: "compositefield", labelAlign: "right", items: [
				{ xtype: "textfield", flex: 1, name: "address2", allowBlank: true, maxLength: 45, maxLengthText: 'Address 2 should be less than 45 characters' },
				{ xtype: "displayfield", width: 75, cls: "composite-label", value: "City:" },
				{ xtype: "textfield", flex: 1, name: "city", maxLength:45, maxLengthText:'City Name should be less than 45 characters' }
			]
			},
			{ fieldLabel: "State", xtype: "compositefield", labelAlign: "right", items: [
				{ xtype: "ux.combo", comboType: "states", flex: 1, name: "state", store: new Ext.data.ArrayStore({ fields: ["abbr", "name"], data: Ext.ux.Combo.getStates() }) },
				{ xtype: "displayfield", width: 75, cls: "composite-label", value: "Zip:" },
				{ xtype: "textfield", flex: 1, name: "zip", vtype: 'zip' }
			]
			}
		];

		items.push(this.createFieldset("Profile", first, defaults));

		var second = [
			{ fieldLabel: "Current Password", name: "curr_password", inputType: "password", maxLength: 45, maxLengthText: 'Password should be less than 45 characters' },
			{ fieldLabel: "New Password", name: "new_password", inputType: "password", maxLength: 45, maxLengthText: 'New Password should be less than 45 characters' },
			{ fieldLabel: "Confirm Password", name: "confirm_password", inputType: "password", maxLength: 45, maxLengthText: 'Confirm Password should be less than 45 characters' }
		];

		var defaults = {
			anchor: "-20",
			allowBlank: true,
			listeners: enterListener
		};

		items.push(this.createFieldset("Password", second, defaults));

		return items;
	}
});