document.addEventListener('DOMContentLoaded', () => {
  const reviews = document.querySelectorAll('.review');

  reviews.forEach(review => {
    const stars = review.querySelectorAll('.star'); 
    let clickedIndex = -1; 

    stars.forEach(star => {
      star.addEventListener('mouseover', () => {
        if (clickedIndex === -1) { 
          const index = parseInt(star.dataset.index); 

          stars.forEach((s, i) => {
            if (i < index) {
              s.classList.add('filled');
            } else {
              s.classList.remove('filled');
            }
          });
        }
      });

      star.addEventListener('mouseleave', () => {
        if (clickedIndex === -1) {
          stars.forEach(s => {
            s.classList.remove('filled');
          });
        }
      });

      star.addEventListener('click', () => {
        const index = parseInt(star.dataset.index);
        clickedIndex = index; 

        stars.forEach((s, i) => {
          if (i < index) {
            s.classList.add('filled');
          } else {
            s.classList.remove('filled');
          }
        });
      });
    });
  });
});
