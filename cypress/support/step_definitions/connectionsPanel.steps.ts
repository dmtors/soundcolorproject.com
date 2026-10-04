
/// <reference types="cypress" />

import { Given, Then } from 'cypress-cucumber-preprocessor/steps'

Given('I am on the connections panel', async () => {
  cy.visit('/sovis')
  cy.hideIntroPanels()
  cy.goToPanelRoute('connections')
  cy.wait(300)
})

Then('I should be on the connections panel', async () => {
  cy.get('[data-testid="connections-panel"]')
})
