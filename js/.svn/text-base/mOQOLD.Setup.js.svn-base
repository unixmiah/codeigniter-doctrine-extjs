mOQOLD.SetupWizard = Ext.extend(Ext.ux.Wiz, {

	loadMaskConfig: {
		'default': 'Saving...',
		'saving': 'Saving...',
		'loading': 'Loading...'
	},

	isFinishing: false,

	onNextClick: function () {
		this.isFinishing = false;
		this.saveData();
	},

	saveData: function () {
		var activeCard = this.cardPanel.layout.activeItem;
		var form;
		if (typeof activeCard.getForm === 'function') {
			form = activeCard.getForm();
		}
		if (!form || !form.api.submit) {
			this.moveToNext();
			return;
		} else if (form.isValid()) {
			this.showLoadMask(true, 'saving');
			form.submit({
				scope: this,
				success: this.onSaveSuccess,
				failure: this.onSaveFailure
			});
		}
	},

	onFinish: function () {
		this.isFinishing = true;
		this.saveData();
	},

	moveToNext: function () {
		var activeCard = this.cardPanel.layout.activeItem;
		if (typeof activeCard.setupOrder === 'number' && activeCard.setupOrder > -1) {
			mOQOLD.setupOrder = activeCard.setupOrder;
			Ext.app.LoginAPI.setWizardStep({ setupOrder: activeCard.setupOrder });
		}
		if (this.isFinishing) {
			mOQOLD.SetupWizard.superclass.onFinish.call(this);
		} else {
			mOQOLD.SetupWizard.superclass.onNextClick.call(this);
		}
	},

	onSaveSuccess: function (form, action) {
		this.showLoadMask(false);

		if (!action.result.success) {
			this.onSaveFailure(form, action);
			return;
		}

		this.moveToNext();
	},

	onSaveFailure: function (form, action) {
		Ext.Msg.alert("Save", "Save failed");
	}

});

mOQOLD.Setup = {

	createInitialCard: function () {
		this.initialCard = new Ext.Panel({
			autoLoad: { url: 'static/WizardStart.htm', nocache: true, callback: this.renderDefaultsButton, scope: this },
			title: 'Welcome',
			setupOrder: 0,
			plugins: [new Ext.ux.Wiz.plugins.Card()]
		});

		return this.initialCard;
	},

	renderDefaultsButton: function () {
		var panel = this.initialCard;
		var updater = panel.getUpdater();
		var text = Ext.fly('defaultButtonContainer').dom.innerHTML;
		var defaultsButton = new Ext.Button({ text: text, renderTo: 'defaultButtonContainer', scope: this, handler: this.doTakeDefaults });
	},

	doTakeDefaults: function (button) {
		Ext.getBody().mask('Inserting data..', 'x-mask-loading');
		Ext.app.initAPI.execInit(this.onTakeDefaultsReturn, this);
	},

	onTakeDefaultsReturn: function () {
		Ext.getBody().unmask();
		this.wizard.close();
		Ext.Msg.alert('Default Values', 'Default setup has been created. Click ok to enter the application');
	},

	show: function () {
		var pageRef = mOQOLD.pageRef;
		if (!pageRef) {
			return;
		}
		var setupOrder = Ext.num(mOQOLD.setupOrder, -1);
		var activeItemIndex = 0;
		for (var i = 0, len = pageRef.length; i < len; i++) {
			var page = pageRef[i];
			if (page.setupOrder) {
				if (setupOrder > -1 && activeItemIndex === 0 && Number(page.setupOrder) > setupOrder) {
					activeItemIndex = 1;
					break;
				}
			}
		}

		// If done all steps, don't show setup wizard again
		if (setupOrder > -1 && activeItemIndex === 0) {
			return;
		}

		var setupItems = [this.createInitialCard()];
		activeItemIndex = 0;
		for (var i = 0, len = pageRef.length; i < len; i++) {
			var page = pageRef[i];
			if (page.setupOrder) {
				setupItems.push(this.createCard(page));
				if (setupOrder > -1 && activeItemIndex === 0 && Number(page.setupOrder) > setupOrder) {
					activeItemIndex = setupItems.length - 1;
				}
			}
		}

		if (activeItemIndex === -1) {
			activeItemIndex = 0;
		}


		this.wizard = new mOQOLD.SetupWizard({
			title: 'Admin Setup',

			modal: true,

			headerConfig: {
				title: 'Admin Setup Wizard'
			},

			layoutConfig: {
				deferredRender: false
			},

			width: 800,

			height: 450,

			cardPanelConfig: {
				defaults: {
					bodyStyle: 'padding:5px 5px 5px 5px;background-color:#F6F6F6;',
					border: false
				},
				activeItem: activeItemIndex
			},

			cards: setupItems
		});

		this.wizard.show();
	},

	createCard: function (pageInfo) {
		var module = mOQOLD[pageInfo.name];
		if (!module) {
			Ext.Msg.alert("Couldn't create wizard for " + pageInfo.name);
			return;
		}

		var panel = module.createPanel({ isWizard: true });

		if (typeof panel.addEvents === 'undefined') {
			panel = Ext.ComponentMgr.create(panel);
		}

		var cardPlugin = new Ext.ux.Wiz.plugins.Card();
		cardPlugin.init(panel);

		Ext.apply(panel, {
			title: pageInfo.pageTitle,
			setupOrder: Ext.num(pageInfo.setupOrder),
			anchor: '-18'
		});

		return panel;
	}
};