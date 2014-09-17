Ext.ns("mOQOLD");

mOQOLD.Animal = new mOQOLD.MaintenanceGridDefaultAbstract({
	title: 'Animal',
	baseAPI: "AnimalAPI",
	defaultName: "animalName",
	defaultSort: "animalName",
	
	getHybridConfig: function () {
		return [
			{ dataIndex: "ID", type: "int" },
			{ dataIndex: "orgID", type: "int" },
			{ dataIndex: "isActive", type: "int", formField: { xtype: "hidden", defaultValue: 1 } },
			{ dataIndex: "animalName", type: "string", header: "Name", formField: { fieldLabel: "Name", allowBlank: false, maxLength: 45, maxLengthText: 'Animal Name should be less than 45 characters'} },
			{ dataIndex: "description", type: "string", header: "Name", formField: { fieldLabel: "Description", maxLength: 45, maxLengthText: 'Description should be less than 45 characters'} }
		];
	}
});