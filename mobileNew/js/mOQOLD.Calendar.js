Ext.ns("mOQOLD");

mOQOLD.Calendar = Ext.extend(Ext.Panel, {
	date: mOQOLD.currentSelectDate,
	layout: 'card',
	cardSwitchAnimation: "slide",
	isLoadNeeded: false,
	initComponent: function () {
		this.dockedItems = [
			{
				xtype: 'toolbar',
				ui: 'light',
				dock: 'top',
				title: "Activities",
				defaults: {
					iconMask: true
				},
				items: [
					{ xtype: 'moqold.back-button', targetCard: 'mainmenu' },
					{ xtype: 'spacer' },
					{ scope: this, handler: this.onAddActivity, iconCls: 'add', ui: 'plain' }
				]
			}
        ];

		var calendarType;
		try {
			calendarType = mOQOLD.DefaultRec.get("calendarType");
		} catch (err) {
			calendarType = "monthly";
		}
		this.date = mOQOLD.currentSelectDate;
		this.calendarType = calendarType;
		this.on('beforerender', this.removeAll, this);
		this.on("beforecardswitch", this.handleBeforeCardSwitch, this);
		this.on('activate', this.onActivateNew, this);
		mOQOLD.Calendar.superclass.initComponent.call(this);
	},
	onStoreLoad: function () {
		if (mOQOLD.enableMask) {
			if (this.Mask) {
				this.Mask.hide();
				delete this.Mask;
			}
		}
		this.date = mOQOLD.currentSelectDate;
		this.activateCalendar();
		this.doLayout();
	},
	loadStores: function (date) {

		if (this.isLoadNeeded || date) {
			this.isLoadNeeded = false;
			if (date) {
				mOQOLD.getStore('ObservationList').load({ params: { dateNeeded: date }, callback: this.onStoreLoadSuccess, scope: this });
				mOQOLD.getStore('ActivityList').load({ params: { dateNeeded: date }, callback: this.onStoreLoadSuccess, scope: this });
			} else {
				mOQOLD.getStore('ObservationList').load({ params: { dateNeeded: date} });
				mOQOLD.getStore('ActivityList').load({ params: { dateNeeded: date} });
			}
		}


	},

	onStoreLoadSuccess: function (data, operation, success) {
		this.isStoreLoadSuccess = success;
		if (success) { this.filterStore(); mOQOLD.DateRange.resetRange(this.start); }
		else {
			mOQOLD.FixedMsgBox.show({
				title: 'Error!',
				msg: "No WIFI!! Cannot download new records!!\n try again with WIFI.",
				width: 300,
				buttons: Ext.MessageBox.OK,
				fn: function (btn, text) {
					if (btn == 'ok') {
						//do nothing now may be used in future to re-try attempts
					}
				},
				scope: this
			});
		}
	},

	onActivateNew: function () {
		if (mOQOLD.enableMask) {
			this.Mask = new Ext.LoadMask(Ext.getBody(), {
				msg: "Loading..."
			});
			this.Mask.show();
		}
		this.removeAll();
		//Always set the local store as default store.
		this.store = mOQOLD.stores["ActivityListOffline"];
		this.onStoreLoad();
		//in background load the store with latest data


	},

	isFirst: true,

	activateCalendar: function () {
		if (this.isFirst) {
			this.monthCalendarStore = new Ext.data.Store(
					{
						model: this.store.model,
						storeID: 'monthCalendarStore',
						sorters: [{ property: "actDtlStime", direction: "ASC"}],
						groupField: 'actDtlStime',
						getGroupString: function (rec) {
							var date = rec.get("actDtlStime");
							return date.format("H");
						}
					});

			this.dayCalendarStore = new Ext.data.JsonStore(
			{
				model: this.store.model,
				storeID: 'dayCalendarStore',
				sorters: [{ property: "actDtlStime", direction: "ASC"}],
				groupField: 'actDtlStime',
				getGroupString: function (rec) {
					var date = rec.get("actDtlStime");
					return date.format("H");
				}
			});
			this.isFirst = false;
		}

		mOQOLD.stores[this.dayCalendarStore.storeID] = this.dayCalendarStore;
		mOQOLD.stores[this.monthCalendarStore.storeID] = this.monthCalendarStore;


		if (this.calendarType === "monthly") {
			this.add(Ext.ComponentMgr.create({
				xtype: 'moqold.monthcalendar',
				store: this.monthCalendarStore,
				date: this.date,
				itemId: 'monthView',
				listeners: {
					'navigate': this.onNavigate,
					'itemTap': this.onItemTap,
					'datechange': this.onDateChange,
					scope: this
				}
			}));
		} else {
			this.add(Ext.ComponentMgr.create({
				xtype: 'moqold.daycalendar',
				store: this.dayCalendarStore,
				date: this.date,
				itemId: 'dayView',
				listeners: {
					'navigate': this.onNavigate,
					'itemTap': this.onItemTap,
					'datechange': this.onDateChange,
					scope: this
				}
			}));
		}
	},

	onDateChange: function (view) {
		this.date = view.date;
	},

	handleBeforeCardSwitch: function (panel, newCard) {
		this.start = newCard.startDate;
		this.end = newCard.endDate;
		this.tempStore = newCard.store;
		this.filterStore();
	},

	onAddActivity: function () {
		mOQOLD.Usability.update("Activity: Add clicked");
		mOQOLD.Main.flipPage({ targetCard: 'activityform' }, { rec: null, defaultData: { startDate: this.getActiveItem().value || this.getActiveItem().date} });
	},

	switchView: function () {
		this.removeAll();
		this.calendarType = this.calendarType === "monthly" ? "daily" : "monthly";
		this.date = mOQOLD.currentSelectDate;
		this.activateCalendar();
		this.setActiveItem(0);
		this.doLayout();
	},

	onNavigate: function (view, options) {
		this.start = options.start;
		this.end = options.end;
		this.tempStore = options.store;
		this.isStoreLoadSuccess = false;
		if (mOQOLD.DateRange.isDateInRange(this.start) === false) {
			if (navigator.onLine) {
				this.loadStores(this.start);
					if (mOQOLD.enableMask) {
						view.Mask = new Ext.LoadMask(Ext.getBody(), {
							msg: "Loading..."
						});
						view.Mask.show();
				}
			} else {

				mOQOLD.FixedMsgBox.show({
					title: 'Error!',
					msg: "No WIFI!! Cannot download new records!!\n try again with WIFI.",
					width: 300,
					buttons: Ext.MessageBox.OK,
					fn: function (btn, text) {
						if (btn == 'ok') {
							//do nothing now
						}
					},
					scope: this
				});
				return;
			}
		} else {
			this.filterStore();
		}
	},
	filterStore: function () {
		var records = [];
		var start = this.start.format("U");
		var end = this.end.format("U");
		this.store.each(function (rec) {
			var startDate = rec.get("actDtlStime").format("U");
			var endDate = rec.get("actDtlEtime").format("U");
			var present = startDate <= end && endDate >= start;
			if (present) {
				records.push(rec.copy());
			}
		});
		this.tempStore.loadRecords(records);

	},

	onItemTap: function (view, options) {
		var record = options.record;
		mOQOLD.Main.flipPage({ targetCard: 'activityform' }, { rec: record });
	}

});

Ext.reg("moqold.calendar", mOQOLD.Calendar);
