Feature: Topic Page
  As a user of CKS
  I want to be able to use the CKS Topic Page

  Background:
    Given I open the asthma topic page
    And I have a screen that is 1366 by 768 pixels

  @pending
  Scenario: Detect accessibility issues
    Then the page should have no accessibility issues

  @pending
  Scenario: Detect mobile accessibility issues
    Given I have a screen that is 320 by 568 pixels
    Then the page should have no accessibility issues

  Scenario: NICE breadcrumb
    When I click the "NICE" breadcrumb
    Then I expect that the url is "https://www.nice.org.uk/"

  Scenario: Homepage breadcrumb
    When I click the "CKS" breadcrumb
    Then I expect that the path is "/"

  Scenario: Topics A to Z breadcrumb
    When I click the "Topics A to Z" breadcrumb
    Then I expect that the path is "/topics/"

  Scenario: Heading text
    Then I expect that element "h1" matches the text "Asthma"

  Scenario: Chapter navigation
    When I click the "Have I got the right topic?" link
    Then I expect that element "h1" contains the text "Have I got the right topic?"
    And I expect that the path is "/topics/asthma/have-i-got-the-right-topic/"



