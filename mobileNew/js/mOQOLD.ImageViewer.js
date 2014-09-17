Ext.ns("mOQOLD");
mOQOLD.ImageViewer = Ext.extend(Ext.Panel, {
	layout: 'fit',
	imageRec: {},
	rec: {},
	backCard: 'imagelist',
	initComponent: function () {
		var title = this.imageRec.data.tag;

		this.dockedItems = [
            {
            	xtype: 'toolbar',
            	ui: 'light',
            	dock: 'top',
            	title: this.imageRec.data.tag,
            	items: [{ xtype: 'moqold.back-button',
            		handler: this.goPrevPage,
            		scope: this
            	}]
            }
		];
		this.imagePanel = new Ext.Panel({
			fullscreen: true,
			html: "<img  style='height: 100%; width: 100%;' src='" + mOQOLD.getActivityImageURL(this.imageRec.data.url) + "'>"
		});
		this.items = [this.imagePanel];
		mOQOLD.ResidentList.superclass.initComponent.call(this);
		this.on('activate', this.onActivate, this);
		this.on('deactivate', function () {
			this.ownerCt.remove(this);
			this.destroy();
		}, this);
	},
	goPrevPage: function () {
		mOQOLD.Main.flipPage({
			targetCard: "imagelist"
		}, { id: this.rec.data.ID, rec: this.rec, observation: this.observation });
	},
	onActivate: function () {
		var toolbar = this.getDockedItems(0);
		toolbar.title = this.imageRec.data.tag;
		this.imagePanel.html = "<img style='height: 100%; width: 100%;' src='" + mOQOLD.getActivityImageURL(this.imageRec.data.url) + "'>";
	}
});
Ext.reg('moqold.imageviewer', mOQOLD.ImageViewer);