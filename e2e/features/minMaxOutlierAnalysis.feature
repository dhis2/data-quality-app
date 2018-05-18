Feature: Min-Max Outlier Analysis
  As a user of DHIS2
  I want to be able to preform actions on Min-Max Outlier Analysis section

  Background:
    Given that I am logged in to the Sierra Leone DHIS2
    When I open Min-Max Outlier Analysis page

  Scenario: I want to see all items in the page
    Then a column with list of data set is displayed
    And a column with parent organisation unit selection is displayed
    And a start date selection is displayed
    And an end date selection is displayed
    And a start min-max analysis option is displayed

  Scenario: I want to start min-max analysis and check results
    When I select data set with results
    And I select parent organisation with results
    And I select valid time range to get results
    And I start min max min-max analysis
    Then a new page is displayed
    And action to download as PDF is displayed
    And action to download as XLS is displayed
    And action to download as CSV is displayed
    And a table with results is displayed

  Scenario: I want to start min-max analysis with multiple data set
    When I select multiple data set with results
    And I select parent organisation with results
    And I select valid time range to get results
    And I start min max min-max analysis
    Then a new page is displayed
    And action to download as PDF is displayed
    And action to download as XLS is displayed
    And action to download as CSV is displayed
    And a table with results is displayed

  Scenario: I want to not start min-max analysis without data set
    When I select parent organisation with results
    And I select valid time range to get results
    And no data set is selected
    Then start button to generate min-max analysis is not active

  Scenario: I want to not start min-max analysis without parent organisation Unit
    When I select data set with results
    And I select valid time range to get results
    And no parent organisation unit is selected
    Then start button to generate min-max analysis is not active

  Scenario: I want to see a no results message after start min-max analysis
    When I fill form with data to retrieve no results
    And I start min max min-max analysis
    Then a no results message is displayed

  Scenario: I cannot be able to generate analysis with future start date
    Then I cannot select the start date greater than today
    And  I cannot select the end date greater than today

  Scenario: I cannot be able to generate analysis with start date after future end date
    When I select start date to past date
    And I select end date to date after the start date
    Then I cannot select the start date after the end date

  Scenario: I cannot be able to generate analysis with end date before start date
    When I select valid start date
    Then I cannot select end date date previous than the start date

  Scenario: I want to generate analysis with the smallest start date available
    When I select data set with results
    And I select parent organisation with results
    And I select start date equals to smallest date possible
    And I select valid end date
    And I start min max min-max analysis
    Then a new page is displayed

  Scenario: I cannot be able to generate analysis with start date smaller than possible smallest date
    Then I cannot select start date smaller than the smallest date possible