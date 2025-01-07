import {Flex, Input, Textarea} from "@chakra-ui/react";
import {FunctionComponent, useState} from "react";
import {Button} from "./ui/button";
import {DialogBody, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle,} from "./ui/dialog";
import {toaster} from "./ui/toaster";
import client from "../services/axios.ts";

interface CreateCourseDialogProps {
    onCourseCreated: () => void;
    isOpen: boolean;
    onClose: () => void;
}

enum Level {
    BEGINNER = "BEGINNER",
    ADVANCE = "ADVANCE",
    PROFESSIONAL = "PROFESSIONAL",
}

const CreateCourseDialog: FunctionComponent<CreateCourseDialogProps> = ({
                                                                            onCourseCreated,
                                                                            isOpen,
                                                                            onClose,
                                                                        }) => {
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [duration, setDuration] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [level, setLevel] = useState<string>(Level.BEGINNER);

    const handleCreateCourse = async () => {
        setLoading(true);
        try {
            await client.post("/api/v1/courses",
                {
                    name,
                    description,
                    category,
                    duration,
                    level,
                });

            toaster.create({
                title: "Course created successfully",
                type: "success",
            });

            onCourseCreated();
            onClose();

            setCategory("");
            setName("");
            setDuration("");
            setDescription("");
            setLevel(Level.BEGINNER);
        } catch (error) {
            console.error("Error creating course:", error);
            toaster.create({
                title: "Course not created",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <DialogRoot
            open={isOpen}
            onOpenChange={(open) => !open && onClose()}
            placement="center"
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Course</DialogTitle>
                </DialogHeader>
                <DialogBody>
                    <Flex direction="column" gap={4}>
                        <Input
                            placeholder="Course Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Textarea
                            placeholder="Course Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
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
                        onClick={handleCreateCourse}
                        loading={loading}
                        colorScheme="teal"
                    >
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </DialogRoot>
    );
};

export default CreateCourseDialog;
