Ext.ns("mOQOLD");
mOQOLD.ImageViewer = Ext.extend(Ext.Panel, {
	id: 'images-view',
	width: 600,
	height: 350,
	layout: 'fit',
	activityID: 0,
	apiFunction: {},
	observationID: 0,
	autoScroll: true,
	observations: [],
	initComponent: function (config) {
		Ext.applyIf(this, config);
		this.createUpdateMenu();
		this.createDataView();
		this.items = [this.imageView];
		mOQOLD.ImageViewer.superclass.initComponent.call(this);
	},
	createImageStore: function () {
		var id = this.activityID;

		var imagesStore = new Ext.data.DirectStore({
			storeId: "ImagesStore",
			autoLoad: false,
			reader: new Ext.data.JsonReader({
				fields: ['ID', 'tag', 'url'],
				idProperty: 'ID',
				root: 'items'
			}),
			proxy: new Ext.data.DirectProxy({
				api: this.apiFunction
			}),
			listeners: {
				scope: this,
				beforeload: function () {
					//this.msgBox = Ext.Msg.wait("Loading images", "Loading...");
				}
			}
		});

		var param = {};
		if (this.observationID > 0) {
			param = { params: { observationID: this.observationID} };
		} else {
			param = { params: { activityID: this.activityID} };
		}
		if (this.activityID !== 0 || this.observationID !== 0) {
			imagesStore.load(param);
		}
		return imagesStore;
	},
	createUpdateMenu: function (inx, phid) {
		this.ctxMenu = new Ext.menu.Menu({
			items: [
				 {
				 	text: 'Send Mail',
				 	handler: this.genericHandler,
				 	value: '' + inx,
				 	aID: this.activityID,
				 	observations: this.observations,
				 	pID: phid,
				 	scope: this,
				 	mailSentHandler: function (resObj, e) {
				 		if (resObj.success) {
				 			Ext.Msg.alert("Mail", "Mail Sent sucessfully!");
				 		} else {
				 			Ext.Msg.alert("Mail", resObj.msg);
				 		}
				 	}
				 }, {
				 	text: 'Delete',
				 	handler: this.genericHandler,
				 	value: '' + inx,
				 	aID: this.activityID,
				 	oID: this.observationID,
				 	pID: phid,
				 	mailSentHandler: function (resObj, e) {
				 		if (resObj.success) {
				 			Ext.Msg.alert("Delete", "Image Deleted sucessfully!");
				 		}
				 	}
				 }
			]
		});
		if (this.observationID <= 0) {
			var oMenu = this.createObservationMenu(inx, phid);
			if (oMenu) {
				this.ctxMenu.add({
					text: 'Attach to Observation', menu: { items: this.observations }
				});
			}
		}

	},
	setActivityID: function (actID) {
		this.activityID = actID;
		this.observationID = -1;
		this.observations = [];
		this.createUpdateMenu();
	},
	genericHandler: function (menuItem) {
		var value = menuItem.value;
		var optionName = menuItem.text;
		var cmp = Ext.ComponentMgr.get('images-view');
		var photoID = (menuItem.phId) ? menuItem.phId : menuItem.pID;

		if (optionName === "Delete") {
			this.ownerCt.hide();
			cmp.store.removeAt(value);
			cmp.imageView.refresh();
			Ext.app["PhotoDetailAPI"].deleteImage("" + value);
			return;
		}

		if (optionName === "Send Mail") {
			if (menuItem.oID && menuItem.oID !== 0) {
				//for observation
				Ext.app.PhotoAPI.emailAttachment(photoID, menuItem.aID, menuItem.oID, this.mailSentHandler, this);
			} else {
				// for activity
				this.showEmailWindow(photoID, menuItem.aID);
			}
			return;
		}

		// The left out will be attach to observation.
		Ext.app.PhotoAPI.assignToObservation(photoID, value);
		cmp.store.removeAt(menuItem.storeIndex);

	},
	createObservationMenu: function (inx, phid) {
		var observArray = mOQOLD.ObservationStore;
		var actId = this.activityID + "";
		var genericHandler = this.genericHandler;
		var obsr = [];
		var cstore = null;
		if (mOQOLD.Residents.grid) {
			cstore = mOQOLD.Residents.grid.store;
		} else {
			mOQOLD.Residents.createPanel();
			cstore = mOQOLD.Residents.grid.store;
		}
		this.createClientList(cstore);
		if (observArray) {
			if (observArray.getCount() > 0) {
				for (var i = 0; i < observArray.getCount(); i++) {
					var record = observArray.getAt(i).data;
					var index = cstore.find("ID", record.clientID);
					var photoPermission = false;
					if (index >= 0) {
						var val = cstore.getAt(index).data;
						if ((val.picID !== null) && (val.picID === 1)) {
							obsr.push(Ext.apply({ handler: genericHandler, scope: this }, { text: val.firstName +','+ val.lastName, value: record.ID, phId: phid, storeIndex: inx }));
						}
					}
				}
				if (obsr.length > 0) {
					this.observations = obsr;
					return true;
				}
			} else {
				return false;
			}
		}

		return false;
	},
	createClientList: function (store) {
		this.clientArray = [];
		var cstore = store;
		for (var i = 0; i < cstore.getCount(); i++) {
			var record = cstore.getAt(i);
			var picID = record.data.picID;
			var email = record.json.firstEcontactemail;
			//console.log(picID + ':' + email + ':' + record.data.firstName + ':' + record.data.lastName);
			if (picID !== null && picID === 1 && email !== null && email.length > 0) {
				this.clientArray.push({ name: record.data.firstName + ',' + record.data.lastName,
					clientID: record.data.ID, emailID: email
				});
			}

		}

	},
	showEmailWindow: function (photoid, actID) {
		var citems = [];
		if (this.clientArray && this.clientArray.length > 0) {

			for (var i = 0; i < this.clientArray.length; i++) {
				var obj = this.clientArray[i];
				citems.push({ xtype: 'checkbox', fieldLabel: "", boxLabel: obj.name, inputValue: obj.emailID, name: 'box' + i });
			}
		} else {
			Ext.Msg.alert("Participants List", "There is not participants currently have photo permission");
			return;
		}

		var checkboxes = {
			xtype: 'form',
			id: 'actemailsendform',
			photoid: photoid,
			actid: actID,
			dafaults: { labelWidth: 0 },
			items: [{ xtype: 'fieldset', title: 'Participants', items: citems, layout: 'anchor', autoScroll: true },
					{ xtype: 'fieldset', title: 'Additional Participants', layout: 'fit', items: [{ xtype: 'textarea', name: 'otheremails', fieldLabel: '', height: 100, anchor: '100%'}] }
				   ],
			frame: true,
			buttons: [{ text: 'send', handler: this.sendFormAction, scope: this }, { text: 'cancel', handler: this.cancelFormAction, scope: this}]
		};

		this.emailWindow = new Ext.Window({
			title: 'Send email',
			width: 400,
			height: 310,
			layout: 'fit',
			items: checkboxes
		});
		this.emailWindow.show();
	},
	cancelFormAction: function (btn) {
		if (this.emailWindow) {
			this.emailWindow.hide();
		}
	},
	sendFormAction: function (btn) {
		var form = Ext.getCmp('actemailsendform').form;
		var emails = [];
		var strEmail = null;
		var values = form.items.items;
		for (var i = 0; i < values.length; i++) {
			if (values[i].xtype === 'checkbox' && values[i].checked) {
				emails.push(values[i].inputValue);
			}
			if (values[i].xtype === 'textarea') {
				strEmail = values[i].getValue();
			}
		}
		if (strEmail !== null && strEmail.length > 0) {
			emails = emails.concat(strEmail.split(","));
		}

		var regEx = new RegExp("^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.(([0-9]{1,3})|([a-zA-Z]{2,3})|(aero|coop|info|museum|name))$");

		if (emails.length > 0) {
			var isAllEmailVaid = true;
			var invalidEmail = "";

			for (var i = 0; i < emails.length; i++) {
				if (regEx.test(emails[i]) === false) {
					isAllEmailVaid = false;
					invalidEmail = emails[i];
					break;
				}
			}

			if (isAllEmailVaid) {
				Ext.app.PhotoAPI.emailAttachment(form.photoid, emails, -1, function (resObj, e) {
					if (resObj.success) {
						Ext.Msg.alert("Mail", "Mail Sent sucessfully!");
						this.cancelFormAction();
					} else {
						Ext.Msg.alert("Mail", resObj.msg);
					}
				}, this);

			} else {
				Ext.Msg.alert("Error", invalidEmail + ": is not valid email!!!");
			}

		} else {
			Ext.Msg.alert("Error", "No Email selected or entered");
		}


	},
	createDataView: function () {
		var loc = window.location;
		var url = loc.href.substr(0, loc.href.lastIndexOf("/") + 1);
		var cacheBuster = new Date().format('U');
		var tpl = new Ext.XTemplate(
		'<tpl for=".">',
            '<div class="thumb-wrap" id="{tag}">',
		    '<div class="thumb"><img src="' + url + '{url}&timestamp=' + cacheBuster + ' title="{name}"></div>',
		    '<span class="x-editable">{shortName}</span></div>',
        '</tpl>',
        '<div class="x-clear"></div>'
		);
		this.store = this.createImageStore();
		this.imageView = new Ext.DataView({
			store: this.store,
			tpl: tpl,
			overClass: 'x-view-over',
			itemSelector: 'div.thumb-wrap',
			emptyText: 'No images to display',
			getContextMenu: function (inx, phid) {
				this.ownerCt.createUpdateMenu(inx, phid);
				return this.ownerCt.ctxMenu;
			},
			plugins: [
                new Ext.DataView.DragSelector(),
                new mOQOLD.LabelEditor({ dataIndex: 'tag' })
            ],

			prepareData: function (data) {
				data.shortName = Ext.util.Format.ellipsis(data.tag, 15);
				return data;
			},

			listeners: {
				mouseenter: function (dv, index, node, e) {
					var loc = window.location;
					var url = loc.href.substr(0, loc.href.lastIndexOf("/") + 1);
					var cacheBuster = new Date().format('U');
					url = url + dv.store.getAt(index).data.url + "&timestamp=" + cacheBuster;
					var targetID = node.id;
					var htmlTag = "<img width='300' height='300' src='" + url + "' title='test' >";

					new Ext.ToolTip({
						target: targetID,
						dismissDelay: 15000, // auto hide after 15 seconds
						html: htmlTag,
						anchor: 'right'
					});
				},
				mouseleave: function (dv, index, node, e) {
					var url = dv.store.getAt(index).data.url;
				},
				render: {
					fn: function () {
						Ext.getBody().on("contextmenu", Ext.emptyFn, null, { preventDefault: true });
					}
				},
				contextmenu: {
					fn: function (obj, index, node, event) {
						var phid = obj.store.getAt(index).data.ID;
						x = event.browserEvent.clientX;
						y = event.browserEvent.clientY;
						this.getContextMenu(index, phid).showAt([x, y]);
					}
				}
			}
		});

	}
});
Ext.reg('moqold.imageList', mOQOLD.ImageViewer);