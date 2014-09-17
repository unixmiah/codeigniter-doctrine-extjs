Ext.ns("mOQOLD");

Ext.setup({
	tabletStartupScreen: 'tablet_startup.png',
	phoneStartupScreen: 'phone_startup.png',
	icon: 'icon.png',
	glossOnIcon: false,
	fullscreen: true,
	onReady: function() {
		mOQOLD.Main = new mOQOLD.App();
	}
});

mOQOLD.Colors = [
	"FA7166", "CF2424", "A01A1A", "7E3838", "CA7609", "F88015", "EDA12A", "D5B816", "E281CA", "BF53A4", "9D3283",
	"7A0F60", "542382", "7742A9", "8763CA", "B586E2", "7399F9", "4E79E6", "2951B9", "133897", "1A5173", "1A699C",
	"3694B7", "64B9D9", "A8C67B", "83AD47", "2E8F0C", "176413", "0F4C30", "386651", "3EA987", "7BC3B5"
];

mOQOLD.checkOnline = function() {
	return navigator.onLine;
};

mOQOLD.FormRequiredCheck = function(form) {
	var valid = true;
	var items = form.items;
	
	items.each(function(item) {
		if (valid && item.required) {
			if (item.value === "") {
				valid = false;
			}
		}
	});
	
	if (!valid) {
		Ext.Msg.alert("Saving form", "Some fields are required. Please go back and check the form.", Ext.emptyFn);
	}
	
	return valid;
}