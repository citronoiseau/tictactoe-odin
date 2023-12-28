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

function gameController() {
  const players = [
    {
      name: playerOneName,
      sign: "X",
    },
    {
      name: playerTwoName,
      sign: "O",
    },
  ];
}

function play(row, column, sign) {
  const cell = GameBoard.getBoard()[row][column];

  if (cell.getValue() === " ") {
    if (row >= 0 && row < 3 && column >= 0 && column < 3) {
      cell.setValue(sign);
      console.log(`Player: row ${row}, column ${column}, sign ${sign}`);
      GameBoard.displayBoard();
    } else {
      console.log(`Only 3 rows and 3 columns are available!`);
    }
  } else {
    console.log("Cell already occupied. Try again.");
  }
}
