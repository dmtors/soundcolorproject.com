
/// <reference types="cypress" />

import { Given, Then } from 'cypress-cucumber-preprocessor/steps'

Given('I am on the options panel', async () => {
  cy.visit('/sovis')
  cy.hideIntroPanels()
  cy.goToPanelRoute('options')
  cy.wait(300)
})

Then('I should be on the options panel', async () => {
  cy.get('[data-testid="options-panel"]')
})

Then('I should be on the color options panel', async () => {
  cy.get('[data-testid="color-options-panel"]')
})

Then('I should be on the visualization options panel', async () => {
  cy.get('[data-testid="visualization-options-panel"]')
})

Then('I should be on the timing options panel', async () => {
  cy.get('[data-testid="timing-options-panel"]')
})
