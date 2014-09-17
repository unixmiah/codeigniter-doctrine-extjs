Ext.ns("mOQOLD");
mOQOLD.ActivityGrid = Ext.extend(Ext.grid.GridPanel, {
	initComponent: function () {
		var config = {
			id: 'activitygrid',
			enableDragDrop: true,
			store: new Ext.data.DirectStore({
				storeId: 'activitiesStore',
				autoLoad: true,
				stripeRows: true,
				reader: new Ext.data.JsonReader({ fields: [
					{ name: "ID", type: "int" },
					{ name: "activityName", type: "string" },
					{ name: "description", type: "string" },
					{ name: "abbrName", type: "string" },
					{ name: "demensionID", type: "int" },
					{ name: "isActive", type: "int" }
				], root: 'items'
				}),
				proxy: new Ext.data.DirectProxy({ api: { read: Ext.app["ActivityAPI"].listAll} })
			}),
			columns: [
					{ name: "ID", type: "int", hidden: true, dataIndex: 'ID' },
					{ header: 'Acitivy List', name: "activityName", type: "string", sortable: true, dataIndex: 'activityName' }
				],
			viewConfig: { forceFit: true },
			ddGroup: 'calDD'
		};
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		mOQOLD.ActivityGrid.superclass.initComponent.apply(this, arguments);

	},

	onRender: function () {
		mOQOLD.ActivityGrid.superclass.onRender.apply(this, arguments);
		this.store.load({ params: { orgId: mOQOLD.orgID} });
	},
	listeners: {
		render: function (grid) {
			grid.dragZone = new Ext.grid.GridDragZone(grid, {
				ddGroup: 'calDD',
				getDragData: function (e) {
					var target = Ext.get(e.getTarget());

					thisProxy = Ext.ensible.cal._statusProxyInstance;

					var activitiesGrid = this.grid;

					var eventName = {};
					if (activitiesGrid.getSelectionModel().hasSelection()) {
						var record = activitiesGrid.getSelectionModel().getSelected();

						eventName = { activityName: record.get('activityName'), activityId: record.get("ID") };
					};

				}
			});
		}
	}
});
Ext.reg('moqold.activityList', mOQOLD.ActivityGrid);
