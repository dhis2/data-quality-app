Feature: Validation Rule Analysis
  As a user of DHIS2
  I want to be able to preform actions on Validation Rule Analysis section

  Background:
    Given that I am logged in to the Sierra Leone DHIS2
    When I open Validation Rule Analysis page

  Scenario:  I want to see all items in the page
	Then A column with Parent organization unit selection checkboxes
	And A start date selection
	And An end date selection
	And Validation Rule Group selection
	And Send notifications checkbox
	And Persist new results checkbox
    And Validate button
    
   Scenario: I want to Validate rules
    When I Check Parent organization unit
    And I Select valid start date
    And I Select valid end date
    And Click Validate
    Then The Validation is generated
	
   Scenario: I cannot be able to generate Validation Rule Analysis with future start date
	When I Check Parent Organization unit
	Then I cannot select start date greater than today
	
   Scenario: I cannot be able to generate Validation Rule Analysis with future end date
	When I Check Parent Organization unit
	Then I cannot select end date greater than today
	
   Scenario: I cannot be able to generate Validation Rule Analysis with start date after future end date
	When I Check Parent Organization unit
	And I select start date
	Then I cannot select end date greater than start date
	
   Scenario: I cannot be able to select invalid dates for Validation Rule Analysis
	When I select start date
	And I select end date greater than start date
	Then I cannot select start date greater than end date
	
   Scenario: I want to generate Validation Rule Analysis with same start and end date
    When I Check Parent organization unit
    And I Select start date
    And I Select end date equals to start date
    And I select first option for Validation Rule Group
    And Click Validate
    Then The Validation is generated
	
   Scenario: I want to generate Validation Rule Analysis with today start and end date
    When I Check Parent organization unit
    And I Select today start date
    And I Select today end date
    And Click Validate
    Then The Validation is generated
	
   Scenario: I want to generate Validation Rule Analysis with smaller start date available
    When I Check Parent organization unit
    And I Select start date equals to today less 100 years
    And I Select valid end date
    And Click Validate
    Then The Validation is generated	
	
   Scenario:  I cannot be able to generate Validation Rule Analysis with start date smaller than today less 100
    When I Check Parent organization unit
    Then User cannot select start date equals to today less 100 years and 1 day
	
   Scenario: I want to generate Validation Rule Analysis with send notifications
    When I Check Parent organization unit
    And I Select valid start date
    And I Select valid end date
	And I select the Send notifications checkbox
    And Click Validate
    Then The Validation is generated	
	
   Scenario: I want to generate Validation Rule Analysis without send notifications
    When I Check Parent organization unit
    And I Select valid start date
    And I Select valid end date
	And I set the Send notifications checkbox unchecked
    And Click Validate
    Then The Validation is generated

   Scenario: I want to generate Validation Rule Analysis with Persist new results
    When I Check Parent organization unit
    And I Select valid start date
    And I Select valid end date
	And I select the Persist new results checkbox
    And Click Validate
    Then The Validation is generated

   Scenario: I want to generate Validation Rule Analysis without Persist new results
    When I Check Parent organization unit
    And I Select valid start date
    And I Select valid end date
	And I set Persist new results checkbox unchecked
    And Click Validate
    Then The Validation is generated	
	
   Scenario: I want to generate Validation Rule Analysis for all validation rules
    When I Check Parent organization unit
    And I Select valid start date
    And I Select valid end date
	And I select first item on Validation Group
    And Click Validate
    Then The Validation is generated	
	
	Scenario: I want to generate Validation Rule Analysis for last validation rule
    When I Check Parent organization unit
    And I Select valid start date
    And I Select valid end date
	And I select last item on Validation Group
    And Click Validate
    Then The Validation is generated	
	
	Scenario: I want to generate Validation Rule Analysis for second validation rule
    When I Check Parent organization unit
    And I Select valid start date
    And I Select valid end date
	And I select second item on Validation Group
    And Click Validate
    Then The Validation is generated	
	
	