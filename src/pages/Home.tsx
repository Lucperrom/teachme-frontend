import { Box, HStack, Text } from "@chakra-ui/react";
import LinkButton from "../components/LinkButton";

const Home = () => {
    return (
        <Box>
            <Text>Home</Text>
            <HStack gap={6}>
            <LinkButton colorScheme="teal" variant="solid" to={`/courses`}>
            Go to course catalog 
            </LinkButton>
            
          </HStack>
        </Box>
    );
}

export default Home;