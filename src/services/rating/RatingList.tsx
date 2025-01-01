/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import "./static/authButton.css";
import "./static/global.css";
import "./static/rating.css";
import "./static/popover.css";
import { Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import PopoverDemo from "./RatingCreate";
import {authService} from "../auth/authService.ts";
import { Button } from "@chakra-ui/react";
import {useAuth} from "../auth/AuthContext.tsx";
import { isTestMode } from "./config";


type Rating = {
  id: string;
  userId: string;
  username: string;
  description: string;
  rating: number;
  date: string;
};

const ratingExample: Rating = {
  id: "1",
  userId: "User1",
  username: "ExampleUser1",
  description: "Great course!",
  rating: 4,
  date: "2024-10-07",
};

const ratingExample2: Rating = {
  id: "2",
  userId: "User2",
  username: "ExampleUser2",
  description: "Not bad.",
  rating: 3,
  date: "2024-12-06",
};

const ratingExample3: Rating = {
  id: "3",
  userId: "User3",
  username: "ExampleUser3",
  description: "Excellent!",
  rating: 5,
  date: "2024-11-06",
};

function RatingList() {
    const pathArray = window.location.pathname.split("/");
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [courseId] = useState(pathArray[3]);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [modalShow, setModalShow] = useState(false);
    const [userId,setUserId] = useState("");
    const [ratingId, setRatingId] = useState("new");
    const jwt: string | null = authService.getToken();
    const {user} = useAuth();
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
      if (user != null) {
        setUserId(user.id);
      }
    }, [user]); 
    

  const sortRatings = (ratingsToSort: Rating[]): Rating[] => {
    const userRating = ratingsToSort.find(rating => rating.userId === user?.id);
    const otherRatings = ratingsToSort.filter(rating => rating.userId !== user?.id);
    
    const sortedOtherRatings = otherRatings.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
    });
    return userRating ? [userRating, ...sortedOtherRatings] : sortedOtherRatings;
  };


  async function setUp() {
    try {
      const response = await fetch(`/api/v1/course/${courseId}/ratings/`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        setRatings(sortRatings([ratingExample]));
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
      const ratingsData: Rating[] = await response.json();
      setRatings(sortRatings(ratingsData));
    } catch (error) {
      setRatings(sortRatings([ratingExample, ratingExample2, ratingExample3]));
      console.error("Error during data fetching:", error);
    }
  }

  useEffect(() => {
    setUp();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);


  //Eliminar rating
  function removeRating(id: string) {
    setIsDeleting(true);

    try {
      if (isTestMode) {
        setRatings(prevRatings => {
          const updatedRatings = prevRatings.filter(rating => rating.id !== id);

          return updatedRatings;
        });
        return;
      }

      fetch(`/api/v1/course/${courseId}/ratings/${id}`, {
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
        })
        .catch(() => {
          setMessage("Error deleting rating");
        })
        .finally(() => {
          setIsDeleting(false);
          setModalShow(true);
        });
  } catch (error) {
    setMessage("Unexpected error occurred");
    setIsDeleting(false);
    setModalShow(true);
  }
}

const handleShow = () => {
  if (isPopoverOpen) setIsPopoverOpen(false);
  setModalShow(!modalShow); 
};

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
          <button onClick={() => setIsPopoverOpen(true)} className="auth-button">
            Add Review
          </button>
        </div>
    
        <hr className="custom-hr" />
    
        {/* Renderiza el PopoverDemo siempre */}
        {isPopoverOpen && (
          <PopoverDemo
            isOpen={isPopoverOpen}
            onTogglePopover={onTogglePopover}
            ratingId={ratingId}
            courseId={courseId}
            jwt={jwt}
            userId={userId}
          />
        )}
    
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
                    <span className="rating-description">
                      <b>Description:</b>&nbsp;&nbsp;{rating.description}
                    </span>
                  </div>
                </div>
                {userId == rating.userId && (
                  <div className="rating-options">
                    <button
                      onClick={() => {
                        setIsPopoverOpen(true);
                        setRatingId(rating.id);
                      }}
                      className="edit-button"
                      style={{ alignItems: "center", gap: "8px" }}
                    >
                      <i className="fas fa-edit" style={{ marginRight: "8px" }}></i>
                      Edit
                    </button>
                    <button
                      onClick={() => handleGenerateText(rating.description)}
                      className="linkedIn"
                      style={{ alignItems: "center", gap: "8px" }}
                    >
                      <i
                        className="fab fa-linkedin-in"
                        style={{ marginRight: "8px" }}
                      ></i>
                      Share on LinkedIn
                    </button>
                    <button
                      onClick={() => removeRating(rating.id)}
                      className="danger-button"
                      disabled={isDeleting}
                      data-testid={`delete-button-${rating.id}`}
                      style={{ alignItems: "center", gap: "8px" }}
                    >
                      <i
                        className="fa fa-trash"
                        aria-hidden="true"
                        style={{ marginRight: "8px" }}
                      ></i>
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-ratings">No ratings available</p>
        )}
    
        <Modal isOpen={modalShow} toggle={handleShow} backdrop="static" keyboard={false}>
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
