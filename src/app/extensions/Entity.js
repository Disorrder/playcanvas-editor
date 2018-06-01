pc.Entity.prototype.traverseParents = function(cb) { // traverseAncestors from three.js
    var parent = this.parent;
    if (!parent) return;
    cb(parent);
    parent.traverseParents(cb);
};

pc.Entity.prototype.findParents = function(cb) {
    var parent = this.parent;
    if (!parent) return;
    return cb(parent) ? parent : parent.findParents(cb);
};

pc.Entity.prototype.getAllParents = function() {
    var arr = [];
    this.traverseParents(function(v) {
        arr.push(v);
    });
    return arr;
};
