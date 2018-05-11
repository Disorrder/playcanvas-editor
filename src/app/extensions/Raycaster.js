class Raycaster {
    constructor(ray) {
        this.app = pc.app || pc.script.app;
        this.ray = ray || new pc.Ray();
        this.intersectable = [];

        this._intersectableUpdateLast = 0;
        this._intersectableUpdateTimeout = 1000;

        this._intersectPoint = new pc.Vec3();
    }

    update() {
         if (this._intersectableUpdateLast + this._intersectableUpdateTimeout < this.app._time) {
            this._intersectableUpdateLast = this.app._time;
            // this.updateIntersectable();
            this.intersectable = this.getIntersectable();
        }
    }

    // updateIntersectable() {
    //     this.intersectable = this.getIntersectable();
    // }

    getIntersectable() {
        return this.app.root.find(() => true);
        // return this.app.root.findByTag('interactive');
    }

    castAll() {
        return this.intersectable.map((v) => {
            if (!v.bounding) return null;
            let result = v.bounding.intersectsRay(this.ray, this._intersectPoint);
            if (result) {
                return {
                    entity: v,
                    point: this._intersectPoint.clone()
                };
            }
            return false;
        }).filter((v) => !!v);
    }

    castFirst() {
        var intersected = this.castAll();

        if (intersected.length < 2) return intersected[0] || null;
        intersected = intersected.sort((a, b) => {
            a = a.point.length(); b = b.point.length();
            return a - b;
        });
        console.log('sorted cast:', intersected, intersected.map((v) => v.point.length()));
        return intersected[0];
    }
}

if (pc.Raycaster) console.warn('pc.Raycaster is already exists!');
pc.Raycaster = Raycaster;
