Feature: Users should be presented with available pages

  Background:
    Given the user navigated to the overview page

  Scenario Outline: User can see and visit <page>
    Then the user can see a card for the <page> page
    And the user can visit the <page> page by clicking on its card

  Scenarios:
    | page                     |
    | validation rule analysis |
    | outlier detection        |
    | follow up analysis       |
