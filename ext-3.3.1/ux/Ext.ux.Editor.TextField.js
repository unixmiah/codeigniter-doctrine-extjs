Ext.ns("Ext.ux.Editor");

Ext.ux.Editor.TextField = Ext.extend(Ext.form.DisplayField, {
	getChildConfig: function() {
		return {
			tag: "input",
			type: "text",
			size: "20",
			cls: "x-form-text x-form-field"
		};
	},
	
	addField: function() {
		var el = this.getEl();
		var width = el.getWidth();
		var height = el.getHeight();
		
		var childConfig = this.getChildConfig();
		
		Ext.applyIf(childConfig, {
			autocomplete: "off",
			value: this.getValue()
		});
		
		if (childConfig.tag !== "input") {
			Ext.applyIf(childConfig, {
				style: "width: "+width+"px;height: "+height+"px;"
			});
		} else {
			Ext.applyIf(childConfig, {
				style: "width: "+width+"px;"
			});
		}
		
		var parent = el.findParent(".x-form-element", 2, true);
		
		this.showorhide(false, el);
		
		return parent.createChild(childConfig);
	},
	
	removeField: function() {
		var el = this.getEl();
		var field = el.next();
		var value = field.getValue();
		field.remove();
		this.setValue(value);
		this.showorhide(true, el);
	},
	
	showorhide: function(vis, el) {
		if (typeof el === "undefined") {
			var el = this.getEl();
		}
		el.setVisibilityMode(Ext.Element.DISPLAY);
		el.setVisible(vis);
	},
	
	enable: function() {
		this.addField();
	},
	
	disable: function() {
		this.removeField();
	}
});

Ext.reg("editor.textfield", Ext.ux.Editor.TextField);