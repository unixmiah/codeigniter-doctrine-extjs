Ext.ns("mOQOLD");

mOQOLD.MonthCalendar = Ext.extend(Ext.Panel, {
	layout: 'fit',
	scroll: 'vertical',
	initComponent: function () {
		var monthCalendar = new Ext.ux.Calendar({
			dock: 'top',
			xtype: 'ux.calendar',
			store: this.store,
			date: this.date,
			value: this.date,
			formatDay: this.monthFormatDay,
			listeners: {
				'navigate': this.onNavigate,
				'tap': this.onCalendarItemTap,
				scope: this
			},
			height: 230
		});
		this.dockedItems = [monthCalendar];
		this.store.on('datachanged', this.calcDaysWithEventsOnStoreChange, this);

		this.startDate = monthCalendar.startDate;
		this.endDate = monthCalendar.endDate;

		this.items = [
            {
            	xtype: 'list',
            	store: this.store,
            	itemSelector: "div.entry",
            	singleSelect: true,
            	grouped: false,
            	overItemCls: "x-view-over",
            	emptyText: "No Time Entries",
            	itemTpl: new Ext.XTemplate(
                    '<tpl for=".">',
                    '<div class="entry">',
                    '<div>{actDtlStime:date("g:ia")} - {actDtlEtime:date("g:ia")} {[mOQOLD.getActivityName(values.activityID)]}{[mOQOLD.hasObservationRecords(values.ID)]}</div>',
                    '</div>',
                    '</tpl>'
                ),
            	listeners: {
            		itemtap: this.onListItemTap,
            		scope: this
            	}
            }
        ];

		mOQOLD.MonthCalendar.superclass.initComponent.call(this);
		this.addEvents({
			navigate: true,
			itemTap: true,
			datechange: true
		});

	},
	autoDestroy: function () {
		this.ownerCt.remove(this);
		this.destroy();
	},
	monthFormatDay: function (o) {
		var start = o.date.clearTime().format("U");
		if (this.datesWithEvents) {
			o.hasEvent = this.datesWithEvents[String(start)] === true;
		}
	},

	isForcedRefresh: false,

	onNavigate: function (view, options) {
		if (this.isForcedRefresh) {
			return;
		}
		mOQOLD.Usability.update("Activity: Navigation in calendar");

		this.calcDaysWithEvents();
		var store = mOQOLD.stores["ActivityListOffline"];
		var values = Ext.apply({}, options);
		this.startDate = view.value;
		this.endDate = view.value;
		this.date = view.value;

		options.start = view.value;
		options.end = view.value.add(Date.DAY, 1).add(Date.SECOND, -1);
		options.store = this.store;
		this.fireEvent('datechange', this);
		this.fireEvent('navigate', view, options);
	},

	calcDaysWithEventsOnStoreChange: function () {
		this.calcDaysWithEvents({ refresh: true });
	},

	calcDaysWithEvents: function (options) {
		
		if (!options) {
			options = {};
		}
		var datesWithEvents = {};
		var store = mOQOLD.stores["ActivityListOffline"];
		store.suspendEvents();
		store.clearFilter();
		for (var i = 0, count = store.getCount(); i < count; i++) {
			var rec = store.getAt(i);
			var startDate = rec.get("actDtlStime").clone().clearTime().format("U");
			datesWithEvents[String(startDate)] = true;
		}
		store.resumeEvents();

		var view = this.getDockedComponent(0);
		if (view && options.refresh && view.rendered) {
			this.isForcedRefresh = true;
			view.datesWithEvents = datesWithEvents;
			view.update();
			this.isForcedRefresh = false;
		}
		  
		if (mOQOLD.enableMask) {
			if (view && view.Mask) {
				view.Mask.hide();
				delete view.Mask;
			}
		}
	},

	onCalendarItemTap: function (options) {
		if (options.date) {
			mOQOLD.Usability.update("Activity: Clicked on date");
			this.getDockedComponent(0).setValue(options.date);
			this.date = options.date;
			mOQOLD.currentSelectDate = options.date;
			this.fireEvent('datechange', this);
		}
	},

	onListItemTap: function (dv, index) {
		mOQOLD.Usability.update("Activity: Clicked on activity");
		var store = dv.store;
		var rec = store.getAt(index);
		this.fireEvent('itemTap', this, { record: rec });
	},

	setValue: function (val) {
		this.getDockedComponent(0).setValue(val);
	}
});

Ext.reg("moqold.monthcalendar", mOQOLD.MonthCalendar);