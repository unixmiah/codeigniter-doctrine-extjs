Ext.ns("mOQOLD");

mOQOLD.ActivityForm = Ext.extend(Ext.form.FormPanel, {
	scroll: "vertical",
	defaultType: "ux.select",
	defaults: {
		required: true,
		multiSelect: false,
		labelAlign: "top" //use below in production
		//labelAlign: (Ext.is.Desktop || Ext.is.Tablet) ? "left" : "top"
	},
	date: null,
	
	initComponent: function() {
		mOQOLD.ActivityForm.superclass.initComponent.call(this);
		
		this.on("activate", this.buildItems, this, { single: true });
		this.on("deactivate", this.destroyItems, this);
	},
	
	destroyItems: function() {
		delete this.rec;
		delete this.date;
		this.destroy();
	},
	
	makeMenu: function() {
		var html =  "<div class='menu-wrap'>";
			html += "	<div id='cal-day-view' class='month-menu-item'>Day<br>View</div>";
			html += "	<div id='cal-week-view' class='month-menu-item'>Week<br>View</div>";
			html += "</div>";
			html += "<div class='menu-wrap'>";
			html += "	<div id='cal-month-view' class='month-menu-item'>Month<br>View</div>";
			html += "	<div id='blank' class='month-menu-item'>&nbsp;</div>";
			html += "</div>";
		return {
			xtype: "component",
			html: html
		};
	},
	
	loadModule: function(name) {
		if (name === "blank") {
			return ;
		}
		var type = "weekly";
		switch(name) {
			case "cal-day-view" :
				type = "daily";
				break;
			case "cal-month-view" :
				type = "monthly";
				break;
		}
		
		var calendar = { xtype: "moqold.calendar", date: this.date, calendarType: type };
		
		var owner = this.ownerCt;
		var cmp = owner.add(calendar);
		owner.doLayout();
		owner.setActiveItem(cmp, { type: "slide", reverse: true });
	},
	
	recordObservation: function() {
		var parent = this.ownerCt;
		var cmp = parent.add({ xtype: "moqold.observationlist", rec: this.rec });
		parent.doLayout();
		parent.setActiveItem(cmp);
	},
	
	buildItems: function() {
		var items = [
			{ selectType: "activityList" },
			{ selectType: "locationList", name: "locationTypeID" },
			{ xtype: "datepickerfield", name: "startDate", label: "Date", value: new Date() },
			{ xtype: "timepickerfield", name: "startTime", label: "Start Time", value: new Date().format("g:ia") },
			{ xtype: "timepickerfield", name: "endTime", label: "End Time", value: new Date().format("g:ia") },
			{ selectType: "staffList" },
			{ xtype: "spinnerfield", name: "numParticipant", label: "Num Participants" },
			{ xtype: "spinnerfield", name: "numStaff", label: "Num Staff" },
			{ xtype: "spinnerfield", name: "numVolunteer", label: "Num Voluteers" },
			{ xtype: "spinnerfield", name: "hasFriendFamily", label: "Has Friends/Family" },
			{ selectType: "noiseList", required: false },
			{ selectType: "weatherList", required: false },
			{ selectType: "animalList", required: false },
			{ xtype: "textareafield", name: "notes", label: "Notes", required: false },
			{ xtype: "button", text: "Record Observation", scope: this, handler: this.recordObservation, disabled: (typeof this.rec === "undefined") },
			{ xtype: "fieldset", layout: "hbox", defaults: { flex: 1 }, items: [
				{ xtype: "button", text: "Back to Calendar", ui: "decline", scope: this, handler: this.doCancel },
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
		var calendar = { xtype: "moqold.calendar", date: this.date };
		
		if (typeof this.calendarType !== "undefined") {
			calendar.calendarType = this.calendarType;
		}
		
		var owner = this.ownerCt;
		var cmp = owner.add(calendar);
		owner.doLayout();
		owner.setActiveItem(cmp, { type: "slide", reverse: true });
	},
	
	returnDate: function(date, time) {
		var split = time.split(":");
		var hours = parseInt(split[0]);
		var minutes = parseInt(split[1].substr(0, 2));
		var ampm = split[1].substr(2);
		
		if (hours !== 12 && ampm === "pm") {
			hours += 12;
		}
		
		date.setHours(hours);
		date.setMinutes(minutes);
		
		return date;
	},
	
	doSave: function() {
		if (!mOQOLD.FormRequiredCheck(this)) {
			return ;
		}
		this.Mask = new Ext.LoadMask(Ext.getBody(), { msg: "Saving form..." });
		this.Mask.show();
		
		var values = this.getValues();
		
		values.endDate = values.startDate.clone();
		
		var start = this.returnDate(values.startDate.clone(), values.startTime).format("U");
		var end = this.returnDate(values.endDate.clone(), values.endTime).format("U");
		values.actDtlDuration = (end-start)/60;
		
		values.startDate = values.startDate.format("Y-m-d");
		values.endDate = values.endDate.format("Y-m-d");
		
		if (values.noiseTypeID > 0) {
			values.noiseInd = 1;
		}
		if (values.animalTypeID > 0) {
			values.hasAnimal = 1;
		}
		
		var params = {
			extAction: "ActivityDetailAPI",
			extMethod: "saveForm",
			extTID: 0,
			extUpload: false,
			extType: "rpc"
		};
		if (typeof this.rec === "object") {
			params.ID = this.rec.get("ID");
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
				mOQOLD.stores.ActivityListOffline.add(params);
			}
			mOQOLD.stores.ActivityListOffline.sync();
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
			} else {
				var btn = this.getComponent(14);
				btn.enable();
			}
			Ext.Msg.alert("Saving form", "Successfully saved!", Ext.emptyFn);
		} else {
			this.Mask.hide();
			Ext.Msg.alert("Saving form", "Something went wrong!", Ext.emptyFn);
		}
	}
});

Ext.reg("moqold.activityform", mOQOLD.ActivityForm);