Ext.ns("mOQOLD");

mOQOLD.Activity = new mOQOLD.MaintenanceGridDefaultAbstract({
	title: 'Activity',
	baseAPI: "ActivityAPI",
	defaultName: "activityName",
	defaultSort: "activityName",
	
	fixRec: function(rec) {
		console.log(rec.get("dimensionID"));
		if (rec.get("dimensionID") === 0) {
			console.log("Fix");
			rec.set("dimensionID", "");
		}
		return rec;
	},
	
	getHybridConfig: function (isEditWin) {
		var dimensionConfig = {
			xtype: "ux.combo",
			allowBlank: false,
			flex: 1,
			comboType: "dimension",
			name: "dimensionID"
		};
		
		return [
			{ dataIndex: "ID", type: "int" },
			{ dataIndex: "orgID", type: "int" },
			{ dataIndex: "isActive", type: "int", formField: { xtype: "hidden", defaultValue: 1 } },
			{ dataIndex: "activityName", type: "string", header: "Name", formField: { fieldLabel: "Name", allowBlank: false, maxLength:45, maxLengthText:'Activity Name should be less than 45 characters' } },
			{ dataIndex: "abbrName", type: "string", header: "Abbr", formField: { fieldLabel: "Abbr", maxLength: 4, maxLengthText: 'Abbr should be less than 4 characters'} },
			{ dataIndex: "dimensionID", type: "int", formField: dimensionConfig },
			{ dataIndex: "dimensionName", type: "string", header: "Primary Dimension" },
			{ dataIndex: "description", type: "string", formField: { xtype: "textfield", fieldLabel: "Description", maxLength: 125, maxLengthText: 'Abbr should be less than 125 characters'} }
		];
	}
});