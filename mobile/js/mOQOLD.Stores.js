Ext.ns("mOQOLD.stores");

mOQOLD.SyncStores = function(store) {
	var offlineStore = store.offlineStore;
	store.each(function(rec) {
		var record = offlineStore.findRecord("ID", rec.get("ID"));
		if (record === null) {
			offlineStore.add(rec.data);
		} else {
			record.set(rec.data);
		}
	});
	offlineStore.sync();
}

mOQOLD.stores.SiteSpecificOffline = new Ext.data.JsonStore({
	model: "SiteSpecific",
	storeID: "SiteSpecificOffline",
	autoLoad: true,
	offline: true,
	api: "SiteConfigurationAPI",
	onlineStore: "SiteSpecific",
	proxy: {
		type: "localstorage",
		id: "SiteSpecificOffline",
		model: "SiteSpecific",
		reader: {
			type: "json",
			idProperty: "ID",
			root: "items",
			totalProperty: "total"
		}
	}
});

mOQOLD.stores.SiteSpecific = new Ext.data.JsonStore({
	model: "SiteSpecific",
	storeID: "SiteSpecific",
	doAutoLoad: true,
	offlineStore: mOQOLD.stores.SiteSpecificOffline,
	proxy: {
		type: "direct",
		api: "SiteConfigurationAPI",
		reader: {
			type: "direct",
			idProperty: "ID",
			root: "items",
			totalProperty: "total"
		}
	},
	listeners: {
		datachanged: function(store) {
			mOQOLD.SyncStores(store);
		},
		update: function(store) {
			mOQOLD.SyncStores(store);
		}
	}
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

mOQOLD.stores.UserListOffline = new Ext.data.JsonStore({
	model: "ClientList",
	storeID: "UserListOffline",
	autoLoad: true,
	onlineStore: "UserList",
	sorters: [
		{ property: "lastName", direction: "ASC" }
	],
	proxy: {
		type: "localstorage",
		id: "UserListOffline",
		model: "ClientList",
		reader: {
			type: "json",
			idProperty: "ID",
			root: "items",
			totalProperty: "total"
		}
	}
});

mOQOLD.stores.UserList = new Ext.data.JsonStore({
	model: "ClientList",
	storeID: "UserList",
	doAutoLoad: true,
	offlineStore: mOQOLD.stores.UserListOffline,
	sorters: [
		{ property: "lastName", direction: "ASC" }
	],
	proxy: {
		type: "direct",
		api: "ContactAPI",
		reader: {
			type: "direct",
			idProperty: "ID",
			root: "items",
			totalProperty: "total"
		}
	},
	listeners: {
		datachanged: function(store) {
			mOQOLD.SyncStores(store);
		},
		update: function(store) {
			mOQOLD.SyncStores(store);
		}
	}
});

mOQOLD.stores.LocationListOffline = new Ext.data.JsonStore({
	model: "LocationList",
	storeID: "LocationListOffline",
	autoLoad: true,
	onlineStore: "LocationList",
	sorters: [
		{ property: "locationName", direction: "ASC" }
	],
	proxy: {
		type: "localstorage",
		id: "LocationListOffline",
		model: "LocationList",
		reader: {
			type: "json",
			idProperty: "ID",
			root: "items",
			totalProperty: "total"
		}
	}
});

mOQOLD.stores.LocationList = new Ext.data.JsonStore({
	model: "LocationList",
	storeID: "LocationList",
	doAutoLoad: true,
	offlineStore: mOQOLD.stores.LocationListOffline,
	sorters: [
		{ property: "locationName", direction: "ASC" }
	],
	proxy: {
		type: "direct",
		api: "LocationAPI",
		reader: {
			type: "direct",
			idProperty: "ID",
			root: "items",
			totalProperty: "total"
		}
	},
	listeners: {
		datachanged: function(store) {
			mOQOLD.SyncStores(store);
		},
		update: function(store) {
			mOQOLD.SyncStores(store);
		}
	}
});

mOQOLD.stores.AidListOffline = new Ext.data.JsonStore({
	model: "SystemRef",
	storeID: "AidListOffline",
	autoLoad: true,
	onlineStore: "AidList",
	sorters: [
		{ property: "name", direction: "ASC" }
	],
	proxy: {
		type: "localstorage",
		id: "AidListOffline",
		model: "SystemRef",
		reader: {
			type: "json",
			idProperty: "ID",
			root: "items",
			totalProperty: "total"
		}
	}
});

mOQOLD.stores.AidList = new Ext.data.JsonStore({
	model: "SystemRef",
	storeID: "AidList",
	doAutoLoad: true,
	offlineStore: mOQOLD.stores.AidListOffline,
	sorters: [
		{ property: "name", direction: "ASC" }
	],
	proxy: {
		type: "direct",
		api: "SystemRefAPI",
		extraParams: {
			type: "aid"
		},
		reader: {
			type: "direct",
			idProperty: "ID",
			root: "items",
			totalProperty: "total"
		}
	},
	listeners: {
		datachanged: function(store) {
			mOQOLD.SyncStores(store);
		},
		update: function(store) {
			mOQOLD.SyncStores(store);
		}
	}
});

mOQOLD.stores.DimensionListOffline = new Ext.data.JsonStore({
	model: "DimensionList",
	storeID: "DimensionListOffline",
	autoLoad: true,
	onlineStore: "DimensionList",
	sorters: [
		{ property: "dimensionName", direction: "ASC" }
	],
	proxy: {
		type: "localstorage",
		id: "DimensionListOffline",
		model: "DimensionList",
		reader: {
			type: "json",
			idProperty: "ID",
			root: "items",
			totalProperty: "total"
		}
	}
});

mOQOLD.stores.DimensionList = new Ext.data.JsonStore({
	model: "DimensionList",
	storeID: "DimensionList",
	doAutoLoad: true,
	offlineStore: mOQOLD.stores.DimensionListOffline,
	sorters: [
		{ property: "dimensionName", direction: "ASC" }
	],
	proxy: {
		type: "direct",
		api: "DimensionValueAPI",
		reader: {
			type: "direct",
			idProperty: "ID",
			root: "items",
			totalProperty: "total"
		}
	},
	listeners: {
		datachanged: function(store) {
			mOQOLD.SyncStores(store);
		},
		update: function(store) {
			mOQOLD.SyncStores(store);
		}
	}
});

mOQOLD.stores.IncidentActivityListOffline = new Ext.data.JsonStore({
	model: "SimpleList",
	storeID: "IncidentActivityListOffline",
	autoLoad: true,
	onlineStore: "IncidentActivityList",
	sorters: [
		{ property: "name", direction: "ASC" }
	],
	proxy: {
		type: "localstorage",
		id: "IncidentActivityListOffline",
		model: "SimpleList",
		reader: {
			type: "json",
			idProperty: "ID",
			root: "items",
			totalProperty: "total"
		}
	}
});

mOQOLD.stores.IncidentActivityList = new Ext.data.JsonStore({
	model: "SimpleList",
	storeID: "IncidentActivityList",
	doAutoLoad: true,
	offlineStore: mOQOLD.stores.IncidentActivityListOffline,
	sorters: [
		{ property: "name", direction: "ASC" }
	],
	proxy: {
		type: "direct",
		api: "IncidentActivityAPI",
		reader: {
			type: "direct",
			idProperty: "ID",
			root: "items",
			totalProperty: "total"
		}
	},
	listeners: {
		datachanged: function(store) {
			mOQOLD.SyncStores(store);
		},
		update: function(store) {
			mOQOLD.SyncStores(store);
		}
	}
});

mOQOLD.stores.IncidentCauseListOffline = new Ext.data.JsonStore({
	model: "SimpleList",
	storeID: "IncidentCauseListOffline",
	autoLoad: true,
	onlineStore: "IncidentCauseList",
	sorters: [
		{ property: "name", direction: "ASC" }
	],
	proxy: {
		type: "localstorage",
		id: "IncidentActivityListOffline",
		model: "SimpleList",
		reader: {
			type: "json",
			idProperty: "ID",
			root: "items",
			totalProperty: "total"
		}
	}
});

mOQOLD.stores.IncidentCauseList = new Ext.data.JsonStore({
	model: "SimpleList",
	storeID: "IncidentCauseList",
	doAutoLoad: true,
	offlineStore: mOQOLD.stores.IncidentCauseListOffline,
	sorters: [
		{ property: "name", direction: "ASC" }
	],
	proxy: {
		type: "direct",
		api: "IncidentCauseAPI",
		reader: {
			type: "direct",
			idProperty: "ID",
			root: "items",
			totalProperty: "total"
		}
	},
	listeners: {
		datachanged: function(store) {
			mOQOLD.SyncStores(store);
		},
		update: function(store) {
			mOQOLD.SyncStores(store);
		}
	}
});

mOQOLD.stores.BodyPartListOffline = new Ext.data.JsonStore({
	model: "SimplePlusList",
	storeID: "BodyPartListOffline",
	doAutoLoad: true,
	onlineStore: "BodyPartList",
	sorters: [
		{ property: "name", direction: "ASC" }
	],
	proxy: {
		type: "localstorage",
		id: "BodyPartListOffline",
		model: "SimplePlusList",
		reader: {
			type: "json",
			idProperty: "ID",
			root: "items",
			totalProperty: "total"
		}
	}
});

mOQOLD.stores.BodyPartList = new Ext.data.JsonStore({
	model: "SimplePlusList",
	storeID: "BodyPartList",
	doAutoLoad: true,
	offlineStore: mOQOLD.stores.BodyPartListOffline,
	sorters: [
		{ property: "name", direction: "ASC" }
	],
	proxy: {
		type: "direct",
		api: "BodyPartAPI",
		reader: {
			type: "direct",
			idProperty: "ID",
			root: "items",
			totalProperty: "total"
		}
	},
	listeners: {
		datachanged: function(store) {
			mOQOLD.SyncStores(store);
		},
		update: function(store) {
			mOQOLD.SyncStores(store);
		}
	}
});

mOQOLD.stores.FootwearListOffline = new Ext.data.JsonStore({
	model: "SimpleList",
	storeID: "FootwearListOffline",
	autoLoad: true,
	onlineStore: "FootwearList",
	sorters: [
		{ property: "name", direction: "ASC" }
	],
	proxy: {
		type: "localstorage",
		id: "FootwearListOffline",
		model: "SimpleList",
		reader: {
			type: "json",
			idProperty: "ID",
			root: "items",
			totalProperty: "total"
		}
	}
});

mOQOLD.stores.FootwearList = new Ext.data.JsonStore({
	model: "SimpleList",
	storeID: "FootwearList",
	doAutoLoad: true,
	offlineStore: mOQOLD.stores.FootwearListOffline,
	sorters: [
		{ property: "name", direction: "ASC" }
	],
	proxy: {
		type: "direct",
		api: "FootwearAPI",
		reader: {
			type: "direct",
			idProperty: "ID",
			root: "items",
			totalProperty: "total"
		}
	},
	listeners: {
		datachanged: function(store) {
			mOQOLD.SyncStores(store);
		},
		update: function(store) {
			mOQOLD.SyncStores(store);
		}
	}
});

mOQOLD.stores.NoiseListOffline = new Ext.data.JsonStore({
	model: "NoiseList",
	storeID: "NoiseListOffline",
	autoLoad: true,
	onlineStore: "NoiseList",
	sorters: [
		{ property: "noiseName", direction: "ASC" }
	],
	proxy: {
		type: "localstorage",
		id: "NoiseListOffline",
		model: "NoiseList",
		reader: {
			type: "json",
			idProperty: "ID",
			root: "items",
			totalProperty: "total"
		}
	}
});

mOQOLD.stores.NoiseList = new Ext.data.JsonStore({
	model: "NoiseList",
	storeID: "NoiseList",
	doAutoLoad: true,
	offlineStore: mOQOLD.stores.NoiseListOffline,
	sorters: [
		{ property: "noiseName", direction: "ASC" }
	],
	proxy: {
		type: "direct",
		api: "NoiseAPI",
		reader: {
			type: "direct",
			idProperty: "ID",
			root: "items",
			totalProperty: "total"
		}
	},
	listeners: {
		datachanged: function(store) {
			mOQOLD.SyncStores(store);
		},
		update: function(store) {
			mOQOLD.SyncStores(store);
		}
	}
});

mOQOLD.stores.WeatherListOffline = new Ext.data.JsonStore({
	model: "WeatherList",
	storeID: "WeatherListOffline",
	autoLoad: true,
	onlineStore: "WeatherList",
	sorters: [
		{ property: "weatherName", direction: "ASC" }
	],
	proxy: {
		type: "localstorage",
		id: "WeatherListOffline",
		model: "WeatherList",
		reader: {
			type: "json",
			idProperty: "ID",
			root: "items",
			totalProperty: "total"
		}
	}
});

mOQOLD.stores.WeatherList = new Ext.data.JsonStore({
	model: "WeatherList",
	storeID: "WeatherList",
	doAutoLoad: true,
	offlineStore: mOQOLD.stores.WeatherListOffline,
	sorters: [
		{ property: "weatherName", direction: "ASC" }
	],
	proxy: {
		type: "direct",
		api: "WeatherAPI",
		reader: {
			type: "direct",
			idProperty: "ID",
			root: "items",
			totalProperty: "total"
		}
	},
	listeners: {
		datachanged: function(store) {
			mOQOLD.SyncStores(store);
		},
		update: function(store) {
			mOQOLD.SyncStores(store);
		}
	}
});

mOQOLD.stores.AnimalListOffline = new Ext.data.JsonStore({
	model: "AnimalList",
	storeID: "AnimalListOffline",
	autoLoad: true,
	onlineStore: "AnimalList",
	sorters: [
		{ property: "animalName", direction: "ASC" }
	],
	proxy: {
		type: "localstorage",
		id: "AnimalListOffline",
		model: "AnimalList",
		reader: {
			type: "json",
			idProperty: "ID",
			root: "items",
			totalProperty: "total"
		}
	}
});

mOQOLD.stores.AnimalList = new Ext.data.JsonStore({
	model: "AnimalList",
	storeID: "AnimalList",
	doAutoLoad: true,
	offlineStore: mOQOLD.stores.AnimalListOffline,
	sorters: [
		{ property: "animalName", direction: "ASC" }
	],
	proxy: {
		type: "direct",
		api: "AnimalAPI",
		reader: {
			type: "direct",
			idProperty: "ID",
			root: "items",
			totalProperty: "total"
		}
	},
	listeners: {
		datachanged: function(store) {
			mOQOLD.SyncStores(store);
		},
		update: function(store) {
			mOQOLD.SyncStores(store);
		}
	}
});

mOQOLD.stores.ActivityValueListOffline = new Ext.data.JsonStore({
	model: "ActivityValueList",
	storeID: "ActivityValueListOffline",
	autoLoad: true,
	onlineStore: "ActivityValueList",
	sorters: [
		{ property: "activityName", direction: "ASC" }
	],
	proxy: {
		type: "localstorage",
		id: "ActivityValueListOffline",
		model: "ActivityValueList",
		reader: {
			type: "json",
			idProperty: "ID",
			root: "items",
			totalProperty: "total"
		}
	}
});

mOQOLD.stores.ActivityValueList = new Ext.data.JsonStore({
	model: "ActivityValueList",
	storeID: "ActivityValueList",
	doAutoLoad: true,
	offlineStore: mOQOLD.stores.ActivityValueListOffline,
	sorters: [
		{ property: "activityName", direction: "ASC" }
	],
	proxy: {
		type: "direct",
		api: "ActivityAPI",
		reader: {
			type: "direct",
			idProperty: "ID",
			root: "items",
			totalProperty: "total"
		}
	},
	listeners: {
		datachanged: function(store) {
			mOQOLD.SyncStores(store);
		},
		update: function(store) {
			mOQOLD.SyncStores(store);
		}
	}
});

mOQOLD.stores.ResidentListOffline = new Ext.data.JsonStore({
	model: "ClientList",
	storeID: "ResidentListOffline",
	autoLoad: true,
	onlineStore: "ResidentList",
	sorters: [
		{ property: "lastName", direction: "ASC" }
	],
	proxy: {
		type: "localstorage",
		id: "ResidentListOffline",
		model: "ClientList",
		reader: {
			type: "json",
			idProperty: "ID",
			root: "items",
			totalProperty: "total"
		}
	}
});

mOQOLD.stores.ResidentList = new Ext.data.JsonStore({
	model: "ClientList",
	storeID: "ResidentList",
	doAutoLoad: true,
	offlineStore: mOQOLD.stores.ResidentListOffline,
	getGroupString: function(rec) {
		return rec.get("lastName")[0];
	},
	sorters: [
		{ property: "lastName", direction: "ASC" },
		{ property: "firstName", direction: "ASC" }
	],
	proxy: {
		type: "direct",
		api: "ClientAPI",
		reader: {
			type: "direct",
			idProperty: "ID",
			root: "items",
			totalProperty: "total"
		}
	},
	listeners: {
		datachanged: function(store) {
			mOQOLD.SyncStores(store);
		},
		update: function(store) {
			mOQOLD.SyncStores(store);
		}
	}
});

mOQOLD.stores.StaffListOffline = new Ext.data.JsonStore({
	model: "ClientList",
	storeID: "StaffListOffline",
	autoLoad: true,
	onlineStore: "StaffList",
	sorters: [
		{ property: "lastName", direction: "ASC" }
	],
	proxy: {
		type: "localstorage",
		id: "StaffListOffline",
		model: "ClientList",
		reader: {
			type: "json",
			idProperty: "ID",
			root: "items",
			totalProperty: "total"
		}
	}
});

mOQOLD.stores.StaffList = new Ext.data.JsonStore({
	model: "ClientList",
	storeID: "StaffList",
	doAutoLoad: true,
	offlineStore: mOQOLD.stores.StaffListOffline,
	sorters: [
		{ property: "lastName", direction: "ASC" }
	],
	proxy: {
		type: "direct",
		api: "ContactAPI",
		extraParams: { type: 1 },
		reader: {
			type: "direct",
			idProperty: "ID",
			root: "items",
			totalProperty: "total"
		}
	},
	listeners: {
		datachanged: function(store) {
			mOQOLD.SyncStores(store);
		},
		update: function(store) {
			mOQOLD.SyncStores(store);
		}
	}
});

mOQOLD.stores.IncidentListOffline = new Ext.data.JsonStore({
	model: "IncidentListOffline",
	storeID: "IncidentListOffline",
	autoLoad: true,
	offline: true,
	api: "IncidentAPI",
	onlineStore: "IncidentList",
	sorters: [
		{ property: "incidentTime", direction: "ASC" }
	],
	proxy: {
		type: "localstorage",
		id: "IncidentListOffline",
		model: "IncidentListOffline",
		reader: {
			type: "json",
			idProperty: "ID",
			root: "items",
			totalProperty: "total"
		}
	}
});

mOQOLD.stores.IncidentList = new Ext.data.JsonStore({
	model: "IncidentList",
	storeID: "IncidentList",
	offlineStore: mOQOLD.stores.IncidentListOffline,
	sorters: [
		{ property: "incidentTime", direction: "ASC" }
	],
	proxy: {
		type: "direct",
		api: "IncidentAPI",
		reader: {
			type: "direct",
			idProperty: "ID",
			root: "items",
			totalProperty: "total"
		}
	},
	listeners: {
		datachanged: function(store) {
			mOQOLD.SyncStores(store);
		},
		update: function(store) {
			mOQOLD.SyncStores(store);
		}
	}
});

mOQOLD.stores.ObservationListOffline = new Ext.data.JsonStore({
	model: "ObservationList",
	storeID: "ObservationListOffline",
	autoLoad: true,
	offline: true,
	api: "ObservationAPI",
	onlineStore: "ObservationList",
	getGroupString: function(rec) {
		return rec.get("clientLastName")[0];
	},
	sorters: [
		{ property: "clientLastName", direction: "ASC" }
	],
	proxy: {
		type: "localstorage",
		id: "ObservationListOffline",
		model: "ObservationList",
		reader: {
			type: "json",
			idProperty: "ID",
			root: "items",
			totalProperty: "total"
		}
	}
});

mOQOLD.stores.ObservationList = new Ext.data.JsonStore({
	model: "ObservationList",
	storeID: "ObservationList",
	getGroupString: function(rec) {
		return rec.get("clientLastName")[0];
	},
	offlineStore: mOQOLD.stores.ObservationListOffline,
	sorters: [
		{ property: "clientLastName", direction: "ASC" }
	],
	proxy: {
		type: "direct",
		api: "ObservationAPI",
		reader: {
			type: "direct",
			idProperty: "ID",
			root: "items",
			totalProperty: "total"
		}
	},
	listeners: {
		datachanged: function(store) {
			mOQOLD.SyncStores(store);
		},
		update: function(store) {
			mOQOLD.SyncStores(store);
		}
	}
});

mOQOLD.stores.ActivityListOffline = new Ext.data.JsonStore({
	model: "ActivityListOffline",
	storeID: "ActivityListOffline",
	autoLoad: true,
	offline: true,
	api: "ActivityDetailAPI",
	onlineStore: "ActivityList",
	getGroupString: Ext.emptyFn,
	sorters: [
		{ property: "actDtlStime", direction: "ASC" }
	],
	proxy: {
		type: "localstorage",
		id: "ActivityListOffline",
		model: "ActivityListOffline",
		reader: {
			type: "json",
			idProperty: "ID",
			root: "items",
			totalProperty: "total"
		}
	}
});

mOQOLD.stores.ActivityList = new Ext.data.JsonStore({
	model: "ActivityList",
	storeID: "ActivityList",
	offlineStore: mOQOLD.stores.ActivityListOffline,
	getGroupString: Ext.emptyFn,
	sorters: [
		{ property: "actDtlStime", direction: "ASC" }
	],
	proxy: {
		type: "direct",
		api: "ActivityDetailAPI",
		reader: {
			type: "direct",
			idProperty: "ID",
			root: "items",
			totalProperty: "total"
		}
	},
	listeners: {
		datachanged: function(store) {
			mOQOLD.SyncStores(store);
		},
		update: function(store) {
			mOQOLD.SyncStores(store);
		}
	}
});