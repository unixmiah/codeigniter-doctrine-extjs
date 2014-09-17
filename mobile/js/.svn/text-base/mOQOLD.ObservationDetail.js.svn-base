Ext.ns("mOQOLD");

mOQOLD.ObservationDetail = Ext.extend(Ext.form.FormPanel, {
	scroll: "vertical",
	defaultType: "ux.select",
	defaults: {
		required: true,
		multiSelect: false,
		labelAlign: "top" //use below in production
		//labelAlign: (Ext.is.Desktop || Ext.is.Tablet) ? "left" : "top"
	},
	
	initComponent: function() {
		mOQOLD.ObservationDetail.superclass.initComponent.call(this);
		
		this.on("activate", this.buildItems, this);
		this.on("deactivate", this.destroyItems, this);
	},
	
	makeMenu: function() {
		var html =  "<div style='-webkit-column-count: 1;'>";
			html += "	<div id='back-list' class='month-menu-item'>Back to<br>Observation List</div>";
			html += "</div>";
		return {
			xtype: "component",
			html: html
		};
	},
	
	loadModule: function(name) {
		switch (name) {
			case "back-list" :
				this.doCancel();
				break;
		}
	},
	
	destroyItems: function() {
		delete this.rec;
		delete this.activityRec;
		this.destroy();
	},
	
	buildItems: function() {
		var items = [
			{ selectType: "residentList", name: "clientID" },
			{ xtype: "spinnerfield", name: "scrBest", label: "Best Score", maxValue: 3, minValue: -3 },
			{ xtype: "spinnerfield", name: "scrWorst", label: "Worst Score", maxValue: 3, minValue: -3 },
			{ xtype: "spinnerfield", name: "scrMost", label: "Most Score", maxValue: 3, minValue: -3 },
			{ xtype: "spinnerfield", name: "participationLevel", label: "Participation Level", maxValue: 3, minValue: 0 },
			{ selectType: "dimensionList", name: "pDimensionID", label: "Primary Dimension" },
			{ selectType: "dimensionList", name: "sDimensionID", label: "Secondary Dimension" },
			{ xtype: "textareafield", name: "notes", label: "Staff Notes", required: false },
			{ xtype: "textareafield", name: "clientNotes", label: "Client Notes", required: false },
			{ xtype: "fieldset", layout: "hbox", defaults: { flex: 1 }, items: [
				{ xtype: "button", text: "Back to List", ui: "decline", scope: this, handler: this.doCancel },
				{ xtype: "button", text: "Save", ui: "confirm", scope: this, handler: this.doSave }
			] }
		];
		
		this.on("afterlayout", this.loadRec, this, { single: true });
		
		this.add(items);
		this.doLayout();
	},
	
	loadRec: function() {
		if (typeof this.rec === "object") {
			this.load(this.rec);
		}
	},
	
	doCancel: function() {
		var calendar = { xtype: "moqold.observationlist", rec: this.activityRec };
		var owner = this.ownerCt;
		var cmp = owner.add(calendar);
		owner.doLayout();
		owner.setActiveItem(cmp, { type: "slide", reverse: true });
	},
	
	doSave: function() {
		this.Mask = new Ext.LoadMask(Ext.getBody(), { msg: "Saving form..." });
		this.Mask.show();
		
		var values = this.getValues();
		
		var params = {
			extAction: "ObservationAPI",
			extMethod: "saveForm",
			extTID: 0,
			extUpload: false,
			extType: "rpc"
		};
		
		params.actDetailID = this.activityRec.get("ID");
		
		Ext.applyIf(params, values);
		
		if (typeof this.rec === "object") {
			params.ID = this.rec.get("ID");
		}
		
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
			
			var clientRec = mOQOLD.stores.ResidentList.findRecord("ID", params.clientID);
			params.clientFirstName = clientRec.get("firstName");
			params.clientLastName = clientRec.get("lastName");
			if (typeof this.rec === "object") {
				this.rec.set(params);
			} else {
				mOQOLD.stores.ObservationListOffline.add(params);
			}
			mOQOLD.stores.ObservationListOffline.sync();
			this.Mask.hide();
			Ext.Msg.alert("Saving form", "Successfully saved offline!<br><br>Next time you connect to the internet, this observation will be submitted to the server.", Ext.emptyFn);
		}
	},
	
	onSaveReturn: function(response) {
		var result = Ext.decode(response.responseText).result;
		if (result.success) {
			this.Mask.hide();
			var data = result.data;
			if (typeof this.rec !== "object") {
				var rec = Ext.ModelMgr.create({}, "ObservationList");
				this.rec = mOQOLD.stores.ObservationList.add(data)[0];
			} else {
				this.rec.set(data);
			}
			Ext.Msg.alert("Saving form", "Successfully saved!", Ext.emptyFn);
		} else {
			this.Mask.hide();
			Ext.Msg.alert("Saving form", "Something went wrong!", Ext.emptyFn);
		}
	}
});

Ext.reg("moqold.observationdetail", mOQOLD.ObservationDetail);