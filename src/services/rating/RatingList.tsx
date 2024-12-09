import React, { useState, useEffect } from "react";
import "./static/authButton.css";
import "./static/global.css";
import "./static/rating.css";
import "./static/popover.css";
import { Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import PopoverDemo from "./RatingCreate";
import { Link } from "react-router-dom";
import {authService} from "../auth/authService.ts";
import { Button } from "@chakra-ui/react";
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
  username: string;
  id: string;
  email: string;
  role: string;
}


type Rating = {
  id: string;
  username: string;
  description: string;
  rating: number;
  date: string;
};

const ratingExample: Rating = {
  id: "1",
  username: "Pedrito",
  description: "Great course!",
  rating: 5,
  date: "2024-12-07",
};

const ratingExample2: Rating = {
  id: "2",
  username: "Paquito el chocolatero",
  description: "Not bad.",
  rating: 3,
  date: "2024-12-06",
};

function RatingList() {
    const pathArray = window.location.pathname.split("/");
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [courseId] = useState(pathArray[1]);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [message, setMessage] = useState(null);
    const [modalShow, setModalShow] = useState(false);
    const [username,setUsername] = useState("");
    const jwt: string | null = authService.getToken();

    function setUpUsername(){
      if(jwt){
        const decodedToken: DecodedToken = jwtDecode<DecodedToken>(jwt);
        setUsername(decodedToken.username);
      }
    }

    
  
    async function setUp() {
      try {
        const response = await fetch(`http://api/v1/course/${courseId}/ratings`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          setRatings([ratingExample]);
          throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const ratingsData: Rating[] = await response.json();
        setRatings(ratingsData);
        setRatings([ratingExample]);
        setUpUsername();
      } catch (error) {
        setRatings([ratingExample, ratingExample2]);
        console.error("Error during data fetching:", error);
      }
    }

  useEffect(() => {
    setUp();
  }, [courseId]);


  //Eliminar rating
  function removeRating(id: string) {
    fetch(`http://api/v1/course/${courseId}/rating/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          const updatedRatings = [...ratings].filter((i) => i.id !== id);
          setRatings(updatedRatings);
        }
        return response.json();
      })
      .then((data) => {
        setMessage(data.message);
        setModalShow(true);
      });
  }

  function handleShow() {
    setModalShow(!modalShow);
  }


    // Función para renderizar estrellas
    const renderStars = (rating: number) => {
        return (
        <span className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className={`star ${star <= rating ? "filled" : ""}`}>
                ★
            </span>
            ))}
        </span>
        );
    };

    const onTogglePopover = () => {
      setIsPopoverOpen(!isPopoverOpen);
    };

  
    return (
        <div className="rating-container">
          <div className="rating-header">
            <h2 className="rating-title">Course Reviews</h2>
            <button onClick={() => setIsPopoverOpen(true)} className="auth-button">Add Review</button>
          </div>
    
          <hr className="custom-hr" />
          {/* Condicionalmente renderiza el PopoverDemo */}
          {isPopoverOpen && <PopoverDemo isOpen={isPopoverOpen} onTogglePopover={onTogglePopover} />} 
          {ratings.length > 0 ? (
            <div className="ratings-list">
              {ratings.map((rating) => (
                <div key={rating.id} className="rating-row">
                  <div className="rating-data">
                    <div className="rating-header-row">
                      <div className="user-info">
                        <i className="fa-solid fa-user avatar-icon"></i>
                        <span className="rating-username">{rating.username}</span>
                      </div>
                      <div className="rating-date">{rating.date}</div>
                    </div>
                    <div className="rating-stars-and-description">
                      <b>Rating:</b> {renderStars(rating.rating)}
                      <span className="rating-description"><b>Description:</b>&nbsp;&nbsp;{rating.description}</span>
                    </div>
                  </div>
                  {username!="" &&(
                  <div className="rating-options">
                  <Link
                    to={"/rating/" + rating.id}
                    className="auth-button"
                    style={{ textDecoration: "none" }}
                  >
                    Update
                  </Link>
                  <button
                    onClick={() => removeRating(rating.id)}
                    className="auth-button danger"
                  >
                    Delete
                  </button>
                </div>
              )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-ratings">No ratings available</p>
          )}
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
    
    export default RatingList;
