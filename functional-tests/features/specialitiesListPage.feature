Feature: Specialities List Page
  As a user of CKS
  I want to be able to use the CKS Specialities List Page

  Background:
    Given I open the url "/specialities/"

  Scenario: Detect Specialities List page accessibility issues
    Then the page should have no accessibility issues

  Scenario: Detect mobile Specialities List page accessibility issues
    Given I have a screen that is 320 by 568 pixels
    Then the page should have no accessibility issues
