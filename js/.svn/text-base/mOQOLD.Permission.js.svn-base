Ext.ns("mOQOLD");

mOQOLD.Permissions = new mOQOLD.MaintenanceGridAbstract({
	title: 'Permission',
	baseAPI: "PermissionsAPI",
	defaultName: "permissionName",
	defaultSort: "permissionName",
	pageName: 'Permission',
	getHybridConfig: function () {
		return [
			{ dataIndex: "ID", type: "int" },
			{ dataIndex: "permissionName", type: "string", header: "Permission Name" }
		];
	},
	createWindow: function (grid, rowIndex, colIndex) {
		this.store = grid.getStore();
		var roleRec = this.store.getAt(rowIndex);

		var win = this.createWin();
		this.form.getForm().setValues(roleRec.data);
		win.show();
		win.on("beforedestroy", this.cleanWin, this);
		this.win = win;
		return this.win;
	},
	createWin: function () {
		this.form = new Ext.form.FormPanel({
			title: 'Edit User Roles',
			width: 500,
			bodyStyle: 'padding:10px;',
			items: [{ xtype: 'fieldset', title: 'User Role details', items: [{
				xtype: 'textfield',
				fieldLabel: 'Role Name',
				name: 'roleName'
			}, {
				xtype: 'textfield',
				fieldLabel: 'Role Description',
				name: 'roleDesc'
			}, { xtype: "hidden", name: 'ID'}]
			},
			{
				fieldLabel: 'Permissions',
				xtype: "itemselectorex",
				anchor: '100%',
				storeFrom: this.createStore(),
				displayField: 'permissionName',
				valueField: 'ID',
				name: 'selectedPermissions'
			}],

			buttons: [{
				text: 'Save',
				handler: function () {
					if (this.form.getForm().isValid()) {
						Ext.Msg.alert('Submitted Values', 'The following will be sent to the server: <br />' +
                        this.form.getForm().getValues(true));
					}
				}, scope: this
			}, {
				text: 'Cancel',
				handler: function () {
					this.win.close();
				}, scope: this
			}]
		});

		return new Ext.Window({
			title: 'Permission',
			autoHeight: true,
			margins: { top: 5, right: 5, bottom: 5, left: 5 },
			items: this.form
		});

	}

});