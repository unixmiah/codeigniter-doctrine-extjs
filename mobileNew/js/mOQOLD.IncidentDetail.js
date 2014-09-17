Ext.ns("mOQOLD");

mOQOLD.IncidentDetail = Ext.extend(Ext.form.FormPanel, {
	scroll: "vertical",
	name: 'incidentForm',
	defaultType: "ux.select",
	backCard: 'incidentlist',
	defaults: {
		required: false,
		multiSelect: false,
		labelAlign: "left"
	},

	initComponent: function () {
		var title = "Incident: New";
		if (this.rec) {
			//title = new Ext.XTemplate('{[mOQOLD.getClientName(values.clientID)]} {[mOQOLD.getActivityName(values.incidentActivityID)]} {incidentTime:date(mOQOLD.MediumDateTimeFormat)}').apply(this.rec.data);
			title = new Ext.XTemplate('{[mOQOLD.getIncidentActivityName(values.incidentActivityID)]}').apply(this.rec.data);
		}

		this.dockedItems = [
			{
				xtype: 'toolbar',
				ui: 'light',
				dock: 'top',
				title: title,
				items: [{ xtype: 'moqold.back-button', targetCard: this.backCard, handler: this.goPrev, scope: this}]
			}
        ];

		this.splitDateTimeFields = new Ext.ux.util.SplitDateTime({
			fields: [
				{ field: 'incidentTime', dateField: 'incidentSplitDate', timeField: 'incidentSplitTime' }
			]
		});

		this.buildItems();
		mOQOLD.IncidentDetail.superclass.initComponent.call(this);
		this.on("activate", this.loadRec, this);
		this.on('deactivate', this.autoDestroy, this);
	},
	autoDestroy: function (cmp) {
		cmp.ownerCt.remove(cmp);
		cmp.destroy();
	},
	goPrev: function (btn) {
		this.actionMode = "back";
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
				}
			} else {
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
			mOQOLD.Usability.update("Incident: Save and back to List");
			mOQOLD.Main.flipPage({ targetCard: this.backCard });
			this.reset();
		}

	},

	buildItems: function () {
		var items = [
        {
        	selectType: "residentList",
        	name: "clientID",
        	emptyText: 'Select Client...',
        	required: true
        },

        {
        	xtype: "datepickerfield",
        	name: "incidentSplitDate",
        	label: "Incident Date",
        	required: true,
        	value: new Date()
        },

        {
        	xtype: "timepickerfield",
        	name: "incidentSplitTime",
        	label: "Incident Time",
        	required: true,
        	value: this.getCurrentDate().format("g:ia")
        },

        {
        	selectType: "locationList"
        },

        {
        	selectType: "userList",
        	label: "Witness",
        	name: "witnessUserID"
        },

        {
        	selectType: "aidList",
        	multiSelect: true
        },

        {
        	selectType: "incidentActivityList"
        },

        {
        	selectType: "incidentCauseList"
        },

        {
        	selectType: "footwearList"
        },

        {
        	selectType: "bodypartList",
        	multiSelect: true
        }

        ];

		this.on("afterlayout", this.loadRec, this);
		this.items = items;
	},
	getCurrentDate: function () {
		var now = new Date();
		now.setMinutes(Math.floor(now.getMinutes() / 15) * 15);
		return now;
	},
	loadRec: function () {
		if (typeof this.rec === "object" && this.rec !== null ) {
			var data = Ext.apply({}, this.rec.data);
			this.splitDateTimeFields.split(data);
			this.setValues(data);


			//Start set the AID Values

			var listValues = "";
			var delimeter = ",";

			var currID = this.rec.get("ID");
			//Filter the data based on the current incident
			mOQOLD.stores.ResidentAidList.filter("incidentID", currID);
			var recordsFound = mOQOLD.stores.ResidentAidList.getCount();
			// Check if the Database has one or more AID stored
			if (recordsFound > 0) {
				//mOQOLD.stores.AidList.filter("refType", "aid"); // set the search stage for aid alone
				for (var i = 0; i < recordsFound; i++) {
					if (i > 0) {
						listValues = listValues + delimeter;
					}

					var aidName = mOQOLD.stores.ResidentAidList.getAt(i).get("name");
					var aidLoc = mOQOLD.stores.AidList.findExact("name", aidName);
					if (aidLoc) {
						listValues = listValues + mOQOLD.stores.AidList.getAt(aidLoc).internalId;
					}
				}

			} else {
				//Reset the filter
				mOQOLD.stores.ResidentAidList.clearFilter();
			}

			this.setValues({ "aidID": listValues });
			listValues = ""; // reset the data to blank
			//End set the AID Values

			//Start Injury body part

			//Filter based on the current incident
			mOQOLD.stores.ResidentInjuryList.filter("incidentDetailID", currID);
			//get how many records are found

			var injCount = mOQOLD.stores.ResidentInjuryList.getCount();
			//If more than 1 rec found then

			if (injCount > 0) {
				for (var i = 0; i < injCount; i++) {
					if (i > 0) {
						listValues = listValues + delimeter;
					}
					//get the body part id from that and retrive the respective list id 
					var idLoc = Number(mOQOLD.stores.ResidentInjuryList.getAt(i).get("bodyPartID"));
					listValues = listValues + mOQOLD.stores.BodyPartList.getAt(mOQOLD.stores.BodyPartList.findExact("ID", idLoc)).internalId;
				}
			} else {
				mOQOLD.stores.ResidentInjuryList.clearFilter();
			}

			//set it on the screen
			this.setValues({ "bodypartID": listValues });
			//End injury body part


		}

		// Make aid and injury field disabled temp till the save workd in mobile.
		this.getFields().aidID.setDisabled(true);
		this.getFields().bodypartID.setDisabled(true);


	},
	validateThis: function (val) {
		var errorFields = [];

		if (Ext.isEmpty(val.clientID)) {
			errorFields.push("Client");
		}

		if (Ext.isEmpty(val.incidentSplitDate)) {
			errorFields.push("Incident Date");
		}

		if (Ext.isEmpty(val.incidentSplitTime)) {
			errorFields.push("Incident Time");
		}

		if (errorFields.length == 0) {
			return null;
		} else {
			return "Following fields are required:\r\n" + errorFields.join(", ") + ".\r\nDo you want to abort?"
		}
	},
	doSave: function () {

		if (this.rec === null) {
			delete this.rec;
		}

		var values = this.getValues();
		this.splitDateTimeFields.join(values);

		var params = {
			extAction: "IncidentAPI",
			extMethod: "saveForm",
			extTID: 0,
			extUpload: false,
			extType: "rpc",
			notifyPartyID: 52 // todo: fix this
		};

		if (typeof this.rec === "object") {
			params.ID = this.rec.get("ID");
		}

		if (values.witnessUserID !== "") {
			values.witnessInd = 1;
		}

		Ext.applyIf(params, values);
		var offlineHelper = new mOQOLD.OfflineHelper({
			params: params,
			storeName: 'IncidentList',
			rec: this.rec,
			store: mOQOLD.stores.IncidentList,
			success: this.performNavigation,
			successArgs: [false],
			failure: this.onAjaxFailure,
			scope: this
		});
		return offlineHelper.save();
	},
	onAjaxFailure: function (data) {
		var errMsg = (data) ? data.msg : "Duplicate Entry";
		mOQOLD.Usability.update("Incident: "+errMsg);
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

Ext.reg("moqold.incidentdetail", mOQOLD.IncidentDetail);