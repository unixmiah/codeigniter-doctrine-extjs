Ext.ns("mOQOLD");
mOQOLD.UserRole = new mOQOLD.MaintenanceGridDefaultAbstract({
	title: 'UserRole',
	baseAPI: "UserRoleAPI",
	defaultName: "roleName",
	defaultSort: "roleName",
	pageName: 'UserRole',
	getHybridConfig: function () {
		return [
			{ dataIndex: "ID", type: "int" },
			{ dataIndex: "roleName", type: "string", header: "Role Name", formField: { fieldLabel: "Role", maxLength: 45, allowBlank: false, maxLengthText: 'Role value should be less than 45 characters'} },
			{ dataIndex: "roleDesc", type: "string", header: "Role Description", formField: { fieldLabel: "Role Description", maxLength: 45, maxLengthText: 'Role Description should be less than 45 characters'} }
		];
	},
	createForm: null,
    editRow: function (grid, rowIndex, colIndex) {
    	var permissionWin = mOQOLD.Permissions.createWindow(grid, rowIndex, colIndex);
	}
});
