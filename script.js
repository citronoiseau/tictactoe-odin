const GameBoard = (function () {
  const gameBoard = [];
  const rows = 3;
  const columns = 3;

  for (let i = 0; i < rows; i++) {
    gameBoard[i] = [];
    for (let j = 0; j < columns; j++) {
      gameBoard[i].push(Cell());
    }
  }

  const getBoard = () => gameBoard;

  console.log("Creating board...");

  const displayBoard = function () {
    for (let row = 0; row < rows; row++) {
      let cell = " ";
      for (let column = 0; column < columns; column++) {
        cell += gameBoard[row][column].getValue() || " ";

        if (column < columns - 1) {
          cell += " | ";
        }
      }
      console.log(cell);
      if (row < rows - 1) {
        console.log("---------");
      }
    }
  };
  displayBoard();
  console.log(`Players turn! To play enter play(x, y)`);

  const resetBoard = function () {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        gameBoard[i][j].setValue(" ");
      }
    }
  };
  return {
    getBoard,
    displayBoard,
    resetBoard,
  };
})();

function Cell() {
  let value = " ";
  const getValue = () => value;

  const setValue = function (sign) {
    value = sign;
  };

  return {
    getValue,
    setValue,
  };
}

const gameController = (function () {
  const players = [
    {
      name: "Player",
      sign: "X",
      moves: [],
    },
    {
      name: "Bot",
      sign: "O",
      moves: [],
    },
  ];
  let rounds = 1;
  let activePlayer = players[0];

  const switchTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
    console.log(`${activePlayer.name}s turn! To play enter play(x, y)`);
  };
  const handleRounds = function () {
    GameBoard.displayBoard();
    if (checkWin()) {
      console.log("Game over!");
      resetGame();
    } else {
      rounds++;
      switchTurn();
      if (activePlayer.name === "Bot") {
        botPlay();
      }
    }
  };

  const checkWin = function () {
    const conditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    const playerMoves = activePlayer.moves;
    for (const toWin of conditions) {
      if (toWin.every((index) => playerMoves.includes(index))) {
        console.log(`${activePlayer.name} wins!`);
        return true;
      }
    }
    if (gameController.rounds === 9) {
      console.log(`It's a draft!`);
      return true;
    }
    return false;
  };

  const resetGame = function () {
    GameBoard.resetBoard();
    players.forEach((player) => {
      player.moves = [];
    });

    activePlayer = players.find((player) => player.sign === "X");
    console.log(`New game has started!`);
    GameBoard.displayBoard();
    console.log(`${activePlayer.name}s turn! To play enter play(x, y)`);
  };
  const getActivePlayer = () => activePlayer;
  return {
    getActivePlayer,
    handleRounds,
  };
})();

function play(row, column) {
  const cell = GameBoard.getBoard()[row][column];
  const activePlayer = gameController.getActivePlayer();
  if (cell.getValue() === " ") {
    if (row >= 0 && row < 3 && column >= 0 && column < 3) {
      cell.setValue(activePlayer.sign);
      const moveIndex = row * 3 + column;
      activePlayer.moves.push(moveIndex);
      console.log(
        `${activePlayer.name}: row ${row}, column ${column}, sign "${activePlayer.sign}"`
      );
      gameController.handleRounds();
    } else {
      console.log(`Only 0-2 rows and 0-2 columns are available!`);
    }
  } else {
    console.log("Cell already occupied. Try again.");
  }
}

function botPlay() {
  const availableCells = [];
  const board = GameBoard.getBoard();

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j].getValue() === " ") {
        availableCells.push({ row: i, column: j });
      }
    }
  }

  const randomIndex = Math.floor(Math.random() * availableCells.length);
  const botMove = availableCells[randomIndex];

  play(botMove.row, botMove.column);
}
