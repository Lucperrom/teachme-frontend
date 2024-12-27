/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import "./static/authButton.css";
import "./static/global.css";
import "./static/rating.css";
import "./static/popover.css";
import { Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import PopoverDemo from "./RatingCreate";
import {authService} from "../auth/authService.ts";
import { Button } from "@chakra-ui/react";
import {useAuth} from "../auth/AuthContext.tsx";
import secret from "../../../secret.json"


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
    const [courseId, setCourseId] = useState(pathArray[1]);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [message, setMessage] = useState(null);
    const [modalShow, setModalShow] = useState(false);
    const [userId,setUserId] = useState("");
    const [ratingId, setRatingId] = useState<string | "">("new");
    const jwt: string | null = authService.getToken();
    const {user} = useAuth();
    const apiKey = secret.OPENAI_API_KEY;

    useEffect(() => {
      if (user != null) {
        setUserId(user.id);
      }
    }, [user]); 

    async function setUp() {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/course/${courseId}/ratings/`, {
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
    fetch(`http://localhost:8080/api/v1/course/${courseId}/rating/${id}`, {
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

   //OpenAI API

   const handleGenerateText = async (description: string) => {
 
    const prompt = "You are a student and you write a social media post about your opinion of the new course you have completed using this description"+description+"";
    const model = "gpt-3.5-turbo-instruct";
    const maxTokens = 300;

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        prompt,
        max_tokens: maxTokens
      })
    };

    try {
      const response = await fetch('https://api.openai.com/v1/completions', requestOptions);
      const previa = await response.json();
      const output = await previa.choices[0].text;
      const shareText = encodeURIComponent(`${output}`);
      window.open(`https://www.linkedin.com/shareArticle?mini=true&url=&text=${shareText}`, '_blank');

    }catch(error){
      const shareText = encodeURIComponent(`${description}`);
      window.open(`https://www.linkedin.com/shareArticle?mini=true&url=&text=${shareText}`, '_blank');
   
  }
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
          {/* {isPopoverOpen && <PopoverDemo isOpen={isPopoverOpen} onTogglePopover={onTogglePopover} ratingId={ratingId} />}  */}
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
                  {/* {userId!="" && userId==rating.id &&( */}
                  <div className="rating-options">
                  <button onClick={() => {setIsPopoverOpen(true); setRatingId(rating.id)}} className="edit-button" style={{ textDecoration: "none" }}
                  ><i className="fas fa-edit"></i>Edit Review</button>
                  <button
                  onClick={() => handleGenerateText(rating.description)}
                  className="linkedIn"
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <svg
                    className="share-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width: 15 }}
                    viewBox="0 0 512 512"
                    aria-label="ln"
                    role="img"
                  >
                    <path d="m132.28,479.99501l-92.88,0l0,-299.1l92.88,0l0,299.1zm-46.49,-339.9c-29.7,0 -53.79,-24.6 -53.79,-54.3a53.79,53.79 0 0 1 107.58,0c0,29.7 -24.1,54.3 -53.79,54.3zm394.11,339.9l-92.68,0l0,-145.6c0,-34.7 -0.7,-79.2 -48.29,-79.2c-48.29,0 -55.69,37.7 -55.69,76.7l0,148.1l-92.78,0l0,-299.1l89.08,0l0,40.8l1.3,0c12.4,-23.5 42.69,-48.3 87.88,-48.3c94,0 111.28,61.9 111.28,142.3l0,164.3l-0.1,0z"></path>
                  </svg>
                  Share on LinkedIn
                </button>
                  <button
                    onClick={() => removeRating(rating.id)}
                    className="danger-button"
                    style={{ display: "flex", alignItems: "center", gap: "8px" }}
                    ><i className="fa fa-trash" aria-hidden="true"></i> Delete
                  </button>

                  </div>
              {/* )} */}

                </div>
              ))}
              {isPopoverOpen && <PopoverDemo isOpen={isPopoverOpen} onTogglePopover={onTogglePopover} ratingId={ratingId} courseId={courseId} jwt={jwt} userId={userId} />}

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
