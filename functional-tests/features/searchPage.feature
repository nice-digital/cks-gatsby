Feature: Search Page
  As a user of CKS
  I want to be able to use the CKS Search Page

  Background:
    Given I have a screen that is 1366 by 768 pixels

  Scenario: Search for cancer from the homepage
    Given I open the home page
    When I search for cancer
    Then I expect to see search results for cancer

  Scenario: Detect accessibility issues
    When I open the search page
    Then the page should have no accessibility issues

  Scenario: Detect mobile accessibility issues
    Given I have a screen that is 320 by 568 pixels
    And I open the search page
    Then the page should have no accessibility issues

  Scenario: 10 search results per page
    When I view the search results page for cancer
    Then I expect to see a list of 10 search results

# Editing this out for now - the test is meaningless as we just update it to reflect the changing number each time
# Scenario: Total number of results
#   When I view the search results page for cancer
#   Then I expect to see 492 total search results for cancer

# TODO: Current page number, page titles, pagination, spelling corrections, no results, empty search
