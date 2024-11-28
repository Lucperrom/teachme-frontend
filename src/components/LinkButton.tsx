import {Button, ButtonProps} from "@chakra-ui/react";
import {Link, LinkProps} from "react-router-dom";
import {FC} from "react";

interface LinkButtonProps extends ButtonProps {
    to: LinkProps["to"];
}

const LinkButton: FC<LinkButtonProps> = ({children, to, ...props}) => {
    return (
        // @ts-ignore
        <Button as={Link} to={to} {...props}>
            {children}
        </Button>
    );
};

export default LinkButton;
