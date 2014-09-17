Ext.ns("mOQOLD");

mOQOLD.ResidentList = Ext.extend(Ext.Panel, {
	layout: 'fit',

	initComponent: function () {
		this.dockedItems = [
            {
            	xtype: 'toolbar',
            	ui: 'light',
            	dock: 'top',
            	title: "Participants",
            	items: [{ xtype: 'moqold.back-button', targetCard: 'mainmenu'}]
            }
		];
		this.items = [this.buildList()];
		mOQOLD.ResidentList.superclass.initComponent.call(this);
		this.on('activate', this.onActivate, this);

	},
	onActivate: function () {
		var store = this.getStore();
		this.getComponent(0).bindStore(store);

	},

	getStore: function () {

		//The Store was empty so added try catch to make page work. ( TEMP )
		var curOption = 1;
		try {
			curOption = mOQOLD.DefaultRec.get("nameDisplay");  // mOQOLD.SiteSpecificRec.get('nameDisplay');
		} catch (Err) {
			curOption = 1;
		}
		var store = mOQOLD.getStore('ResidentList');
		store.getGroupString = curOption === 1 ? this.firstNameGroupString : this.lastNameGroupString;

		var sortData = [new Ext.util.Sorter({ property: 'firstName', direction: 'ASC', sorterFn: Ext.ux.util.CaseInsensitiveSorter }), new Ext.util.Sorter({ property: 'lastName', direction: 'ASC', sorterFn: Ext.ux.util.CaseInsensitiveSorter })];

		store.load();
		store.sort(curOption === 1 ? sortData : [sortData[1], sortData[0]]);
		return store;
	},

	goPrev: function () {
		mOQOLD.Main.flipPage({ targetCard: 'residentlist' });
	},

	buildList: function () {
		var store = this.getStore();
		return {
			xtype: "list",
			store: store,
			itemSelector: "div.entry",
			singleSelect: true,
			grouped: true,
			autoHeight: true,
			overItemCls: "x-view-over",
			emptyText: "No Resident Entries",
			scroll: "vertical",
			itemTpl: new Ext.XTemplate(
                '<tpl for=".">',
                '<div class="entry">',
                '<div>{[mOQOLD.getFormat(values.firstName,values.lastName)]}</div>',
                '</div>',
                '</tpl>'
            ),

			listeners: {
				scope: this,
				itemtap: this.onClientTap
			}
		};
	},

	onClientTap: function (list, index) {

		var store = list.getStore();
		var rec = store.getAt(index);

		var detail = { xtype: "moqold.participantdetail", rec: rec };
		var parent = this.ownerCt;
		var cmp = parent.add(detail);
		parent.setActiveItem(cmp);
		mOQOLD.Usability.update('Switched to: Participant Detail');
	},

	firstNameGroupString: function (rec) {
		return rec.get("firstName")[0].toUpperCase();
	},

	lastNameGroupString: function (rec) {
		return rec.get("lastName")[0].toUpperCase();
	}
});

Ext.reg("moqold.residentlist", mOQOLD.ResidentList);
