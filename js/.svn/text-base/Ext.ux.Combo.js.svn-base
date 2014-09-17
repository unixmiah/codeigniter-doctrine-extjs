Ext.ns("Ext.ux");

Ext.ux.Combo = Ext.extend(Ext.form.ComboBox, {
	displayField: "name",
	valueField: "id",
	mode: "local",
	typeAhead: true,
	triggerAction: "all",
	lazyRender: true,
	forceSelection: true,

	constructor: function (config) {
		var comboType = config.comboType;
		if (typeof comboType === "string" && Ext.ux.Combo.types[comboType]) {
			Ext.applyIf(config, Ext.ux.Combo.types[comboType]);
		}

		if (typeof config.emptyText === "undefined" && typeof config.fieldLabel === "string") {
			if (typeof config.fieldLabel === "undefined") {
				throw "fieldLabel must be assigned. Use hideLabel to hide fieldLabel";
			}
			config.emptyText = "Select a " + config.fieldLabel;
		}

		if (typeof config.api === "undefined") {
			config.api = config.fieldLabel + "API";
		}

		if (typeof config.hiddenName === "undefined") {
			config.hiddenName = config.name;
		}

		if (typeof config.store === "string") {
			var store = Ext.StoreMgr.get(config.store);

			var loadOptions = { params: {}, callback: this.setComboItemFocus, scope: this };
			if (store && store.lastOptions) {
				Ext.apply(loadOptions.params, store.lastOptions.params);
			}
			if (typeof config.params !== "undefined") {
				Ext.apply(loadOptions, config.params);
			}
			if (typeof store === "object") {
				store.load(loadOptions);
			} else {
				var storeConfig = {
					storeId: config.store,
					autoLoad: (config.mode === "remote") ? false : loadOptions,
					baseParams: config.params || null,
					api: {
						read: Ext.app[config.api].listAll
					},
					writer: config.writer || null
				};
				var insert = config.insert || null;
				config.store = mOQOLD.Stores.createStore(storeConfig, insert);
			}
		}

		Ext.ux.Combo.superclass.constructor.call(this, config);
	},

	setComboItemFocus: function () {
		var c = this.getValue();
		if (c !== "") {
			this.setValue(c);
		} else {
			this.setValue(null);
		}
	}
});
Ext.reg("ux.combo", Ext.ux.Combo);

