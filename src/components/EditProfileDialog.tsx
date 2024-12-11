import {
    DialogActionTrigger,
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    DialogTrigger
} from "./ui/dialog.tsx";
import {Button} from "./ui/button.tsx";
import {FunctionComponent, ReactNode, useState} from "react";
import {Field} from "./ui/field.tsx";
import {Flex, Input, Textarea} from "@chakra-ui/react";
import {NativeSelectField, NativeSelectRoot} from "./ui/native-select.tsx";
import client from "../services/axios.ts";
import {StudentDto} from "../types/StudentDto.ts";
import {toaster} from "./ui/toaster.tsx";
import {UpdateStudentDto} from "../types/UpdateStudentDto.ts";
import {AxiosError} from "axios";
import {countries, languages} from "countries-list";

interface EditProfileDialogProps {
    children: ReactNode;
    student: StudentDto;
    onUpdate: (updateStudentDto: UpdateStudentDto) => void;
}

type ErrorType = { [key: string]: string };

const EditProfileDialog: FunctionComponent<EditProfileDialogProps> = ({children, student, onUpdate}) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [name, setName] = useState(student.contactInformation.name);
    const [surname, setSurname] = useState(student.contactInformation.surname);
    const [country, setCountry] = useState(student.contactInformation.country);
    const [language, setLanguage] = useState(student.profileInformation.language);
    const [phoneNumber, setPhoneNumber] = useState(student.contactInformation.phoneNumber);
    const [bio, setBio] = useState(student.profileInformation.bio);
    const [errors, setErrors] = useState<ErrorType>({});

    const handleComplete = async () => {
        try {
            setLoading(true);
            const updateStudentDto = {
                name,
                surname,
                country,
                language,
                phoneNumber,
                bio,
            };

            await client.put('/api/v1/students/me', updateStudentDto);

            onUpdate(updateStudentDto);

            toaster.create({
                title: "Profile successfully updated!",
                type: "success",
            });

            setErrors({});
            setOpen(false);
        } catch (err: unknown) {
            const error = err as AxiosError;
            if (error.response?.data) {
                setErrors(error.response.data as ErrorType);
            }
            toaster.create({
                title: "Profile could not be updated!",
                type: "error",
            });
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)} placement="center">
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <DialogBody>
                    <Flex alignItems="center" justifyContent="center" direction="column" gap={5}>
                        <Field invalid={!!errors.name} errorText={errors.name} style={{width: 400}} label="Name">
                            <Input type="text"
                                   value={name}
                                   onChange={(val) => setName(val.currentTarget.value)}
                                   placeholder="Max"/>
                        </Field>

                        <Field invalid={!!errors.surname} errorText={errors.surname} style={{width: 400}}
                               label="Surname">
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

                        <Field invalid={!!errors.phoneNumber} errorText={errors.phoneNumber} style={{width: 400}}
                               label="Number">
                            <Input type="number"
                                   value={phoneNumber}
                                   onChange={(val) => setPhoneNumber(val.currentTarget.value)}
                                   placeholder="0123123123123"/>
                        </Field>

                        <Field invalid={!!errors.language} errorText={errors.language} style={{width: 400}}
                               label="Language">
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
                    </Flex>
                </DialogBody>
                <DialogFooter>
                    <DialogActionTrigger asChild>
                        <Button disabled={loading} variant="outline">Cancel</Button>
                    </DialogActionTrigger>

                    <Button loading={loading} onClick={handleComplete}>Save</Button>
                </DialogFooter>
                <DialogCloseTrigger/>
            </DialogContent>
        </DialogRoot>
    );
}

export default EditProfileDialog;