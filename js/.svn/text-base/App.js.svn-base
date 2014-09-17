Ext.ns("mOQOLD");

Ext.app.REMOTING_API.url = "index.php/direct/router";
Ext.app.REMOTING_API.enableBuffer = 50;
Ext.Direct.addProvider(Ext.app.REMOTING_API);
Ext.override(Ext.data.Field, { useNull: true, dateFormat: 'Y-m-d' });

Ext.onReady(function () {
	Ext.QuickTips.init();
	Ext.form.Field.prototype.msgTarget = "side";

	mOQOLD.Main = new mOQOLD.App();

});

Ext.apply(Ext.form.VTypes, {
	phoneRe: /^(\d{3}-){2}(\d{4})$/,
	phoneMask: /[\d-]/,
	phoneText: 'Not a valid phone number.  Must be in the format 123-456-7890',
	phone: function (v) {
		return Ext.form.VTypes["phoneRe"].test(v);
	},

	zipRe: /^\d{5}(-\d{4})?$/,
	zipMask: /[\d-]/,
	zipText: 'Not a valid zip.  Must be in the format 12345 or 12345-1111 (dashes optional)',
	zip: function (v) {
		return Ext.form.VTypes["zipRe"].test(v);
	},
	login: function () {
		var re = /^[a-zA-Z][-_a-zA-Z0-9]{0,30}$/;
		return function (v) { return re.test(v); }
	} (),
	loginText: 'Allowed characters are - and _ along with alpha numeric'

});

/*Ext.apply(Ext.DomHelper, {
oldInsertHtml: Ext.DomHelper.insertHtml,
insertHtml: function (where, el, html) {
if (!el) {
debugger;
}
return this.oldInsertHtml(where, el, html);
}
});*/

Ext.override(Ext.ensible.cal.CalendarView, {
	onDataChanged: function (store) {
		Ext.ensible.log('onDataChanged');
		if (this.ownerCt) {
			this.refresh();
		}
	}
});

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
		var colonInx = this.timeStr.indexOf(":");
		var spaceInx = this.timeStr.indexOf(" ");
		this.hour = parseInt(this.timeStr.substring(0, colonInx));
		this.mins = parseInt(Ext.util.Format.trim(this.timeStr.substring(colonInx + 1, spaceInx)));
		if (Ext.util.Format.trim(this.timeStr.substring(spaceInx, this.timeStr.length)) === "AM") {
			this.isAM = true;
		} else { this.isAM = false; }
	},
	validateString: function () {
		var timeExp = new RegExp("^([1-9]|1[0-2]|0[1-9]){1}(:[0-5][0-9] [aApP][mM]){1}$");
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
	}

});
