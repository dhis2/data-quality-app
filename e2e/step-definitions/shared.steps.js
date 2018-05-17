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

  When(/^I open Follow-Up analysis page$/, () => {
    this.page = require('../pages/followUpAnalysis.page');
    this.page.open();
    browser.pause(1000);
  });

  When(/^I open Validation Rule Analysis page$/, () => {
    this.page = require('../pages/validationRuleAnalysis.page');
    this.page.open();
    browser.pause(1000);
  });

  // *********************************************************
  // Scenario: I want to see all items in the page
  // *********************************************************
  Then(/a column with list of data set is displayed$/, () => {
    expect(this.page.dataSetSelect.isVisible()).to.equal(true);
  });

  Then(/^a column with parent organisation unit selection is displayed$/, () => {
    expect(this.page.organisationUnitTreeView.isVisible()).to.equal(true);
  });

  Then(/^a start date selection is displayed/, () => {
    expect(this.page.startDateInput.isVisible()).to.equal(true);
  });

  Then(/^an end date selection is displayed/, () => {
    expect(this.page.endDateInput.isVisible()).to.equal(true);
  });

  Then(/^a standard deviation is displayed/, () => {
    expect(this.page.standardDevDropdown.isVisible()).to.equal(true);
  });

  Then(/^a start min-max analysis option is displayed/, () => {
    expect(this.page.startButton.isVisible()).to.equal(true);
  });

  Then(/^a start std dev outlier analysis option is displayed/, () => {
    expect(this.page.startButton.isVisible()).to.equal(true);
  });

  Then(/^a start followup analysis option is displayed/, () => {
    expect(this.page.startButton.isVisible()).to.equal(true);
  });

  Then(/validation rule group selection is displayed$/, () => {
    expect(this.page.validationRuleGroup.isVisible()).to.equal(true);
  });

  Then(/send notifications option is displayed$/, () => {
    expect(this.page.sendNotificationsOption.isVisible()).to.equal(true);
  });

  Then(/persist new results option is displayed$/, () => {
    expect(this.page.persistResultsOption.isVisible()).to.equal(true);
  });

  Then(/a data set selection is displayed$/, () => {
    expect(this.page.dataSetDropdown.isVisible()).to.equal(true);
  });

  Then(/^a start validation rule analysis option is displayed/, () => {
    expect(this.page.startButton.isVisible()).to.equal(true);
  });

  // *********************************************************
  // Scenario: I want to start min-max analysis and check results
  // *********************************************************
  When(/^I select data set with results/, () => {
    this.page.selectDataSetWithResults();
  });

  When(/^I select parent organisation with results/, () => {
    this.page.getOneOrgUnitTreeFromTreeByIndex(0).click();
    expect(this.page.isOrganisationUnitSelected()).to.equal(true);
    browser.pause(5000);                                              // time for data sets to refresh
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
    browser.pause(1000);                                                      // to make sure buttons are available
    this.page.openStartDateYearsPicker();
    browser.pause(1000);                                                      // to make sure buttons are available
    this.page.getStartDateYearButton(today.getFullYear() - 3).click();        // 3 years behind
    browser.pause(1000);                                                      // to make sure buttons are available
    this.page.confirmStartDatePicker();
    browser.pause(1000);                                                      // to make sure date picker closes
  });

  When(/^I select validation rule group with results/, () => {
    this.page.selectValidationGroupWithResults();
  });

  When(/^I start min max min-max analysis/, () => {
    this.page.startButton.click();
    browser.pause(60000);                         // time for task to process
  });

  When(/^I start std dev outlier analysis/, () => {
    this.page.startButton.click();
    browser.pause(60000);                         // time for task to process
  });

  When(/^I start followup analysis/, () => {
    this.page.startButton.click();
    browser.pause(60000);                         // time for task to process
  });

  When(/^I start validation rule analysis/, () => {
    this.page.startButton.click();
    browser.pause(60000);                         // time for task to process
  });

  Then(/^a new page is displayed/, () => {
    expect(this.page.resultsTable.isVisible()).to.equal(true);
  });

  Then(/^action to download as PDF is displayed/, () => {
    expect(this.page.downloadAsPdfButton.isVisible()).to.equal(true);
  });

  Then(/^action to download as XLS is displayed/, () => {
    expect(this.page.downloadAsXlsButton.isVisible()).to.equal(true);
  });

  Then(/^action to download as CSV is displayed/, () => {
    expect(this.page.downloadAsCsvButton.isVisible()).to.equal(true);
  });

  Then(/^a table with results is displayed/, () => {
    expect(this.page.resultsTableRows.length > 0).to.equal(true);
  });

  Then(/^the unfollow option is displayed/, () => {
    expect(this.page.unfollowButton.isVisible()).to.equal(true);
  });

  // *********************************************************
  // Scenario: I want to start min-max analysis with multiple data set
  // *********************************************************
  When(/^I select multiple data set with results/, () => {
    this.page.getDataSetOptionByIndex(1).click();
    browser.keys(['Shift']);                                    // shift down
    this.page.getDataSetOptionByIndex(2).click();
    browser.keys(['Shift']);                                    // shift up
    let selectedOptionsCount = 0;
    const options = this.page.dataSetSelect.elements('<option>').value;
    for( let currentOption of options ) {
      let backgroundColor = currentOption.getCssProperty('background-color').value;
      if (backgroundColor === 'rgba(0,105,217,1)') {
        selectedOptionsCount++;
      }
    }
    expect(selectedOptionsCount).to.equal(2);
  });

  // *********************************************************
  // Scenario: I want to not start min-max analysis without data set
  // *********************************************************
  When(/^no data set is selected/, () => {
    expect(this.page.dataSetSelect.getValue()).to.equal('');
  });

  Then(/^start button to generate min-max analysis is not active/, () => {
    expect(this.page.startButton.isEnabled()).to.equal(false);
  });

  Then(/^the start std dev outlier analysis button is not active/, () => {
    expect(this.page.startButton.isEnabled()).to.equal(false);
  });

  Then(/^start button to generate followup analysis is not active/, () => {
    expect(this.page.startButton.isEnabled()).to.equal(false);
  });

  Then(/^the start validation rule analysis Button is not active/, () => {
    expect(this.page.startButton.isEnabled()).to.equal(false);
  });

  // *********************************************************
  // Scenario: I want to not start min-max analysis without parent organisation Unit
  // *********************************************************
  When(/^no parent organisation unit is selected/, () => {
    expect(this.page.isOrganisationUnitSelected()).to.equal(false);
  });

  // *********************************************************
  // Scenario: I want to see a no results message after start min-max analysis
  // *********************************************************
  When(/^I fill form with data to retrieve no results/, () => {
    this.page.fillFormWithNoResults();
  });

  Then(/^a no results message is displayed/, () => {
    expect(this.page.snackBarMessageElement.isVisible()).to.equal(true);
    expect(this.page.snackBarMessageElement.getText()).to.equal('No values found');
  });

  Then(/^a validation passed successfully message is displayed/, () => {
    expect(this.page.snackBarMessageElement.isVisible()).to.equal(true);
    expect(this.page.snackBarMessageElement.getText()).to.equal('Validation passed successfully');
  });

  // *********************************************************
  // Scenario: I cannot be able to generate analysis with future start date
  // *********************************************************
  Then(/^I cannot select the start date greater than today/, () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    this.page.openStartDate();
    browser.pause(1000);

    expect(this.page.getStartDatePickerDayButtonOfDate(tomorrow).isEnabled()).to.equal(false);

    // to not conflict with next steps
    this.page.closeStartDatePicker();
    browser.pause(1000);
  });

  Then(/^I cannot select the end date greater than today/, () => {
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
  // Scenario: I cannot be able to generate analysis with start date after future end date
  // *********************************************************
  When(/^I select start date to past date/, () => {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    this.page.openStartDate();
    browser.pause(1000);

    this.page.selectDateForStartDatePicker(oneYearAgo);
    browser.pause(1000);
  });

  When(/^I select end date to date after the start date/, () => {
    const endDate = this.page.startDate;
    endDate.setDate(endDate.getDate() + 1);

    this.page.openEndDate();
    browser.pause(1000);

    this.page.selectDateForEndDatePicker(endDate);
    browser.pause(1000);
  });

  Then(/^I cannot select the start date after the end date/, () => {
    const startDate = this.page.endDate;
    startDate.setDate(startDate.getDate() + 1);

    this.page.openStartDate();
    browser.pause(1000);

    expect(this.page.getStartDatePickerDayButtonOfDate(startDate).isEnabled()).to.equal(false);

    // to not conflict with next steps
    this.page.closeStartDatePicker();
    browser.pause(1000);
  });

  // *********************************************************
  // Scenario: I cannot be able to generate analysis with end date before start date
  // *********************************************************
  When(/^I select valid start date/, () => {
    const today = new Date();

    this.page.openStartDate();
    browser.pause(1000);

    this.page.selectDateForStartDatePicker(today);
    browser.pause(1000);
  });

  Then(/^I cannot select end date date previous than the start date/, () => {
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
  // Scenario: I want to generate analysis with the smallest start date available
  // *********************************************************
  When(/^I select start date equals to smallest date possible/, () => {
    const oneHundredYearsAgo = new Date();
    oneHundredYearsAgo.setFullYear(oneHundredYearsAgo.getFullYear() - 100);

    this.page.openStartDate();
    browser.pause(1000);

    this.page.selectDateForStartDatePicker(oneHundredYearsAgo);
    browser.pause(1000);
  });

  When(/^I select valid end date/, () => {
    const today = new Date();

    this.page.openEndDate();
    browser.pause(1000);

    this.page.selectDateForEndDatePicker(today);
  });

  // *********************************************************
  // Scenario: I cannot be able to generate analysis with start date smaller than possible smallest date
  // *********************************************************
  Then(/^I cannot select start date smaller than the smallest date possible/, () => {
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

  // *********************************************************
  // Scenario: I want to see Validation result analysis item details
  // *********************************************************
  When(/^I click icon Details/, () => {
    this.page.openValidationRuleDetailsByIndex(0);
  });

  When(/^I can see a pop up/, () => {
    expect(this.page.validationRulesDetailsDialog.isVisible()).to.equal(true);
  });

  When(/^I see a section with validation result details for selected item/, () => {
    expect(this.page.resultsRowAtDetailsDialog.isVisible()).to.equal(true);
  });

  When(/^I see a section with left side for selected item/, () => {
    expect(this.page.leftSideRowAtDetailsDialog.isVisible()).to.equal(true);
  });

  When(/^I see a section with right side for selected item/, () => {
    expect(this.page.rightSideRowAtDetailsDialog.isVisible()).to.equal(true);
  });

  When(/^I can click in close button for selected item/, () => {
    expect(this.page.closeButtonAtDetailsDialog.isVisible()).to.equal(true);
  });
});