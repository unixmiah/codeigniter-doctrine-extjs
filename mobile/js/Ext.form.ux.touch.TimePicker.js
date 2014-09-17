/*
    Author       : Mitchell Simoens
    Site         : http://simoens.org/Sencha-Projects/demos/
    Contact Info : mitchellsimoens@gmail.com
    Purpose      : Create Instance of Time Picker Field
	
	License      : GPL v3 (http://www.gnu.org/licenses/gpl.html)
    Warranty     : none
    Price        : free
    Version      : 1.0b
    Date         : 01/09/2011
*/

Ext.ns("Ext.form.ux.touch");

Ext.form.ux.touch.TimePicker = Ext.extend(Ext.form.Field, {
	ui: 'select',
	picker: null,
	destroyPickerOnHide: false,
	initComponent: function() {
		this.addEvents(
			'select'
		);
		
		this.tabIndex = -1;
		this.useMask = true;
		
		Ext.form.Text.superclass.initComponent.apply(this, arguments);
	},
	
	getHours: function() {
		var data = [];
		
		for (var hour = 1; hour < 13; hour++) {
			data.push({ text: hour, value: hour });
		}
		
		return data;
	},
	
	getMinutes: function() {
		var data = [];
		
		for (var min = 0; min < 60; min++) {
			data.push({ text: min, value: min });
		}
		
		return data;
	},
	
	getAmPm: function() {
		return [
			{ text: "am", value: "am" },
			{ text: "pm", value: "pm" }
		];
	},
	
	createPicker: function(pickerConfig) {
		var slots = [
			{
				name: "hours",
				title: "Hours",
				data: this.getHours()
			},
			{
				name: "minutes",
				title: "Minutes",
				data: this.getMinutes()
			},
			{
				name: "ampm",
				title: "AM/PM",
				data: this.getAmPm()
			}
		];
		
		pickerConfig.slots = slots;
		
		return new Ext.Picker(pickerConfig);
	},
	
	getTimePicker: function() {
		if (!this.timePicker) {
			if (this.picker instanceof Ext.Picker) {
				this.timePicker = this.picker;
			} else {
				this.timePicker = this.createPicker(this.picker || {});
			}
			var value = {};
			if (this.value !== "") {
				var split = this.value.split(":");
				value = {
					hours: split[0],
					minutes: split[1].substr(0, 2),
					ampm: split[1].substr(2)
				};
			}
			
			this.timePicker.setValue(value);
			
			this.timePicker.on({
				scope : this,
				change: this.onPickerChange,
				hide  : this.onPickerHide
			});
		}
		
		return this.timePicker;
	},
	
	onMaskTap: function() {
		if (Ext.form.ux.touch.TimePicker.superclass.onMaskTap.apply(this, arguments) !== true) {
			return false;
		}
		
		this.getTimePicker().show();
	},
	
	onPickerChange : function(picker, value) {
		this.setValue(value);
		this.fireEvent('select', this, this.getValue());
	},
	
	onPickerHide: function() {
		if (this.destroyPickerOnHide && this.timePicker) {
			this.timePicker.destroy();
		}
	},
	//todo: fix date object
	setValue: function(value, animated) {
		if (typeof value === "object") {
			var hours = value.hours,
				minutes = value.minutes,
				ampm = value.ampm,
				now = new Date();
			
			if (hours !== 12 && ampm === "pm") {
				hours += 12;
			}
			
			now.setHours(hours);
			now.setMinutes(minutes);
			
			value = now.format("g:ia");
		}
		
		this.value = value;
		
		if (this.rendered) {
			this.fieldEl.dom.value = this.getValue(true);
		}
		
		return this;
	},
	
	getValue: function() {
		return this.value || null;
	},
	
	onDestroy: function() {
		if (this.timePicker) {
			this.timePicker.destroy();
		}

		Ext.form.ux.touch.TimePicker.superclass.onDestroy.call(this);
	}
});

Ext.reg("timepickerfield", Ext.form.ux.touch.TimePicker);