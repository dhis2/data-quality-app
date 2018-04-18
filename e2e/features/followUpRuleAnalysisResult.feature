Feature: Follow-up Analysis Result
  As a user of DHIS2
  I want to be able to preform actions on Follow-up Analysis Results section

  Background:
    Given that I am logged in to the Sierra Leone DHIS2
    And I am at Follow-up Analysis page

  Scenario:  I want to see Follow Up result analysis
	When I fill the form with data to generate results
	And I click Start
	Then Return arrow is displayed
	And Download as PDF is displayed
	And Download as XLS is displayed
	And Download as CSV is displayed
	And There is a table with column Data Element
	And There is a table with column Organisation unit
	And There is a table with column Min
	And There is a table with column Value
	And There is a table with column Max
	And There is a table with column UnFollow
	And There is a table with column Comment
	And Unfollow button
    
   Scenario:  I want to see Comment
	When I fill the form with data to generate results with comments
	And I click Start
	And I click Comments
	Then Pop Up with comments is displayed
	And Close Pop Up button

	Scenario:  I want to Unfollow results
	When I fill the form with data to generate results
	And I click Start
	And I Check results to Unfollow
	And I click Unfollow
	Then Unfollowed items are removed from the list

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	Scenario:  I want to see Validation result analysis item details
	When I fill the form with data to generate results
	And I click Start
	And I click icon Details
	Then I can see a pop up with title
	And I see a section with validation result details for selected item
	And I see a section with left side for selected item
	And I see a section with right side for selected item
	And I can click in close button for selected item
	
	Scenario:  I want to see Validation result analysis item details are updated
	When I fill the form with data to generate results
	And I click Start
	And I click icon Details
	And I click close
	And I click different icon details
	Then A pop up with new item details is displayed
	
	