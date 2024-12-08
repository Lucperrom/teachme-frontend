import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Button, Input } from "@chakra-ui/react";
import { ratingForm } from "./ratingForm";
import "./static/popover.css";
import "./static/rating.css";

interface PopoverDemoProps {
  isOpen: boolean; // Propiedad para controlar si el popover está abierto
  onTogglePopover: () => void;
}

function PopoverDemo({ isOpen, onTogglePopover }: PopoverDemoProps) {
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
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    onTogglePopover();
  };

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
