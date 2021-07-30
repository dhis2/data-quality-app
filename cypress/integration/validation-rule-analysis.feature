Feature: Users should be able to run validation rules

  Background:
    Given the user navigated to the validation rule analysis page

  Scenario: User validates rules for organisation unit for which there are no violations
    Given there are no violations of the validation rules
    When the user selects an organisation unit
    And the user clicks the 'Validate' button
    Then an alert with the message 'Validation passed successfully' appears

  Scenario: User validates rules for organisation unit for which there are violations
    Given there are violations of the validation rules
    When the user selects an organisation unit
    And the user clicks the 'Validate' button
    Then a table containing details of each validation should be shown
