Ext.ns("mOQOLD");
mOQOLD.ImageViewerList = Ext.extend(Ext.Panel, {
	id: 0,
	observation: false,
	scroll: "vertical",
	layout: 'fit',

	initComponent: function () {
		
		if (this.observation) {
			this.backCard = 'observationdetail';
		} else {
			this.backCard = 'activityform';
		}

		var title = "Image Gallery";
		this.dockedItems = [
        {
        	xtype: 'toolbar',
        	ui: 'light',
        	dock: 'top',
        	title: title,
        	items: [
            {
            	xtype: 'moqold.back-button',
            	handler: this.goPrevPage,
            	scope: this
            }
            ]
        }
        ];
		this.items = [this.buildImageList()];

		mOQOLD.ImageViewerList.superclass.initComponent.call(this);
		this.on('deactivate', this.autoDestroy, this);
	},
	autoDestroy: function () {
		this.ownerCt.remove(this);
		//this.ownerCt.doLayout();
		this.destroy();
	},
	goPrevPage: function () {
		this.actionMode = 'back';
		mOQOLD.Main.flipPage({
			targetCard: this.backCard
		}, { rec: this.rec });
	},
	buildImageList: function () {
		var params = {
			extAction: "PhotoAPI",
			extTID: 0,
			extUpload: false,
			extType: "rpc"
		};
		if (this.observation === true) {
			params = Ext.applyIf(params, { observationID: this.id, extMethod: "getImagesForMobileObservation" });
		} else {
			params = Ext.applyIf(params, { activityID: this.id, extMethod: "getImagesForMobileActivity" });
		}

		Ext.regModel('Images', {
			fields: ['ID', 'tag', 'url']
		});
		this.imagesStore = new Ext.data.JsonStore({
			storeId: "ImagesStore",
			autoLoad: false,
			model: 'Images'

		});
		Ext.Ajax.request({
			url: "../index.php/direct/router",
			params: params,
			scope: this,
			success: function (response) {
				var result = Ext.decode(response.responseText).result;
				if (result) {
					this.imagesStore.loadData(result.items);
				}
			}
		});

		return {
			xtype: "list",
			store: this.imagesStore,
			singleSelect: true,
			autoHeight: true,
			emptyText: "No Image Entries",
			itemTpl: Ext.XTemplate.from('participant-list'),
			listeners: {
				scope: this,
				itemtap: this.onImageTap
			}
		};

	},
	onImageTap: function (dv, index) {
		var storeIndex = index;
		var store = dv.store;
		var imageRecord = store.getAt(storeIndex);

		mOQOLD.Main.flipPage({
			targetCard: "imageviewer"
		}, { rec: this.rec, imageRec: imageRecord, observation: this.observation });
	}
});

Ext.reg('moqold.imagelist', mOQOLD.ImageViewerList);