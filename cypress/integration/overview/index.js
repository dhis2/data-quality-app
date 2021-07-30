import { Given, Then } from 'cypress-cucumber-preprocessor/steps'

Given('the user navigated to the overview page', () => {
    cy.visit('/')
    cy.getWithDataTest('{overview}').should('exist')
})

Then('the user can see a card for the validation rule analysis page', () => {
    cy.findByRole('heading', { name: 'Validation Rule Analysis' }).should(
        'exist'
    )
})

Then(
    'the user can visit the validation rule analysis page by clicking on its card',
    () => {
        cy.findByRole('heading', { name: 'Validation Rule Analysis' }).click()
        cy.url().should('include', '/validation-rules-analysis')
    }
)

Then('the user can see a card for the outlier detection page', () => {
    cy.findByRole('heading', { name: 'Outlier detection' }).should('exist')
})

Then(
    'the user can visit the outlier detection page by clicking on its card',
    () => {
        cy.findByRole('heading', { name: 'Outlier detection' }).click()
        cy.url().should('include', '/outlier-detection')
    }
)

Then('the user can see a card for the follow up analysis page', () => {
    cy.findByRole('heading', { name: 'Follow-Up Analysis' }).should('exist')
})

Then(
    'the user can visit the follow up analysis page by clicking on its card',
    () => {
        cy.findByRole('heading', { name: 'Follow-Up Analysis' }).click()
        cy.url().should('include', '/follow-up-analysis')
    }
)
