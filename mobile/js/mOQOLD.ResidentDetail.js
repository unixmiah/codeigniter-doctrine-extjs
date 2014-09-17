Ext.ns("mOQOLD");

mOQOLD.ResidentDetail = Ext.extend(Ext.TabPanel, {
	defaults: { scroll: "vertical" },
	
	initComponent: function() {
		this.items = [
			this.buildClientInfo(),
			this.buildFamilyInfo(),
			this.buildConditions(),
			this.buildAllergies()
		];
		
		mOQOLD.ResidentDetail.superclass.initComponent.call(this);
		
		this.on("deactivate", this.destroyItems, this);
	},
	
	destroyItems: function() {
		delete this.rec;
		this.destroy();
	},
	
	makeMenu: function() {
		var html =  "<div class='menu-wrap'>";
			html += "	<div id='back-list' class='month-menu-item'>Back to<br>List</div>";
			html += "	<div id='blank' class='month-menu-item'>&nbsp;</div>";
			html += "</div>";
		return {
			xtype: "component",
			html: html
		};
	},
	
	loadModule: function(name) {
		if (name === "blank") {
			return ;
		}
		switch(name) {
			case "back-list" :
				var list = { xtype: "moqold.residentlist" };
				break;
		}
		
		var owner = this.ownerCt;
		var cmp = owner.add(list);
		owner.doLayout();
		owner.setActiveItem(cmp, { type: "slide", reverse: true });
	},
	
	buildClientInfo: function() {
		var tpl = new Ext.Template(
//			'<div><img src="{img}"></div>',
			'<div>',
				'<div><span class="client-title">Name:</span> {lastName}, {firstName}</div>',
				'<div><span class="client-title">Nickname:</span> {nickName}</div>',
				'<div><span class="client-title">Age:</span> {age}</div>',
				'<div><span class="client-title">Gender:</span> {genderName}</div>',
			'</div>'
		);
		
		return {
			xtype: "container",
			title: "Client",
			html: tpl.apply(this.rec.data)
		};
	},
	
	buildFamilyInfo: function() {
		var tpl = new Ext.Template(
			'<div>',
				'<div class="client-header">First Emergency Contact</div>',
				'<div><span class="client-title">Name:</span> {firstEcontactlastName}, {firstEcontactfirstName}</div>',
				'<div><span class="client-title">Relation:</span> {firstEcontactrelation}</div>',
				'<div><span class="client-title">Home Phone:</span> {firstEcontactphoneNumber}</div>',
				'<div><span class="client-title">Cell Phone:</span> {firstEcontactcellNumber}</div>',
				'<div><span class="client-title">Email:</span> {firstEcontactemail}</div>',
				'<div><span class="client-title">Address:</span> {firstEcontactaddress1}<br>{firstEcontactaddress2}<br>{firstEcontactcity}, {firstEcontactstate} {firstEcontactzip}</div>',
			'</div>',
			'<hr>',
			'<div>',
				'<div class="client-header">Second Emergency Contact</div>',
				'<div><span class="client-title">Name:</span> {secondEcontactlastName}, {secondEcontactfirstName}</div>',
				'<div><span class="client-title">Relation:</span> {secondEcontactrelation}</div>',
				'<div><span class="client-title">Home Phone:</span> {secondEcontactphoneNumber}</div>',
				'<div><span class="client-title">Cell Phone:</span> {secondEcontactcellNumber}</div>',
				'<div><span class="client-title">Email:</span> {secondEcontactemail}</div>',
				'<div><span class="client-title">Address:</span> {secondEcontactaddress1}<br>{secondEcontactaddress2}<br>{secondEcontactcity}, {secondEcontactstate} {secondEcontactzip}</div>',
			'</div>',
			'<hr>',
			'<div>',
				'<div class="client-header">Physician Emergency Contact</div>',
				'<div><span class="client-title">Name:</span> {PhysicianlastName}, {PhysicianfirstName}</div>',
				'<div><span class="client-title">Company:</span> {Physiciancompany}</div>',
				'<div><span class="client-title">Home Phone:</span> {PhysicianphoneNumber}</div>',
				'<div><span class="client-title">Cell Phone:</span> {PhysiciancellNumber}</div>',
				'<div><span class="client-title">Email:</span> {Physicianemail}</div>',
				'<div><span class="client-title">Address:</span> {Physicianaddress1}<br>{Physicianaddress2}<br>{Physiciancity}, {Physicianstate} {Physicianzip}</div>',
			'</div>'
		);
		return {
			xtype: "container",
			title: "Contact",
			html: tpl.apply(this.rec.data)
		};
	},
	
	buildConditions: function() {
		var dataview = {
			xtype: "dataview",
			itemSelector: "div.condition-entry",
			store: new Ext.data.JsonStore({
				model: "ConditionList",
				autoLoad: true,
				proxy: {
					type: "direct",
					api: "ClientSpecialcondDetailAPI",
					extraParams: { clientID: this.rec.get("ID") },
					reader: {
						type: "direct",
						idProperty: "ID",
						root: "items",
						totalProperty: "total"
					}
				}
			}),
			tpl: new Ext.XTemplate(
				'<tpl for=".">',
					'<div class="condition-entry">',
						'<div><span class="client-title">Date Recorded:</span> {recDate:date("M j Y")}</div>',
						'<div><span class="client-title">Title:</span> {title}</div>',
						'<div><span class="client-title">Description:</span> {description}</div>',
					'</div>',
					'<hr>',
				'</tpl>'
			)
		};
		
		return {
			xtype: "container",
			title: "Conditions",
			layout: "fit",
			items: dataview
		};
	},
	
	buildAllergies: function() {
		var dataview = {
			xtype: "dataview",
			itemSelector: "div.allergy-entry",
			store: new Ext.data.JsonStore({
				model: "AllergyList",
				autoLoad: true,
				proxy: {
					type: "direct",
					api: "AllergyDetailAPI",
					extraParams: { clientID: this.rec.get("ID") },
					reader: {
						type: "direct",
						idProperty: "ID",
						root: "items",
						totalProperty: "total"
					}
				}
			}),
			tpl: new Ext.XTemplate(
				'<tpl for=".">',
					'<div class="allergy-entry">',
						'<div><span class="client-title">Allergy:</span> {allergyName}</div>',
					'</div>',
					'<hr>',
				'</tpl>'
			)
		};
		
		return {
			xtype: "container",
			title: "Allergies",
			layout: "fit",
			items: dataview
		};
	}
});

Ext.reg("moqold.residentdetail", mOQOLD.ResidentDetail);