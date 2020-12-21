Feature: Chapter Page
  As a user of CKS
  I want to be able to use the CKS Chapter Page

  Background:
    Given I open the asthma have I got the right topic? page
    And I have a screen that is 1366 by 768 pixels

  Scenario: Detect accessibility issues
    Then the page should have no accessibility issues

  Scenario: Detect mobile accessibility issues
    Given I have a screen that is 320 by 568 pixels
    Then the page should have no accessibility issues

  Scenario: NICE breadcrumb
    When I click the NICE breadcrumb
    Then I expect that the url is "https://www.nice.org.uk/"

  Scenario: Homepage breadcrumb
    When I click the CKS breadcrumb
    Then I expect that the path is "/"

  Scenario: Health topics A to Z breadcrumb
    When I click the Topics A to Z breadcrumb
    Then I expect that the path is "/topics/"

  Scenario: Asthma breadcrumb
    When I click the Asthma breadcrumb
    Then I expect that the path is "/topics/asthma/"

  Scenario: Heading text
    Then I expect that element "h1" contains the text "Have I got the right topic?"

  Scenario: Chapter navigation
    When I click the "Summary" link
    And I expect that the path is "/topics/asthma/"

  Scenario: Chapter body
    Then I expect that element "main" contains the text "From age 1 month onwards"



