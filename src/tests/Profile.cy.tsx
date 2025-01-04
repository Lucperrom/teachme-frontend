/// <reference types="cypress" />
import Profile from '../pages/Profile.tsx'
import {ChakraProvider, defaultSystem} from "@chakra-ui/react";

describe('<Profile />', () => {

    beforeEach(() => {
        cy.intercept('GET', '/api/v1/students/me', {
            statusCode: 200,
            body: {
                contactInformation: {
                    name: 'John',
                    surname: 'Doe',
                    email: 'john.doe@example.com',
                    phoneNumber: '1234567890',
                    country: 'US',
                },
                profileInformation: {
                    bio: 'This is a bio',
                    language: 'English',
                    profilePictureUrl: '',
                    plan: 'GOLD',
                },
            },
        });

        cy.intercept('PUT', '/api/v1/students/me', {
            statusCode: 200,
            body: {
                contactInformation: {
                    name: 'Jane',
                    surname: 'Smith',
                    email: 'john.doe@example.com',
                    phoneNumber: '1234567890',
                    country: 'US',
                },
                profileInformation: {
                    bio: 'This is a bio',
                    language: 'English',
                    profilePictureUrl: '',
                    plan: 'GOLD',
                },
            },
        });
    });

    it('renders and displays correct data', () => {
        // see: https://on.cypress.io/mounting-react
        cy.viewport(800, 800);
        cy.mount(
            <ChakraProvider value={defaultSystem}>
                <Profile/>
            </ChakraProvider>
        );

        cy.get('[data-test=profile-name]').should('contain', 'John Doe');
        cy.get('[data-test=profile-email]').should('contain', 'john.doe@example.com');
        cy.get('[data-test=profile-bio]').should('contain', 'This is a bio');
        cy.get('[data-test=profile-plan]').should('contain', 'GOLD');
        cy.get('[data-test=profile-picture]').click();
        cy.get('[data-test=profile-picture-modal]').should('be.visible');
    })

    it('allows editing', () => {
        // see: https://on.cypress.io/mounting-react
        cy.viewport(800, 800);
        cy.mount(
            <ChakraProvider value={defaultSystem}>
                <Profile/>
            </ChakraProvider>
        );

        cy.get('[data-test=edit-profile-button]').click();
        cy.get('[data-test=edit-name-input]').clear().type('Jane');
        cy.get('[data-test=edit-surname-input]').clear().type('Smith');
        cy.get('[data-test=save-button]').click();

        cy.get('[data-test=profile-name]').should('contain', 'Jane Smith');
    })
})