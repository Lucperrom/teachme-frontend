import React, { useEffect, useState, useRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Button, Input } from "@chakra-ui/react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { ratingForm } from "./ratingForm";
import "./static/popover.css";
import "./static/rating.css";

interface PopoverDemoProps {
  isOpen: boolean; // Propiedad para controlar si el popover está abierto
  onTogglePopover: () => void;
  ratingId: string;
  courseId: string;
  jwt: string | null;
  userId: string;
}

function PopoverDemo({ isOpen, onTogglePopover, ratingId: initialRatingId, courseId, jwt}: PopoverDemoProps) {
  type FormData = {
    description: string;
    rating: number;
  };

  const [formData, setFormData] = useState<FormData>({
    description: "",
    rating: 0,
  });

  const [message, setMessage] = useState<string | null>(null);
  const [modalShow, setModalShow] = useState(false);
  const [rating, setRating] = useState<{ id: string; description: string; rating: number; userId: string; username: string; } | null>(null);
  const [ratingId,setRatingId] = useState(initialRatingId);
  const editRatingFormRef=useRef<HTMLFormElement>(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => { 
    setupRating();
  }, []);  
 
   
  async function setupRating() {
    if (ratingId !== "new") {
      setIsEdit(true);
      try {
        const response = await fetch(
          `/api/v1/course/${courseId}/ratings/${ratingId}`,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
        const data = await response.json();
        if (data.message) {
          setMessage(data.message);
          setModalShow(true);
        } else {
          setRating(data);
          setRatingId(data.id);
  
          // Actualiza formData con los valores obtenidos del rating
          setFormData({
            description: data.description || "",
         rating: data.rating || 0,
          });
        }
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "An unknown error occurred");
        setModalShow(true);
      }
    }
  }
   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  
    if (editRatingFormRef.current) {
      const isValid = editRatingFormRef.current.checkValidity(); // Usar checkValidity nativo
      if (!isValid) {
        setMessage("Please fix the errors in the form.");
        setModalShow(true);
        return;
      }
    }
    const myrating = {
      id: ratingId,
      description: formData.description,
      rating: formData.rating,          
      userId: isEdit ? rating?.userId || "" : "",
      username: isEdit ? rating?.username || "" : "",
      courseId: courseId,
    };

    const response = (await fetch(`/api/v1/course/${courseId}/ratings/${ratingId !== "new" ? `${ratingId}` : ""}`,

        {
          method: ratingId !== "new"? "PUT" : "POST",
          headers: {
            Authorization: `Bearer ${jwt}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(myrating),
        }));
        const result = await response.json();
        if (result.message) {
          setMessage(result.message);
          setModalShow(true);
        } else {
          onTogglePopover();
          window.location.reload();
        }
      }
  
      ratingForm[0].defaultValue = rating?.description || "";
      ratingForm[1].defaultValue = rating?.rating || 0;
    
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
                  onChange={handleChange}
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
