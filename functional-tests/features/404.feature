Feature: 404 Page
  As a user of CKS
  I want to see the CKS 404 Page when a page is not found

  Background:
    Given I open the not found page

  Scenario: User sees custom content for 404 response
    When I wait on element "h1" to exist
    Then I expect that element "h1" contains the text "We can't find this page"

  Scenario: The page is blocked from search indexing
    Then I expect to see a meta tag named "robots" with the content "noindex"

  Scenario: Detect 404 page accessibility issues
    Then the page should have no accessibility issues

  Scenario: Detect mobile 404 page accessibility issues
    Given I have a screen that is 320 by 568 pixels
    Then the page should have no accessibility issues
