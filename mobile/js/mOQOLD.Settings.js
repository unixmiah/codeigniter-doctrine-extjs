Ext.ns("mOQOLD");

mOQOLD.Settings = Ext.extend(Ext.form.FormPanel, {
	scroll: "vertical",
	defaults: {
		required: true,
		labelAlign: "top" //use below in production
		//labelAlign: (Ext.is.Desktop || Ext.is.Tablet) ? "left" : "top"
	},
	
	initComponent: function() {
		mOQOLD.Settings.superclass.initComponent.call(this);
		
		this.on("activate", this.buildItems, this, { single: true });
		this.on("deactivate", this.destroyItems, this);
	},
	
	destroyItems: function() {
		this.destroy();
	},
	
	goPrev: function() {
		var parent = this.ownerCt;
		parent.setActiveItem(0, { type: "slide", reverse: true });
	},
	
	loadRec: function() {
		if (mOQOLD.checkOnline()) {
			var store = mOQOLD.stores.SiteSpecific;
		} else {
			var store = mOQOLD.stores.SiteSpecificOffline;
		}
		this.rec = store.getAt(0);
		this.load(this.rec);
		this.load(mOQOLD.DefaultRec);
	},
	
	buildItems: function() {
		var items = [
			{ xtype: "selectfield", name: "calendarType", label: "Default Calendar View", options: [
				{ text: "Daily", value: "daily" },
				{ text: "Weekly", value: "weekly" },
				{ text: "Monthly", value: "monthly" }
			] },
			{ xtype: "colorpickerfield", name: "colorCode", label: "My Color", colors: mOQOLD.Colors },
			{ xtype: "selectfield", name: "nameDisplay", label: "Participant Name Display", options: [
				{ text: "First Name Last Name", value: 1 },
				{ text: "Last Name, First Name", value: 2 }
			] },
			{ xtype: "container", layout: "hbox", defaults: { flex: 1 }, items: [
				{ xtype: "button", text: "Cancel", ui: "decline", scope: this, handler: this.goPrev },
				{ xtype: "button", text: "Save", ui: "confirm", scope: this, handler: this.doSave }
			] },
			{ xtype: "fieldset", title: "CAUTION", items: [
				{ xtype: "button", text: "Clear Local Storage", ui: "decline", scope: this, handler: this.clearLocalConfirm }
			] }
		];
		
		this.on("afterlayout", this.loadRec, this);
		
		this.add(items);
		this.doLayout();
	},
	
	clearLocalConfirm: function() {
		Ext.Msg.confirm("Confirm Clear", "Are you sure you want to clear all local data?", this.doLocalClear, this);
	},
	
	doLocalClear: function(btn) {
		if (btn === "yes") {
			window.localStorage.clear();
			Ext.Msg.alert("Clear successful", "Please log out and refresh this page.", Ext.emptyFn);
		}
	},
	
	doSave: function() {
		this.Mask = new Ext.LoadMask(Ext.getBody(), { msg: "Saving form..." });
		this.Mask.show();
		
		var values = this.getValues();
		
		mOQOLD.DefaultRec.set("calendarType", values.calendarType);
		mOQOLD.stores.DefaultOffline.sync();
		delete values.calendarType;
		
		var params = {
			extAction: "SiteConfigurationAPI",
			extMethod: "saveForm",
			extTID: 0,
			extUpload: false,
			extType: "rpc"
		};
		
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
				mOQOLD.stores.SiteSpecificOffline.add(params);
			}
			mOQOLD.stores.SiteSpecificOffline.sync();
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

Ext.reg("moqold.settings", mOQOLD.Settings);