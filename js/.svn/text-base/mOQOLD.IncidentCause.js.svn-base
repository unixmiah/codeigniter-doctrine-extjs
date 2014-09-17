Ext.ns("mOQOLD");

mOQOLD.IncidentCause = new mOQOLD.MaintenanceGridDefaultAbstract({
	title: 'Incident Cause',
	baseAPI: "IncidentCauseAPI",
	softDelete: false,
	defaultSort: "name",
	
	getHybridConfig: function (isEditWin) {
		return [
			{ dataIndex: "ID", type: "int" },
			{ dataIndex: "orgID", type: "int" },
			{ dataIndex: "name", type: "string", header: "Name", formField: { xtype: "textfield", fieldLabel: "Name", allowBlank: false,maxLength: 45, maxLengthText: 'Cause should be less than 45 characters' } },
			{ dataIndex: "description", type: "string", header: "Description", formField: { xtype: "textfield", fieldLabel: "Description", maxLength: 45, maxLengthText: 'Description should be less than 45 characters'} }
		];
	}
});