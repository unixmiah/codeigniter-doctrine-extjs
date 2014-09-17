Ext.ns("mOQOLD");

mOQOLD.SiteConfiguration = new mOQOLD.MaintenanceGridAbstract({
	title: "Site Configuration",
	formButtons: ["save", "clear"],
	baseAPI: "SiteConfigurationAPI",
	
	createGrid: null,
	
	getFormItems: function() {
		var items = [];
		var first = [
			{fieldLabel: "Client Reference", xtype: "radiogroup", items: [
				{boxLabel: "Client", name: "clientTerm", inputValue: "client", checked: true},
				{boxLabel: "Participant", name: "clientTerm", inputValue: "participant"},
				{boxLabel: "Patient", name: "clientTerm", inputValue: "patient"},
				{boxLabel: "Resident", name: "clientTerm", inputValue: "resident"}
			] },
			{fieldLabel: "Name Display", xtype: "radiogroup", items: [
				{boxLabel: "First Name Last Name (John Doe)", name: "nameDisplay", inputValue: 1, checked: true},
				{boxLabel: "Last Name, First Name (Doe, John)", name: "nameDisplay", inputValue: 2}
			] }
		];
		items.push(this.createFieldset("Participant Configurations", first));
		
		var second = [
			{fieldLabel: "Option", xtype: "radiogroup", listeners: {scope: this, change: this.onColorCodeChange}, items: [
				{boxLabel: "No Preference", name: "preferenceInd", inputValue: 0, checked: true},
				{boxLabel: "By Location", name: "preferenceInd", inputValue: 1},
				{boxLabel: "By Staff", name: "preferenceInd", inputValue: 2},
				{boxLabel: "By Dimension", name: "preferenceInd", inputValue: 3}
			] }
		];
		items.push(this.createFieldset("Color Codes", second));
		
		return items;
	},
	
	onColorCodeChange: function(group, radio) {
		var value = radio.inputValue;
		var fieldset = group.ownerCt;
		var cmp = fieldset.getComponent(1);
		if (typeof cmp !== "undefined") {
			fieldset.remove(cmp);
		}
		
		if (value === 0) {
			return ;
		}
		
		var grid = null
		
		switch(value) {
			case 1 :
				grid = "SiteConfigLocationColor";
				break;
			case 2 :
				grid = "SiteConfigStaffColor";
				break;
			case 3 :
				grid = "SiteConfigDimensionColor";
				break;
		}
		
		var panel = mOQOLD[grid].createPanel();
		
		fieldset.add(panel);
		fieldset.doLayout();
	}
});

mOQOLD.colorRenderer = function(value, metaData, rec) {
	var color = rec.get("colorCode");
	var style = "background-color:#"+color+";";
	var adlClass = "";
	var text = "";
	
	if (color === "") {
		text = "None";
		style = "";
		adlClass = "no-color-code";
	} else {
		var style = "background-color:#"+color+";";
	}
	
	var block = "<div class='color-code-block "+adlClass+"' style='"+style+"'>"+text+"</div>";
	return block;
}

mOQOLD.SiteConfigLocationColor = new mOQOLD.MaintenanceGridAbstract({
	title: "Color Code",
	baseAPI: "LocationAPI",
	gridActions: ["edit"],
	
	createForm: Ext.emptyFn,
	
	getGridConfig: function() {
		return {
			hideTitle: true,
			height: 150,
			skipAddBtn: true,
			width: 500
		};
	},
	
	editRow: function(grid, rowIndex, colIndex) {
		var colorWin = mOQOLD.ColorWindow.createWindow(grid, rowIndex, colIndex);
	},
	
	getHybridConfig: function () {
		return [
			{ dataIndex: "ID", type: 'int', hidden: true },
			{ dataIndex: "locationName", type: 'string', header: "Name" },
			{ dataIndex: "colorCode", type: "string", header: "Color Code", renderer: mOQOLD.colorRenderer }
		];
	}
});

mOQOLD.SiteConfigStaffColor = new mOQOLD.MaintenanceGridAbstract({
	title: "Color Code",
	baseAPI: "ContactAPI",
	gridActions: ["edit"],
	
	createForm: Ext.emptyFn,
	
	getGridConfig: function() {
		return {
			hideTitle: true,
			height: 150,
			skipAddBtn: true,
			width: 500
		};
	},
	
	editRow: function(grid, rowIndex, colIndex) {
		var colorWin = mOQOLD.ColorWindow.createWindow(grid, rowIndex, colIndex);
	},
	
	getHybridConfig: function () {
		return [
			{ dataIndex: "ID", type: 'int', hidden: true },
			{ dataIndex: "firstName", type: 'string', header: "Name", renderer: this.nameRenderer },
			{ dataIndex: "lastName", type: 'string' },
			{ dataIndex: "colorCode", type: "string", header: "Color Code", renderer: mOQOLD.colorRenderer }
		];
	},
	
	nameRenderer: function(value, metaData, record) {
		var firstName = value;
		var lastName = record.get("lastName");
		return firstName+" "+lastName;
	}
});

mOQOLD.SiteConfigDimensionColor = new mOQOLD.MaintenanceGridAbstract({
	title: "Color Code",
	baseAPI: "DimensionValueAPI",
	permAPI: "DimensionAPI",
	gridActions: ["edit"],
	
	createForm: Ext.emptyFn,
	
	getGridConfig: function() {
		return {
			hideTitle: true,
			height: 150,
			skipAddBtn: true,
			width: 500
		};
	},
	
	editRow: function(grid, rowIndex, colIndex) {
		var colorWin = mOQOLD.ColorWindow.createWindow(grid, rowIndex, colIndex);
	},
	
	getHybridConfig: function () {
		return [
			{ dataIndex: "ID", type: 'int', hidden: true },
			{ dataIndex: "dimensionName", type: 'string', header: "Name" },
			{ dataIndex: "colorCode", type: "string", header: "Color Code", renderer: mOQOLD.colorRenderer }
		];
	}
});