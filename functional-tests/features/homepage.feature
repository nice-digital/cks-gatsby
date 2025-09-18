Feature: Homepage
  As a user of CKS I can use the Home Page

  Background:
    Given I open the home page
    And I have a screen that is 1920 by 1080 pixels

  Scenario: User can see the site title
    When I wait on element "h1" to exist
    Then I expect that element "h1" contains the text "Clinical Knowledge Summaries"

  Scenario: Clicking on a topic initial takes you to the topics page at that letter
    When I click on the element "[href^='/topics/#']"
    Then I expect the url to contain "/topics/#"

  Scenario: Detect Home page accessibility issues
    When I wait on element "h1" to exist
    Then the page should have no accessibility issues

  Scenario: Detect mobile Home page accessibility issues
    Given I have a screen that is 320 by 568 pixels
    When I wait on element "h1" to exist
    Then the page should have no accessibility issues
