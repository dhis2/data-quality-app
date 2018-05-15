Feature: Validation Rule Analysis
  As a user of DHIS2
  I want to be able to preform actions on Validation Rule Analysis section

  Background:
    Given that I am logged in to the Sierra Leone DHIS2
    When I open Validation Rule Analysis page

  Scenario:  I want to see all items in the page
    Then A column with Parent organization unit selection is displayed
    And A data set select is displayed
    And A start date selection is displayed
    And An end date selection is displayed
	And Validation Rule Group selection is displayed
	And Send notifications option is displayed
	And Persist new results option is displayed
    And A Start analysis option is displayed

  Scenario:  I want to see result analysis
    When I select Parent Organisation with results
    And I select Data set with results
    And I select valid time range to get results
    And I select Validation Rule Group with results
    And Start analysis
    Then New page is displayed
    And Print action "Download as PDF" is displayed
    And Print action "Download as XLS" is displayed
    And Print action "Download as CSV" is displayed
    And There is a table with column "Organisation unit"
    And There is a table with column "Period"
    And There is a table with column "Importance"
    And There is a table with column "Validation Rule"
    And There is a table with column "Value"
    And There is a table with column "Operator"
    And There is a table with column "Value"
    And There is a table with column "Details"

  Scenario:  I want to see Validation result analysis item details
    When I fill the form with data to generate results
    And I click Validate
    And I click icon Details
    Then I can see a pop up with title
    And I see a section with validation result details for selected item
    And I see a section with left side for selected item
    And I see a section with right side for selected item
    And I can click in close button for selected item

  Scenario: I want to Validate Data set changes
    When I Check Parent organization unit
    And I select Data Set
    And I select another Parent Organization
    Then The Data set option selected is the All

  Scenario: I want to not start Analysis without Parent Organisation Unit
    And I select Data set with results
    And I select valid time range to get results
    And I select Validation Rule Group with results
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
    And I select Validation Rule Group with results
    And Start analysis
    Then New page is displayed

  Scenario: I cannot be able to generate Analysis with start date smaller than today less 100
    Then I cannot select start date equals to today less 100 years and 1 day

    # ARE WE ABLE TO TEST THOSE ONES
#   Scenario: I want to generate Validation Rule Analysis with send notifications
#    When I Check Parent organization unit
#    And I Select valid start date
#    And I Select valid end date
#	And I select the Send notifications checkbox
#    And Click Validate
#    Then The Validation is generated
#
#   Scenario: I want to generate Validation Rule Analysis without send notifications
#    When I Check Parent organization unit
#    And I Select valid start date
#    And I Select valid end date
#	And I set the Send notifications checkbox unchecked
#    And Click Validate
#    Then The Validation is generated
#
#   Scenario: I want to generate Validation Rule Analysis with Persist new results
#    When I Check Parent organization unit
#    And I Select valid start date
#    And I Select valid end date
#	And I select the Persist new results checkbox
#    And Click Validate
#    Then The Validation is generated
#
#   Scenario: I want to generate Validation Rule Analysis without Persist new results
#    When I Check Parent organization unit
#    And I Select valid start date
#    And I Select valid end date
#	And I set Persist new results checkbox unchecked
#    And Click Validate
#    Then The Validation is generated
#
#   Scenario: I want to generate Validation Rule Analysis for all validation rules
#    When I Check Parent organization unit
#    And I Select valid start date
#    And I Select valid end date
#	And I select first item on Validation Group
#    And Click Validate
#    Then The Validation is generated

    # SHOULD WE TEST THOSE ONES
#	Scenario: I want to generate Validation Rule Analysis for last validation rule
#    When I Check Parent organization unit
#    And I Select valid start date
#    And I Select valid end date
#	And I select last item on Validation Group
#    And Click Validate
#    Then The Validation is generated
#
#	Scenario: I want to generate Validation Rule Analysis for second validation rule
#    When I Check Parent organization unit
#    And I Select valid start date
#    And I Select valid end date
#	And I select second item on Validation Group
#    And Click Validate
#    Then The Validation is generated
	
	