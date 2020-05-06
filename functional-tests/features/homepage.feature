Feature: Homepage
  As a user of CKS I can use the Home Page

  Scenario: User can see the site title
    Given I open the url "/"
		When I wait on element "h1" to exist
    Then I expect that element "h1" contains the text "Clinical Knowledge Summaries"

		Scenario: Detect Home page accessibility issues
        Then the page should have no accessibility issues

    Scenario: Detect mobile Home page accessibility issues
        Given I have a screen that is 320 by 568 pixels
        Then the page should have no accessibility issues
