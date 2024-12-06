import {Flex, Heading, Input} from "@chakra-ui/react";
import {Field} from "../components/ui/field.tsx";
import {useState} from "react";
import {Button} from "../components/ui/button.tsx";
import {authService} from "../services/auth/authService.ts";

const Login = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleSubmit = () => {
        setLoading(true);
        authService.login({email, password})
            .finally(() => {
                setLoading(false)
            });
    }

    return (
        <Flex alignItems="center" justifyContent="center" direction="column" gap={5}>

            <Heading>Login</Heading>

            <Field style={{width: 400}} label="Email">
                <Input type="email"
                       value={email}
                       onChange={(val) => setEmail(val.currentTarget.value)}
                       placeholder="example@example.com"/>
            </Field>

            <Field style={{width: 400}}>
                <Input type="password"
                       value={password}
                       onChange={(val) => setPassword(val.currentTarget.value)}
                       placeholder="********"/>
            </Field>

            <Button loading={loading} onClick={handleSubmit}>Login</Button>
        </Flex>
    );
}

export default Login;