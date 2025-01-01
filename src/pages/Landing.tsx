import { Box, Heading, Text } from "@chakra-ui/react";

const Landing = () => {
  return (
    <>
      <Box textAlign={"center"} py={{ base: 20, md: 36 }}>
        <Heading
          fontWeight={600}
          fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
          lineHeight={"110%"}
          px={{ base: 4, md: 0 }}
        >
          Welcome to The Course Platform <br />
          <Text as={"span"} color={"blue.400"}>
            TeachMe
          </Text>
        </Heading>
        <Text color={"gray.500"} p={{ base: 4, md: 10 }}>
          The number one platform to learn about technology and subjects all
          over the Internet. We provide the best courses for you to learn and be
          the best at what you do. Start learning today!
        </Text>
      </Box>
    </>
  );
};

export default Landing;
