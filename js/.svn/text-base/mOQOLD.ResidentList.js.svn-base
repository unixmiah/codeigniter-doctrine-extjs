Ext.ns("mOQOLD");

mOQOLD.Residents = new mOQOLD.MaintenanceGridAbstract({
    title: "Participant Information",
    baseAPI: "ClientAPI",
    gridActions: ["remove", "view"],
    defaultSort: "lastName",
    useDetailLayout: true,
    moduleName: "Residents",
    getFormConfig: function () {
        return { fileUpload: true };
    },
    onLoadSuccess: function (form, action) {
        var id = action.result.data.ID;
        if (this.previewBox && this.previewBox.rendered) {
            this.previewBox.getEl().child("img").dom.src = this.getImageURL(id);
        }
    },
    getHybridConfig: function () {
        var today = new Date();
        return [
			{ dataIndex: "ID", type: "int" },
   			{ dataIndex: "firstName", type: "string", header: "First Name", formField: { fieldLabel: "First Name", allowBlank: false} },
   			{ dataIndex: "lastName", type: "string", header: "Last Name", formField: { fieldLabel: "Last Name", allowBlank: false} },
   			{ dataIndex: "nickName", type: "string", formField: { fieldLabel: "Nick Name"} },
   			{ dataIndex: "roomDesc", type: "string", header: "Room", formField: { fieldLabel: "Room"} },
   			{ dataIndex: "chkInDate", type: "date", formField: { xtype: "datefield", fieldLabel: "Check In", value: today} },
   			{ dataIndex: "picID", type: "int", header: "Photo Permission", renderer: this.photoPermissionRenderer },
   			{ dataIndex: "gender", type: "int", header: "Gender", renderer: this.genderRenderer, formField: { xtype: "ux.combo", comboType: "gender", allowBlank: false} },
   			{ dataIndex: "birthDate", type: "date", formField: { xtype: "datefield", fieldLabel: "Birth Date", value: today} },
   			{ dataIndex: "firstEContactID", type: "int" },
   			{ dataIndex: "secondEContactID", type: "int" },
   			{ dataIndex: "physicianContactID", type: "int" },
   			{ dataIndex: "assessDate", type: "date" },
   			{ dataIndex: "hasAssessment", type: "int" },
   			{ dataIndex: "inactiveDate", type: "date" },
   			{ dataIndex: "hasSpecialCondInd", type: "int", formField: { xtype: "ux.combo", comboType: "yesORno", fieldLabel: "Has Special Condition"} },
   			{ dataIndex: "hasAllergyInd", type: "int", formField: { xtype: "ux.combo", comboType: "yesORno", fieldLabel: "Has Allergy"} },
   			{ dataIndex: "selfPic", type: "string" },
   			{ dataIndex: "characters", type: "string" },
   			{ dataIndex: "familyHistory", type: "string" },
   			{ dataIndex: "education", type: "string" },
   			{ dataIndex: "workHistory", type: "string" },
   			{ dataIndex: "talentInterest", type: "string" },
   			{ dataIndex: "likeDislike", type: "string" },
   			{ dataIndex: "socialRelated", type: "string" }
		];
    },

    genderRenderer: function (val) {
        if (val === 1) {
            return "Male";
        }
        return "Female";
    },

    photoPermissionRenderer: function (val) {
        if (val === 1) {
            return "Yes";
        }
        return "No";
    },


    deleteRow: function (grid, rowIndex, colIndex) {
        if (!this.permissionCheck("delete")) {
            return;
        }

        var store = grid.getStore();
        var rec = store.getAt(rowIndex);

        var win = new Ext.Window({
            layout: "form",
            autoHeight: true,
            modal: true,
            width: 400,
            title: "Delete Participant Information",
            store: store,
            rec: rec,
            items: [{
                xtype: "datefield",
                fieldLabel: "Removal Date",
                anchor: "-20",
                value: new Date()
            }],
            buttons: [
				{ text: "Delete", scope: this, handler: this.onWindowDelete },
				{ text: "Cancel", scope: this, handler: this.onWindowCancel }
			],
            listeners: {
                scope: this,
                beforedestroy: this.cleanUpWindow
            }
        });

        win.show();

        this.deleteWin = win;
    },

    onWindowCancel: function () {
        this.deleteWin.close();
    },

    onWindowDelete: function () {
        var win = this.deleteWin;
        var store = win.store;
        var rec = win.rec;
        var field = win.getComponent(0);
        var date = field.getValue().format("m/d/Y");

        rec.set("inactiveDate", date);

        store.reload();

        win.close();
    },

    cleanUpWindow: function () {
        delete this.deleteWin;
    },
    dobTriggerClick: Ext.form.DateField.prototype.onTriggerClick.createSequence(function () {
        if (!this.getValue()) {
            this.menu.picker.setValue(new Date('01/01/1910'));
        }
    }),
    getImageURL: function (id) {
        var loc = window.location;
        var url = loc.href.substr(0, loc.href.lastIndexOf("/") + 1);
        var cacheBuster = new Date().format('U');
        url = url + "thumbnail.php?id=" + id + "&type=CLI&timestamp=" + cacheBuster;
        return url;
    },

    createParInfoItems: function () {
        this.previewBox = new Ext.BoxComponent({ fieldLabel: 'Logo Preview', isFormField: false,
            autoEl: {
                tag: 'div', children: [{
                    tag: 'img', qtip: 'Logo', width: 70, style: 'margin-top:-5px;float:right;',
                    src: this.getImageURL(-1)
                }]
            },
            listeners: {
                afterrender: function () {
                    this.previewBox.getEl().child("img").dom.src = this.getImageURL(this.id);
                },
                scope: this
            }
        });


        var leftFields = [
			{ xtype: "textfield", readOnly: true, name: "firstName", fieldLabel: "First Name", allowBlank: false, maxLength: 45, maxLengthText: 'First Name should be less than 45 characters' },
			{ xtype: "textfield", readOnly: true, name: "lastName", fieldLabel: "Last Name", allowBlank: false, maxLength: 45, maxLengthText: 'Last Name should be less than 45 characters' },
			{ xtype: "datefield", readOnly: true, name: "birthDate", fieldLabel: "Birth Date", onTriggerClick: this.dobTriggerClick },
			{ xtype: "datefield", readOnly: true, name: "chkInDate", fieldLabel: "Check In Date" },
			{ xtype: "radiogroup", disabled: true, name: "hasAssessment", fieldLabel: "Has Assessment", items: [
				{ boxLabel: "No", name: "hasAssessment", inputValue: 0, disabledClass: "disabled-field" },
				{ boxLabel: "Yes", name: "hasAssessment", inputValue: 1, disabledClass: "disabled-field" }
			]
			},
			{ xtype: "radiogroup", disabled: true, name: "hasAllergyInd", fieldLabel: "Has Allergy", items: [
				{ boxLabel: "No", name: "hasAllergyInd", inputValue: 0, disabledClass: "disabled-field" },
				{ boxLabel: "Yes", name: "hasAllergyInd", inputValue: 1, disabledClass: "disabled-field" }
			]
			}
		];
        var rightFields = [
			{ xtype: "textfield", readOnly: true, name: "nickName", fieldLabel: "Nick Name", maxLength: 45, maxLengthText: 'Nick Name should be less than 45 characters' },
			{ xtype: "ux.combo", comboType: "gender", readOnly: true, allowBlank: false },
			{ xtype: "textfield", readOnly: true, name: "roomDesc", fieldLabel: "Room", maxLength: 45, maxLengthText: 'Room should be less than 45 characters' },
        /*{ xtype: "displayfield", value: "&nbsp;" },*/
			{xtype: "datefield", readOnly: true, name: "assessDate", fieldLabel: "Assess Date" },
			{ xtype: "radiogroup", disabled: true, name: "picID", fieldLabel: "Photo Permission", items: [
				{ boxLabel: "No", name: "picID", inputValue: 0, disabledClass: "disabled-field" },
				{ boxLabel: "Yes", name: "picID", inputValue: 1, disabledClass: "disabled-field" }
			]
			},

			{ xtype: "radiogroup", disabled: true, name: "hasSpecialCondInd", fieldLabel: "Has Special Condition", items: [
				{ boxLabel: "No", name: "hasSpecialCondInd", inputValue: 0, disabledClass: "disabled-field" },
				{ boxLabel: "Yes", name: "hasSpecialCondInd", inputValue: 1, disabledClass: "disabled-field" }
			]
			},
			{ xtype: "fileuploadfield", fieldLabel: "Client&nbsp;Picture  <br> Note: Only png, gif, jpeg/jpg supported", name: "selfPic", allowBlank: true, disabled: true, buttonText: "", disabledClass: "disabled-field", buttonCfg: { iconCls: "upload-icon" },
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

		];
        var mainFields = { xtype: "container", layout: 'column',
            defaults: { columnWidth: 0.46, layout: 'form', defaults: { anchor: "-20"} },
            items: [{ items: leftFields }, { items: rightFields}]
        };

        return { title: "Participant Information", items: [this.previewBox, mainFields] };

    },

    createMedicalItems: function () {
        var clientID = this.id;

        var allergyList = mOQOLD.AllergyLists;
        allergyList.clientID = clientID;
        allergyList = allergyList.createPanel();

        var specCondition = mOQOLD.SpecialCondition;
        specCondition.clientID = clientID;
        specCondition = specCondition.createPanel();

        var aidList = mOQOLD.Aids;
        aidList.setClientId(clientID);
        aidList = aidList.createPanel();

        return {
            title: 'Medical',
            layout: 'column',
            tbar: this.createInfoToolbar(),
            defaults: {
                columnWidth: 0.33
            },
            items: [allergyList, specCondition, aidList]
        };
    },

    createEmeInfoItems: function (b) {
        var isBlankAllowed = (b && b === true);
        var leftFields = [
			{ xtype: "displayfield", value: "Primary Contact" },
			{ xtype: "textfield", readOnly: true, allowBlank: isBlankAllowed, name: "firstEcontactfirstName", fieldLabel: "First Name", maxLength: 45, maxLengthText: 'First Name should be less than 45 characters' },
			{ xtype: "textfield", readOnly: true, allowBlank: isBlankAllowed, name: "firstEcontactlastName", fieldLabel: "Last Name", maxLength: 45, maxLengthText: 'Last Name should be less than 45 characters' },
			{ xtype: "textfield", readOnly: true, allowBlank: isBlankAllowed, name: "firstEcontactphoneNumber", fieldLabel: "Phone Number", vtype: "phone" },
			{ xtype: "textfield", readOnly: true, name: "firstEcontactcellNumber", fieldLabel: "Cell Phone", vtype: "phone" },
			{ xtype: "textfield", readOnly: true, name: "firstEcontactemail", fieldLabel: "Email", vtype: "email", maxLength: 45, maxLengthText: 'Email should be less than 45 characters' },
			{ xtype: "textfield", readOnly: true, name: "firstEcontactrelation", fieldLabel: "Relation", maxLength: 45, maxLengthText: 'Relation should be less than 45 characters' },
			{ xtype: "textfield", readOnly: true, name: "firstEcontactaddress1", fieldLabel: "Address", maxLength: 45, maxLengthText: 'Address should be less than 45 characters' },
			{ xtype: "textfield", readOnly: true, name: "firstEcontactaddress2", fieldLabel: "Address 2", maxLength: 45, maxLengthText: 'Address 2 should be less than 45 characters' },
			{ xtype: "textfield", readOnly: true, name: "firstEcontactcity", fieldLabel: "City", maxLength: 45, maxLengthText: 'City should be less than 45 characters' },
			{ xtype: "ux.combo", comboType: "states", readOnly: true, name: "firstEcontactstate", store: new Ext.data.ArrayStore({ fields: ["abbr", "name"], data: Ext.ux.Combo.getStates() }) },
			{ xtype: "textfield", readOnly: true, name: "firstEcontactzip", fieldLabel: "Zip Code", vtype: "zip" }
		];
        var rightFields = [
			{ xtype: "displayfield", value: "Secondary Contact" },
			{ xtype: "textfield", readOnly: true, name: "secondEcontactfirstName", fieldLabel: "First Name", maxLength: 45, maxLengthText: 'First Name should be less than 45 characters' },
			{ xtype: "textfield", readOnly: true, name: "secondEcontactlastName", fieldLabel: "Last Name", maxLength: 45, maxLengthText: 'Last Name should be less than 45 characters' },
			{ xtype: "textfield", readOnly: true, name: "secondEcontactphoneNumber", fieldLabel: "Phone Number", vtype: "phone" },
			{ xtype: "textfield", readOnly: true, name: "secondEcontactcellNumber", fieldLabel: "Cell Phone", vtype: "phone" },
			{ xtype: "textfield", readOnly: true, name: "secondEcontactemail", fieldLabel: "Email", vtype: "email", maxLength: 45, maxLengthText: 'Email should be less than 45 characters' },
			{ xtype: "textfield", readOnly: true, name: "secondEcontactrelation", fieldLabel: "Relation", maxLength: 45, maxLengthText: 'Relation should be less than 45 characters' },
			{ xtype: "textfield", readOnly: true, name: "secondEcontactaddress1", fieldLabel: "Address", maxLength: 45, maxLengthText: 'Address should be less than 45 characters' },
			{ xtype: "textfield", readOnly: true, name: "secondEcontactaddress2", fieldLabel: "Address 2", maxLength: 45, maxLengthText: 'Address 2 should be less than 45 characters' },
			{ xtype: "textfield", readOnly: true, name: "secondEcontactcity", fieldLabel: "City", maxLength: 45, maxLengthText: 'City should be less than 45 characters' },
			{ xtype: "ux.combo", comboType: "states", readOnly: true, name: "secondEcontactstate", store: new Ext.data.ArrayStore({ fields: ["abbr", "name"], data: Ext.ux.Combo.getStates() }) },
			{ xtype: "textfield", readOnly: true, name: "secondEcontactzip", fieldLabel: "Zip Code", vtype: "zip" }
		];

        return {
            title: "Emergency Contact Information",
            layout: 'column',
            defaults: { columnWidth: 0.5, layout: 'form', defaults: { anchor: "-20"} },
            tbar: this.createInfoToolbar(),
            items: [{ items: leftFields }, { items: rightFields}]
        };
    },

    createPhyInfoItems: function () {
        var leftFields = [
			{ xtype: "textfield", readOnly: true, name: "PhysicianfirstName", fieldLabel: "First Name", maxLengthText: 'First Name should be less than 45 characters', maxLength: 45 },
			{ xtype: "textfield", readOnly: true, name: "PhysicianlastName", fieldLabel: "Last Name", maxLengthText: 'Last Name should be less than 45 characters', maxLength: 45 },
			{ xtype: "textfield", readOnly: true, name: "Physicianemail", fieldLabel: "Email", vtype: "email", maxLengthText: 'Email should be less than 45 characters', maxLength: 45 },
			{ xtype: "textfield", readOnly: true, name: "Physicianaddress1", fieldLabel: "Address", maxLengthText: 'Address should be less than 45 characters', maxLength: 45 },
			{ xtype: "textfield", readOnly: true, name: "Physicianaddress2", fieldLabel: "Address 2", maxLengthText: 'Address 2 should be less than 45 characters', maxLength: 45 }
		];
        var rightFields = [
			{ xtype: "textfield", readOnly: true, name: "PhysicianphoneNumber", fieldLabel: "Phone Number", vtype: "phone" },
			{ xtype: "textfield", readOnly: true, name: "PhysiciancellNumber", fieldLabel: "Cell Phone", vtype: "phone" },
			{ xtype: "textfield", readOnly: true, name: "Physiciancompany", fieldLabel: "Company", maxLengthText: 'Company should be less than 45 characters', maxLength: 45 },
			{ xtype: "textfield", readOnly: true, name: "Physiciancity", fieldLabel: "City", maxLengthText: 'City should be less than 45 characters', maxLength: 45 },
			{ xtype: "ux.combo", comboType: "states", readOnly: true, name: "Physicianstate", store: new Ext.data.ArrayStore({ fields: ["abbr", "name"], data: Ext.ux.Combo.getStates() }) },
			{ xtype: "numberfield", readOnly: true, name: "Physicianzip", fieldLabel: "Zip Code", vtype: "zip" }
		];

        return {
            title: "Physician Contact Information",
            layout: 'column',
            tbar: this.createInfoToolbar(),
            defaults: { columnWidth: 0.5, layout: 'form', defaults: { anchor: "-20"} },
            items: [{ items: leftFields }, { items: rightFields}]
        };
    },

    createDetInfoItems: function () {
        var fields = [
			{ xtype: "textarea", readOnly: true, fieldLabel: "Personal Characteristics", name: "characters", height: 60, maxLength: 256, maxLengthText: 'Personal Characteristics should be less than 256 characters' },
			{ xtype: "textarea", readOnly: true, fieldLabel: "Family History", name: "familyHistory", height: 60, maxLength: 256, maxLengthText: 'Family History should be less than 256 characters' },
			{ xtype: "textarea", readOnly: true, fieldLabel: "Education Background", name: "education", height: 60, maxLength: 128, maxLengthText: 'Education Background should be less than 128 characters' },
			{ xtype: "textarea", readOnly: true, fieldLabel: "Work History", name: "workHistory", height: 60, maxLength: 256, maxLengthText: '"Work History should be less than 256 characters' },
			{ xtype: "textarea", readOnly: true, fieldLabel: "Talents, hobbies and interests", name: "talentInterest", height: 60, maxLength: 512, maxLengthText: 'Talents, hobbies and interests should be less than 512 characters' },
			{ xtype: "textarea", readOnly: true, fieldLabel: "Likes/Dislikes", name: "likeDislike", height: 60, maxLength: 512, maxLengthText: 'Likes/Dislikes should be less than 512 characters' },
			{ xtype: "textarea", readOnly: true, fieldLabel: "Social Engagement", name: "socialRelated", height: 60, maxLength: 512, maxLengthText: 'Social Engagement should be less than 512 characters' }
		];


        return {
            title: "Detailed Information",
            layout: 'form',
            tbar: this.createInfoToolbar(),
            defaults: { anchor: "-20" },
            items: fields
        };
    },

    createInfoToolbar: function () {
        return [
			'<b>Client</b>: ',
			{ xtype: 'tbtext', itemId: 'clientName' },
			'-',
			'<b>Gender</b>: ',
			{ xtype: 'tbtext', itemId: 'gender' }
		];
    },

    onTabChange: function (tabPanel, panel) {
        var tbar = panel.getTopToolbar();
        if (tbar) {
            var form = this.form.getForm();
            tbar.getComponent('clientName').setText(form.findField('firstName').getRawValue() + ' ' + form.findField('lastName').getRawValue());
            tbar.getComponent('gender').setText(form.findField('gender').getRawValue());
        }
    },

    getFormItems: function (b) {
        //var activetab = (b === false) ? 2 : 0;
        return {
            xtype: "tabpanel",
            activeItem: 0,
            layoutOnTabChange: true,
            defaults: {
                autoHeight: true,
                frame: true,
                hideMode: 'offsets'
            },
            listeners: {
                tabchange: this.onTabChange,
                scope: this
            },
            items: [
				this.createParInfoItems(),
				this.createMedicalItems(),
				this.createEmeInfoItems(b),
				this.createPhyInfoItems(),
				this.createDetInfoItems()
			]
        };
    }
});