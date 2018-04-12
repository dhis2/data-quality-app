Feature: Validation Rule Analysis Result
  As a user of DHIS2
  I want to be able to preform actions on Validation Rule Analysis Results section

  Background:
    Given that I am logged in to the Sierra Leone DHIS2
    And I am at Validation Rule Analysis page

  Scenario:  I want to see Validation result analysis
	When I fill the form with data to generate less than 500 results
	And I click Validate
	Then Return arrow is displayed
	And No alert is displayed 
	And Download as PDF is displayed
	And Download as XLS is displayed
	And Download as CSV is displayed
	And There is a table with column Organisation unit
	And There is a table with column Period
	And There is a table with column Importance
	And There is a table with column Validation Rule
	And There is a table with column Value
	And There is a table with column Operator
	And There is a table with column Value
	And There is a table with column Details with icon in each line
    

   Scenario:  I want to see Validation result analysis with more than 500 results message alert
	When I fill the form with data to generate more than 500 results
	And I click Validate
	Then 500 Results are displayed
	And A message to refine search is showed

	Scenario:  I want to see Validation result analysis without results
	When I fill the form with data to not generate results
	And I click Validate
	Then No Results are displayed
	And A message No results is showed
	
	Scenario:  I want to see Validation result analysis item details
	When I fill the form with data to generate results
	And I click Validate
	And I click icon Details
	Then I can see a pop up with title
	And I see a section with validation result details for selected item
	And I see a section with left side for selected item
	And I see a section with right side for selected item
	And I can click in close button for selected item
	
	Scenario:  I want to see Validation result analysis item details are updated
	When I fill the form with data to generate results
	And I click Validate
	And I click icon Details
	And I click close
	And I click different icon details
	Then A pop up with new item details is displayed
	
	