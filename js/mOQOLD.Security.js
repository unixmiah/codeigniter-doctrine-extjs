Ext.ns("mOQOLD");

mOQOLD.Security = {
	hasPermission: function (name, permission) {
		var permissions = mOQOLD.permissions || {};
		
		permissions = permissions[name] || {};
		return permissions[permission] === true;

		/*if (permissions[name + '_all']) { return true; }
		if (permissions[name + '_' + permission]) { return true; }
		return false;*/

	},

	permissions: {
		read: 'read',
		update: 'update',
		create: 'create',
		remove: 'delete'
	},

	clearPermissions: function () {
		delete mOQOLD.permissions;
	}
};