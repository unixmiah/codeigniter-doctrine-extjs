Ext.ns("mOQOLD");

mOQOLD.ActivityDetail = new mOQOLD.MaintenanceGridAbstract({
	baseAPI: "ActivityDetailAPI",
	labelWidth: 100,
	moduleName: "Calendar",
	autoLoadForm: true,
	formButtons: function () {
		return ["ical", "del", "save", "cancel"];
	},
	onAddToCalendar: function (btn, e) {
		var loc = window.location;
		var url = loc.href.substr(0, loc.href.lastIndexOf("/") + 1);
		btn.setParams({ href: url + 'iCal.php?id=' + mOQOLD.ActivityDetail.id });
		btn.fireEvent("click", btn, e);

	},
	onDeleteForm: function () {
		var isthisrecurrence = (Ext.isEmpty(this.form.getForm().getValues().rrule)) ? false : true;

		if (isthisrecurrence) {
			Ext.MessageBox.confirm("Confirm", "Do you want to delete this series ?<br> Note: This will not remove any events with observations in the series.", function (btn) {
				if (btn === "yes") {
					Ext.app.ActivityDetailAPI.deleteEvent({ ID: this.id, isSeriesDelete: true }, this.afterDelete, this);
				}
				else {
					Ext.app.ActivityDetailAPI.deleteEvent({ ID: this.id }, this.afterDelete, this);
				}
			}, this);
		} else {
			Ext.app.ActivityDetailAPI.deleteEvent({ ID: this.id }, this.afterDelete, this);
		}

	},
	afterDelete: function (response, exception) {
		if (response) {
			if (response.success) {
				Ext.Msg.alert("Delete!!!", response.msg);
				this.form.ownerCt.close();
				if (mOQOLD.Calendar.calendar) {
					mOQOLD.Calendar.calendar.store.reload();
				} else {
					mOQOLD.Observations.calendar.store.reload();
				}
			} else {
				Ext.Msg.alert("Delete!!!", response.msg);
			}

		} else {

			Ext.Msg.alert(exception.type, exception.message, Ext.emptyFn);

		}
	},
	onCancelForm: function () {
		this.form.ownerCt.close();
	},
	getFormConfig: function () {
		return {
			layout: 'fit',
			border: false,
			autoHeight: false
		}
	},

	setLocation: function (params) {
		params.Observations = this.Observations;
		mOQOLD.MaintenanceGridAbstract.prototype.setLocation.call(this, params);
	},

	updateDuration: function (field) {
		var form = this.form.getForm();
		var startDate = form.findField('startDate');
		var startTime = form.findField('startTime');

		var endDate = form.findField('endDate');
		var endTime = form.findField('endTime');

		if (field === startDate && field.isValid()) {
			endDate.setValue(startDate.getValue());
		}

		if (field === startTime && field.isValid()) {
			var record = startTime.findRecord(startTime.valueField, startTime.getValue());
			if (record) {
				var recordIndex = startTime.store.indexOf(record) + 4;
				if (recordIndex < (startTime.store.getCount() - 1)) {
					endTime.setValue(startTime.store.getAt(recordIndex).get(startTime.displayField));
				}
			}
		}

		var duration = 0;
		if (startDate.isValid() && startTime.isValid() && endDate.isValid && endTime.isValid()) {
			var start = this.combineDateTime(startDate, startTime);
			var end = this.combineDateTime(endDate, endTime);
			duration = Math.floor((end - start) / 1000 / 60);
		}

		if (startDate.isValid()) {
			endDate.setMinValue(startDate.getValue());
		}

		form.findField('actDtlDuration').setValue(duration);
	},

	combineDateTime: function (dateField, timeField) {
		return Date.parseDate(dateField.getRawValue() + ' ' + timeField.getRawValue(), dateField.format + ' ' + timeField.format);
	},

	createActInfoItems: function () {

		this.recurField = new Ext.ensible.cal.RecurrenceField({
			frequency: "NONE",
			flex: 1,
			name: "rr",
			id: "rr",
			enableFx: true,
			name: "recurranceDetails"

		});

		this.imageViewer = new mOQOLD.ImageViewer({ activityID: this.id, apiFunction: { read: Ext.app["PhotoAPI"].getImagesForActivity }
		});

		if (this.clickedDate) {
			this.recurField.startDate = this.clickedDate;
		}

		this.icalTxt = { id: 'rrule', xtype: "textfield", hidden: true, value: "", name: "rrule" };

		var startDate = {
			xtype: "compositefield",
			fieldLabel: "Start Date",
			defaults: { xtype: "textfield", allowBlank: false },
			items: [
				{ xtype: "datefield", name: "startDate", listeners: { change: this.updateDuration, scope: this }, allowBlank: false },
				{ xtype: "timefield", name: "startTime", increment: 15, listeners: { change: this.updateDuration, scope: this }, allowBlank: false }
			]
		};

		var endDate = {
			xtype: "compositefield",
			fieldLabel: "End Date",
			defaults: { xtype: "textfield", allowBlank: false },
			items: [
				{ xtype: "datefield", name: "endDate", listeners: { change: this.updateDuration, scope: this }, allowBlank: false },
				{ xtype: "timefield", name: "endTime", increment: 15, listeners: { change: this.updateDuration, scope: this }, allowBlank: false }
			]
		};

		var activitycombo = { xtype: "ux.combo", comboType: "activity", allowBlank: false }
		if (this.activityIDValue) {
			Ext.applyIf(activitycombo, { value: this.activityIDValue });
		}

		var leftFields = [
			{ xtype: "hidden", value: "ID" },
			activitycombo,
			startDate,
			endDate,
			{ xtype: "numberfield", name: "actDtlDuration", fieldLabel: "Duration", readOnly: true, minValue: 15, allowBlank: false }
		];
		var rightFields = [
			this.icalTxt, { id: 'atcRecurrID', xtype: "textfield", hidden: true, value: "", name: "atcRecurrID" },
			{ xtype: "ux.combo", comboType: "staff", name: "staffID", fieldLabel: "Leader", allowBlank: false /*, insert: { fullName: "ALL STAFF"}*/ },
			{ xtype: "ux.combo", comboType: "location", name: "locationTypeID", fieldLabel: "Location", allowBlank: false }, this.recurField
		];

		delete this.date;
		return {
			title: "Activity Information",
			layout: 'column',
			defaults: { layout: 'form', defaults: { anchor: "-20"} },
			items: [{ items: leftFields, labelWidth: 70, columnWidth: 0.4 }, { items: rightFields, labelWidth: 70, columnWidth: 0.6 }, { layout: 'fit', columnWidth: 1, items: this.imageViewer}]
		};
	},
	onLoadSuccess: function (form, response) {
		var recData = {};
		if (response.result.data) {
			Ext.apply(recData, response.result.data);
		}

		if (recData.atcRecurrID) {
			this.recurField.setValue(recData.rrule);
			this.isRecurEnabled = true;
		}

		var animalCombo = form.findField('animalTypeID');
		var noiseCombo = form.findField('noiseTypeID');
		if (recData.hasAnimal !== null && recData.hasAnimal !== "1" && animalCombo) {
			animalCombo.disable();
		} else {
			if (animalCombo) { animalCombo.enable(); }
		}

		if (recData.noiseInd !== null && recData.noiseInd !== "1" && noiseCombo) {
			noiseCombo.disable();
		} else {
			if (noiseCombo) { noiseCombo.enable(); }
		}

	},
	onBeforeSaveForm: function () {
		/*var values = this.form.getForm().getValues();
		values.rrule = (this.isRecurEnabled) ? this.recurField.getValue() : "";
		if (mOQOLD.TimeObject.isValid(values.startTime)) {
		if (mOQOLD.TimeObject.isValid(values.endTime)) {
		this.form.getForm().setValues(values);
		this.onSaveForm();
		} else {
		Ext.Msg.alert("Validate Error", "End Time should be between 7 AM to 7:59 PM");
		}
		} else {
		Ext.Msg.alert("Validate Error", "Start Time should be between 7 AM to 7:59 PM");
		}*/


		var values = this.form.getForm().getValues();
		values.rrule = (this.isRecurEnabled) ? this.recurField.getValue() : "";
		var rrule = values.rrule;
		if (this.recurField.frequency === 'NONE') {
			this.checkRecurrence(values, rrule);
		}
		else {
			if (this.recurField.until.getValue() === "") {
				Ext.Msg.alert("Validate Error", "Please select for or until");
			}
			else {
				this.checkRecurrence(values, rrule);
			}
		}

	},
	checkRecurrence: function (values, rrule) {
		var values = values;
		var rrule = rrule;
		if (mOQOLD.TimeObject.isValid(values.startTime)) {
			if (mOQOLD.TimeObject.isValid(values.endTime)) {
				this.form.getForm().setValues(values);
				this.onSaveForm();
			} else {
				Ext.Msg.alert("Validate Error", "End Time should be between 7 AM to 7:59 PM");
			}
		} else {
			Ext.Msg.alert("Validate Error", "Start Time should be between 7 AM to 7:59 PM");
		}
	},
	createActEnviItems: function () {
		var rightFields = [
			{ xtype: "ux.combo", comboType: "numbers", name: "numStaff", fieldLabel: "Num Staff", store: new Ext.data.ArrayStore({ fields: ["num"], data: Ext.ux.Combo.getNumbers(0, 100) }) },
			{ xtype: "ux.combo", comboType: "numbers", name: "numVolunteer", fieldLabel: "Num Volunteer", store: new Ext.data.ArrayStore({ fields: ["num"], data: Ext.ux.Combo.getNumbers(0, 100) }) },
			{ xtype: "ux.combo", comboType: "noise", fieldLabel: "Noise" },
			{ xtype: "ux.combo", comboType: "animal", fieldLabel: "Animal" },
			{ xtype: "ux.combo", comboType: "weather", fieldLabel: "Weather" }
		];

		var leftFields = [
			{ xtype: "hidden", value: "ID" },
			{ xtype: "ux.combo", comboType: "numbers", name: "numParticipant", fieldLabel: "Num Participants", store: new Ext.data.ArrayStore({ fields: ["num"], data: Ext.ux.Combo.getNumbers(0, 100) }) },
			{ xtype: "radiogroup", name: "hasFriendFamily", fieldLabel: "Has Friend/Family", items: [
				{ boxLabel: "No", name: "hasFriendFamily", inputValue: 0, disabledClass: "disabled-field" },
				{ boxLabel: "Yes", name: "hasFriendFamily", inputValue: 1, disabledClass: "disabled-field" }
			]
			},
			{ xtype: "radiogroup", name: "noiseInd", fieldLabel: "Has Noise",
				items: [
				{ boxLabel: "No", name: "noiseInd", inputValue: 0, disabledClass: "disabled-field" },
				{ boxLabel: "Yes", name: "noiseInd", inputValue: 1, disabledClass: "disabled-field" }
			],
				listeners: { change: this.changeNoiseCombo }
			},
			{ xtype: "radiogroup", name: "hasAnimal", fieldLabel: "Has Animal", items: [
				{ boxLabel: "No", name: "hasAnimal", inputValue: 0, disabledClass: "disabled-field" },
				{ boxLabel: "Yes", name: "hasAnimal", inputValue: 1, disabledClass: "disabled-field" }
			],
				listeners: { change: this.changeAnimalCombo }
			}
		];

		var summary = this.getSummary();

		return {
			title: "Activity Environment",
			layout: 'column',
			defaults: { columnWidth: 0.5, layout: 'form', defaults: { anchor: "-20"} },
			items: [summary, { items: leftFields }, { items: rightFields}]
		};
	},
	changeNoiseCombo: function (grp, btn) {
		var val = btn.getGroupValue();
		var noiseCombo = mOQOLD.ActivityDetail.form.getForm().findField('noiseTypeID');
		if (val === "1") { noiseCombo.enable(); } else { noiseCombo.disable(); noiseCombo.setValue(null); }
	},
	changeAnimalCombo: function (grp, btn) {
		var val = btn.getGroupValue();
		var aniamlCombo = mOQOLD.ActivityDetail.form.getForm().findField('animalTypeID');
		if (val === "1") { aniamlCombo.enable(); } else { aniamlCombo.disable(); aniamlCombo.setValue(null); }
	},
	getSummary: function (isTab) {
		var summary = { xtype: "fieldset", columnWidth: 1, title: "Activity Summary", items: [
			{
				xtype: "dataview",
				itemSelector: "div.activity-summary",
				store: mOQOLD.Stores.createStore({ storeId: "ActivitySummary", autoLoad: true, baseParams: { ID: this.id }, api: { read: Ext.app["ActivitySummaryAPI"].getSummary} }),
				tpl: new Ext.XTemplate(
					'<tpl for=".">',
						'<div class="activity-summary">Name: {activityName} | Time: {actDtlStime} - {actDtlEtime}</div>',
					'</tpl>'
				)
			}
		]
		};

		if (isTab) {
			summary = {
				xtype: "panel",
				title: "Observation Record",
				frame: true,
				items: [summary]
			};
		} else {
			summary.padding = "10px";
		}

		return summary;
	},

	getFormItems: function () {
		var items = [this.createActInfoItems()];

		if (this.NewEvent !== true && this.Observations === true) {
			items.push(this.createActEnviItems());
			var observation = this.getSummary(true);
			var obsGrid = mOQOLD.ObservationLists;
			obsGrid.actDetailID = this.id;
			this.imageViewer.setActivityID(this.id);
			obsGrid.useDetailLayout = true;
			var grid = obsGrid.createPanel();
			Ext.apply(grid, { region: 'center', autoHeight: false, autoWidth: false });
			Ext.apply(observation, { layout: 'border' });
			Ext.apply(observation.items[0], { region: 'north', height: 50 });
			observation.items.push(grid);
			obsGrid.useDetailLayout = false;
			items.push(observation);
		}

		return {
			xtype: "tabpanel",
			activeItem: 0,
			deferredRender: false,
			layoutOnTabChange: true,
			defaults: {
				border: false,
				frame: true
			},
			items: items
		};
	}
});


