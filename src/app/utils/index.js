String.prototype.hashCode = function() {
	var hash = 0;
	if (this.length == 0) return hash;
	for (let i = 0, len = this.length; i < len; i++) {
		char = this.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
    if (hash < 0) { // to unsigned int32
        let bit32 = 0x80000000;
        hash = bit32 - hash;
    }
	return hash;
}

// Array
Array.prototype.delete = function(v) {
	var i = this.indexOf(v);
	if (~i) this.splice(i, 1);
	return this;
}
