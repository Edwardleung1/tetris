document.addEventListener('DOMContentLoader', () => {
  const grid = document.querySelector('.grid');
  // Turn all the divs into an array
  let squares = Array.from(document.querySelectorAll('.grid div'));
  const width = 10;

  console.log(squares);
});