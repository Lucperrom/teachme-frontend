import {useState} from 'react';
import {Badge, Box, Card, Flex, Text} from '@chakra-ui/react';
import UpdateCourseDialog from './UpdateCourseDialog';
import {Link, useNavigate} from "react-router-dom";
import {AppRoute} from "../constants/routes.ts";
import {HiOutlineDotsVertical} from "react-icons/hi";
import {Button} from "./ui/button.tsx";
import {MenuContent, MenuItem, MenuRoot, MenuTrigger} from "./ui/menu.tsx";
import {MdDeleteOutline, MdOutlineEdit} from 'react-icons/md';
import {Rating} from "./ui/rating.tsx";
import {LuHourglass} from "react-icons/lu";
import {TbCategory} from "react-icons/tb";
import {IoBookOutline} from 'react-icons/io5';

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

const CourseCard: React.FC<CourseCardProps> = ({
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

    const navigate = useNavigate();

    return (
        <>
            <Card.Root
                key={id}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                mb={4}
                boxShadow="md"
                _hover={{boxShadow: 'lg', transform: 'scale(1.01)'}}
                transition="all 0.2s"
                cursor="pointer"
                position="relative"
                onClick={() => navigate(`${AppRoute.COURSESLIST}/${id}`)}
            >
                <Card.Body>
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
                    <Link to={`/courses/${id}/ratings`}>
                        <Flex direction="row" alignItems="center" gap={2}>
                            <Flex direction="row" gap={1}>
                                {
                                    rating && <Text fontWeight="bold" fontSize="md">{rating | 0},0</Text>
                                }
                                <Rating colorPalette="orange" value={rating | 0} defaultValue={0}
                                        size="sm"/>
                            </Flex>
                            <Button cursor="pointer" unstyled onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/courses/${id}/ratings`);
                            }}>
                                <Text color="gray" fontSize="sm" _hover={{textDecoration: "underline"}}>View all</Text>
                            </Button>
                        </Flex>
                    </Link>
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