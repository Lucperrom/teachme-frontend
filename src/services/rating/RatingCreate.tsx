import React, { useEffect, useState, useRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Button, Input } from "@chakra-ui/react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { ratingForm } from "./ratingForm";
import "./static/popover.css";
import "./static/rating.css";
import { DateTime } from 'luxon';

interface PopoverDemoProps {
  isOpen: boolean; // Propiedad para controlar si el popover está abierto
  onTogglePopover: () => void;
  ratingId: string;
  courseId: string;
  jwt: string | null;
  userId: string;
}

function PopoverDemo({ isOpen, onTogglePopover, ratingId: initialRatingId, courseId, jwt, userId}: PopoverDemoProps) {
  type FormData = {
    description: string;
    rating: number;
  };

  const [formData, setFormData] = useState<FormData>({
    description: "",
    rating: 0,
  });

  type Rating = {
    id: string;
    userId: string;
    username: string;
    description: string;
    rating: number;
    date: string;
    courseId: string;
  };

  const [message, setMessage] = useState<string | null>(null);
  const [modalShow, setModalShow] = useState(false);
  const [rating, setRating] = useState(null);
  const [ratingId,setRatingId] = useState(initialRatingId);
  const editRatingFormRef=useRef();
  const now = DateTime.now();
  const formatted = now.toFormat('yyyy-MM-dd HH:mm:ss');

  useEffect( () => setupRating(),[]);  
 
   
   function setupRating(){
       if (ratingId !== "new" && ratingId==null) { 
         const rating = fetch(
             `/api/v1/course/${courseId}/rating/${ratingId}`, 
             {
               headers: {
               Authorization: `Bearer ${jwt}`,
             },
           })
           .then((r) => r.json())
           .then((r) => {
             if(r.message){ 
               setMessage(r.message);
               setModalShow( true );
             }else {
               setRating(r);
               setRatingId(r.id);                
             }
           }).catch(m =>{
             setMessage(m);
             setModalShow( true );
           });          
     }    
   }

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    if (name in formData) {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "rating" ? Number(value) : value,
      }));
  
      if (rating) {
        setRating({
          ...rating,
          [name]: name === "rating" ? Number(value) : value,
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editRatingFormRef.current) return;

    const myRating: Rating = {
      id: ratingId,
      userId: userId,
      username: rating.username,
      description: formData.description,
      rating: formData.rating,
      courseId: courseId,
      date: formatted,
    };

    try {
      const response = await fetch(
        `/api/v1/course/${courseId}/ratings/${ratingId !== "new" ? `${ratingId}` : `${userId}`}`,
        {
          method: myRating.id ? "PUT" : "POST",
          headers: {
            Authorization: `Bearer ${jwt}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(myRating),
        }
      );
      const result = await response.json();
      if (result.message) {
        setMessage(result.message);
        setModalShow(true);
      } else {
        onTogglePopover();
      }
    } catch (error) {
      setMessage(String(error));
      setModalShow(true);
    }
  };
    
    function handleShow() {
      setModalShow(false);
      setMessage(null);
    }

  return (
    <div>
      {/* Superposición para difuminar el fondo */}
      <div className={`overlay ${isOpen ? 'active' : ''}`} onClick={onTogglePopover}></div>
      
      <Popover open={isOpen}>
        <PopoverTrigger asChild>
          <div className="popover-wrapper">
            <Button variant="outline" style={{ display: "none" }}>
              Open Form
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="custom-popover-content">
          <button
            onClick={onTogglePopover}
            className="close-button"
            aria-label="Close"
          >
            ╳
          </button>
          <form onSubmit={handleSubmit} className="form-layout">
            {ratingForm.map((field) => (
              <div
                key={field.name}
                className={`form-field ${
                  field.name === "rating" ? "rating-field" : "description-field"
                }`}
              >
                <label htmlFor={field.name} className="form-label">
                  {field.tag}
                </label>
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={formData[field.name as keyof FormData]}
                  required={field.isRequired}
                  min={field.name === "rating" ? 1 : undefined}
                  max={field.name === "rating" ? 5 : undefined}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            ))}
            <div className="form-actions">
              <Button
                type="reset"
                variant="outline"
                onClick={() =>
                  setFormData({
                    description: "",
                    rating: 0,
                  })
                }
                className="reset-button"
              >
                Reset
              </Button>
              <Button type="submit" className="submit-button">
                Submit
              </Button>
            </div>
          </form>
        </PopoverContent>
      </Popover>
      <Modal isOpen={modalShow} toggle={handleShow} keyboard={false}>
        <ModalHeader
          toggle={handleShow}
           close={
            <button className="close" onClick={handleShow} type="button">
              &times;
            </button>
          }
          >
           Alert!
         </ModalHeader>
        <ModalBody>{message || ""}</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleShow}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default PopoverDemo;
