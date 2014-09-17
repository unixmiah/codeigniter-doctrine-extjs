Ext.ns("mOQOLD");

mOQOLD.IncidentList = Ext.extend(Ext.Panel, {
	layout: "card",
	cardSwitchAnimation: "slide",
	
	initComponent: function() {
		mOQOLD.IncidentList.superclass.initComponent.call(this);
		
		this.on("activate", this.buildItems, this);
		this.on("deactivate", this.destroyItems, this);
	},
	
	destroyItems: function() {
		mOQOLD.Main.removeAllRecords(mOQOLD.stores.IncidentList);
		this.destroy();
	},
	
	makeMenu: function() {
		var html =  "<div style='-webkit-column-count: 1;'>";
			html += "	<div id='new-incident' class='month-menu-item'>Add New<br>Incident</div>";
			html += "</div>";
		return {
			xtype: "component",
			html: html
		};
	},
	
	loadModule: function(name) {
		switch(name) {
			case "new-incident" :
				var cmp = this.add({ xtype: "moqold.incidentdetail", newIncident: true });
				this.doLayout();
				this.setActiveItem(cmp);
				break;
		}
	},
	
	buildItems: function() {
		var items = [{
			xtype: "container",
			layout: "fit",
			items: [this.buildList()]
		}];
		
		this.add(items);
		this.doLayout();
	},
	
	buildList: function() {
		if (mOQOLD.checkOnline()) {
			var store = mOQOLD.stores.IncidentList;
			store.load();
		} else {
			var store = mOQOLD.stores.IncidentListOffline;
		}
		return {
			xtype: "list",
			store: store,
			itemSelector : "div.entry",
			singleSelect : true,
			overItemCls : "x-view-over",
			emptyText : "No Incident Entries",
			scroll: "vertical",
			autoHeight: true,
			itemTpl: new Ext.XTemplate(
				'<tpl for=".">',
					'<div class="entry">',
						'<div>{clientFirstName} {clientLastName} {IncidentActivityName} {incidentSplitDate:date("Y-m-d")} {incidentSplitTime}</div>',
					'</div>',
				'</tpl>'
			),
			listeners: {
				scope: this,
				itemtap: this.onIncidentTap
			}
		};
	},
	
	onIncidentTap: function(list, index) {
		var store = list.getStore();
		var rec = store.getAt(index);
		
		var cmp = this.add({ xtype: "moqold.incidentdetail", rec: rec });
		this.doLayout();
		this.setActiveItem(cmp);
	}
});

Ext.reg("moqold.incidentlist", mOQOLD.IncidentList);