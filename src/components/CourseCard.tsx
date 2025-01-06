import {FC, useState} from 'react';
import {Badge, Box, Card, Flex, Text} from '@chakra-ui/react';
import UpdateCourseDialog from './UpdateCourseDialog';
import {useNavigate} from "react-router-dom";
import {AppRoute} from "../constants/routes.ts";
import {HiOutlineDotsVertical} from "react-icons/hi";
import {Button} from "./ui/button.tsx";
import {MenuContent, MenuItem, MenuRoot, MenuTrigger} from "./ui/menu.tsx";
import {MdDeleteOutline, MdOutlineEdit} from 'react-icons/md';
import {Rating} from "./ui/rating.tsx";
import {LuHourglass} from "react-icons/lu";
import {TbCategory} from "react-icons/tb";
import {IoBookOutline} from 'react-icons/io5';
import {useAuth} from "../services/auth/AuthContext.tsx";
import client from "../services/axios.ts";
import {toaster} from "./ui/toaster.tsx";
import {FaRegCheckCircle} from 'react-icons/fa';
import {useAppDispatch} from "../services/redux/store.ts";
import {toggleConfetti} from "../services/redux/slices/confettiSlice.ts";
import {LiaCertificateSolid} from "react-icons/lia";
import {Tooltip} from "./ui/tooltip.tsx";

interface CourseCardProps {
    id: number;
    certified?: boolean;
    name: string;
    description: string;
    category: string;
    duration: string;
    level: string;
    rating: number;
    onDelete?: (id: number) => void;
    onUpdate?: (id: number, updatedCourse: unknown) => void;
}

const CourseCard: FC<CourseCardProps> = ({
                                             id,
                                             certified,
                                             name,
                                             description,
                                             category,
                                             duration,
                                             level,
                                             rating,
                                             onDelete,
                                             onUpdate
                                         }) => {
    const [isUpdateDialogOpen, setUpdateDialogOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const dispatch = useAppDispatch();

    const {isAdmin, student, reloadStudent} = useAuth();

    const handleDelete = () => {
        if (onDelete) {
            onDelete(id);
        }
    };

    const handleUpdate = () => {
        setUpdateDialogOpen(true);
    };

    const handleCourseUpdated = (updatedCourse: unknown) => {
        if (onUpdate) {
            onUpdate(id, updatedCourse);
        }
        setUpdateDialogOpen(false);
    };

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

    const handleStartCourse = async () => {
        setIsLoading(true);
        try {
            await client.post(`/api/v1/students/me/courses/${id}/enroll`);
            toaster.create({
                title: "Successfully enrolled in course!",
                type: "success",
            });
            await reloadStudent();
            navigate(`${AppRoute.COURSESLIST}/${id}`);
        } catch (error) {
            console.error(error);
            toaster.create({
                title: error.response.data.message,
                type: "error",
            });
        } finally {
            setIsLoading(false);
        }
    }

    const truncateDescription = (text: string) => {
        const MAX = 400;
        const points = text.length > MAX ? " ..." : "";
        return text.slice(0, Math.min(text.length, MAX)) + points;
    }

    const navigate = useNavigate();

    return (
        <>
            <Card.Root
                key={id}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                width="full"
                minWidth="320px"
                mb={4}
                boxShadow="md"
                _hover={{boxShadow: 'lg', transform: 'scale(1.01)'}}
                transition="all 0.2s"
                cursor="pointer"
                position="relative"
                onClick={() => {
                    if (student?.enrolledCourses.includes(String(id))) {
                        navigate(`${AppRoute.COURSESLIST}/${id}`);
                    }
                }}
            >
                <Card.Body>
                    {
                        isAdmin() ?
                            <MenuRoot positioning={{placement: "bottom-start"}}>
                                <MenuTrigger asChild>
                                    <Button _hover={{color: "gray"}}
                                            style={{display: "flex", alignItems: "center", justifyContent: "center"}}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                            }}
                                            unstyled height={10}
                                            width={10} cursor="pointer" position="absolute" right={3} top={3}>
                                        <HiOutlineDotsVertical size={22}/>
                                    </Button>
                                </MenuTrigger>
                                <MenuContent>
                                    <MenuItem onClick={(e) => {
                                        e.stopPropagation();
                                        handleUpdate();
                                    }}
                                              cursor="pointer"
                                              value="edit" valueText="edit">
                                        <MdOutlineEdit/>
                                        <Box flex="1">Edit</Box>
                                    </MenuItem>
                                    <MenuItem onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete();
                                    }} value="delete"
                                              cursor="pointer"
                                              color="red.500"
                                              valueText="delete">
                                        <MdDeleteOutline/>
                                        <Box flex="1">Delete</Box>
                                    </MenuItem>
                                </MenuContent>
                            </MenuRoot> :
                            (
                                <>
                                    {
                                        student?.enrolledCourses.includes(String(id)) &&
                                        !student?.completedCourses.includes(String(id)) &&
                                        <MenuRoot positioning={{placement: "bottom-start"}}>
                                            <MenuTrigger asChild>
                                                <Button _hover={{color: "gray"}}
                                                        style={{
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
                                        </MenuRoot>
                                    }
                                </>
                            )
                    }
                    <Card.Title mb="2">
                        <Flex alignItems="center" justifyContent="space-between">
                            {name}
                            {
                                certified &&
                                <Flex _hover={{color: "gray"}}>
                                    <Tooltip content={"Certificate issued"}>
                                        <LiaCertificateSolid cursor="pointer" size={22}/>
                                    </Tooltip>
                                </Flex>
                            }
                        </Flex>
                    </Card.Title>
                    <Card.Description mb={4}>{truncateDescription(description)}</Card.Description>
                    <Flex direction="row" gap={4} flexWrap="wrap">
                        <Badge colorPalette="teal">
                            <TbCategory/>
                            {category}
                        </Badge>
                        <Badge colorPalette="blue">
                            <LuHourglass/>
                            {duration}
                        </Badge>
                        <Badge colorPalette="purple">
                            <IoBookOutline/>
                            {level}
                        </Badge>
                    </Flex>
                </Card.Body>
                <Card.Footer>
                    <Flex width="full" direction="row" alignItems="center" gap={2}>
                        <Button gap={2} display="flex" direction="row" alignItems="center" cursor="pointer" unstyled
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/courses/${id}/ratings`);
                                }}>
                            <Flex direction="row" gap={1}>
                                {
                                    rating && <Text fontWeight="bold" fontSize="md">{rating | 0},0</Text>
                                }
                                <Rating colorPalette="orange" value={rating | 0} defaultValue={0}
                                        size="sm"/>
                            </Flex>
                            <Text textWrap="nowrap" color="gray" fontSize="sm" _hover={{textDecoration: "underline"}}>View
                                all</Text>
                        </Button>
                        {
                            !isAdmin() &&
                            (!student?.enrolledCourses.includes(String(id)) ?
                                <Button
                                    loading={isLoading}
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        await handleStartCourse();
                                    }}
                                    ml="auto">Start Course</Button> :
                                <>
                                    {
                                        !student?.completedCourses.includes(String(id)) &&
                                        <Button ml="auto">Continue</Button>
                                    }
                                </>)
                        }
                    </Flex>
                </Card.Footer>
            </Card.Root>
            {isUpdateDialogOpen && (
                <UpdateCourseDialog
                    id={id.toString()}
                    name={name}
                    description={description}
                    category={category}
                    duration={duration}
                    level={level}
                    onClose={() => setUpdateDialogOpen(false)}
                    onCourseUpdated={handleCourseUpdated}
                />
            )}
        </>
    );
};

export default CourseCard;