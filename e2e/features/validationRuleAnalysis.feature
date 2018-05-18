Feature: Validation Rule Analysis
  As a user of DHIS2
  I want to be able to preform actions on Validation Rule Analysis section

  Background:
    Given that I am logged in to the Sierra Leone DHIS2
    When I open Validation Rule Analysis page

  Scenario:  I want to see all items in the page
    Then a column with parent organisation unit selection is displayed
    And a start date selection is displayed
    And an end date selection is displayed
    And validation rule group selection is displayed
    And send notifications option is displayed
    And persist new results option is displayed
    And a start validation rule analysis option is displayed

  Scenario:  I want to see result analysis
    When I select parent organisation with results
    And I select valid time range to get results
    And I select validation rule group with results
    And I start validation rule analysis
    Then a new page is displayed
    And action to download as PDF is displayed
    And action to download as XLS is displayed
    And action to download as CSV is displayed
    And a table with results is displayed

  Scenario:  I want to see Validation result analysis item details
    When I select parent organisation with results
    And I select valid time range to get results
    And I select validation rule group with results
    And I start validation rule analysis
    And a new page is displayed
    And I click icon Details
    Then I can see a pop up
    And I see a section with validation result details for selected item
    And I see a section with left side for selected item
    And I see a section with right side for selected item
    And I can click in close button for selected item

  Scenario: I want to not start validation rule analysis without parent organisation Unit
    And I select valid time range to get results
    And I select validation rule group with results
    And no parent organisation unit is selected
    Then the start validation rule analysis Button is not active

  Scenario: I want to see the no results message after start validation rule analysis
    When I fill form with data to retrieve no results
    And I start validation rule analysis
    Then a validation passed successfully message is displayed

  Scenario: I cannot be able to generate analysis with future start date
    Then I cannot select the start date greater than today
    And  I cannot select the end date greater than today

  Scenario: I cannot be able to generate analysis with start date after future end date
    When I select start date to past date
    And I select end date to date after the start date
    Then I cannot select the start date after the end date

  Scenario: I cannot be able to generate analysis with end date before start date
    When I select valid end date
    Then I cannot select end date date previous than the start date

  Scenario: I want to generate analysis with the smallest start date available
    When I select parent organisation with results
    And I select start date equals to smallest date possible
    And I select valid end date
    And I start validation rule analysis
    Then a new page is displayed

  Scenario: I cannot be able to generate analysis with start date smaller than possible smallest date
    Then I cannot select start date smaller than the smallest date possible
	
	