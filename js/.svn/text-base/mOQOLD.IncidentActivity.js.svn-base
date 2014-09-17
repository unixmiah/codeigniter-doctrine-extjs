Ext.ns("mOQOLD");

mOQOLD.IncidentActivity = new mOQOLD.MaintenanceGridDefaultAbstract({
	title: 'Incident Activity',
	baseAPI: "IncidentActivityAPI",
	softDelete: false,
	defaultSort: "name",
	
	getHybridConfig: function (isEditWin) {
		return [
			{ dataIndex: "ID", type: "int" },
			{ dataIndex: "orgID", type: "int" },
			{ dataIndex: "name", type: "string", header: "Name", formField: { xtype: "textfield", fieldLabel: "Name", allowBlank: false, maxLength: 45, maxLengthText: 'Incident Activity should be less than 45 characters'} }
		];
	}
});