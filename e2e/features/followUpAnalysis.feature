Feature: Follow-Up Analysis
  As a user of DHIS2
  I want to be able to preform actions on Follow-Up Analysis section

  Background:
    Given that I am logged in to the Sierra Leone DHIS2
    When I open Follow-Up Analysis page

  Scenario:  I want to see all items in the page
    Then a column with Parent organization unit selection is displayed
    And a data set select is displayed
    And a start date selection is displayed
    And an end date selection is displayed
    And a Start analysis option is displayed

  Scenario:  I want to see result analysis
    When I select Parent Organisation with results
    And I select Data set with results
    And I select valid time range to get results
    And Start analysis
    Then New page is displayed
	And action to Download as PDF is displayed
    And action to Download as XLS is displayed
    And action to Download as CSV is displayed
    And There is a table with results
    And Unfollow option is displayed

  Scenario:  I want to see Comment
    When I select Parent Organisation with results
    And I select Data set with results
    And I select valid time range to get results
    And Start analysis
    And I select a comment
    Then Pop Up with comments is displayed

  # FIXME this will change database making it problematic for consecutive runs
  Scenario:  I want to Unfollow results
    When I select Parent Organisation with results
    And I select Data set with results
    And I select valid time range to get results
    And Start analysis
    And I Check results to Unfollow
    And I execute Unfollow actions
    Then Unfollowed items are removed from the list

  Scenario: I want to Validate Data set changes
    When I select Parent organization unit
    And I select Data Set
    And I select another Parent Organization
    Then the Data set option selected is the All
	And available Data Set list is updated

  Scenario: I want to not start Analysis without Parent Organisation Unit
    And I select Data set with results
    And I select valid time range to get results
	And no Parent Organisation is selected
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
  # SHOULD WE TEST THOSE ONES
#  Scenario: I want to generate Follow-up Analysis for all Data Sets
#    When I Check Parent organization unit
#    And I select first item on Data Sets
#    And I Select valid start date
#    And I Select valid end date
#    And Click Start
#    Then The Follow-Up is generated
#
#  Scenario: I want to generate Follow-up Analysis for last Data Set
#    When I Check Parent organization unit
#    And I select last item on Data Sets
#    And I Select valid start date
#    And I Select valid end date
#    And Click Start
#    Then The Follow-Up is generated
	