Ext.ns("Ext.ux.util");
Ext.ux.util.clone = function (o) {
	if (!o || 'object' !== typeof o) {
		return o;
	}
	if ('function' === typeof o.clone) {
		return o.clone();
	}
	var c = '[object Array]' === Object.prototype.toString.call(o) ? [] : {};
	var p, v;
	for (p in o) {
		if (o.hasOwnProperty(p)) {
			v = o[p];
			if (v && 'object' === typeof v) {
				c[p] = Ext.ux.util.clone(v);
			}
			else {
				c[p] = v;
			}
		}
	}
	return c;
};

Ext.ux.util.CaseInsensitiveSorter = function (o1, o2) {
	var v1 = o1.get(this.property),
        v2 = o2.get(this.property);
	if (v1 === null) {
		return v2 === null ? 0 : 1;
	} else if (v2 == null) {
		return -1;
	} else {
		v1 = v1.toUpperCase();
		v2 = v2.toUpperCase();
		if (v1 === v2) {
			return 0;
		} else if (v1 > v2) {
			return 1;
		} else {
			return -1;
		}
	}
};
