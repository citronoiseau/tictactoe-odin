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
    for (let column = 0; column < columns; column++) {
      let cell = " ";
      for (let row = 0; row < rows; row++) {
        cell += gameBoard[row][column].getValue() || " ";

        if (row < rows - 1) {
          cell += " | ";
        }
      }
      console.log(cell);
      if (column < columns - 1) {
        console.log("---------");
      }
    }
  };
  displayBoard();
  console.log(`Players turn! To play enter play(x, y)`);

  return {
    getBoard,
    displayBoard,
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
      name: "player",
      sign: "X",
    },
    {
      name: "bot",
      sign: "O",
    },
  ];

  let activePlayer = players[0];

  const switchTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;
  return {
    switchTurn,
    getActivePlayer,
  };
})();

function play(row, column) {
  const cell = GameBoard.getBoard()[row][column];
  const activePlayer = gameController.getActivePlayer();
  if (cell.getValue() === " ") {
    if (row >= 0 && row < 3 && column >= 0 && column < 3) {
      cell.setValue(activePlayer.sign);
      console.log(
        `${activePlayer.name}: row ${row}, column ${column}, sign ${activePlayer.sign}`
      );
      GameBoard.displayBoard();
      gameController.switchTurn();
    } else {
      console.log(`Only 3 rows and 3 columns are available!`);
    }
  } else {
    console.log("Cell already occupied. Try again.");
  }
}
