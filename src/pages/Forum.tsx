import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importa la instancia de Axios
import { useParams } from "react-router-dom";

import {
    Box,
    Flex,
    Heading,
    HStack,
    Text,
    VStack,
    Button,
    Textarea,
    Input,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import { Field } from '../components/ui/field';
import { toaster } from '../components/ui/toaster';



interface ForumMessage {
    id: string;
    userId: string;
    content: string;
    creationDate: Date;
    forumId: string;
    lastModifDate: Date;
}

interface Forum {
    id: string;
    name: string;
    courseId: string;
    creationDate: Date;
    lastModifDate: Date;
}



interface User {
    id: string;
    email: string;
    role: string;
    enabled: boolean;
}

interface Student {
    id: string;
    userId: string;
    contactInformation: ContactInformation;
}
interface ContactInformation {
    name: string;
    surname: string;
    email: string;
}

const ForumExample: Forum = {
    id: 'course1',
    name: 'Título del Foro',
    courseId: 'course1',
    creationDate: new Date(),
    lastModifDate: new Date(),
};

const ForumMessagesExample: ForumMessage[] = [
    {
        id: '1',
        userId: '1',
        content: 'Mensaje de ejemplo',
        creationDate: new Date(),
        forumId: 'course1',
        lastModifDate: new Date(),
    },
    {
        id: '2',
        userId: '2',
        content: 'Otro mensaje de ejemplo',
        creationDate: new Date(),
        forumId: 'course1',
        lastModifDate: new Date(),
    },
];

const ExampleUser1: User = {
    id: '1',
    email: '1@mail.com',
    role: 'ADMIN',
    enabled: true,
};

const Forum: React.FC = () => {
    const [forumTitle, setForumTitle] = useState('Título del Foro');
    const [forumCreationDate, setForumCreationDate] = useState<Date | null>(null);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [messages, setMessages] = useState<ForumMessage[]>([]);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [editedContent, setEditedContent] = useState('');
    const [newMessageContent, setNewMessageContent] = useState('');
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [errorTitle, setErrorTitle] = useState<string | null>(null);
    const [errorNewMessage, setErrorNewMessage] = useState<string | null>(null);
    const [errorEditMessage, setErrorEditMessage] = useState<string | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [errors, setErrors] = useState<string | null>(null);
    
    const testMode = import.meta.env.VITE_IS_TEST_MODE;


    useEffect(() => {


        const fetchForum = async () => {
            let forum = await fetch(`/api/v1/forums/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            let forumData = await forum.json();
            setForumCreationDate(forumData.creationDate);
            setForumTitle(forumData.name);
            let m;
            m = await fetch(`/api/v1/forums/${id}/messages`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setMessages(await m.json());
            if (!forum.ok) {
                setForumTitle(ForumExample.name);
                setForumCreationDate(ForumExample.creationDate);
                setMessages(ForumMessagesExample);
                setUser(ExampleUser1);
              
            }else{
            let u = await fetch(`/api/v1/auth/me`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            u = await u.json();
           
            setUser(u as unknown as User);

            let studentsResponse = await fetch(`/api/v1/students`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            let StudentData = await studentsResponse.json();

            console.log(StudentData);
            setStudents(StudentData as Student[]);}
        };
        console.log(students);

        fetchForum();
        setErrors('');
    }, [id]);



    const handleDeleteMessage = (messageid: string) => {
        axios.delete(`/api/v1/forums/${id}/messages/${messageid}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then(() => { setMessages(messages.filter((message) => message.id !== messageid)); location.reload(); })
            .catch((error) => {
                setErrors(error.response.data);
                toaster.create({
                    title: "Message could not be deleted!",
                    type: "error",
                });
            });
    };

    const handleSaveMessage = (messageid: string, creationDate: Date) => {
        setErrorEditMessage('');
        axios.put(`/api/v1/forums/${id}/messages/${messageid}`, {
            id: messageid, userId: user?.id,
            forumId: id, content: editedContent,
            creationDate: creationDate, lastModifDate: new Date()
        }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then(() => {
                setMessages(messages.map((message) =>
                    message.id === messageid ? { ...message, content: editedContent } : message
                ));
                setEditingMessageId(null);
                setEditedContent('');
                location.reload();
            })
            .catch((error) => {
                setErrorEditMessage(error.response.data);
                toaster.create({
                    title: "Message could not be edited!",
                    type: "error",
                });
            });
    };

    const handleAddMessage = async () => {
        setErrorNewMessage('');
        if (!newMessageContent.trim()) return;
        try {
            await fetch("/api/v1/forums/${id}/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    userId: user?.id,
                    creationDate: new Date(),
                    content: newMessageContent,
                    forumId: id,
                    lastModifDate: new Date()
                }),
            }).then(() => { setNewMessageContent(''); location.reload(); })
                .catch((error) => {
                    setErrorNewMessage(error.response.data);
                    toaster.create({
                        title: "Message could not be added!",
                        type: "error",
                    });
                });

        } catch (err: unknown) {
            const error = err as AxiosError;
            setErrors(typeof error.response?.data === 'string' ? error.response.data : 'An error occurred');
        }



    };




    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForumTitle(e.target.value);
    };
    const handleTitleSave = () => {
        if (!forumTitle.trim()) {
            setErrorTitle('The title cannot be empty');
            return;
        }

        setErrorTitle('');
        const updatedForum = {
            id: id, // Asegúrate de usar el ID correcto
            name: forumTitle,
            courseId: id, // Suplanta con el valor correcto si es necesario
            creationDate: forumCreationDate, // Suplanta con la fecha original si es necesario
            lastModifDate: new Date(), // Fecha actual para registrar el cambio
        };
        axios.put(`/api/v1/forums/${id}`, updatedForum, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then(() => { setIsEditingTitle(false); location.reload(); })
            .catch((error: { response: { data: string; }; }) => {
                console.log(error.response);
                setErrorTitle(error.response.data);
                console.log(errorTitle);
                toaster.create({
                    title: "Forum title could not be updated!",
                    type: "error",
                });
            });
    };





    const handleEditMessage = (id: string, content: string) => {
        setEditingMessageId(id);
        setEditedContent(content);
    };


    const handleCancelEdit = () => {
        setEditingMessageId(null);
        setEditedContent('');
    };
    const handleCancelEditTitle = () => {

        setIsEditingTitle(false);
        location.reload();
    };

    const handleTitleEdit = () => {
        setIsEditingTitle(!isEditingTitle);
    }

    const getStudentName = (userId: string) => {
        const student = students.find((s: { userId: string; }) => s.userId === userId);
        return student ? `${student.contactInformation.name} ${student.contactInformation.surname}` : 'Usuario desconocido';
    };


    return (
        
        <Box className="forum-container" p={4} fontFamily="Arial, sans-serif">
            <Box mb={6}>
              
                {isEditingTitle ? (
                    <>
                    <HStack>

                        <Input className='forum-title-input'
                            value={forumTitle}
                            onChange={handleTitleChange}
                            size="lg"
                            borderColor="gray.300"
                        />
                        
                        <Button className='save-forum-title' colorScheme="teal" onClick={handleTitleSave}>
                            Guardar
                        </Button>
                        <Button colorScheme="gray" onClick={handleCancelEditTitle}>
                            Cancelar
                        </Button>
                        
                    </HStack>
                    {errorTitle && (
                        <Text color="red.500" fontSize="sm" >
                            {errorTitle}
                        </Text>
                    )} 
                </>
                ) : (
                    <Flex justify="space-between" align="center">
                        <Heading className='forum-title-input'>{forumTitle}</Heading>
                        {user?.role == 'ADMIN'  || testMode ?
                            (
                                <Button className='forum-title-edit' colorScheme="teal" onClick={handleTitleEdit}>
                                    Editar
                                </Button>) : null}

                    </Flex>
                )}
            </Box>

            <Box mb={6}>
                <Field errorText={errors}><Textarea
                    value={newMessageContent}
                    onChange={(e: { target: { value: any; }; }) => setNewMessageContent(e.target.value)}
                    placeholder="Escribe un nuevo mensaje..."
                    size="md" className='forum-message-content-new-input'
                />
                    {errorNewMessage && (
                        <Text color="red.500" fontSize="sm" >
                            {errorNewMessage}
                        </Text>
                    )}
                    <Button className='forum-message-add-button' mt={2} colorScheme="teal" onClick={handleAddMessage}>
                        Añadir Mensaje
                    </Button>
                </Field>
            </Box>

            <VStack align="start" p={4} borderWidth={1} borderRadius="md" borderColor="gray.300">
                {messages.map((message) => (
                    <Box className="forum-message-row" key={message.id} w="100%" borderBottomWidth={1} borderColor="gray.200" pb={4}>
                        <Text fontWeight="bold">{getStudentName(message.userId)}</Text>
                        {editingMessageId === message.id ? (
                            <Box>
                                <Field errorText={errors}>
                                    <Textarea
                                        value={editedContent}
                                        onChange={(e) => setEditedContent(e.target.value)}
                                        size="sm"
                                        borderColor="gray.300"
                                        mb={2} className='forum-message-content-input'
                                    />
                                </Field>
                                {errorEditMessage && (
                                    <Text color="red.500" fontSize="sm" >
                                        {errorEditMessage}
                                    </Text>
                                )}
                                <HStack>
                                    <Button colorScheme="teal" onClick={() => handleSaveMessage(message.id, message.creationDate)}>
                                        Guardar
                                    </Button>
                                    <Button colorScheme="gray" onClick={handleCancelEdit}>
                                        Cancelar
                                    </Button>
                                </HStack>
                            </Box>
                        ) : (
                            <div>
                                <Text>{message.content}</Text>
                                {user?.id === message.userId ? (

                                    <HStack mt={2}>
                                        <Button size="sm" colorScheme="blue" onClick={() => handleEditMessage(message.id, message.content)}>
                                            Editar
                                        </Button>
                                        <Button className='delete-forum-message' size="sm" colorScheme="red" onClick={() => handleDeleteMessage(message.id)}>
                                            Eliminar
                                        </Button>
                                    </HStack>
                                ) : null}
                            </div>
                        )}




                    </Box>
                ))}
            </VStack>
        </Box>
    );
};


export default Forum;
