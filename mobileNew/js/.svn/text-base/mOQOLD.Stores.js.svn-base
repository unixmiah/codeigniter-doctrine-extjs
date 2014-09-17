Ext.ns("mOQOLD.stores");

mOQOLD.storeHelper = {

	create: function (config) {
		var cfg;
		Ext.applyIf(config, {
			proxy: {}
		});
		Ext.applyIf(config.proxy, {
			model: config.model,
			api: config.api,
			reader: {
				idProperty: "ID",
				root: "items",
				totalProperty: "total"
			}
		});

		cfg = Ext.ux.util.clone(config);
		this.createStore(cfg, true);
		cfg = Ext.ux.util.clone(config);
		this.createStore(cfg, false);
	},

	createStore: function (config, offline) {
		if (offline) {
			config.onlineStore = config.storeID;
			config.storeID = config.storeID + "Offline";
			config.autoLoad = true;
			config.offline = true;
			config.proxy.type = "localstorage";
			config.proxy.id = config.storeID;
			config.proxy.reader.type = "json";
		} else {
			config.doAutoLoad = true;
			config.offlineStore = mOQOLD.stores[config.storeID + "Offline"];
			config.proxy.type = "direct";
			config.proxy.reader.type = "direct";
			Ext.applyIf(config, { listeners: {} });
			config.listeners = {
				datachanged: { fn: this.syncStores, scope: this }
			};
		}
		mOQOLD.stores[config.storeID] = new Ext.data.JsonStore(config);
	},

	syncStores: function (store) {
		var offlineStore = store.offlineStore;
		var data = store;
		var newRecords = [];
		var recordsToUpdate = [];
		for (var i = 0, len = data.getCount(); i < len; i++) {
			var rec = data.getAt(i);
			var record = offlineStore.getById(rec.data.ID);
			if (record === null) {
				newRecords.push(Ext.apply({}, rec.data));
			} else {
				if (Ext.encode(rec.data) !== Ext.encode(record.data)) {
					recordsToUpdate.push({ record: record, data: Ext.apply({}, rec.data) });
				}
			}
		}
		//console.log(offlineStore.storeID + ' Start Time: ' + new Date());
		offlineStore.suspendEvents();
		for (var i = 0, len = recordsToUpdate.length; i < len; i++) {
			var info = recordsToUpdate[i];
			info.record.set(info.data);
		}
		offlineStore.add(newRecords);
		offlineStore.resumeEvents();
		//console.log(offlineStore.storeID + ' End Time: ' + new Date());
		offlineStore.sync();
		//console.log(offlineStore.storeID + ' End Time after sync: ' + new Date());
	}
};

mOQOLD.storeHelper.create({
	model: "SiteSpecific",
	storeID: "SiteSpecific",
	api: "SiteConfigurationAPI"
});

mOQOLD.stores.DefaultOffline = new Ext.data.JsonStore({
	model: "Default",
	storeID: "DefaultOffline",
	autoLoad: true,
	proxy: {
		type: "localstorage",
		id: "DefaultOffline",
		model: "Default",
		reader: {
			type: "json"
		}
	}
});

mOQOLD.stores.LoginListOffline = new Ext.data.JsonStore({
	model: "LoginList",
	storeID: "LoginListOffline",
	autoLoad: true,
	proxy: {
		type: "localstorage",
		id: "LoginListOffline",
		model: "LoginList",
		reader: {
			type: "json"
		}
	}
});

mOQOLD.storeHelper.create({
	model: "ClientList",
	storeID: "UserList",
	api: "ContactAPI",
	sorters: [
		{ property: "lastName", direction: "ASC" }
	]
});

mOQOLD.storeHelper.create({
	model: "LocationList",
	storeID: "LocationList",
	api: "LocationAPI",
	sorters: [
		{ property: "locationName", direction: "ASC" }
	]
});

mOQOLD.storeHelper.create({
	model: "SystemRef",
	storeID: "AidList",
	api: "SystemRefAPI",
	sorters: [
		{ property: "name", direction: "ASC" }
	],
	proxy: {
		extraParams: { type: "aid" }
	}
});

mOQOLD.storeHelper.create({
	model: "DimensionList",
	storeID: "DimensionList",
	api: "DimensionValueAPI",
	sorters: [
		{ property: "dimensionName", direction: "ASC" }
	]
});

