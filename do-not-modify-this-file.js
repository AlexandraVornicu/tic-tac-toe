/* 
    PLEASE DO NOT MODIFY THESE LINES,
    THEY ARE REQUIRED FOR THE PROJECT
    TO WORK
*/

// this function is called whenever you want to clear the representation
// of the board (remove x & o). Carefull, the board is NOT updated in html!
function resetBoard() {
    board = [
        ['', '', '',],
        ['', '', '',],
        ['', '', '',]
    ];
}

// whenever you display a message you can use this function
function displayMessage(message) {
    document.getElementById('display').innerText = message;
}

// this will update the game board based on the value of
// the parameter board
function displayBoard(board) {
    const cells = document.querySelectorAll('.cell.tile');
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            cells[i * 3 + j].innerText = board[i][j];
        }
    }
}

function initGame() {
    document.querySelector('.coordinates > input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            processHumanCoordinate(e.target.value);
        }
    });

    document.querySelector('.mode > select').addEventListener('input', (e) => setGameMode(e.target.value));

    document.querySelector('.ai > button').addEventListener('click', processAICoordinate);

    document.querySelector('.restart > button').addEventListener('click', resetGame);
}

// isVisible = true  - will show the element
// isVisible = false - will hide the element
function setHTMLvisibilityForInputGameMode(isVisible) {
    if (isVisible) {
        document.getElementsByClassName('mode')[0].classList.remove('hide');
    } else {
        document.getElementsByClassName('mode')[0].classList.add('hide');
    }
}

// isVisible = true  - will show the element
// isVisible = false - will hide the element
function setHTMLvisibilityForInputHumanCoordinates(isVisible) {
    if (isVisible) {
        document.querySelector('.coordinates').classList.remove('hide');
    } else {
        document.querySelector('.coordinates').classList.add('hide');
    }
}

// isVisible = true  - will show the element
// isVisible = false - will hide the element
function setHTMLvisibilityForInputAiCoordinatesInput(isVisible) {
    if (isVisible) {
        document.querySelector('.ai').classList.remove('hide');
    } else {
        document.querySelector('.ai').classList.add('hide');
    }
}

// isVisible = true  - will show the element
// isVisible = false - will hide the element
function setHTMLvisibilityForButtonLabeledReset(isVisible) {
    if (isVisible) {
        document.querySelector('.restart').classList.remove('hide');
    } else {
        document.querySelector('.restart').classList.add('hide');
    }
}

initGame();