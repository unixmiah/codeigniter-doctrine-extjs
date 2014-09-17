Ext.ns("mOQOLD");

mOQOLD.OrgInfo = new mOQOLD.MaintenanceGridAbstract({
	title: "Facility Information",
	baseAPI: "OrgInfoAPI",
	createGrid: null,
	curID: 0,
	getFormConfig: function () {
		return { fileUpload: true };
	},
	formButtons: function () {
		return ["save", "cancel"];
	},

	onLoadSuccess: function (form, action) {
		var id = action.result.data.ID;
		this.previewBox.getEl().child("img").dom.src = this.getImageURL(id);
	},
	getImageURL: function (id) {
		var loc = window.location;
		var url = loc.href.substr(0, loc.href.lastIndexOf("/") + 1);
		var cacheBuster = new Date().format('U');
		url = url + "thumbnail.php?id=" + id + "&type=ORG&timestamp=" + cacheBuster;
		return url;
	},
	getFormItems: function () {
		this.previewBox = new Ext.BoxComponent({ fieldLabel: 'Logo Preview <br> Note: Only png, gif, jpeg/jpg supported', isFormField: false,
			autoEl: {
				tag: 'div', children: [{
					tag: 'img', qtip: 'Logo', width: 70, style: 'margin-top:-5px',
					src: this.getImageURL(-1)
				}]
			}
		});

		return [
			{ xtype: 'container', layout: 'hbox', defaults: { columnWidth: .5 }, items: [

				{ xtype: 'container', layout: 'form', flex: 1, items: [{
					fieldLabel: "Facility Type", xtype: "radiogroup", columns: 1, allowBlank: false, items: [
						{ boxLabel: "Adult Daycare", name: "orgType", inputValue: 1 },
						{ boxLabel: "Assisted Living", name: "orgType", inputValue: 2 },
						{ boxLabel: "Nursing Home", name: "orgType", inputValue: 3, checked: true}]
				}]
				},
				{
					xtype: 'container', layout: 'form', width: 200, items: [this.previewBox]
				}

				]

			},

			{ fieldLabel: "Facility Name", xtype: "compositefield", labelAlign: "right", items: [

				{ xtype: "textfield", flex: 1, maxLength: 45, maxLengthText: 'Facility Name must be less than 45 characters', name: "orgName", allowBlank: false },

				{ xtype: "displayfield", width: 80, cls: "composite-label", value: "Facility&nbsp;Logo:" },
				{ xtype: "fileuploadfield", flex: 1, name: "logo", allowBlank: true, buttonText: "", buttonCfg: { iconCls: "upload-icon" },
					validator: function (v) {
						var suffix = ["jpg", "png", "gif", "jpeg"];
						if (v === "") { return; }
						else {
							var extension = v.substring(v.lastIndexOf(".") + 1);
							for (var i = 0; i < suffix.length; i++) {
								if (suffix[i].toUpperCase() === extension.toUpperCase()) {
									return true;
								}
							}
							return "Not valid format";
						}
					}
				}
			]
			},
			{ fieldLabel: "Phone", xtype: "compositefield", labelAlign: "right", items: [
				{ xtype: "textfield", flex: 1, name: "phone", vtype: 'phone' },
				{ xtype: "displayfield", width: 110, cls: "composite-label", value: "Twitter&nbsp;Username:" },
				{ xtype: "textfield", flex: 1, maxLength: 15, maxLengthText: 'Username must be less than 15 characters', name: "orgTwitterName", allowBlank: true },
				{ xtype: "box", width: 105, autoEl: { tag: 'a', html: "Create&nbsp;Username", href: "http://www.twitter.com/signup", target: "_blank"} }
			]
			},
			{ fieldLabel: "Address", name: "address" },
			{ fieldLabel: "City", xtype: "compositefield", labelAlign: "right", items: [
				{ xtype: "textfield", flex: 1, name: "city", maxLength: 25, maxLengthText: 'City Name cannot be more than 25 characters' },
				{ xtype: "displayfield", width: 40, cls: "composite-label", value: "State:" },
				{ xtype: "ux.combo", flex: 1, comboType: "states", store: new Ext.data.ArrayStore({ fields: ["abbr", "name"], data: Ext.ux.Combo.getStates() }) },
				{ xtype: "displayfield", width: 25, cls: "composite-label", value: "Zip:" },
				{ xtype: "textfield", flex: 1, name: "zip", vtype: 'zip' }
			]
			}/*,
			{ xtype: 'fieldset',
				listeners: { beforeexpand: { fn: this.fieldSetAction, scope: this }, beforecollapse: { fn: this.fieldSetAction, scope: this} },
				checkboxToggle: true, title: 'is Multi facility ? ', checkboxName: 'isMultiFacility',
				items: [
				{ fieldLabel: "Company", xtype: "compositefield", labelAlign: "right", items: [
					{ xtype: "textfield", flex: 1, maxLength: 45, maxLengthText: 'Company Name must be less than 45 characters', id: 'companyName', name: "companyName", allowBlank: false },
					{ xtype: "displayfield", width: 25, cls: "composite-label", value: "Desc:" },
					{ xtype: "textfield", flex: 1, maxLength: 45, name: 'companyDesc' }
					]
				},
				{ fieldLabel: "Address", name: "companyaddress", xtype: 'textfield' },
				{ fieldLabel: "City", xtype: "compositefield", labelAlign: "right", items: [
					{ xtype: "textfield", flex: 1, name: "companycity", maxLength: 25, maxLengthText: 'City Name cannot be more than 25 characters' },
					{ xtype: "displayfield", width: 40, cls: "composite-label", value: "State:" },
					{ xtype: "ux.combo", flex: 1, comboType: "cmpstates", store: new Ext.data.ArrayStore({ fields: ["abbr", "name"], data: Ext.ux.Combo.getStates() }) },
					{ xtype: "displayfield", width: 25, cls: "composite-label", value: "Zip:" },
					{ xtype: "textfield", flex: 1, name: "companyzip", vtype: 'zip' }
				]
				}
			]
			}*/

		];
	},
	fieldSetAction: function (pan, bool) {
		var companyName = Ext.getCmp("companyName");
		if (companyName && companyName.rendered) {
			companyName.allowBlank = pan.checkbox.getValue() === "on";
		}
	},
	createTwitter: function (field) {
		var el = field.getEl();
		el.on("click", this.onCreateTwitterClick, this);
	},

	onCreateTwitterClick: function () {
		window.open("https://twitter.com/signup");
	}
});