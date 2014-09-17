Ext.ns("mOQOLD");

mOQOLD.IncidentDetail = Ext.extend(Ext.form.FormPanel, {
	scroll: "vertical",
	defaultType: "ux.select",
	defaults: {
		required: true,
		multiSelect: false,
		labelAlign: "top" //use below in production
		//labelAlign: (Ext.is.Desktop || Ext.is.Tablet) ? "left" : "top"
	},
	
	initComponent: function() {
		mOQOLD.IncidentDetail.superclass.initComponent.call(this);
		
		this.on("activate", this.buildItems, this, { single: true });
		this.on("deactivate", this.destroyItems, this);
	},
	
	destroyItems: function() {
		delete this.rec;
		this.destroy();
	},
	
	buildItems: function() {
		var items = [
			{ selectType: "residentList", name: "clientID" },
			{ xtype: "datepickerfield", name: "incidentSplitDate", label: "Incident Date", value: new Date() },
			{ xtype: "timepickerfield", name: "incidentSplitTime", label: "Incident Time", value: new Date().format("g:ia") },
			{ selectType: "locationList" },
			{ selectType: "userList", label: "Witness", name: "witnessUserID" },
			{ selectType: "aidList", multiSelect: true },
			{ selectType: "incidentActivityList" },
			{ selectType: "incidentCauseList" },
			{ selectType: "footwearList" },
			{ selectType: "bodypartList", multiSelect: true },
			{ xtype: "fieldset", layout: "hbox", defaults: { xtype: "button", flex: 1, scope: this }, items: [
				{ text: "Back to List", ui: "decline", scope: this, handler: this.doCancel },
				{ text: "Save", ui: "confirm", scope: this, handler: this.doSave }
			] }
		];
		
		this.on("afterlayout", this.loadRec, this);
		this.add(items);
		this.doLayout();
	},
	
	loadRec: function() {
		if (typeof this.rec === "object") {
			this.load(this.rec);
		}
	},
	
	doCancel: function() {
		var owner = this.ownerCt;
		owner.setActiveItem(0, { type: "slide", reverse: true });
	},
	
	doSave: function() {
		this.Mask = new Ext.LoadMask(Ext.getBody(), { msg: "Saving form..." });
		this.Mask.show();
		
		var values = this.getValues();
		values.incidentSplitDate = values.incidentSplitDate.format("Y-m-d");
		
		var params = {
			extAction: "IncidentAPI",
			extMethod: "saveForm",
			extTID: 0,
			extUpload: false,
			extType: "rpc",
			notifyPartyID: 52
		};
		if (typeof this.rec === "object") {
			params.ID = this.rec.get("ID");
		}
		if (values.witnessUserID !== "") {
			values.witnessInd = 1;
		}
		
		Ext.applyIf(params, values);
		if (mOQOLD.checkOnline()) {
			Ext.Ajax.request({
				url: "../index.php/direct/router",
				params: params,
				scope: this,
				success: this.onSaveReturn
			});
		} else {
			params.offline = true;
			params.newItem = (typeof this.rec === "object") ? false : true;
			
			if (typeof this.rec === "object") {
				this.rec.set(params);
			} else {
				mOQOLD.stores.IncidentListOffline.add(params);
			}
			mOQOLD.stores.IncidentListOffline.sync();
			this.Mask.hide();
			Ext.Msg.alert("Saving form", "Successfully saved offline!<br><br>Next time you connect to the internet, this observation will be submitted to the server.", Ext.emptyFn);
		}
	},
	
	onSaveReturn: function(response) {
		var result = Ext.decode(response.responseText).result;
		if (result.success) {
			this.Mask.hide();
			if (typeof this.rec === "object") {
				var data = result.data;
				this.rec.set(data);
			}
			Ext.Msg.alert("Saving form", "Successfully saved!", Ext.emptyFn);
		} else {
			this.Mask.hide();
			Ext.Msg.alert("Saving form", "Something went wrong!", Ext.emptyFn);
		}
	}
});

Ext.reg("moqold.incidentdetail", mOQOLD.IncidentDetail);