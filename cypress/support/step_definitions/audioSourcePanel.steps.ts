
/// <reference types="cypress" />

import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'

Given('I am on the audio source panel', () => {
  cy.visit('/sovis')
  cy.hideIntroPanels()
  cy.goToPanelRoute('connections')
  cy.goToSubRoute('audioSource')
  cy.wait(300)
})

When('I click on any available audio source', () => {
  cy.get('body').find('[data-testid="audio-source-selector-source-1"]').click()
})

Then('that audio source should be selected', () => {
  cy.goToSubRoute('audioSource')
  cy.wait(300)
  cy.get('body').find('[data-testid="audio-source-selector-source-1"] a').shouldHaveClassLike('panelButton_hilight')
})

Then('I should be on the audio source panel', () => {
  cy.get('body').find('[data-testid="audio-source-selector"]')
})
