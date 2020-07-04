Feature: Development process page
  As a user of CKS
  I want to be able to use the CKS development process page

  Background:
    Given I open the development page
    And I have a screen that is 1366 by 768 pixels

  Scenario: Old URL redirect
    Given I open the url "/development"
    Then I expect that the path is "/about/development/"

  Scenario: Detect desktop accessibility issues
    Then the page should have no accessibility issues

  Scenario: Detect mobile accessibility issues
    Given I have a screen that is 320 by 568 pixels
    Then the page should have no accessibility issues

  Scenario: NICE breadcrumb
    When I click the "NICE" breadcrumb
    Then I expect that the url is "https://www.nice.org.uk/"

  Scenario: Homepage breadcrumb
    When I click the "CKS" breadcrumb
    Then I expect that the path is "/"

  Scenario: About breadcrumb
    When I click the "About CKS" breadcrumb
    Then I expect that the path is "/about/"

  Scenario: Heading text
    Then I expect that element "h1" matches the text "Development process"

  Scenario: Heading text
    Then I expect that the title is "Development process | About CKS | CKS | NICE"
