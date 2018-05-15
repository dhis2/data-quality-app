Feature: Min-Max Outlier Analysis
  As a user of DHIS2
  I want to be able to preform actions on Min-Max Outlier Analysis section

  Background:
    Given that I am logged in to the Sierra Leone DHIS2
    When I open Min-Max Outlier Analysis page

  Scenario: I want to see all items in the page
    Then A column with list of Data Set is displayed
    And A column with Parent organization unit selection is displayed
    And A start date selection is displayed
    And An end date selection is displayed
    And A Start analysis option is displayed

  Scenario: I want to start Analysis and check results
    When I select Data set with results
    And I select Parent Organisation with results
    And I select valid time range to get results
    And Start analysis
    Then New page is displayed
	And action to Download as PDF is displayed
    And action to Download as XLS is displayed
    And action to Download as CSV is displayed
    And There is a table with results

  Scenario: I want to start Analysis with multiple Data Set
    When I select multiple Data set with results
    And I select Parent Organisation with results
    And I select valid time range to get results
    And Start analysis
    Then New page is displayed
	And action to Download as PDF is displayed
    And action to Download as XLS is displayed
    And action to Download as CSV is displayed
    And There is a table with results

  Scenario: I want to not start Analysis without data set
    When I select Parent Organisation with results
    And I select valid time range to get results
	And no Data Set is selected
    Then Start Button is not active

  Scenario: I want to not start Analysis without Parent Organisation Unit
    When I select Data set with results
    And I select valid time range to get results
	And no Parent organisation unit is selected
    Then Start Button is not active

  Scenario: I want to see No results message after start analysis
    When I fill form with data to retrieve no results
    And Start analysis
    Then No results message is displayed

   Scenario: I cannot be able to generate Analysis with future start date
    Then I cannot select start date greater than today
    And  I cannot select end date greater than today

  Scenario: I cannot be able to generate Analysis with start date after future end date
    When I select start date to past date
	And I select end date to date after start date
    Then I cannot select start date after end date
	
  Scenario: I cannot be able to generate Analysis with end date before start date
    When I select start date
    Then I cannot select end date date previous than start date

  Scenario: I want to generate Analysis with the smallest start date available
    When I select Parent Organisation with results
    And I select start date equals to smallest date possible
    And I select valid end date
    And I select Validation Rule Group with results
    And Start analysis
    Then New page is displayed

  Scenario: I cannot be able to generate Analysis with start date smaller than possible smallest date
    Then I cannot select start date smaller than smallest date possible