Ext.ns("mOQOLD");

mOQOLD.PermissionWindow = new mOQOLD.MaintenanceGridAbstract({
	title: 'Permission',
	baseAPI: "PermissionsAPI",
    defaultName: "permissionName",
    defaultSort: "permissionName",
    pageName: 'Permission',
    getHybridConfig: function () {
        return [
			{ dataIndex: "ID", type: "int" },
			{ dataIndex: "permissionName", type: "string", header: "Permission Name"},
			{ dataIndex: "_create", type: "int", header: "Create" },
            { dataIndex: "_update", type: "int", header: "Update" },
            { dataIndex: "_delete", type: "int", header: "Delete" },
            { dataIndex: "_read", type: "int", header: "Read" }
		];
    },
	createWindow: function (grid, rowIndex, colIndex) {
	this.store = grid.getStore();
		var win = this.createWin();
		win.show();
		win.on("beforedestroy", this.cleanWin, this);
		this.win = win;
		return this.win;
	},
	createWin: function () {

		var isForm = new Ext.form.FormPanel({
			title: 'ItemSelector Test',
			width: 700,
			bodyStyle: 'padding:10px;',
			renderTo: 'itemselector',
			items: [{
				xtype: 'itemselector',
				name: 'permissions',
				fieldLabel: 'Permissions',
				imagePath: './images/',
				multiselects: [{
					width: 250,
					height: 200,
					store: this.store,
					displayField: 'text',
					valueField: 'value'
				}, {
					width: 250,
					height: 200,
					store: [['10', 'Ten']],
					tbar: [{
						text: 'clear',
						handler: function () {
							isForm.getForm().findField('itemselector').reset();
						}
					}]
				}]
			}],

			buttons: [{
				text: 'Save',
				handler: function () {
					if (isForm.getForm().isValid()) {
						Ext.Msg.alert('Submitted Values', 'The following will be sent to the server: <br />' +
                     isForm.getForm().getValues(true));
					}
				}
			}]
		});

		/*
		var isForm = new Ext.form.FormPanel({
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
			} ]
			},
			
			{
				fieldLabel: 'Permissions',
				xtype: "itemselectorex",
				anchor: '100%',
				store: this.createStore(),
				displayField: 'permissionName',
				valueField: 'ID',
				name: 'itemselector2'
			}],

			buttons: [{
				text: 'Save',
				handler: function () {
					if (isForm.getForm().isValid()) {
						Ext.Msg.alert('Submitted Values', 'The following will be sent to the server: <br />' +
                        isForm.getForm().getValues(true));
					}
				}
			}]
		});
		*/

		return new Ext.Window({
			title: 'Permission',
			width: 500,
			height: 400,
			items: isForm
		});

	}

});