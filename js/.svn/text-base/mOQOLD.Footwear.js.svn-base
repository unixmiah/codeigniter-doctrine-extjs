Ext.ns("mOQOLD");

mOQOLD.Footwear = new mOQOLD.MaintenanceGridDefaultAbstract({
	title: 'Footwear',
	baseAPI: "FootwearAPI",
	defaultSort: "name",
	softDelete: false,
	
	getHybridConfig: function (isEditWin) {
		return [
			{ dataIndex: "ID", type: "int" },
			{ dataIndex: "orgID", type: "int" },
			{ dataIndex: "name", type: "string", header: "Name", formField: { xtype: "textfield", fieldLabel: "Name", allowBlank: false, maxLength: 45, maxLengthText: 'Footwear should be less than 45 characters'} }
		];
	}
});