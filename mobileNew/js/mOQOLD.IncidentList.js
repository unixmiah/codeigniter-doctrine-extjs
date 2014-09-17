Ext.ns("mOQOLD");

mOQOLD.IncidentList = Ext.extend(Ext.Panel, {
	layout: "fit",
	initComponent: function () {
		this.items = [this.buildList()];
		this.dockedItems = [
			{
				xtype: 'toolbar',
				ui: 'light',
				dock: 'top',
				title: "Incident List",
				defaults: {
					iconMask: true
				},
				items: [
					{ xtype: 'moqold.back-button', targetCard: 'mainmenu' },
					{
						xtype: 'spacer'
					},
					{
						scope: this,
						handler: this.onAddIncident,
						iconCls: 'add',ui: 'plain'
					}
				]
			}
        ];
		mOQOLD.IncidentList.superclass.initComponent.call(this);
		this.on('activate', this.bindStore, this);
	},
	onAddIncident: function () {
		mOQOLD.Usability.update("Incident: Add clicked");
		mOQOLD.Main.flipPage({ targetCard: 'incidentdetail' }, { rec: null });
	},
	bindStore: function () {
		this.removeAll();
		this.add(this.buildList());
		this.doLayout();
	},

	buildList: function () {
		var store = mOQOLD.getStore('IncidentListOffline');
		store.sort();
		if (mOQOLD.checkOnline()) {
			store.load();
		}
		return {
			xtype: "dataview",
			singleSelect: true,
			store: store,
			emptyText: "No Incident Entries",
			scroll: "vertical",
			autoHeight: true,
			grouped: false,
			itemSelector: "tr.x-list-item",
			tpl: new Ext.XTemplate(
				'<table class="m-incidentList">',
					'<col width="110">',
					'<col width="110">',
					'<col />',
					'<tpl for=".">',
						'<tr class="x-list-item">',
							'<td>{incidentTime:date(mOQOLD.MediumDateTimeFormat)}</td>',
							'<td>{[mOQOLD.getClientName(values.clientID)]}</td>',
							'<td>{[mOQOLD.getIncidentActivityName(values.incidentActivityID)]}</td>',
						'</tr>',
					'</tpl>',
				'</table>'),
			listeners: {
				scope: this,
				itemtap: this.onIncidentTap
			}
		};
	},

	onIncidentTap: function (list, index) {
		mOQOLD.Usability.update("Incident: Existing record clicked");
		var store = list.getStore();
		var rec = store.getAt(index);
		mOQOLD.Main.flipPage({ targetCard: 'incidentdetail' }, { rec: rec });
	}
});

Ext.reg("moqold.incidentlist", mOQOLD.IncidentList);