console.log('SCENARIO');

var ScenarioStart = pc.createScript('scenarioStart');

ScenarioStart.attributes.add('autoplay', {type: 'boolean'});

ScenarioStart.extend({
    initialize() {
        this.scenario = new pc.Animated();

        var timeline = require('../scenarios/1.scenario.json');
        console.log('ScenarioStart init', timeline);
        
    },
});
