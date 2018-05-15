Feature: Follow-Up Analysis
  As a user of DHIS2
  I want to be able to preform actions on Follow-Up Analysis section

  Background:
    Given that I am logged in to the Sierra Leone DHIS2
    When I open Follow-Up Analysis page

  Scenario:  I want to see all items in the page
    Then A column with Parent organization unit selection is displayed
    And A data set select is displayed
    And A start date selection is displayed
    And An end date selection is displayed
    And A Start analysis option is displayed

  Scenario:  I want to see result analysis
    When I select Parent Organisation with results
    And I select Data set with results
    And I select valid time range to get results
    And Start analysis
    Then New page is displayed
    And Print action "Download as PDF" is displayed
    And Print action "Download as XLS" is displayed
    And Print action "Download as CSV" is displayed
    And There is a table with column "Data Element"
    And There is a table with column "Organisation unit"
    And There is a table with column "Min"
    And There is a table with column "Value"
    And There is a table with column "Max"
    And There is a table with column "UnFollow"
    And There is a table with column "Comment"
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
    When I Check Parent organization unit
    And I select Data Set
    And I select another Parent Organization
    Then The Data set option selected is the All

  Scenario: I want to not start Analysis without Parent Organisation Unit
    And I select Data set with results
    And I select valid time range to get results
    Then Start Button is not active

  Scenario: I want to see No results message after start analysis
    When I fill form with data to retrieve no results
    And Start analysis
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
    When I select Parent Organisation with results
    And I select Data set with results
    And I Select start date equals to today less 100 years
    And I Select valid end date
    And Start analysis
    Then New page is displayed

  Scenario: I cannot be able to generate Analysis with start date smaller than today less 100
    Then I cannot select start date equals to today less 100 years and 1 day

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
	