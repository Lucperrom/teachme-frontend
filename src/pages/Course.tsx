import {Badge, Box, Card, Collapsible, Flex, Heading, Spinner, Text, useMediaQuery, VStack,} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import LinkButton from '../components/LinkButton';
import {MessageSquareMore} from 'lucide-react';
import {FaBook, FaRegCheckCircle} from "react-icons/fa";
import {useNavigate, useParams} from "react-router-dom";
import client from "../services/axios.ts";
import {TbCategory} from "react-icons/tb";
import {LuHourglass} from "react-icons/lu";
import {IoBookOutline} from "react-icons/io5";
import {MenuContent, MenuItem, MenuRoot, MenuTrigger} from "../components/ui/menu.tsx";
import {Button} from "../components/ui/button.tsx";
import {HiOutlineDotsVertical} from "react-icons/hi";
import {toaster} from "../components/ui/toaster.tsx";
import {toggleConfetti} from "../services/redux/slices/confettiSlice.ts";
import {RootState, useAppDispatch} from "../services/redux/store.ts";
import {useAuth} from "../services/auth/AuthContext.tsx";
import {MdNewReleases} from "react-icons/md";
import {Rating} from "../components/ui/rating.tsx";
import {GoDotFill} from "react-icons/go";
import ConfettiExplosion, {ConfettiProps} from "react-confetti-explosion";
import {useSelector} from "react-redux";
import {AppRoute} from "../constants/routes.ts";
import {Tooltip} from "../components/ui/tooltip.tsx";
import {LiaCertificateSolid} from "react-icons/lia";

const largeProps: ConfettiProps = {
    force: 0.8,
    duration: 3000,
    particleCount: 300,
    width: 1600,
    colors: ['#041E43', '#1471BF', '#5BB4DC', '#FC027B', '#66D805'],
};

interface Video {
    id: string;
    title: string;
    url: string;
    description: string;
}

export interface Course {
    id: number;
    name: string;
    description: string;
    category: string;
    duration: string;
    level: string;
    rating: number;
    creationDate: string;
    additionalResources: Video[];
}

