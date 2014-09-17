/*global mOQOLD, Ext, location */
Ext.ns("mOQOLD");

/*
//As per the list of defects #627, #628 the need is allow maxLength to unlimited but showing error if it exceeds db limit.
Ext.form.Field.override({
validationDelay: 10,

//To set the maxLength of HTML field
oldOnRender: Ext.form.Field.prototype.onRender,

onRender: function (ct, position) {
this.oldOnRender(ct, position);
if (/^[0-9]{1,}$/.test(this.maxLength)) {
this.el.dom.setAttribute('maxLength', this.maxLength);
}
}
});
*/

mOQOLD.App = Ext.extend(Ext.Container, {
	layout: "anchor",
	width: 950,
	autoHeight: true,
	renderTo: "mainContent",
	defaults: { anchor: "100%" },
	welcomeTpl: null,

	initComponent: function () {
		this.isLoggedIn = false;

		this.welcomeTpl = new Ext.Template(Ext.fly("welcomeMessage").dom.innerHTML).compile();

		this.initHover('topNav');
		this.initHover('subNav');

		mOQOLD.App.superclass.initComponent.call(this);

		this.on("afterrender", this.checkLoginStatus, this);
	},

	initHover: function (el) {
		var imgs = Ext.get(el).select("img"), i, len;
		for (i = 0, len = imgs.getCount(); i < len; i++) {
			var ele = imgs.item(i);
			if (!ele.hasClass('activeMenu') && ele.dom.src.indexOf("_n.jpg") > -1) {
				ele.hover(this.onMenuOver, this.onMenuOut);
			}
		}
	},

	onMenuOver: function (e, el) {
		var src = el.src;
		if (!Ext.fly(el).hasClass('activeMenu') && src.indexOf("_n.jpg") > -1) {
			el.src = src.replace("_n.jpg", "_o.jpg");
		}
	},

	onMenuOut: function (e, el) {
		var src = el.src;
		if (!Ext.fly(el).hasClass('activeMenu') && src.indexOf("_o.jpg") > -1) {
			el.src = src.replace("_o.jpg", "_n.jpg");
		}
	},

	activeModule: null,

	onHistoryChange: function (token) {
		token = Ext.History.getToken();

		// Jump to whatever is requested
		var twoColumn = false;

		if (!token) {
			token = "";
		}

		var temp = token.replace("%7C", "|").split('|');
		var moduleName = temp[0];

		if (moduleName && !this.isLoggedIn && ["Static", "Account", "Confirm", "Forgot"].indexOf(moduleName) === -1) {
			location.href = "#";
			return;
		}

		var handled;

		if (token) {
			var moduleInfo = {}, i;

			if (moduleName !== "Static") {
				var topNavEl = Ext.get('topNav');
				var existingHighlighted = topNavEl.child('img.activeMenu');
				if (existingHighlighted) {
					existingHighlighted.removeClass('activeMenu');
					existingHighlighted.dom.src = existingHighlighted.dom.src.replace("_o.jpg", "_n.jpg");
				}
				var toHighlight = topNavEl.child('a[href=#' + moduleName + ']');
				if (toHighlight) {
					var imgEl = toHighlight.child('img');
					imgEl.dom.src = imgEl.dom.src.replace("_n.jpg", "_o.jpg");
					imgEl.addClass('activeMenu');
				}
			}

			if (temp.length > 1) {
				for (i = 1; i < temp.length; i++) {
					var param = Ext.urlDecode(temp[i] || ""), name;
					for (name in param) {
						moduleInfo[name] = param[name];
					}
				}
			}
			var module = mOQOLD[moduleName];

			// module is valid only if it has activateModule function
			if (module && typeof module.activateModule === 'function') {
				Ext.fly('homeContent').addClass("x-hidden");
				Ext.fly('internalBanner').removeClass("x-hidden");

				if (this.activeModule) {
					if (typeof this.activeModule.deactivaeModule === 'function') {
						this.activeModule.deactivateModule();
					}
				}
				this.activeModule = module;
				var cmp = module.activateModule(moduleInfo);
				if (cmp) {
					this.removeAll();
					this.add(cmp);
					this.doLayout();

					if (cmp.layout === 'column') {
						twoColumn = true;
					}
				}
				handled = true;
			}
		}

		if (!handled) {
			if (this.activeModule) {
				if (typeof this.activeModule.deactivateModule === 'function') {
					this.activeModule.deactivateModule();
				}
			}
			this.removeAll();
			this.doLayout();
			Ext.fly('homeContent').removeClass("x-hidden");
			Ext.fly('internalBanner').addClass("x-hidden");
		}

		Ext.fly('mainContent').removeClass(['secpgContentNoLine', 'secpgContent']);
		Ext.fly('mainContent').addClass(twoColumn ? 'secpgContent' : 'secpgContentNoLine');

		var bannerImage = Ext.fly('internalBanner').first('img');
		bannerImage.dom.src = twoColumn ? 'images/secpg_banner.png' : 'images/secpg_noline_banner.png';
	},

	getMainContainer: function () {
		return this;
	},

	checkLoginStatus: function () {
		Ext.History.on('change', this.onHistoryChange, this);
		Ext.History.init();

		Ext.app.LoginAPI.isLoggedIn(true, this.onCheckStatusReturn, this);
	},

	onCheckStatusReturn: function (p, e) {
		if (e.action === "LoginAPI" && e.method === "isLoggedIn") {
			var result = e.result;
			var success = result.success;

			if (success) {
				delete result.success;
				Ext.apply(mOQOLD, result);
				//TODO : remove this as this is a temp fix to set default timeout
				//if (mOQOLD.sessionTimeOut && mOQOLD.sessionTimeOut === 0) {
				//mOQOLD.sessionTimeOut = 3 * 60;
				//}
				mOQOLD.sessionTimeOutTask.delay(mOQOLD.sessionTimeOut * 1000);
			} else {
				mOQOLD.sessionTimeOutTask.cancel();
			}
			this.isLoggedIn = success;
			this.handleLoginStatus(success);
		}
	},

	handleLoginStatus: function (status) {
		this.isLoggedIn = status;

		var topNavEl = Ext.get("topNav");
		topNavEl.removeClass(status ? "loggedOut" : "loggedIn");
		topNavEl.addClass(status ? "loggedIn" : "loggedOut");

		var subNavEl = Ext.get("subNav");
		subNavEl.removeClass(status ? "loggedOut" : "loggedIn");
		subNavEl.addClass(status ? "loggedIn" : "loggedOut");

		if (status) {
			this.welcomeTpl.overwrite("welcomeMessage", { firstName: mOQOLD.contactValue.firstName, lastName: mOQOLD.contactValue.lastName });
			if (mOQOLD.Security.hasPermission('Admin', 'create')) {
				mOQOLD.Setup.show();
			}
		}
		this.onHistoryChange();
	},

	onLogInSuccess: function (tabpanel) {
		tabpanel.destroy();
		location.href = "#Home";
		this.handleLoginStatus(true);
	},

	onSignUpSuccess: function () {
		Ext.Msg.alert("Signup", "You have successfully signed up. Please check the email you signed up with to activate your account.", function (btn) {
			location.href = "#";
		});
	},

	confirmLogout: function () {
		Ext.MessageBox.show({
			title: 'Log Out',
			msg: "Are you sure you want to log out?",
			buttons: Ext.MessageBox.YESNO,
			fn: this.handleLogout,
			scope: this,
			icon: Ext.MessageBox.QUESTION
		});
	},

	handleLogout: function (btn) {
		if (btn === "yes") {
			Ext.app.LoginAPI.doLogout(this.onLogoutReturn, this);
		}
	},

	onLogoutReturn: function (p, e) {
		if (e.action === "LoginAPI" && e.method === "doLogout") {
			if (e.result.success === true) {
				mOQOLD.sessionTimeOutTask.cancel();
				this.isLoggedIn = false;
				location.href = "index.html";
			} else {
				Ext.MessageBox.alert("Logout", "Logout Unsuccessful");
			}
		}
	},

	usabilityInfo: {},

	logAction: function (options) {
		var info = {
			pageName: options.pageName || this.usabilityInfo.pageName,
			pageURL: location.href,
			action: options.action || 'load'
		};
		Ext.app.UsabilityAPI.updateUsabilityLog(info);
		if (mOQOLD.sessionTimeOut && mOQOLD.sessionTimeOut > 0 && mOQOLD.sessionTimeOutTask) {
			mOQOLD.sessionTimeOutTask.delay(mOQOLD.sessionTimeOut * 1000);
		} else {
			mOQOLD.sessionTimeOutTask.cancel();
		}
		this.usabilityInfo = info;
	},
	findPage: function (pageName) {
		var pages = mOQOLD.pages, i, len;
		if (pages) {
			for (i = 0, len = pages.length; i < len; i++) {
				if (pages[i].pageName === pageName) {
					return pages[i];
				}
			}
		}
		return {};
	}
});

Ext.reg("moqold.app", mOQOLD.App);

mOQOLD.sessionTimeOutTask = new Ext.util.DelayedTask(function () {
	isFirstTime = true;
	Ext.MessageBox.show({
		title: 'Warning',
		msg: "Session Expired, Please login again!!",
		buttons: Ext.MessageBox.OK,
		fn: function () {
			Ext.app.LoginAPI.doLogout(function (p, e) {
		if (e.action === "LoginAPI" && e.method === "doLogout") {
			if (e.result.success === true) {
				mOQOLD.sessionTimeOutTask.cancel();
				this.isLoggedIn = false;
				location.href = "index.html";
			} else {
				Ext.MessageBox.alert("Logout", "Logout Unsuccessful");
			}
		}
			}, this);
		},
		scope: this,
		icon: Ext.MessageBox.ERROR
	});
});