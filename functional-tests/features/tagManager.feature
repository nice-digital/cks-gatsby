Feature: Google Tag Manager
  Tag Manager loads with the correct contaner id

  Scenario: Tag Manager is loaded
    Given I open the home page
    Then I expect that the CKS GTM container is available
