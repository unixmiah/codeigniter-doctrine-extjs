Ext.ns("Ext.form.ux", "mOQOLD");

Ext.form.ux.Select = Ext.extend(Ext.form.ux.touch.MultiSelect, {
	constructor: function(config) {
		var selectType = config.selectType;
		if (typeof selectType === "string" && Ext.form.ux.Select.types[selectType]) {
			Ext.applyIf(config, Ext.form.ux.Select.types[selectType]);
		}
		
		if (!mOQOLD.checkOnline()) {
			config.store = config.store.offlineStore
		}
		
		Ext.applyIf(config, {
			hiddenName: this.name
		});
		
		Ext.form.ux.Select.superclass.constructor.call(this, config);
	}
});
Ext.reg("ux.select", Ext.form.ux.Select);

Ext.form.ux.Select.types = {
	residentList: { store: mOQOLD.stores.ResidentList, label: "Client", name: "residentID", displayField: "lastName", valueField: "ID", itemConfig: {
		itemTpl:[
			'<span class="x-list-label">{firstName} {lastName}</span>',
			'<span class="x-list-selected"></span>'
		]
	} },
	userList: { store: mOQOLD.stores.UserList, label: "User", name: "userID", displayField: "lastName", valueField: "ID", itemConfig: {
		itemTpl:[
			'<span class="x-list-label">{firstName} {lastName}</span>',
			'<span class="x-list-selected"></span>'
		]
	} },
	staffList: { store: mOQOLD.stores.StaffList, label: "Staff", name: "staffID", displayField: "lastName", valueField: "ID", itemConfig: {
		itemTpl:[
			'<span class="x-list-label">{firstName} {lastName}</span>',
			'<span class="x-list-selected"></span>'
		]
	} },
	activityList: { store: mOQOLD.stores.ActivityValueList, label: "Activity", name: "activityID", displayField: "activityName", valueField: "ID" },
	locationList: { store: mOQOLD.stores.LocationList, label: "Location", name: "locationID", displayField: "locationName", valueField: "ID" },
	aidList: { store: mOQOLD.stores.AidList, label: "Aid", name: "aidID", displayField: "name", valueField: "ID" },
	incidentActivityList: { store: mOQOLD.stores.IncidentActivityList, label: "Activity", name: "incidentActivityID", displayField: "name", valueField: "ID" },
	incidentCauseList: { store: mOQOLD.stores.IncidentCauseList, label: "Cause", name: "incidentCauseID", displayField: "name", valueField: "ID" },
	footwearList: { store: mOQOLD.stores.FootwearList, label: "Footwear", name: "footwearID", displayField: "name", valueField: "ID" },
	bodypartList: { store: mOQOLD.stores.BodyPartList, label: "Injury", name: "bodypartID", displayField: "name", valueField: "ID" },
	noiseList: { store: mOQOLD.stores.NoiseList, label: "Noise", name: "noiseTypeID", displayField: "noiseName", valueField: "ID" },
	weatherList: { store: mOQOLD.stores.WeatherList, label: "Weather", name: "weatherTypeID", displayField: "weatherName", valueField: "ID" },
	animalList: { store: mOQOLD.stores.AnimalList, label: "Animal", name: "animalTypeID", displayField: "animalName", valueField: "ID" },
	dimensionList: { store: mOQOLD.stores.DimensionList, label: "Dimension", name: "dimensionID", displayField: "dimensionName", valueField: "ID" }
};