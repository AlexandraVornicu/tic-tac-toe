let gameTurn = 0;
let currentPlayer;
let currentPlayerXO;
let board;
let isPlayerXHuman;
let isPlayerYHuman;

function gameEndHideEl() {
  setHTMLvisibilityForInputGameMode(false);
  setHTMLvisibilityForInputHumanCoordinates(false);
  setHTMLvisibilityForInputAiCoordinatesInput(false);
  setHTMLvisibilityForButtonLabeledReset(true);
}

function setGameMode(selectedValue) {
  switch (selectedValue) {
    case "human-human":
      isPlayerXHuman = true;
      isPlayerYHuman = true;
      setHTMLvisibilityForInputHumanCoordinates(true);
      setHTMLvisibilityForInputAiCoordinatesInput(false);
      break;
    case "human-ai":
      isPlayerXHuman = true;
      isPlayerYHuman = false;
      setHTMLvisibilityForInputHumanCoordinates(true);
      setHTMLvisibilityForInputAiCoordinatesInput(false);
      break;
    case "ai-ai":
      isPlayerXHuman = false;
      isPlayerYHuman = false;
      setHTMLvisibilityForInputHumanCoordinates(false);
      setHTMLvisibilityForInputAiCoordinatesInput(true);
      break;
  }
  resetBoard();
  setHTMLvisibilityForInputGameMode(false);
  setHTMLvisibilityForButtonLabeledReset(true);
  displayMessage("Player X's turn");
}

function isInputValid(string) {

  const inputLength = string.length === 2
  const validStr = ["A", "B", "C"].includes(string.charAt(0))
  const validInt = ["1", "2", "3"].includes(string.charAt(1))
  // const validInt = parseInt(string.substring(1)) < 4 ? true : false;
  // let validStr = false;
  // if (
  //   string.substring(0, 1) === "A" ||
  //   string.substring(0, 1) === "B" ||
  //   string.substring(0, 1) === "C"
  // ) {
  //   validStr = true;
  // }
  // return validInt && validStr;
  return inputLength && validStr && validInt
}

function updateHTMLvisibility() {
  const isCurrentPlayerHuman =
    currentPlayerXO !== "X" ? isPlayerXHuman : isPlayerYHuman;
  setHTMLvisibilityForInputHumanCoordinates(isCurrentPlayerHuman);
  setHTMLvisibilityForInputAiCoordinatesInput(!isCurrentPlayerHuman);
}

function setCurrentPlayer() {
  if (gameTurn % 2 === 0) {
    currentPlayer = "diamond";
    currentPlayerXO = "X";
    displayMessage("Player O's turn");
  } else {
    currentPlayer = "pets";
    currentPlayerXO = "O";
    displayMessage("Player X's turn");
  }
}

function processHumanCoordinate(input) {
  setCurrentPlayer();
  updateHTMLvisibility();
  let coordinates = extractCoordinates(input);
  if (!isInputValid(input)) {
    setHTMLvisibilityForInputHumanCoordinates(true);
    setHTMLvisibilityForInputAiCoordinatesInput(false);
  }
  if (!board[coordinates.x][coordinates.y]) {
    board[coordinates.x][coordinates.y] = currentPlayer;
    gameTurn++;
  } else {
    displayMessage("Position is already taken on board");
    setHTMLvisibilityForInputHumanCoordinates(true);
    setHTMLvisibilityForInputAiCoordinatesInput(false);
  }

  const winningPlayer = getWinningPlayer(board);
  if (winningPlayer) {
    displayMessage(`Player ${currentPlayerXO} has won !`);
  }
  if (gameTurn === 9 && !winningPlayer) {
    displayMessage("It's a tie!");
    gameEndHideEl();
  }
  displayBoard(board);
}

function calcAiIndex(arr, currentPlayer) {
  let count = 0;
  let oneEmptyStr = false;
  let index;
  count = arr.reduce(
    (acc, curr) => (curr === currentPlayer ? acc + 1 : acc),
    0
  );
  oneEmptyStr = arr.some((element) => element === "");
  index = arr.indexOf("");
  if (count === 2 && oneEmptyStr) {
    return index;
  }
  return undefined;
}

function findEasyWinMove(map, currentPlayer) {
  let mainDiagonal = [];
  let secondaryDiagonal = [];
  for (let i = 0; i < map.length; i++) {
    if (calcAiIndex(map[i], currentPlayer) !== undefined) {
      return { x: i, y: calcAiIndex(map[i], currentPlayer) };
    }
  }
  for (let i = 0; i < map.length; i++) {
    const column = map.map((row) => row[i]);
    if (calcAiIndex(column, currentPlayer) !== undefined) {
      return { x: calcAiIndex(column, currentPlayer), y: i };
    }
  }
  for (let i = 0; i < map.length; i++) {
    mainDiagonal.push(map[i][i]);
    secondaryDiagonal.push(map[i][map.length - 1 - i]);
  }
  if (calcAiIndex(mainDiagonal, currentPlayer) !== undefined) {
    return {
      x: calcAiIndex(mainDiagonal, currentPlayer),
      y: calcAiIndex(mainDiagonal, currentPlayer),
    };
  }
  if (calcAiIndex(secondaryDiagonal, currentPlayer) !== undefined) {
    return {
      x: calcAiIndex(secondaryDiagonal, currentPlayer),
      y: board.length - 1 - calcAiIndex(secondaryDiagonal, currentPlayer),
    };
  }
  return undefined;
}

