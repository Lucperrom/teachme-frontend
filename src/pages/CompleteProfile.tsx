import {Flex, Heading, Input, Textarea} from "@chakra-ui/react";
import {Field} from "../components/ui/field.tsx";
import {Button} from "../components/ui/button.tsx";
import {useState} from "react";
import {NativeSelectField, NativeSelectRoot} from "../components/ui/native-select.tsx";
import client from "../services/axios.ts";
import {useAuth} from "../services/auth/AuthContext.tsx";
import {AppRoute} from "../constants/routes.ts";

const languages = [
    {value: "de", label: "German"},
    {value: "en", label: "English (UK)"},
    {value: "us", label: "English (US)"},
    {value: "es", label: "Spanish"},
]

const countries = [
    {value: "de", label: "Germany"},
    {value: "en", label: "United Kingdom"},
    {value: "us", label: "USA"},
    {value: "es", label: "Spain"},
]

const CompleteProfile = () => {
    const {user} = useAuth();

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [country, setCountry] = useState("");
    const [language, setLanguage] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [bio, setBio] = useState("");
    const [loading, setLoading] = useState(false);

    const handleComplete = async () => {
        try {
            setLoading(true);
            await client.post('/api/v1/students', {
                name,
                surname,
                country,
                email: user!.email,
                userId: user!.id,
                language,
                phoneNumber,
                bio,
                plan: "BASIC" // for now :)
            });
            window.location.href = AppRoute.HOME;
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Flex alignItems="center" justifyContent="center" direction="column" gap={5}>

            <Heading>Complete Profile</Heading>

            <Field style={{width: 400}} label="Name">
                <Input type="text"
                       value={name}
                       onChange={(val) => setName(val.currentTarget.value)}
                       placeholder="Max"/>
            </Field>

            <Field style={{width: 400}} label="Surname">
                <Input type="text"
                       value={surname}
                       onChange={(val) => setSurname(val.currentTarget.value)}
                       placeholder="Mustermann"/>
            </Field>

            <Field style={{width: 400}} label="Bio">
                <Textarea
                    value={bio}
                    onChange={(val) => setBio(val.currentTarget.value)}
                    placeholder="I'm a ..."
                />
            </Field>

            <Field style={{width: 400}} label="Number">
                <Input type="number"
                       value={phoneNumber}
                       onChange={(val) => setPhoneNumber(val.currentTarget.value)}
                       placeholder="0123123123123"/>
            </Field>

            <Field disabled style={{width: 400}} label="Email">
                <Input type="email"
                       value={user!.email}
                />
            </Field>

            <Field style={{width: 400}} label="Language">
                <NativeSelectRoot size="md">
                    <NativeSelectField
                        value={language}
                        onChange={(val) => setLanguage(val.currentTarget.value)}
                        placeholder="Select option" items={languages}/>
                </NativeSelectRoot>
            </Field>

            <Field style={{width: 400}} label="Country">
                <NativeSelectRoot size="md">
                    <NativeSelectField
                        value={country}
                        onChange={(e) => setCountry(e.currentTarget.value)}
                        placeholder="Select option" items={countries}/>
                </NativeSelectRoot>
            </Field>

            <Button loading={loading} onClick={handleComplete}>Complete Profile</Button>
        </Flex>
    );
}

export default CompleteProfile;