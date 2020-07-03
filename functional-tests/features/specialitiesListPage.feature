Feature: Specialities list page
  As a user of CKS
  I want to be able to use the CKS Specialities List Page

  Background:
    Given I open the specialities list page
    And I have a screen that is 1366 by 768 pixels

  Scenario: Old URL redirect
    Given I open the url "/clinicalspeciality"
    Then I expect that the path is "/specialities/"

  Scenario: Detect desktop accessibility issues
    Then the page should have no accessibility issues

  Scenario: Detect mobile accessibility issues
    Given I have a screen that is 320 by 568 pixels
    Then the page should have no accessibility issues

  Scenario: NICE breadcrumb
    When I click on the "NICE" breadcrumb
    Then I expect that the url is "https://www.nice.org.uk/"

  Scenario: Homepage breadcrumb
    When I click on the "CKS" breadcrumb
    Then I expect that the path is "/"

  Scenario: Heading text
    Then I expect that element "h1" matches the text "Specialities"

  Scenario: Link to speciality page for allergies
    When I click the "Allergies" link
    Then I expect that the path is "/specialities/allergies/"
