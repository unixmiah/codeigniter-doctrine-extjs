Ext.ns("mOQOLD");

mOQOLD.MaintenanceGridAbstract = Ext.extend(Ext.util.Observable, {
	constructor: function (config) {
		Ext.apply(this, config);
		if (this.pageName) {
			//since page name is already set
		} else {
			var permAPI = this.permAPI || this.baseAPI;
			if (permAPI) {
				this.pageName = permAPI.substr(0, permAPI.length - 3);
			}
		}
		mOQOLD.MaintenanceGridAbstract.superclass.constructor.call(this);

		this.addEvents({
			save: true
		});
	},
	gridActions: ['remove', 'edit'],
	title: null,
	baseAPI: null,
	softDelete: true,
	pageName: null,

	formButtons: function () {
		return ["save", "cancel"];
	},

	getFormConfig: function () {
		return {};
	},
	activateModule: function (info) {
		var id;
		if (this.useDetailLayout) {
			id = (typeof info.id === "string") ? Number(info.id) : null;
			this.id = id;
		}
		return panel = this.createPanel({ id: id });
	},

	permissionCheck: function (ability, pageName, log) {
		if (typeof pageName !== "string") {
			var pageName = this.pageName;
		}
		if (ability === "submit") {
			ability = "update";
		}
		if (ability === "load") {
			ability = "read";
		}
		var security = mOQOLD.Security.hasPermission(pageName, ability);
		if (!security) {
			if (log !== false) {
				Ext.MessageBox.alert("Security", "You do not have permission to " + ability + ".<br><br>Attempt has been logged.");
			}
			return false;
		}
		return true;
	},

	formDefaults: {
		labelAlign: "right",
		labelWidth: 125,
		frame: true,
		defaultType: "textfield",
		trackResetOnLoad: true,
		autoScroll: true
	},

	getFormButtonConfigs: function () {
		
		return {
			save: { text: "Save", scope: this, handler: this.onBeforeSaveForm },
			clear: { text: "Reset", scope: this, handler: this.onResetForm },
			cancel: { text: "Cancel", scope: this, handler: this.onCancelForm },
			saveSendUser: { text: "Save & Send to User", scope: this, handler: this.onSendUser },
			edit: { text: "Edit", scope: this, handler: this.onEditForm },
			del: { text: "Delete", scope: this, handler: this.onDeleteForm },
			ical: { xtype: 'moqold.linkbutton', href: '', target:'_blank', text: "Add to Calendar", scope: this, handler: this.onAddToCalendar }

		};
	},

	onSendUser: Ext.emptyFn,
	onEditForm: Ext.emptyFn,
	onDeleteForm: Ext.emptyFn,

	onDetailEdit: function (btn) {
		if (btn.text === "Edit") {
			btn.setText('Save');
			this.setReadOnly(false);
		} else {
			this.onSaveForm();
		}
	},

	//function to override to do presaving parsing
	onBeforeSaveForm: function () {
		this.onSaveForm();
	},

	onSaveForm: function () {
		if (!this.permissionCheck("update")) {
			return;
		}
		mOQOLD.Main.logAction({ pageName: this.pageName, action: 'save' });
		var form = this.form.getForm();
		if (form.isValid()) {
			form.submit({
				waitMsg: 'Saving...',
				scope: this,
				success: this.onSendComplete,
				failure: this.onSendFailure
			});
		} else {
			if (this.pageName === "Client") {
				Ext.Msg.alert('Validation Failed', "Please validate all your inputs in all tabs !!");
			}
		}
	},

	setLocation: function (params) {
		var href;
		if (location.hash.substr(0, 6) === "#Admin") {
			href = "#Admin";
			params.module = this.moduleName;
		} else {
			href = "#" + this.moduleName;
		}
		var paramValue = Ext.urlEncode(params);
		if (paramValue.length > 0) {
			href += "|" + Ext.urlEncode(params);
		}
		location.href = href;
	},

	onSendComplete: function (form, action) {
		var result = action.result;

		var message = result.success ? 'Successfully saved' : 'Something went wrong';
		Ext.Msg.alert('Saving form', message);
		if (typeof this.doDisableAll === "function") {
			this.doDisableAll();
		}
		if (this.useDetailLayout) {
			if (Ext.num(result.data.ID, 0) !== this.id) {
				this.setLocation({ id: result.data.ID });
			} else {
				this.setReadOnly(true);
			}
		}
		this.fireEvent('save', this, result);
		this.onLoadSuccess(form, action);
	},

	onSendFailure: function (form, action) {
		var result = action.result;
		if (!result.success) {
			var message = result.msg || "Something went wrong";
			Ext.Msg.alert('Saving form', message);
		}
	},

	onResetForm: function () {
		this.form.getForm().reset();
	},

	onCancelForm: Ext.emptyFn,

	getFormButtons: function () {
		var items = [];
		var buttons;

		// button config can be defined as a function too
		if (typeof this.formButtons === 'function') {
			buttons = this.formButtons();
		} else {
			buttons = this.formButtons;
		}

		// if no buttons return
		if (!Ext.isArray(buttons)) {
			return null;
		}

		var availButtons = this.getFormButtonConfigs();
		for (var i = 0, len = buttons.length; i < len; i++) {
			var buttonInfo = buttons[i];
			if (typeof buttonInfo === 'string') {
				var button = availButtons[buttonInfo];
				if (typeof button === "object") {
					items.push(button);
				}
			} else {
				items.push(buttonInfo);
			}
		}

		return items;
	},

	createForm: function (options) {
		if (options === true) {
			options = { noTitle: true };
		}
		if (!this.permissionCheck("read")) {
			return;
		}

		var api = this.api || this.createFormAPI();
		var formConfig = this.getFormConfig() || {};


		if (this.useDetailLayout) {
			Ext.applyIf(formConfig, {
				title: this.title,
				api: this.createFormAPI(),
				baseParams: {},
				paramsAsHash: true,
				trackResetOnLoad: true,
				autoHeight: true,
				frame: true,
				buttons: [
					{ itemId: 'Edit', text: "Edit", scope: this, handler: this.onDetailEdit },
					{ text: "Back to the list", handler: this.onBackToList, scope: this }
				]
			});
		} else {
			Ext.applyIf(formConfig, this.formDefaults);
			Ext.applyIf(formConfig, {
				title: this.title,
				defaults: {
					anchor: "-20",
					listeners: {
						scope: this,
						specialkey: function (f, e) {
							if (e.getKey() === e.ENTER) {
								this.onSaveForm();
							}
						}
					}
				},
				autoHeight: true,
				api: api,
				baseParams: {},
				paramsAsHash: true,
				autoLoadForm: true
			});
			if (!options.isWizard) {
				Ext.applyIf(formConfig, { buttons: this.getFormButtons() });
			} else {
				delete formConfig.frame;
			}
		}

		if (options.noTitle === true || options.isWizard) {
			delete formConfig.title;
		}

		if (typeof this.getFormItems === 'function') {
			var isBlankAllowed;

			//Do this only for client form and see if we are in add mode and this is identified by the id value as 0, 
			//if edit the value will be non zero.

			if (this.id === 0 && formConfig.title === "Participant Information") {
				isBlankAllowed = true;
			} else {
				isBlankAllowed = false;
			}

			formConfig.items = this.getFormItems(isBlankAllowed);
		}

		if (typeof this.configureForm === 'function') {
			this.configureForm(formConfig);
		}

		if (typeof this.getFormListeners === "function") {
			formConfig.listeners = this.getFormListeners();
		}

		var form = new Ext.form.FormPanel(formConfig);

		if (formConfig.autoLoadForm === true || this.useDetailLayout) {
			form.on({
				afterrender: this.doFormAutoLoad,
				scope: this
			});
		}

		var fmx = form.form;
		this.form = form;

		if (this.NewEvent) {
			// This is only for new activity clicked on the panel
			if (this.clickedDate) {

				var startDate = fmx.findField('startDate');
				var startTime = fmx.findField('startTime');

				var endDate = fmx.findField('endDate');
				var endTime = fmx.findField('endTime');

				startDate.setValue(this.clickedDate);
				endDate.setValue(this.clickedDate);
				startTime.setValue(this.clickedDate.format('h:i A'));
				endTime.setValue(this.clickedDate.add(Date.MINUTE, 30).format('h:i A'));


				var duration = 0;
				if (startDate.isValid() && startTime.isValid() && endDate.isValid && endTime.isValid()) {
					var start = this.combineDateTime(startDate, startTime);
					var end = this.combineDateTime(endDate, endTime);
					duration = Math.floor((end - start) / 1000 / 60);
				}

				if (startDate.isValid()) {
					endDate.setMinValue(startDate.getValue());
				}

				fmx.findField('actDtlDuration').setValue(duration);

				this.form.form = fmx;
			}

		}



		return form;
	},

	doFormAutoLoad: function (form, id) {
		if (!this.permissionCheck("update")) {
			return;
		}
		var basicForm = form.getForm();
		if (typeof basicForm.baseParams.ID === "undefined") {
			basicForm.baseParams.ID = this.id;
		}
		if (typeof id === "number") {
			this.id = id;
			basicForm.baseParams.ID = id;
		}

		if (this.useDetailLayout) {
			this.setReadOnly(this.id !== 0);

			if (this.id === 0) {
				var tabPanel = form.getComponent(0);
				var items = tabPanel.items;
				for (var i = 1, len = items.getCount(); i < len; i++) {
					items.itemAt(i).setDisabled(true);
				}
			}
		}

		if (this.id !== 0) {
			basicForm.load({
				waitMsg: 'Loading..',
				success: this.onLoadSuccess,
				failure: function (form, response) {
					var msg = response.result.msg || "There was an error in loading the data for the form";
					Ext.Msg.alert('Load', msg);
				},
				scope: this
			});
		}
	},

	onLoadSuccess: function (form, response) {
		if (typeof this.onLoadSuccess === 'function') {
			this.onLoadSuccess(form, response);
		}
	},

	createFieldset: function (title, items, defaults, cfg) {
		var fieldset = {
			xtype: "fieldset",
			anchor: "100%",
			title: title,
			defaultType: "textfield",
			items: items
		};

		if (typeof cfg === "object") {
			Ext.applyIf(fieldset, cfg);
		}

		if (typeof defaults === "object") {
			Ext.applyIf(fieldset, { defaults: defaults });
		}

		return fieldset;
	},

	getFormItems: function () {
		var items = [];
		var config = this.getHybridConfig();

		for (var i = 0, len = config.length; i < len; i++) {
			var item = config[i];
			var formField = item.formField;

			if (typeof formField !== "undefined") {
				var itemConfig = Ext.applyIf(formField, {
					name: item.dataIndex
				});

				if (typeof itemConfig.defaultValue !== "undefined") {
					itemConfig.value = itemConfig.defaultValue;
				}

				items.push(itemConfig);
			}
		}

		return items;
	},

	getGridColumns: function () {
		var items = [];
		var config = this.getHybridConfig();
		for (var i = 0, len = config.length; i < len; i++) {
			var item = config[i];

			if (typeof item.header !== 'undefined') {
				var column = item;
				delete column.type;
				column.sortable = true;
				items.push(column);
			}
		}
		var actionColumn = this.getActionColumns();
		items = items.concat(actionColumn);

		return items;
	},

	getStoreFields: function () {
		var fields = [];
		var config = this.getHybridConfig();
		var fieldNames = {};
		for (var i = 0, len = config.length; i < len; i++) {
			var item = config[i];
			var fieldName = item.dataIndex;

			// if field hasn't already appeared in the list
			if (fieldName && typeof fieldNames[fieldName] === 'undefined') {
				var fieldConfig = Ext.copyTo({ name: fieldName }, item, ['type', 'dateFormat']);
				fields.push(fieldConfig);

				fieldNames[fieldName] = true;
			}
		}
		return fields;
	},

	getStoreConfig: function () {
		return {
			idProperty: 'ID',
			root: 'items',
			totalProperty: 'total'
		};
	},

	createStore: function () {
		if (!this.permissionCheck("read")) {
			return new Ext.data.Store();
		}

		var storeConfig = this.getStoreConfig();
		Ext.applyIf(storeConfig, this.storeDefaults);
		Ext.applyIf(storeConfig, {
			storeId: this.title,
			autoLoad: true
		});
		if (typeof this.defaultSort === 'string') {
			storeConfig.sortInfo = { field: this.defaultSort, direction: 'ASC' };
		} else if (typeof this.defaultSort === 'object') {
			storeConfig.sortInfo = { field: this.defaultSort.field, direction: this.defaultSort.direction };
		}

		if (typeof storeConfig.writer === 'undefined') {
			storeConfig.writer = new Ext.data.JsonWriter({
				writeAllFields: true,
				encode: false
			});
		}
		if (typeof storeConfig.fields === 'undefined') {
			storeConfig.fields = this.getStoreFields();
		}
		if (typeof storeConfig.proxy === 'undefined') {
			var apiBase = this.getBaseApi();
			var avail = ["read", "create", "update", "delete"];
			var apis = {
				read: apiBase.listAll,
				create: apiBase.update,
				update: apiBase.update,
				destroy: apiBase['delete']
			};
			for (var i = 0; i < avail.length; i++) {
				var abil = avail[i];
				var check = this.permissionCheck(abil, null, false);
				if (check === false) {
					delete apis[abil];
				}
			}
			storeConfig.proxy = new Ext.data.DirectProxy({
				api: apis
			});
		}

		var autoLoad = storeConfig.autoLoad || false;
		delete storeConfig.autoLoad;

		var store = new Ext.data.DirectStore(storeConfig);

		if (autoLoad) {
			var loadConfig = {};
			loadConfig.params = storeConfig.params || {};
			store.load(loadConfig);
		}

		store.on("exception", this.onStoreException);

		return store;
	},

	onStoreException: function (proxy, type, action, options, arg) {
		if (action === 'destroy') {
			Ext.Msg.alert("Error", "There was an error in this delete. Make sure this record does not have related records");
			return;
		}
		var msg = arg.msg;
		var modifiedRecs = this.getModifiedRecords();
		for (var i = 0; i < modifiedRecs.length; i++) {
			Ext.MessageBox.alert("Error", msg + "\r\nAll changes have been removed.");
			if (modifiedRecs[i].phantom) {
				this.remove(modifiedRecs[i]);
			} else {
				modifiedRecs[i].reject();
			}
		}
	},

	createFormAPI: function () {
		if (typeof this.getFormAPI === 'function') {
			return this.getFormAPI();
		} else {
			var baseApi = this.getBaseApi();
			var avail = ["load", "submit"];
			var apis = {
				load: baseApi.loadForm,
				submit: baseApi.saveForm
			};
			for (var i = 0; i < avail.length; i++) {
				var abil = avail[i];
				var check = this.permissionCheck(abil, null, false);
				if (check === false) {
					delete apis[abil];
				}
			}
			return api = apis;
		}
	},

	getBaseApi: function () {
		return Ext.app[this.baseAPI || (this.title + 'API')];
	},

	getActionConfigs: function () {
		return {
			remove: {
				icon: "images/fam/delete.gif",
				tooltip: "Delete " + this.title,
				abil: "delete",
				scope: this,
				handler: this.deleteRow
			},
			edit: {
				icon: "images/fam/cog_edit.png",
				tooltip: "Edit " + this.title,
				abil: "update",
				scope: this,
				handler: this.editRow
			},
			view: {
				icon: "images/fam/application_view_list.png",
				tooltip: "View " + this.title,
				abil: "read",
				scope: this,
				handler: this.onView
			},
			reply: {
				icon: "images/fam/add.png",
				tooltip: "Reply to " + this.title,
				abil: "create",
				scope: this,
				handler: this.onReply
			}
		};
	},

	getActionBaseConfig: function (items) {
		return {
			xtype: "actioncolumn",
			width: 50,
			items: items
		}
	},

	getActionColumns: function () {
		var columns = [];
		var actions = [];
		var requiredActions = this.gridActions;
		var actionConfigs = this.getActionConfigs();

		if (!Ext.isArray(requiredActions)) {
			return [];
		}

		for (var i = 0, len = requiredActions.length; i < len; i++) {
			var actionName = requiredActions[i];
			var actionConfig = actionConfigs[actionName];
			if (actionConfig) {
				var abil = actionConfig.abil;
				var check = this.permissionCheck(abil, null, false);
				if (check === true) {
					actions.push(actionConfig);
				}
			}
		}

		columns.push(this.getActionBaseConfig(actions));

		return columns;
	},

	gridDefaults: {
		stripeRows: true,
		viewConfig: { forceFit: true }
	},

	getGridConfig: function () {
		return {};
	},

	createGrid: function () {
		if (!this.permissionCheck("read")) {
			return;
		}
		// no grid for this screen - return empty
		if (typeof this.gridConfig === 'undefined' && typeof this.getHybridConfig === 'undefined') {
			return;
		}
		var grid, gridConfig, plugins;

		gridConfig = this.getGridConfig() || {};
		Ext.applyIf(gridConfig, this.gridDefaults);
		Ext.applyIf(gridConfig, {
			store: this.createStore(),
			autoHeight: true,
			cls: "drop-grid",
			loadMask: true
		});

		if (gridConfig.hideTitle !== true) {
			gridConfig.title = this.title + " List";
		}

		plugins = gridConfig.plugins || [];
		if (!Ext.isArray(plugins)) {
			plugins = [plugins];
			gridConfig.plugins = plugins;
		}

		if (typeof gridConfig.sm === 'undefined') {
			// todo: This should be configurable
			gridConfig.sm = new Ext.grid.RowSelectionModel({
				singleSelect: true
			});
		}

		if (typeof gridConfig.columns === 'undefined') {
			gridConfig.columns = this.getGridColumns();
		}

		if (gridConfig.isEditor === true) {
			grid = new Ext.grid.EditorGridPanel(gridConfig);
		} else {
			grid = new Ext.grid.GridPanel(gridConfig);
		}

		grid.on({
			scope: this,
			afterrender: this.initializeDropZone,
			beforedestroy: this.onGridDestroy
		});

		if (gridConfig.skipAddBtn !== true && gridConfig.hideTitle !== true) {
			grid.on("render", this.addAddButton, this);
		}

		this.grid = grid;

		return this.grid;
	},

	onGridDestroy: function (grid) {
		if (grid === this.grid) {
			delete this.grid;
		}
	},

	onView: function (grid, rowIndex, colIndex) {
		if (!this.permissionCheck("read")) {
			return;
		}
		var store = grid.getStore();
		var rec = store.getAt(rowIndex);

		this.setLocation({ id: rec.get("ID") });

		return;
	},

	addAddButton: function (grid) {
		var el = grid.header.insertHtml("beforeEnd", "<span style='float:right;margin-right: 10px;'></span>", true);

		grid.addBtn = new Ext.Button({
			renderTo: el,
			text: "Add",
			scope: this,
			handler: this.showAdd,
			ownerCt: grid,
			disabled: !mOQOLD.Security.hasPermission(this.pageName, "create") || grid.readOnly
		});

		if (this.disableAddBtn) {
			grid.addBtn.disable();
		}
	},

	initializeDragZone: Ext.emptyFn,
	initializeDropZone: Ext.emptyFn,

	selectRow: function (grid, rowIndex) {
		var sm = grid.getSelectionModel();

		sm.selectRow(rowIndex, false);
	},

	deleteRow: function (grid, rowIndex, colIndex) {
		if (grid.readOnly || !this.permissionCheck("delete")) {
			return;
		}
		this.selectRow(grid, rowIndex);

		Ext.MessageBox.confirm("Confirm", "Are you sure you want to delete this " + this.title.toLowerCase() + "?", function (btn) {
			if (btn === "yes") {
				this.doDelete(grid, rowIndex);
			}
		}, this);
	},

	doDelete: function (grid, rowIndex) {
		mOQOLD.Main.logAction({ pageName: this.pageName, action: 'delete' });
		var store = grid.getStore();
		var rec = store.getAt(rowIndex);
		if (this.softDelete) {
			rec.set("isActive", 0);
			store.reload();
		} else {
			store.remove(rec);
		}
	},

	fixRec: function (rec) {
		return rec;
	},

	editRow: function (grid, rowIndex, colIndex) {
		if (!this.permissionCheck("update")) {
			return;
		}
		mOQOLD.Main.logAction({ pageName: this.pageName, action: 'edit' });
		this.selectRow(grid, rowIndex);

		var store = grid.getStore();
		var rec = store.getAt(rowIndex);
		rec = this.fixRec(rec);

		var editClass = mOQOLD.EditWindow;
		editClass.getHybridConfig = this.getHybridConfig;
		editClass.title = this.title;
		editClass.grid = this.grid;
		editClass.rec = rec;
		editClass.baseAPI = this.baseAPI;
		editClass.formButtons = this.formButtons;

		var win = editClass.createWindow();
		if (typeof rec === "object") {
			var form = win.getComponent(0).getForm();
			form.loadRecord(rec);
		}
		win.show();
	},

	getAddParams: function () {
		return {};
	},

	showAdd: function (rec) {
		mOQOLD.Main.logAction({ pageName: this.pageName, action: 'add button' });

		if (this.useDetailLayout === true) {
			this.setLocation({ id: 0 });
			return;
		}

		var addClass = mOQOLD.AddWindow;
		addClass.getHybridConfig = this.getHybridConfig;
		addClass.baseAPI = this.baseAPI;
		addClass.title = this.title;
		addClass.grid = this.grid;
		addClass.pageName = this.pageName;
		addClass.formButtons = this.formButtons;
		addClass.onBeforeSaveForm = this.onBeforeSaveForm;
		addClass.addParams = this.getAddParams();

		var win = addClass.createWindow(rec);
		win.show();
	},

	isReadOnly: true,

	setReadOnly: function (readonly) {
		readonly = readonly !== false;

		this.form.cascade(function (item) {
			if (item.isFormField) {
			    if (typeof item.setReadOnly === 'function' && !item.isXType('radiogroup') && !item.isXType('fileuploadfield')) {
					item.setReadOnly(readonly);
				} else {
					item.setDisabled(readonly);
				}
			} else if (item.isXType('grid')) {
				if (item.addBtn) {
					item.addBtn.setDisabled(readonly);
				}
				item.readOnly = readonly;
			}
		});

		this.isReadOnly = readonly;

		this.form.fbar.getComponent('Edit').setText(readonly ? 'Edit' : 'Save');
	},

	createPanel: function (options) {
		mOQOLD.Main.logAction({ pageName: this.pageName, action: 'load' });
		if (!options) {
			options = {};
		}
		if (typeof options.id === 'string' && options.id.length > 0) {
			options.id = Number(options.id);
			this.id = options.id;
		}
		var isDetailMode = typeof options.id === 'number';
		if (!isDetailMode && typeof this.createGrid === "function") {
			var grid = this.createGrid();
		}
		if ((!this.useDetailLayout || isDetailMode) && typeof this.createForm === "function") {
			var form = this.createForm(options);
		}
		if (form) {
			if (typeof form.addListener !== 'function') {
				form = Ext.ComponentMgr.create(form);
			}

			this.form = form;

			form.on('beforedestroy', function (form) {
				if (this.form == form) {
					delete this.form;
				}
			}, this);
		}
		if (form) {
			if (grid) {
				if (options.isWizard) {
					Ext.apply(grid, { region: 'center' });
					delete grid.autoHeight;
					Ext.applyIf(form, { region: 'east', width: 150 });
					delete form.height;
					return {
						xtype: 'container',
						layout: 'border',
						items: [grid, form]
					};
				}
				form.width = 150;
				delete form.anchor;

				return {
					xtype: "container",
					columnWidth: 1,
					layout: "column",
					items: [
						grid,
						form
					]
				};
			}
			Ext.applyIf(form, {
				columnWidth: 1
			});
			return form;
		} else {
			return grid;
		}
	},
	onResetForm: function () {
		this.form.getForm().reset();
	},

	onBackToList: function () {
		this.setLocation({});
	}
});
