Feature: Header
  As a user of CKS
  I want to be able to use the header to navigate and search

  Background:
    Given I open the url "/"

  Scenario: Use autocomplete to get a suggested topic
    When I type the first 3 characters of a topic name in the header search box
    Then I see topic suggestions matching my typed text

# Scenario: Click autocomplete suggestion straight to a topic (not search results)
#   When I click a topic autocomplete suggestion
#   Then I go straight to a topic page
