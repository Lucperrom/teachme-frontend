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

interface CourseCardProps {
    id: number;
    name: string;
    description: string;
    category: string;
    duration: string;
    level: string;
    rating: number;
    onDelete: (id: number) => void;
    onUpdate: (id: number, updatedCourse: unknown) => void;
}

const CourseCard: FC<CourseCardProps> = ({
                                             id,
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

    const {isAdmin, student, reloadStudent} = useAuth();

    const handleDelete = () => {
        onDelete(id);
    };

    const handleUpdate = () => {
        setUpdateDialogOpen(true);
    };

    const handleCourseUpdated = (updatedCourse: unknown) => {
        onUpdate(id, updatedCourse);
        setUpdateDialogOpen(false);
    };

    const handleStartCourse = async () => {
        setIsLoading(true);
        try {
            await client.post(`/api/v1/students/me/courses/${id}/enroll`);
            toaster.create({
                title: "Successfully enrolled in course!",
                type: "success",
            });
            await reloadStudent();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toaster.create({
                title: "Unexpected error!",
                type: "error",
            });
        } finally {
            setIsLoading(false);
        }
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
                onClick={() => navigate(`${AppRoute.COURSESLIST}/${id}`)}
            >
                <Card.Body>
                    {
                        isAdmin() &&
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
                        </MenuRoot>
                    }
                    <Card.Title mb="2"> {name}</Card.Title>
                    <Card.Description mb={4}> {description} </Card.Description>
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
                                <Button ml="auto">Continue</Button>)
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