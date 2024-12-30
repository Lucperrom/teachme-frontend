import {Flex, Heading, Input} from "@chakra-ui/react";
import {Field} from "../components/ui/field.tsx";
import {Button} from "../components/ui/button.tsx";
import {useState} from "react";
import {authService} from "../services/auth/authService.ts";
import {useNavigate} from "react-router-dom";

const SignUp = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const navigate = useNavigate();

    const handleSubmit = () => {
        setLoading(true);
        authService.register({email, password})
            .then(response => {
                if (response.userId) {
                    navigate("/login")
                }
            })
            .finally(() => {
                setLoading(false)
            });
    }

    return (
        <Flex alignItems="center" justifyContent="center" direction="column" gap={5}>

            <Heading>Sing Up!</Heading>

            <Field style={{width: 400}} label="Email">
                <Input type="email"
                       value={email}
                       onChange={(val) => setEmail(val.currentTarget.value)}
                       placeholder="example@example.com"/>
            </Field>

            <Field style={{width: 400}} label="Password">
                <Input type="password"
                       value={password}
                       onChange={(val) => setPassword(val.currentTarget.value)}
                       placeholder="********"/>
            </Field>

            <Button loading={loading} onClick={handleSubmit}>Sign Up</Button>
        </Flex>
    );
}

export default SignUp;