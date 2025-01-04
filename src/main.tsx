import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {ChakraProvider, defaultSystem} from '@chakra-ui/react';
import {ThemeProvider} from 'next-themes';
import {BrowserRouter} from "react-router-dom";
import {AuthProvider} from "./services/auth/AuthContext.tsx";
import { Provider } from 'react-redux';
import store from "./services/redux/store.ts";

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <ChakraProvider value={defaultSystem}>
            <ThemeProvider attribute="class" disableTransitionOnChange>
                <AuthProvider>
                    <Provider store={store}>
                        <App/>
                    </Provider>
                </AuthProvider>
            </ThemeProvider>
        </ChakraProvider>
    </BrowserRouter>
)
