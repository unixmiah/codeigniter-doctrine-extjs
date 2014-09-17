Ext.ns("mOQOLD");

mOQOLD.SpecialCondition = new mOQOLD.MaintenanceGridAbstract({
	title: "Special Condition",
	baseAPI: "ClientSpecialcondDetailAPI",
	gridActions: ["remove"],
	defaultSort: "title",
	permAPI: "ClientAPI",
	clientID: null,

	createForm: null,

	getStoreConfig: function () {
		return {
			idProperty: 'ID',
			root: 'items',
			totalProperty: 'total',
			baseParams: {
				clientID: this.clientID
			}
		};
	},

	getAddParams: function () {
		return {
			clientID: this.clientID
		};
	},

	doDelete: function (grid, rowIndex) {
		var store = grid.getStore();
		store.removeAt(rowIndex);
	},

	getHybridConfig: function () {
		return [
			{ dataIndex: "ID", type: "int" },
			{ dataIndex: "clientID", type: "int" },
			{ dataIndex: "title", type: "string", header: "Title", formField: { fieldLabel: "Title", name: "title", allowBlank: false} },
			{ dataIndex: "description", type: "string", formField: { fieldLabel: "Condition", name: "description", allowBlank: false} },
			{ dataIndex: "recDate", type: "date", header: "Date", xtype: 'datecolumn', formField: { xtype: "datefield", fieldLabel: "Date", name: "recDate", allowBlank: false} }
		];
	}
});