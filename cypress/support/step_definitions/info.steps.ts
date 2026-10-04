
/// <reference types="cypress" />

import { Given, Then } from 'cypress-cucumber-preprocessor/steps'

Given('I am on the info page', () => {
  cy.visit('/')
})

Then('I should be on the info page', () => {
  cy.get('[data-testid="info-page"]')
})
