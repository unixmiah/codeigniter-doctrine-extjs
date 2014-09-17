/*global mOQOLD, Ext */
Ext.ns("mOQOLD");

mOQOLD.DirectURL = "../index.php/direct/router";

mOQOLD.LoggedIn = false;
mOQOLD.currentSelectDate = new Date();
mOQOLD.testOffline = false;
mOQOLD.currentSessionValue = "blankSession";
mOQOLD.FixedMsgBox = new Ext.MessageBox({minHeight: 180, minWidth : 360, height: 180, width:360});
mOQOLD.App = Ext.extend(Ext.Panel, {
	fullscreen: true,
	isLoggedIn: false,
	id: 'mainapp',
	layout: "card",
	cardSwitchAnimation: "slide",
	initComponent: function () {
		this.dockedItems = [
			{
				xtype: 'toolbar',
				ui: 'light',
				dock: 'bottom',
				defaults: {
					iconMask: true,
					ui: 'plain'
				},
				items: [
					{ hidden: true, scope: this, handler: this.showHome, iconCls: 'home', itemId: 'home' },
					{ hidden: true, scope: this, handler: this.changeActivityFormat, iconCls: 'activity', itemId: 'changeActivityFormat' },
					{ text: "Photos", scope: this, handler: this.loadPhotos, itemId: 'photos', hidden: true },
					{ xtype: "spacer" },
					{ text: "Reload App", ui: "decline", scope: this, handler: this.reloadApplication, itemId: 'reload', hidden: true },
					{ text: "Logout", ui: "decline", scope: this, handler: this.doLogout, itemId: 'logout', hidden: true }

				]
			}
		];
		this.items = [
			new Ext.form.FormPanel({
				id: 'loginForm',
				items: [
					{ xtype: "textfield", label: "Login", name: "login", required: true, autoCapitalize: false },
					{ xtype: "ux.pinfield", label: "Pin", required: true, name: "devicePin" },
					{ xtype: "button", text: "Login", ui: "confirm", scope: this, handler: this.doLogin }
				],
				itemId: 'loginpage'
			}),
			new Ext.Panel({
				layout: {
					type: 'vbox',
					padding: '5 0 0 0',
					align: 'center',
					pack: 'center'
				},
				autoScroll: true,
				defaultType: 'button',
				defaults: { margin: '5px', width: 300, handler: this.onMenuClick, scope: this, ui: 'light' },
				items: [
					{ text: 'Activity Calendar', iconCls: 'activity', targetCard: "calendar" },
					{ text: 'Participants', iconCls: 'participants', targetCard: "residentlist" },
					{ text: 'Fall Incident', iconCls: 'fallincident', targetCard: "incidentlist" },
					{ text: 'Settings', iconCls: 'usrsettings', targetCard: "settings" }
				],
				itemId: 'mainmenu'
			})
        ];
		mOQOLD.App.superclass.initComponent.call(this);
		if (!mOQOLD.LoggedIn) {
			this.on("afterrender", this.checkLoginStatus, this);
		}
		this.on("beforecardswitch", this.handleBeforeCardSwitch, this);
		this.on("afterrender", this.initChecker, this);
	},

	initChecker: function () {
		this.onlineChecker = mOQOLD.OnlineChecker;
		this.onlineChecker.start();
	},

	reloadApplication: function () {
		window.location.reload();
	},

	handleBeforeCardSwitch: function (container, newCard, oldCard, index, animated) {

		if (oldCard.itemId) {
			mOQOLD.Usability.update("Switched to: " + newCard.itemId);
		}
		var itemId = newCard.itemId;
		var dock = this.getDockedComponent(0);
		dock.getComponent('logout').setVisible(itemId !== 'loginpage');
		dock.getComponent('home').setVisible(itemId !== 'mainmenu' && itemId !== "loginpage");
		dock.getComponent('changeActivityFormat').setVisible(itemId == 'calendar');
		dock.getComponent('photos').setVisible(itemId === 'activityform' || itemId === 'observationdetail');
	},

	onMenuClick: function (btn) {
		this.flipPage(btn);
	},

	flipPage: function (btn, options) {
		var targetCard = btn.targetCard;
		var card = this.getComponent(targetCard);
		//mOQOLD.Usability.update('Switched to: ' + targetCard);
		if (card === undefined) {
			card = Ext.ComponentMgr.create(Ext.apply({ xtype: 'moqold.' + targetCard, itemId: targetCard }, options));
			this.add(card);
		} else {
			Ext.apply(card, options);
		}

		//if the card is calendar, we need to see if any changes happened in the settings and set that view.
		if (targetCard === 'calendar') {
			var calTyp;
			try {
				calTyp = mOQOLD.DefaultRec.get("calendarType");
			} catch (err) {
				calTyp = "monthly";
			}
			card.calendarType = calTyp;
			//if(mOQOLD.Main.needCalendarUpdate()){
			card.removeAll();
			card.isLoadNeeded = true;
			//}
		}



		this.setActiveItem(card);

	},

	checkLoginStatus: function () {
		mOQOLD.DateRange.resetRange(new Date());
		var params = {
			extAction: "LoginAPI",
			extMethod: "isLoggedInForm",
			extTID: 0,
			extUpload: false,
			extType: "rpc"
		};

		var form = Ext.getCmp('loginForm');
		if (mOQOLD.enableMask) {
			this.Mask = new Ext.LoadMask(form.getEl(), {
				msg: "Checking login status..."
			});
			this.Mask.show();
		}
		Ext.Ajax.request({
			url: "../index.php/direct/router",
			params: params,
			scope: this,
			success: this.onIsLoggedIn,
			failure: this.onLoginFailure,
			timeout: 10000,
			listeners: {
				requestexception: function (conn, response, options) {
					alert("rem exception");
				}
			}
		});
	},
	onLoginFailure: function (respose) {
		if (mOQOLD.enableMask) {
			this.closeMask();
		}
		mOQOLD.FixedMsgBox.alert("Connection Failure", "Please try again later..");
		Ext.getCmp('loginForm').reset();
		this.showLoginPage();

	},
	onIsLoggedIn: function (response) {
		if (mOQOLD.enableMask) {
			this.closeMask();
		}
		var result = Ext.decode(response.responseText).result;
		if (result && result.success === true) {
			this.onLoginSuccess(response);
		}
	},

	handleLoginChange: function (status, data) {
		this.isLoggedIn = status;
		mOQOLD.LoggedIn = status;
		if (status) {
			this.loadStores(data);
		}
	},

	doLogin: function () {
		var form = Ext.getCmp('loginForm');
		var values = form.getValues();

		if (!mOQOLD.checkOnline()) {
			var loginStore = mOQOLD.stores.LoginListOffline;
			var login = values.login;
			var loginRec = loginStore.findByExact('login', login);
			var result = { success: false, login: login };
			if (loginRec) {
				result.success = loginRec.get('devicePin') === mOQOLD.SHA1(values.devicePin);
			}
			this.processLoginResult(result);
			return;
		}

		if (mOQOLD.enableMask) {
			this.Mask = new Ext.LoadMask(form.el, {
				msg: "Logging in..."
			});
			this.Mask.show();
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
			success: this.onLoginSuccess,
			failure: this.onLoginFailure,
			timeout: 10000,
			listeners: {
				requestexception: function (conn, response, options) {
					alert("Please try agai later..");
				}
			}
		});
	},
	onLoginSuccess: function (response) {
		if (mOQOLD.enableMask) {
			this.closeMask();
		}
		var result = Ext.decode(response.responseText).result;
		if (result) {
			result.devicePin = response.request.options.params.devicePin;
		}
		this.processLoginResult(result);

	},
	showDebug: function () {
		if (parseInt(mOQOLD.DefaultRec.get("debugType")) !== NaN && parseInt(mOQOLD.DefaultRec.get("debugType")) === 1) {
			return true;
		}
		else {
			return false;
		}

	},
	/*needCalendarUpdate : function() {
	if(parseInt(mOQOLD.DefaultRec.get("updateType")) !== NaN && parseInt(mOQOLD.DefaultRec.get("updateType")) === 1) {
	return true;
	}
	else {
	return false;
	}
	
	},*/
	processLoginResult: function (result) {
		if (result && result.success) {
			mOQOLD.LoggedIn = true;
			mOQOLD.currentSelectDate = new Date();
			var login = result.login;
			var loginStore = mOQOLD.stores.LoginListOffline;
			var DefaultStore = mOQOLD.stores.DefaultOffline;
			var contactID = result.contactID;
			var userID = result.loggedUID;
			mOQOLD.currentSessionValue = login + ":" + new Date().format("F d, Y g:i:s:u A");
			mOQOLD.currentSessionTimeOutValue = 60 * 60;

			if (mOQOLD.currentSessionTimeOutValue && mOQOLD.currentSessionTimeOutValue > 0) {
				this.startTimer();
			} else {
				mOQOLD.sessionTimeOutTask.cancel();
			}

			var loginRec;
			devicePin = result.devicePin || "";
			if (loginStore.findExact("login", login) < 0) {
				loginRec = loginStore.add({
					login: login,
					devicePin: "",
					orgID: result.orgID,
					contactID: contactID,
					userID: userID
				})[0];
				loginStore.sync();
				var userID = loginRec.get("userID");
				var recd = DefaultStore.add({
					userID: userID,
					calendarType: "daily",
					contactID: contactID,
					debugType: 2, sessionTimeVal: 60
				})[0];
				DefaultStore.sync();
				mOQOLD.DefaultRec = recd;
			}

			else {
				loginRec = loginStore.findByExact("login", login);
				//TODO: Need to put this is another appropriate place to set the debugmode as off.
				mOQOLD.DefaultRec = DefaultStore.findByExact("userID", loginRec.get("ID"));
				if (mOQOLD.DefaultRec) {
					mOQOLD.DefaultRec.set("debugType", 2);
					mOQOLD.DefaultRec.set("sessionTimeVal", 60);
				} else {
					mOQOLD.DefaultRec = DefaultStore.create({ calendarType: 'daily', debugType: 2, userID: loginRec.get("ID"), contactID: contactID, sessionTimeVal: 60 });
				}
			}

			mOQOLD.LoginRec = loginRec;
			if (loginRec && !loginRec.get('devicePin') && devicePin.length > 0) {
				loginRec.set('devicePin', mOQOLD.SHA1(devicePin));
				loginStore.sync();
			}
			Ext.apply(mOQOLD.Usability.info, { rUser: mOQOLD.LoginRec.get("userID"), orgID: mOQOLD.LoginRec.get("orgID"), sessionID: mOQOLD.currentSessionValue });

			mOQOLD.Usability.update("Login Successful");
			this.handleLoginChange(true, result);
			this.showHome();
			Ext.getCmp('loginForm').reset();
		} else {
			mOQOLD.Usability.update("Login failed");
			mOQOLD.FixedMsgBox.alert("Error!!", "The login and pin do not match our records.");
		}
	},
	loadStores: function (data) {
		if (!mOQOLD.checkOnline()) {
			return;
		}

		var stores = mOQOLD.stores;
		var store, name;

		for (name in stores) {
			store = stores[name];
			if (store.offline && store.onlineStore) {
				if (store.storeData) {
					// todo: preserve all local data
				}
				store.removeAll();
				store.sync();
			}
		}

		for (name in stores) {
			var recs = data[name];
			if (recs && recs.items) {
				store = stores[name];
				store.loadData(recs.items);
			}
		}
		if (mOQOLD.enableMask) {
			this.Mask = new Ext.LoadMask(Ext.getBody(), {
				msg: "Loading data..."
			});
			//this.Mask.show();
		}
		store.on("load", this.closeMask, this);
	},
	doLogout: function () {
		mOQOLD.Usability.update("Logout");
		mOQOLD.LoggedIn = false;
		if (!mOQOLD.checkOnline()) {
			this.handleLoginChange(false);
			Ext.getCmp('loginForm').reset();
			this.showLoginPage(); //Flipping to Login Screen
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

	onLogoutSuccess: function (response) {
		var result = Ext.decode(response.responseText).result;
		if (result.success) {
			mOQOLD.OnlineChecker.updateBatchLog(1, true);
			this.handleLoginChange(false);
			Ext.getCmp('loginForm').reset();
			//cancel the session timer
			if (mOQOLD.sessionTimeOutTask) {
				mOQOLD.sessionTimeOutTask.cancel();
			}
			this.showLoginPage(); //Flipping to Login Screen
		}
	},
	showHome: function () {
		var dock = this.getDockedComponent(0);
		if (dock && dock.getComponent('home').isVisible()) {
			mOQOLD.FixedMsgBox.show({
				title: 'Warning !',
				msg: 'You will loose all the information if you are in middle of something. Do you want to abort?',
				icon: Ext.Msg.ERROR,
				buttons: Ext.MessageBox.YESNO,
				fn: function (btn, text) {
					if (btn == 'yes') {
						var menuCard = this.getComponent('mainmenu');
						this.setActiveItem(menuCard);
					}
				},
				scope: this
			});
		} else {
			var menuCard = this.getComponent('mainmenu');
			this.setActiveItem(menuCard);
		}
	},
	showLoginPage: function () {
		var loginCard = this.getComponent('loginpage');
		this.setActiveItem(loginCard);

	},
	changeActivityFormat: function () {
		var menuCard = this.getComponent('calendar');
		menuCard.switchView();
	},
	loadPhotos: function () {

		/*var scrname = this.getActiveItem().itemId;
		if (scrname === "activityform") {
			//activity
			this.getActiveItem().showImageList();
		} else {
			this.getActiveItem().showImageList();
			//observation
		}*/

		this.getActiveItem().showImageList();
	},
	closeMask: function () {

		if (this.Mask) {
			this.Mask.hide();
			delete this.Mask;
		}
		if (mOQOLD.LoginRec) {
			var orgId = mOQOLD.LoginRec.get('orgID');
			var userId = mOQOLD.LoginRec.get("userID");
			mOQOLD.SiteSpecificRec = mOQOLD.stores.SiteSpecificOffline.findByExact("orgID", orgId);
			if (mOQOLD.SiteSpecificRec === null) {
				mOQOLD.stores.SiteSpecificOffline.add({ "orgID": orgId });
				mOQOLD.stores.SiteSpecificOffline.sync();
				mOQOLD.SiteSpecificRec = mOQOLD.stores.SiteSpecificOffline.findByExact("orgID", orgId);
			}
			Ext.apply(mOQOLD.Usability.info, { rUser: userId, orgID: orgId, sessionID: mOQOLD.currentSessionValue });
		}
	},
	startTimer: function () {
		if (!mOQOLD.sessionTimeOutTask) {
			mOQOLD.sessionTimeOutTask = new Ext.util.DelayedTask(function () {
				isFirstTime = true;
				mOQOLD.FixedMsgBox.on('beforehide', function (cmp) {
					if (cmp.buttonClicked === "unlock") {
						var enteredPass = cmp.inputEl.getValue();
						if (mOQOLD.LoginRec.get('devicePin') === mOQOLD.SHA1(enteredPass)) {
							return true;
						}
						Ext.Msg.alert("passord no matching");
						return false;
					} else {
						return true;
					}
				});

				mOQOLD.FixedMsgBox.show({
					modal: true,
					title: 'Warning',
					msg: "Session Expired, Please enter the password to unlock!!",
					icon: Ext.MessageBox.ERROR,
					buttons: Ext.MessageBox.UNLOCKLOGOUT,
					prompt: { type: 'password', maxLength: 20 },
					scope: this,
					fn: function (btnId, val, opt) {
						if (btnId === "unlock") {
							mOQOLD.FixedMsgBox['buttonClicked'] = 'unlock';
							if (mOQOLD.currentSessionTimeOutValue && mOQOLD.currentSessionTimeOutValue > 0) {
								mOQOLD.sessionTimeOutTask.delay(mOQOLD.currentSessionTimeOutValue * 1000);
							}
							if (mOQOLD.testOffline) {
								mOQOLD.sessionTimeOutTask.cancel();
							}
						}

						if (btnId === "logout") {
							mOQOLD.FixedMsgBox['buttonClicked'] = 'logout';
							mOQOLD.Main.doLogout();
							mOQOLD.Main.handleLoginChange(false);
							Ext.getCmp('loginForm').reset();
							mOQOLD.Main.showLoginPage(); //Flipping to Login Screen
							if (mOQOLD.testOffline) {
								mOQOLD.sessionTimeOutTask.cancel();
							}
						}
					},
					icon: Ext.MessageBox.ERROR,
					scope: this
				});
			});
		}

		if (mOQOLD.currentSessionTimeOutValue && mOQOLD.currentSessionTimeOutValue > 0) {
			mOQOLD.sessionTimeOutTask.delay(mOQOLD.currentSessionTimeOutValue * 1000);
		}
	}
});

mOQOLD.BackButton = Ext.extend(Ext.Button, {
	ui: "back",
	text: "Back",
	initComponent: function(){
		Ext.Button.superclass.initComponent.call(this);
		this.on('beforetap',this.tapEvt, this);
		this.on('tap', this.resetEvt, this);
	},
	handler: function () {
		mOQOLD.Usability.update("Back button to: " + this.targetCard);
		mOQOLD.Main.flipPage({ targetCard: this.targetCard });
	},
	tapEvt: function(btn, e) {
		this.setText('<div style="color:red;">Back</div>');
	},
	resetEvt: function(btn) {
		this.setText('<div style="color:white;">Back</div>');
	}
});
Ext.reg('moqold.back-button', mOQOLD.BackButton);

mOQOLD.comboRenderer = function (store, id, displayField) {
	var index = store.findExact('ID', id);
	if (index > -1) {
		return store.getAt(index).get(displayField);
	} else {
		return id;
	}
};

mOQOLD.getClientName = function (id) {
	var store = mOQOLD.stores.ResidentListOffline;
	var index = store.findExact('ID', id);
	var rec;
	if (index > -1) {
		rec = store.getAt(index);
		if (rec) {
			return mOQOLD.getFormat(rec.get('firstName'), rec.get('lastName'));
		}
	} else {
		return id;
	}
};

mOQOLD.getActivityName = function (id) {
	return mOQOLD.comboRenderer(mOQOLD.stores.ActivityValueListOffline, id, "activityName");
};

mOQOLD.getActivityImageURL = function(url){
		var loc = window.location;
		var nurl = loc.href.substr(0, loc.href.lastIndexOf("mobileNew/"));
		var cacheBuster = new Date().format('U');
		nurl = nurl + url + "&type=ACT&timestamp=" + cacheBuster;
		return nurl;
};

mOQOLD.getIncidentActivityName = function (id) {
	var title = mOQOLD.comboRenderer(mOQOLD.stores.IncidentActivityList, id, "name");

	return (title && title.length > 15) ? title.substring(0, 15) : title;
};

mOQOLD.hasObservationRecords = function (id) {
	var store;
	//if (!mOQOLD.checkOnline()) {
		store = mOQOLD.stores.ObservationListOffline;
	//} else {
	//	store = mOQOLD.stores.ObservationList;
	//}
	store.clearFilter();
	var value =store.findExact('actDetailID', id);
	return (value < 0) ? "" : "<div class=\"m-observationPresent\">&nbsp;</div>";
};

mOQOLD.getFormat = function (fname, lname) {
	//The Store was empty so added try catch to make page work. ( TEMP )
	var curOption = 1;
	try {
		curOption = mOQOLD.DefaultRec.get("nameDisplay");// mOQOLD.SiteSpecificRec.get('nameDisplay');
	} catch (Err) {
		curOption = 1;
	}
	return curOption == 1 ? (fname + " " + lname) : (lname + ", " + fname);
};

mOQOLD.OfflineHelper = Ext.extend(Object, {
	constructor: function (cfg) {
		Ext.apply(this, cfg);
		mOQOLD.OfflineHelper.superclass.constructor.call(this);
	},
	save: function () {
		var params = this.params;
		var rec = this.rec;
		var storeName = this.storeName;

//		if (mOQOLD.checkOnline() && !mOQOLD.testOffline) {
//		if(mOQOLD.enableMask) {
//			this.Mask = new Ext.LoadMask(Ext.getBody(), {
//				msg: "Saving..."
//			});
//			this.Mask.show();
//			}
//			Ext.Ajax.request({
//				url: "../index.php/direct/router",
//				params: params,
//				scope: this,
//				success: this.onSaveReturn
//			});
//			return false;
//		} else {
			params.offline = true;
			params.newItem = (typeof rec === "object") ? false : true;
			var store = mOQOLD.stores[storeName + "Offline"];
			if (rec !== null && typeof rec === "object") {
				rec = store.getById(rec.get('ID'));
				rec.set(params);
			} else {
				store.add(params);
			}
			store.sync();
			mOQOLD.offlineRecords++;
			if (mOQOLD.Main.showDebug()) {
				mOQOLD.FixedMsgBox.alert('Saved!!', 'Save happened in Local', Ext.emptyFn);
			}
			return true;
//		}
	},

	onSaveReturn: function (response) {
		
		var success = false;
		var result;
		try {
			result = Ext.decode(response.responseText).result;
			success = result.success;
		}
		catch (ex) {
			result = {}
		}

		if (result.success) {
			var recs;
			if (mOQOLD.Main.showDebug()) {
				mOQOLD.FixedMsgBox.alert('Saved!!', 'Save happened in Remote', Ext.emptyFn);
			}

			if(this.rec) {
				var exrec = this.store.getById(this.rec.get('ID'));
				if(exrec) {
				   this.store.remove(exrec);
				}
			}

			if (this.store) {
				recs = this.store.add(result.data);
			}
			var args = this.successArgs || [];
			args.push(result.data);
			args.push(recs ? recs[0] : null);
			this.success.apply(this.scope || this, args);
		} else {
			if (this.failure) {
				this.failureArgs = [result];
				this.failure.apply(this.scope || this, this.failureArgs);
			} else {
				mOQOLD.FixedMsgBox.show({
					title: 'Error!',
					msg: 'Save failed. Do you want to abort?',
					width: 300,
					buttons: Ext.MessageBox.YESNO,
					fn: function (btn, text) {
						if (btn == 'yes') {
							this.success.apply(this.scope || this, this.successArgs);
						}
					},
					scope: this
				});
			}
			return;
		}
		if(mOQOLD.enableMask) {
		this.Mask.hide();
		}
	}
});

mOQOLD.Usability = {

	info: {},

	update: function (options) {

		if(mOQOLD.LoggedIn || mOQOLD.testOffline) {
			mOQOLD.Main.startTimer();
		} else {
			if(mOQOLD.sessionTimeOutTask){
				mOQOLD.sessionTimeOutTask.cancel();
			}
			//reset the session timer
		}

		if (typeof options === 'string') {
			options = { actionName: options };
		}
		var store = mOQOLD.stores.Usability;
		var lastRec = store.getAt(store.getCount() - 1);
		var time = new Date();
		if (lastRec) {
			lastRec.set({ 'actionEtime': time, actionDuration: (time - lastRec.get('actionStime')) / 1000 });
		}
		store.add(Ext.apply(Ext.apply({ actionStime: time, rTime: time }, this.info), options));
		store.sync();
	}
};


mOQOLD.DateRange = {
	dates: [],
	isDateInRange: function(dateval){
		var currDay = dateval.format('Y-m-d');
		for(var i=0; i < this.dates.length; i++){
			if(this.dates[i] === currDay) return true;
		}
		return false;
	},

	resetRange: function(dateval){
		var startDayofWeek = dateval.add(Date.DAY, (0 - dateval.getDay()));
		var endDayofWeek = dateval.add(Date.DAY, (6 - dateval.getDay()));
		for( var i=1; i <=8 ; i++){
			if(this.isDateInRange(startDayofWeek) === false) {
				this.dates.push(startDayofWeek.format('Y-m-d'));
			}
			startDayofWeek = startDayofWeek.add(Date.DAY,1);

		}
	}

};


Ext.override(Ext.data.Store, {
	loadRecords: function (records, add) {
		if (records) {

			if (!add) {
				this.data.clear();
			}

			this.data.addAll(records);


			for (var i = 0, length = records.length; i < length; i++) {
				records[i].needsAdd = false;
				records[i].join(this);
			}


			this.suspendEvents();

			if (this.filterOnLoad && !this.remoteFilter) {
				this.filter();
			}

			if (this.sortOnLoad && !this.remoteSort) {
				this.sort();
			}

			this.resumeEvents();
			this.fireEvent('datachanged', this, records);

		} else {
			return false;
		}

	}

});
