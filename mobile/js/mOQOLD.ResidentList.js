Ext.ns("mOQOLD");

mOQOLD.ResidentList = Ext.extend(Ext.Panel, {
	
	initComponent: function() {
		mOQOLD.ResidentList.superclass.initComponent.call(this);
		
		this.on("activate", this.buildItems, this);
		this.on("deactivate", this.destroyItems, this);
	},
	
	destroyItems: function() {
		this.destroy();
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
		var store = mOQOLD.stores.ResidentList;
		store.load();
		return {
			xtype: "list",
			store: store,
			itemSelector : "div.entry",
			singleSelect : true,
			grouped: true,
			autoHeight: true,
			overItemCls : "x-view-over",
			emptyText : "No Observation Entries",
			scroll: "vertical",
			itemTpl: new Ext.XTemplate(
				'<tpl for=".">',
					'<div class="entry">',
						'<div>{firstName} {lastName}</div>',
					'</div>',
				'</tpl>'
			),
			listeners: {
				scope: this,
				itemtap: this.onClientTap
			}
		};
	},
	
	onClientTap: function(list, index) {
		var store = list.getStore();
		var rec = store.getAt(index);
		
		var detail = { xtype: "moqold.residentdetail", rec: rec };
		var parent = this.ownerCt;
		var cmp = parent.add(detail);
		parent.doLayout();
		parent.setActiveItem(cmp);
	}
});

Ext.reg("moqold.residentlist", mOQOLD.ResidentList);