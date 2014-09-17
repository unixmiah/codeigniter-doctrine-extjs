Ext.ns("mOQOLD");

mOQOLD.Contact = new mOQOLD.MaintenanceGridDefaultAbstract({
	title: 'Contact',
	baseAPI: "ContactAPI",
	createForm: null,
	defaultSort: "lastName",

	getHybridConfig: function () {
		return [
			{ dataIndex: "ID", type: "int" },
			{ dataIndex: "firstName", type: "string", header: "First Name", formField: { fieldLabel: "First Name", allowBlank: false, maxLength: 45, maxLengthText: 'First Name should be less than 45 characters'} },
			{ dataIndex: "lastName", type: "string", header: "Last Name", formField: { fieldLabel: "Last Name", allowBlank: false, maxLength: 45, maxLengthText: 'Last Name should be less than 45 characters'} },
			{ dataIndex: "type", type: "string", formField: { xtype: "ux.combo", comboType: "contactType", allowBlank: false} },
			{ dataIndex: "title", type: "string", header: "Title", formField: { fieldLabel: "Title"} },
			{ dataIndex: "address1", type: "string", formField: { fieldLabel: "Address", maxLength: 45, maxLengthText: 'Address should be less than 45 characters'} },
			{ dataIndex: "address2", type: "string", formField: { fieldLabel: "Address 2", maxLengthText: 'Address 2 should be less than 45 characters'} },
			{ dataIndex: "city", type: "string", formField: { fieldLabel: "City", maxLengthText: 'City should be less than 45 characters'} },
			{ dataIndex: "state", type: "string", formField: { xtype: "ux.combo", comboType: "states", store: new Ext.data.ArrayStore({ fields: ["abbr", "name"], data: Ext.ux.Combo.getStates() })} },
			{ dataIndex: "zip", type: "string", formField: { fieldLabel: "Zip Code", vtype: 'zip'} },
			{ dataIndex: "name", type: "string", header: "Contact Type" },
			{ dataIndex: "phoneNumber", type: "string", header: "Phone", formField: { fieldLabel: "Phone", vtype: 'phone'} },
			{ dataIndex: "cellNumber", type: "string", header: "Cell Phone", formField: { fieldLabel: "Cell Phone", vtype: 'phone'} },
			{ dataIndex: "email", type: "string", formField: { fieldLabel: "Email", vtype: 'email', maxLengthText: 'email should be less than 45 characters'} },
			{ dataIndex: "startDate", type: "date", header: "Start Date", xtype: 'datecolumn', formField: { xtype: "datefield", fieldLabel: "Start Date"} },
			{ dataIndex: "inActiveDate", type: "date", header: "End Date", xtype: 'datecolumn', formField: { xtype: "datefield", fieldLabel: "End Date"} }
		];
	},

	deleteRow: function (grid, rowIndex) {
		if (!this.permissionCheck("delete")) {
			return;
		}
		var store = grid.getStore();
		var rec = store.getAt(rowIndex);

		var picker = new Ext.DatePicker({ format: "Y-m-d H:i:s" });
		picker.on("select", this.doDelete, this);

		var win = new Ext.Window({
			title: "Choose Inactive Date",
			modal: true,
			store: store,
			rec: rec,
			items: picker
		});
		win.on("beforedestroy", this.cleanupWin, this);

		this.win = win;

		this.win.show();
	},

	cleanupWin: function () {
		delete this.win;
	},

	doDelete: function (picker, date) {
		var win = this.win;
		var store = win.store;
		var rec = win.rec;

		var date = date.format("Y-m-d");

		rec.set("inActiveDate", date);
		store.reload();

		win.close();
	},

	createGrid: function () {
		var grid = mOQOLD.MaintenanceGridDefaultAbstract.prototype.createGrid.call(this);
		if (grid) {
			grid.getStore().on('write', this.onWrite, this);
		}
		return grid;
	},

	onWrite: function (store, action) {
		if (action === "create" || action === "update") {
			store.reload();
		}
	}
});