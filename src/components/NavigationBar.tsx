import {Flex, Heading} from "@chakra-ui/react";
import {Link} from "react-router-dom";
import {Avatar} from "./ui/avatar.tsx";
import {useAuth} from "../services/auth/AuthContext.tsx";
import ColorToggle from "./ColorToggle.tsx";
import {AppRoute} from "../constants/routes.ts";
import LinkButton from "./LinkButton.tsx";

const NavigationBar = () => {
    const {user} = useAuth();

    return (
        <Flex
            width="100%"
            height="20"
            padding={5}
            alignItems="center"
            justifyContent="space-between"
            borderBottom="1px"
            borderColor="gray.100"
        >
            <Flex alignItems="center" gap={2}>
                <Link to={AppRoute.HOME}>
                    <Flex alignItems="center" gap={2}>
                        <Heading fontSize={35}>TeachMe</Heading>
                    </Flex>
                </Link>
            </Flex>

            <Flex gap={4} alignItems="center">
                {user ? (
                    <Avatar/>
                ) : (
                    <>
                        <LinkButton
                            as={Link}
                            to={AppRoute.LOGIN}
                            variant="ghost"
                            color="indigo.600"
                        >
                            Login
                        </LinkButton>
                        <LinkButton
                            as={Link}
                            to={AppRoute.SIGNUP}
                            colorScheme="indigo"
                        >
                            Sign up
                        </LinkButton>
                    </>
                )}
                <ColorToggle/>
            </Flex>
        </Flex>
    );
}

export default NavigationBar;