/**
* @class Ext.LinkButton
* @extends Ext.Button
* A Button which encapsulates an &lt;a> element to enable navigation, or downloading of files.
* @constructor
* Creates a new LinkButton
*/
Ext.LinkButton = Ext.extend(Ext.Button, {
	template: new Ext.Template(
        '<table cellspacing="0" class="x-btn {3}"><tbody class="{4}">',
        '<tr><td class="x-btn-tl"><i>&#160;</i></td><td class="x-btn-tc"></td><td class="x-btn-tr"><i>&#160;</i></td></tr>',
        '<tr><td class="x-btn-ml"><i>&#160;</i></td><td class="x-btn-mc"><em class="{5}" unselectable="on"><a href="{6}" style="display:block" target="{7}" class="x-btn-text {2}">{0}</a></em></td><td class="x-btn-mr"><i>&#160;</i></td></tr>',
        '<tr><td class="x-btn-bl"><i>&#160;</i></td><td class="x-btn-bc"></td><td class="x-btn-br"><i>&#160;</i></td></tr>',
        '</tbody></table>').compile(),

	buttonSelector: 'a:first',

	/** 
	* @cfg String href
	* The URL to create a link for.
	*/
	/** 
	* @cfg String target
	* The target for the &lt;a> element.
	*/
	/** 
	* @cfg Object
	* A set of parameters which are always passed to the URL specified in the href
	*/
	baseParams: {},

	//  private
	params: {},

	getTemplateArgs: function () {
		return Ext.Button.prototype.getTemplateArgs.apply(this).concat([this.getHref(), this.target]);
	},

	onClick: function (e) {
		if (e.button != 0) {
			return;
		}
		if (!this.disabled) {
			if (this.fireEvent("click", this, e) == false) {
				e.stopEvent();
			} else {
				if (this.handler) {
					this.handler.call(this.scope || this, this, e);
				}
			}
		}
	},

	// private
	getHref: function () {
		var result = this.href;
		//var p = Ext.urlEncode(Ext.apply(Ext.apply({}, this.baseParams), this.params));
		var p = (this.params.href) ? this.params.href : '';
		if (p.length) {
			result += p;
		}
		return result;
	},

	/**
	* Sets the href of the link dynamically according to the params passed, and any {@link #baseParams} configured.
	* @param {Object} Parameters to use in the href URL.
	*/
	setParams: function (p) {
		this.params = p;
		this.el.child(this.buttonSelector, true).href = this.getHref();
	}
});
Ext.reg('moqold.linkbutton', Ext.LinkButton);