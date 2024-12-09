import React, { useEffect, useState } from "react";
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
  jwt: string;
}

function PopoverDemo({ isOpen, onTogglePopover, ratingId, courseId, jwt}: PopoverDemoProps) {
  type FormData = {
    description: string;
    rating: number;
  };

  const [formData, setFormData] = useState<FormData>({
    description: "",
    rating: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'rating' ? Number(value): value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    onTogglePopover();
  };

    // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try{
  //     const submit = await fetch("http://api/v1/course/${courseId}/rating" + (ratingId !="new" ? "/" + ratingId : "")),
          {
  //          method: ratingId && ratingId !== "new" ? "PUT" : "POST";
  //          headers: {
  //  Authorization: `Bearer ${jwt}`,
  //  Accept: "application/json",
  // },
  // body: JSON.stringify(formData)
    
  }


 //         }
  //   }

  //   console.log("Form submitted:", formData);
  //   onTogglePopover();
  // };

  type rating = {
    description: string,
    rating: number
  }

  const empty_rating = {
    id: null,
    userId: "",
    userName: "",
    description: "",
    rating:0
  }

  const [message, setMessage] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [rating, setRating] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch rating details if not a new rating
        if (ratingId !== "new" && rating !=="") {
          const response = await fetch(`/api/v1/course/${courseId}/rating/${ratingId}`, {
            headers: { Authorization: `Bearer ${jwt}`, 
            'Content-Type': 'application/json'
          }
          });
          const ratingData = await response.json();
          setRating(ratingData);
          setFormData({
            description: ratingData.description || "",
            rating: ratingData.rating || 0
          })
        }
      } catch (error) {
        setMessage(error.message);
        setModalShow(true);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    if (rating) {
      const updateFormInputs = (fieldIndex : number, value) => 
        ratingForm[fieldIndex].defaultValue = value || "";

      const inputMappings = [
        [0, rating.description],
        [1, rating.rating]
      ];

      inputMappings.forEach(([index, value]) => updateFormInputs(index, value));
    }
  }, [rating]);


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
    </div>
  );
}

export default PopoverDemo;
