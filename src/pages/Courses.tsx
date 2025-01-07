import {Box, Text, Flex, Heading} from "@chakra-ui/react";
import {IconButton} from "@chakra-ui/react/button";
import {Filter, SquarePlus} from "lucide-react";
import {useCallback, useEffect, useState} from "react";
import CreateCourseDialog from "../components/CreateCourseDialog.tsx";
import SearchCourseDialog from "../components/SearchCourseDialog.tsx";
import CourseList from "../components/CourseList.tsx";
import {toaster} from "../components/ui/toaster.tsx";
import {useAuth} from "../services/auth/AuthContext.tsx";
import client from "../services/axios.ts";

export interface CourseDto {
    id: number;
    name: string;
    description: string;
    category: string;
    duration: string;
    level: string;
    rating: number;
}

const Courses = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [isCreateDialogOpen, setCreateDialogOpen] = useState<boolean>(false);

    const [courses, setCourses] = useState<CourseDto[]>([]);
    const [loading, setLoading] = useState(true);

    const {isAdmin} = useAuth();

    const fetchCourses = useCallback(async () => {
        try {
            const response = await client.get<CourseDto[]>(`/api/v1/courses${selectedCategory ? `/filter?category=${selectedCategory}` : ''}`);
            setCourses(response.data);
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setTimeout(
                () => {
                    setLoading(false);
                }, 500)
        }
    }, [selectedCategory]);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses, selectedCategory])

    const handleSearch = (category: string) => {
        setSelectedCategory(category);
    };

    const handleCreate = () => {
        setCreateDialogOpen(true);
    };

    const handleCourseCreated = async () => {
        setCreateDialogOpen(false);
        await fetchCourses();
    };

    const handleDeleteCourse = async (id: number) => {
        try {
            await client.delete(`api/v1/courses/${id}`);
            toaster.create({
                title: "Course deleted successfully",
                type: "success",
            });
            await fetchCourses();
        } catch (error) {
            console.error("Error deleting course:", error);
            toaster.create({
                title: "Course not deleted",
                type: "error",
            });
        }
    };

    const handleUpdateCourse = async (id: number, updatedCourse: unknown) => {
        console.log(`Course with id ${id} updated`, updatedCourse);
        await fetchCourses();
    };

    return (
        <Box padding={5}>

            {
                !isAdmin() &&
                <Flex direction="column" alignItems="center" gap={5} justifyContent="center">
                    <Heading fontSize="3xl">All the Skills you need!</Heading>
                    <Text>Teachme offers a wide range of courses on essential skills and in-demand technical topics for professional development.</Text>
                </Flex>
            }

            <Flex
                width="100%"
                alignItems="center"
                justifyContent="space-between"
                borderBottom="1px"
                pl={5}
                pr={5}
                pt={5}
            >
                <Heading>Available courses</Heading>
                <Flex gap={4} alignItems="center">
                    {
                        isAdmin() &&
                        <IconButton aria-label="Add course" onClick={handleCreate}>
                            <SquarePlus/>
                        </IconButton>
                    }
                    <SearchCourseDialog onSearch={handleSearch}>
                        <IconButton aria-label="Filter courses">
                            <Filter/>
                        </IconButton>
                    </SearchCourseDialog>
                </Flex>
            </Flex>
            <CourseList
                onDelete={handleDeleteCourse}
                onUpdate={handleUpdateCourse}
                isLoading={loading}
                courses={courses}
            />
            <CreateCourseDialog
                onCourseCreated={handleCourseCreated}
                isOpen={isCreateDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
            />
        </Box>
    );
};

export default Courses;
