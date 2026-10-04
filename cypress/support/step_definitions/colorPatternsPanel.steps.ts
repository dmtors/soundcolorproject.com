
/// <reference types="cypress" />

import { Given, Then } from 'cypress-cucumber-preprocessor/steps'

import { PatternName } from '../../../site/state/patternsStore'

Given('I am on the color patterns panel', async () => {
  cy.visit('/sovis')
  cy.hideIntroPanels()
  cy.goToPanelRoute('palette')
  cy.wait(300)
})

Then('I should be on the color patterns panel', async () => {
  cy.get('[data-testid="pattern-selector"]')
  cy.window().its('stores').its('patterns').invoke('resetPattern')
})

Then('I should be on the saved color patterns panel', () => {
  cy.verifySubroute('favoriteCusom', 'saved-palette-selector')
})

Then('I should be on the custom color patterns panel', () => {
  cy.verifySubroute('customPalette', 'custom-pattern')
})

Then('the {string} color pattern should play', (pattern: PatternName) => {
  cy.window().its('stores').its('patterns').then(patternsStore => {
    if (patternsStore.currentPattern !== pattern) {
      throw new Error(`Expected the current pattern to be ${pattern}, but instead it was ${patternsStore.currentPattern}`)
    }
  })
})