function findMiddleBlock(map) {
  if (map[1][1] === "") {
    return { x: 1, y: 1 };
  }
  return undefined;
}

function findCorners(map) {
  let corners = [
    { x: 0, y: 0 },
    { x: 0, y: 2 },
    { x: 2, y: 0 },
    { x: 2, y: 2 },
  ];
  let emptyCorners = [];
  for (let corner of corners) {
    if (map[corner.x][corner.y] === "") {
      emptyCorners.push(corner);
    }
  }
  if (findOppositeCorner(map)) {
    return findOppositeCorner(map);
  }
  if (emptyCorners.length > 0) {
    return emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
  }
  return undefined;
}

function findOppositeCorner(map) {
  let corners = [
    { x: 0, y: 0, opposite: { x: 2, y: 2 } },
    { x: 0, y: 2, opposite: { x: 2, y: 0 } },
  ];
  for (const corner of corners) {
    const { x, y, opposite } = corner;
    if (map[x][y] === "diamond" && map[opposite.x][opposite.y] === "diamond") {
      let sides = [
        { x: 0, y: 1 },
        { x: 1, y: 0 },
        { x: 1, y: 2 },
        { x: 2, y: 1 },
      ];
      for (let side of sides) {
        if (map[side.x][side.y] === "") {
          return side;
          break;
        }
      }
    }
  }
  return undefined;
}

function getUnbeatableAiCoordinates(map) {
  if (findEasyWinMove(map, "pets") !== undefined) {
    return findEasyWinMove(map, "pets");
  } else if (findEasyWinMove(map, "diamond") !== undefined) {
    return findEasyWinMove(map, "diamond");
  }

  if (findMiddleBlock(map)) {
    return findMiddleBlock(map);
  }
  let corner = findCorners(map);
  if (corner) {
    return corner;
  }
  return undefined;
}

function processAICoordinate() {
  setCurrentPlayer();
  updateHTMLvisibility();
  let unbeatable = getUnbeatableAiCoordinates(board);
  if (unbeatable) {
    let x = unbeatable.x;
    let y = unbeatable.y;
    board[x][y] = currentPlayer;
  } else {
    let emptyBoard = [];
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (!board[i][j]) {
          let empty = {
            x: i,
            y: j,
          };
          emptyBoard.push(empty);
        }
      }
    }
    let random = Math.floor(Math.random() * emptyBoard.length);
    board[emptyBoard[random].x][emptyBoard[random].y] = currentPlayer;
  }

  gameTurn++;
  displayBoard(board);

  const winningPlayer = getWinningPlayer(board);
  if (winningPlayer) {
    displayMessage(`Player ${currentPlayerXO} has won !`);
    gameEndHideEl()
  }
  if (gameTurn === 9 && !winningPlayer) {
    displayMessage("It's a tie!");
    gameEndHideEl();
  }
}

function resetGame() {
  // resetBoard();
  // displayBoard(board);
  // gameTurn = 0;
  // setHTMLvisibilityForInputGameMode(true);
  // setHTMLvisibilityForInputHumanCoordinates(false);
  // setHTMLvisibilityForInputAiCoordinatesInput(false);
  // setHTMLvisibilityForButtonLabeledReset(false);
  // displayMessage("Player X's turn");
  location.reload();
}
function extractCoordinates(input) {
  switch (input) {
    case "A1":
      return { x: 0, y: 0 };
      break;
    case "A2":
      return { x: 0, y: 1 };
      break;
    case "A3":
      return { x: 0, y: 2 };
      break;
    case "B1":
      return { x: 1, y: 0 };
      break;
    case "B2":
      return { x: 1, y: 1 };
      break;
    case "B3":
      return { x: 1, y: 2 };
      break;
    case "C1":
      return { x: 2, y: 0 };
      break;
    case "C2":
      return { x: 2, y: 1 };
      break;
    case "C3":
      return { x: 2, y: 2 };
      break;
    default:
      displayMessage("Invalid coordinate entered");
  }
}

function getWinningPlayer(board) {
  //Checks if there is a horizontal line
  for (let i = 0; i < board.length; i++) {
    if (board[i].every((element) => element === "diamond")) {
      gameEndHideEl();
      return "X";
    }
    if (board[i].every((element) => element === "pets")) {
      gameEndHideEl();
      return "O";
    }
  }
  //Checks if there is a vertical line
  for (let i = 0; i < board.length; i++) {
    const column = board.map((row) => row[i]);
    if (column.every((element) => element === "diamond")) {
      gameEndHideEl();
      return "X";
    }
    if (column.every((element) => element === "pets")) {
      gameEndHideEl();
      return "O";
    }
  }
  //Checks if there is a diagonal line
  let mainDiagonal = [];
  let secondaryDiagonal = [];
  for (let i = 0; i < board.length; i++) {
    mainDiagonal.push(board[i][i]);
    secondaryDiagonal.push(board[i][board.length - 1 - i]);
  }
  if (
    mainDiagonal.every((element) => element === "diamond") ||
    secondaryDiagonal.every((element) => element === "diamond")
  ) {
    return "X";
  }
  if (
    mainDiagonal.every((element) => element === "pets") ||
    secondaryDiagonal.every((element) => element === "pets")
  ) {
    return "O";
  }

  return undefined;
}

document.getElementById("inputBox").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    processHumanCoordinate(event.target.value);
    event.target.value = '';
  }
});
