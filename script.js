const GameBoard = (function () {
  const gameBoard = ["", "", "", "", "", "", "", "", ""];
  const getBoard = () => gameBoard;

  const setCell = (index, sign) => {
    gameBoard[index] = sign;
  };
  const getCell = (index) => {
    return gameBoard[index];
  };

  const resetBoard = function () {
    for (let i = 0; i < gameBoard.length; i++) {
      gameBoard[i] = "";
    }
  };
  return {
    getBoard,
    setCell,
    getCell,
    resetBoard,
  };
})();

const displayDOM = function () {
  const cells = document.querySelectorAll(".boardCell");
  cells.forEach((cell, index) => {
    cell.textContent = GameBoard.getCell(index) || "";
    cell.addEventListener("click", () => gameController.playRound(index));
  });
};

const handlePlayers = (function () {
  const players = [
    {
      name: "Xan",
      status: "Player",
      sign: "X",
      moves: [],
    },
    {
      name: "Ola",
      status: "Bot",
      sign: "O",
      moves: [],
    },
  ];

  let activePlayer = players[0];
  const getActivePlayer = () => activePlayer;
  const getPlayers = () => players;

  const setPlayer = function (playerIndex, status) {
    players[playerIndex].status = status;
    console.log(players[playerIndex]);
  };

  const switchTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
    console.log(`${activePlayer.name}'s turn! To play enter play(x, y)`);
    return activePlayer;
  };
  return {
    getActivePlayer,
    getPlayers,
    setPlayer,
    switchTurn,
  };
})();

const gameController = (function () {
  let activePlayer = handlePlayers.getActivePlayer();
  let rounds = 1;
  let isWin = false;

  const playRound = function (index) {
    activePlayer = handlePlayers.getActivePlayer();
    if (isWin || GameBoard.getCell(index) !== "") return;
    GameBoard.setCell(index, activePlayer.sign);
    activePlayer.moves.push(index);
    handleRounds();
  };

  const handleRounds = function () {
    displayDOM();
    if (checkWin()) {
      console.log("Game over!");
      //   resetGame();
    } else {
      rounds++;
      if (rounds <= 9) {
        handlePlayers.switchTurn();
        activePlayer = handlePlayers.getActivePlayer();
        if (activePlayer.status === "Bot") {
          botPlay();
        }
      } else {
        console.log("It's a draw!");
        // resetGame();
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
        isWin = true;
        return true;
      }
    }
    return false;
  };

  const initializeGame = function () {
    displayDOM();
  };

  const resetGame = function () {
    GameBoard.resetBoard();
    handlePlayers.getPlayers().forEach((player) => {
      player.moves = [];
    });

    activePlayer = handlePlayers
      .getPlayers()
      .find((player) => player.sign === "X");
    displayDOM();
  };

  return {
    handleRounds,
    initializeGame,
    playRound,
  };
})();

function botPlay() {
  console.log("Bot is called!");
  const availableCells = [];
  const board = GameBoard.getBoard();

  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      availableCells.push(i);
    }
  }

  const randomIndex = Math.floor(Math.random() * availableCells.length);
  const botMove = availableCells[randomIndex];
  gameController.playRound(botMove);
}

const toggleActivePlayer = function (playerBtn, botBtn, index) {
  const player = handlePlayers.getPlayers();
  if (player[index].status === "Player") {
    playerBtn.classList.add("active");
    botBtn.classList.remove("active");
  } else {
    botBtn.classList.add("active");
    playerBtn.classList.remove("active");
  }
};

const setPlayers = (function () {
  const setPlayerFirstBtn = document.querySelector("#choosePlayerOne");
  const setBotFirstBtn = document.querySelector("#chooseBotOne");

  const setPlayerSecondBtn = document.querySelector("#choosePlayerTwo");
  const setBotSecondBtn = document.querySelector("#chooseBotTwo");

  setPlayerFirstBtn.addEventListener("click", () => {
    handlePlayers.setPlayer(0, "Player");
    toggleActivePlayer(setPlayerFirstBtn, setBotFirstBtn, 0);
  });
  setBotFirstBtn.addEventListener("click", () => {
    handlePlayers.setPlayer(0, "Bot");
    toggleActivePlayer(setPlayerFirstBtn, setBotFirstBtn, 0);
  });
  setPlayerSecondBtn.addEventListener("click", () => {
    handlePlayers.setPlayer(1, "Player");
    toggleActivePlayer(setPlayerSecondBtn, setBotSecondBtn, 1);
  });
  setBotSecondBtn.addEventListener("click", () => {
    handlePlayers.setPlayer(1, "Bot");
    toggleActivePlayer(setPlayerSecondBtn, setBotSecondBtn, 1);
  });
})();

const changeScreens = (function () {
  const titleScreen = document.querySelector(".titleScreen");
  const boardScreen = document.querySelector(".boardScreen");
  const startGameBtn = document.querySelector("#startGameBtn");
  startGameBtn.addEventListener("click", function () {
    titleScreen.classList.add("titleHidden");

    setTimeout(() => {
      titleScreen.style.display = "none";
      boardScreen.style.display = "flex";
      boardScreen.classList.remove("boardScreenHidden");
      gameController.initializeGame();
    }, 500);
  });
})();
