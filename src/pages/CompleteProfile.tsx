import {Flex, Heading, Input, Textarea} from "@chakra-ui/react";
import {Field} from "../components/ui/field.tsx";
import {Button} from "../components/ui/button.tsx";
import {useState} from "react";
import {NativeSelectField, NativeSelectRoot} from "../components/ui/native-select.tsx";
import client from "../services/axios.ts";
import {useAuth} from "../services/auth/AuthContext.tsx";
import {AppRoute} from "../constants/routes.ts";
import {AxiosError} from "axios";
import {countries, languages} from "countries-list";

type ErrorType = { [key: string]: string };

const CompleteProfile = () => {

    const {user} = useAuth();

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [country, setCountry] = useState("");
    const [language, setLanguage] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [bio, setBio] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<ErrorType>({});

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
                plan: user?.role === "ADMIN" ? "GOLD" : "BASIC" // for now :)
            });
            window.location.href = AppRoute.HOME;
        } catch (err) {
            const error = err as AxiosError;
            if (error.response?.data) {
                setErrors(error.response.data as ErrorType);
            }
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Flex alignItems="center" justifyContent="center" direction="column" gap={5}>

            <Heading>Complete Profile</Heading>

            <Field invalid={!!errors.name} errorText={errors.name} style={{width: 400}} label="Name">
                <Input type="text"
                       value={name}
                       onChange={(val) =>
                           setName(val.currentTarget.value)
                       }
                       placeholder="Max"/>
            </Field>

            <Field invalid={!!errors.surname} errorText={errors.surname} style={{width: 400}} label="Surname">
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

            <Field invalid={!!errors.phoneNumber} errorText={errors.phoneNumber} style={{width: 400}} label="Number">
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

            <Field invalid={!!errors.language} errorText={errors.language} style={{width: 400}} label="Language">
                <NativeSelectRoot size="md">
                    <NativeSelectField
                        value={language}
                        onChange={(val) => setLanguage(val.currentTarget.value)}
                        placeholder="Select option">
                        {
                            Object.entries(languages).map(lang => {
                                return (
                                    <option key={lang[0]} value={lang[1].name}>{lang[1].native}</option>
                                );
                            })
                        }
                    </NativeSelectField>
                </NativeSelectRoot>
            </Field>

            <Field style={{width: 400}} label="Country">
                <NativeSelectRoot size="md">
                    <NativeSelectField
                        value={country}
                        onChange={(e) => setCountry(e.currentTarget.value)}
                        placeholder="Select option">
                        {
                            Object.entries(countries).map(count => {
                                return (
                                    <option key={count[0]} value={count[0]}>{count[1].native}</option>
                                );
                            })
                        }
                    </NativeSelectField>
                </NativeSelectRoot>
            </Field>

            <Button loading={loading} onClick={handleComplete}>Complete Profile</Button>
        </Flex>
    );
}

export default CompleteProfile;