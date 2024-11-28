import {Box, Heading,} from "@chakra-ui/react";
import ColorToggle from "./components/ColorToggle.tsx";

function App() {

    return (
        <Box textAlign="center" fontSize="xl" pt="30vh">

            <Heading>TeachMe</Heading>

            <Box pos="absolute" top="4" right="4">
                <ColorToggle/>
            </Box>
        </Box>
    )
}

export default App
