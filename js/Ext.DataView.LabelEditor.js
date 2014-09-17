﻿Ext.ns("mOQOLD");
/**
* @class Ext.DataView.LabelEditor
* @extends Ext.Editor
* 
*/
mOQOLD.LabelEditor = Ext.extend(Ext.Editor, {
	alignment: "tl-tl",
	hideEl: false,
	cls: "x-small-editor",
	shim: false,
	completeOnEnter: true,
	cancelOnEsc: true,
	labelSelector: 'span.x-editable',

	constructor: function (cfg, field) {
		mOQOLD.LabelEditor.superclass.constructor.call(this,
            field || new Ext.form.TextField({
            	allowBlank: false,
            	growMin: 90,
            	growMax: 240,
            	grow: true,
            	selectOnFocus: true
            }), cfg
        );
	},

	init: function (view) {
		this.view = view;
		view.on('render', this.initEditor, this);
		this.on('complete', this.onSave, this);
	},

	initEditor: function () {
		this.view.on({
			scope: this,
			containerclick: this.doBlur,
			click: this.doBlur
		});
		this.view.getEl().on('mousedown', this.onMouseDown, this, { delegate: this.labelSelector });
	},

	doBlur: function () {
		if (this.editing) {
			this.field.blur();
		}
	},

	onMouseDown: function (e, target) {
		if (!e.ctrlKey && !e.shiftKey) {
			var item = this.view.findItemFromChild(target);
			e.stopEvent();
			var record = this.view.store.getAt(this.view.indexOf(item));
			this.startEdit(target, record.data[this.dataIndex]);
			this.activeRecord = record;
		} else {
			e.preventDefault();
		}
	},

	onSave: function (ed, value) {
		this.activeRecord.set(this.dataIndex, value);
		var idIndx = this.activeRecord.get("ID");
		var newVal = this.activeRecord.get("tag");
		Ext.app.PhotoAPI.reNameTagForImage(idIndx, newVal);
	}
});