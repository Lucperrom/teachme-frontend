import { useState } from 'react';
import { Card, Badge, HStack, Flex, Box, IconButton } from '@chakra-ui/react';
import LinkButton from './LinkButton';
import { IoEnterOutline } from "react-icons/io5";
import {Trash2, SquarePen} from 'lucide-react';
import { FaStar } from "react-icons/fa";
import UpdateCourseDialog from './UpdateCourseDialog';

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

const CourseCard: React.FC<CourseCardProps> = ({ id, name, description, category, duration, level, rating, onDelete,onUpdate }) => {
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

  return (
    <>
        <Card.Root
        key={id}
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        p={4}
        mb={4}
        boxShadow="md"
        _hover={{ boxShadow: 'lg', transform: 'scale(1.02)' }}
        transition="all 0.2s"
        border="1px solid" 
        borderTop="8px solid"
        borderColor="teal.300"
        >
            <Card.Body >
            <Card.Title mb="2"> {name}</Card.Title>
                <Card.Description mb={4}> {description} </Card.Description>
                <HStack align="center" gap={4} flexWrap="wrap">
                   <Badge colorScheme="teal">{category}</Badge>
                    <Badge colorScheme="blue">{duration}</Badge>
                    <Badge colorScheme="purple">{level}</Badge>
                    
                </HStack>
            </Card.Body>
            <Card.Footer>
            <Flex justify="space-between" align="center" width="100%" flexDirection={{ base: 'column', md: 'row' }}>
            <Box>
            <HStack gap={4} mb={{ base: 4, lg: 4 }} flexWrap="wrap">
              <LinkButton colorScheme="teal" variant="solid" to={`/courses/${id}`}>
                Enter <IoEnterOutline />
              </LinkButton>
              <IconButton aria-label="Delete course" onClick={handleDelete} colorScheme="red">
                <Trash2 />
              </IconButton>
              <IconButton aria-label="Update course" onClick={handleUpdate}>
                <SquarePen />
              </IconButton>
            </HStack>
            <HStack mt={4} gap={4} mb={{ base: 4, md: 0 }} flexWrap="wrap">
            <LinkButton to={`/courses/${id}/ratings`} fontSize="sm" color="teal.500">
              View all ratings
            </LinkButton>
            <Badge fontSize="2xl" fontWeight="bold">
              Rating: {rating || 0} <FaStar color="gold" />
            </Badge>
            </HStack>
          </Box>
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