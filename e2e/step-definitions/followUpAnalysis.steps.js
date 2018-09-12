const { expect } = require('chai');
const { defineSupportCode } = require('cucumber');

const followUpAnalysis = require('../pages/followUpAnalysis.page');

defineSupportCode(({ Given, When, Then }) => {

    let totalElements;

    // *********************************************************
    // Scenario: I want to see Comment
    // *********************************************************
    When(/^I select a comment$/, () => {
        followUpAnalysis.existingComments[0].click();
    });

    When(/^the comment is displayed$/, () => {
        expect(followUpAnalysis.existsCommentHeader).to.equal(true);
        expect(followUpAnalysis.existsCommentInfo).to.equal(true);
    });

    // *********************************************************
    // Scenario: I want to unfollow results
    // *********************************************************
    Then(/^I select results to unfollow$/, () => {
        followUpAnalysis.getUnfollowCheckboxeByIndex(0).click();
    });

    Then(/^I choose to unfollow them$/, () => {
        totalElements = followUpAnalysis.totalElements;
        followUpAnalysis.unfollowButton.click();
        browser.pause(5000);
    });

    Then(/^the unfollowed items are removed from the list$/, () => {
        expect(totalElements - 1).to.equal(followUpAnalysis.totalElements);
    });

    // *********************************************************
    // Scenario: I want to validate data set changes
    // *********************************************************
    Then(/^I select another parent organisation$/, () => {
        // Get actual data set size
        followUpAnalysis.dataSetElement.click();
        browser.waitForVisible('div[role=presentation]');
        totalElements = followUpAnalysis.dataSetSize;
        followUpAnalysis.getDataSetOptionByIndex(2).click();
        // wait dataSet close
        browser.pause(5000);

        followUpAnalysis.getOneOrgUnitTreeFromTreeByIndex(1).click();
        expect(followUpAnalysis.isOrganisationUnitSelected()).to.equal(true);
        browser.pause(5000);
    });

    Then(/^a start followup analysis option is displayed$/, () => {
        followUpAnalysis.startButton.waitForVisible(5000);
    });

    When(/^I start followup analysis$/, () => {
        followUpAnalysis.startButton.click();
    });

    Then(/^the unfollow option is displayed$/, () => {
        followUpAnalysis.unfollowButton.waitForVisible(5000);
    });

    Then(/^start button to generate followup analysis is not active$/, () => {
        expect(followUpAnalysis.startButton.isEnabled()).to.equal(false);
    });

});