const Course: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const {confetti} = useSelector((state: RootState) => state.confetti);

    const [_, setIsLoading] = useState<boolean>(false);

    const {reloadStudent, student, isAdmin} = useAuth();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [isLargerThan800] = useMediaQuery(['(min-width: 800px)'], {ssr: false});

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await client.get<Course>(`/api/v1/courses/${id}`);
                setCourse(response.data);
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

    const handleCompleteCourse = async () => {
        try {
            await client.post(`/api/v1/students/me/courses/${id}/complete`);
            toaster.create({
                title: "Successfully completed course!",
                type: "success",
            });
            dispatch(toggleConfetti());
            setIsLoading(true);
            await reloadStudent();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_) {
            toaster.create({
                title: "Error completing course!",
                type: "error",
            });
        } finally {
            setTimeout(() => dispatch(toggleConfetti()), 5000);
        }
    }

    return (
        <Flex p={4} position="relative" height={isLargerThan800 ? "90vh" : "full"} direction={{base: 'column', md: 'row'}} gap={4}>
            {
                confetti &&
                <Box position="absolute" right="50%" bottom="50%">
                    <ConfettiExplosion {...largeProps} />
                </Box>
            }
            <Box maxHeight="88vh" overflow="hidden" position="relative" flex="1" p={4} bg="white" boxShadow="md"
                 borderRadius="md">
                {
                    !isAdmin() &&
                    (!student?.completedCourses.includes(String(course.id)) ?
                        <MenuRoot positioning={{placement: "bottom-start"}}>
                            <MenuTrigger asChild>
                                <Button _hover={{color: "gray"}}
                                        style={{
                                            zIndex: 999,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                        unstyled height={10}
                                        width={10} cursor="pointer" position="absolute" right={3}
                                        top={3}>
                                    <HiOutlineDotsVertical size={22}/>
                                </Button>
                            </MenuTrigger>
                            <MenuContent>
                                <MenuItem onClick={async (e) => {
                                    e.stopPropagation();
                                    await handleCompleteCourse();
                                }}
                                          cursor="pointer"
                                          color="green.500"
                                          value="complete"
                                          valueText="complete">
                                    <FaRegCheckCircle/>
                                    <Box flex="1">Complete Course</Box>
                                </MenuItem>
                            </MenuContent>
                        </MenuRoot> :
                        <>
                            {
                                <Button _hover={{color: "gray"}}
                                        style={{
                                            zIndex: 999,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(AppRoute.CERTIFICATES);
                                        }}
                                        unstyled height={10}
                                        width={10} cursor="pointer" position="absolute" right={3}
                                        top={3}>
                                    <Tooltip content={"Certificate issued"}>
                                        <LiaCertificateSolid cursor="pointer" size={22}/>
                                    </Tooltip>
                                </Button>
                            }
                        </>)
                }

                <Flex position="relative" height="full" direction="column" justifyContent="space-between">
                    <Flex direction="column">
                        <Heading fontSize="2xl" mb={4} pr={5}>{course.name}</Heading>
                        <Flex direction="row" gap={4} flexWrap="wrap">
                            <Badge colorPalette="teal">
                                <TbCategory/>
                                {course.category}
                            </Badge>
                            <Badge colorPalette="blue">
                                <LuHourglass/>
                                {course.duration}
                            </Badge>
                            <Badge colorPalette="purple">
                                <IoBookOutline/>
                                {course.level}
                            </Badge>
                        </Flex>
                        <Flex mt={4} gap={1} alignItems="center">
                            <MdNewReleases size={20}/>
                            <Text fontSize="md">
                                Created on {new Date(course.creationDate).toLocaleDateString()}
                            </Text>
                        </Flex>

                        <Flex mt={2} gap={1} alignItems="center" cursor="pointer">
                            <Flex direction="row" gap={1}>
                                <Text fontWeight="bold" fontSize="md">{course.rating | 0},0</Text>
                                <Rating colorPalette="orange" value={course.rating | 0} defaultValue={0}
                                        size="sm"/>
                                <Button unstyled onClick={() => navigate(`/courses/${id}/ratings`)}>
                                    <Text _hover={{textDecoration: "underline", cursor: "pointer"}} fontWeight="md"
                                          color="gray" fontSize="md">add review</Text>
                                </Button>
                            </Flex>
                        </Flex>
                        <Text mt={4} mb={4} fontSize="md" color="gray.700">{course.description}</Text>
                    </Flex>

                    <Box border={1} left={-4} bottom={-5} p={5} mt={6}>
                        <Flex alignItems="center" gap={1} justifyContent="space-between">
                            <Text fontWeight="bold">Want to join the Community?</Text>
                            <LinkButton colorScheme="teal" variant="solid" to={`/forums/${id}`}>
                                Join
                                <MessageSquareMore/>
                            </LinkButton>
                        </Flex>
                    </Box>
                </Flex>
            </Box>
            <Box flex="1" height={isLargerThan800 ? "min-content" : "full"} maxHeight={isLargerThan800 ? "90vh" : "full"} p={4} bg="white" boxShadow="md" borderRadius="md" overflowY="scroll"
                 maxWidth={isLargerThan800 ? "50vw" : "100vw"}>
                <Text fontSize="xl" fontWeight="bold" mb={2}>
                    Lectures
                </Text>
                <Text fontSize="md" color="gray.600" mb={4}>
                    Explore these the lectures to start your journey. Click on any card to start learning!
                </Text>
                <VStack maxWidth="100%" boxSizing="border-box" align="start">
                    {course.additionalResources.map((video) => {
                        return (
                            <Collapsible.Root width="100%" key={video.url}>
                                <Collapsible.Trigger width="100%" paddingY="1">
                                    <Card.Root
                                        borderWidth="1px"
                                        borderRadius="lg"
                                        width="100%"
                                        p={5}
                                        boxShadow="xs"
                                        _hover={{boxShadow: 'lg', transform: 'scale(1.01)'}}
                                        transition="all 0.2s"
                                        display="block"
                                        cursor="pointer"
                                        position="relative"
                                    >
                                        <Flex
                                            flex="1"
                                            width="100%"
                                            fontWeight="bold"
                                            direction="row"
                                            alignItems="center"
                                            gap={1}
                                            overflow="hidden"
                                        >
                                            <FaBook style={{flexShrink: 0}}/>
                                            <GoDotFill style={{flexShrink: 0}} size={10}/>
                                            <Text
                                                dangerouslySetInnerHTML={{
                                                    __html: video.title,
                                                }}
                                                style={{
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    flex: "1",
                                                }}
                                            ></Text>
                                        </Flex>
                                    </Card.Root>
                                </Collapsible.Trigger>
                                <Collapsible.Content>
                                    <Flex p={5} gap={2} borderWidth="1px">
                                        {
                                            <Text textWrap="wrap"
                                                  style={{
                                                      flexGrow: 1,
                                                      maxWidth: "50%",
                                                      overflow: "hidden",
                                                      textOverflow: "ellipsis",
                                                      whiteSpace: "normal",
                                                  }}
                                            >{video.description}</Text>
                                        }
                                        <iframe
                                            width="50%"
                                            src={`https://www.youtube.com/embed/${video.url.replace("https://www.youtube.com/watch?v=", "")}`}
                                            title={video.title}
                                            style={{border: "none"}}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </Flex>
                                </Collapsible.Content>
                            </Collapsible.Root>
                        )
                    })}
                </VStack>
            </Box>
        </Flex>
    );
};

export default Course;
