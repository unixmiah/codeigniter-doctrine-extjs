Ext.ns("Ext.data");

Ext.data.DirectReader = Ext.extend(Ext.data.JsonReader, {
	getResponseData: function (response) {
		var data = Ext.data.DirectReader.superclass.getResponseData.call(this, response);
		if (data) {
			return data.result;
		}
	}
});
Ext.data.ReaderMgr.registerType('direct', Ext.data.DirectReader);