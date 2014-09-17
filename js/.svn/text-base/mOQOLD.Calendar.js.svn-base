Ext.ns("mOQOLD");

mOQOLD.CalendarBase = Ext.extend(mOQOLD.MaintenanceGridAbstract, {
	title: "Calendar",
	baseAPI: "CalendarAPI",
	observations: false,

	activateModule: function (info) {
		return this.createPanel();
	},

	showDetail: function (id, dateFromClick, rec) {
		//This condition will be true only if we click from month view.
		if (dateFromClick) {
			dateFromClick = ((dateFromClick.format("G") <= 0)) ? dateFromClick.add(Date.HOUR, 7) : dateFromClick;
		}
		this.needRefresh = false;
		var actDetail = mOQOLD.ActivityDetail;
		actDetail.isFromCalendar = true;
		actDetail.NewEvent = id === 0;
		actDetail.Observations = this.observations;
		actDetail.isRecurEnabled = true;
		if (dateFromClick) { actDetail.clickedDate = dateFromClick; }
		actDetail.id = id;
		if (rec) {
			actDetail.activityIDValue = rec.get('CalendarId');
		} else {
			actDetail.activityIDValue = undefined;
		}
		panel = actDetail.createPanel({ id: id });
		actDetail.on('save', this.onSave, this);

		var win = new Ext.Window({
			height: this.observations ? 500 : 300,
			width: 700,
			layout: 'fit',
			modal: true,
			title: 'Details',
			items: [panel],
			listeners: {
				close: this.onDetailClose,
				scope: this
			}
		});
		this.detailWin = win;
		win.show();
	},

	onSave: function () {
		this.needRefresh = true;
		this.detailWin.close();
	},

	onDetailClose: function () {
		this.detailWin = null;
		mOQOLD.ActivityDetail.un('save', this.onSave, this);
		if (this.needRefresh) {
			this.refresh();
		}
	},

	createCalendarStore: function (C) {
		var calendarStore = new Ext.data.DirectStore({
			storeId: "calendarStore",
			autoLoad: false,
			reader: new Ext.data.JsonReader({
				fields: Ext.ensible.cal.CalendarRecord.prototype.fields.getRange(),
				idProperty: 'ID',
				root: 'items'
			}),
			proxy: new Ext.data.DirectProxy({
				api: {
					read: Ext.app["CalendarAPI"].getCal
				}
			}),
			listeners: {
				scope: this//,
				//beforeload: function () {
				//this.msgBox = Ext.Msg.wait("Loading calendar information", "Loading...");
				//}
			}
		});
		calendarStore.load();
		return calendarStore;
	},

	createEventStore: function (C) {
		var eventStore = new Ext.data.DirectStore({
			storeId: "eventStore",
			autoLoad: false,
			reader: new Ext.data.JsonReader({
				fields: C.EventRecord.prototype.fields.getRange(),
				idProperty: 'id',
				root: 'items'
			}),
			proxy: new Ext.data.DirectProxy({
				api: {
					read: Ext.app["CalendarAPI"].getEvent
				}

			}),
			listeners: {
				scope: this,
				beforeload: function () {
					//if (!this.msgBox) {
					//this.msgBox = Ext.Msg.wait("Loading Event information", "Loading...");
					//}
				}
			}
		});

		eventStore.load(Ext.apply({}, { params: { observationID: 10} }));
		return eventStore;
	},

	getCalendarType: function (view) {
		var xtype = view.xtype;
		var split = xtype.split(".");
		var viewType = split[1];

		var viewToPage = {
			weekview: "weekCalendar",
			dayview: "dayCalendar",
			multiweekview: "weekCalendar",
			monthview: "monthCalendar"
		};

		return viewToPage[viewType];
	},

	refresh: function () {
		if (this.calendar) {
			this.calendar.store.reload();
		}
	},

	createForm: function () {
		var C = Ext.ensible.cal;
		var calendarStore = this.createCalendarStore(C);
		this.eventStore = this.createEventStore(C);

		var viewToPage = {
			weekview: "weekCalendar",
			dayview: "dayCalendar",
			multiweekview: "weekCalendar",
			monthview: "monthCalendar"
		};

		var nodeDropInterceptor = function (n, dd, e, data) {
			if (n && data) {
				if (data.type == 'griddrag') {
					//calendarStore
					var rec = new Ext.ensible.cal.EventRecord(),
					M = Ext.ensible.cal.EventMappings;

					// fields passed from the grid's record
					var gridData = data.selections[0].data;
					rec.data[M.Title.name] = gridData.activityName;
					rec.data[M.CalendarId.name] = gridData.ID;

					// provide whatever default date range logic might apply here:
					rec.data[M.StartDate.name] = n.date;
					rec.data[M.EndDate.name] = n.date.add(Date.MINUTE, 30);
					rec.data[M.IsAllDay.name] = false;

					// save the evrnt and clean up the view
					this.view.onEventDrop(rec, n.date);
					this.onCalendarDragComplete();
					return true;
				}
			}
		};

		var applyInterceptors = function (view) {
			if (view.dropZone) {
				view.dropZone.onNodeDrop = view.dropZone.onNodeDrop.createInterceptor(nodeDropInterceptor);
			}
		};

		//bug report for top header not showing on day/week view in firefox
		//http://ext.ensible.com/forum/viewtopic.php?f=3&t=16&p=80&hilit=firefox#p80
		var calendar = new C.CalendarPanel({
			eventStore: this.eventStore,
			calendarStore: calendarStore,
			enableDD: true,
			title: this.title,
			region: "center",
			frame: true,
			editModal: true,
			showNavJump: false,
			enableRecurrence: true,
			activeItem: 1,
			autoScroll: false,
			initEventRelay: function (cfg) {
				cfg.listeners = cfg.listeners || {};
				cfg.listeners.afterrender = {
					fn: function (c) {
						// relay view events so that app code only has to handle them in one place.
						// these events require no special handling by the calendar panel 
						this.relayEvents(c, ['eventsrendered', 'eventclick', 'dayclick', 'eventover', 'eventout', 'beforedatechange',
						'datechange', 'rangeselect', 'beforeeventmove', 'eventmove', 'initdrag', 'dayover', 'dayout', 'beforeeventresize',
						'eventresize', 'eventadd', 'eventupdate', 'beforeeventdelete', 'eventdelete', 'eventcancel']);

						c.on('editdetails', this.onEditDetails, this);
						applyInterceptors.defer(200, c, [c]);
					},
					scope: this,
					single: true
				}
			},
			viewConfig: {
				enableContextMenus: false,
				ddGroup: 'calDD',
				onEventDrop: function (rec, dt) {
					if (rec.phantom) {
						if (mOQOLD.Calendar.calendar) {
							mOQOLD.Calendar.showDetail(0, dt, rec);
						} else {
							mOQOLD.Observations.showDetail(0, dt, rec);
						}
					}
					else {
						this.moveEvent(rec, dt);
					}
				}
			},
			showMultiWeekView: false,
			weekViewCfg: {
				viewStartHour: 7,
				viewEndHour: 20//,hourHeight: 126

			},
			dayViewCfg: {
				viewStartHour: 7,
				viewEndHour: 20//,hourHeight: 126
			},

			listeners: {
				scope: this,
				eventclick: this.onEventClick,
				beforedatechange: this.onDateChange,
				dayclick: this.goToDetail,
				rangeselect: function (cal, dates, el, callback) {
					if (typeof callback === 'function') {
						callback();
					}
					return false;
				},
				beforeeventmove: function (cal, rec, dates) {
					return false;
				},
				eventover: function (cal, dates, el, rec) {
					var popContent = dates.data.StartDate.format("g:ia") + ' ' + dates.data.Title; // +' hosted by ' + dates.data.Notes + ' in ' + dates.data.Location;
					new Ext.ToolTip({
						target: el.id,
						html: popContent,
						trackMouse: true,
						anchorOffset: 55
					});
				}

			}
		});
		calendar.topToolbar.add({ id: 'cal-tb-print', text: 'Print', handler: this.printCal, scope: this, icon: './images/printer.png' });
		this.calendar = calendar;
		var calendarListPanel = {
			xtype: 'moqold.activityList',
			region: "east",
			split: true,
			collapsed: false,
			collapseMode: false,
			width: 175
		};



		var ct = {
			xtype: "container",
			layout: "border",
			height: 700,
			items: [calendar, calendarListPanel]
		};

		return ct;
	},
	onDateChange: function (cal, stDate, newStDate, viewStData, viewEndDtate) {
	},
	printCal: function () {
		var html = this.getPrintableCalendar();
		var printWin = window.open('Printable calendar', 'printing');
		printWin.document.write(html);
		printWin.document.close();
		//Ext.ux.Printer.print(this.calendar);
	},
	onEventClick: function (cal, rec, el) {
		var id = rec.get("EventId");
		rec.set("ID", id);
		this.showDetail(id);
		return false;
	},
	getPrintableCalendar: function () {
		cal = this.calendar;
		var html = "";
		var title = cal.title;
		var curView = cal.getActiveView();
		var viewTitle = curView.title;
		var startDate = (curView.body) ? curView.body.viewStart : curView.viewStart;
		var endDate = (curView.body) ? curView.body.viewEnd : curView.viewEnd;
		var dayCount = curView.dayCount;

		//clone the store to use internally
		var calStore = new Ext.data.Store({
			recordType: cal.store.recordType
		});
		//calStore.add(cal.store.getRange());

		var records = [];
		var start = startDate.format("U");
		var end = endDate.format("U");

		cal.store.each(function (rec) {
			var filterStDate = rec.get("StartDate").format("U");
			var fileterEndDate = rec.get("EndDate").format("U");
			var present = filterStDate <= end && fileterEndDate >= start;
			if (present) {
				records.push(rec.copy());
			}
		});
		if (records.length > 0) {
			calStore.add(records);
		}

		if (viewTitle === 'Day') {
			html = html + "<table style='border-style: solid;border-width: 1px;'>";
			html = html + "<tr> <th style='width: 50px;border-style: solid;border-width: 1px;'>&nbsp;</th>";
			html = html + "<th style='width: 50px;border-style: solid;border-width: 1px;'>" + startDate.format("l, F j,Y") + "</th></tr>";
			for (var h = 7; h <= 20; h++) {
				var ampm = ((h / 12) >= 1) ? "PM" : "AM";
				var hour = (h > 12) ? (h - 12) : h;
				html = html + "<tr><th style='width: 50px;border-style: solid;border-width: 1px;'>" + hour + " " + ampm + "</th>";
				var isPrint = false;
				var msg = "";
				calStore.each(function (rec) {
					//check if the date matchs
					var stDate = rec.get("StartDate").format("g A");
					if (stDate == (hour + " " + ampm)) {
						if (rec.get("StartDate").format("D M Y") === startDate.format("D M Y")) {
							msg = msg + rec.get("StartDate").format("g:i A") + "<br>" + rec.get("Title") + "<br>";
							isPrint = true;
						}
					}

				});
				if (isPrint === false) { html = html + "<td style='width: 150px;border-style: solid;border-width: 1px;'> No Events </td>"; } else {
					html = html + "<td style='width: 150px;border-style: solid;border-width: 1px;background-color: #00FF00;'>" + msg + " </td>"
				}
				html = html + "</tr>";
			}
			html = html + "</table><br>";
		}

		if (viewTitle === 'Week') {
			//html = html + "<h1> Current view :" + curView.title + " view calendar </h1><br>";
			html = html + "<table style='border-style: solid;border-width: 1px;'>";
			html = html + "<tr> <th style='width: 50px;border-style: solid;border-width: 1px;'>&nbsp;</th>";
			for (var x = 0; x < dayCount; x++) {
				html = html + "<th style='width: 50px;border-style: solid;border-width: 1px;'>" + startDate.add(Date.DAY, x).format("M d, Y") + "</th>";
			}
			html = html + "</tr>";
			for (var h = 7; h <= 20; h++) {
				var ampm = ((h / 12) >= 1) ? "PM" : "AM";
				var hour = (h > 12) ? (h - 12) : h;
				html = html + "<tr><th style='width: 50px;border-style: solid;border-width: 1px;'>" + hour + " " + ampm + "</th>";
				for (var x = 0; x < dayCount; x++) {
					var isPrint = false;
					var msg = "";
					calStore.each(function (rec) {
						//check if the date matchs
						var stDate = rec.get("StartDate").format("g A");
						if (stDate == (hour + " " + ampm)) {
							if (rec.get("StartDate").format("D M Y") === startDate.add(Date.DAY, x).format("D M Y")) {
								msg = msg + rec.get("StartDate").format("g:i A") + "<br>" + rec.get("Title") + "<br>";
								isPrint = true;
							}
						}

					});
					if (isPrint === false) { html = html + "<td style='width: 150px;border-style: solid;border-width: 1px;'>&nbsp; </td>"; } else {
						html = html + "<td style='width: 150px;border-style: solid;border-width: 1px;'>" + msg + " </td>"
					}

				}
				html = html + "</tr>";
			}

			html = html + "</table><br>";

		}

		if (viewTitle === "Month") {
			//calculate the current month details.
			var monthSt = startDate.format("n");
			var monthEn = endDate.format("n");
			var currMonth = ((monthEn - monthSt) > 0) ? (monthSt + 1) : monthSt;
			html = html + "<table style='cellpadding:0; cellspacing:0;width: 100%'>";
			var dayCount = 0;
			calStore.sort([{ field: 'StartDate', direction: 'ASC'}]);

			for (var week = 0; week < 7; week++) {
				html = html + "<tr>";
				for (var days = 0; days < 7; days++) {
					var date4Print = startDate.add(Date.DAY, dayCount).format("l, F j,Y");
					var msg = "<font color='red'>" + date4Print + "</font><br>";
					calStore.each(function (rec) {
						//check if the date matchs
						if (rec.get("StartDate").format("D M Y") === startDate.add(Date.DAY, dayCount).format("D M Y")) {
							msg = msg + rec.get("StartDate").format("g:i A") + "<br>" + rec.get("Title") + "<br><hr>";
						}
					});
					html = html + "<td valign='top' style='height: 100px;border-style: solid;border-width: 1px;'>" + msg + "</td>";
					dayCount++;
				}

				html = html + "</tr>";
				//dayCount++;
			}

			html = html + "</table>";
		}

		return html;
	},

	goToDetail: function (cal, dates, el, callback) {
		//When click on the blank to add activity
		if (callback === null) {
			id = 0;
			this.showDetail(id, dates);
		} else {
			// for multiweek and month, callback will not be null and will have values.
			if (callback.id) {
				id = 0;
				this.showDetail(id, dates);
			}
		}

		if (typeof callback === "function") {
			callback();
		}

		if (this.observations === true) {
			return false;
		}


		return false;
	}
});

mOQOLD.Calendar = new mOQOLD.CalendarBase({
	title: "Calendar",
	baseAPI: "CalendarAPI",
	observations: false
});

mOQOLD.Observations = new mOQOLD.CalendarBase({
	title: "Observations",
	baseAPI: "CalendarAPI",
	observations: true
});