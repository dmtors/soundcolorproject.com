
/// <reference types="cypress" />

import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'

Given('I am on the SOVIS page for the first time', () => {
  cy.visit('/sovis')
  cy.window().its('sessionStorage').invoke('clear')
  cy.reload()
})

Given('SOVIS is playing', () => {
  cy.window().its('stores').its('renderState').then(renderState => {
    renderState.startPattern()
  })
})

Then('SOVIS is in fullscreen mode', () => {
  cy.window().its('stores').its('renderState').then(renderState => {
    if (!renderState.isFullscreen) {
      renderState.toggleFullscreen()
    }
  })
})

When('I click on the play icon', () => {
  cy.get('[data-testid="shortcuts-play"]').click()
})

When('I click on the pause icon', () => {
  cy.get('[data-testid="shortcuts-pause"]').click()
})

When('I click on the eye icon', () => {
  cy.get('[data-testid="shortcuts-visibility"]').click()
})

When('I click on the maximize icon', () => {
  cy.get('[data-testid="shortcuts-fullscreen"]').click()
})

When('I click on the minimize icon', () => {
  cy.get('[data-testid="shortcuts-minimize"]').click()
})

Then('I should see the Warnings panel', () => {
  cy.visible('[data-testid="color-warning"]')
})

Then('I should see the How It Works panel', () => {
  cy.visible('[data-testid="how-it-works"]')
})

Then('I should see the Home panel', () => {
  cy.visible('[data-testid="shrinking-side-panel"]')
})

Then('I should be on the SOVIS page', () => {
  cy.contains('Share Sound Color Project')
})

Then('SOVIS should start', () => {
  cy.window().its('stores').its('renderState').then(renderState => {
    if (!renderState.showColors) {
      throw new Error('SOVIS should have colors playing, but they are not.')
    }
  })
})

Then('SOVIS should pause', () => {
  cy.window().its('stores').its('renderState').then(renderState => {
    if (renderState.showColors) {
      throw new Error('SOVIS should not have colors playing, but they are.')
    }
  })
})

Then('the panel should disappear', () => {
  cy.window().its('stores').its('renderState').then(renderState => {
    if (renderState.showText) {
      throw new Error('SOVIS should not show the panel, but it is visible.')
    }
  })
  cy.wait(500)
  cy.get('[data-testid="text-hider"]').then($el => {
    const styles = getComputedStyle($el[0])
    const opacity = parseFloat(styles.opacity)
    if (opacity > 0) {
      throw new Error('SOVIS should not show the panel, but it is visible.')
    }
  })
})

Then('SOVIS should enter fullscreen mode', () => {
  cy.window().its('stores').its('renderState').then(renderState => {
    if (!renderState.isFullscreen) {
      throw new Error('Expected the app to be in fullscreen but it was not')
    }
  })
})

Then('SOVIS should exit fullscreen mode', () => {
  cy.window().its('stores').its('renderState').then(renderState => {
    if (renderState.isFullscreen) {
      throw new Error('Expected the app to not be in fullscreen but it was')
    }
  })
})
