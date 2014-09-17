Ext.ns("mOQOLD");

mOQOLD.ScoreButton = Ext.extend(Ext.SegmentedButton, {
	ui: 'light',
	enableToggle: true,
	height: 40,
	cls: 'scoreBtnFont',
	isField: true,
	getName: function () {
		return this.name || this.id;
	},
	initComponent: function () {
		if (!this.items) {
			var items = [];
			var qolStore = mOQOLD.stores.QOLScoreList;
			for (var i = 0; i < qolStore.getCount(); i++) {
				var rec = qolStore.getAt(i);
				items.push({
					text: String(rec.get('score')),
					value: parseInt(rec.get('score'))
				});

			}

			/**for (value = minValue; value <= maxValue; value++) {
				items.push({
					text: String(value),
					value: value
				});
			}*/
			this.items = items;
		}
		if (this.label) {
			this.items = [{ xtype: 'box', baseCls: 'x-form-label', style: "width: 15%;font-size:75%;font-weight: bold;", ctCls: 'x-field', html: this.label}].concat(this.items);
		}
		mOQOLD.ScoreButton.superclass.initComponent.call(this);
	},
	getValue: function () {
		var button = this.getPressed();
		if (!button) {
			return "";
		}
		return button.value;
	},
	setValue: function (value) {
		var button, i, len, items;
		items = this.items.items;
		for (i = 0, len = items.length; i < len; i++) {
			if (items[i].value == value) {
				button = items[i];
				break;
			}
		}
		if (button) {
			this.setPressed(button, true);
		}
	},
	reset: function () {
		/*While reset need to make all button unselected*/
		var button, i, len, items;
		items = this.items.items;
		for (i = 0, len = items.length; i < len; i++) {
			button = items[i];
			this.setPressed(button, false);
		}
	}
});
Ext.reg('moqold.score-button', mOQOLD.ScoreButton);
