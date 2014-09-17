Ext.ns("mOQOLD");

mOQOLD.AllergyLists = new mOQOLD.MaintenanceGridAbstract({
	title: "Allergy",
	baseAPI: "AllergyDetailAPI",
	permAPI: "ClientAPI",
	gridActions: ["remove"],
	defaultSort: "allergyName",
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
			{ dataIndex: "clientID", type: "clientID" },
			{ dataIndex: "allergyName", type: "string", header: "Name", formField: { xtype: "ux.combo", comboType: "systemRef", anchor: "-20", name: "allergyName", displayField: "name", valueField: "name", hiddenName: "allergyName", fieldLabel: "Allergy", params: { type: "allergy" }, allowBlank: false} }
		];
	}
});