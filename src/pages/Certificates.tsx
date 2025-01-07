import {Button, Flex, Grid, Heading, Text,} from "@chakra-ui/react";
import client from "../services/axios.ts";
import {useEffect, useState} from "react";
import {useAuth} from "../services/auth/AuthContext.tsx";
import {Certificate} from "../types/Certificate.ts";
import {AppRoute} from "../constants/routes.ts";
import {useNavigate} from "react-router-dom";
import CertificateCard from "../components/CertificateCard.tsx";
import {Skeleton} from "../components/ui/skeleton.tsx";

const Certificates = () => {

    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const {student} = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        client
            .get<Certificate[]>(`/api/v1/certificates/${student?.id}`)
            .then((response) => setCertificates(response.data))
            .finally(() => setTimeout(() => setIsLoading(false), 500));
    }, [student]);

    return (
        <Flex direction="column" padding={5}>
            <Heading size="lg" mb={6}>
                My Certificates
            </Heading>
            {certificates.length > 0 ? (
                <>

                    {
                        isLoading ?
                            <Grid
                                templateColumns={{base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)"}}
                                gap={6}
                            >
                                {
                                    [1, 2, 3].map((_, idx) => (
                                        <Skeleton borderRadius="lg" key={`certificate-skeleton-${idx}`} width="full"
                                                  height="px"/>
                                    ))
                                }
                            </Grid> :
                            <Grid
                                templateColumns={{base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)"}}
                                gap={6}
                            >
                                {certificates.map((certificate) => (
                                    <CertificateCard key={certificate.id} certificate={certificate}/>
                                ))}
                            </Grid>
                    }
                </>
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
