'use strict';

const astLoad = require('./ast-load');
const astParse = require('./ast-parse');

class FeatureTest {

    constructor(featurePath) {
        this.load = this.load.bind(this);
        this.run = this.run.bind(this);
        this.feature = featurePath ? astParse.create(astLoad.fromPath(featurePath)) : undefined;
    }

    load(featureAsString) {
        this.feature = astParse.create(astLoad.fromString(featureAsString));
    }

    run(tests) {
        describe(`Feature: ${this.feature.name}`, () => {
            this.feature.outlines.forEach(outline => {
                outline.examples.forEach((example, index) => {
                    describe(`Scenario: ${outline.name} | Example ${index + 1}`, () => {
                        tests(example);
                    });
                });
            });
        });
    }
}

module.exports = FeatureTest;
