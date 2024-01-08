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

const displayDOM = (function () {
  const cells = document.querySelectorAll(".boardCell");
  const gameMessage = document.querySelector(".setMessage");
  const restartBtn = document.querySelector(".restartBtn");
  const startNewRoundBtn = document.querySelector(".startNewRound");

  const xanScore = document.querySelector(".xanScore");
  const olaScore = document.querySelector(".olaScore");
  const roundCounter = document.querySelector(".roundCounter");

  cells.forEach((cell, index) => {
    cell.addEventListener("click", () => gameController.playRound(index));
  });

  const updateBoard = () => {
    for (let i = 0; i < cells.length; i++) {
      cells[i].textContent = GameBoard.getCell(i);
    }
  };

  const setGameMessage = (text) => {
    gameMessage.textContent = text;
  };

  const setXanScore = (score) => {
    xanScore.textContent = score;
  };
  const setOlaScore = (score) => {
    olaScore.textContent = score;
  };
  const setRoundCounter = (round) => {
    roundCounter.textContent = `Round ${round}`;
  };
  restartBtn.addEventListener("click", () => gameController.resetGame());
  startNewRoundBtn.addEventListener("click", () =>
    gameController.startNewRound()
  );
  return {
    updateBoard,
    setGameMessage,
    setXanScore,
    setOlaScore,
    setRoundCounter,
  };
})();

const handlePlayers = (function () {
  const players = [
    {
      name: "Xan",
      status: "Player",
      sign: "X",
      moves: [],
      score: 0,
    },
    {
      name: "Ola",
      status: "Bot",
      sign: "O",
      moves: [],
      score: 0,
    },
  ];
  let activePlayer = players[0];
  const getActivePlayer = () => activePlayer;
  const getPlayers = () => players;

  const setPlayer = function (playerIndex, status) {
    players[playerIndex].status = status;
  };

  const setActivePlayer = function () {
    activePlayer = players[0];
    return activePlayer;
  };
  const switchTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
    if (players[0].status === "Bot" && players[1].status === "Bot") {
      botMoveWait = setTimeout(() => {
        displayDOM.setGameMessage(`${activePlayer.name}'s turn!`);
      }, 500);
    } else {
      displayDOM.setGameMessage(`${activePlayer.name}'s turn!`);
    }

    return activePlayer;
  };
  return {
    getActivePlayer,
    setActivePlayer,
    getPlayers,
    setPlayer,
    switchTurn,
  };
})();

const gameController = (function () {
  let activePlayer = handlePlayers.getActivePlayer();
  let rounds = 1;
  let generalRounds = 1;
  let isWin = false;
  let botMoveWait;

  const playRound = function (index) {
    activePlayer = handlePlayers.getActivePlayer();
    if (isWin || GameBoard.getCell(index) !== "") return;
    GameBoard.setCell(index, activePlayer.sign);
    activePlayer.moves.push(index);
    clearTimeout(botMoveWait);
    handleRounds();
  };

  const handleRounds = function () {
    displayDOM.updateBoard();
    if (checkWin()) {
    } else {
      rounds++;
      if (rounds <= 9) {
        handlePlayers.switchTurn();
        activePlayer = handlePlayers.getActivePlayer();
        if (activePlayer.status === "Bot") {
          botMoveWait = setTimeout(() => {
            botPlay();
          }, 500);
        }
      } else {
        displayDOM.setGameMessage("It's a draw!");
      }
    }
  };
  isWin = false;

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
        displayDOM.setGameMessage(`${activePlayer.name} wins!`);
        activePlayer.score++;
        displayDOM[`set${activePlayer.name}Score`](activePlayer.score);
        isWin = true;
        return true;
      }
    }
    return false;
  };

  const resetGame = function () {
    GameBoard.resetBoard();
    displayDOM.updateBoard();
    clearTimeout(botMoveWait);
    isWin = false;
    rounds = 1;
    generalRounds = 1;
    displayDOM.setRoundCounter(1);
    handlePlayers.setActivePlayer();
    displayDOM.setGameMessage(
      `${handlePlayers.getActivePlayer().name}'s turn!`
    );
    handlePlayers.getPlayers().forEach((player) => {
      player.moves = [];
      player.score = 0;
    });
    displayDOM.setXanScore(0);
    displayDOM.setOlaScore(0);
    if (handlePlayers.getActivePlayer().status === "Bot") {
      botMoveWait = setTimeout(() => {
        botPlay();
      }, 700);
    }
  };

  const startNewRound = function () {
    GameBoard.resetBoard();
    displayDOM.updateBoard();
    clearTimeout(botMoveWait);
    isWin = false;
    rounds = 1;
    generalRounds++;
    displayDOM.setRoundCounter(generalRounds);
    handlePlayers.setActivePlayer();
    displayDOM.setGameMessage(
      `${handlePlayers.getActivePlayer().name}'s turn!`
    );
    handlePlayers.getPlayers().forEach((player) => {
      player.moves = [];
    });
    if (handlePlayers.getActivePlayer().status === "Bot") {
      botMoveWait = setTimeout(() => {
        botPlay();
      }, 500);
    }
  };

  return {
    handleRounds,
    playRound,
    resetGame,
    startNewRound,
  };
})();

function botPlay() {
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
  const returnScreenBtn = document.querySelector(".returnBtn");

  startGameBtn.addEventListener("click", function () {
    titleScreen.classList.add("titleHidden");

    setTimeout(() => {
      boardScreen.classList.remove("boardScreenHidden");
      titleScreen.classList.add("scrollbarHidden");
      boardScreen.classList.remove("scrollbarHidden");
    }, 500);
    gameController.resetGame();
  });

  returnScreenBtn.addEventListener("click", function () {
    boardScreen.classList.add("boardScreenHidden");

    setTimeout(() => {
      titleScreen.classList.remove("titleHidden");
      titleScreen.classList.remove("scrollbarHidden");
      boardScreen.classList.add("scrollbarHidden");
    }, 500);
  });
})();
