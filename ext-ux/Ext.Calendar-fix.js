(function () {
	//- override start for DnD as mentioned in their website
	var nodeOverInterceptor = function (n, dd, e, data) {
		if (data.selections) {
			data.type = 'griddrag';
			data.start = n.date;
			data.proxy = {
				updateMsg: Ext.emptyFn
			}
		}
	};

	var dayViewNodeOverInterceptor = function (n, dd, e, data) {
		if (data.selections) {
			data.type = 'griddrag';
			data.start = n.date;
			data.proxy = {
				updateMsg: Ext.emptyFn
			}

			var dayCol = e.getTarget('.ext-cal-day-col', 5, true);
			if (dayCol) {
				var box = {
					height: Ext.ensible.cal.DayView.prototype.hourHeight / 2,
					width: dayCol.getWidth(),
					y: n.timeBox.y,
					x: n.el.getLeft()
				}
				this.shim(n.date, box);
			}
		}
	};

	var dropZoneProto = Ext.ensible.cal.DropZone.prototype,
	    dayDropZoneProto = Ext.ensible.cal.DayViewDropZone.prototype;

	dropZoneProto.onNodeOver = dropZoneProto.onNodeOver.createInterceptor(nodeOverInterceptor);
	dayDropZoneProto.onNodeOver = dayDropZoneProto.onNodeOver.createInterceptor(dayViewNodeOverInterceptor);
} ());