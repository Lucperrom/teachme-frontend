import React from "react";
import { useState, useEffect, useRef } from "react";

function RatingList(){
    let pathArray = window.location.pathname.split("/");
    let [ratings, setRatings] = useState([]);
    const [courseId, setCourseId] = useState(pathArray[1])

    async function setUp(){
        try{
            console.log("AAAAA")
            let response = await fetch(`https://teachme5.onrender.com/api/v1/course/{courseId}ratings`,{
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }
        console.log("BBBBB")
        console.log(response)
        let ratings = await response.json();
        setRatings(ratings);
    }
    catch (error){
        console.error("Error during data fetching:", error);
    }
    }
    useEffect(() => {
        setUp();
    },);

    return (
        <div>
          {/* <AppNavbar /> */}
          
        <div>
        </div>
            {ratings && ratings.length > 0 ? (
              ratings.map((rating) => {
                return (
                  <div key={rating.id}>
                    <div >
                      <span>
                        <strong>Descripcion:</strong> {rating.description}
                      </span>
                      <div>
                      <span>
                        <strong>Valoracion:</strong> {rating.rating}
                      </span>
                      </div>
                      <div>
                      <span>
                        <strong>Fecha:</strong> {rating.date}
                      </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No hay valoraciones disponibles</p>
            )}
          </div>
      );
}





export default RatingList;