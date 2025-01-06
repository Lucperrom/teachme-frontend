import {Box, Flex, Heading, SimpleGrid, Text} from "@chakra-ui/react";
import LinkButton from "../components/LinkButton";
import {useEffect, useState} from "react";
import client from "../services/axios.ts";
import {CourseDetails} from "../types/CourseDetails.ts";
import CourseCard from "../components/CourseCard.tsx";
import {toaster} from "../components/ui/toaster.tsx";
import {Skeleton} from "../components/ui/skeleton.tsx";
import {useAuth} from "../services/auth/AuthContext.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../services/redux/store.ts";
import ConfettiExplosion, {ConfettiProps} from "react-confetti-explosion";

const largeProps: ConfettiProps = {
    force: 0.8,
    duration: 3000,
    particleCount: 300,
    width: 1600,
    colors: ['#041E43', '#1471BF', '#5BB4DC', '#FC027B', '#66D805'],
};

const Home = () => {

    const [myCourses, setMyCourses] = useState<CourseDetails[]>([]);
    const [myCompletedCourses, setMyCompletedCourses] = useState<CourseDetails[]>([]);
    const [isMyCoursesLoading, setIsMyCoursesLoading] = useState<boolean>(false);
    const [isMyCompletedCoursesLoading, setIsMyCompletedCoursesLoading] = useState<boolean>(false);

    const {isAdmin, student} = useAuth();

    const {confetti} = useSelector((state: RootState) => state.confetti);

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
                confetti &&
                <Box position="absolute" right="50%" bottom="50%">
                    <ConfettiExplosion {...largeProps} />
                </Box>
            }
            {
                isAdmin() ? <Heading>Admin</Heading> :
                    <Box>
                        <Flex justifyContent="space-between" alignItems="center" gap={4}>
                            <Heading>My courses</Heading>
                            <LinkButton width="min-content" colorScheme="teal" variant="solid" to={`/courses`}>
                                Go To Course Catalog
                            </LinkButton>
                        </Flex>
                        {
                            isMyCoursesLoading ?
                                <SimpleGrid columns={[1, 2, 3]} gap={5} m={4} mt={8}>
                                    {[1, 2, 3].map((_, idx) => {
                                            return <Skeleton borderRadius="lg" key={idx} width="full" height="270px"/>
                                        }
                                    )}
                                </SimpleGrid> :
                                (
                                    myCourses.filter(course => !student?.completedCourses.includes(String(course.id))).length > 0 ?
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
                                        </SimpleGrid> :
                                        <Flex direction="column" align="center" justify="center" padding={10}
                                              textAlign="center">
                                            <Text fontSize="xl" fontWeight="bold" color="gray.700" mb={4}>
                                                No pending courses!
                                            </Text>
                                            <Text fontSize="lg" color="gray.500" mb={6}>
                                                Checkout the course Catalog for Courses!
                                            </Text>
                                            <LinkButton colorScheme="teal" variant="solid" to={`/courses`}>
                                                Go To Course Catalog
                                            </LinkButton>
                                        </Flex>
                                )
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
        </Flex>
    );
}

export default Home;
