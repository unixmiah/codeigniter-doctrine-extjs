Ext.ns("mOQOLD");

mOQOLD.MaintenanceGridDefaultAbstract = Ext.extend(mOQOLD.MaintenanceGridAbstract, {
	defaultBaseAPI: "SystemRefAPI",
	defaultName: "name",

	createDefaultStore: function () {
		var type = this.defaultType || this.title.toLowerCase().replace(" ", "");

		var baseApi = Ext.app[this.defaultBaseAPI];
		var defaultStore = new Ext.data.DirectStore({
			totalProperty: "total",
			root: "items",
			api: {
				read: baseApi.listAll
			},
			fields: [
				{ name: "ID", type: "int" },
				{ name: this.defaultName, type: "string", mapping: "name" }
			]
		});

		defaultStore.load({
			params: {
				type: type
			}
		});

		return defaultStore;
	},

	createDefaultView: function () {
		var type = this.title.toLowerCase().replace(" ", "");
		return new Ext.DataView({
			store: this.createDefaultStore(),
			autoHeight: true,
			autoWidth: true,
			singleSelect: true,
			overClass: "activity-over",
			selectedClass: "activity-selected",
			itemSelector: "div.default-item",
			tpl: new Ext.XTemplate(
				'<tpl for=".">',
					'<div class="default-item">{' + this.defaultName + '}</div>',
				'</tpl>'
			),
			listeners: {
				scope: this,
				afterrender: this.initializeDragZone
			}
		});
	},

	createForm: function (options) {
		var pageName = this.defaultBaseAPI.substr(0, this.defaultBaseAPI.length - 3);
		if (!mOQOLD.Security.hasPermission(pageName, "read")) {
			return;
		}

		var dvPanel = {
			xtype: "panel",
			title: "Default " + this.title + " List",
			frame: true,
			height: 300,
			width: 150,
			autoScroll: true,
			anchor: "50%",
			layout: "fit",
			items: this.createDefaultView()
		};

		if (!options.isWizard) {
			return {
				xtype: "container",
				layout: "hbox",
				layoutConfig: {
					pack: "end"
				},
				items: dvPanel
			};
		} else {
			return dvPanel;
		}
	},

	initializeDragZone: function (dv) {
		dv.dragZone = new Ext.dd.DragZone(dv.getEl(), {
			ddGroup: 'DefaultGrid',
			getDragData: function (e) {
				var sourceEl = e.getTarget(dv.itemSelector, 10);
				if (sourceEl) {
					d = sourceEl.cloneNode(true);
					d.id = Ext.id();
					return dv.dragData = {
						sourceEl: Ext.get(sourceEl),
						repairXY: Ext.fly(sourceEl).getXY(),
						ddel: d,
						rec: dv.getRecord(sourceEl)
					}
				}
			},
			getRepairXY: function () {
				return this.dragData.repairXY;
			}
		});
	},

	initializeDropZone: function (grid) {
		var scope = this;
		grid.dropZone = new Ext.dd.DropZone(grid.getEl(), {
			ddGroup: 'DefaultGrid',
			getTargetFromEvent: function (e) {
				return e.getTarget(".drop-grid");
			},
			onNodeOver: function (target, dd, e, data) {
				return Ext.dd.DropZone.prototype.dropAllowed;
			},
			onNodeDrop: function (target, dd, e, data) {
				var store = grid.getStore();
				var defaultName = data.rec.get(scope.defaultName);
				var index = store.findExact(scope.defaultName, defaultName);

				if (index >= 0) {
					Ext.MessageBox.alert("Item Found", defaultName + " has already been added to the list.");
				} else {
					scope.showAdd(data.rec);
				}
				return true;
			}
		});
	}
});