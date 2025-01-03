import {
    DialogActionTrigger,
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    DialogTrigger
} from "./ui/dialog.tsx";
import {Button} from "./ui/button.tsx";
import {FunctionComponent, ReactNode, useState} from "react";
import client from "../services/axios.ts";
import {toaster} from "./ui/toaster.tsx";
import {Box, Image} from "@chakra-ui/react";
import {RiImageAiLine} from "react-icons/ri";
import {FileUploadRoot, FileUploadTrigger} from "./ui/file-upload.tsx";

interface ProfilePictureDialogProps {
    children: ReactNode;
    profilePictureUrl?: string;
    onUpdate: (url: string | null) => void;
}

const ProfilePictureDialog: FunctionComponent<ProfilePictureDialogProps> = ({children, profilePictureUrl, onUpdate}) => {

    const [hover, setHover] = useState<boolean>(false);
    const [previewImageUrl, setPreviewImageUrl] = useState<string>("");
    const [previewImageFile, setPreviewImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    const handleUploadProfilePicture = async (file: File | null) => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            setLoading(true);
            const response = await client.post(
                `/api/v1/students/me/profile-picture/upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            onUpdate(response.data);

            toaster.create({
                title: "Profile picture successfully updated!",
                type: "success",
            });
            setOpen(false);
        } catch (error) {
            toaster.create({
                title: "Profile picture could not be uploaded!",
                type: "error",
            });
            console.error("Error uploading profile picture:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProfilePicture = async () => {
        try {
            await client.delete("/api/v1/students/me/profile-picture/delete");

            toaster.create({
                title: "Profile picture deleted successfully!",
                type: "success",
            });

            onUpdate(null);

        } catch (error) {
            toaster.create({
                title: "Profile picture could not be deleted!",
                type: "error"
            });
            console.error(error);
        }
    }

    return (
        <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)} placement="center">
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Profile Picture</DialogTitle>
                </DialogHeader>
                <DialogBody>
                    <FileUploadRoot
                        style={{display: "flex", alignItems: "center", justifyContent: "center"}}
                        onFileAccept={async (details) => {
                            const file = details.files[0];
                            if (file) {
                                const blobUrl = URL.createObjectURL(file)
                                setPreviewImageUrl(blobUrl);
                                setPreviewImageFile(file);
                            }
                        }}
                        accept={["image/*"]}>
                        <FileUploadTrigger asChild>
                            <Box position="relative"
                                 data-test="profile-picture-modal"
                                 backgroundColor={!profilePictureUrl ? "grey" : (hover ? "black" : "")}
                                 opacity={hover ? 0.5 : 1}
                                 rounded="full"
                                 onMouseLeave={() => setHover(false)}
                                 onMouseEnter={() => setHover(true)}>
                                <Image cursor="pointer" width={200} height={200} rounded="full"
                                       src={previewImageUrl
                                           ? previewImageUrl
                                           : profilePictureUrl}/>
                                <Box cursor="pointer" position="absolute" top="75px" right="75px">
                                    <RiImageAiLine size={50} color="white"/>
                                </Box>
                            </Box>
                        </FileUploadTrigger>
                    </FileUploadRoot>
                </DialogBody>
                <DialogFooter>
                    <DialogActionTrigger asChild>
                        <Button onClick={() => {
                            setPreviewImageFile(null);
                            setPreviewImageUrl("");
                        }} disabled={loading} variant="outline">Cancel</Button>
                    </DialogActionTrigger>

                    {
                        profilePictureUrl &&
                        <Button onClick={async () => {
                            await handleDeleteProfilePicture();
                            setPreviewImageFile(null);
                            setPreviewImageUrl("");
                            setOpen(false);
                        }}
                                disabled={loading}
                                colorPalette="red"
                                variant="outline">Delete</Button>
                    }

                    <Button disabled={!previewImageFile} loading={loading} onClick={async () => {
                        await handleUploadProfilePicture(previewImageFile);
                        setPreviewImageFile(null);
                        setPreviewImageUrl("");
                    }}
                    >Save</Button>
                </DialogFooter>
                <DialogCloseTrigger/>
            </DialogContent>
        </DialogRoot>
    );
}

export default ProfilePictureDialog;