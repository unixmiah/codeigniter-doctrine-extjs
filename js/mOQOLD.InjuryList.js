Ext.ns("mOQOLD");

mOQOLD.InjuryList = new mOQOLD.MaintenanceGridAbstract({
	title: "Injury",
	baseAPI: "IncidentBodypartAPI",
	permAPI: "IncidentAPI",
	gridActions: ["remove"],
	defaultSort: "bodyPart",
	disableAddBtn: true,
	incidentDetailID: null,
	
	createForm: null,
	
	getStoreConfig: function() {
		return  {
			idProperty: 'ID',
			root: 'items',
			totalProperty: 'total',
			baseParams: {
				incidentDetailID: this.incidentDetailID
			}
		};
	},
	
	getAddParams: function() {
		return {
			incidentDetailID: this.incidentDetailID
		};
	},
	
	doDelete: function(grid, rowIndex) {
		var store = grid.getStore();
		store.removeAt(rowIndex);
	},
	
	getHybridConfig: function() {
		return [
			{ dataIndex: "ID", type: "int" },
			{ dataIndex: "incidentDetailID", type: "int" },
			{ dataIndex: "bodyPart", type: "string", header: "Body Part" },
			{ dataIndex: "injureCondition", type: "string", header: "Condition" },
			{ dataIndex: "bodyPartID", type: "int", formField: { fieldLabel: "Body Part", xtype: "ux.combo", comboType: "bodypart", anchor: "-20", allowBlank: false } },
			{ dataIndex: "injureConditionID", type: "int", formField: { fieldLabel: "Condition", xtype: "ux.combo", comboType: "injureCondition", anchor: "-20", allowBlank: false } }
		];
	}
});