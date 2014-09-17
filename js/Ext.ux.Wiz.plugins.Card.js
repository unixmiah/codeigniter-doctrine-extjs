Ext.ns("Ext.ux.Wiz.plugins");

Ext.ux.Wiz.plugins.Card = Ext.extend(Object, {

	constructor: function (cfg) {
		Ext.apply(this, cfg);
		Ext.ux.Wiz.plugins.Card.superclass.constructor.call(this);
	},

	init: function (panel) {
		this.panel = panel;

		Ext.applyIf(panel, {
			header: false,
			hideMode: 'display',
			isValid: this.isValid
		});

		panel.on('beforedestroy', function (panel) {
			this.panel = null;
		}, this);

		panel.addEvents('beforecardhide');

		this.initEvents();
	},

	isValid: function () {
		return true;
	},

	initEvents: function () {

		var panel = this.panel;
		panel.on({
			'beforehide': this.bubbleBeforeHideEvent,
			'beforecardhide': panel.isValid,
			'show': this.onCardShow,
			'hide': this.onCardHide,
			scope: panel
		});
	},

	bubbleBeforeHideEvent: function () {
		var ly = this.ownerCt.layout;
		var activeItem = ly.activeItem;

		if (activeItem && activeItem.id === this.id) {
			return this.fireEvent('beforecardhide', this);
		}

		return true;
	},

	onCardHide: function () {
		if (this.monitorValid) {
			this.stopMonitoring();
		}
	},

	onCardShow: function () {
		if (this.monitorValid) {
			this.startMonitoring();
		}
	}
});