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
    const [myCompletedCourses, setMyCompletedCourses] = useState<CourseDetails[]>([]);
    const [isMyCoursesLoading, setIsMyCoursesLoading] = useState<boolean>(false);
    const [isMyCompletedCoursesLoading, setIsMyCompletedCoursesLoading] = useState<boolean>(false);

    const {isAdmin, student} = useAuth();

    useEffect(() => {
        setIsMyCoursesLoading(true);
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
                    setIsMyCoursesLoading(false);
                }, 500)
        });
    }, [student]);

    useEffect(() => {
        setIsMyCompletedCoursesLoading(true);
        client.get<CourseDetails[]>(`/api/v1/students/me/completed-courses`)
            .then(result => {
                setMyCompletedCourses(result.data)
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
                    setIsMyCompletedCoursesLoading(false);
                }, 500)
        });
    }, [student]);

    return (
        <Flex direction="column" padding={5}>
            {
                isAdmin() ? <Heading>Admin</Heading> :
                    <Box>
                        <Heading>My courses</Heading>

                        {
                            isMyCoursesLoading ?
                                <SimpleGrid columns={[1, 2, 3]} gap={5} m={4} mt={8}>
                                    {[1, 2, 3].map((_, idx) => {
                                            return <Skeleton borderRadius="lg" key={idx} width="full" height="270px"/>
                                        }
                                    )}
                                </SimpleGrid> :
                                <SimpleGrid columns={[1, 2, 3]} gap={5} m={4} mt={8}>
                                    {myCourses.map((course) => {
                                            if (!student?.completedCourses.includes(String(course.id))) {
                                                return (<CourseCard
                                                    rating={0} key={course.id}
                                                    {...course}
                                                />);
                                            }
                                        }
                                    )}
                                </SimpleGrid>
                        }

                        {
                            myCompletedCourses.length > 0 && <>
                                <Heading>My completed courses</Heading>
                                {
                                    isMyCompletedCoursesLoading ?
                                        <SimpleGrid columns={[1, 2, 3]} gap={5} m={4} mt={8}>
                                            {[1, 2, 3].map((_, idx) => {
                                                    return <Skeleton borderRadius="lg" key={idx} width="full" height="270px"/>
                                                }
                                            )}
                                        </SimpleGrid> :
                                        <SimpleGrid columns={[1, 2, 3]} gap={5} m={4} mt={8}>
                                            {myCompletedCourses.map((course) => {
                                                    return (<CourseCard
                                                        rating={0} key={course.id}
                                                        {...course}                        />);
                                                }
                                            )}
                                        </SimpleGrid>
                                }
                            </>
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
