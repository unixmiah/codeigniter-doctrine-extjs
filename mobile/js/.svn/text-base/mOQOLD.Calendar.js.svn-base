Ext.ns("mOQOLD");

mOQOLD.Calendar = Ext.extend(Ext.Panel, {
	layout: "card",
	cardSwitchAnimation: "slide",
	date: new Date(),
	
	initComponent: function() {
		this.dockedItems = this.buildDocks();
		
		mOQOLD.Calendar.superclass.initComponent.call(this);
		
		this.on("activate", this.buildItems, this, { single: true });
		this.on("deactivate", this.destroyItems, this);
	},
	
	destroyItems: function() {
		this.destroy();
	},
	
	addEvent: function() {
		var parent = this.ownerCt;
		var cmp = parent.add({ xtype: "moqold.activityform", date: this.date });
		parent.doLayout();
		parent.setActiveItem(cmp);
	},
	
	makeMenu: function() {
		var html =  "<div class='menu-wrap'>";
			html += "	<div id='cal-day-view' class='month-menu-item'>Day<br>View</div>";
			html += "	<div id='cal-week-view' class='month-menu-item'>Week<br>View</div>";
			html += "</div>";
			html += "<div class='menu-wrap'>";
			html += "	<div id='cal-month-view' class='month-menu-item'>Month<br>View</div>";
			html += "	<div id='add-activity' class='month-menu-item'>Add<br>Activity</div>";
			html += "</div>";
		return {
			xtype: "component",
			html: html
		};
	},
	
	loadModule: function(name) {
		var type = "weekly";
		switch(name) {
			case "cal-day-view" :
				type = "daily";
				break;
			case "cal-month-view" :
				type = "monthly";
				break;
			case "add-activity" :
				this.addEvent();
				return ;
				break;
		}
		
		this.calendarType = type;
		this.buildItems();
	},
	
	buildDocks: function() {
		return [
			{
				xtype: "toolbar",
				dock: "top",
				ui: "dark",
				items: [
					{ text: "Previous", ui: "back", scope: this, handler: this.goPrev },
					{ xtype: "spacer" },
					{ text: "Forward", ui: "forward", scope: this, handler: this.goForward }
				]
			}
		];
	},
	
	goPrev: function() {
		var calendar = this.getComponent(0);
		calendar.goPrev();
	},
	
	goForward: function() {
		var calendar = this.getComponent(0);
		calendar.goForward();
	},
	
	markEvents: function(store) {
		var cmp = this.getComponent(0);
		cmp.markEvent(store);
	},
	
	buildItems: function() {
		var xtype, groupFunc,
			date = this.date,
			dateFormat = "m-d g:ia",
			store = mOQOLD.stores.ActivityList;
		
		var calendarType = (typeof this.calendarType !== "undefined") ? this.calendarType : mOQOLD.DefaultRec.get("calendarType");
		
		if (typeof calendarType === "undefined" || calendarType === "") {
			calendarType = "daily";
		}
		
		if (calendarType === "monthly") {
			xtype = "moqold.monthcalendar";
			store.on("datachanged", this.markEvents, this, { single: true });
		} else if (calendarType === "daily") {
			xtype = "moqold.daycalendar";
			groupFunc = this.dayGroupString;
		} else if (calendarType === "weekly") {
			xtype = "moqold.weekcalendar";
			groupFunc = this.weekGroupString;
		}
		
		var dates = this.makeDates(calendarType);
		
		if (!mOQOLD.checkOnline()) {
			store = store.offlineStore;
			store.filterBy(function(rec) {
				var startDate = rec.get("startDate").format("U");
				var endDate = rec.get("endDate").format("U");
				var firstDate = dates[0].format("U");
				var lastDate = dates[1].format("U");
				if (startDate >= firstDate && endDate <= lastDate) {
					return true;
				}
			});
		}
		if (typeof groupFunc === "function") {
			store.getGroupString = groupFunc;
		}
		
		var config = {
			xtype: xtype,
			store: store,
			firstDate: dates[0],
			lastDate: dates[1]
		};
		var calendar = this.makeCalendar(config);
		
		store.load({
			params: {
				startDate: dates[0].format("Y-m-d H:i:s"),
				endDate: dates[1].format("Y-m-d H:i:s")
			}
		});
		
		this.removeAll();
		this.add(calendar);
		this.doLayout();
	},
	
	makeCalendar: function(config) {
		Ext.apply(config, {
			date: this.date,
			itemSelector : "div.entry",
			singleSelect : true,
			grouped : true,
			autoHeight : true,
			overItemCls : "x-view-over",
			emptyText : "No Time Entries",
			itemTpl: new Ext.XTemplate(
				'<tpl for=".">',
					'<div class="entry">',
						'<div>{activityName} {actDtlStime:date("m-d g:ia")}</div>',
					'</div>',
				'</tpl>'
			)
		});
		return config;
	},
	
	makeDates: function(type) {
		var firstDate, lastDate,
			date = this.date;
		
		if (type === "monthly") {
			firstDate = date.getFirstDateOfMonth();
			lastDate = date.getLastDateOfMonth();
		} else if (type === "weekly") {
			firstDate = date.clone();
			firstDate = this.findSunday(firstDate);
			lastDate = firstDate.clone();
			lastDate.setDate(lastDate.getDate()+6);
		} else if (type === "daily") {
			firstDate = date;
			lastDate = date.clone();
		}
		firstDate = firstDate.clearTime();
		lastDate.setHours(23);
		lastDate.setMinutes(59);
		lastDate.setSeconds(59);
		
		return [firstDate, lastDate];
	},
	
	weekGroupString: function(rec) {
		var date = rec.get("actDtlStime");
		return date.format("l");
	},
	
	dayGroupString: function(rec) {
		var date = rec.get("actDtlStime");
		return date.format("g a");
	},
	
	findSunday: function(date) {
		var sunday = date.clone();
		var day = sunday.getDay();
		var date = sunday.getDate();
		sunday.setDate(date-day);
		return sunday;
	}
});

Ext.reg("moqold.calendar", mOQOLD.Calendar);