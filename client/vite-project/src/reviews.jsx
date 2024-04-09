import { error } from "console";
import React, { useEffect, useState } from "react";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/reviews`) 
    .then(response => response.json())
    .then(data => setReviews(data))
    .catch(error => console.error('Error fetching data', error));
  }, []);
  
  fetch(`${import.meta.env.VITE_BACKEND_URL}/reviews/mine`, {
  headers: {
    'Authorization': `Bearer ${userToken}`
  }
})
.then(response => response.json())
.then(data => console.log(data));


  return (
    <div>
      <h2>Reviews</h2>
      {reviews.map(review => (
       <div key={review.id}>
        <h3>{review.item.name}</h3>
        <p>Rating: {review.rating}</p>
        <p>{review.text}</p>
        <p>By: {review.user.name}</p>
      </div>
      ))}
    </div>
  );
};

export default Reviews;