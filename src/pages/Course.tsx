import {Badge, Box, Flex, Heading, HStack, Spinner, Text, VStack,} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import LinkButton from '../components/LinkButton';
import {MessageSquareMore} from 'lucide-react';
import {FaStar} from "react-icons/fa";
import {PiCertificate} from "react-icons/pi";
import {useParams} from "react-router-dom";

interface Video {
    id: string;
    title: string;
    url: string;
}

export interface Course {
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
    const {id} = useParams<{ id: string }>();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState<boolean>(true);


    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await fetch(`/api/v1/courses/${id}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch course");
                }
                const data = await response.json();
                setCourse(data);
            } catch (error) {
                console.error("Error fetching course:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    if (loading) {
        return (
            <Flex alignItems="center" justifyContent="center" height="100vh">
                <Spinner size="xl"/>
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
            <Flex direction={{base: 'column', md: 'row'}} gap={4}>
                <Box flex="1" p={4} bg="white" boxShadow="md" borderRadius="md">
                    <Heading mb={4} color="teal.600">{course.name}</Heading>
                    <Text mb={4} fontSize="lg" color="gray.700">{course.description}</Text>
                    <VStack align="start" gap={2}>
                        <Badge colorScheme="teal" fontSize="md">{course.category}</Badge>
                        <Badge colorScheme="blue" fontSize="md">{course.duration}</Badge>
                        <Badge colorScheme="purple" fontSize="md">{course.level}</Badge>
                        <Badge color="teal.300" fontSize="2xl" fontWeight="bold">
                            Rating: {course.rating || 0} <FaStar color="gold"/>
                        </Badge>
                    </VStack>
                    <Box mt={6}>
                        <HStack gap={6}>
                            <LinkButton colorScheme="teal" variant="solid" to={`/courses/${id}/ratings`}>
                                Rate <FaStar/>
                            </LinkButton>
                            <LinkButton colorScheme="teal" variant="solid" to={`/forums/${id}`}>
                                Forum <MessageSquareMore/>
                            </LinkButton>
                        </HStack>
                    </Box>
                    <Box mt={6}>
                        <HStack gap={6}>
                            <LinkButton bg="teal.300" color="white" variant="solid" to={`/courses/certificate/${id}`}>
                                Finish course <PiCertificate/>
                            </LinkButton>
                        </HStack>
                    </Box>
                </Box>
                <Box flex="1" p={4} bg="white" boxShadow="md" borderRadius="md" maxHeight="80vh" overflowY="auto">
                    <Text fontSize="lg" fontWeight="bold" mb={2} color="teal.600">
                        List of course videos
                    </Text>
                    <VStack align="start" gap={2} width="100%">
                        {course.additionalResources.map((video) => (
                            <Box key={video.url} width="100%">
                                <Text fontWeight="bold" mb={2}>
                                    {video.title}
                                </Text>
                                <iframe
                                    width="100%"
                                    height="315"
                                    src={`https://www.youtube.com/embed/${video.url}`}
                                    title={video.title}
                                    style={{border: "none"}}
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
