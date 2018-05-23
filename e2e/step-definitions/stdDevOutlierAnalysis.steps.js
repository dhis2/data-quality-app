const { expect } = require('chai');
const { defineSupportCode } = require('cucumber');

const stdDevOutlierAnalysis = require('../pages/stdDevOutlierAnalysis.page');

defineSupportCode(({ Given, When, Then }) => {

    Then(/^a standard deviation is displayed$/, () => {
        stdDevOutlierAnalysis.standardDevDropdown.waitForVisible(5000);
    });

    Then(/^a start std dev outlier analysis option is displayed$/, () => {
        stdDevOutlierAnalysis.startButton.waitForVisible(5000);
    });

    When(/^I select valid standard deviation to get results$/, () => {
        stdDevOutlierAnalysis.openStandardDevDropdown();
        browser.pause(1000);
        stdDevOutlierAnalysis.getStandardDevOptionByText('3.0').click();
        browser.pause(1000);
    });

    When(/^I start std dev outlier analysis$/, () => {
        stdDevOutlierAnalysis.startButton.click();
    });

    Then(/^the start std dev outlier analysis button is not active$/, () => {
        expect(stdDevOutlierAnalysis.startButton.isEnabled()).to.equal(false);
    });
});
