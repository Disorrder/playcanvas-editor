export function serializeScene(app, rootEntity) {
    var data = {
        name: 'Untitled',
        settings: {},
        entities: {},
    };

    if (!rootEntity) rootEntity = app.root;
    data.entities[rootEntity._guid] = serializeEntity(rootEntity);
    data.entities[rootEntity._guid].parent = null;
    rootEntity.find((v) => {
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
            if (['layers'].includes(name)) cData[name] = val;
        }

        switch (name) {
            case 'camera':
                Object.assign(cData, {
                    clearColor: component.clearColor.toArray(),
                    rect: component.rect.toArray(),
                });
                break;
        
            case 'model':
                Object.assign(cData, {
                    material: component.material.id,
                });
                break;

            case 'script':
                Object.assign(cData, {
                    scripts: component.scripts.map((v) => {
                        return {
                            enabled: v.enabled,
                            name: v.__scriptType.__name,
                            _attributes: v.__attributesRaw,
                            attributes: v.__attributes,
                            runInEditor: v._runInEditor
                        };
                    })
                });
                break;
        }
    }

    return data;
}


export function deserializeScene(app, data) {
    var parser = new pc.SceneParser(app);
    try {
        var parent = parser.parse(data);        
    } catch(e) {}
    if (!parent) parent = new pc.Entity('Root');
    return parent;
}

// -- utils --
pc.Vec2.prototype.toArray = function() { return Array.from(this.data); }
pc.Vec3.prototype.toArray = function() { return Array.from(this.data); }
pc.Vec4.prototype.toArray = function() { return Array.from(this.data); }
pc.Color.prototype.toArray = function() { return Array.from(this.data); }
