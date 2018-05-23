const { expect } = require('chai');
const { defineSupportCode } = require('cucumber');

const minMaxOutlierAnalysis = require('../pages/minMaxOutlierAnalysis.page');

defineSupportCode(({ Given, When, Then }) => {

    // *********************************************************
    // Scenario: I want to see all items in the page
    // *********************************************************
    Then(/^a start min-max analysis option is displayed$/, () => {
        minMaxOutlierAnalysis.startButton.waitForVisible(5000);
    });

    // *********************************************************
    // Scenarios:
    // I want to start min-max analysis with multiple data set
    // I want to see a no results message after start min-max analysis
    // I want to generate analysis with the smallest start date available
    // *********************************************************
    When(/^I start min max min-max analysis$/, () => {
        minMaxOutlierAnalysis.startButton.click();
    });

    // *********************************************************
    // Scenarios:
    // I want to not start min-max analysis without data set
    // I want to not start min-max analysis without parent organisation Unit
    // *********************************************************
    Then(/^start button to generate min-max analysis is not active$/, () => {
        expect(minMaxOutlierAnalysis.startButton.isEnabled()).to.equal(false);
    });
});
