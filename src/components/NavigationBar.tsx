import {Box, Flex, Heading} from "@chakra-ui/react";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../services/auth/AuthContext.tsx";
import ColorToggle from "./ColorToggle.tsx";
import {AppRoute} from "../constants/routes.ts";
import LinkButton from "./LinkButton.tsx";
import {MenuContent, MenuItem, MenuRoot, MenuTrigger} from "./ui/menu.tsx";
import {LuLogOut, LuMenu, LuUser} from "react-icons/lu";
import {Button} from "./ui/button.tsx";
import {authService} from "../services/auth/authService.ts";

const NavigationBar = () => {
    const {user} = useAuth();

    const navigate = useNavigate();

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
                    <MenuRoot positioning={{placement: "bottom-start"}}>
                        <MenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <LuMenu/>
                            </Button>
                        </MenuTrigger>
                        <MenuContent>
                            <MenuItem onClick={() => navigate(AppRoute.PROFILE)} value="profile" valueText="profile">
                                <LuUser/>
                                <Box flex="1">Profile</Box>
                            </MenuItem>
                            <MenuItem onClick={() => authService.logout()} value="logout" valueText="logout">
                                <LuLogOut/>
                                <Box flex="1">Logout</Box>
                            </MenuItem>
                        </MenuContent>
                    </MenuRoot>
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
