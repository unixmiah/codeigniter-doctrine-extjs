Ext.ns("mOQOLD");
mOQOLD.ObservationDetail = Ext.extend(Ext.form.FormPanel, {
	scroll: "vertical",
	defaultType: "ux.select",
	name: 'observationForm',
	backCard: 'activityform',
	defaults: {
		required: true,
		multiSelect: false,
		labelAlign: "left"
	},
	initComponent: function () {
		this.buildItems();
		this.dockedItems = [
        {
        	xtype: 'toolbar',
        	ui: 'light',
        	dock: 'top',
        	title: "Observation",
        	defaults: {
        		iconMask: true
        	},
        	items: [
            {
            	scope: this,
            	handler: this.goPrev,
            	ui: "back",
            	text: "Back",
            	id: 'o-back'
            },
			{
            	xtype: 'spacer'
            },
            {
            	scope: this,
            	handler: this.addNew,
            	iconCls: 'add',ui: 'plain',
            	id: 'o-add'
            }
            ]
        }
        ];

		mOQOLD.ObservationDetail.superclass.initComponent.call(this);


	},
	autoDestroy: function () {
		this.ownerCt.remove(this);
		this.destroy();
	},
	showImageList: function () {
		mOQOLD.Main.flipPage({
			targetCard: "imagelist"
		}, { id: this.rec.data.ID, rec: this.rec, activityRec: this.activityRec, observation: true });
	},
	addNew: function () {
		mOQOLD.Usability.update("Observation: Add new clicked");
		this.actionMode = 'newObservation';
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
				mOQOLD.Usability.update("Observation: Validation failed");
				mOQOLD.FixedMsgBox.show({
					title: 'Validation error!',
					msg: errMsg,
					icon: Ext.Msg.ERROR,
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
			mOQOLD.Main.flipPage({ targetCard: this.backCard }, { rec: this.activityRec });
		}
		else {
			delete this.rec;
			//this.rec.data.ID = this.rec.get("ID") + 1;
			this.reset();
		}
	},

	goPrev: function () {
		mOQOLD.Usability.update("Observation: Back clicked");
		this.actionMode = "back";
		this.scroller.scrollTo({ x: 0, y: 0 }, false);
		this.performNavigation(true);
	},

	buildItems: function () {
		var items = [
        {
        	selectType: "residentList",
        	name: "clientID",
        	label: 'Participant',
        	labelWidth: 100,
        	emptyText: 'Select Client ID'
        },
        {
        	xtype: "fieldset",
        	title: "QOL Score *",
        	items: [
            {
            	xtype: "moqold.score-button",
            	label: "Best Score",
            	name: 'scrBest'
            },
            {
            	xtype: "moqold.score-button",
            	label: "Worst Score",
            	name: 'scrWorst'
            },
            {
            	xtype: "moqold.score-button",
            	label: "Most Score",
            	name: 'scrMost'
            }
            ]
        },
        {
        	xtype: 'fieldset',
        	title: 'Wellness Dimensions *',
        	items: [
            {
            	xtype: 'ux.select',
            	selectType: 'dimensionList',
            	label: "Primary",
            	name: "pDimensionID",
            	emptyText: 'Enter an Dimension',
            	multiSelect: false
            },
            {
            	xtype: 'ux.select',
            	selectType: 'dimensionList',
            	name: "sDimensionID",
            	label: "Secondary",
            	multiSelect: false
            }
            ]
        },
        {
        	xtype: 'fieldset',
        	title: 'Participation Level',
        	items: [{
        		xtype: "moqold.score-button",
        		name: 'participationLevel',
        		anchor: '0',
        		items: [
                {
                	text: "None",
                	value: '0'
                },
                {
                	text: "Some",
                	value: '1'
                },
                {
                	text: "Full",
                	value: '2'
                }
                ]
        	}]
        },
		{
			xtype: 'fieldset',
			bodyStyle: 'margin:0 0 0 0',
			height: 100,
			items: [
        {
        	xtype: "textareafield",
        	name: "clientNotes",
        	label: "Note",
        	height: 100,
        	maxLength: 1000,
        	required: false
        }
        ]
		}
        ];

		this.on("activate", this.loadRec, this);

		this.items = items;
	},

	loadRec: function () {

		if (this.rec === null) {
			delete this.rec;
		}

		if (typeof this.rec === "object") {
			this.load(this.rec);
			this.data = this.getValues();
		}

		if (this.edit === false) {
			this.edit = true;
			this.reset();
		}
		var dock;
		//var photoBtn = this.getDockedComponent(0).items.getByKey("o-photo-btn");
		if (this.activityRec) {
			dock = this.getDockedComponent(0).setTitle(mOQOLD.getActivityName(this.activityRec.get('activityID')));
		} else {
			dock = this.getDockedComponent(0).setTitle('New Observation');
		}
		//(this.rec) ? photoBtn.enable() : photoBtn.disable();
	},

	validateThis: function (val) {
		var errorFields = [];
		if (Ext.isEmpty(val.clientID) || (val.clientID == '0')) {
			errorFields.push("Participant");
		}

		if (Ext.isEmpty(val.scrBest) || Ext.isEmpty(val.scrMost) || Ext.isEmpty(val.scrWorst)) {
			errorFields.push("QOL Score");
		}

		if (Ext.isEmpty(val.pDimensionID)) {
			errorFields.push("Primary Wellness Dimension");
		}

		if (errorFields.length == 0) {
			return null;
		} else {
			return "Following fields are required:\r\n" + errorFields.join(", ") + ".\r\nDo you want to abort?"
		}
	},


	doSave: function () {

		mOQOLD.Usability.update("Observation: Save");

		var isSaveRequired = false;

		if (this.rec === null) {
			delete this.rec;
			isSaveRequired = true;
		}

		var values = this.getValues();
		if (isSaveRequired === false) {
			isSaveRequired = !(Ext.encode(values) === Ext.encode(this.data));
		}

		if (isSaveRequired) {
			if (this.activityRec) {
				values.actDetailID = this.activityRec.get("ID");
			}
			var params = {
				extAction: "ObservationAPI",
				extMethod: "saveForm",
				extTID: 0,
				extUpload: false,
				extType: "rpc"
			};

			if (this.rec) {
				params.ID = this.rec.get("ID");
			}

			Ext.applyIf(params, values);

			var offlineHelper = new mOQOLD.OfflineHelper({
				params: params,
				storeName: 'ObservationList',
				rec: this.rec,
				success: this.performNavigation,
				store: mOQOLD.stores.ObservationList,
				successArgs: [false],
				failure: this.onAjaxFailure,
				scope: this
			});
			return offlineHelper.save();
		} else {
			return true;
		}
	},
	onAjaxFailure: function (data) {
		var errMsg = (data) ? data.msg : "Duplicate Observation";

		mOQOLD.Usability.update("Observation:" + errMsg);
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
	}

});

Ext.reg("moqold.observationdetail", mOQOLD.ObservationDetail);