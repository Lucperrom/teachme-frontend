import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importa la instancia de Axios
import { authService } from '../services/auth/authService';
import { ClassNames } from '@emotion/react';
import { StudentDto } from '../types/StudentDto';


interface ForumMessage {
    id: number;
    studentId: string;
    content: string;
    creationDate: Date;
    forumId: number;
    lastModifDate: Date;
}

const Forum: React.FC = () => {
    const [forumTitle, setForumTitle] = useState('Título del Foro');
    const [forumCreationDate, setForumCreationDate] = useState<Date | null>(null);
    const [forumCourseId, setForumCourseId] = useState<Date | null>(null);;
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [messages, setMessages] = useState<ForumMessage[]>([]);
    const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
    const [editedContent, setEditedContent] = useState('');
    const [newMessageContent, setNewMessageContent] = useState('');
    const [student, setStudent] = useState<StudentDto | null>(null);

    const forumId = 1; // Ejemplo de ID del foro
    const studentId = 1; // Ejemplo de ID del estudiante

    useEffect(() => {
        // Cargar datos iniciales
        axios.get(`http://localhost:8080/api/v1/forums/${forumId}`)
            .then((response) => {
                setForumCourseId(response.data.courseId);
                setForumCreationDate(response.data.creationDate);
                setForumTitle(response.data.name)
            })
            .catch((error) => console.error('Error al cargar el foro:', error));

        axios.get(`http://localhost:8080/api/v1/forums/${forumId}/messages`)
            .then((response) => { setMessages(response.data) })
            .catch((error) => console.error('Error al cargar los mensajes:', error));

        axios.get('/api/v1/students/me').then(resp =>
            setStudent(resp.data as StudentDto)
        );
    }, [forumId]);



    const handleDeleteMessage = (id: number) => {
        axios.delete(`http://localhost:8080/api/v1/forums/${forumId}/messages/${id}`)
            .then(() => setMessages(messages.filter((message) => message.id !== id)))
            .catch((error) => console.error('Error al eliminar el mensaje:', error));
    };

    const handleSaveMessage = (id: number, creationDate: Date) => {
        axios.put(`http://localhost:8080/api/v1/forums/${forumId}/messages/${id}`, {
            id: id, studentId: studentId,
            forumId: forumId, content: editedContent,
            creationDate: creationDate, lastModifDate: new Date()
        })
            .then(() => {
                setMessages(messages.map((message) =>
                    message.id === id ? { ...message, content: editedContent } : message
                ));
                setEditingMessageId(null);
                setEditedContent('');
            })
            .catch((error) => console.error('Error al guardar el mensaje:', error));
    };

    const handleAddMessage = () => {
        if (!newMessageContent.trim()) return;

        axios.post(`http://localhost:8080/api/v1/forums/${forumId}/messages`, {
            studentId: studentId,
            creationDate: new Date(),
            content: newMessageContent,
            forumId: forumId,
            lastModifDate: new Date()
        })
            .then((response) => {
                setMessages([...messages, response.data]);
                setNewMessageContent('');
            })
            .catch((error) => console.error('Error al añadir un mensaje:', error));
    };

    /*   useEffect(() => {
           // Cargar mensajes del foro al inicio
           axios.get(`http://localhost:8080/api/v1/forums/${forumId}/messages`)
               .then((response) => { console.log(response.data);setMessages(response.data)})
               .catch((error) => console.error('Error al cargar los mensajes:', error));
       }, [forumId]);*/

    const handleTitleEdit = () => {
        setIsEditingTitle(!isEditingTitle);
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForumTitle(e.target.value);
    };
    const handleTitleSave = () => {
        const updatedForum = {
            id: forumId, // Asegúrate de usar el ID correcto
            name: forumTitle,
            courseId: forumCourseId, // Suplanta con el valor correcto si es necesario
            creationDate: forumCreationDate, // Suplanta con la fecha original si es necesario
            lastModifDate: new Date(), // Fecha actual para registrar el cambio
        };
        axios.put(`http://localhost:8080/api/v1/forums/${forumId}`, updatedForum)
            .then(() => setIsEditingTitle(false))
            .catch((error) => console.error('Error al guardar el título del foro:', error));
    };





    const handleEditMessage = (id: number, content: string) => {
        setEditingMessageId(id);
        setEditedContent(content);
    };


    const handleCancelEdit = () => {
        setEditingMessageId(null);
        setEditedContent('');
    };




    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>

            {/*authService.isAuthenticated()*/ true ? (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                        {isEditingTitle ? (
                            <div>
                                <input
                                    type="text"
                                    value={forumTitle}
                                    onChange={handleTitleChange}
                                    style={{ fontSize: '24px', marginRight: '10px', border: '1px solid #ccc', borderRadius: '5px', padding: '10px'  }} />

                                <button onClick={handleTitleSave} style={{ marginRight: '10px',border: '1px solid #ccc', borderRadius: '5px', padding: '10px'  }}>
                                    Guardar
                                </button>
                                <button onClick={handleCancelEdit} style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px'  }}>Cancelar</button>
                            </div>
                        ) : (
                            <div><h1 style={{ flexGrow: 1 }}>{forumTitle}</h1>
                                <button onClick={handleTitleEdit} style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px'  }}>
                                    Editar
                                </button>
                            </div>
                        )}

                    </div>

                    {/* Añadir Mensaje */}
                    <div style={{ marginBottom: '20px' }}>

                        <textarea
                            value={newMessageContent}
                            onChange={(e) => setNewMessageContent(e.target.value)}
                            placeholder="Escribe un nuevo mensaje..."
                            style={{ width: '100%', marginBottom: '10px' ,border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}
                        />

                        <button onClick={handleAddMessage} style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px'  }}>Añadir Mensaje</button>
                    </div>

                    {/* Mensajes del Foro */}
                    <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
                        {messages.map((message) => (
                            <div key={message.id} style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                                <strong>{message.studentId}</strong>
                                {editingMessageId === message.id ? (
                                    <div>
                                        <textarea
                                            value={editedContent}
                                            onChange={(e) => setEditedContent(e.target.value)}
                                            style={{ width: '100%', marginBottom: '10px' }}
                                        />
                                        <button onClick={() => handleSaveMessage(message.id, message.creationDate)} style={{ marginRight: '10px' , border: '1px solid #ccc', borderRadius: '5px', padding: '10px'  }}>
                                            Guardar
                                        </button>
                                        <button onClick={handleCancelEdit} style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px'  }}>Cancelar</button>
                                    </div>
                                ) : (
                                    <p style={{ margin: '5px 0' }}>{message.content}</p>
                                )}
                                {/*message.studentId === student?.id*/ true ?
                                    (<div><button onClick={() => handleEditMessage(message.id, message.content)} style={{ marginRight: '10px' ,border: '1px solid #ccc', borderRadius: '5px', padding: '10px'  }}>
                                        Editar
                                    </button>
                                        <button onClick={() => handleDeleteMessage(message.id)} style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px'  }}>Eliminar</button></div>
                                    ) : null}

                            </div>
                        ))}
                    </div>
                </div>) : (<div>Debes iniciar sesión para ver el contenido</div>)}
        </div>
    );
};


export default Forum;
