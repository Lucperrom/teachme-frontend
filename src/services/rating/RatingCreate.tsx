import React, { useState } from "react";
import {Popover,PopoverContent,PopoverTrigger,} from "../../components/ui/popover"
import { Button, Input } from "@chakra-ui/react";
import { ratingForm } from "./ratingForm";
import "./static/rating.css";

interface PopoverDemoProps {
    isOpen: boolean;  // Propiedad para controlar si el popover está abierto
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
    // Aquí puedes validar y enviar los datos del formulario
    console.log("Form submitted:", formData);
    onTogglePopover();
  };

  return (
    <Popover  open={isOpen}>
      <PopoverTrigger asChild>
         {/* Este botón ya no es necesario para abrir el popover automáticamente */}
         <div className="popover-wrapper">
         <Button variant="outline" style={{ display: "none" }}>Open Form</Button>
         </div>
      </PopoverTrigger>
      <PopoverContent className="w-96 bg-gray-200 rounded-lg shadow-md"
         >
            <button 
            onClick={onTogglePopover} 
            margin-left = "3em"
            className="absolute top-2 right-5 text-gray-600 hover:text-gray-900"
            aria-label="Close"
        >
            ╳
        </button>
        <form onSubmit={handleSubmit} className="space-y-4">
          {ratingForm.map((field) => (
            <div key={field.name} className="grid grid-cols-3 items-center gap-4">
              <label htmlFor={field.name} className="text-sm font-medium">
                {field.tag}
              </label>
              <Input
                id={field.name}
                name={field.name}
                type={field.type}
                value={formData[field.name as keyof FormData]}
                required={field.isRequired}
                onChange={handleInputChange}
                className="col-span-2 h-8"
              />
            </div>
          ))}
          <div className="flex justify-end space-x-2">
          <Button
              type="reset"
              variant="outline"
              onClick={() => setFormData({
                description: "",
                rating: 0,
              })}
            >
              Reset
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}

export default PopoverDemo;
