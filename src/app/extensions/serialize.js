export function serializeScene(app) {
    var data = {
        name: 'Untitled',
        entities: {},
        settings: {}
    };

    data.entities[app.root._guid] = serializeEntity(app.root);
    app.root.find((v) => {
        if (!v._guid) return;
        data.entities[v._guid] = serializeEntity(v);
    });

    return data;
}

export function serializeEntity(entity) {
    var data = {
        // _guid: entity._guid,
        resource_id: entity._guid,
        enabled: entity.enabled,
        name: entity.name,
        position: entity.getLocalPosition().toArray(),
        rotation: entity.getEulerAngles().toArray(),
        scale: entity.getLocalScale().toArray(),

        tags: entity.tags._list,
        children: entity.children.map((v) => v._guid).filter((v) => v),
        parent: null,
        components: {}
    };

    if (entity.parent) {
        data.parent = entity.parent._guid;
    }

    if (entity.c && Object.keys(entity.c).length) {
        data.components = serializeComponents(entity);
    }

    return data;
}

function serializeComponents(entity) {
    var data = {};

    for (let name in entity.c) {
        let component = entity.c[name];
        let cData = data[name] = {};

        for (let name in component.data) {
            let val = component.data[name];
            let t = typeof val;
            if (t === 'boolean' || t === 'number' || t === 'string') cData[name] = val;
        }

        if (name === 'camera') {
            Object.assign(cData, {
                clearColor: component.clearColor.toArray(),
                rect: component.rect.toArray(),
            });
        }
        if (name === 'model') {
            Object.assign(cData, {
                material: component.material.id
            });
        }
        if (name === 'light') {
            Object.assign(cData, {
                // material: component.material.id
            });
        }
    }

    return data;
}


export function deserializeScene(app, data) {
    var parser = new pc.SceneParser(app);
    var parent = parser.parse(data);
    return parent;
}

// -- utils --
pc.Vec2.prototype.toArray = function() { return Array.from(this.data); }
pc.Vec3.prototype.toArray = function() { return Array.from(this.data); }
pc.Vec4.prototype.toArray = function() { return Array.from(this.data); }
pc.Color.prototype.toArray = function() { return Array.from(this.data); }
