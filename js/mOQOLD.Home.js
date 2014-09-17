Ext.ns("mOQOLD");

mOQOLD.HomePanel = Ext.extend(Ext.Container, {
	autoScroll: true,
	columnWidth: 1,
	initComponent: function () {
		mOQOLD.HomePanel.superclass.initComponent.call(this);

		this.on("afterrender", this.onStatusChange, this);
	},

	initialItem: {
		title: "Welcome to the mOQOLD Site",
		autoLoad: 'static/Welcome.htm'
	},

	buildItems: function () {
		var text = "Drag me around";

		var twitterPanel = new mOQOLD.Twitter();

		var leftCol = [this.initialItem];

		var rightCol = [twitterPanel];
		var totalOwner = mOQOLD.Main;
		if (mOQOLD.Main.isLoggedIn === true || typeof mOQOLD.Main.isLoggedIn === "undefined") {
			// todo: send call to server to get position of widgets
			rightCol.unshift(new mOQOLD.HomeMessages());
//			leftCol.push({
//				title: "Tasks & Alerts",
//				html: text
//			});
		} else {
			var formPortlet = new Ext.ux.Portlet();

			var form = new mOQOLD.LoginSignup({
				hideCancel: true,
				hideTitle: false,
				loginTitle: "Login",
				signupTitle: "Sign Up",
				forgotTitle: "Forgot Password",
				owner: formPortlet
			});

			formPortlet.add(form);

			form.on("login", this.onLoginSuccess, this);
			leftCol.push(formPortlet);
		}

		return {
			xtype: "portal",
			items: [{
				columnWidth: .5,
				style: "padding:10px 0 10px 10px",
				items: leftCol
			}, {
				columnWidth: .5,
				style: "padding:10px 0 10px 10px",
				items: rightCol
			}]
		};
	},

	onLoginSuccess: function () {
		this.ownerCt.handleLoginStatus(true);
	},

	onStatusChange: function () {
		this.removeAll();
		if (mOQOLD.Main.isLoggedIn === false) { return; }
		var items = this.buildItems();
		this.add(items);
		this.doLayout();
	}
});

Ext.reg("moqold.home", mOQOLD.HomePanel);