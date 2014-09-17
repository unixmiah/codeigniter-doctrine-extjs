Ext.ns("mOQOLD");

mOQOLD.LeftMenu = Ext.extend(Ext.BoxComponent, {
	border: false,
	width: 258,

	initComponent: function () {

		if (!this.tpl) {
			this.tpl = Ext.XTemplate.from('admin-menu-tpl').compile();
		}

		mOQOLD.LeftMenu.superclass.initComponent.call(this);

		this.on('afterrender', this.attachClickHandler, this);
	},

	attachClickHandler: function () {
		this.mon(this.getEl(), 'click', this.onClick, this);
	},

	onClick: function (e) {
		var e = Ext.fly(e.getTarget());
		if (e.hasClass('header')) {
			var items = e.next();
			items.setVisibilityMode(Ext.Element.DISPLAY);
			items.toggle(true);
		}
	},

	data: [
		{
			text: 'Facility Information',
			items: [
				{ href: "OrgInfo", text: "Facility Information", icon: "facility_icon" },
				{ href: "Contact", text: "Contact Information", icon: "contactinfo_icon" },
				{ href: "Residents", text: "Participants", icon: "residentinfo_icon" },
				{ href: "RedFlag", text: "Red Flag Report", icon: "redflag_icon" },
				{ href: "User", text: "User Maintenance", icon: "usermain_icon" },
				{ href: "UserRole", text: "Role Maintenance", icon: "usermain_icon" }
			]
		},
		{
			text: 'mOQOLD Setup',
			items: [
				{ href: "Location", text: "Location Setup", icon: "locationsetup_icon" },
				{ href: "Activity", text: "Activity Setup", icon: "activitysetup_icon" },
				{ href: "Weather", text: "Weather Setup", icon: "weathersetup_icon" },
				{ href: "Noise", text: "Noise Setup", icon: "noisesetup_icon" },
				{ href: "Animal", text: "Animal Setup", icon: "animalsetup_icon" },
				//{ href: "QolScore", text: "QoL Setup", icon: "siteconfig_icon" },
				{ href: "Dimension", text: "Dimension Setup", icon: "siteconfig_icon" },
				{ href: "SiteConfiguration", text: "Site Configuration", icon: "siteconfig_icon" }
			]
		},
		{
			text: "Falls Setup",
			items: [
				{ href: "BodyPart", text: "Body Part Setup", icon: "bodypart_icon" },
				{ href: "IncidentCause", text: "Cause Setup", icon: "incidentcause_icon" },
				{ href: "Footwear", text: "Footwear Setup", icon: "footwear_icon" },
				{ href: "IncidentActivity", text: "Activity Setup", icon: "incidentactivity_icon" },
				{ href: "Injury", text: "Injury Setup", icon: "injurysetup_icon" }
			]
		}
	]
});

Ext.reg("moqold.leftmenu", mOQOLD.LeftMenu);
