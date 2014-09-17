Ext.ns("mOQOLD");

mOQOLD.User = new mOQOLD.MaintenanceGridAbstract({
	title: "User",
	baseAPI: "UserAPI",
	defaultSort: "login",

	formButtons: function () {
		if (this.id === 0) {
			return ["saveSendUser", "cancel"];
		} else {
			return ["saveSendUser", "save", "cancel"];
		}
	},

	getStoreConfig: function () {
		return {
			idProperty: "ID",
			root: "items",
			totalProperty: "total",
			writer: new Ext.data.JsonWriter({
				encode: false
			})
		};
	},

	getHybridConfig: function () {
		return [
			{ dataIndex: "ID", type: "int" },
			{ dataIndex: "login", type: "string", header: "Login", formField: { fieldLabel: "Login", allowBlank: false, minLength: 4, maxLength: 45, minLengthText: 'Login ID cannot be less than 4 characters', maxLengthText : 'Login ID cannot be more the 45 character'} },
			{ dataIndex: "password", type: "string", formField: { fieldLabel: "Temp. Password", allowBlank: true, minLength: 4, maxLength: 45, minLengthText: 'Password cannot be less than 4 characters' , maxLengthText : 'Password cannot be more the 45 character'} },
			{ dataIndex: "userRoleID", type: "int", formField: { xtype: "ux.combo", comboType: "role", allowBlank: false} },
			{ dataIndex: "devicePin", type: "string", formField: { fieldLabel: "Device PIN", minLength: 5, maxLength: 5, maxLengthText: "Device Pin should be 5 digits", minLengthText: "Device Pin should be 5 digits"} },
			{ dataIndex: "firstName", type: "string", header: "First Name", formField: { fieldLabel: "First Name", allowBlank: false, maxLength: 45, maxLengthText: 'First Name cannot be more the 45 character'} },
			{ dataIndex: "lastName", type: "string", header: "Last Name", formField: { fieldLabel: "Last Name", allowBlank: false, maxLength: 45, maxLengthText: 'Last Name cannot be more the 45 character'} },
			{ dataIndex: "email", type: "string", header: "Email", formField: { fieldLabel: "Email", vtype: "email", allowBlank: false,maxLength: 45, maxLengthText: 'Email cannot be more the 45 character'} },
			{ dataIndex: "type", type: "int", formField: { xtype: "hidden", name: "type", value: "1"} }
		];
	},

	createForm: null
});