const grid = document.querySelector('.grid');
let squares = Array.from(document.querySelectorAll('.grid div')); // Turn all the divs into an array
const scoreDisplay = document.querySelector('#score');
const startBtn = document.querySelector('#start-button');
const restartBtn = document.querySelector('#restart-button');  
const width = 10;
let nextRandom = 0;
let timerId;
let score = 0
const colors = [
  'DeepSkyBlue',
  'LimeGreen',
  'DarkViolet',
  'Yellow',
  'Blue',
  'DarkOrange',
  'crimson',
];

  // The Tetrominoes, 4 rotations in each array
  const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ];

  const zTetromino = [
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1]
  ];

  const tTetromino = [
    [1, width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2, width*2+1],
    [1, width, width+1, width*2+1]
  ];

  const oTetromino = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1]
  ];

  const iTetromino = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3]
  ];

  const lAltTetromino = [
    [0, 1, width + 1, width * 2 + 1],
    [width + 2, width * 2 + 2, width * 2 + 1, width * 2],
    [1, width + 1, width * 2 + 1, width * 2 + 2],
    [width + 2, width + 1, width, width * 2],
  ];
  
  const zAltTetromino = [
    [2, width + 2, width + 1, width * 2 + 1],
    [width + 1, width, width * 2 + 2, width * 2 + 1],
    [2, width + 2, width + 1, width * 2 + 1],
    [width + 1, width, width * 2 + 2, width * 2 + 1],
  ];

  // Array of tetrominoes
  const theTetrominoes = [
    lTetromino, 
    zTetromino, 
    tTetromino, 
    oTetromino, 
    iTetromino,
    lAltTetromino,
    zAltTetromino,
  ];

  let currentPosition = 4;
  let currentRotation = 0;

  // Randomly select a tetromino and its first rotation
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  // Draw the tetromino in its first rotation
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino');
      squares[currentPosition + index].style.backgroundColor = colors[random];
    });
  }

  // Undraw the tetromino
  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino');
      squares[currentPosition + index].style.backgroundColor = '';
    });
  }

  // Assign functions to keyCodes
  function control(e) {
    if(e.keyCode === 37 || e.keyCode === 65) {
      moveLeft();
    } else if (e.keyCode === 38 || e.keyCode === 87) {
      rotate();
    } else if (e.keyCode === 39 || e.keyCode === 68) {
      moveRight();
    } else if (e.keyCode === 40 || e.keyCode === 83) {
      moveDown();
    }
  }
  document.addEventListener('keydown', control)

  // Move down function
  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }

  // Freeze function
  function freeze() {
    if (
      current.some(index => 
        squares[currentPosition + index + width].classList.contains('taken')
        )
      ) {
        current.forEach(index => 
          squares[currentPosition + index].classList.add('taken')
        );

      // Start a new tetromino falling
      random = nextRandom;
      // New random value being passed down
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }

  // Move the tetromino left, unless is at the edge or there is a blockage
  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);

    // Move position if its not in the left edge
    if (!isAtLeftEdge) currentPosition -= 1;

    // Stop if theres already another tetromino
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition += 1;
    }

    draw();
  }

  // Move the tetromino right, unless is at the edge or there is a blockage
  function moveRight() {
    undraw();
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1);

    // Move position if its not in the right edge
    if(!isAtRightEdge) currentPosition += 1;

    // Stop if theres already another tetromino
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -= 1;
    }

    draw();
  }

  // Rotate the tetromino
  function rotate() {
    undraw();
    // Move down to the next item array rotation
    currentRotation++;

    // Go back to the first item array rotation, if the current rotation gets to 4
    if (currentRotation === current.length) {
      currentRotation = 0;
    }
    // Randomly select a tetromino and its first rotation 
    current = theTetrominoes[random][currentRotation];
    draw();
  }

  // Show up-next tetromino in mini-grid display
  const displaySquares = document.querySelectorAll('.mini-grid div');
  const displayWidth = 4;
  const displayIndex = 0;

  // The Tetrominoes without rotations
  const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
    [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
    [0, 1, displayWidth, displayWidth+1], //oTetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1], //iTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, 0], //lAltTetromino
    [2, displayWidth + 2, displayWidth + 1, displayWidth * 2 + 1], //zAltTetromino
  ];

  // Display the shape in the mini-grid display
  function displayShape() {
    // Remove any trace of a tetromino form in the entire grid
    displaySquares.forEach(square => {
      square.classList.remove('tetromino');
      square.style.backgroundColor = '';
    });
    upNextTetrominoes[nextRandom].forEach( index => {
      displaySquares[displayIndex + index].classList.add('tetromino');
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
    });
  }

  // Add functionality to the button 
  startBtn.addEventListener('click', () => {
    // If timeId value is not null we pause the game
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
      startBtn.innerHTML = 'PLAY <i class="far fa-play-circle"></i>';
      playButton.innerHTML = 'MUTE <i class="fas fa-volume-mute"></i>';
      audio.pause();
    } else {
      // When the start btn is pressed
      draw();
      timerId = setInterval(moveDown, 500);
      // Select next random shape on mini-grid
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      displayShape();
      startBtn.innerHTML = 'PAUSE <i class="far fa-pause-circle"></i>';
      playButton.innerHTML = 'ON <i class="fas fa-volume-up"></i>';
      audio.play();
    }
  });

  // Add score
  function addScore() {
    for (let i = 0; i < 199; i += width) {
      // Every square that makes up a row
      const row = [
        i,
        i+1,
        i+2,
        i+3,
        i+4,
        i+5,
        i+6,
        i+7,
        i+8,
        i+9,
      ];

      // Check if every square in row contains taken
      if(row.every(index => squares[index].classList.contains('taken'))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach(index => {
          squares[index].classList.remove('taken');
          squares[index].classList.remove('tetromino');
          squares[index].style.backgroundColor = '';
        });
        const squaresRemoved = squares.splice(i, width);
        // Append squares back onto our grid
        squares = squaresRemoved.concat(squares);
        squares.forEach(cell => grid.appendChild(cell));
      }
    }
  }

  // Game over
  function gameOver() {
    if(
      current.some(index => 
        squares[currentPosition + index].classList.contains('taken')
      )
    ) {
      scoreDisplay.innerHTML = `You scored ${score} points. <br> Game Over.`;
      document.getElementById("start-button").disabled = true;
      document.getElementById("play-button").disabled = true;

      clearInterval(timerId);
    }
  }

  // Restart
  restartBtn.addEventListener('click', () => {
    window.location.reload();
  });

  // Play & Pause
  const playButton = document.getElementById('play-button');
  const audio = document.getElementById('player');

  playButton.addEventListener('click', function () {
    if (audio.paused) {
      audio.play();
      playButton.innerHTML = 'ON <i class="fas fa-volume-up"></i>';
    } else {
      audio.pause();
      playButton.innerHTML = 'MUTE <i class="fas fa-volume-mute"></i>';
    } 
});
