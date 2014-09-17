Ext.ns("mOQOLD");

mOQOLD.Aids = new mOQOLD.MaintenanceGridAbstract({
	title: "Aid",
	baseAPI: "AidDetailAPI",
	permAPI: "ClientAPI",
	gridActions: ["remove"],
	defaultSort: "name",
	disableAddBtn: true,
	incidentID: null,
	clientID: null,

	createForm: null,

	setIncidentId: function (id) {
		this.incidentID = id;
		this.clientID = null;
	},

	setClientId: function (id) {
		this.clientID = id;
		this.incidentID = null;
	},

	getStoreConfig: function () {
		return {
			idProperty: 'ID',
			root: 'items',
			totalProperty: 'total',
			baseParams: {
				incidentID: this.incidentID,
				clientID: this.clientID
			}
		};
	},

	getAddParams: function () {
		return {
			incidentID: this.incidentID,
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
			{ dataIndex: "incidentID", type: "incidentID" },
			{ dataIndex: "name", type: "string", header: "Name", formField: { xtype: "ux.combo", comboType: "systemRef", anchor: "-20", name: "name", displayField: "name", valueField: "name", hiddenName: "name", fieldLabel: "Aid", params: { type: "aid" }, allowBlank: false} }
		];
	}
});