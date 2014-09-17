Ext.ns("mOQOLD");

mOQOLD.ObservationList = Ext.extend(Ext.Panel, {
	scroll: "vertical",
	layout: "fit",
	
	initComponent: function() {
		mOQOLD.ObservationList.superclass.initComponent.call(this);
		
		this.on("activate", this.buildItems, this, { single: true });
		this.on("deactivate", this.destroyItems, this);
	},
	
	destroyItems: function() {
		delete this.rec;
		this.destroy();
	},
	
	makeMenu: function() {
		var html =  "<div style='-webkit-column-count: 2;'>";
			html += "	<div id='add-observation' class='month-menu-item'>Add New<br>Observation</div>";
			html += "	<div id='back-form' class='month-menu-item'>Back to<br>Activity Form</div>";
			html += "</div>";
		return {
			xtype: "component",
			html: html
		};
	},
	
	loadModule: function(name) {
		switch (name) {
			case "add-observation" :
				var parent = this.ownerCt;
				var cmp = parent.add({ xtype: "moqold.observationdetail", activityRec: this.rec });
				parent.doLayout();
				parent.setActiveItem(cmp);
				return ;
				break
			case "back-form" :
				var parent = this.ownerCt;
				var cmp = parent.add({ xtype: "moqold.activityform", rec: this.rec, date: this.rec.get("startDate") });
				parent.doLayout();
				parent.setActiveItem(cmp, { type: "slide", reverse: true });
				return ;
				break;
		}
	},
	
	buildItems: function() {
		if (mOQOLD.checkOnline()) {
			var store = mOQOLD.stores.ObservationList;
		} else {
			var store = mOQOLD.stores.ObservationListOffline;
			store.filter("actDetailID", this.rec.get("ID"));
		}
		var items = {
			xtype: "list",
			store: store,
			itemSelector : "div.observation-entry",
			singleSelect : true,
			grouped : true,
			overItemCls : "x-view-over",
			emptyText : "No Observation Entries",
			scroll: "vertical",
			autoHeight: true,
			itemTpl: new Ext.XTemplate(
				'<tpl for=".">',
					'<div class="observation-entry">',
						'<div>{clientFirstName} {clientLastName}</div>',
					'</div>',
				'</tpl>'
			),
			listeners: {
				scope: this,
				itemtap: this.onEventTap
			}
		};
		
		this.add(items);
		this.doLayout();
		store.load({
			params: {
				activityID: this.rec.get("ID")
			}
		});
	},
	
	onEventTap: function(list, index, el, e) {
		var store = list.getStore();
		var rec = store.getAt(index);
		
		var parent = this.ownerCt;
		var cmp = parent.add({ xtype: "moqold.observationdetail", rec: rec, activityRec: this.rec });
		parent.doLayout();
		parent.setActiveItem(cmp);
	}
});

Ext.reg("moqold.observationlist", mOQOLD.ObservationList);