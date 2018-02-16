export function serializeScene(app) {
    var data = {
        name: 'Untitled',
        root: null,
        settings: {}
    };

    serializeEntity(ap.root);

    return data;
}

export function serializeEntity(entity) {
    var data = {
        _guid: entity.guid,
        enabled: entity.enabled,
        name: entity.name,
        position: Array.from( entity.getLocalPosition().data ),
        rotation: Array.from( entity.getEulerAngles().data ),
        scale: Array.from( entity.getLocalScale().data ),

        components: {}
    };

    if (entity.parent) {
        data.parent = entity.parent._guid;
    }

    if (entity.tags.size) {
        data.tags = entity.tags._list;
    }

    if (entity.children.length) {
        data.children = entity.children.map(serializeEntity);
    }

    return data;
}


export function deserializeEntity(data, entity) {
    if (!entity) entity = new pc.Entity();

    ['_guid', 'enabled', 'name'].forEach((v) => {
        if (v in data) entity[v] = data[v];
    });

    if ('position' in data) entity.setLocalPosition(data.position);
    if ('rotation' in data) entity.setEulerAngles(data.rotation);
    if ('scale' in data) entity.setLocalScale(data.scale);
    if ('tags' in data) entity.tags._list = data.tags;

    if ('children' in data) {
        data.children.forEach((v) => {
            entity.addChild( deserializeEntity(v) );
        });
    }

    return entity;
}
