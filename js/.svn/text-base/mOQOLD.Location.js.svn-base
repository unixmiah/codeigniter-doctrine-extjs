Ext.ns("mOQOLD");

mOQOLD.Location = new mOQOLD.MaintenanceGridDefaultAbstract({
	title: 'Location',
	baseAPI: "LocationAPI",
	defaultName: "locationName",
	defaultSort: "locationName",

	getHybridConfig: function () {
		return [
			{ dataIndex: "ID", type: "int" },
			{ dataIndex: "orgID", type: "int" },
			{ dataIndex: "isActive", type: "int", formField: { xtype: "hidden", defaultValue: 1} },
			{ dataIndex: "locationName", type: "string", header: "Name", formField: { fieldLabel: "Name", allowBlank: false, maxLength: 45, maxLengthText: 'Location Name should be less than 45 characters'} },
			{ dataIndex: "abbrName", type: "string", header: "Abbr", formField: { fieldLabel: "Abbr", maxLength: 4, maxLengthText: 'Abbr should be less than 4 characters'} }
		];
	}
});