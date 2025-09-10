Feature: Topics List Page
  As a user of CKS
  I want to be able to use the CKS Topics List Page

  Background:
    Given I open the topics list page
    And I have a screen that is 1920 by 1080 pixels

  Scenario: Detect desktop accessibility issues
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

  Scenario: Heading text
    Then I expect that element "h1" matches the text "Health topics A to Z"

  Scenario: Click alphabet letter
    When I click the "Letter C" link
    Then I expect that the path is "/topics/#c"

  Scenario: Scroll to and click topic (Obesity)
    When I click the "Obesity" link
    Then I expect that the path is "/topics/obesity/"
