import {Flex, Heading, Input, Text} from "@chakra-ui/react";
import {Field} from "../components/ui/field.tsx";
import {useState} from "react";
import {Button} from "../components/ui/button.tsx";
import {authService} from "../services/auth/authService.ts";
import {AxiosError} from "axios";

const Login = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);


    const handleSubmit = async() => {
        setLoading(true);
        setError(null);
        
        try{
            await authService.login({email, password})
        }
        catch (err) {
            const error = err as AxiosError;
            if(error.response?.status === 400){
                setError("Invalid email or password.");
            }else{
                setError("An unexpected error occurred. Please try again.");
            }
        }   finally{
                setLoading(false);
            }
    }

    return (
        <Flex alignItems="center" justifyContent="center" direction="column" gap={5}>

            <Heading>Login</Heading>
            
            {error && (
                <Text color="red.500" fontSize="sm" textAlign="center" mb={3}>
                    {error}
                </Text>
            )}

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

            <Button loading={loading} onClick={handleSubmit}>Login</Button>
        </Flex>
    );
}

export default Login;