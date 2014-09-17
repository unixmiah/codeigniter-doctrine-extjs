mOQOLD.Static = {
	configs: {
		About: {
			title: 'About mOQOLD'
		}
	},

	activateModule: function (info) {
		var pageName = info.page;
		if (mOQOLD.sessionTimeOutTask) {
			mOQOLD.sessionTimeOutTask.cancel();
		}
		var config = this.configs[pageName] || {};
		Ext.applyIf(config, {
			url: 'static/' + pageName + '.htm',
			title: info.title || pageName
		});
		var page = mOQOLD.Main.findPage(pageName);
		if (page) {
			mOQOLD.Main.logAction({ pageName: pageName });
		}
		return {
			xtype: 'panel',
			border: false,
			autoLoad: config.url
		};
	},

	show: function (page) {
		var hash = "#Static|page=" + page;
		if (location.hash !== hash) {
			location.hash = hash;
		} else {
			this.activateModule({ page: page });
		}
	},

	onClose: function () {
		this.win.close();
		this.win = null;
	}
};

mOQOLD.Admin = {
	activateModule: function (info) {
		var container = mOQOLD.Main.getMainContainer();
		var firstChild = container.getComponent(0);

		var alreadyOnAdmin = firstChild && firstChild.itemId === 'admin-home';

		var sidePanel;
		if (!info.module) {
			sidePanel = { xtype: "panel", autoLoad: 'static/AdminMain.htm', width: 650, border: false, bodyStyle: 'padding-left: 10px;' };
		} else {
			var module = mOQOLD[info.module];
			if (typeof module.createPanel === "function") {
				pageName = module.baseAPI.substr(0, module.baseAPI.length - 3);
				module.autoHeight = true;
				module.columnWidth = 1;
				module.getGridConfig = function () {
					return { columnWidth: 1 };
				};
				sidePanel = module.createPanel(info);
			} else {
				sidePanel = new module({ columnWidth: 1 });
			}
		}

		if (alreadyOnAdmin) {
			container = firstChild;
			container.remove(container.items.itemAt(1));
			container.add(sidePanel);
			container.doLayout();
		} else {
			return {
				xtype: 'container',
				itemId: 'admin-home',
				layout: 'column',
				items: [
					{ xtype: "moqold.leftmenu" },
					sidePanel
				]
			};
		}
	}
};

mOQOLD.Account = {
	activateModule: function (info) {
		if (typeof info.type === "undefined" || typeof info.type !== "string") { return false; }
		if (info.type === "Profile") {
			return mOQOLD.Profile.createPanel();
		}
		var typeObj = {
			LogIn: 0,
			SignUp: 1,
			Forgot: 2,
			Confirm: 3
		};
		var active = typeObj[info.type];
		return {
			xtype: "moqold.loginsignup",
			activeItem: active,
			listeners: {
				scope: mOQOLD.Main,
				login: mOQOLD.Main.onLogInSuccess,
				signup: mOQOLD.Main.onSignUpSuccess
			}
		};
	}
};

mOQOLD.Confirm = {
	activateModule: function(info) {
		return {
			xtype: "moqold.loginsignup",
			activeItem: 3,
			listeners: {
				scope: mOQOLD.Main,
				confirm: mOQOLD.Main.onLogInSuccess
			}
		};
	}
}
mOQOLD.Forgot = {
	activateModule: function(info) {
		var t = info.t;
		return {
			xtype: "moqold.loginsignup",
			activeItem: 4,
			token: t
		};
	}
}

mOQOLD.Home = {
	activateModule: function (info) {
		if (mOQOLD.Main.isLoggedIn){
			return { xtype: "moqold.home" };
		}
	}
}

mOQOLD.Dashboard = {
	activateModule: function (info) {
		return { xtype: "moqold.dashboard" };
	}
}