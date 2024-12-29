import { Flex, Input, Text } from "@chakra-ui/react";
import { FunctionComponent, ReactNode, useState } from "react";
import { Button } from "./ui/button";
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { toaster } from "./ui/toaster";

interface SearchCourseProps {
  children: ReactNode;
  onSearch: (category: string) => void;
}

type ErrorType = { [key: string]: string };

const SearchCourseDialog: FunctionComponent<SearchCourseProps> = ({
  children,
  onSearch,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [category, setCategory] = useState<string>("");
  const [errors, setErrors] = useState<ErrorType>({});

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/v1/courses/filter?category=${category}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      const data = await response.json();
      if (data.length === 0) {
        setErrors({ category: "No courses found for this category" });
        toaster.create({
          title: "Courses not found",
          type: "error",
        });
      } else {
        onSearch(category);
        setOpen(false);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setErrors({ category: "Failed to fetch courses" });
      toaster.create({
        title: "Courses not found",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogRoot
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      placement="center"
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search course</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Flex
            alignItems="center"
            justifyContent="center"
            direction="column"
            gap={5}
          >
            <Input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.currentTarget.value)}
              placeholder="Introduce la categoría del curso"
              _invalid={{
                borderColor: "red.300",
                boxShadow: "0 0 0 1px red.300",
              }}
              mb={4}
            />
            {errors.category && <Text color="red.500">{errors.category}</Text>}
          </Flex>
        </DialogBody>
        <DialogFooter>
          <Button
            onClick={() => setOpen(false)}
            variant="ghost"
            color="indigo.600"
          >
            Cancel
          </Button>
          <Button loading={loading} onClick={handleSearch}>
            Search
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default SearchCourseDialog;
