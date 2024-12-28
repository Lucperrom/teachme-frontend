import { useEffect, useState } from 'react';
import { Box, Flex, Heading, Text, Spinner, VStack, Badge } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import React from 'react';

interface Video {
  id: string;
  title: string;
  url: string;
}

interface Course {
  id: number;
  name: string;
  description: string;
  category: string;
  duration: string;
  level: string;
  rating: number;
  additionalResources: Video[];
}

const Course: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:8081/api/v1/courses/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch course');
        }
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <Flex alignItems="center" justifyContent="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!course) {
    return (
      <Flex alignItems="center" justifyContent="center" height="100vh">
        <Text>Course not found</Text>
      </Flex>
    );
  }

  return (
    <Box p={4}>
      <Flex>
        <Box flex="1" p={4}>
          <Heading mb={4}>{course.name}</Heading>
          <Text mb={4}>{course.description}</Text>
          <VStack align="start" gap={2}>
            <Badge colorScheme="teal">{course.category}</Badge>
            <Badge colorScheme="blue">{course.duration}</Badge>
            <Badge colorScheme="purple">{course.level}</Badge>
            <Text color="teal.300" fontSize="2xl" fontWeight="bold">
              Rating: {course.rating}
            </Text>
          </VStack>
        </Box>
        <Box flex="1" p={4}>
          <Text fontSize="lg" fontWeight="bold" mb={2}>List of course videos</Text>
          <VStack align="start" gap={2} width="100%">
            {course.additionalResources.map(video => (
              <Box key={video.id} width="100%">
                <Text fontWeight="bold" mb={2}>{video.title}</Text>
                <iframe
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${video.url}`}
                  title={video.title}
                  style={{ border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </Box>
            ))}
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default Course;