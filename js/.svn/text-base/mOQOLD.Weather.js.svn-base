Ext.ns("mOQOLD");

mOQOLD.Weather = new mOQOLD.MaintenanceGridDefaultAbstract({
	title: 'Weather',
	baseAPI: "WeatherAPI",
	defaultName: "weatherName",
	defaultSort: "weatherName",
	
	getHybridConfig: function () {
		return [
			{ dataIndex: "ID", type: "int" },
			{ dataIndex: "orgID", type: "int" },
			{ dataIndex: "isActive", type: "int", formField: { xtype: "hidden", defaultValue: 1 } },
			{ dataIndex: "weatherName", type: "string", header: "Name", formField: { fieldLabel: "Name", allowBlank: false, maxLength:45, maxLengthText:'Name should be less than 45 characters' } },
			{ dataIndex: "description", type: "string", header: "Descrition", formField: { xtype: "textfield", fieldLabel: "Description", maxLength: 45, maxLengthText: 'Description should be less than 45 characters'} }
		];
	}
});