/*global mOQOLD, Ext */
Ext.ns("mOQOLD");
Ext.ns("Ext.ux.util");
mOQOLD.LongDateFormat = "m-d-Y H:i:s";
mOQOLD.MediumDateTimeFormat = "m-d H:i";
mOQOLD.offlineRecords = 0;
Ext.override(Ext.data.Field, { useNull: true });
mOQOLD.enableMask = true;

Ext.setup({
	tabletStartupScreen: 'tablet_startup.png',
	phoneStartupScreen: 'phone_startup.png',
	icon: 'icon.png',
	glossOnIcon: false,
	fullscreen: true,
	onReady: function() {
		mOQOLD.Main = new mOQOLD.App();
	}
});

mOQOLD.Colors = [
	"FA7166", "CF2424", "A01A1A", "7E3838", "CA7609", "F88015", "EDA12A", "D5B816", "E281CA", "BF53A4", "9D3283",
	"7A0F60", "542382", "7742A9", "8763CA", "B586E2", "7399F9", "4E79E6", "2951B9", "133897", "1A5173", "1A699C",
	"3694B7", "64B9D9", "A8C67B", "83AD47", "2E8F0C", "176413", "0F4C30", "386651", "3EA987", "7BC3B5"
];

mOQOLD.checkOnline = function() {
	return mOQOLD.testOffline ? false : navigator.onLine;
};

mOQOLD.getStore = function (storeName) {
	return mOQOLD.stores[storeName + (mOQOLD.checkOnline() ? "" : "Offline")];
};

mOQOLD.FormRequiredCheck = function(form) {
	var valid = true;
	var items = form.items;
	
	items.each(function(item) {
		if (valid && item.required) {
			if (item.getValue() === "") {
				valid = false;
			}
		}
	});
	
	if (!valid) {
		Ext.Msg.alert("Saving form", "Some fields are required. Please go back and check the form.", Ext.emptyFn);
	}
	
	return valid;
}

Ext.ux.util.SplitDateTime = Ext.extend(Object, {
	constructor: function (config) {
		Ext.apply(this, config);
		Ext.ux.util.SplitDateTime.constructor.call(this);
	},

	timeFormat: "g:ia",

	split: function (data) {
		var fields = this.fields;
		var i, len;
		for (i = 0, len = fields.length; i < len; i++) {
			var fieldInfo = fields[i];
			var field = fieldInfo.field;
			var dateField = fieldInfo.dateField || field + 'Date';
			var timeField = fieldInfo.timeField || field + 'Time';
			var value = data[field];
			var dateValue = null;
			var timeValue = null;
			if (Ext.isDate(value)) {
				dateValue = value.clone().clearTime();
				timeValue = value.format(this.timeFormat);
			}
			data[dateField] = dateValue;
			data[timeField] = timeValue;
		}
	},

	join: function (data) {
		var fields = this.fields;
		var i, len;
		for (i = 0, len = fields.length; i < len; i++) {
			var fieldInfo = fields[i];
			var field = fieldInfo.field;
			var dateField = fieldInfo.dateField || field + 'Date';
			var timeField = fieldInfo.timeField || field + 'Time';
			var value = data[dateField];
			if (Ext.isDate(value)) {
				value = value.clone();

				var time = data[timeField];
				var split = time.split(":");
				var hours = parseInt(split[0]);
				var minutes = parseInt(split[1].substr(0, 2));
				var ampm = split[1].substr(2);

				if (hours !== 12 && ampm === "pm") {
					hours += 12;
				} else if (hours === 12 && ampm === "am") {
					hours = 0;
				}
				value.setHours(hours);
				value.setMinutes(minutes);
			} else {
				value = null;
			}
			data[field] = value;
		}
	}
});


// Fix for blank values
Ext.form.Select.override({
	setValue: function (value) {
		var idx = -1,
            hiddenField = this.hiddenField,
            record;

		if (value) {
			idx = this.store.findExact(this.valueField, value)
		}
		record = this.store.getAt(idx);

		if (record && this.rendered) {
			this.fieldEl.dom.value = record.get(this.displayField);
			this.value = record.get(this.valueField);
			if (hiddenField) {
				hiddenField.dom.value = this.value;
			}
		} else {
			if (this.rendered) {
				this.fieldEl.dom.value = value;
			}
			this.value = value;
		}


		if (this.picker) {
			var pickerValue = {};
			pickerValue[this.name] = this.value;
			this.picker.setValue(pickerValue);
		}

		return this;
	}
});

Ext.data.Store.override({
	pageSize: 0,

	findByExact: function (fieldName, value) {
		var index = this.findExact(fieldName, value);
		if (index > -1) {
			return this.getAt(index);
		}
		return null;
	}
});

Ext.form.ux.PinField = Ext.extend(Ext.form.Password, {
	afterRender: function () {
		this.fieldEl.set({ 'pattern': '[0-9]*' });
		Ext.form.ux.PinField.superclass.afterRender.call(this);
	}
});
Ext.reg('ux.pinfield', Ext.form.ux.PinField);

mOQOLD.TimeObject = Ext.apply({}, {
	timeStr: "",
	hour: 0,
	mins: 0,
	isAM: true,
	isValid: function (str) {
		if (typeof (str) === "string") {
			this.timeStr = str;
			if (!this.validateString()) {
				return false;
			}
			this.parseTimeString();
			return this.validate();
		}

	},
	parseTimeString: function () {
		var split = this.timeStr.split(":");

		this.hour = parseInt(split[0]);
		this.mins = parseInt(split[1].substr(0, 2));
		if (split[1].substr(2) === "am") {
			this.isAM = true;
		} else { this.isAM = false; }
	},
	validateString: function () {
		var timeExp = new RegExp("^([1-9]|1[0-2]|0[1-9]){1}(:[0-5][0-9][aApP][mM]){1}$");
		return timeExp.test(this.timeStr);
	},
	validate: function () {
		/**
		if AM then allow hr are 7 - 11
		if PM then allow hr are 12 - 7 
		*/
		if (this.isAM) {

			if (this.hour < 7 || this.hour > 11) {
				return false;
			} else {
				return true;
			}
		} else {
			if (this.hour > 7 && this.hour != 12) {
				return false;
			} else {
				return true;
			}
		}

	},

});

Ext.override(Ext.MessageBox, {
    onRender: Ext.util.Functions.createSequence(Ext.MessageBox.prototype.onRender, function() {
        this.mon(this.el, 'DOMFocusOut', function() {
            Ext.Viewport.scrollToTop();
        });
    })
});
