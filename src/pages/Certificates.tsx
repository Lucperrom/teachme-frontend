import {Box, Button, Flex, Grid, Heading, Text,} from "@chakra-ui/react";
import client from "../services/axios.ts";
import {useEffect, useState} from "react";
import {useAuth} from "../services/auth/AuthContext.tsx";
import {Certificate} from "../types/Certificate.ts";
import {AppRoute} from "../constants/routes.ts";
import {useNavigate} from "react-router-dom";

const Certificates = () => {

    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const {student} = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        if (!student) return;

        client
            .get<Certificate[]>(`/api/v1/certificates/${student?.id}`)
            .then((response) => setCertificates(response.data));
    }, [student]);

    return (
        <Flex direction="column" padding={5}>
            <Heading size="lg" mb={6}>
                My Certificates
            </Heading>
            {certificates.length > 0 ? (
                <Grid
                    templateColumns={{base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)"}}
                    gap={6}
                >
                    {certificates.map((certificate) => (
                        <Box
                            key={certificate.courseId}
                            rounded="lg"
                            p={5}
                            borderWidth={1}
                            overflow="hidden"
                        >
                            <Heading size="md" mb={2}>
                                {certificate.courseName}
                            </Heading>
                            <Text mb={4} fontSize="sm" color="gray.500">
                                Completed on: {new Date(certificate.completionDate).toLocaleDateString()}
                            </Text>
                            <Flex justifyContent="space-between" alignItems="center">
                                <Button
                                    size="sm"
                                    onClick={() => {
                                    }}>
                                    Download
                                </Button>
                                <Text fontSize="sm" color="gray.400">
                                    #{certificate.id}
                                </Text>
                            </Flex>
                        </Box>
                    ))}
                </Grid>
            ) : (
                <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    rounded="lg"
                    p={10}
                >
                    <Text fontSize="lg" color="gray.500" mb={4}>
                        No certificates yet
                    </Text>
                    <Button onClick={() => navigate(AppRoute.COURSESLIST)} colorScheme="blue" size="sm">
                        Browse Courses
                    </Button>
                </Flex>
            )}
        </Flex>
    );
};

export default Certificates;