Ext.ux.Combo.types = {
	contactType: { store: "ContactTypeList", fieldLabel: "Contact Type", api: "ContactTypeAPI", displayField: "name", valueField: "ID", lazyRender: true, mode: "local", queryParam: "queryParam" },
	activity: { store: "ActivityList", fieldLabel: "Activity", api: "ActivityAPI", name: "activityID", displayField: "activityName", valueField: "ID", hiddenName: "activityID", lazyRender: true, mode: "local", queryParam: "queryParam" },
	incidentActivity: { store: "IncidentActivityList", fieldLabel: "Activity", api: "IncidentActivityAPI", name: "incidentActivityID", displayField: "name", valueField: "ID", hiddenName: "incidentActivityID", lazyRender: true, mode: "local", queryParam: "queryParam" },
	cause: { store: "CauseList", fieldLabel: "Cause", api: "IncidentCauseAPI", name: "incidentCauseID", displayField: "name", valueField: "ID", hiddenName: "incidentCauseID", lazyRender: true, mode: "local", queryParam: "queryParam" },
	role: { store: "RoleList", fieldLabel: "Role", api: "UserRoleAPI", name: "userRoleID", displayField: "roleName", valueField: "ID", hiddenName: "userRoleID", lazyRender: true, mode: "local", queryParam: "queryParam" },
	duration: { store: "Duration", displayField: "text", fieldLabel: "Duration", name: "duration" },
	staff: { store: "StaffList", fieldLabel: "Staff", api: "ContactAPI", name: "staffID", displayField: "fullName", valueField: "ID", hiddenName: "staffID", lazyRender: true, mode: "local", queryParam: "queryParam" },
	client: { store: "ClientList", fieldLabel: "Client", api: "ClientAPI", name: "clientID", displayField: "fullName", valueField: "ID", hiddenName: "clientID", lazyRender: true, mode: "local", queryParam: "queryParam" },
	user: { store: "UserList", fieldLabel: "User", api: "UserAPI", name: "clientID", displayField: "fullName", valueField: "ID", hiddenName: "clientID", lazyRender: true, mode: "local", queryParam: "queryParam" },
	location: { store: "LocationList", fieldLabel: "Location", api: "LocationAPI", name: "locationTypeID", displayField: "locationName", valueField: "ID", hiddenName: "locationTypeID", lazyRender: true, mode: "local", queryParam: "queryParam" },
	noise: { store: "NoiseList", fieldLabel: "Noise", api: "NoiseAPI", name: "noiseTypeID", displayField: "noiseName", valueField: "ID", hiddenName: "noiseTypeID", lazyRender: true, mode: "local", queryParam: "queryParam" },
	animal: { store: "AnimalList", fieldLabel: "Animal", api: "AnimalAPI", name: "animalTypeID", displayField: "animalName", valueField: "ID", hiddenName: "animalTypeID", lazyRender: true, mode: "local", queryParam: "queryParam" },
	footwear: { store: "FootwearList", fieldLabel: "Footwear", api: "FootwearAPI", name: "footwearID", displayField: "name", valueField: "ID", hiddenName: "footwearID", lazyRender: true, mode: "local", queryParam: "queryParam" },
	weather: { store: "WeatherList", fieldLabel: "Weather", api: "WeatherAPI", name: "weatherTypeID", displayField: "weatherName", valueField: "ID", hiddenName: "weatherTypeID", lazyRender: true, mode: "local", queryParam: "queryParam" },
	dimension: { store: "DimensionList", fieldLabel: "Dimension", api: "DimensionValueAPI", displayField: "dimensionName", valueField: "ID", lazyRender: true, mode: "local", queryParam: "queryParam" },
	aid: { store: "AidList", fieldLabel: "Aid", api: "AidAPI", displayField: "name", valueField: "ID", lazyRender: true, mode: "local", queryParam: "queryParam" },
	bodypart: { store: "BodyPartList", fieldLabel: "Body Part", api: "BodyPartAPI", displayField: "name", valueField: "ID", lazyRender: true, mode: "local", queryParam: "queryParam" },
	qol: { store: "QOLList", fieldLabel: "QOL Score", api: "QolScoreValueAPI", displayField: "score", valueField: "score", lazyRender: true, mode: "local", queryParam: "queryParam" },
	incidentCause: { store: "IncidentCauseList", fieldLabel: "Cause", api: "IncidentCauseAPI", displayField: "name", valueField: "ID", lazyRender: true, mode: "local", queryParam: "queryParam" },
	systemRef: { store: "SystemRefList", api: "SystemRefAPI", displayField: "name", valueField: "ID", lazyRender: true, mode: "local", queryParam: "queryParam", params: { type: ""} },
	injureCondition: { store: "InjureCondition", api: "InjureConditionValueAPI", displayField: "name", valueField: "ID", name: "injureConditionID", hiddenName: "injureConditionID", fieldLabel: "Condition", lazyRender: true, mode: "local", queryParam: "queryParam" },
	
	//hard-coded
	scoreType: { store: new Ext.data.ArrayStore({ storeId: "ScoreType", sortInfo: { field: "text", direction : "ASC" }, fields: [ { name: "value", type: "string" }, { name : "text", type : "string" } ], data: [ ["scrBest", "Best Score"], ["scrWorst", "Worst Score"], ["scrMost", "Most Score"] ] }), displayField: "text", valueField: "value", lazyRender: true, mode: "local", fieldLabel: "Score Type", name: "scoreType" },
	gender: { fieldLabel: "Gender", store: new Ext.data.ArrayStore({ fields: ["ID", "name"], data : [ [1, "Male"], [2, "Female"] ] }), valueField: "ID", name: "gender", lazyRender: true, mode: "local" },
	days: { store: new Ext.data.ArrayStore({ fields: ["num"], data : [ [7], [14], [21], [30] ] }), valueField: "num", displayField: "num", lazyRender: true, mode: "local" },
	yesORno: { store: new Ext.data.ArrayStore({ fields: ["ID", "name"], data : [ [1, "Yes"], [0, "No"] ] }), valueField: "ID", lazyRender: true, mode: "local" },
	numbers: { valueField: "num", displayField: "num", lazyRender: true, mode: "local" },
	states: { fieldLabel: "State", name: "state", valueField: "abbr", displayField: "name", lazyRender: true, mode: "local" },
	cmpstates: { fieldLabel: "State", name: "companystate", valueField: "abbr", displayField: "name", lazyRender: true, mode: "local" },
	amORpm: { store: new Ext.data.ArrayStore({ fields: ["hours", "name"], data : [ [0, "am"], [12, "pm"] ] }), displayField: "name", valueField: "hours", lazyRender: true, mode: "local" }
}

Ext.ux.Combo.getNumbers = function(start, max, inc) {
	var arr = [];
	if (typeof inc === "undefined") {
		inc = 1;
	}
	
	for (var i = start; i < max; i+=inc) {
		arr.push([i]);
	}
	
	return arr;
}
Ext.ux.Combo.getStates = function() {
	return [
		["AL", "Alabama"],
		["AK", "Alaska"],
		["AS", "American Samoa"],
		["AZ", "Arizona"],
		["AR", "Arkansas"],
		["CA", "California"],
		["CO", "Colorado"],
		["CT", "Connecticut"],
		["DE", "Deleware"],
		["DC", "District of Columbia"],
		["FM", "Federated States of Micronesia"],
		["FL", "Florida"],
		["GA", "Georgia"],
		["GU" , "Guam"],
		["HI", "Hawaii"],
		["ID", "Idaho"],
		["IL", "Illinois"],
		["IN", "Indiana"],
		["IA", "Iowa"],
		["KS", "Kansas"],
		["KY", "Kentucky"],
		["LA", "Louisiana"],
		["ME", "Maine"],
		["MH", "Marshall Islands"],
		["MD", "Maryland"],
		["MA", "Massachusetts"],
		["MI", "Michigan"],
		["MN", "Minnesota"],
		["MS", "Mississippi"],
		["MO", "Missouri"],
		["MT", "Montana"],
		["NE", "Nebraska"],
		["NV", "Nevada"],
		["NH", "New Hampshire"],
		["NJ", "New Jersey"],
		["NM", "New Mexico"],
		["NY", "New York"],
		["NC", "North Carolina"],
		["ND", "North Dakota"],
		["MP", "Northern Mariana Island"],
		["OH", "Ohio"],
		["OK", "Oklahoma"],
		["OR", "Oregon"],
		["PW", "Palau"],
		["PA", "Pennsylvania"],
		["PR", "Puerto Rico"],
		["RI", "Rhode Island"],
		["SC", "South Carolina"],
		["SD", "South Dakota"],
		["TN", "Tennessee"],
		["TX", "Texas"],
		["UT", "Utah"],
		["VT", "Vermont"],
		["VA", "Virginia"],
		["WI", "Wisconsin"],
		["WY", "Wyoming"]
	];
}