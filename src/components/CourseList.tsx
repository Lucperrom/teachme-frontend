import { Box, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard.tsx";

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

const CourseList: React.FC<CourseListProps> = ({
  category,
  onDelete,
  onUpdate,
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      }
    };

    fetchCourses();
  }, [category]);

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading courses...</Text>
      </Box>
    );
  }
  return (
    <SimpleGrid columns={[1, 2, 3]} gap={10} m={4} mt={8}>
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          {...course}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </SimpleGrid>
  );
};

export default CourseList;
