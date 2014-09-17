Ext.ux.Calendar = Ext.extend(Ext.Panel, {
	width: 320,
	constructor: function (config) {
		Ext.ux.Calendar.superclass.constructor.call(this, config);
		this.setPeriod();
		this.addEvents({
			navigate: true,
			tap: true,
			mouseover: true,
			mouseout: true
		});
	},
	setValue: function (value) {
		this.value = value;
		this.setPeriod();
		this.update();
	},
	setPeriod: function () {
		var value = this.value.clearTime();
		var startOfCalendar = value.getFirstDateOfMonth();
		var endOfCalendar = startOfCalendar.getLastDateOfMonth();

		this.startDate = startOfCalendar;
		this.endDate = endOfCalendar;
	},
	onRender: function (container, position) {
		Ext.ux.Calendar.superclass.onRender.apply(this, arguments);
		this.createInitialLayout();
		this.update();
	},
	daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	value: new Date(),
	moveMonths: function (months) {
		this.value = this.value.add(Date.MONTH, months);
		this.setPeriod();
		this.update();
	},
	showPrevMonth: function () {
		this.moveMonths(-1);
	},
	showNextMonth: function () {
		this.moveMonths(1);
	},

	createInitialLayout: function () {
		var htmlData = [];
		htmlData.push('<div class="ux-cal">');
		htmlData.push("<table class=\"ux-cal\" cellspacing='0'>");

		htmlData.push("<thead>");

		htmlData.push("<tr class='ux-cal-header'>");
		var daysOfWeek = this.daysOfWeek;
		for (var i = 0; i < 7; i++) {
			var width = i == 0 || i == 6 ? 15 : 14;
			var className = "";
			var text = daysOfWeek[i];
			if (i === 0) {
				className = "ux-cal-prevMonth";
			} else if (i == 6) {
				className = "ux-cal-nextMonth";
			}
			if (i == 3) {
				text = '<span>Month</span>' + text;
			}
			htmlData.push('<th class="' + className + '">' + text + '</th>');
		}
		htmlData.push('</tr>');
		htmlData.push('</thead>');
		htmlData.push('<tbody>');

		for (var i = 0; i < 42; i++) {
			if (i % 7 == 0) { // First day of week
				htmlData.push("<tr class='ux-cal-row'>");
			}
			htmlData.push("<td>&nbsp;</td>");
			if (i % 7 == 6) { // Last day of week
				htmlData.push("</tr>");
			}
		}
		htmlData.push('</tbody>');
		htmlData.push("</table>");
		htmlData.push('</div>');
		Ext.DomHelper.append(this.body, htmlData.join(""));

		var leftNav = Ext.get(this.body.query("th.ux-cal-prevMonth")[0]);
		var rightNav = Ext.get(this.body.query("th.ux-cal-nextMonth")[0]);
		leftNav.on('tap', this.showPrevMonth, this);
		rightNav.on('tap', this.showNextMonth, this);

		this.calendarHeaderEl = Ext.get(this.body.query('span'));

		var table = Ext.get(this.body.query('table')[0]);
		table.on({
			mouseover: this.onMouseOver,
			mouseout: this.onMouseOut,
			click: this.onTap,
			scope: this
		});

		this.cells = this.body.query('tbody td');
	},

	beforeDestroy: function () {
		delete this.cells;
		delete this.calendarHeaderEl;
		Ext.ux.Calendar.superclass.beforeDestroy.apply(this, arguments);
	},

	onMouseOver: function (e) {
		this.processEvent('mouseover', e);
	},

	onMouseOut: function (e) {
		this.fireEvent('mouseout', e, this);
	},

	onTap: function (e) {
		this.processEvent('tap', e);
	},

	processEvent: function (eventName, e) {
		var t = e.getTarget();
		var o = {};
		if (t.tagName == 'TD') {
			var cell = t;
			var row = t.parentNode;
			var rowIndex = row.rowIndex - 1;
			o = { cellIndex: cell.cellIndex, rowIndex: rowIndex, row: row, cell: cell };
			if (rowIndex >= 0) {
				o.date = this.startOfCalendar.add(Date.DAY, ((o.rowIndex) * 7) + o.cellIndex);
			}
		}
		this.fireEvent(eventName, o, e);
	},

	update: function () {
		var value = this.value.clearTime();
		var startOfCalendar = this.startDate;
		var endOfCalendar = this.endDate;

		this.fireEvent('navigate', this, { start: startOfCalendar, end: endOfCalendar });

		var startWeekDay = Number(startOfCalendar.format("N"));
		if (startWeekDay > 0) {
			startOfCalendar = startOfCalendar.add(Date.DAY, -startWeekDay);
		}

		var endWeekDay = Number(endOfCalendar.format("N"));
		if (endWeekDay < 6) {
			endOfCalendar = endOfCalendar.add(Date.DAY, 6 - endWeekDay);
		}

		var duration = endOfCalendar - startOfCalendar;
		var oneDay = 1000 * 60 * 60 * 24;
		duration = duration / oneDay + 1;

		endOfCalendar = endOfCalendar.add(Date.DAY, 42 - duration);

		var htmlData = [];

		var calendarTitle = value.format("F, Y");
		this.calendarHeaderEl.update(calendarTitle);

		var currentMonth = value.format("m");
		var o = { today: new Date().clearTime(), date: startOfCalendar, value: this.value };
		var cells = this.cells;
		this.startOfCalendar = startOfCalendar;
		for (var i = 0; i < 42; i++) {

			o.css = o.date.format("m") == currentMonth ? "sameMonth" : "otherMonth";
			o.css += " x-unselectable";
			o.caption = o.date.format("d");
			o.cell = cells[i];

			this.formatDay(o);

			var date = o.date.format("U");
			if (o.hasEvent) {
				var baseClass;
				if (date === o.value.format("U")) {
					baseClass = "selected_";
				} else if (date === o.today.format("U")) {
					baseClass = "today_";
				} else {
					baseClass = "";
				}
				o.css += " " + baseClass + "date_has_event";
			} else if (date === o.value.format("U")) {
				o.css += " selected";
			} else if (date === o.today.format("U")) {
				o.css += " today";
			}

			o.cell.className = o.css;
			o.cell.innerHTML = o.caption;
			o.date = o.date.add(Date.DAY, 1);
		}
	},
	formatDay: function (o) {
		if (o.date.format("U") === o.today.format("U")) {
			o.css += " today_date_has_event"
		}
		o.css += " date_has_event";
	}
});
Ext.reg("ux.calendar", Ext.ux.Calendar);