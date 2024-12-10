import {Box, Card, Flex, Heading, Separator, Text} from "@chakra-ui/react";
import {Avatar} from "../components/ui/avatar.tsx";
import {IoMdTrophy} from "react-icons/io";
import {FaPhone} from "react-icons/fa";
import {IoMail} from "react-icons/io5";
import {useEffect, useState} from "react";
import client from "../services/axios.ts";
import {StudentDto, SubscriptionPlan} from "../types/StudentDto.ts";
import {BiSolidPencil} from "react-icons/bi";
import {Button} from "../components/ui/button.tsx";
import {FileUploadRoot, FileUploadTrigger} from "../components/ui/file-upload.tsx";
import {toaster} from "../components/ui/toaster.tsx";

const Profile = () => {

    const [student, setStudent] = useState<StudentDto | null>(null);

    useEffect(() => {
        client.get('/api/v1/students/me').then(resp =>
            setStudent(resp.data as StudentDto)
        );
    }, []);

    const getFullName = (student: StudentDto) => {
        return `${student?.contactInformation.name} ${student?.contactInformation.surname}`;
    }

    const getBadgeColor = (plan: SubscriptionPlan) => {
        switch (plan) {
            case SubscriptionPlan.BASIC:
                return "#CD7F32";
            case SubscriptionPlan.GOLD:
                return "gold";
            case SubscriptionPlan.PLATINUM:
                return "silver";
        }
    }

    const uploadProfilePicture = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            await client.post(
                `/api/v1/students/me/profile-picture/upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            toaster.create({
                title: "File successfully updated!",
                type: "success",
            });
        } catch (error) {
            toaster.create({
                title: "File could not be uploaded!",
                type: "error",
            });
            console.error("Error uploading profile picture:", error);
        }
    };

    return (
        <>
            {
                student &&
                <Flex direction="row" padding={10}>
                    <Card.Root width="100%" rounded="xl" overflow="hidden">
                        <Card.Body gap="2" padding={0} rounded="xl">
                            <Box width="100%"
                                 height={200}
                                 bgAttachment="fixed"
                                 position="relative"
                                 bg="red.200"
                                 marginBottom={50}>
                                <Box position="absolute" top={3} right={3}>
                                    <Button rounded="full">
                                        <BiSolidPencil/>
                                    </Button>
                                </Box>
                                <Box position="absolute" cursor="pointer" rounded="full" padding={1}
                                     backgroundColor="white" left="4%"
                                     bottom={-50}>
                                    <FileUploadRoot
                                        onFileAccept={async (details) => {
                                            const file = details.files[0];
                                            if (file) {
                                                await uploadProfilePicture(file);
                                            }
                                        }}
                                        accept={["image/*"]}>
                                        <FileUploadTrigger asChild>
                                            <Avatar
                                                src={student.profileInformation.profilePictureUrl ?
                                                    student.profileInformation.profilePictureUrl.replace("blob-storage", "localhost") :
                                                    ""}
                                                name={getFullName(student)}
                                                width={120}
                                                height={120}
                                                shape="full"
                                            />
                                        </FileUploadTrigger>
                                    </FileUploadRoot>
                                </Box>
                            </Box>
                            <Flex direction="column"
                                  gap={3}
                                  padding="0 4% 4% 4%"
                                  position="relative"
                                  justifyContent="space-between">
                                <Flex justifyContent="space-between" gap={2}>
                                    <Flex direction="column" gap={2}>
                                        <Heading size="2xl">{getFullName(student)}</Heading>
                                        <Flex color="gray.500" gap={2} alignItems="center">
                                            <Text display="flex" alignItems="center" gap={2}>
                                                <IoMail/> {student.contactInformation.email}
                                            </Text>
                                            <Separator orientation="vertical" height="4" size="md"/>
                                            <Text display="flex" alignItems="center" gap={2}>
                                                <FaPhone/> {student.contactInformation.phoneNumber}
                                            </Text>
                                        </Flex>
                                        <Text color="gray.500">
                                            {student.contactInformation.country}, {student.profileInformation.language}
                                        </Text>
                                    </Flex>
                                    <Flex gap={2}>
                                        <IoMdTrophy size={25} color={getBadgeColor(student.profileInformation.plan)}/>
                                        <Text fontWeight="bold">{student.profileInformation.plan}</Text>
                                    </Flex>
                                </Flex>
                                {
                                    student.profileInformation.bio !== null &&
                                    <Text color="gray.500">{student.profileInformation.bio}</Text>
                                }
                            </Flex>
                        </Card.Body>
                    </Card.Root>
                </Flex>
            }
        </>
    );
}

export default Profile;