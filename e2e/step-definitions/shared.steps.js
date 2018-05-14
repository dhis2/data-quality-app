const { expect } = require('chai');
const { defineSupportCode } = require('cucumber');

const dhis2Page = require('../pages/dhis2.page.js');
const home = require('../pages/home.page');

defineSupportCode(({ Given, When, Then }) => {
  Given(/^that I am logged in to the Sierra Leone DHIS2$/, () => {
    dhis2Page.open();
    if (!dhis2Page.isLoggedIn()) {
      dhis2Page.submitLoginForm('admin', 'district');
    }
    expect(dhis2Page.isLoggedIn()).to.equal(true);
    // FIXME not possible to check it through title as was previously
    // dhis2Page.isFromLocation('Sierra Leone');
  });

  Given(/^I am on home$/, () => {
    home.open();
  });

  Then(/^the side menu "(.+)" is selected$/, (section) => {
    expect(home.isSectionActiveAtMenu(section)).to.equal(true);
  });

  Then(/^the new section is opened with "(.+)"$/, (header) => {
    expect(browser.element('h1').getText().includes(header)).to.equal(true);
  });

  // *********************************************************
  // Background:
  // *********************************************************
  When(/^I open Min-Max Outlier Analysis page$/, () => {
    this.page = require('../pages/minMaxOutlierAnalysis.page');
    this.page.open();
    browser.pause(1000);
  });

  When(/^I open Std Dev Outlier Analysis page$/, () => {
    this.page = require('../pages/stdDevOutlierAnalysis.page');
    this.page.open();
    browser.pause(1000);
  });

  // *********************************************************
  // Scenario: I want to see all items in the page
  // *********************************************************
  Then(/^A column with list of Data Set is displayed$/, () => {
    expect(this.page.dataSetSelect.isVisible()).to.equal(true);
  });

  Then(/^A column with Parent organization unit selection is displayed$/, () => {
    expect(this.page.organisationUnitTreeView.isVisible()).to.equal(true);
  });

  Then(/^A start date selection is displayed/, () => {
    expect(this.page.startDateInput.isVisible()).to.equal(true);
  });

  Then(/^An end date selection is displayed/, () => {
    expect(this.page.endDateInput.isVisible()).to.equal(true);
  });

  Then(/^A Start analysis option is displayed/, () => {
    expect(this.page.startButton.isVisible()).to.equal(true);
  });

  Then(/^A standard deviation is displayed/, () => {
    expect(this.page.standardDevDropdown.isVisible()).to.equal(true);
  });

  // *********************************************************
  // Scenario: I want to start Analysis and check results
  // *********************************************************
  When(/^I select Data set with results/, () => {
    this.page.getDataSetOptionByIndex(1).click();
  });

  When(/^I select Parent Organisation with results/, () => {
    this.page.getOneOrgUnitTreeFromTreeByIndex(0).click();
  });

  When(/^I select valid standard deviation to get results/, () => {
    this.page.openStandardDevDropdown();
    browser.pause(1000);
    this.page.getStandardDevOptionByText('3.0').click();
    browser.pause(1000);
  });

  When(/^I select valid time range to get results/, () => {
    const today = new Date();
    this.page.openStartDate();
    browser.pause(1000);                                                               // to make sure buttons are available
    this.page.openStartDateYearsPicker();
    browser.pause(1000);                                                               // to make sure buttons are available
    this.page.getStartDateYearButton(today.getFullYear() - 3).click();     // 3 years behind
    browser.pause(1000);                                                               // to make sure buttons are available
    this.page.confirmStartDatePicker();
    browser.pause(1000);                                                               // to make sure date picker closes
  });

  When(/^Start analysis/, () => {
    this.page.startButton.click();
    browser.pause(60000);                         // time for task to process
  });

  Then(/^New page is displayed/, () => {
    expect(this.page.resultsTable.isVisible()).to.equal(true);
  });

  Then(/^Print action "(.+)" is displayed/, (actionText) => {
    expect(this.page.getPrintingActionByText(actionText).isVisible()).to.equal(true);
  });

  Then(/^There is a table with column "(.+)"/, (columnHeaderText) => {
    expect(this.page.getResultsTableHeaderByText(columnHeaderText).isVisible()).to.equal(true);
  });

  // *********************************************************
  // Scenario: I want to start Analysis with multiple Data Set
  // *********************************************************
  When(/^I select multiple Data set with results/, () => {
    this.page.getDataSetOptionByIndex(1).click();
    browser.keys(['Shift']);                                    // shift down
    this.page.getDataSetOptionByIndex(2).click();
    browser.keys(['Shift']);                                    // shift up
  });

  // *********************************************************
  // Scenario: I want to not start Analysis without data set
  // *********************************************************
  Then(/^Start Button is not active/, () => {
    expect(this.page.startButton.isEnabled()).to.equal(false);
  });

  // *********************************************************
  // Scenario: I want to see No results message after start analysis
  // *********************************************************
  When(/^I fill form with data to retrieve no results/, () => {
    this.page.getDataSetOptionByIndex(0).click();           // no results
    this.page.getOneOrgUnitTreeFromTreeByIndex(0).click();
  });

  Then(/^No results message is displayed/, () => {
    expect(this.page.snackBarMessageElement.isVisible()).to.equal(true);
    expect(this.page.snackBarMessageElement.getText()).to.equal('No values found');
  });

  // *********************************************************
  // Scenario: I cannot be able to generate Analysis with future start date
  // *********************************************************
  Then(/^I cannot select start date greater than today/, () => {
    // FIXME reuse the code to generate tomorrow date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    this.page.openStartDate();
    browser.pause(1000);

    expect(this.page.getStartDatePickerDayButtonOfDate(tomorrow).isEnabled()).to.equal(false);

    // to not conflict with next steps
    this.page.closeStartDatePicker();
    browser.pause(1000);
  });

  Then(/^I cannot select end date greater than today/, () => {
    // FIXME reuse the code to generate tomorrow date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    this.page.openEndDate();
    browser.pause(1000);

    expect(this.page.getEndDatePickerDayButtonOfDate(tomorrow).isEnabled()).to.equal(false);

    // to not conflict with next steps
    this.page.closeEndDatePicker();
    browser.pause(1000);
  });

  // *********************************************************
  // Scenario: I cannot be able to generate Analysis with start date after future end date
  // *********************************************************
  When(/^I select start date for today/, () => {
    const today = new Date();

    this.page.openStartDate();
    browser.pause(1000);

    this.page.selectDateForStartDatePicker(today);
    browser.pause(1000);
  });

  Then(/^I cannot select end date to yesterday/, () => {
    // FIXME reuse the code to generate yesterday date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    this.page.openEndDate();
    browser.pause(1000);

    expect(this.page.getEndDatePickerDayButtonOfDate(yesterday).isEnabled()).to.equal(false);

    // to not conflict with next steps
    this.page.closeEndDatePicker();
    browser.pause(1000);
  });

  // *********************************************************
  // Scenario: I cannot be able to select start date after end date
  // *********************************************************
  When(/^I select start date to yesterday/, () => {
    // FIXME reuse the code to generate yesterday date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    this.page.openStartDate();
    browser.pause(1000);

    this.page.selectDateForStartDatePicker(yesterday);
    browser.pause(1000);
  });

  When(/^I select end date to yesterday/, () => {
    // FIXME reuse the code to generate yesterday date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    this.page.openEndDate();
    browser.pause(1000);

    this.page.selectDateForEndDatePicker(yesterday);
    browser.pause(1000);
  });

  Then(/^I cannot select start date to today/, () => {
    const today = new Date();

    this.page.openStartDate();
    browser.pause(1000);

    expect(this.page.getStartDatePickerDayButtonOfDate(today).isEnabled()).to.equal(false);

    // to not conflict with next steps
    this.page.closeStartDatePicker();
    browser.pause(1000);
  });

  // *********************************************************
  // Scenario: I want to generate Analysis with the smallest start date available
  // *********************************************************
  When(/^I Select start date equals to today less 100 years/, () => {
    const oneHundredYearsAgo = new Date();
    oneHundredYearsAgo.setFullYear(oneHundredYearsAgo.getFullYear() - 100);

    this.page.openStartDate();
    browser.pause(1000);

    this.page.selectDateForStartDatePicker(oneHundredYearsAgo);
    browser.pause(1000);
  });

  When(/^I Select valid end date/, () => {
    const today = new Date();

    this.page.openEndDate();
    browser.pause(1000);

    this.page.selectDateForEndDatePicker(today);
  });

  // *********************************************************
  // Scenario: I cannot be able to generate Analysis with start date smaller than today less 100
  // *********************************************************
  Then(/^I cannot select start date equals to today less 100 years and 1 day/, () => {
    const oneHundredYearsAgoLessOneDay = new Date();
    oneHundredYearsAgoLessOneDay.setFullYear(oneHundredYearsAgoLessOneDay.getFullYear() - 100);
    oneHundredYearsAgoLessOneDay.setDate(oneHundredYearsAgoLessOneDay.getDate() - 1);

    this.page.openStartDate();
    browser.pause(1000);

    expect(this.page.getStartDatePickerDayButtonOfDate(oneHundredYearsAgoLessOneDay).isEnabled()).to.equal(false);

    // to not conflict with next steps
    this.page.closeStartDatePicker();
    browser.pause(1000);
  });
});