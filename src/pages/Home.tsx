import {Flex, Heading, HStack} from "@chakra-ui/react";
import LinkButton from "../components/LinkButton";

const Home = () => {
    return (
        <Flex direction="column" padding={10}>
            <Heading>My courses</Heading>

            <HStack gap={6}>
                <LinkButton colorScheme="teal" variant="solid" to={`/courses`}>
                    Go to course catalog
                </LinkButton>

            </HStack>
        </Flex>
    );
}

export default Home;
