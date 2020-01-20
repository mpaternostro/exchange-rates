/// <reference types="Cypress" />

const URL = `http://127.0.0.1:8080/index.html`;

describe('Test de Tarea 1 Clase 12', () => {
    before(() => {
        cy.visit(URL);
    });
    
    it('Chequea la funcionalidad del conversor de monedas', () => {
        
        cy.get('option').should('have.length', 34).then(bases => {
            const $bases = bases;
            let baseRandom = $bases[Math.floor(Math.random() * 33 + 1)].value;
            cy.get('#seleccionar').select(baseRandom);
            cy.get('#listado-conversiones').should('be.visible').should('contain', baseRandom);
            cy.get('ul option').should('have.length.at.least', 32);

            const newDate = '2020-01-03';
            baseRandom = $bases[Math.floor(Math.random() * 33 + 1)].value;
            cy.get('input').type(newDate);
            cy.get('#seleccionar').select(baseRandom);
            cy.get('#listado-conversiones').should('contain', `del día ${newDate}`).should('contain', baseRandom);
        });
    });
});
