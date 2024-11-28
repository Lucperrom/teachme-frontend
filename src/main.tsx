import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import {ChakraProvider, defaultSystem} from '@chakra-ui/react'
import {ThemeProvider} from 'next-themes'
import {BrowserRouter} from "react-router-dom";
import {AuthProvider} from "./services/auth/AuthContext.tsx";

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <ChakraProvider value={defaultSystem}>
            <ThemeProvider attribute="class" disableTransitionOnChange>
                <AuthProvider>
                    <App/>
                </AuthProvider>
            </ThemeProvider>
        </ChakraProvider>
    </BrowserRouter>
)
