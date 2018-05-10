const { expect } = require('chai');
const { defineSupportCode } = require('cucumber');

const minMaxOutlierAnalysis = require('../pages/minMaxOutlierAnalysis.page');

defineSupportCode(( {Given, When, Then} ) => {
  // *********************************************************
  // Background:
  // *********************************************************
  When(/^I open Min-Max Outlier Analysis page$/, () => {
    minMaxOutlierAnalysis.open();
    browser.pause(1000);
  });

  // *********************************************************
  // Scenario: I want to see all items in the page
  // *********************************************************
  Then(/^A column with list of Data Set is displayed$/, () => {
    expect(minMaxOutlierAnalysis.dataSetSelect.isVisible()).to.equal(true);
  });

  Then(/^A column with Parent organization unit selection checkboxes$/, () => {
    expect(minMaxOutlierAnalysis.organisationUnitTreeView.isVisible()).to.equal(true);
  });

  Then(/^A start date selection/, () => {
    expect(minMaxOutlierAnalysis.startDateInput.isVisible()).to.equal(true);
  });

  Then(/^An end date selection/, () => {
    expect(minMaxOutlierAnalysis.endDateInput.isVisible()).to.equal(true);
  });

  Then(/^Start option for min max outlier analysis is displayed/, () => {
    expect(minMaxOutlierAnalysis.startButton.isVisible()).to.equal(true);
  });

  // *********************************************************
  // Scenario: I want to start Analysis and check results
  // *********************************************************
  When(/^I select Data set with results/, () => {
    minMaxOutlierAnalysis.getDataSetOptionByIndex(1).click();
  });

  When(/^I select Parent Organisation with results/, () => {
    minMaxOutlierAnalysis.getOneOrgUnitTreeFromTreeByIndex(0).click();
  });

  When(/^I select valid time range to get results/, () => {
    const today = new Date();
    minMaxOutlierAnalysis.openStartDate();
    browser.pause(1000);                                                               // to make sure buttons are available
    minMaxOutlierAnalysis.openStartDateYearsPicker();
    browser.pause(1000);                                                               // to make sure buttons are available
    minMaxOutlierAnalysis.getStartDateYearButton(today.getFullYear() - 3).click();     // 3 years behind
    browser.pause(1000);                                                               // to make sure buttons are available
    minMaxOutlierAnalysis.confirmStartDatePicker();
    browser.pause(1000);                                                               // to make sure date picker closes
  });

  When(/^Start min max outlier analysis/, () => {
    minMaxOutlierAnalysis.startButton.click();
    browser.pause(10000);                         // time for task to process
  });

  Then(/^New page is displayed/, () => {
    expect(minMaxOutlierAnalysis.resultsTable.isVisible()).to.equal(true);
  });

  Then(/^Print action "(.+)" is displayed/, (actionText) => {
    expect(minMaxOutlierAnalysis.getPrintingActionByText(actionText).isVisible()).to.equal(true);
  });

  Then(/^There is a table with column "(.+)"/, (columnHeaderText) => {
    expect(minMaxOutlierAnalysis.getResultsTableHeaderByText(columnHeaderText).isVisible()).to.equal(true);
  });

  // *********************************************************
  // Scenario: I want to start Analysis with multiple Data Set
  // *********************************************************
  When(/^I select multiple Data set with results/, () => {
    minMaxOutlierAnalysis.getDataSetOptionByIndex(1).click();
    browser.keys(['Shift']);                                    // shift down
    minMaxOutlierAnalysis.getDataSetOptionByIndex(2).click();
    browser.keys(['Shift']);                                    // shift up
  });

  // *********************************************************
  // Scenario: I want to not start Analysis without data set
  // *********************************************************
  Then(/^Start Button is not active/, () => {
    expect(minMaxOutlierAnalysis.startButton.isEnabled()).to.equal(false);
  });

  // *********************************************************
  // Scenario: I want to see No results message after start analysis
  // *********************************************************
  When(/^I fill form with data to retrieve no results/, () => {
    minMaxOutlierAnalysis.getDataSetOptionByIndex(0).click();           // no results
    minMaxOutlierAnalysis.getOneOrgUnitTreeFromTreeByIndex(0).click();
  });

  Then(/^No results message is displayed/, () => {
    expect(minMaxOutlierAnalysis.snackBarMessageElement.isVisible()).to.equal(true);
    expect(minMaxOutlierAnalysis.snackBarMessageElement.getText()).to.equal('No values found');
  });

  // *********************************************************
  // Scenario: I cannot be able to generate Analysis with future start date
  // *********************************************************
  Then(/^I cannot select start date greater than today/, () => {
    // FIXME reuse the code to generate tomorrow date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    minMaxOutlierAnalysis.openStartDate();
    browser.pause(1000);

    expect(minMaxOutlierAnalysis.getStartDatePickerDayButtonOfDate(tomorrow).isEnabled()).to.equal(false);

    // to not conflict with next steps
    minMaxOutlierAnalysis.closeStartDatePicker();
    browser.pause(10000);
  });

  Then(/^I cannot select end date greater than today/, () => {
    // FIXME reuse the code to generate tomorrow date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    minMaxOutlierAnalysis.openEndDate();
    browser.pause(1000);

    expect(minMaxOutlierAnalysis.getEndDatePickerDayButtonOfDate(tomorrow).isEnabled()).to.equal(false);

    // to not conflict with next steps
    minMaxOutlierAnalysis.closeEndDatePicker();
    browser.pause(10000);
  });

  // *********************************************************
  // Scenario: I cannot be able to generate Analysis with start date after future end date
  // *********************************************************
  When(/^I select start date for today/, () => {
    const today = new Date();

    minMaxOutlierAnalysis.openStartDate();
    browser.pause(1000);

    minMaxOutlierAnalysis.selectDateForStartDatePicker(today);
  });

  Then(/^I cannot select end date to yesterday/, () => {
    // FIXME reuse the code to generate yesterday date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    minMaxOutlierAnalysis.openEndDate();
    browser.pause(1000);

    expect(minMaxOutlierAnalysis.getEndDatePickerDayButtonOfDate(yesterday).isEnabled()).to.equal(false);

    // to not conflict with next steps
    minMaxOutlierAnalysis.closeEndDatePicker();
    browser.pause(10000);
  });

  // *********************************************************
  // Scenario: I cannot be able to select start date after end date
  // *********************************************************
  When(/^I select start date to yesterday/, () => {
    // FIXME reuse the code to generate yesterday date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    minMaxOutlierAnalysis.openStartDate();
    browser.pause(1000);

    minMaxOutlierAnalysis.selectDateForStartDatePicker(yesterday);
  });

  When(/^I select end date to yesterday/, () => {
    // FIXME reuse the code to generate yesterday date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    minMaxOutlierAnalysis.openEndDate();
    browser.pause(1000);

    minMaxOutlierAnalysis.selectDateForEndDatePicker(yesterday);
  });

  Then(/^I cannot select start date to today/, () => {
    const today = new Date();

    minMaxOutlierAnalysis.openStartDate();
    browser.pause(1000);

    expect(minMaxOutlierAnalysis.getStartDatePickerDayButtonOfDate(today).isEnabled()).to.equal(false);

    // to not conflict with next steps
    minMaxOutlierAnalysis.closeStartDatePicker();
    browser.pause(10000);
  });

  // *********************************************************
  // Scenario: I want to generate Analysis with the smallest start date available
  // *********************************************************
  When(/^I Select start date equals to today less 100 years/, () => {
    const oneHundredYearsAgo = new Date();
    oneHundredYearsAgo.setFullYear(oneHundredYearsAgo.getFullYear() - 100);

    minMaxOutlierAnalysis.openStartDate();
    browser.pause(1000);

    minMaxOutlierAnalysis.selectDateForStartDatePicker(oneHundredYearsAgo);
  });

  When(/^I Select valid end date/, () => {
    const today = new Date();

    minMaxOutlierAnalysis.openEndDate();
    browser.pause(1000);

    minMaxOutlierAnalysis.selectDateForEndDatePicker(today);
  });

  // *********************************************************
  // Scenario: I cannot be able to generate Analysis with start date smaller than today less 100
  // *********************************************************
  Then(/^I cannot select start date equals to today less 100 years and 1 day/, () => {
    const oneHundredYearsAgoLessOneDay = new Date();
    oneHundredYearsAgoLessOneDay.setFullYear(oneHundredYearsAgoLessOneDay.getFullYear() - 100);
    oneHundredYearsAgoLessOneDay.setDate(oneHundredYearsAgoLessOneDay.getDate() - 1);

    minMaxOutlierAnalysis.openStartDate();
    browser.pause(1000);

    expect(minMaxOutlierAnalysis.getStartDatePickerDayButtonOfDate(oneHundredYearsAgoLessOneDay).isEnabled()).to.equal(false);

    // to not conflict with next steps
    minMaxOutlierAnalysis.closeStartDatePicker();
    browser.pause(10000);
  });
});