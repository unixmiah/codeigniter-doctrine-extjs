Ext.ns("mOQOLD");

mOQOLD.DirectURL = "../index.php/direct/router";

mOQOLD.LoggedIn = false;

mOQOLD.App = Ext.extend(Ext.Panel, {
	fullscreen: true,
	isLoggedIn: false,
	layout: "card",
	cardSwitchAnimation: "slide",
	
	initComponent: function() {
		this.dockedItems = this.buildDocks();
		
		this.items = [
			{ xtype: "component", html: "mOQOLD Mobile", makeMenu: this.makeMenu }
		];
		
		mOQOLD.App.superclass.initComponent.call(this);
		if (mOQOLD.checkOnline()) {
			this.Mask = new Ext.LoadMask(Ext.getBody(), { msg: "Loading..." });
			this.Mask.show();
			this.on("afterrender", this.checkLoginStatus, this);
		}
		this.on("beforecardswitch", this.handleBeforeCardSwitch, this);
		this.on("afterrender", this.initChecker, this);
	},
	
	makeMenu: function() {
		var html =  "<div class='menu-wrap'>" +
						"<div id='incidentlist'><img src='sencha-touch-1.0.1a/resources/themes/images/default/pictos/doc_compose2.png'><br>Incident</div>" +
//						"<div id='help'><img src='sencha-touch-1.0.1a/resources/themes/images/default/pictos/help_black.png'><br>Help</div>" +
//						"<div id='reports'><img src='sencha-touch-1.0.1a/resources/themes/images/default/pictos/chart1.png'><br>Reports</div>" +
//						"<div id='search'><img src='sencha-touch-1.0.1a/resources/themes/images/default/pictos/search_black.png'><br>Search</div>" +
						"<div id='calendar'><img src='sencha-touch-1.0.1a/resources/themes/images/default/pictos/calendar.png'><br>Activities</div>" +
						"<div id='residentlist'><img src='sencha-touch-1.0.1a/resources/themes/images/default/pictos/user.png'><br>Residents</div>" +
						"<div id='settings'><img src='sencha-touch-1.0.1a/resources/themes/images/default/pictos/settings.png'><br>Settings</div>" +
//						"<div id='photo'><img src='sencha-touch-1.0.1a/resources/themes/images/default/pictos/photo_black2.png'><br>Photo</div>" +
						"<div id='Exit'><img src='sencha-touch-1.0.1a/resources/themes/images/default/pictos/lock_closed.png'><br>Exit</div>" +
					"</div>";
		var menu = {
			xtype: "component",
			html: html
		};
		
		return menu;
	},
	
	initChecker: function() {
		this.onlineChecker = mOQOLD.OnlineChecker;
		this.onlineChecker.start();
	},
	
	initMenu: function() {
		var activeItem = this.getActiveItem();
		if (typeof activeItem.makeMenu === "function") {
			var menu = activeItem.makeMenu();
		} else {
			var menu = this.makeMenu();
		}
		return new Ext.Panel({
			items: menu,
			floating: true,
			centered: true,
			modal: true,
			width: Ext.getBody().getWidth(),
			showAnimation: "pop",
			listeners: {
				scope: this,
				afterrender: this.initMenuTap,
				hide: this.destroyMenu,
				beforedestroy: this.cleanUp
			}
		});
		
		return new Ext.ActionSheet({
			items : [panel],
			hideOnMaskTap: true,
			listeners: {
				scope: this,
				hide: this.destroyMenu,
				beforedestroy: this.cleanUp
			}
		});
	},
	
	hideMenu: function() {
		this.Menu.hide();
	},
	
	hideLogin: function() {
		this.Login.hide();
	},
	
	initMenuTap: function(panel) {
		panel.mon(panel.el, {
			scope: this,
			tap: this.handleMenuTap
		});
	},
	
	destroyMenu: function() {
		this.Menu.destroy();
	},
	
	destroyLogin: function() {
		this.Login.destroy();
	},
	
	cleanUp: function() {
		delete this.Menu;
		delete this.Login;
	},
	
	handleBeforeCardSwitch: function(p, n, o, index) {
		var docked = this.getDockedComponent(0);
		var button = docked.getComponent(2);
		if (index === 0) {
			button.hide();
		} else {
			button.show();
		}
	},
	
	buildDocks: function() {
		return [
			{
				xtype: "toolbar",
				dock: "bottom",
				ui: "dark",
				items: [
					{ text: "Menu", scope: this, hidden: true, handler: this.showMenu },
					{ xtype: "spacer" },
					{ text: "Home", hidden: true, scope: this, handler: this.goHome },
					{ text: "Logout", ui: "decline", hidden: true, scope: this, handler: this.doLogout },
					{ text: "Login", ui: "confirm", scope: this, handler: this.showLogin }
				]
			}
		];
	},
	
	goHome: function() {
		this.setActiveItem(0, { type: "slide", reverse: true });
	},
	
	showLogin: function(msg) {
		var loginCfg = {
			floating: true,
			centered: true,
			modal: true,
			showAnimation: "pop",
			defaults: {
				required: true,
				labelAlign: "top"
			},
			items: [
				{ xtype: "textfield", label: "Login", name: "login", autoCapitalize: false },
				{ xtype: "passwordfield", label: "Password", name: "password" },
				{ xtype: "fieldset", layout: "hbox", defaults: { xtype: "button", flex: 1, scope: this }, items: [
					{ text: "Cancel", ui: "decline", scope: this, handler: this.hideLogin },
					{ text: "Login", ui: "confirm", scope: this, handler: this.doLogin },
				] }
			],
			listeners: {
				scope: this,
				hide: this.destroyLogin,
				beforedestroy: this.cleanUp
			}
		};
		
		if (typeof msg === "string") {
			loginCfg.items.unshift({
				xtype: "component",
				html: msg
			});
		}
		
		var login = new Ext.form.FormPanel(loginCfg);
		
		this.Login = login;
		this.Login.show();
	},
	
	showMenu: function() {
		if (typeof this.Menu === "undefined") {
			this.Menu = this.initMenu();
		}
		this.Menu.show();
	},
	
	checkLoginStatus: function() {
		if (!mOQOLD.checkOnline()) {
			return;
		}
		var params = {
			extAction: "LoginAPI",
			extMethod: "isLoggedInForm",
			extTID: 0,
			extUpload: false,
			extType: "rpc"
		};
		
		Ext.Ajax.request({
			url: "../index.php/direct/router",
			params: params,
			scope: this,
			success: this.onIsLoggedIn
		});
	},
	
	doLogin: function() {
		var form = this.Login;
		var values = form.getValues();
		
		this.Mask = new Ext.LoadMask(form.el, { msg: "Logging in..." });
		this.Mask.show();
		
		if (!mOQOLD.checkOnline()) {
			this.doOfflineLogin(values.login, values.password);
			return;
		}
		var params = {
			extAction: "LoginAPI",
			extMethod: "doLogin",
			extTID: 0,
			extUpload: false,
			extType: "rpc"
		};
		Ext.applyIf(params, values);
		
		Ext.Ajax.request({
			url: "../index.php/direct/router",
			params: params,
			scope: this,
			success: this.onLoginSuccess
		});
	},
	
	doOfflineLogin: function(login, password) {
		var store = mOQOLD.stores.LoginListOffline;
		var password = mOQOLD.SHA1(password);
		var idx = store.findBy(function(rec) {
			if (rec.get("login") === login && password === rec.get("password")) {
				return true;
			}
		});
		this.Login.hide();
		if (idx < 0) {
			Ext.Msg.alert("Log in", "This device is currently in Offline mode and your login details have never previously been logged in. Please connect to the network and try again.", Ext.emptyFn);
			this.handleLoginChange(false);
		} else {
			mOQOLD.LoggedIn = "offline";
			Ext.Msg.alert("Log in", "You have been successfully logged in!<br><br>Offline Mode.", Ext.emptyFn);
			this.handleLoginChange(true);
		}
	},
	
	doLogout: function() {
		mOQOLD.LoggedIn = false;
		if (!mOQOLD.checkOnline()) {
			Ext.Msg.alert("Log out", "You have successfully logged out.", Ext.emptyFn);
			this.handleLoginChange(false);
			return;
		}
		var params = {
			extAction: "LoginAPI",
			extMethod: "doLogoutForm",
			extTID: 0,
			extUpload: false,
			extType: "rpc"
		};
		Ext.Ajax.request({
			url: "../index.php/direct/router",
			params: params,
			scope: this,
			success: this.onLogoutSuccess
		});
	},
	
	onIsLoggedIn: function(response) {
		this.closeMask();
		var result = Ext.decode(response.responseText).result;
		var login = result.login;
		var loginStore = mOQOLD.stores.LoginListOffline;
		var DefaultStore = mOQOLD.stores.DefaultOffline;
		var loginRec = loginStore.findRecord("login", login);
		mOQOLD.DefaultRec = DefaultStore.findRecord("userID", loginRec.get("ID"));
		this.handleLoginChange(result.success);
		mOQOLD.LoggedIn = "online";
	},
	
	onLoginSuccess: function(response) {
		var result = Ext.decode(response.responseText).result;
		if (result.success) {
			this.Login.hide();
			this.handleLoginChange(true);
			mOQOLD.LoggedIn = "online";
			
			var login = response.request.options.params.login;
			var loginStore = mOQOLD.stores.LoginListOffline;
			var DefaultStore = mOQOLD.stores.DefaultOffline;
			
			if (loginStore.findExact("login", login) < 0) {
				var password = mOQOLD.SHA1(response.request.options.params.password);
				var rec = loginStore.add({ login: login, password: password })[0];
				loginStore.sync();
				var userID = rec.get("ID");
				var rec = DefaultStore.add({ userID: userID, calendarType: "daily" })[0];
				DefaultStore.sync();
				mOQOLD.DefaultRec = rec;
			} else {
				var loginRec = loginStore.findRecord("login", login);
				mOQOLD.DefaultRec = DefaultStore.findRecord("userID", loginRec.get("ID"));
			}
		} else {
			Ext.Msg.alert("Log in", "The login and password do not match our records.", Ext.emptyFn);
		}
	},
	
	onLogoutSuccess: function(response) {
		var result = Ext.decode(response.responseText).result;
		if (result.success) {
			Ext.Msg.alert("Log out", "You have successfully logged out.", Ext.emptyFn);
			
			this.setActiveItem(0);
			
			this.handleLoginChange(false);
		}
	},
	
	handleLoginChange: function(status) {
		this.isLoggedIn = status;
		
		var dock = this.getDockedComponent(0);
		var menuBtn = dock.getComponent(0);
		var logoutBtn = dock.getComponent(3);
		var loginBtn = dock.getComponent(4);
		
		if (status) {
			this.loadStores();
			menuBtn.show();
			logoutBtn.show();
			loginBtn.hide();
		} else {
			menuBtn.hide();
			logoutBtn.hide();
			loginBtn.show();
		}
	},
	
	handleMenuTap: function(e, t) {
		var el = Ext.get(t);
		if (!el.is("div")) {
			el = el.findParent("div", 2, true);
		}
		var module = el.id;
		if (module.search("-") >= 0) {
			var panel = this.getActiveItem();
			panel.loadModule(module);
		} else {
			if (module !== "Exit") {
				var cmp = this.add({ xtype: "moqold."+module });
				this.doLayout();
				this.setActiveItem(cmp);
			}
		}
		this.hideMenu();
	},
	
	closeMask: function() {
		this.Mask.hide();
		delete this.Mask;
	},
	
	loadStores: function() {
		if (!mOQOLD.checkOnline()) {
			return;
		}
		this.Mask = new Ext.LoadMask(Ext.getBody(), { msg: "Loading data..." });
		this.Mask.show();
		var stores = mOQOLD.stores;
		var store;
		
		for (var name in stores) {
			if (stores[name].doAutoLoad) {
				store = stores[name];
				store.load();
			}
		}
		
		store.on("load", this.closeMask, this);
	},
	
	removeAllRecords: function(store) {
		store.each(function(rec) {
			store.remove(rec);
		});
	}
});