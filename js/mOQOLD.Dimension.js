Ext.ns("mOQOLD");

mOQOLD.Dimension = new mOQOLD.MaintenanceGridDefaultAbstract({
	title: 'Dimension',
	baseAPI: "DimensionValueAPI",
	defaultName: "dimensionName",
	defaultSort: "dimensionName",
	pageName: 'Dimension',
	getHybridConfig: function () {
		return [
			{ dataIndex: "ID", type: "int" },
			{ dataIndex: "orgID", type: "int", formField: { xtype: "hidden", defaultValue: mOQOLD.orgID} },
			{ dataIndex: "dimensionName", type: "string", header: "Dimension Name", formField: { allowBlank: false, fieldLabel: "Dimension", maxLength: 45, maxLengthText: 'Dimension should be less than 45 characters'} },
			{ dataIndex: "isActive", type: "int", header: "Active?", renderer: this.yesNoRenderer, formField: { xtype: 'checkbox', fieldLabel: 'is Active'} },
		];
	},
	yesNoRenderer: function (value, metaData, rec) {
		if (value === 0) { return "No"; }
		if (value === 1) { return "Yes"; }
	}   
});
