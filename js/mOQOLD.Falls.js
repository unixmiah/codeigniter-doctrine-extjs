Ext.ns("mOQOLD");

mOQOLD.Falls = new mOQOLD.MaintenanceGridAbstract({
	title: "Fall",
	baseAPI: "IncidentAPI",
	gridActions: ["view"],
	defaultSort: { field: 'incidentTime', direction: "DESC" },
	useDetailLayout: true,
	moduleName: 'Falls',

	getHybridConfig: function () {
		return [
			{ dataIndex: "ID", type: "int" },
			{ dataIndex: "incidentTime", type: "date", header: "Incident Date", renderer: this.dateRenderer, dateFormat: 'Y-m-d H:i:s', width: 140 },
			{ dataIndex: "clientID", type: "int", header: "Client Name", renderer: this.clientRenderer },
			{ dataIndex: "isinER", type: "int", header: "In ER", renderer: this.yesNoRenderer },
			{ dataIndex: "isHospitalized", type: "int", header: "In Hospital", renderer: this.yesNoRenderer },
			{ dataIndex: "incidentCauseName", type: "string", header: "Cause" },
			{ dataIndex: "witnessInd", type: "int", header: "Has Witness", renderer: this.yesNoRenderer },
			{ dataIndex: "notifyPartyName", type: "string", header: "Notify Party" },
			{ dataIndex: "witnessUserID", type: "int", /*header: "Witness",*/renderer: this.witnessRenderer },
			{ dataIndex: "clientFirstName", type: "string" },
			{ dataIndex: "clientLastName", type: "string" },
			{ dataIndex: "locationID", type: "int" },
			{ dataIndex: "locationName", type: "string"/*, header: "Location"*/ },
			{ dataIndex: "witnessFirstName", type: "string" },
			{ dataIndex: "witnessLastName", type: "string" },
			{ dataIndex: "incidentActivityID", type: "int" },
			{ dataIndex: "IncidentActivityName", type: "string"/*, header: "Activity"*/ },
			{ dataIndex: "incidentCauseID", type: "int" },
			{ dataIndex: "footwearID", type: "int" },
			{ dataIndex: "footwearName", string: "string"/*, header: "Footwear"*/ },
			{ dataIndex: "notifyPartyID", type: "int" },
			{ dataIndex: "note", type: "string" }
		];
	},

	clientRenderer: function (value, metaData, rec) {
		return rec.get("clientFirstName") + " " + rec.get("clientLastName");
	},

	witnessRenderer: function (value, metaData, rec) {
		return rec.get("witnessFirstName") + " " + rec.get("witnessLastName");
	},

	dateRenderer: function (value) {
		if (Ext.isDate(value)) {
			return value.format("m/d/Y H:i:s");
		} else {
			return value;
		}
	},

	yesNoRenderer: function (value) {
		var text = "Yes";
		if (value !== 1) {
			text = "No";
		}
		return text;
	},

	getFallInfoItems: function () {
		var leftCol = [
			{ xtype: "ux.combo", comboType: "client", allowBlank: false },
			{ xtype: "ux.combo", comboType: "incidentActivity", allowBlank: false },
			{ xtype: "ux.combo", comboType: "location", name: "locationID", hiddenName: "locationID", fieldLabel: "Location", allowBlank: false },
			{ xtype: "radiogroup", fieldLabel: "Has Witness", width: 300, name: "witnessInd", items: [
				{ boxLabel: "Yes", name: "witnessInd", inputValue: 1 },
				{ boxLabel: "No", name: "witnessInd", inputValue: 2, checked: true }
			]
			},
			{ xtype: "radiogroup", fieldLabel: "In ER", width: 300, name: "isinER", items: [
				{ boxLabel: "Yes", name: "isinER", inputValue: 1 },
				{ boxLabel: "No", name: "isinER", inputValue: 2, checked: true }
			]
			},
			{ xtype: "radiogroup", fieldLabel: "Is Hospitalized", width: 300, name: "isHospitalized", items: [
				{ boxLabel: "Yes", name: "isHospitalized", inputValue: 1 },
				{ boxLabel: "No", name: "isHospitalized", inputValue: 2, checked: true }
			]
			}
		];

		var date = {
			xtype: "compositefield",
			fieldLabel: "Incident Date",
			defaults: { xtype: "textfield", allowBlank: false, flex: 1 },
			items: [
				{ xtype: "datefield", name: "incidentSplitDate", allowBlank: false },
				{ xtype: "timefield", name: "incidentSplitTime", increment: 15, allowBlank: false }
			]
		};

		var rightCol = [
			date,
			{ xtype: "ux.combo", comboType: "cause" },
			{ xtype: "ux.combo", comboType: "footwear" },
			{ xtype: "ux.combo", comboType: "staff", name: "witnessUserID", hiddenName: "witnessUserID", fieldLabel: "Witness" },
			{ xtype: "ux.combo", comboType: "systemRef", name: "notifyPartyID", hiddenName: "notifyPartyID", fieldLabel: "Notify", params: { type: "nofityparty"} },
			{ xtype: "textarea", name: "note", fieldLabel: "Note", grow: true, growMax: 80, growMin: 20, height: 20 , maxLength: 255, maxLengthText: 'Notes should be less than 255 charactes' }
		];

		return {
			title: "Fall/Incident Information",
			layout: "column",
			defaults: { layout: "form", columnWidth: .5, defaults: { readOnly: true, anchor: "-20"} },
			items: [{ items: leftCol }, { items: rightCol}]
		};
	},

	getMedicalItems: function () {
		var aidList = mOQOLD.Aids;
		aidList.setIncidentId(this.id);
		aidList = aidList.createPanel();

		var injuryList = mOQOLD.InjuryList;
		injuryList.incidentDetailID = this.id;
		injuryList = injuryList.createPanel();

		return {
			title: 'Medical',
			itemId: 'Medical',
			layout: 'column',
			tbar: this.createInfoToolbar(),
			defaults: {
				columnWidth: 0.5
			},
			items: [injuryList, aidList]
		};
	},

	getPostInfoItems: function () {
		var leftCol = [
			{ xtype: "radiogroup", fieldLabel: "Tempurature Change", width: 300, name: "temperatureInd", items: [
				{ boxLabel: "Yes", name: "temperatureInd", inputValue: 1 },
				{ boxLabel: "No", name: "temperatureInd", inputValue: 2, checked: true }
			]
			},
			{ xtype: "radiogroup", fieldLabel: "Blood Glucose Change", width: 300, name: "bloodGlucoseChgInd", items: [
				{ boxLabel: "Yes", name: "bloodGlucoseChgInd", inputValue: 1 },
				{ boxLabel: "No", name: "bloodGlucoseChgInd", inputValue: 2, checked: true }
			]
			},
			{ xtype: "radiogroup", fieldLabel: "Blood Pressure Change", width: 300, name: "bloodPressureChgInd", items: [
				{ boxLabel: "Yes", name: "bloodPressureChgInd", inputValue: 1 },
				{ boxLabel: "No", name: "bloodPressureChgInd", inputValue: 2, checked: true }
			]
			},
			{ xtype: "radiogroup", fieldLabel: "Mental Status Change", width: 300, name: "mentalChgInd", items: [
				{ boxLabel: "Yes", name: "mentalChgInd", inputValue: 1 },
				{ boxLabel: "No", name: "mentalChgInd", inputValue: 2, checked: true }
			]
			},
			{ xtype: "radiogroup", fieldLabel: "Conciousness Change", width: 300, name: "consciousnessChgInd", items: [
				{ boxLabel: "Yes", name: "consciousnessChgInd", inputValue: 1 },
				{ boxLabel: "No", name: "consciousnessChgInd", inputValue: 2, checked: true }
			]
			}
		];

		var rightCol = [
			{ xtype: "textfield", fieldLabel: "Tempurature", name: "temperature", anchor: "-20" },
			{ xtype: "textfield", fieldLabel: "Glucose", name: "bloodClucose", anchor: "-20" },
			{ xtype: "textfield", fieldLabel: "Blood Pressure High", name: "bloodPressureHigh", anchor: "-20" },
			{ xtype: "textfield", fieldLabel: "Blood Pressure Low", name: "bloodPressureLow", anchor: "-20" }
		];

		return {
			itemId: 'PostInfo',
			title: "Post Fall/Incident Information",
			layout: "column",
			tbar: this.createInfoToolbar(),
			defaults: { layout: "form", columnWidth: .5 },
			items: [{ items: leftCol }, { items: rightCol}]
		};
	},

	createInfoToolbar: function () {
		return [
			'<b>Client</b>: ',
			{ xtype: 'tbtext', itemId: 'clientName' },
			'-',
			'<b>Incident Date</b>: ',
			{ xtype: 'tbtext', itemId: 'incidentDate' },
			'-',
			'<b>Cause</b>: ',
			{ xtype: 'tbtext', itemId: 'cause' }
		];
	},

	onTabChange: function (tabPanel, panel) {
		var tbar = panel.getTopToolbar();
		if (tbar) {
			var form = this.form.getForm();
			tbar.getComponent('clientName').setText(form.findField('clientID').getRawValue());
			tbar.getComponent('incidentDate').setText(form.findField('incidentSplitDate').getRawValue() + ' ' + form.findField('incidentSplitTime').getRawValue());
			tbar.getComponent('cause').setText(form.findField('incidentCauseID').getRawValue());
		}
	},

	getFormItems: function () {
		return {
			xtype: "tabpanel",
			activeItem: 0,
			layoutOnTabChage: true,
			deferredRender: false,
			defaults: {
				frame: true,
				autoHeight: true
			},
			listeners: {
				tabchange: this.onTabChange,
				scope: this
			},
			items: [
				this.getFallInfoItems(),
				this.getMedicalItems(),
				this.getPostInfoItems()
			]
		};
	}
});