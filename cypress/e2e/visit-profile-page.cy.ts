/// <reference types="cypress" />
describe('Profile Page E2E Tests', () => {
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

    cy.intercept('GET', '/api/v1/auth/me', {
      statusCode: 200,
      body: { id: '1', email: 'john.doe@example.com', role: 'student' },
    });

    cy.intercept('POST', '/api/v1/auth/signin', {
      statusCode: 200,
      body: { token: 'mock-token' },
    });

    cy.visit('http://localhost:5173/login');
    cy.get('.Email-auth-login').type('john.doe@example.com');
    cy.get('.Password-auth-login').type('password123');
    cy.get('.Send-login').click();

    cy.get('[data-test=menu]').click();
    cy.get('[data-test=menu-profile-option]').click();
  });

  it('renders profile data correctly', () => {
    cy.url().should('include', '/profile');
    cy.get('[data-test=profile-name]').should('contain', 'John Doe');
    cy.get('[data-test=profile-email]').should('contain', 'john.doe@example.com');
    cy.get('[data-test=profile-bio]').should('contain', 'This is a bio');
    cy.get('[data-test=profile-plan]').should('contain', 'GOLD');
    cy.get('[data-test=profile-picture]').click();
    cy.get('[data-test=profile-picture-modal]').should('be.visible');
  });

  it('allows editing the profile', () => {
    cy.get('[data-test=edit-profile-button]').click();
    cy.get('[data-test=edit-name-input]').clear().type('Jane');
    cy.get('[data-test=edit-surname-input]').clear().type('Smith');
    cy.get('[data-test=save-button]').click();

    cy.get('[data-test=profile-name]').should('contain', 'Jane Smith');
  });
});
