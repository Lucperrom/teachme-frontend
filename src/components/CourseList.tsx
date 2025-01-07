import {Flex, SimpleGrid, Text} from "@chakra-ui/react";
import {FC} from "react";
import CourseCard from "../components/CourseCard.tsx";
import {useAuth} from "../services/auth/AuthContext.tsx";
import {Skeleton} from "./ui/skeleton.tsx";
import {CourseDto} from "../pages/Courses.tsx";

interface CourseListProps {
    isLoading?: boolean;
    courses: CourseDto[];
    onDelete: (id: number) => void;
    onUpdate: (id: number, updatedCourse: unknown) => void;
}

const CourseList: FC<CourseListProps> = ({courses, isLoading, onDelete, onUpdate}) => {

    const {student, isAdmin} = useAuth();

    return (
        <>
            {
                isLoading ?
                    <SimpleGrid columns={[1, 2, 3]} gap={5} m={4} mt={8}>
                        {[1, 2, 3].map((_, idx) => {
                                return <Skeleton borderRadius="lg" key={idx} width="full" height="270px"/>
                            }
                        )}
                    </SimpleGrid> :
                    (
                        <>
                            {
                                courses.filter(course => !student?.enrolledCourses.includes(String(course.id))).length > 0 ?
                                    <SimpleGrid columns={[1, 2, 3]} gap={5} m={4} mt={8}>
                                        {courses.map((course) => {
                                                if (!student?.enrolledCourses.includes(String(course.id))) {
                                                    return (<CourseCard
                                                        key={course.id}
                                                        {...course}
                                                        onDelete={onDelete}
                                                        onUpdate={onUpdate}
                                                    />);
                                                }
                                            }
                                        )}
                                    </SimpleGrid> :
                                    <Flex direction="column" align="center" justify="center" padding={10}
                                          textAlign="center">
                                        <Text fontSize="xl" fontWeight="bold" color="gray.700" mb={4}>
                                            {
                                                isAdmin() ? "No Courses Created" : "No New Courses Available"
                                            }
                                        </Text>
                                        <Text fontSize="lg" color="gray.500" mb={6}>
                                            {
                                                isAdmin() ? "Create New Courses" : "We’re working on adding new courses. Check back later!"
                                            }
                                        </Text>
                                    </Flex>
                            }
                        </>

                    )
            }
        </>
    );
};

export default CourseList;
