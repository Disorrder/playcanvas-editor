/*jshint esversion: 6 */

class Spherical {
    constructor(r = 0, theta = 0, phi = 0) {
        this.r = r;
        this.theta = theta;
        this.phi = phi;
    }

    get lon() { return this.theta; }
    set lon(v) { this.theta = v; }

    get lat() { return this.phi; }
    set lat(v) { this.phi = v; }

    getCartesian() {
        return new pc.Vec3().setFromSpherical(this);
    }

    toString() {
        return `[${this.r}, ${this.theta}, ${this.phi}]`;
    }
}

pc.Spherical = Spherical;

// --- spherical ---

pc.Vec3.prototype.getSpherical = function() {
    return new pc.Spherical(
        this.length(),
        Math.asin(this.z / this.length()) * pc.math.RAD_TO_DEG,
        Math.atan2(this.y, this.x) * pc.math.RAD_TO_DEG
    );
    // return {
    //     r: this.length(),
    //     theta: Math.asin(this.z / this.length()) * pc.math.RAD_TO_DEG, // also lon
    //     phi: Math.atan2(this.y, this.x) * pc.math.RAD_TO_DEG, // also lat
    // };
};

pc.Vec3.prototype.setFromSpherical = function(r, theta, phi) {
    if (typeof r === 'object') {
        theta = r.theta * pc.math.DEG_TO_RAD;
        phi = r.phi * pc.math.DEG_TO_RAD;
        r = r.r;
    }

    this.x = r * Math.cos(phi) * Math.cos(theta);
    this.y = r * Math.sin(phi);
    this.z = r * Math.cos(phi) * Math.sin(theta);
    return this;
};

pc.Vec3.prototype.copyFromObject = function(obj) {
    this.set(obj.x, obj.y, obj.z);
    return this;
};

pc.Vec3.prototype.randomize = function(spread = 1) {
    spread /= 2;
    this.x = pc.math.random(-spread, spread);
    this.y = pc.math.random(-spread, spread);
    this.z = pc.math.random(-spread, spread);
    return this;
};

// --- utils ---
pc.Vec3.prototype.toObject = function() {
    return {x: this.x, y: this.y, z: this.z};
};

// --- static ---
pc.Vec3.isVec3 = function(v) {
    return v.x != null && v.y != null && v.z != null;
};

pc.Vec3.getCenter = function(a, b) {
    var c = a.clone();
    c.x += (b.x - a.x) / 2;
    c.y += (b.y - a.y) / 2;
    c.z += (b.z - a.z) / 2;
    return c;
};
