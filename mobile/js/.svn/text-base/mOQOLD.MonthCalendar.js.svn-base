Ext.ns("mOQOLD");

mOQOLD.MonthCalendar = Ext.extend(Ext.Panel, {
	scroll: "vertical",
	bodyTpl: new Ext.XTemplate(
		'<tpl for=".">',
			'<div>{rows}</div>',
		'</tpl>'
	),
	rowTpl: new Ext.XTemplate(
		'<tpl for=".">',
			'<div class="calendar-row" style="-webkit-column-count: 7;border-bottom: 1px solid #000;-webkit-column-gap: 1px;-webkit-column-rule: 1px solid #000;">{cells}</div>',
		'</tpl>'
	),
	cellTpl: new Ext.XTemplate(
		'<tpl for=".">',
			'<div class="{cls}" day="{text}" style="height:{height}px;{style}" hasEvent="false">{text}</div>',
		'</tpl>'
	),
	layout: "card",
	
	initComponent: function() {
		mOQOLD.MonthCalendar.superclass.initComponent.call(this);
		
		this.on("afterrender", this.changeTopDock, this);
		this.on("afterrender", this.initEvent, this);
		this.on("afterrender", this.buildDays, this);
	},
	
	initEvent: function() {
		this.mon(this.body, {
			scope: this,
			tap: this.onTap
		});
	},
	
	onTap: function(e, t) {
		var el = Ext.fly(t);
		var day = el.getAttribute("day");
		var hasEvent = el.getAttribute("hasEvent");
		
		if (hasEvent === "true") {
			var date = this.date.clone();
			date.setDate(day);
			this.switchToDayView(date);
		}
	},
	
	switchToDayView: function(date) {
		var store = this.store;
		var firstDate = date.clearTime();
		var lastDate = date.clone();
		lastDate.setHours(23);
		lastDate.setMinutes(59);
		lastDate.setSeconds(59);
		
		var parent = this.ownerCt;
		
		store.getGroupString = parent.dayGroupString;
		
		var config = {
			xtype: "moqold.daycalendar",
			store: this.store,
			firstDate: firstDate,
			lastDate: lastDate
		};
		var calendar = parent.makeCalendar(config);
		
		store.load({
			params: {
				startDate: firstDate.format("Y-m-d H:i:s"),
				endDate: lastDate.format("Y-m-d H:i:s")
			}
		});
		
		var cmp = parent.add(calendar);
		parent.doLayout();
		parent.setActiveItem(cmp);
	},
	
	changeTopDock: function(date) {
		var parent = this.ownerCt;
		var dock = parent.getDockedComponent(0);
		if (Ext.isDate(date) === false) {
			var date = this.date;
		}
		date = date.format((Ext.is.Phone || Ext.is.iPod) ? "M" : "F");
		dock.setTitle(date);
	},
	
	buildDays: function(markEvent) {
		var bodyTpl = this.bodyTpl;
		var rowTpl = this.rowTpl;
		var cellTpl = this.cellTpl;
		var width = Math.floor(Ext.getBody().getWidth()/7);
		var height = width;
		var date = this.date;
		var firstDate = this.firstDate.getDay();
		var day = 1;
		var numDays = date.getDaysInMonth();
		var numRows = Math.ceil((firstDate+numDays)/7);
		var store = this.store;
		
		var cells = "";
		for (var i = 0; i < 7; i++) {
			cells += cellTpl.apply({ text: Date.getShortDayName(i), style: "text-align: center;" });
		}
		var rows = rowTpl.apply({ cells: cells });
		
		for (var i = 0; i < numRows; i++) {
			var cells = "";
			var x = 0;
			if (i === 0) {
				for (; x < firstDate; x++) {
					cells += cellTpl.apply({ text: "&nbsp;", style: "background-color: #ccc;", height: height, cls: "calendar-blank-day" });
				}
			}
			for (; x < 7; x++) {
				if (day > numDays) {
					cells += cellTpl.apply({ text: "&nbsp;", style: "background-color: #ccc;", height: height, cls: "calendar-blank-day" });
					continue;
				}
				cells += cellTpl.apply({ text: day, style: "text-align: center;", day: day, height: height, cls: "calendar-day" });
				day++;
			}
			
			rows += rowTpl.apply({ cells: cells });
		}
		
		var body = bodyTpl.apply({ rows: rows });
		this.update(body);
		if (markEvent !== false) {
			this.markEvent();
		}
	},
	
	goPrev: function() {
		var date = this.date;
		var month = date.getMonth();
		date = new Date(date.setMonth(month-1));
		this.date = date;
		
		var firstDate = date.getFirstDateOfMonth();
		var lastDate = date.getLastDateOfMonth();
		lastDate.setHours(23);
		lastDate.setMinutes(59);
		lastDate.setSeconds(59);
		
		var store = this.store;
		store.load({
			params: {
				startDate: firstDate.format("Y-m-d H:i:s"),
				endDate: lastDate.format("Y-m-d H:i:s")
			}
		});
		
		this.buildDays(false);
		
		this.changeTopDock(date);
		
		this.filterActivities(firstDate, lastDate);
	},
	
	goForward: function() {
		var date = this.date;
		var month = date.getMonth();
		date = new Date(date.setMonth(month+1));
		this.date = date;
		
		var firstDate = date.getFirstDateOfMonth();
		var lastDate = date.getLastDateOfMonth();
		lastDate.setHours(23);
		lastDate.setMinutes(59);
		lastDate.setSeconds(59);
		
		var store = this.store;
		store.load({
			params: {
				startDate: firstDate.format("Y-m-d H:i:s"),
				endDate: lastDate.format("Y-m-d H:i:s")
			}
		});
		
		this.buildDays(false);
		
		this.changeTopDock(date);
		
		this.filterActivities(firstDate, lastDate);
	},
	
	markEvent: function(store) {
		if (typeof store === "undefined") {
			store = this.store;
		}
		var el = this.body;
		var days = el.query("div.calendar-day");
		var numDays = days.length;
		var date = this.date;
		
		store.each(function(rec) {
			var recDate = rec.get("actDtlStime").format("j");
			var el = Ext.get(days[recDate-1]);
			var attr = el.getAttribute("hasEvent");
			if (attr !== "true") {
				el.update(el.getHTML()+"<div><b>*</b></div>");
				el.set({
					hasEvent: true
				});
			}
		}, this);
	},
	
	filterActivities: function(firstDate, lastDate) {
		this.store.clearFilter(true);
		this.store.filterBy(function(rec) {
			var startDate = rec.get("startDate").format("U");
			var endDate = rec.get("endDate").format("U");
			firstDate = firstDate.format("U");
			lastDate = lastDate.format("U");
			if (startDate >= firstDate && endDate <= lastDate) {
				return true;
			} else {
				return false;
			}
		});
		
		this.markEvent();
	}
});

Ext.reg("moqold.monthcalendar", mOQOLD.MonthCalendar);