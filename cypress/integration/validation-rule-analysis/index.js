import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

Given('the user navigated to the validation rule analysis page', () => {
    cy.visit('/#/validation-rules-analysis')
    cy.findByRole('heading', { name: 'Validation Rule Analysis' }).should(
        'exist'
    )
})

Given('there are no violations of the validation rules', () => {
    cy.intercept(
        { pathname: /dataAnalysis\/validationRules$/, method: 'POST' },
        req => {
            req.reply({
                statusCode: 200,
                body: [],
            })
        }
    )
})

Given('there are violations of the validation rules', () => {
    cy.intercept(
        { pathname: /dataAnalysis\/validationRules$/, method: 'POST' },
        req => {
            req.reply({
                statusCode: 200,
                body: [
                    {
                        validationRuleId: 'validation-rule-id',
                        attributeOptionComboId: 'aoc-id',
                        attributeOptionComboDisplayName: 'aoc-display-name',
                        organisationUnitId: 'ou-id',
                        organisationUnitDisplayName: 'ou-display-name',
                        periodId: 'pe-id',
                        periodDisplayName: 'pe-display-name',
                        importance: 'importance',
                        validationRuleDescription: 'description',
                        leftSideValue: null,
                        operator: null,
                        rightSideValue: null,
                    },
                ],
            })
        }
    )
})

When('the user selects an organisation unit', () => {
    cy.getWithDataTest('{dhis2-uiwidgets-orgunittree}')
        .findByText('Sierra Leone')
        .click({ force: true })
})

When(`the user clicks the 'Validate' button`, () => {
    cy.findByRole('button', { name: 'Validate' }).click()
})

Then(
    `an alert with the message 'Validation passed successfully' appears`,
    () => {
        cy.getWithDataTest('{dhis2-uicore-alertbar}')
            .findByText('Validation passed successfully')
            .should('exist')
    }
)

Then('a table containing details of each validation should be shown', () => {
    cy.getWithDataTest('{validation-rules-violations-table}').should('exist')
})
