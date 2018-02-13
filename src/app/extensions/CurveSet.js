pc.CurveSet.prototype.add = function(t, val) {
    if (Array.isArray(val.data)) val = val.data;
    if (this.curves.length !== val.length) console.warn('Data lengths mismatch.');
    this.curves.forEach(function(curve, i) {
        curve.add(t, val[i]);
    });
};
