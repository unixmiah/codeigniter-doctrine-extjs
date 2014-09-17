Ext.ns("mOQOLD");

mOQOLD.Noise = new mOQOLD.MaintenanceGridDefaultAbstract({
	title: 'Noise',
	baseAPI: "NoiseAPI",
	defaultName: "noiseName",
	defaultSort: "noiseName",
	
	getHybridConfig: function () {
		return [
			{ dataIndex: "ID", type: "int" },
			{ dataIndex: "orgID", type: "int" },
			{ dataIndex: "isActive", type: "int", formField: { xtype: "hidden", defaultValue: 1 } },
			{ dataIndex: "noiseName", type: "string", header: "Name", formField: { fieldLabel: "Name", allowBlank: false, maxLength: 45, maxLengthText: 'Noise should be less than 45 characters'} },
			{ dataIndex: "description", type: "string", header: "Description", formField: { fieldLabel: "Description", maxLength: 45, maxLengthText: 'Description should be less than 45 characters'} }
		];
	}
});