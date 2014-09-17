Ext.ns("mOQOLD");

mOQOLD.BodyPart = new mOQOLD.MaintenanceGridDefaultAbstract({
	title: 'Body Part',
	baseAPI: "BodyPartAPI",
	softDelete: false,
	defaultSort: "name",
	
	getHybridConfig: function () {
		return [
			{ dataIndex: "ID", type: "int" },
			{ dataIndex: "orgID", type: "int" },
			{ dataIndex: "name", type: "string", header: "Name", formField: { xtype: "textfield", fieldLabel: "Name", allowBlank: false, maxLength: 45, maxLengthText: 'Bodyy Part should be less than 45 characters' } },
			{ dataIndex: "description", type: "string", header: "Description", formField: { xtype: "textfield", fieldLabel: "Description", maxLength: 45, maxLengthText: 'Description should be less than 45 characters'} }
		];
	}
});