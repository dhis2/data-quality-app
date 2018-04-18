Feature: Std Dev Outlier Analysis
  As a user of DHIS2
  I want to be able to preform actions on Std Dev Outlier Analysis section

  Background:
    Given that I am logged in to the Sierra Leone DHIS2
    When I open Std Dev Outlier Analysis page
	
	Scenario: I want to see all items in the page
	Then A column with list of Data Set is displayed 
	And A column with Parent organization unit selection checkboxes
	And A start date selection
	And An end date selection
	And Number of Standard deviations
    And Start button
	
	
	Scenario: I want to start Analysis and check results
	When I select Data set with results
	And Select Parent Organisation with results
	And Select valid time range to get results
	And Click Start
	Then New page is displayed
	And Download as PDF is displayed
	And Download as XLS is displayed
	And Download as CSV is displayed
	And There is a table with column Data Element
	And There is a table with column Organisation Unit
	And There is a table with column Period
	And There is a table with column Validation Rule
	And There is a table with column Value
	And There is a table with column Operator
	And There is a table with column Value
	And There is a table with column Details with icon in each line
	
	Scenario: I want to not start Analysis without data set
	When I do not select Data set
	And Select Parent Organisation
	And Select valid time range
	Then Start Button is not active
	
	Scenario: I want to not start Analysis without Parent
	When I select Data set
	And I do not Select Parent Organisation
	And Select valid time range
	Then Start Button is not active	
	
	Scenario: I want to see No results message after start analysis
	When I fill form with data to retrieve no results
	And Click Start 
	Then No results message is displayed
		
	Scenario: I cannot be able to generate Analysis with future start date
	Then I cannot select start date greater than today
	And  I cannot select end date greater than today
	
   Scenario: I cannot be able to generate Analysis with start date after future end date
	When I select start date
	Then I cannot select end date smaller than start date
	
   Scenario: I cannot be able to select invalid dates for Analysis
	When I select start date
	And I select end date greater than start date
	Then I cannot select start date greater than end date
		
   Scenario: I want to generate Analysis with same start and end date
    When I Check Parent organization unit
    And I Select start date
    And I Select end date equals to start date
    And Click Start
    Then The Analysis is generated
	
   Scenario: I want to generate Analysis with today start and end date
    When I fill the form
    And I Select today start date
    And I Select today end date
    And Click Start
    Then The Analysis is generated
	
   Scenario: I want to generate Analysis with smaller start date available
    When I fill the form
    And I Select start date equals to today less 100 years
    And I Select valid end date
    And Click Start
    Then The Analysis is generated	
	
   Scenario:  I cannot be able to generate Analysis with start date smaller than today less 100
    Then User cannot select start date equals to today less 100 years and 1 day