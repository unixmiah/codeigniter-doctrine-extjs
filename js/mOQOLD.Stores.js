Ext.ns("mOQOLD.Stores");

mOQOLD.Stores.createStore = function(storeConfig, insert) {
	var fields = mOQOLD.Stores.fields[storeConfig.storeId];
	
	var storeCfg = storeConfig || {};
	
	Ext.applyIf(storeCfg, {
		idProperty: "ID",
		totalProperty: "total",
		root: "items",
		fields: fields
	});
	
	var store = new Ext.data.DirectStore(storeCfg);
	
	if (typeof insert === "object" && insert !== null) {
		var rec = new store.recordType(insert);
		store.on("load", function(store) { store.insert(0, rec); });
	}
	
	return store;
}

mOQOLD.Stores.fields = {
	UserList: [
		{ name: "ID", type: "int" },
		{ name: "login", type: "string" },
		{ name: "firstName", type: "string" },
		{ name: "lastName", type: "string" },
		{ name: "fullName", type: "string" }
	],
	StaffList: [
		{ name: "ID", type: "int" },
		{ name: "firstName", type: "string" },
		{ name: "lastName", type: "string" },
		{ name: "fullName", type: "string" }
	],
	ClientList: [
		{ name: "ID", type: "int" },
		{ name: "firstName", type: "string" },
		{ name: "lastName", type: "string" },
		{ name: "fullName", type: "string" }
	],
	LocationList: [
		{ name: "ID", type: "int" },
		{ name: "locationName", type: "string" },
		{ name: "abbrName", type: "string" },
		{ name: "isActive", type: "int" }
	],
	NoiseList: [
		{ name: "ID", type: "int" },
		{ name: "noiseName", type: "string" },
		{ name: "description", type: "string" },
		{ name: "isActive", type: "int" }
	],
	AnimalList: [
		{ name: "ID", type: "int" },
		{ name: "animalName", type: "string" },
		{ name: "description", type: "string" },
		{ name: "isActive", type: "int" }
	],
	FootwearList: [
		{ name: "ID", type: "int" },
		{ name: "name", type: "string" }
	],
	WeatherList: [
		{ name: "ID", type: "int" },
		{ name: "weatherName", type: "string" },
		{ name: "description", type: "string" },
		{ name: "isActive", type: "int" }
	],
	DimensionList: [
		{ name: "ID", type: "int" },
		{ name: "dimensionName", type: "string" },
		{ name: "colorCode", type: "string" },
		{ name: "isActive", type: "int" }
	],
	InjuryList: [
		{ name: "ID", type: "int" },
		{ name: "bodyPart", type: "string" },
		{ name: "name", type: "string" },
		{ name: "description", type: "string" }
	],
	BodyPartList: [
		{ name: "ID", type: "int" },
		{ name: "name", type: "string" },
		{ name: "description", type: "string" }
	],
	RoleList: [
		{ name: "ID", type: "int" },
		{ name: "roleName", type: "string" },
		{ name: "roleDesc", type: "string" }
	],
	ContactTypeList: [
		{ name: "ID", type: "int" },
		{ name: "name", type: "string" }
	],
	ActivityList: [
		{ name: "ID", type: "int" },
		{ name: "activityName", type: "string" },
		{ name: "description", type: "string" },
		{ name: "abbrName", type: "string" },
		{ name: "demensionID", type: "int" },
		{ name: "isActive", type: "int" }
	],
	QOLList: [
		{ name: "ID", type: "int" },
		{ name: "score", type: "int" },
		{ name: "scoreDesc", type: "string" },
		{ name: "isActive", type: "int" }
	],
	IncidentCauseList: [
		{ name: "ID", type: "int" },
		{ name: "name", type: "string" },
		{ name: "description", type: "string" }
	],
	IncidentActivityList: [
		{ name: "ID", type: "int" },
		{ name: "name", type: "string" }
	],
	SystemRefList: [
		{ name: "ID", type: "int" },
		{ name: "name", type: "string" },
		{ name: "description", type: "string" },
		{ name: "refType", type: "string" }
	],
	InjureCondition: [
		{ name: "ID", type: "int" },
		{ name: "name", type: "string" },
		{ name: "description", type: "string" }
	],
	CauseList: [
		{ name: "ID", type: "int" },
		{ name: "name", type: "string" },
		{ name: "description", type: "string" }
	],
	ActivitySummary: [
		{ name: "activityName", type: "string" },
		{ name: "actDtlStime", type: "string" },
		{ name: "actDtlEtime", type: "string" }
	]
}