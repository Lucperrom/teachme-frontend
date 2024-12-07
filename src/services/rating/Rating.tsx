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
      setRatings([ratingExample,ratingExample2])
      console.error("Error during data fetching:", error);
    }
  }

  useEffect(() => {
    setUp();
  }, [courseId]);

  // function createRating(courseId) {
  //   const response = await fetch(`http://api/v1/course/${courseId}/ratings`, {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Bearer ${jwt}`,
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //     },
  //   })
  // }




  return (
    <div>
      {/* <AppNavbar /> */}
      <div className="margin-left">
      <text> Add your rating </text>
      <button
        //onClick={() => createRating(courseId)}
        className="auth-button blue margin-left"
      >
        Create
      </button>

      <hr className="custom-hr" />

        {ratings.length > 0 ? (
          ratings.map((rating) => (
            <div key={rating.id} className="rating-row">
              <div className="rating-data">
              <div>
                <span>
                  <strong>Username:</strong> {rating.username}
                </span>
              </div>
              <div>
                <span>
                  <strong>Descripción:</strong> {rating.description}
                </span>
              </div>
              <div>
                <span>
                  <strong>Valoración:</strong> {rating.rating}
                </span>
              </div>
              <div>
                <span>
                  <strong>Fecha:</strong> {rating.date}
                </span>
              </div>
            </div>
            </div>
          ))
        ) : (
          <p>No hay valoraciones disponibles</p>
        )}
      </div>
    </div>
  );
}

export default RatingList;
