Ext.ns("mOQOLD");

mOQOLD.Twitter = Ext.extend(Ext.ux.Portlet, {
	height: 200,
	autoScroll: true,
	collapsible: true,
	frame: true,
	
	initComponent: function() {
		this.title = "Twitter";
		
		this.html = "Loading...";
		
		var baseApi = Ext.app["OrgInfoAPI"];
		
		var providers = Ext.Direct.providers;
		var provider = "";
		for (var name in providers) {
			provider = providers[name];
		}
		
		provider.on("data", this.gotData, this);
		
		baseApi.getTwitterUsername({"ID": 1});
		
		mOQOLD.Twitter.superclass.initComponent.call(this);
	},
	
	gotData: function(p, e) {
		if (e.action === "OrgInfoAPI" && e.status === true && e.method === "getTwitterUsername") {
			var username = e.result[0].orgTwitterName;
			this.update("");
			if (username === "" || username === null) {
				this.update("Update your username under the Facility Information form to view your Twitter Feed");
				return ;
			}
			this.username = username;
			
			this.removeAll();
			this.add({ html: "<b>Twitter Feed - "+username+"</b><hr>" }, this.createDataView());
			this.doLayout();
		}
	},
	
	createStore: function() {
		return new Ext.data.Store({
			autoLoad: true,
			baseParams: {
				screen_name: this.username
			},
			proxy: new Ext.data.ScriptTagProxy({
				url: "https://api.twitter.com/1/statuses/user_timeline.json"
			}),
			reader: new Ext.data.JsonReader({
				fields: ["text"]
			})
		});
	},
	
	createDataView: function() {
		var store = this.createStore();
		
		return {
			xtype: "dataview",
			store: store,
			itemSelector: "li.tweet",
			overClass : "activity-over",
			selectedClass : "activity-selected",
			autoHeight: true,
			tpl: new Ext.XTemplate(
				'<ol>',
					'<tpl for=".">',
						'<li class="tweet">{text}</li>',
					'</tpl>',
				'</ol>'
			)
		};
	}
});