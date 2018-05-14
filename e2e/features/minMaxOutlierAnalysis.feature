Feature: Min-Max Outlier Analysis
  As a user of DHIS2
  I want to be able to preform actions on Min-Max Outlier Analysis section

  Background:
    Given that I am logged in to the Sierra Leone DHIS2
    When I open Min-Max Outlier Analysis page

  Scenario: I want to see all items in the page
    Then A column with list of Data Set is displayed
    And A column with Parent organization unit selection checkboxes
    And A start date selection
    And An end date selection
    And Start option for min max outlier analysis is displayed

  Scenario: I want to start Analysis and check results
    When I select Data set with results
    And I select Parent Organisation with results
    And I select valid time range to get results
    And Start min max outlier analysis
    Then New page is displayed
    And Print action "Download as PDF" is displayed
    And Print action "Download as XLS" is displayed
    And Print action "Download as CSV" is displayed
    And There is a table with column "Data Element"
    And There is a table with column "Organisation Unit"
    And There is a table with column "Period"
    And There is a table with column "Min"
    And There is a table with column "Value"
    And There is a table with column "Max"
    And There is a table with column "Mark"

  Scenario: I want to start Analysis with multiple Data Set
    When I select multiple Data set with results
    And I select Parent Organisation with results
    And I select valid time range to get results
    And Start min max outlier analysis
    Then New page is displayed

  Scenario: I want to not start Analysis without data set
    When I select Parent Organisation with results
    And I select valid time range to get results
    Then Start Button is not active

  Scenario: I want to not start Analysis without Parent Organisation Unit
    When I select Data set with results
    And I select valid time range to get results
    Then Start Button is not active

  Scenario: I want to see No results message after start analysis
    When I fill form with data to retrieve no results
    And Start min max outlier analysis
    Then No results message is displayed

  Scenario: I cannot be able to generate Analysis with future start date
    Then I cannot select start date greater than today
    And  I cannot select end date greater than today

  Scenario: I cannot be able to generate Analysis with start date after future end date
    When I select start date for today
    Then I cannot select end date to yesterday

  Scenario: I cannot be able to select start date after end date
    When I select start date to yesterday
    And I select end date to yesterday
    Then I cannot select start date to today

  Scenario: I want to generate Analysis with the smallest start date available
    When I select Data set with results
    And I select Parent Organisation with results
    And I Select start date equals to today less 100 years
    And I Select valid end date
    And Start min max outlier analysis
    Then New page is displayed

  Scenario: I cannot be able to generate Analysis with start date smaller than today less 100
    Then I cannot select start date equals to today less 100 years and 1 day