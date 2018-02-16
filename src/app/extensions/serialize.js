export function serializeScene(app) {
    var data = {
        name: 'Untitled',
        entities: {},
        settings: {}
    };

    data.entities[app.root._guid] = serializeEntity(app.root);
    app.root.find((v) => {
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
        children: entity.children.map((v) => v._guid),
        parent: null,
        components: {}
    };

    if (entity.parent) {
        data.parent = entity.parent._guid;
    }

    for (let name in entity.c) {
        let component = entity.c[name];
        data.components[name] = {};

        if (!componentSchemas[name]) continue;
        componentSchemas[name].forEach((field) => {
            var [field, type] = field.split(':');
            var val = component[field];
            if (type === 'vec') val = val.toArray();
            data.components[name][field] = val;
        });
    }

    return data;
}


export function deserializeScene(app, data) {
    var parser = new pc.SceneParser(app);
    var parent = parser.parse(data);
    return parent;
}

var componentSchemas = {
    camera: ['enabled', 'clearColorBuffer', 'clearDepthBuffer', 'clearColor:vec', 'projection', 'frustumCulling', 'fov', 'nearClip', 'farClip', 'priority', 'rect:vec'],
    model: ['enabled', 'type', 'batchGroupId', 'recieveShadows'],
}

// -- utils --
pc.Vec2.prototype.toArray = function() { return Array.from(this.data); }
pc.Vec3.prototype.toArray = function() { return Array.from(this.data); }
pc.Vec4.prototype.toArray = function() { return Array.from(this.data); }
pc.Color.prototype.toArray = function() { return Array.from(this.data); }
