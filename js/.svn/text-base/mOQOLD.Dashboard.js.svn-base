Ext.ns("mOQOLD");

mOQOLD.DashboardCnt = Ext.extend(Ext.Container, {
	height: 500,
	columnWidth: 1,
	layout: "anchor",
	
	initComponent: function() {
		this.items = this.makeCombo();
		mOQOLD.DashboardCnt.superclass.initComponent.call(this);
	},
	
	makeCombo: function() {
		return {
			xtype: "combo",
			mode: "local",
			displayField: "text",
			valueField: "link",
			emptyText: "Select Report to View",
			anchor: "50%",
			typeAhead: true,
			triggerAction: "all",
			lazyRender: true,
			store: new Ext.data.DirectStore({
				storeId: "ReportsStore",
				autoLoad: true,
				idProperty: "ID",
				root: "items",
				totalProperty: "total",
				fields: [
					{ name: "text", type: "string" },
					{ name: "link", type: "string" }
				],
				proxy: new Ext.data.DirectProxy({
					api:  {
						read: Ext.app["ReportsAPI"].listAll
					}
				})
			}),
			listeners: {
				scope: this,
				select: this.onLinkSelect
			}
		};
	},
	
	onLinkSelect: function(combo, rec, index) {
		var link = rec.get("link");
		
		var cmp = this.getComponent(1);
		if (typeof cmp !== "undefined") {
			this.remove(cmp);
		}
		
		this.add({
			xtype: "container",
			anchor: "100% 100%",
			html: "<iframe src='"+link+"' style='width:100%;height:97%;border:0px;'></iframe>"
		});
		this.doLayout();
	}
});

Ext.reg("moqold.dashboard", mOQOLD.DashboardCnt);