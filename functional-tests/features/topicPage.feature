Feature: Topic Page
    As a user of CKS
    I want to be able to use the CKS Topic Page

    Background:
        Given I open the url "/3rd-degree-sideburns"

    Scenario: Detect Topic page accessibility issues
        Then the page should have no accessibility issues

    Scenario: Detect mobile Topic page accessibility issues
        Given I have a screen that is 320 by 568 pixels
        Then the page should have no accessibility issues
