Ext.ns("mOQOLD");

mOQOLD.LoginSignup = Ext.extend(Ext.TabPanel, {
	activeItem: 0,
	autoHeight: true,
	columnWidth: 1,

	forgotTitle: "Forgot Password",
	signupTitle: "Sign Up",
	loginTitle: "Log In",
	confirmTitle: "Confirm Account",

	initComponent: function () {
		this.items = this.buildForms();

		mOQOLD.LoginSignup.superclass.initComponent.call(this);

		this.addEvents("beforeconfirm", "beforelogin", "login", "beforesignup", "signup", "beforeforgot", "forgot");
	},

	buildForms: function () {
		if (this.activeItem === 4) {
			return [
				this.toggleForms(this.activeItem)
			];
		}
		if (this.activeItem === 3) {
			return [
				this.toggleForms(this.activeItem)
			];
		}
		return [
			this.toggleForms(0),
			this.toggleForms(1),
			this.toggleForms(2)
		];
	},

	toggleForms: function (which) {
		var isLogin = false;
		if (which === 4) {
			var formConfig = this.getChangePasswordConfig();
			var title = this.forgotTitle;
			this.on("add", function () { this.setActiveTab(0); }, this);
		} else if (which === 3) {
			var formConfig = this.getConfirmConfig();
			var title = this.confirmTitle;
			this.on("add", function () { this.setActiveTab(0); }, this);
		} else if (which === 2) {
			var formConfig = this.getForgotConfig();
			var title = this.forgotTitle;
		} else if (which === 1) {
			var formConfig = this.getSignupConfig();
			var title = this.signupTitle;
		} else {
			var formConfig = this.getLoginConfig();
			isLogin = true;
			var title = this.loginTitle;
		}

		var form = new Ext.form.FormPanel({
			autoHeight: true,
			frame: true,
			defaultType: "textfield",
			width: 400,
			paramAsHash: true,
			defaults: {
				anchor: "-20",
				allowBlank: false
			},
			formIndex: which,
			title: title,
			isLogin: isLogin,
			api: formConfig.api,
			items: formConfig.items,
			buttons: formConfig.buttons
		});

		return form;
	},

	getFormButtonConfigs: function () {
		return {
			login: { text: "Login", scope: this, handler: this.onLoginForm },
			signUp: { text: "Sign Up", scope: this, handler: this.onSignupForm },
			forgot: { text: "Send New Password", scope: this, handler: this.onForgotForm },
			forgot1: { text: "Change Password", scope: this, handler: this.onForgotForm1 },
			confirm: { text: "Confirm Account", scope: this, handler: this.onConfirmForm }
		};
	},

	getLoginConfig: function () {
		var config = {
			login: true
		};

		var enterListener = {
			scope: this,
			specialkey: function (f, e) {
				if (e.getKey() === e.ENTER) {
					this.onLoginForm();
				}
			}
		};

		var availButtons = this.getFormButtonConfigs();
		var buttons = [availButtons.login];

		config.buttons = buttons;

		config.items = [
			{ fieldLabel: "Login", vtype: 'login', name: "login", minLength: 4, maxLength: 20, maxLengthText: 'Login ID cannot exceed 20 characters', minLengthText: 'Login ID cannot be less than 4 characters', listeners: enterListener },
			{ fieldLabel: "Password", name: "password", inputType: "password", listeners: enterListener },
			{ name: "isdesktop", value: true, hidden: true }
		];

		config.api = {
			submit: Ext.app["LoginAPI"].doLogin
		};

		return config;
	},

	getSignupConfig: function () {
		var config = {};

		var enterListener = {
			scope: this,
			specialkey: function (f, e) {
				if (e.getKey() === e.ENTER) {
					this.onSignupForm();
				}
			}
		};

		var availButtons = this.getFormButtonConfigs();
		var buttons = [availButtons.signUp];
		config.buttons = buttons;

		var items = [
			{ xtype: "displayfield", hideLabel: true, value: "Please fill out all the required information below in order to create an account in mOQOLD. If you know your organization already has an account for this site, please contact your administrator and they will be able to setup a user name and password for you to access the system." }
		];

		var defaults = {
			allowBlank: false,
			anchor: "-20"
		};
		var maxMinLengthText = "Zip code must be a 5 digit numeric value.";
		var orgInfo = [
			{ fieldLabel: "Organization Name", name: "orgName", listeners: enterListener },
			{ xtype: "textfield", maxLength: 5, minLength: 5, maxLengthText: maxMinLengthText, minLengthText: maxMinLengthText, fieldLabel: "Zip Code", name: "zip", listeners: enterListener }
		];

		items.push({ xtype: "fieldset", title: "Orgainzation Information", anchor: "100%", defaults: defaults, defaultType: "textfield", items: orgInfo });

		var adminInfo = [
			{ fieldLabel: "Login", vtype: 'login', name: "login", listeners: enterListener, minLength: 4, maxLength: 20, maxLengthText: 'Login ID cannot exceed 20 characters', minLengthText: 'Login ID cannot be less than 4 characters' },
			{ fieldLabel: "Password", name: "password", inputType: "password", listeners: enterListener },
			{ fieldLabel: "Password (confirm)", name: "passwordConfirm", inputType: "password", listeners: enterListener },
			{ fieldLabel: "First Name", name: "firstName", listeners: enterListener },
			{ fieldLabel: "Last Name", name: "lastName", listeners: enterListener },
			{ fieldLabel: "Email", name: "email", vtype: "email", listeners: enterListener }
		];

		items.push({ xtype: "fieldset", title: "Access Information", anchor: "100%", defaults: defaults, defaultType: "textfield", items: adminInfo });

		items.push({
			xtype: "checkbox",
			boxLabel: "<span>Yes, I agree to mOQOLD Terms of Use.</span> <a class='sub-nav-item'>View here.</a>",
			hideLabel: true,
			name: "termsCheck",
			listeners: {
				scope: this,
				afterrender: this.onTermsAfterRender
			}
		});

		config.items = items;

		config.api = {
			submit: Ext.app["SignUpAPI"].doSignup
		};

		return config;
	},

	onTermsAfterRender: function (check) {
		var el = check.getEl();
		var label = el.next();
		var link = label.child(".sub-nav-item");
		link.on("click", this.onTermsClick, this);
	},

	onTermsClick: function () {
		var win = new Ext.Window({
			modal: true,
			width: 600,
			height: 400,
			title: "mOQOLD Terms of Use",
			autoLoad: "static/Terms.htm"
		});
		win.show();
	},

	getChangePasswordConfig: function () {
		var config = {};

		var enterListener = {
			scope: this,
			specialkey: function (f, e) {
				if (e.getKey() === e.ENTER) {
					this.onForgotForm1();
				}
			}
		};

		var availButtons = this.getFormButtonConfigs();
		var buttons = [availButtons.forgot1];
		config.buttons = buttons;

		var token = this.token || null;

		config.items = [
			{ fieldLabel: "Token", name: "t", value: token, listeners: enterListener },
			{ fieldLabel: "Password", name: "password", inputType: "password", listeners: enterListener },
			{ fieldLabel: "Password (confirm)", name: "password1", inputType: "password", listeners: enterListener }
		];

		config.api = {
			submit: Ext.app["LoginAPI"].resetPassword
		};

		return config;
	},

	getForgotConfig: function () {
		var config = {};

		var enterListener = {
			scope: this,
			specialkey: function (f, e) {
				if (e.getKey() === e.ENTER) {
					this.onForgotForm();
				}
			}
		};

		var availButtons = this.getFormButtonConfigs();
		var buttons = [availButtons.forgot];
		config.buttons = buttons;

		config.items = [
			{ fieldLabel: "Email", name: "email", vtype: "email", listeners: enterListener }
		];

		config.api = {
			submit: Ext.app["LoginAPI"].doForgot
		};

		return config;
	},

	getConfirmConfig: function () {
		var config = {};

		var enterListener = {
			scope: this,
			specialkey: function (f, e) {
				if (e.getKey() === e.ENTER) {
					this.onForgotForm();
				}
			}
		};

		var availButtons = this.getFormButtonConfigs();
		var buttons = [availButtons.confirm];
		config.buttons = buttons;

		config.items = [
			{ fieldLabel: "Login", name: "login", listeners: enterListener, minLength: 4, maxLength: 45, minLengthText: 'Login ID cannot be less than 4 characters' },
			{ fieldLabel: "Password", name: "password", inputType: "password", listeners: enterListener },
			{ fieldLabel: "Password (confirm)", name: "passwordConfirm", inputType: "password", listeners: enterListener },
			{ fieldLabel: "Email", name: "email", vtype: "email", listeners: enterListener }
		];

		config.api = {
			submit: Ext.app["LoginAPI"].doConfirm
		};

		return config;
	},

	onLoginForm: function () {
		if (this.fireEvent("beforelogin", this) === false) {
			return;
		}

		var form = this.getActiveTab().getForm();
		if (form.isValid() === true) {
			this.msgBox = Ext.Msg.wait("Sending...", "Logging In");
			form.submit({
				success: this.onLoginSuccess,
				failure: this.onFormFailure,
				scope: this
			});
		} else {
			this.showValidationError();
		}
	},

	showValidationError: function () {
		Ext.Msg.alert('Error!', 'Please fill-in all the required fields');
		return;
	},

	onConfirmForm: function () {
		//		if (this.fireEvent("beforeconfirm", this) === false) {
		//			return;
		//		}

		var form = this.getActiveTab();
		form = form.getForm();
		if (!form.isValid()) {
			Ext.Msg.alert('Error!', 'You must fill-in all the required fields!');
			return;
		}
		var pass = form.findField('password');
		var pass1 = form.findField('passwordConfirm');
		if (pass.getValue() !== pass1.getValue()) {
			Ext.Msg.alert("Error!", "The passwords you have entered do not match.");
			pass1.markInvalid();
			return;
		}

		this.msgBox = Ext.Msg.wait("Sending...", "Confirming your account...");
		form.submit({
			success: this.onConfirmSuccess,
			failure: this.onConfirmFailure,
			scope: this
		});
	},

	onConfirmFailure: function (form, action) {
		var result = action.result;
		this.msgBox.hide();
		this.msgBox = null;
		var msg = result.msg || "Your Confirm attempt has failed. Please make sure you entered all information right!!";
		Ext.Msg.alert('Login', msg);
		return true;
	},
	onFormFailure: function (form, action) {
		var result = action.result;
		this.msgBox.hide();
		this.msgBox = null;
		if (result.success === false) {
			var msg = result.msg || "Your login attempt has failed. Please make sure your username and password is correct! If you forgot your password, click on the 'Forgot Password' button to retrieve your password.";
			Ext.Msg.alert('Login', msg);
			return false;
		}
		return true;
	},

	onLoginSuccess: function (form, action) {
		var result = action.result;
		delete result.success;
		Ext.apply(mOQOLD, result);
		this.msgBox.hide();
		mOQOLD.sessionTimeOut = result.sessionTimeOut;
		if (mOQOLD.sessionTimeOut && mOQOLD.sessionTimeOut > 0) {
			mOQOLD.sessionTimeOutTask.delay(mOQOLD.sessionTimeOut * 1000);
		} else {
			mOQOLD.sessionTimeOutTask.cancel();
		}
		this.msgBox = null;
		this.fireEvent("login", this);
	},

	onConfirmSuccess: function (form, action) {
		var result = action.result;
		delete result.success;
		Ext.apply(mOQOLD, result);
		this.msgBox.hide();
		this.msgBox = null;
		this.fireEvent("login", this);

		Ext.Msg.alert("Confirm", "You have successfully confirmed.", function (btn) {
			//location.href = "#Account|type=LogIn";
			location.href = "#Home";
		});

	},

	onSignupSuccess: function (form, action) {
		var check = this.onFormFailure(form, action);
		if (check) {
			this.fireEvent("signup", this);
		}
	},

	onSignupForm: function () {
		if (this.fireEvent("beforesignup", this) === false) {
			return;
		}

		var form = this.getActiveTab();
		form = form.getForm();
		if (!form.isValid()) {
			Ext.Msg.alert('Error!', 'You must fill-in all the required fields!');
			return;
		}

		if (form.findField('termsCheck').getValue() !== true) {
			Ext.Msg.alert("Error!", "You must agree to the mOQOLD Terms of Use.");
			return;
		}

		var pass = form.findField('password');
		var pass1 = form.findField('passwordConfirm');
		if (pass.getValue() !== pass1.getValue()) {
			Ext.Msg.alert("Error!", "The passwords you have entered do not match.");
			pass1.markInvalid();
			return;
		}


		if (form.isValid() === true) {
			this.msgBox = Ext.Msg.wait("Sending...", "Signing Up");
			try {
				form.submit({
					success: this.onSignupSuccess,
					failure: this.onFormFailure,
					scope: this
				});
			} catch (err) {
				this.msgBox.hide();
				this.msgBox = null;
				Ext.Msg.alert("Error", "Error while signing up!");
			}
		}
	},

	onForgotForm: function () {
		if (this.fireEvent("beforeforgot", this) === false) {
			return;
		}

		var form = this.getActiveTab();
		var basic = form.getForm();

		var values = basic.getValues();

		if (values.password !== values.password1) {
			var pass = form.getComponent(1);
			pass.markInvalid();
			var pass1 = form.getComponent(2);
			pass1.markInvalid();
			Ext.Msg.alert("Error", "The passwords you have entered do not match!");
			return;
		}

		if (basic.isValid() === true) {
			this.msgBox = Ext.Msg.wait("Sending...", "Requesting New Password");
			basic.submit({
				success: this.onForgotSuccess,
				failure: this.onFormFailure,
				scope: this
			});
		}
	},

	onForgotForm1: function () {
		if (this.fireEvent("beforeforgot", this) === false) {
			return;
		}

		var form = this.getActiveTab();
		var basic = form.getForm();

		var values = basic.getValues();

		if (values.password !== values.password1) {
			var pass = form.getComponent(1);
			pass.markInvalid();
			var pass1 = form.getComponent(2);
			pass1.markInvalid();
			Ext.Msg.alert("Error", "The passwords you have entered do not match!");
			return;
		}

		if (basic.isValid() === true) {
			this.msgBox = Ext.Msg.wait("Sending...", "Changing Password");
			basic.submit({
				success: this.onForgotSuccess,
				failure: this.onFormFailure,
				scope: this
			});
		}
	},

	onForgotSuccess: function () {
		this.msgBox.hide();
		this.msgBox = null;

		Ext.Msg.alert('Success', 'Your request was successful');

		location.href = "#";

		this.fireEvent("forgot", this);
	}
});

Ext.reg("moqold.loginsignup", mOQOLD.LoginSignup);