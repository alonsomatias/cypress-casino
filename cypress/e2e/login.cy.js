///  <reference types="cypress" />
var itParam = require('mocha-param');
var userSuccessData = require('../fixtures/loginSuccessData.json')
var userFailData = require('../fixtures/loginFailData.json')

describe('Demo Casino Testing', () => {
    beforeEach(() => {
        cy.visitCasino()
    })

    itParam("Login Test Success: ${value.descrption}", userSuccessData, (user) => {
        cy.contains('Sign up').click()
        
        // Type email
        cy.get(`input[data-test = input-email]`).type(user.email)

        // Click on terms and conditions
        cy.get('input[data-test = "input-terms_and_conditions"]').parent().click()

        // Select Currency
        cy.contains('Currency').siblings().invoke('attr', 'class' ,'selectric-wrapper').as('currency')
        cy.get('@currency').find('b').click()
        cy.get('@currency').find('.selectric-items').find('li').contains(user.currency).click()

        // Type password
        cy.get('[data-test="input-password"]').type(user.password)
        cy.get('[data-test="input-password_confirmation"]').type(user.password)

        // Use prom code
        if(user.promoCode != null){
            cy.get('.form__input-wrapper').find(`input[data-test = input-promo_code]`).type(user.promoCode)
        }else{
            cy.get(`label[for=bonus-0]`).click()
        }
        
        // Submit Form
        cy.get('button[type=submit]').click()

        // Validate user is on the success page
        cy.get('.notification__title').should('contain.text', 'Congratulations!')
    })

    itParam("Login Test Fail: ${value.descrption}", userFailData, (user) => {
        cy.contains('Sign up').click()
        
        // Type email
        cy.get(`input[data-test = input-email]`).type(user.email)

        // Click on terms and conditions
        cy.get('input[data-test = "input-terms_and_conditions"]').parent().click()

        // Type password
        cy.get('[data-test="input-password"]').type(user.password)
        cy.get('[data-test="input-password_confirmation"]').type(user.repeatPass)

        // Submit Form
        cy.get('button[type=submit]').click()
                
        // Validate repeat password fails
        cy.get('div[data-test="error-password_confirmation"]').should('contain.text', 'Password must be strictly repeated.')
        // Validate e-mail error
        cy.get('div[data-test="error-email"]').should('contain.text', 'Invalid email')
    })
})
