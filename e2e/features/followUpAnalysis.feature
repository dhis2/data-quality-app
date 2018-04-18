Feature: Follow-Up Analysis
  As a user of DHIS2
  I want to be able to preform actions on Follow-Up Analysis section

  Background:
    Given that I am logged in to the Sierra Leone DHIS2
    When I open Follow-Up Analysis page

  Scenario:  I want to see all items in the page
	Then A column with Parent organization unit selection checkboxes
	And Data Set 
	And A start date selection
	And An end date selection
    And Start button
    
   Scenario: I want to Start Follow-Up rules
    When I Check Parent organization unit
	And I select Data Set 
    And I Select valid start date
    And I Select valid end date
    And Click Start
    Then The Follow-Up is generated
		
		
	Scenario: I want to Validate Data set changes
    When I Check Parent organization unit
	And I select Data Set 
	And I select another Parent Organization
    Then The Data set option selected is the All
	
	
   Scenario: I cannot be able to start Follow-up Analysis with future start date
	Then I cannot select start date greater than today
	
   Scenario: I cannot be able to generate Follow-up Analysis with future end date
	Then I cannot select end date greater than today
	
   Scenario: I cannot be able to generate Follow-up Analysis with start date after future end date
	When I select start date
	Then I cannot select end date greater than start date
	
   Scenario: I cannot be able to select invalid dates for Follow-up Analysis
	When I select start date
	And I select end date greater than start date
	Then I cannot select start date greater than end date
	
   Scenario: I want to generate Follow-up Analysis with same start and end date
    When I fill the form
	And I Select start date
    And I Select end date equals to start date
    And Click Start
    Then The Follow-Up is generated
	
   Scenario: I want to generate Follow-up Analysis with today start and end date
    When I fill the form
	And I Select today start date
    And I Select today end date
    And Click Start
    Then The Follow-Up is generated
	
   Scenario: I want to generate Follow-up Analysis with smaller start date available
   When I fill the form
	And I Select start date equals to today less 100 years
    And I Select valid end date
    And Click Start
    Then The Follow-Up is generated	
	
   Scenario:  I cannot be able to generate Follow-up Analysis with start date smaller than today less 100
    Then User cannot select start date equals to today less 100 years and 1 day
	
   Scenario: I want to generate Follow-up Analysis for all Data Sets
    When I Check Parent organization unit
    And I select first item on Data Sets
	And I Select valid start date
    And I Select valid end date
    And Click Start
    Then The Follow-Up is generated	
	
	Scenario: I want to generate Follow-up Analysis for last Data Set
    When I Check Parent organization unit
	And I select last item on Data Sets
    And I Select valid start date
    And I Select valid end date
    And Click Start
    Then The Follow-Up is generated	
	