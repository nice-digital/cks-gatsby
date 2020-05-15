Feature: 404 Page
  As a user of CKS
  I want to see the CKS 404 Page when a page is not found

  Background:
    Given I open the url "/404/"

  Scenario: Detect 404 page accessibility issues
    Then the page should have no accessibility issues

  Scenario: Detect mobile 404 page accessibility issues
    Given I have a screen that is 320 by 568 pixels
    Then the page should have no accessibility issues
