import {Flex, Spinner} from "@chakra-ui/react";

const LoadingSpinner = () => {
    return (
        <Flex justifyContent="center"
              style={{height: "100vh", width: "100vw", marginTop: "20%"}}>
            <Spinner size="xl"/>
        </Flex>
    );
}

export default LoadingSpinner;