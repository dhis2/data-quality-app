const { expect } = require('chai');
const { defineSupportCode } = require('cucumber');

const validationRuleAnalysis = require('../pages/validationRuleAnalysis.page');

defineSupportCode(({ Given, When, Then }) => {

    Then(/^a start validation rule analysis option is displayed$/, () => {
        validationRuleAnalysis.startButton.waitForVisible(5000);
    });

    Then(/^validation rule group selection is displayed$/, () => {
        validationRuleAnalysis.validationRuleGroup.waitForVisible(5000);
    });

    Then(/^send notifications option is displayed$/, () => {
        validationRuleAnalysis.sendNotificationsOption.waitForVisible(5000);
    });

    Then(/^persist new results option is displayed$/, () => {
        validationRuleAnalysis.persistResultsOption.waitForVisible(5000);
    });

    When(/^I select validation rule group with results$/, () => {
        validationRuleAnalysis.selectValidationGroupWithResults();
    });

    When(/^I start validation rule analysis$/, () => {
        validationRuleAnalysis.startButton.click();
    });

    Then(/^the start validation rule analysis Button is not active$/, () => {
        expect(validationRuleAnalysis.startButton.isEnabled()).to.equal(false);
    });

    // *********************************************************
    // Scenario: I want to see Validation result analysis item details
    // *********************************************************
    When(/^I click icon Details$/, () => {
        validationRuleAnalysis.openValidationRuleDetailsByIndex(0);
        browser.pause(15000);
    });

    When(/^I can see a pop up$/, () => {
        expect(validationRuleAnalysis.validationRulesDetailsDialog.isVisible()).to.equal(true);
    });

    When(/^I see a section with validation result details for selected item$/, () => {
        expect(validationRuleAnalysis.resultsRowAtDetailsDialog.isVisible()).to.equal(true);
    });

    When(/^I see a section with left side for selected item$/, () => {
        expect(validationRuleAnalysis.leftSideRowAtDetailsDialog.isVisible()).to.equal(true);
    });

    When(/^I see a section with right side for selected item$/, () => {
        expect(validationRuleAnalysis.rightSideRowAtDetailsDialog.isVisible()).to.equal(true);
    });

    When(/^I can click in close button for selected item$/, () => {
        expect(validationRuleAnalysis.closeButtonAtDetailsDialog.isVisible()).to.equal(true);
    });
});

