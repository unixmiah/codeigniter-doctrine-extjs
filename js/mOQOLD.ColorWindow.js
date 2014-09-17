Ext.ns("mOQOLD");

mOQOLD.ColorWindow = new mOQOLD.MaintenanceGridAbstract({
	createWindow: function (grid, rowIndex, colIndex) {
		var store = grid.getStore();
		var rec = store.getAt(rowIndex);
		this.rec = rec;
		var color = rec.get("colorCode");
		if (color.substr(0, 1) === "#") {
			color = color.substr(1);
		}
		  
		var paletteConfig = {
			colors: ["FA7166", "CF2424", "A01A1A", "7E3838", "CA7609", "F88015", "EDA12A", "D5B816", "E281CA", "BF53A4",
			"9D3283", "7A0F60", "542382", "7742A9", "8763CA", "B586E2", "7399F9", "4E79E6", "2951B9", "133897", "1A5173",
			"1A699C", "3694B7", "64B9D9", "A8C67B", "83AD47", "2E8F0C", "176413", "0F4C30", "386651", "3EA987", "7BC3B5"]
		};

		if (color !== "") {
			paletteConfig.value = color;
		}

		if (color.length != 6) {
			paletteConfig = {};
			color = "";
		}

		var palette = new Ext.ColorPalette(paletteConfig);
		palette.on("select", this.onColorPick, this);

		palette.colors = ["FA7166", "CF2424", "A01A1A", "7E3838", "CA7609", "F88015", "EDA12A", "D5B816", "E281CA", "BF53A4",
			"9D3283", "7A0F60", "542382", "7742A9", "8763CA", "B586E2", "7399F9", "4E79E6", "2951B9", "133897", "1A5173",
			"1A699C", "3694B7", "64B9D9", "A8C67B", "83AD47", "2E8F0C", "176413", "0F4C30", "386651", "3EA987", "7BC3B5"];

		var win = new Ext.Window({
			title: "Pick Color Code",
			modal: true,
			items: palette
		});

		win.on("beforedestroy", this.cleanWin, this);

		win.show();
		this.win = win;
	},

	onColorPick: function (palette, selColor) {
		var rec = this.rec;
		rec.set("colorCode", selColor);
		//console.log(selColor);

		this.win.close();
	},

	cleanWin: function () {
		delete this.rec;
		delete this.win;
	},

	createGrid: null,
	createForm: null
});