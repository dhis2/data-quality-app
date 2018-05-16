Feature: Follow-Up analysis
  As a user of DHIS2
  I want to be able to preform actions on Follow-Up analysis section

  Background:
    Given that I am logged in to the Sierra Leone DHIS2
    When I open Follow-Up analysis page

  Scenario:  I want to see all items in the page
    Then a column with parent organisation unit selection is displayed
    And a data set selection is displayed
    And a start date selection is displayed
    And an end date selection is displayed
    And a I start the analysis option is displayed

  Scenario:  I want to see result analysis
    When I select parent organisation with results
    And I select data set with results
    And I select valid time range to get results
    And I start the analysis
    Then a new page is displayed
	And action to download as PDF is displayed
    And action to download as XLS is displayed
    And action to download as CSV is displayed
    And there is a table with results
    And the unfollow option is displayed

  Scenario:  I want to see Comment
    When I select parent organisation with results
    And I select data set with results
    And I select valid time range to get results
    And I start the analysis
    And I select a comment
    Then the comment is displayed

  # FIXME this will change database making it problematic for consecutive runs
  Scenario:  I want to unfollow results
    When I select parent organisation with results
    And I select data set with results
    And I select valid time range to get results
    And I start the analysis
    And I select results to unfollow
    And I choose to unfollow them
    Then the unfollowed items are removed from the list

  Scenario: I want to validate data set changes
    When I select parent organisation unit
    And I select a data set
    And I select another parent organisation
    Then the data set option selected is reverted to all data sets
	And the available data set list is updated

  Scenario: I want to not start the analysis without parent organisation unit
    And I select data set with results
    And I select valid time range to get results
	And no parent organisation is selected
    Then Start Button is not active

  Scenario: I want to see the no results message after I start the analysis
    When I fill form with data to retrieve no results
    And I start the analysis
    Then the no results message is displayed

   Scenario: I cannot be able to generate analysis with future start date
    Then I cannot select the start date greater than today
    And  I cannot select the end date greater than today

  Scenario: I cannot be able to generate analysis with start date after future end date
    When I select start date to past date
	And I select end date to date after the start date
    Then I cannot select the start date after the end date
	
  Scenario: I cannot be able to generate analysis with end date before start date
    When I select start date
    Then I cannot select end date date previous than the start date

  Scenario: I want to generate analysis with the smallest start date available
    When I select parent organisation with results
    And I select start date equals to smallest date possible
    And I select valid end date
    And I select validation rule group with results
    And I start the analysis
    Then a new page is displayed

  Scenario: I cannot be able to generate analysis with start date smaller than possible smallest date
    Then I cannot select start date smaller than the smallest date possible
  # SHOULD WE TEST THOSE ONES
#  Scenario: I want to generate Follow-up analysis for all data sets
#    When I Check parent organisation unit
#    And I select first item on data sets
#    And I Select valid start date
#    And I Select valid end date
#    And Click Start
#    Then The Follow-Up is generated
#
#  Scenario: I want to generate Follow-up analysis for last data set
#    When I Check parent organisation unit
#    And I select last item on data sets
#    And I Select valid start date
#    And I Select valid end date
#    And Click Start
#    Then The Follow-Up is generated
	