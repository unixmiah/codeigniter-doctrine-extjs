Ext.ns("mOQOLD");

mOQOLD.Injury = new mOQOLD.MaintenanceGridDefaultAbstract({
	title: 'Injury',
	baseAPI: "InjuryAPI",
	defaultType: "injurecondition",
	softDelete: false,
	defaultSort: "name",
	
	getHybridConfig: function (isEditWin) {
		return [
			{ dataIndex: "ID", type: "int" },
			{ dataIndex: "orgID", type: "int" },
			{ dataIndex: "name", type: "string", header: "Name", formField: { xtype: "textfield", fieldLabel: "Name", maxLength: 45, maxLengthText: 'Injury should be less than 45 characters'} },
			{ dataIndex: "description", type: "string", header: "Description", formField: { xtype: "textfield", fieldLabel: "Description", maxLength: 45, maxLengthText: 'Description should be less than 45 characters'} }
		];
	}
});