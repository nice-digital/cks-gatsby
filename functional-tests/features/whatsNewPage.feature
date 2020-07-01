Feature: Whats New Page
  As a user of CKS
  I want to be able to use the CKS Whats New Page

  Background:
    Given I open the url "/whats-new/"

  Scenario: Old URL redirect
    Given I open the url "/whatsnew"
    Then I expect that the path is "/whats-new/"

  Scenario: Detect Whats New page accessibility issues
    Then the page should have no accessibility issues

  Scenario: Detect mobile Whats New page accessibility issues
    Given I have a screen that is 320 by 568 pixels
    Then the page should have no accessibility issues

  Scenario: View list of topic changes
    Then I expect to see a list of topic changes