mOQOLD.storeHelper.create({
	model: "SimpleList",
	storeID: "IncidentActivityList",
	api: "IncidentActivityAPI",
	sorters: [
		{ property: "name", direction: "ASC" }
	]
});

mOQOLD.storeHelper.create({
	model: "SimpleList",
	storeID: "IncidentCauseList",
	api: "IncidentCauseAPI",
	sorters: [
		{ property: "name", direction: "ASC" }
	]
});

mOQOLD.storeHelper.create({
	model: "SimplePlusList",
	storeID: "BodyPartList",
	api: "BodyPartAPI",
	sorters: [
		{ property: "name", direction: "ASC" }
	]
});

mOQOLD.storeHelper.create({
	model: "SimpleList",
	storeID: "FootwearList",
	api: "FootwearAPI",
	sorters: [
		{ property: "name", direction: "ASC" }
	]
});

mOQOLD.storeHelper.create({
	model: "NoiseList",
	storeID: "NoiseList",
	api: "NoiseAPI",
	sorters: [
		{ property: "noiseName", direction: "ASC" }
	]
});

mOQOLD.storeHelper.create({
	model: "WeatherList",
	storeID: "WeatherList",
	api: "WeatherAPI",
	sorters: [
		{ property: "weatherName", direction: "ASC" }
	]
});

mOQOLD.storeHelper.create({
	model: "AnimalList",
	storeID: "AnimalList",
	api: "AnimalAPI",
	sorters: [
		{ property: "animalName", direction: "ASC" }
	]
});

mOQOLD.storeHelper.create({
	model: "ActivityValueList",
	storeID: "ActivityValueList",
	api: "ActivityAPI",
	sorters: [
		{ property: "activityName", direction: "ASC" }
	]
});

mOQOLD.storeHelper.create({
	model: "ClientList",
	storeID: "ResidentList",
	api: "ClientAPI",
	getGroupString: function (rec) {
		return rec.get("lastName")[0].toUpperCase();
	},
	sorters: [
		{ property: "lastName", direction: "ASC" },
		{ property: "firstName", direction: "ASC" }
	]
});

mOQOLD.storeHelper.create({
	model: "StaffList",
	storeID: "StaffList",
	api: "ContactAPI",
	sorters: [
		{ property: "lastName", direction: "ASC" }
	]
});

mOQOLD.storeHelper.create({
	model: "IncidentList",
	storeID: "IncidentList",
	api: "IncidentAPI",
	sorters: [
		{ property: "incidentTime", direction: "DESC" }
	],
	proxy: {
		extraParams: { isMobile: true }
	}
});

mOQOLD.storeHelper.create({
	model: "ActivityList",
	storeID: "ActivityList",
	api: "ActivityDetailAPI",
	sorters: [
		{ property: "actDtlStime", direction: "ASC" }
	],
	groupField: 'actDtlStime',
	proxy: {timeout: 10000},
	getGroupString: function (rec) {
		var date = rec.get("actDtlStime");
		return date.format("H");
	}
});

mOQOLD.storeHelper.create({
	model: "ObservationList",
	storeID: "ObservationList",
	api: "ObservationAPI",
	proxy: { timeout: 10000	},
	sorters: [
		{ property: "clientLastName", direction: "ASC" }
	]
});

mOQOLD.storeHelper.create({
	model: "AllergyList",
	storeID: "AllergyList",
	api: "AllergyDetailAPI"
});


mOQOLD.storeHelper.create({
	model: "QOLScoreList",
	storeID: "QOLScoreList",
	api: "QolScoreValueAPI"
});


mOQOLD.storeHelper.create({
	model: "ConditionList",
	storeID: "ConditionList",
	api: "ClientSpecialcondDetailAPI"
});

mOQOLD.storeHelper.create({
	model: "ResidentAidList",
	storeID: "ResidentAidList",
	api: "AidDetailAPI"
});


mOQOLD.storeHelper.create({
	model: "ResidentInjuryList",
	storeID: "ResidentInjuryList",
	api: "IncidentBodypartAPI"
});
	

mOQOLD.stores.Usability = new Ext.data.JsonStore({
	model: "Usability",
	storeID: "UsabilityOffline",
	autoLoad: false,
	onlineApi: "HandHeldUsabilityAPI",
	proxy: {
		type: "localstorage",
		id: "UsabilityOffline",
		model: "Usability",
		reader: {
			type: "json"
		}
	}
});
