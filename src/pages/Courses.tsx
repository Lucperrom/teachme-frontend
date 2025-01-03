import { Box, Flex, Heading } from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react/button";
import { Filter, SquarePlus } from "lucide-react";
import { useState } from "react";
import CreateCourseDialog from "../components/CreateCourseDialog.tsx";
import SearchCourseDialog from "../components/SearchCourseDialog.tsx";
import CourseList from "../components/CourseList.tsx";
import { toaster } from "../components/ui/toaster.tsx";

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isCreateDialogOpen, setCreateDialogOpen] = useState<boolean>(false);

  const handleSearch = (category: string) => {
    setSelectedCategory(category);
  };

  const handleCreate = () => {
    setCreateDialogOpen(true);
  };

  const handleCourseCreated = () => {
    setCreateDialogOpen(false);
    window.location.reload();
  };

  const handleDeleteCourse = async (id: number) => {
    try {
      const response = await fetch(`api/v1/courses/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete course");
      }
      toaster.create({
        title: "Course deleted successfully",
        type: "success",
      });
      window.location.reload();
    } catch (error) {
      console.error("Error deleting course:", error);
      toaster.create({
        title: "Course not deleted",
        type: "error",
      });
    }
  };

  const handleUpdateCourse = (id: number, updatedCourse: unknown) => {
    console.log(`Course with id ${id} updated`, updatedCourse);
    window.location.reload();
  };

  return (
    <Box>
      <Flex
        width="100%"
        alignItems="center"
        justifyContent="space-between"
        borderBottom="1px"
        padding={5}
      >
        <Flex alignItems="center" gap={2}>
          <Heading fontSize={35}>Available courses</Heading>
        </Flex>
        <Flex gap={4} alignItems="center">
          <IconButton aria-label="Add course" onClick={handleCreate}>
            <SquarePlus />
          </IconButton>
          <SearchCourseDialog onSearch={handleSearch}>
            <IconButton aria-label="Filter courses">
              <Filter />
            </IconButton>
          </SearchCourseDialog>
        </Flex>
      </Flex>
      <CourseList
        category={selectedCategory}
        onDelete={handleDeleteCourse}
        onUpdate={handleUpdateCourse}
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
