Ext.ns("mOQOLD");

mOQOLD.ObservationLists = new mOQOLD.MaintenanceGridAbstract({
	title: 'Observations',
	baseAPI: "ObservationAPI",
	gridActions: ["edit"],
	defaultSort: "clientID",
	useDetailLayout: true,
	getGridConfig: function () {
		return {
			listeners: {
				scope: this,
				afterrender: function (grid) {
					mOQOLD.ObservationStore = grid.getStore();
					mOQOLD.ObservationStore.setBaseParam('actDetailID', this.actDetailID);
					mOQOLD.ObservationStore.load();
				}
			}
		};
	},
	getAddParams: function () {
		return {
			'actDetailID': this.actDetailID
		};
	},
	getStoreConfig: function () {
		return {
			idProperty: 'ID',
			root: 'items',
			totalProperty: 'total',
			autoLoad: false
		};
	},

	getHybridConfig: function () {
		this.imageViewer = new mOQOLD.ImageViewer({ height: 100,apiFunction: { read: Ext.app["PhotoAPI"].getImagesForObservation }, observationID: (this.rec) ? this.rec.id : 0 });
		return [
			{ dataIndex: "ID", type: 'int' },
			{ dataIndex: "clientID", type: "int", header: "Client", renderer: this.clientRenderer, formField: { xtype: "ux.combo", comboType: "client", name: "clientID", fieldLabel: "Client", allowBlank: false} },
			{ dataIndex: "clientFirstName", type: "string" },
			{ dataIndex: "clientLastName", type: "string" },
			{ dataIndex: "actDetailID", type: "int" },
			{ dataIndex: "scrBest", type: "int", header: "Best Score", formField: { xtype: "ux.combo", comboType: "qol", name: "scrBest", fieldLabel: "Best Score", allowBlank: false} },
			{ dataIndex: "scrWorst", type: "int", header: "Worst Score", formField: { xtype: "ux.combo", comboType: "qol", name: "scrWorst", fieldLabel: "Worst Score", allowBlank: false} },
			{ dataIndex: "scrMost", type: "int", header: "Most Score", formField: { xtype: "ux.combo", comboType: "qol", name: "scrMost", fieldLabel: "Most Score", allowBlank: false} },
			{ dataIndex: "pDimensionID", type: "int", formField: { xtype: "ux.combo", comboType: "dimension", name: "pDimensionID", fieldLabel: "Primary Wellness", allowBlank: false} },
			{ dataIndex: "sDimensionID", type: "int", formField: { xtype: "ux.combo", comboType: "dimension", name: "sDimensionID", fieldLabel: "Secondary Wellness"} },
			{ dataIndex: "pDimensionName", type: "string", header: "Primary Dimension" },
			{ dataIndex: "sDimensionName", type: "string", header: "Secondary Dimension" },
			{ dataIndex: "participationLevel", type: "string", renderer: this.partcipantRenderer, header: "Participation Level", formField: { xtype: "ux.combo", displayField: "description", comboType: "systemRef", name: "participationLevel", hiddenName: "participationLevel", fieldLabel: "Participant Level", valueField: "name", params: { type: "participatelevel"}} },
			{ dataIndex: "clientNotes", type: "string", formField: { xtype: "textarea", name: "clientNotes", fieldLabel: "Client Notes"} },
			{ dataIndex: "notes", type: "string", formField: { xtype: "textarea", name: "notes", fieldLabel: "Staff Notes"} },
			{formField: this.imageViewer}
		];
	},

	clientRenderer: function (value, metaData, rec) {
		return rec.get("clientFirstName") + " " + rec.get("clientLastName");
	},

	partcipantRenderer: function (value, metaData, rec) {
		if (value === "0") { return "Not Participate"; }
		if (value === "1") { return "Some Participate"; }
		if (value === "2") { return "Full Participate"; }
	}

});