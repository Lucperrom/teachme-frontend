import React, { useState, useEffect } from "react";
import "./static/authButton.css";
import "./static/global.css";
import "./static/rating.css";

// Definir el tipo para una valoración
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
      } catch (error) {
        setRatings([ratingExample, ratingExample2]);
        console.error("Error during data fetching:", error);
      }
    }

  useEffect(() => {
    setUp();
  }, [courseId]);

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
  

    return (
        <div className="rating-container">
          <div className="rating-header">
            <h2 className="rating-title">Course Reviews</h2>
            <button className="auth-button blue">Add Review</button>
          </div>
    
          <hr className="custom-hr" />
    
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
                </div>
              ))}
            </div>
          ) : (
            <p className="no-ratings">No ratings available</p>
          )}
        </div>
      );
    }
    
    export default RatingList;
