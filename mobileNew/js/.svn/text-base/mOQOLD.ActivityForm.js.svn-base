Ext.ns("mOQOLD");
mOQOLD.NumericSelect = Ext.extend(Ext.form.Select, {
	minValue: 0,
	maxValue: 40,
	initComponent: function () {
		if (!this.options) {
			var minValue = this.minValue;
			var maxValue = this.maxValue;
			var value;
			var items = [];
			for (value = minValue; value <= maxValue; value++) {
				items.push({
					text: String(value),
					value: value
				});
			}
			this.options = items;
		}
		mOQOLD.NumericSelect.superclass.initComponent.call(this);
	}
});

Ext.reg('moqold.numeric-select', mOQOLD.NumericSelect);


mOQOLD.ActivityForm = Ext.extend(Ext.form.FormPanel, {
    scroll: "vertical",
    defaultType: "ux.select",
    defaults: {
        required: true,
        multiSelect: false,
        labelAlign: "left"
    },
    backCard: 'calendar',
    initComponent: function () {
        var title = this.rec ? "Edit Activity" : "Add Activity";
        this.splitDateTimeFields = new Ext.ux.util.SplitDateTime({
            fields: [
            {
                field: 'actDtlStime',
                dateField: 'startDate',
                timeField: 'startTime'
            },
			{
			    field: 'actDtlEtime',
			    dateField: 'endDate',
			    timeField: 'endTime'
			}
            ]
        });
        this.dockedItems = [
        {
            xtype: 'toolbar',
            ui: 'light',
            dock: 'top',
            title: title,
            items: this.getToolbarItems()
        }
        ];

        this.buildItems();

        mOQOLD.ActivityForm.superclass.initComponent.call(this);
        //this.on('deactivate', this.autoDestroy, this);
    },
    getToolbarItems: function () {
        var itemArray = [];
        if (this.rec === null) {
            itemArray.push({ xtype: 'moqold.back-button', handler: this.goPrevPage, scope: this, id: 'back-btn' });
        }
        else {
            //itemArray.push({ xtype: 'moqold.back-button', handler: this.goPrevPage, scope: this, id: 'back-btn' }, { xtype: 'button', text: 'Photos', scope: this, id: 'photo-btn', handler: this.showImageList }, { xtype: 'button', scope: this, html: this.addtoical() });
            itemArray.push({ xtype: 'moqold.back-button', handler: this.goPrevPage, scope: this, id: 'back-btn' });
        }
        return itemArray;
    },

    addtoical: function (btn, e) {
        var loc = window.location;
        var url = loc.href.substr(0, loc.href.lastIndexOf("mobileNew/")) + 'iCal.php?id=' + this.rec.get('ID');
        var newUrl = "<a href=" + url + ">Add to iCal </a>";
        return newUrl;
    },
    autoDestroy: function () {
        this.ownerCt.remove(this);
        this.destroy();
    },
    goPrevPage: function () {
        this.actionMode = 'back';
        this.performNavigation(true);
    },
    performNavigation: function (saveFirst, data, rec) {
        if (rec) {
            this.rec = rec;
        }
        if (saveFirst !== false) {
            var errMsg = this.validateThis(this.getValues());

            if (Ext.isEmpty(errMsg)) {
                if (!this.doSave()) {

                    return;
                } else {
                    if (!mOQOLD.checkOnline()) {
                        this.rec = mOQOLD.stores.ActivityListOffline.getAt(mOQOLD.stores.ActivityListOffline.getCount() - 1);
                    }
                }
            } else {
                mOQOLD.Usability.update("Activity: Validation error");
                mOQOLD.FixedMsgBox.show({
                    title: 'Error!',
                    msg: errMsg,
                    width: 300,
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (btn, text) {
                        if (btn == 'yes') {
                            this.performNavigation(false);
                        }
                    },
                    scope: this
                });
                return;
            }
        }

        if (this.actionMode === "back") {
            mOQOLD.Main.flipPage({
                targetCard: this.backCard
            });
        } else {
            mOQOLD.Main.flipPage({
                targetCard: 'observationdetail'
            }, {
                activityRec: this.rec,
                rec: this.activeObservation,
                edit: this.activeObservation ? true : false
            });
        }
    },
    validateThis: function (val) {

        var errorFields = [];

        if (Ext.isEmpty(val.activityID)) {
            errorFields.push("Title");
        }

        if (Ext.isEmpty(val.locationTypeID)) {
            errorFields.push("Location");
        }

        if (Ext.isEmpty(val.startDate)) {
            errorFields.push("Start Date");
        }

        if (Ext.isEmpty(val.startTime)) {
            errorFields.push("Start Time");
        } else {
            if (mOQOLD.TimeObject.isValid(val.startTime) === false) {
                errorFields.push("Start Time should be between 7AM - 7:59PM");
            }
        }

        if (Ext.isEmpty(val.endTime)) {
            errorFields.push("End Time");
        } else {
            if (mOQOLD.TimeObject.isValid(val.endTime) === false) {
                errorFields.push("End Time should be between 7AM - 7:59PM");
            }
        }

        if (Ext.isEmpty(val.staffID)) {
            errorFields.push("Leader");
        }

        if (errorFields.length == 0) {
            return null;
        } else {
            return "Following fields are required:\r\n" + errorFields.join(", ") + ".\r\nDo you want to abort?"
        }
    },

    recordObservation: function () {
        mOQOLD.Usability.update("Activity: Record observation click");
        this.actionMode = 'observation';
        this.performNavigation(true);
        this.activeObservation = null;
    },

    buildItems: function () {
        var labelwidth = 110;
        //mOQOLD.stores.ObservationList.sync();
        this.observationList = new Ext.List({
        	//store: mOQOLD.checkOnline() ? mOQOLD.stores.ObservationList : mOQOLD.stores.ObservationListOffline,
        	store: mOQOLD.stores.ObservationListOffline,
            singleSelect: true,
            scroll: false,
            grouped: false,
            itemTpl: '<div class="m-observationList-cname">{[mOQOLD.getClientName(values.clientID)]} </div><div class="m-observationList-score">({scrMost})</div>',
            listeners: {
                itemtap: this.onObservationTap,
                scope: this
            }
        });


        var items = [
			{
			    xtype: 'fieldset',
			    bodyStyle: 'margin:0 0 0 0',
			    items: [
            {
                xtype: 'ux.select',
                labelWidth: labelwidth,
                selectType: "activityList",
                label: 'Title',
                required: true,
                multiSelect: false,
                name: "activityID"

            }
            ]
			},
        {
            xtype: 'fieldset',
            bodyStyle: 'margin:0 0 0 0',
            items: [
            {
                labelWidth: labelwidth,
                xtype: 'ux.select',
                selectType: "locationList",
                name: "locationTypeID",
                label: 'Location',
                multiSelect: false,
                required: true
            }
            ]
        },
        {
            xtype: 'fieldset',
            anchor: '100%',
            items: [
                {
                    labelWidth: labelwidth,
                    required: true,
                    xtype: "datepickerfield",
                    name: "startDate",
                    label: 'Date',
                    value: new Date(),
                    picker: {
                        yearFrom: this.getCurrentYear().format('Y'),
                        yearTo: this.getCurrentYear().format('Y') + 5
                    }
                },

                {
                    labelWidth: labelwidth,
                    xtype: "timepickerfield",
                    name: "startTime",
                    label: 'Start Time',
                    value: this.getCurrentDate().format("g:ia")
                },
				{
				    labelWidth: labelwidth,
				    xtype: "timepickerfield",
				    name: "endTime",
				    label: 'End Time',
				    value: this.getCurrentDate().add(Date.HOUR, 1).format("g:ia")
				}
            ]
        },
    {
        xtype: 'fieldset',
        items: [
        {
            labelWidth: labelwidth,
            xtype: 'ux.select',
            selectType: 'staffList',
            required: true,
            label: 'Leader',
            name: "staffID",
            multiSelect: false
        }
        ]
    },
    {
        xtype: 'fieldset',
        bodyStyle: 'margin:0 0 0 0',
        defaultType: "moqold.numeric-select",
        defaults: {
            labelWidth: labelwidth
        },
        items: [
        {
            name: "numParticipant",
            label: "Participants"
        },
		{
		    name: "numStaff",
		    label: "Staff",
		    maxValue: 5
		},
		{
		    name: "numVolunteer",
		    label: "Volunteers",
		    maxValue: 5
		},
		{
		    name: "hasFriendFamily",
		    label: "F/Family"
		}
        ]
    },
	{
	    xtype: 'fieldset',
	    defaults: {
	        labelWidth: labelwidth
	    },
	    itemId: 'pickers',
	    items: [
			{ xtype: 'ux.select', itemId: 'noiseList', selectType: "noiseList", required: false, multiSelect: false },
			{ xtype: 'ux.select', selectType: "weatherList", required: false, multiSelect: false },
			{ xtype: 'ux.select', selectType: "animalList", required: false, multiSelect: false }
		]

	},

    {
        xtype: 'fieldset',
        bodyStyle: 'margin:0 0 0 0',
        height: 100,
        items: [
        {
            labelWidth: labelwidth,
            xtype: "textareafield",
            name: "notes",
            label: "Note",
            height: 100,
            maxLength: 1000,
            required: false
        }
        ]
    },
    this.observationList,
    {
        xtype: "button",
        text: "Record Observation",
        ui: 'light',
        scope: this,
        handler: this.recordObservation
    }
    ];

        this.on("activate", this.loadRec, this);
        this.on("deactivate", this.destroyItems, this);
        this.items = items;
    },
    destroyItems: function () {
        delete this.rec;
        delete this.date;
        this.destroy();
    },
    showImageList: function () {
        mOQOLD.Main.flipPage({
            targetCard: "imagelist"
        }, { id: this.rec.data.ID, rec: this.rec, observation: false });
    },
    loadRec: function () {

        if (typeof this.rec === "object") {
            this.load(this.rec);
        }

        if (this.rec === null) {
            delete this.rec;
        }

        var dock = this.getDockedComponent(0).setTitle(this.rec ? 'Edit Activity' : 'Add Activity');
        //var photoBtn = this.getDockedComponent(0).items.getByKey("photo-btn");

        //(photoBtn && this.rec) ? photoBtn.enable() : photoBtn.disable();

        if (typeof this.rec === "object") {
            this.data = Ext.apply({}, this.rec.data);
            this.splitDateTimeFields.split(this.data);

            //Noiselist disable -Start [08/23/2011]
            var disableNoiseList = this.data.noiseTypeID === null && this.data.noiseInd === 0;
            var noiseList = this.getComponent('pickers').getComponent('noiseList');
            noiseList.setDisabled(disableNoiseList);
            //End [08/23/2011]
            this.setValues(this.data);
        } else {
            this.reset();
            this.setValues(Ext.apply({ staffID: mOQOLD.DefaultRec.get('contactID') }, this.defaultData));
        }
        var activityId = this.rec ? this.rec.get('ID') : 0;
        this.observationList.store.filterBy(function (rec) {
            return rec.get('actDetailID') === activityId;
        });
    },

    doSave: function () {
        var isSaveRequired = false;
        if (this.rec === undefined) {
            delete this.rec;
            isSaveRequired = true;
        }
        var values = this.getValues();

        values.endDate = values.startDate.clone();
        this.splitDateTimeFields.join(values);

        values.startDate = values.startDate.format("m/d/Y");
        values.endDate = values.endDate.format("m/d/Y");

        values.actDtlDuration = Math.floor((values.actDtlEtime.getTime() - values.actDtlStime.getTime()) / 1000 / 60);

        if (values.actDtlDuration < 0) {
            mOQOLD.FixedMsgBox.alert('Validation error!', 'End time cannot be less than start time');
            return false;
        }

        if (values.noiseTypeID > 0) {
            values.noiseInd = 1;
        } else {
            if (!isSaveRequired) {
                values.noiseInd = null;
                values.noiseTypeID = null;
            }
        }
        if (values.animalTypeID > 0) {
            values.hasAnimal = 1;
        } else {
            if (!isSaveRequired) {
                values.hasAnimal = null;
                values.animalTypeID = null;
            }
        }

        if (values.weatherTypeID === "" && (!isSaveRequired)) {
            values.weatherTypeID = null;
        }

        if (isSaveRequired === false) {
            var newData = Ext.apply({}, this.rec.data);
            this.splitDateTimeFields.split(this.rec.data);
            Ext.apply(newData, values);
            this.splitDateTimeFields.split(newData);
            isSaveRequired = !(Ext.encode(this.data) === Ext.encode(newData));
        }
        if (isSaveRequired) {
            var params = {
                extAction: "ActivityDetailAPI",
                extMethod: "saveForm",
                extTID: 0,
                extUpload: false,
                extType: "rpc"
            };

            if (typeof this.rec === "object") {
                params.ID = this.rec.get("ID");
            }
            Ext.applyIf(params, values);
            var offlineHelper = new mOQOLD.OfflineHelper({
                params: params,
                storeName: 'ActivityList',
                rec: this.rec,
                success: this.performNavigation,
                store: mOQOLD.stores.ActivityList,
                successArgs: [false],
                failure: this.onAjaxFailure,
                scope: this
            });
            return offlineHelper.save();
        } else {
            return true;
        }
    },
    getCurrentDate: function () {
        var now = new Date();
        now.setMinutes(Math.floor(now.getMinutes() / 15) * 15);
        return now;
    },
    getCurrentYear: function () {
        var now = new Date();
        now.getFullYear();
        return now;
    },
    onObservationTap: function (dv, index) {
        mOQOLD.Usability.update("Activity: Existing observation clicked");
        this.actionMode = 'observation';
        this.activeObservation = dv.store.getAt(index);
        this.performNavigation(true);
    },
    onAjaxFailure: function (data) {
        var errMsg = (data) ? data.msg : "Duplicate Entry";
        mOQOLD.Usability.update("Activity: " + errMsg);
        mOQOLD.FixedMsgBox.show({
            title: 'Error!',
            msg: errMsg + '. Do you want to abort?',
            width: 300,
            buttons: Ext.MessageBox.YESNO,
            fn: function (btn, text) {
                if (btn == 'yes') {
                    this.performNavigation(false);
                }
            },
            scope: this
        });
    }
});

Ext.reg("moqold.activityform", mOQOLD.ActivityForm);