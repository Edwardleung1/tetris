document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  // Turn all the divs into an array
  let squares = Array.from(document.querySelectorAll('.grid div'));
  const scoreDisplay = document.querySelector('#score');
  const startBtn = document.querySelector('#start-button');
  const width = 10;
  let nextRandom = 0;
  let timerId;
  let score = 0

  // The Tetrominoes
  // 4 rotations in each array
  const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]

  const zTetromino = [
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1]
  ]

  const tTetromino = [
    [1, width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2, width*2+1],
    [1, width, width+1, width*2+1]
  ]

  const oTetromino = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1]
  ]

  const iTetromino = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3]
  ]

  // Array of tetrominoes
  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

  let currentPosition = 4;
  let currentRotation = 0;

  // Randomly select a tetromino and its first rotation
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  // Draw the tetromino and its first rotation
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino');
    })
  }

  // Undraw the tetromino
  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino');
    })
  }

  // Make the tetromino move down every second
  // timerId = setInterval(moveDown, 1000) 

  // Assign functions to keyCodes
  function control(e) {
    if(e.keyCode === 37 || e.keyCode === 65) {
      moveLeft()
    } else if (e.keyCode === 38 || e.keyCode === 87) {
      rotate()
    } else if (e.keyCode === 39 || e.keyCode === 68) {
      moveRight()
    } else if (e.keyCode === 40 || e.keyCode === 83) {
      moveDown()
    }
  }

  document.addEventListener('keyup', control)

  // Move down function
  function moveDown() {
    undraw()
    currentPosition += width
    draw()
    freeze()
  }

  // Freeze function
  function freeze() {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      // Start a new tetromino falling
      random = nextRandom
      // New random value being passed down
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw()
      displayShape()
      addScore()
    }
  }

  // Move the tetromino left, unless is at the edge or there is a blockage
  function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

    // Move position if its not in the left edge
    if(!isAtLeftEdge) currentPosition -= 1;

    // Stop if theres already another tetromino
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition += 1;
    }

    draw()
  }

  // Move the tetromino right, unless is at the edge or there is a blockage
  function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)

    // Move position if its not in the right edge
    if(!isAtRightEdge) currentPosition += 1;

    // Stop if theres already another tetromino
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -= 1;
    }

    // Re-draw tetromino in its new position
    draw()
  }

  // Rotate the tetromino
  function rotate() {
    undraw()
    // Move down to the next item array rotation
    currentRotation ++

    // Go back to the first item array rotation, if the current rotation gets to 4
    if(currentRotation === current.length) {
      currentRotation = 0
    }
    
    // Randomly select a tetromino and its first rotation 
    current = theTetrominoes[random][currentRotation]

    // Then draw it
    draw()
  }


  // Show up-next tetromino in mini-grid display
  // Not using array.from this time, this is another approach
  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  let displayIndex = 0

  // The 5 Tetrominoes without rotations
  const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
    [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
    [0, 1, displayWidth, displayWidth+1], //oTetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
  ]

  // Display the shape in the mini-grid display
  function displayShape() {
    // Remove any trace of a tetromino form in the entire grid
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
    })
    upNextTetrominoes[nextRandom].forEach( index => {
      displaySquares[displayIndex + index].classList.add('tetromino')
    })
  }

  // Add functionality to the button 
  startBtn.addEventListener('click', () => {
    // If timeId value is not null we pause the game
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      // When the start btn is pressed
      draw()
      timerId = setInterval(moveDown, 1000)
      // Select next random shape on mini-grid
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      displayShape()
    }
  })


  // Add score
  function addScore() {
    for (let i = 0; i < 199; i +=width) {
      // Every square that makes up a row
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

      // Check if every square in row contains taken
      if(row.every(index => squares[index].classList.contains('taken'))) {
        score +=10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
        })
        const squaresRemoved = squares.splice(i, width)
        // Append squares back onto our grid
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }


});
