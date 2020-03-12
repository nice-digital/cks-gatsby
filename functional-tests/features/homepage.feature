Feature: Homepage
  As a user of CKS I can use the

  Scenario: User can see the site title
    Given I open the url "/"
		When I wait on element "h1" to exist
    Then I expect that element "h1" contains the text "Clinical Knowledge Summaries"
