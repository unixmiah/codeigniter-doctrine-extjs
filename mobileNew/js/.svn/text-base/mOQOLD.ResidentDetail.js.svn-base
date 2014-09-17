Ext.ns("mOQOLD");

mOQOLD.ResidentDetail = Ext.extend(Ext.TabPanel, {
	defaults: {
		scroll: 'vertical',
		activeTab: 0
	},
	initComponent: function () {
		var rec = this.rec;
		this.imageURL = this.getImageURL(rec.data.ID);
		this.dockedItems = [
		{
			xtype: 'toolbar',
			ui: 'light',
			dock: 'top',
			title: rec.get('lastName') + ", " + rec.get('firstName'),
			items: [{ xtype: 'moqold.back-button', targetCard: 'residentlist'}]
		},
		this.buildClientInfo()
		];

		this.items = [
			this.buildPersonalInfo(),
			this.buildConditions(),
			this.buildContactInfo()
		];

		this.on('deactivate', this.autoDestroy, this);

		mOQOLD.ResidentDetail.superclass.initComponent.call(this);

	},
	autoDestroy: function () {
		this.ownerCt.remove(this);
		this.destroy();
	},
	getImageURL: function (id) {
		var loc = window.location;
		var url = loc.href.substr(0, loc.href.lastIndexOf("mobileNew/"));
		var cacheBuster = new Date().format('U');
		url = url + "thumbnail.php?id=" + id + "&type=CLI&timestamp=" + cacheBuster;
		return url;
	},
	buildClientInfo: function () {
		var tpl = new Ext.Template(
			'<div class="client-info-photo"><img height=100 src="' + this.imageURL + '"></div>',
			'<div class="client-info">',
			'<div><span class="client-title">Name:</span> {lastName}, {firstName}</div>',
			'<div><span class="client-title">Nickname:</span> {nickName}</div>',
			'<div><span class="client-title">Age:</span> {age}</div>',
			'<div><span class="client-title">Gender:</span> {genderName}</div>',
			'</div>'
			);

		return {
			xtype: "box",
			title: "Client",
			html: tpl.apply(this.rec.data)
		};
	},
	buildPersonalInfo: function () {

		var tpl = new Ext.Template(
			'<div>',
			'<div><span class="client-title">Birth Date:</span> {birthDate}</div>',
			'<div><span class="client-title">Room:</span> {roomDesc}</div>',
			'<div><span class="client-title">Check In date:</span> {chkInDate}</div>',
			'<div><span class="client-title">Has Assessment:</span> {hasAssessment}</div>',
			'<div><span class="client-title">Assessment Date:</span> {assessDate}</div>',
			'<div><span class="client-title">Has Assessment:</span> {hasAssessment}</div>',
			'<div><span class="client-title">Has Allergy:</span> {hasAllergyInd}</div>',
			'<div><span class="client-title">Has Special Condition:</span> {hasSpecialCondInd}</div>',
			'</div><hr>',
			'<div>',
			'<div class="client-header">Detailed Information</div>',
            '<div><span class="client-title">Personal Characteristics:</span> {characters}</div>',
			'<div><span class="client-title">Family History:</span> {familyHistory}</div>',
			'<div><span class="client-title">Education Background:</span> {education}</div>',
			'<div><span class="client-title">Work History:</span> {workHistory}</div>',
			'<div><span class="client-title">Talents, hobbies and interests:</span> {talentInterest}</div>',
			'<div><span class="client-title">Likes/Dislikes:</span> {likeDislike}</div>',
			'<div><span class="client-title">Social Engagement:</span> {socialRelated}</div>',
            '</div><hr>'
			);

		var dataForThis = {
			birthDate: (!Ext.isEmpty(this.rec.data.birthDate)) ? this.rec.data.birthDate.format('m-d-Y') : "",
			roomDesc: this.rec.data.roomDesc,
			chkInDate: (!Ext.isEmpty(this.rec.data.chkInDate)) ? this.rec.data.chkInDate.format('m-d-Y') : "",
			hasAssessment: (this.rec.data.hasAssessment == 0) ? "No" : "Yes",
			assessDate: (!Ext.isEmpty(this.rec.data.assessDate)) ? this.rec.data.assessDate.format('m-d-Y') : "",
			hasAllergyInd: (this.rec.data.hasAllergyInd == 0) ? "No" : "Yes",
			hasSpecialCondInd: (this.rec.data.hasSpecialCondInd == 0) ? "No" : "Yes",
			characters: this.rec.data.characters,
			familyHistory: this.rec.data.familyHistory,
			education: this.rec.data.education,
			workHistory: this.rec.data.workHistory,
			talentInterest: this.rec.data.talentInterest,
			likeDislike: this.rec.data.likeDislike,
			socialRelated: this.rec.data.socialRelated

		};
		return {
			xtype: "box",
			title: "Personal",
			html: tpl.apply(dataForThis)
		};

	},

	buildContactInfo: function () {
		var tpl = new Ext.Template(
			'<div>',
			'<div class="client-header">Primary Contact</div>',
			'<div><span class="client-title">Name:</span> {firstEcontactlastName}, {firstEcontactfirstName}</div>',
			'<div><span class="client-title">Relation:</span> {firstEcontactrelation}</div>',
			'<div><span class="client-title">Home Phone:</span> {firstEcontactphoneNumber}</div>',
			'<div><span class="client-title">Cell Phone:</span> {firstEcontactcellNumber}</div>',
			'<div><span class="client-title">Email:</span> {firstEcontactemail}</div>',
			'<div><span class="client-title">Address:</span> {firstEcontactaddress1}<br>{firstEcontactaddress2}<br>{firstEcontactcity}, {firstEcontactstate} {firstEcontactzip}</div>',
			'</div>',
			'<hr>',
			'<div>',
			'<div class="client-header">Secondary Contact</div>',
			'<div><span class="client-title">Name:</span> {secondEcontactlastName}, {secondEcontactfirstName}</div>',
			'<div><span class="client-title">Relation:</span> {secondEcontactrelation}</div>',
			'<div><span class="client-title">Home Phone:</span> {secondEcontactphoneNumber}</div>',
			'<div><span class="client-title">Cell Phone:</span> {secondEcontactcellNumber}</div>',
			'<div><span class="client-title">Email:</span> {secondEcontactemail}</div>',
			'<div><span class="client-title">Address:</span> {secondEcontactaddress1}<br>{secondEcontactaddress2}<br>{secondEcontactcity}, {secondEcontactstate} {secondEcontactzip}</div>',
			'</div>',
			'<hr>',
			'<div>',
			'<div class="client-header">Physician Contact Information</div>',
			'<div><span class="client-title">Name:</span> {PhysicianlastName}, {PhysicianfirstName}</div>',
			'<div><span class="client-title">Company:</span> {Physiciancompany}</div>',
			'<div><span class="client-title">Home Phone:</span> {PhysicianphoneNumber}</div>',
			'<div><span class="client-title">Cell Phone:</span> {PhysiciancellNumber}</div>',
			'<div><span class="client-title">Email:</span> {Physicianemail}</div>',
			'<div><span class="client-title">Address:</span> {Physicianaddress1}<br>{Physicianaddress2}<br>{Physiciancity}, {Physicianstate} {Physicianzip}</div>',
			'</div>'
			);
		return {
			xtype: "box",
			title: "Contact",
			html: tpl.apply(this.rec.data)
		};
	},

	applyFilter: function (store) {
		var clientId = this.rec.get('ID');
		store.filterBy(function (rec) {
			return rec.get('clientID') === clientId;
		});
	},

	buildConditions: function () {
		var store = mOQOLD.getStore('ConditionList');
		this.applyFilter(store);
		var dataview = {
			xtype: "dataview",
			itemSelector: "div.condition-entry",
			store: store,
			tpl: new Ext.XTemplate(
							'<div class="condition-entry">',
				'<div><span class="client-title">Special Conditions:</span>',
				'<tpl for=".">',
				'  {description}',
				'</tpl>',
				'</div></div>',
				'<hr>'
			   )
		};

		return {
			xtype: "container",
			title: "Medical",
			items: [this.buildAllergies(), dataview, this.buildAids()]
		};
	},

	buildAllergies: function () {
		var store = mOQOLD.getStore('AllergyList');
		this.applyFilter(store);
		var dataview = {
			xtype: "dataview",
			itemSelector: "div.allergy-entry",
			root: 'items',
			store: store,
			tpl: new Ext.XTemplate(
				'<div class="allergy-entry">',
				'<div><span class="client-title">Allergies:</span>',
				'<tpl for=".">',
				'  {allergyName}',
				'</tpl>',
				'</div></div>',
				'<hr>'
				)
		};
		return dataview;
	},

	buildAids: function () {
		var store = mOQOLD.getStore('ResidentAidList');
		this.applyFilter(store);
		var dataview = {
			xtype: "dataview",
			itemSelector: "div.allergy-entry",
			root: 'items',
			store: store,
			tpl: new Ext.XTemplate(
				'<div class="allergy-entry">',
				'<div><span class="client-title">Aids:</span>',
				'<tpl for=".">',
				'  {name}',
				'</tpl>',
				'</div></div>',
				'<hr>'
				)
		};
		return dataview;
	}
});

Ext.reg("moqold.participantdetail", mOQOLD.ResidentDetail);