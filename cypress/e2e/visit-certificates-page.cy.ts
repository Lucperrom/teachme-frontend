/// <reference types="cypress" />
describe('Profile Page E2E Tests', () => {
    beforeEach(() => {
        cy.intercept('GET', '/api/v1/students/me', {
            statusCode: 200,
            body: {
                id: "test",
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

        cy.intercept('GET', '/api/v1/certificates/test', {
            statusCode: 200,
            body: [
                {
                    id: "test",
                    name: "test",
                    surname: "test",
                    email: "test",
                    courseId: "test",
                    courseName: "test",
                    courseDescription: "test",
                    courseDuration: "test",
                    courseLevel: "test",
                    completionDate: "test",
                    blobLink: "www.google.de",
                }
            ],
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

        cy.intercept('GET', '/api/v1/auth/me', {
            statusCode: 200,
            body: {id: '1', email: 'john.doe@example.com', role: 'student'},
        });

        cy.intercept('GET', '/api/v1/students/me/courses', {
            statusCode: 200,
            body: [],
        });

        cy.intercept('GET', '/api/v1/students/me/completed-courses', {
            statusCode: 200,
            body: [],
        });

        cy.intercept('POST', '/api/v1/auth/signin', {
            statusCode: 200,
            body: {token: 'mock-token'},
        });

        cy.visit('http://localhost:5173/login');
        cy.get('.Email-auth-login').type('john.doe@example.com');
        cy.get('.Password-auth-login').type('password123');
        cy.get('.Send-login').click();

        cy.get('[data-test=menu]').click();
        cy.get('[data-test=menu-certificate-option]').click();
    });

    it('renders profile data correctly', () => {
        cy.url().should('include', '/certificates');
        cy.get('[data-test=certificate-name]').should('contain', 'test');

        cy.get('[data-test=certificate-download-button]').should('exist');
    });

});
