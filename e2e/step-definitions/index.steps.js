const steps = [
    require('./shared.steps'),
    require('./home.steps'),
    require('./followUpAnalysis.steps'),
    require('./minMaxOutlierAnalysis.steps'),
    require('./stdDevOutlierAnalysis.steps'),
    require('./validationRuleAnalysis.steps'),
    require('./help.steps'),
    require('./sideMenu.steps'),
];

module.exports = function () {
    steps.forEach(function (step) {
        step.call(this);
    }.bind(this));
};
