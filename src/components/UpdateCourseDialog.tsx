import { Flex, Input} from "@chakra-ui/react";
import { FunctionComponent, useState } from "react";
import { Button } from "./ui/button";
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "./ui/dialog";
import { toaster } from "./ui/toaster";

interface UpdateCourseDialogProps {
  id: string;
  category: string;
  duration: string;
  level: string;
  onClose: () => void;
  onCourseUpdated: (updatedCourse: unknown) => void;
}

enum Level {
  BEGINNER = "BEGINNER",
  ADVANCE = "ADVANCE",
  PROFESSIONAL = "PROFESSIONAL",
}

const UpdateCourseDialog: FunctionComponent<UpdateCourseDialogProps> = ({
  id,
  category: initialCategory,
  duration: initialDuration,
  level: initialLevel,
  onClose,
  onCourseUpdated,
}) => {
  const [category, setCategory] = useState<string>(initialCategory);
  const [duration, setDuration] = useState<string>(initialDuration);
  const [level, setLevel] = useState<string>(initialLevel);
  const [loading, setLoading] = useState<boolean>(false);

  const handleUpdateCourse = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/courses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          category,
          duration,
          level,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update course");
      }

      toaster.create({
        title: "Course updated successfully",
        type: "success",
      });

      const updatedCourse = await response.json();
      onCourseUpdated(updatedCourse);
      onClose();
    } catch (error) {
      console.error("Error updating course:", error);
      toaster.create({
        title: "Course not updated",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogRoot
      open={true}
      onOpenChange={(open) => !open && onClose()}
      placement="center"
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Course</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Flex direction="column" gap={4}>
            <Input
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <Input
              placeholder="Duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value={Level.BEGINNER}>Beginner</option>
              <option value={Level.ADVANCE}>Advance</option>
              <option value={Level.PROFESSIONAL}>Professional</option>
            </select>
          </Flex>
        </DialogBody>
        <DialogFooter>
          <Button onClick={onClose} colorScheme="red">
            Cancel
          </Button>
          <Button
            onClick={handleUpdateCourse}
            loading={loading}
            colorScheme="teal"
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default UpdateCourseDialog;
