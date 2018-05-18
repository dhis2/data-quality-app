Feature: Home
  As a user of DHIS2
  I want to be able to See all the items and open the correspondent item

  Background:
    Given that I am logged in to the Sierra Leone DHIS2
    And I am on home

  Scenario Outline: Check the presence of the item
    Then I can see the "<item>" in the page
    And I can see a description
    And the "<text_link>" to the selected section
    Examples:
      | item                     | text_link        |
      | Validation Rule Analysis | Run Validation   |
      | Std Dev Outlier Analysis | Analyze          |
      | Min-Max Outlier Analysis | Analyze          |
      | Follow-Up Analysis       | View Data Values |

  Scenario Outline: Open the correspondent page
    When I click in the "<item>" in the page
    Then the side menu "<item>" is selected
    And the new section is opened with "<header>"
    Examples:
      | item                     | header                   |
      | Validation Rule Analysis | Validation Rule Analysis |
      | Std Dev Outlier Analysis | Std Dev Outlier Analysis |
      | Min-Max Outlier Analysis | Min-Max Outlier Analysis |
      | Follow-Up Analysis       | Follow-Up Analysis       |