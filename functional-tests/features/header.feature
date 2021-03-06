Feature: Header
  As a user of CKS
  I want to be able to use the header to navigate and search

  Background:
    Given I open the home page

  Scenario: Use autocomplete to get a search suggestion for a topic name
    When I type "Ast" in the header search box
    Then I expect to see "Asthma" in the autocomplete suggestions

  Scenario: Navigate straight to a topic from an autocomplete suggestion
    Given I type "Ast" in the header search box
    When I click "Asthma" in the autocomplete options
    Then I expect the url to contain "asthma"
