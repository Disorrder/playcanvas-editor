console.log('SCENARIO');

var ScenarioStart = pc.createScript('scenarioStart');

ScenarioStart.attributes.add('autoplay', {type: 'boolean'});

ScenarioStart.extend({
    initialize() {
        this.scenario = new pc.Animated();

        var timeline = require('../scenarios/1.scenario.json');
        console.log('ScenarioStart init', timeline);
        timeline.frames.forEach((frame) => {
            if (frame.easing) frame.easing = pc.Animated.easing[frame.easing];

            // check for tweaked targets
            frame.animate.forEach((anim) => {
                if (anim.entity) anim.entity = this.app.root.findByGuid(anim.entity);

                if (typeof anim.target === 'string') {
                    let prop = anim.target;
                    if (anim.entity) {
                        prop = anim.entity[prop];
                        if (typeof prop === 'function') prop = prop.bind(anim.entity);
                    } else {
                        prop = this[prop];
                        if (typeof prop === 'function') prop = prop.bind(this);
                    }
                    anim.target = prop;
                }

                if (typeof anim.setter === 'string') {
                    let prop = anim.setter;
                    if (anim.entity) {
                        prop = anim.entity[prop];
                        if (typeof prop === 'function') prop = prop.bind(anim.entity);
                    } else {
                        prop = this[prop];
                        if (typeof prop === 'function') prop = prop.bind(this);
                    }
                    anim.setter = prop;
                }

                // TODO: check for string callbacks: begin, end, run...
            });

            this.scenario.add(frame);
        });

        this.scenario.play();
        console.log(this.scenario);
        
    },

    // attachEvents() {
    //     this.on('enable', this.onEnable, this);
    // },

    // onEnable() {
    //     console.log('ENABLED');
    // },

    // mapAnimProperty(anim, name) {
    //     let prop = anim[name];

    //     if (prop.startsWith('entity.')) {
    //         prop = prop.replace('entity.', '');
    //         let prop = anim.entity[prop];
    //         if (typeof prop === 'function') prop = prop.bind(anim.entity);
    //         console.log('anim.entity', name, anim.entity, prop);
    //     }

    //     return prop;
    // }
});
