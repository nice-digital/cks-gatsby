Feature: Speciality Page
  As a user of CKS
  I want to be able to use the CKS Speciality Page

  Background:
    Given I open the allergies speciality page
    And I have a screen that is 1366 by 768 pixels

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

  Scenario: Specialities breadcrumb
    When I click the Specialities breadcrumb
    Then I expect that the path is "/specialities/"

  Scenario: Heading text
    Then I expect that element "h1" matches the text "Allergies"

  Scenario: Link to topic page for allergic rhinitis
    When I click the "Allergic rhinitis" link
    Then I expect that the path is "/topics/allergic-rhinitis/"
