import {Box, Flex, Heading, HStack, SimpleGrid} from "@chakra-ui/react";
import LinkButton from "../components/LinkButton";
import {useEffect, useState} from "react";
import client from "../services/axios.ts";
import {CourseDetails} from "../types/CourseDetails.ts";
import CourseCard from "../components/CourseCard.tsx";
import {toaster} from "../components/ui/toaster.tsx";
import {Skeleton} from "../components/ui/skeleton.tsx";
import {useAuth} from "../services/auth/AuthContext.tsx";

const Home = () => {

    const [myCourses, setMyCourses] = useState<CourseDetails[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {isAdmin} = useAuth();

    useEffect(() => {
        setIsLoading(true);
        client.get<CourseDetails[]>(`/api/v1/students/me/courses`)
            .then(result => {
                setMyCourses(result.data)
            })
            .catch(error => {
                console.log(error);
                toaster.create({
                    title: "Unexpected error",
                    type: "error"
                })
            }).finally(() => {
            setTimeout(
                () => {
                    setIsLoading(false);
                }, 500)
        });
    }, []);

    return (
        <Flex direction="column" padding={5}>
            {
                isAdmin() ? <Heading>Admin</Heading> :
                    <Box>

                        <Heading>My courses</Heading>

                        {
                            isLoading ?
                                <SimpleGrid columns={[1, 2, 3]} gap={5} m={4} mt={8}>
                                    {[1, 2, 3].map((_, idx) => {
                                            return <Skeleton borderRadius="lg" key={idx} width="full" height="270px"/>
                                        }
                                    )}
                                </SimpleGrid> :

                                <SimpleGrid columns={[1, 2, 3]} gap={5} m={4} mt={8}>
                                    {myCourses.map((course) => {
                                            return (<CourseCard
                                                rating={0} key={course.id}
                                                {...course}                        />);
                                        }
                                    )}
                                </SimpleGrid>
                        }
                    </Box>
            }


            <HStack gap={6}>
                <LinkButton colorScheme="teal" variant="solid" to={`/courses`}>
                    Go to course catalog
                </LinkButton>

            </HStack>
        </Flex>
    );
}

export default Home;
