Ext.ns("mOQOLD");

mOQOLD.DayCalendar = Ext.extend(Ext.Panel, {
	layout: 'fit',

	date: mOQOLD.currentSelectDate.clearTime(),

	initComponent: function () {
		this.dockedItems = [
			{
				xtype: "toolbar",
				dock: "top",
				ui: "light",
				title: this.getDocTitle(),
				items: [
					{ text: "Previous", ui: "back", scope: this, handler: this.navigateCalendar, navigationFactor: -1 },
					{ xtype: "spacer" },
					{ text: "Forward", ui: "forward", scope: this, handler: this.navigateCalendar, navigationFactor: 1 }
				]
			}
        ];


		this.buildItems();

		mOQOLD.DayCalendar.superclass.initComponent.call(this);

		this.addEvents({
			navigate: true,
			itemTap: true,
			datechange: true
		});

		this.on('activate', this.navigateCalendar, this);
		this.store.on('datachanged', this.closeMask, this);
		//this.on('deactivate', this.autoDestroy, this);
	},
	closeMask: function(){
		
		if (mOQOLD.enableMask) {
			if (this && this.Mask) {
				this.Mask.hide();
				delete this.Mask;
			}
		}
	},
	navigateCalendar: function (button) {
		var startDate, endDate;

		var navigationFactor = button.navigationFactor || 0;
		this.date = this.date.add(Date.DAY, navigationFactor);

		startDate = this.date.clone().clearTime();

		endDate = startDate.clone().add(Date.DAY, 1).add(Date.SECOND, -1);

		this.startDate = startDate;
		this.endDate = endDate;

		this.fireEvent('navigate', this, { start: startDate, end: endDate, store: this.store });
		this.fireEvent('datechange', this);

		if (this.rendered) {
			var dock = this.getDockedComponent(0);
			dock.setTitle(this.getDocTitle());
					
		}
		mOQOLD.currentSelectDate = this.endDate;
	},

	getDocTitle: function () {
		return this.date.format((Ext.is.Phone || Ext.is.iPod) ? "M j" : "F j");
	},

	buildItems: function () {
		var store = this.store;
		this.navigateCalendar({ navigationFactor: 0 });

		//store.getGroupString = this.dayGroupString;

		var config = {
			xtype: 'list',
			store: store,
			//itemSelector: "div.entry",
			singleSelect: true,
			grouped: true,
			loadingText: null,
			overItemCls: "x-view-over",
			emptyText: "No Time Entries",
			groupTpl: [
						'<tpl for=".">',
						'<div class="x-list-group x-group-{id}">',
						'<h3 class="x-list-header">{[Number(values.group) >= 12 ? Number(values.group) == 12 ?( values.group + " PM")  : (values.group-12) + " PM" :Number(values.group) == 0 ? "12 AM" : (values.group + " AM")]}</h3>',
						'<div class="x-list-group-items">',
						'{items}',
						'</div>',
						'</div>',
						'</tpl>'
					],
			itemTpl: '{actDtlStime:date("g:ia")} - {actDtlEtime:date("g:ia")} {[mOQOLD.getActivityName(values.activityID)]}{[mOQOLD.hasObservationRecords(values.ID)]}',
			listeners: {
				itemtap: this.onItemTap,
				scope: this
			}
		};
		this.items = [config];
	},
	onItemTap: function (dv, index) {
		var store = dv.store;
		var rec = store.getAt(index);
		this.fireEvent('itemTap', this, { record: rec });
	},

	weekGroupString: function (rec) {
		var date = rec.get("actDtlStime");
		return date.format("l");
	},

	dayGroupString: function (rec) {
		var date = rec.get("actDtlStime");
		return date.format("H");
	}
});

Ext.reg("moqold.daycalendar", mOQOLD.DayCalendar);