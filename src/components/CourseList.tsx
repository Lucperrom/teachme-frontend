import {Flex, SimpleGrid, Text} from "@chakra-ui/react";
import {FC, useEffect, useState} from "react";
import CourseCard from "../components/CourseCard.tsx";
import {useAuth} from "../services/auth/AuthContext.tsx";
import {Skeleton} from "./ui/skeleton.tsx";

interface Course {
    id: number;
    name: string;
    description: string;
    category: string;
    duration: string;
    level: string;
    rating: number;
}

interface CourseListProps {
    category?: string;
    onDelete: (id: number) => void;
    onUpdate: (id: number, updatedCourse: unknown) => void;
}

const CourseList: FC<CourseListProps> = ({
                                             category,
                                             onDelete,
                                             onUpdate,
                                         }) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    const {student} = useAuth();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                let response;
                if (category) {
                    response = await fetch(
                        `/api/v1/courses/filter?category=${category}`,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        }
                    );
                } else {
                    response = await fetch(`/api/v1/courses`, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    });
                }
                if (!response.ok) {
                    throw new Error("Failed to fetch courses");
                }
                const data = await response.json();
                setCourses(data);
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setTimeout(
                    () => {
                        setLoading(false);
                    }, 500)
            }
        };

        fetchCourses();
    }, [category]);

    return (
        <>
            {
                loading ?
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
                                            No New Courses Available
                                        </Text>
                                        <Text fontSize="lg" color="gray.500" mb={6}>
                                            We’re working on adding new courses. Check back later!
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
