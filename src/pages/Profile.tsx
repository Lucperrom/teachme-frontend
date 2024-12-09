import {Box, Card, Flex, Heading, Separator, Text} from "@chakra-ui/react";
import {Avatar} from "../components/ui/avatar.tsx";
import {IoMdTrophy} from "react-icons/io";
import {FaPhone} from "react-icons/fa";
import {IoMail} from "react-icons/io5";

const Profile = () => {
    return (
        <Flex direction="row" padding={10}>
            <Card.Root width="100%" rounded="xl" overflow="hidden">
                <Card.Body gap="2" padding={0} rounded="xl">
                    <Box width="100%"
                         height={200}
                         bgAttachment="fixed"
                         position="relative"
                         bg="red.200"
                         marginBottom={50}>
                        <Box position="absolute" rounded="full" padding={1} backgroundColor="white" left="4%"
                             bottom={-50}>
                            <Avatar
                                src="https://picsum.photos/200/300"
                                name="Rami Nakkar"
                                width={120}
                                height={120}
                                shape="full"
                            />
                        </Box>
                    </Box>
                    <Flex direction="column"
                          gap={3}
                          paddingLeft="4%"
                          paddingRight="4%"
                          justifyContent="space-between">
                        <Flex justifyContent="space-between" gap={2}>
                            <Flex direction="column" gap={2}>
                                <Heading size="2xl">Rami Nakkar</Heading>
                                <Flex color="gray.500" gap={2} alignItems="center">
                                    <Text display="flex" alignItems="center" gap={2}>
                                        <IoMail/> rami.nakkar00@gmail.com
                                    </Text>
                                    <Separator orientation="vertical" height="4" size="md"/>
                                    <Text display="flex" alignItems="center" gap={2}>
                                        <FaPhone/> +491312341234
                                    </Text>
                                </Flex>
                                <Text color="gray.500">
                                    Germany, German
                                </Text>
                            </Flex>
                            <Flex alignItems="center" gap={2}>
                                <IoMdTrophy size={25} color="bronze"/>
                                <Text fontWeight="bold">Basic</Text>
                            </Flex>
                        </Flex>
                        <Text color="gray.500">
                            This is the card body. Lorem ipsum dolor sit amet, consectetur
                            adipiscing elit. Curabitur nec odio vel dui euismod fermentum.
                            Curabitur nec odio vel dui euismod fermentum.
                        </Text>
                    </Flex>

                    <Card.Description>
                    </Card.Description>
                </Card.Body>
            </Card.Root>
        </Flex>
    );
}

export default Profile;