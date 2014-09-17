Ext.ns("mOQOLD");

mOQOLD.QolScore = new mOQOLD.MaintenanceGridDefaultAbstract({
	title: 'QolScore',
	baseAPI: "QolScoreValueAPI",
	defaultName: "score",
	defaultSort: "score",

	getHybridConfig: function () {
		return [
			{ dataIndex: "ID", type: "int" },
			{ dataIndex: "orgID", type: "int" },
			{ dataIndex: "score", type: "int", header: "Score", formField: { fieldLabel: "Score", maxLength: 11, allowBlank: false, maxLengthText: 'Score value should be numbers'} },
			{ dataIndex: "scoreDesc", type: "string", header: "Score Description", formField: { fieldLabel: "Score Description", maxLength: 45, maxLengthText: 'Score Description should be less than 45 characters'} },
			{ dataIndex: "isActive", type: "int",header: "Active?", renderer: this.yesNoRenderer, formField:{ xtype:'checkbox', fieldLabel:'is Active'}}
		];
	},
	yesNoRenderer: function (value, metaData, rec) {
		if (value === 0) { return "No"; }
		if (value === 1) { return "Yes"; }
	}   
});