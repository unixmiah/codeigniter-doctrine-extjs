Ext.ns("mOQOLD");

mOQOLD.DayCalendar = Ext.extend(Ext.List, {
	initComponent: function() {
		mOQOLD.DayCalendar.superclass.initComponent.call(this);
		
		this.on("afterrender", this.changeTopDock, this);
		this.on("itemtap", this.onEventTap, this);
	},
	
	onEventTap: function(list, index, el, e) {
		var store = list.getStore();
		var rec = store.getAt(index);
		
		var parent = this.ownerCt.ownerCt;
		var cmp = parent.add({ xtype: "moqold.activityform", rec: rec, date: rec.get("startDate"), calendarType: "daily" });
		parent.doLayout();
		parent.setActiveItem(cmp);
	},
	
	changeTopDock: function(date) {
		var parent = this.ownerCt;
		var dock = parent.getDockedComponent(0);
		if (Ext.isDate(date) === false) {
			var date = this.date;
		}
		date = date.format((Ext.is.Phone || Ext.is.iPod) ? "M j" : "F j");
		dock.setTitle(date);
	},
	
	goPrev: function() {
		var first = this.firstDate.clone().clearTime();
		var last = this.lastDate.clone();
		first.setDate(first.getDate()-1);
		last.setDate(last.getDate()-1);
		last.setHours(23);
		last.setMinutes(59);
		last.setSeconds(59);
		
		this.date = first;
		this.firstDate = first;
		this.lastDate = last;
		
		var store = this.store;
		store.load({
			params: {
				startDate: first.format("Y-m-d H:i:s"),
				endDate: last.format("Y-m-d H:i:s")
			}
		});
		
		this.filterActivities(first, last);
		
		this.changeTopDock();
	},
	
	goForward: function() {
		var first = this.firstDate.clone().clearTime();
		var last = this.lastDate.clone();
		first.setDate(first.getDate()+1);
		last.setDate(last.getDate()+1);
		last.setHours(23);
		last.setMinutes(59);
		last.setSeconds(59);
		
		this.date = first;
		this.firstDate = first;
		this.lastDate = last;
		
		var store = this.store;
		store.load({
			params: {
				startDate: first.format("Y-m-d H:i:s"),
				endDate: last.format("Y-m-d H:i:s")
			}
		});
		
		this.filterActivities(first, last);
		
		this.changeTopDock();
	},
	
	filterActivities: function(firstDate, lastDate) {
		this.store.clearFilter(true);
		this.store.filterBy(function(rec) {
			var startDate = rec.get("startDate").format("U");
			var endDate = rec.get("endDate").format("U");
			firstDate = firstDate.format("U");
			lastDate = lastDate.format("U");
			if (startDate >= firstDate && endDate < lastDate) {
				return true;
			} else {
				return false;
			}
		});
	}
});

Ext.reg("moqold.daycalendar", mOQOLD.DayCalendar);