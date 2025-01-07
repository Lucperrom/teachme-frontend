/// <reference types="cypress" />
import Certificates from '../pages/Certificates.tsx'
import {ChakraProvider, defaultSystem} from "@chakra-ui/react";
import {AuthProvider} from "../services/auth/AuthContext.tsx";
import {BrowserRouter} from "react-router-dom";

describe('<Certificates />', () => {

    beforeEach(() => {
        cy.intercept('GET', '/api/v1/certificates/**', {
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
                    completionDate: Date.now(),
                    blobLink: "test",
                },
                {
                    id: "test2",
                    name: "test2",
                    surname: "test",
                    email: "test",
                    courseId: "test",
                    courseName: "test2",
                    courseDescription: "test",
                    courseDuration: "test",
                    courseLevel: "test",
                    completionDate: Date.now(),
                    blobLink: "test",
                }
            ],
        });
    });

    it('renders and displays correct', () => {
        // see: https://on.cypress.io/mounting-react
        cy.mount(
            <BrowserRouter>
                <AuthProvider>
                    <ChakraProvider value={defaultSystem}>
                        <Certificates/>
                    </ChakraProvider>
                </AuthProvider>
            </BrowserRouter>
        )

        cy.get('[data-test=certificate-name]').should('contain', 'test');
        cy.get('[data-test=certificate-name]').should('contain', 'test2');
    })
})