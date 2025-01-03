import {Flex, Heading, Input, Text} from "@chakra-ui/react";
import {Field} from "../components/ui/field.tsx";
import {Button} from "../components/ui/button.tsx";
import {useState} from "react";
import {authService} from "../services/auth/authService.ts";
import {useNavigate} from "react-router-dom";
import {AxiosError} from "axios";


const SignUp = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        if(!email || !password || !confirmPassword){
            setError("All fields are required.");
            setLoading(false);
            return;
        
        }

        const emailRegex= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if(!emailRegex.test(email)){
            setError("Please enter a valid email address.");
            setLoading(false);
            return;
        }

        if(password !== confirmPassword){
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        if(password.length < 6){
            setError("Password must be at least 6 characters.");
            setLoading(false);
            return;
        }

        try{
            const rem = await authService.register({email, password});
            
            if (rem.userId) {
                    navigate("/login");
                }
            }
        catch (err) {
            const error = err as AxiosError;
            if ((error.response?.data as any)[0].defaultMessage == "The email is invalid"){
                setError("The email is invalid");
            }
            else if (error.response?.status == 400){
                setError("The email is already in use. Please try another one.");
            }
            else{
                setError("An unexpected error occurred. Please try again.");
            }
        }    
        finally{
            setLoading(false);
        }
    }

    return (
        <Flex className="auth-SignUp-container" alignItems="center" justifyContent="center" direction="column" gap={5}>

            <Heading>Sing Up!</Heading>

            {error && (
                <Text className="auth-error-container" color="red.500" fontSize="sm" textAlign="center" mb={3}>
                    {error}
                </Text>
            )}
            
            <Field style={{width: 400}} label="Email">
                <Input className= "Email-auth-login"
                        type="email"
                        value={email}
                        onChange={(val) => setEmail(val.currentTarget.value)}
                        placeholder="example@example.com"/>
            </Field>

            <Field style={{width: 400}} label="Password">
                <Input className= "Password-auth-login"
                        type="password"
                        value={password}
                        onChange={(val) => setPassword(val.currentTarget.value)}
                        placeholder="********"/>
            </Field>

            <Field style={{width: 400}} label="Confirm Password">
                <Input className= "Confirm-password-auth-login"
                        type="password"
                        value={confirmPassword}
                        onChange={(val) => setConfirmPassword(val.currentTarget.value)}
                        placeholder="********"/>
            </Field>

            <Button className= "Send-SignUp" loading={loading} onClick={handleSubmit}>Sign Up</Button>
        </Flex>
    );
}

export default SignUp;