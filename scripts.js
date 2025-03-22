const board = document.getElementById('board');
const cells = document.querySelectorAll('[data-cell]');
const restartButton = document.getElementById('restartButton');
const messageElement = document.getElementById('message');
const scoreXElement = document.getElementById('scoreX');
const scoreOElement = document.getElementById('scoreO');
const aiModeButton = document.getElementById('aiModeButton');
const friendModeButton = document.getElementById('friendModeButton');
const resetScoreButton = document.getElementById('resetScoreButton'); // Novo botão

const X_CLASS = 'x';
const O_CLASS = 'o';
let oTurn;
let scoreX = 0;
let scoreO = 0;
let isAIMode = false;
let gameData = [];

const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

aiModeButton.addEventListener('click', () => {
    isAIMode = true;
    startGame();
});

friendModeButton.addEventListener('click', () => {
    isAIMode = false;
    startGame();
});

restartButton.addEventListener('click', startGame);
resetScoreButton.addEventListener('click', resetScore); // Evento para o novo botão

function startGame() {
    oTurn = false;
    gameData = []; // Reinicie os dados do jogo
    cells.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.textContent = '';
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setBoardHoverClass();
    messageElement.textContent = '';
    if (isAIMode && oTurn) {
        aiMove(); // IA começa jogando se oTurn for verdadeiro e o modo IA estiver ativo
    }
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = oTurn ? O_CLASS : X_CLASS;
    placeMark(cell, currentClass);
    recordMove(cell, currentClass); // Registra o movimento
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        if (isAIMode && oTurn) {
            setTimeout(aiMove, 500); // Pequeno atraso para a IA fazer sua jogada
        }
        setBoardHoverClass();
    }
}

function endGame(draw) {
    if (draw) {
        messageElement.textContent = 'Empate!';
        saveGameResult('draw'); // Salva o resultado do jogo
    } else {
        messageElement.textContent = `${oTurn ? "O" : "X"} Venceu!`;
        saveGameResult(oTurn ? 'O' : 'X'); // Salva o resultado do jogo
        updateScore(oTurn ? O_CLASS : X_CLASS);
    }
    cells.forEach(cell => {
        cell.removeEventListener('click', handleClick); // Remove eventos de clique após o fim do jogo
    });
}

function isDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    cell.textContent = currentClass.toUpperCase(); // Adiciona o texto 'X' ou 'O' na célula
}

function recordMove(cell, currentClass) {
    gameData.push({
        cellIndex: [...cells].indexOf(cell),
        player: currentClass
    });
}

function saveGameResult(result) {
    gameData.push({ result: result });
    console.log('Game Data:', gameData); // Salve gameData em um servidor ou localStorage para treinamento futuro
}

function swapTurns() {
    oTurn = !oTurn;
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(O_CLASS);
    if (oTurn) {
        board.classList.add(O_CLASS);
    } else {
        board.classList.add(X_CLASS);
    }
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass);
        });
    });
}

function updateScore(winner) {
    if (winner === X_CLASS) {
        scoreX++;
        scoreXElement.textContent = `X: ${scoreX}`;
    } else {
        scoreO++;
        scoreOElement.textContent = `O: ${scoreO}`;
    }
}

// Função para a IA fazer um movimento
function aiMove() {
    const emptyCells = [...cells].filter(cell => !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS));
    if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const cell = emptyCells[randomIndex];
        placeMark(cell, O_CLASS);
        recordMove(cell, O_CLASS); // Registra o movimento da IA
        if (checkWin(O_CLASS)) {
            endGame(false);
        } else if (isDraw()) {
            endGame(true);
        } else {
            swapTurns();
            setBoardHoverClass();
        }
    }
}

// Função para reiniciar o placar
function resetScore() {
    scoreX = 0;
    scoreO = 0;
    scoreXElement.textContent = `X: ${scoreX}`;
    scoreOElement.textContent = `O: ${scoreO}`;
}
