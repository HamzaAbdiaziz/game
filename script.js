document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const statusDisplay = document.getElementById('status');
    const resetButton = document.getElementById('resetBtn');
    const twoPlayerButton = document.getElementById('twoPlayerBtn');
    const onePlayerButton = document.getElementById('onePlayerBtn');
    const resultScreen = document.getElementById('resultScreen');
    const resultMessage = document.getElementById('resultMessage');
    const newGameButton = document.getElementById('newGameBtn');
    
    let currentPlayer = 'X';
    let gameActive = true;
    let gameMode = 'twoPlayer';
    let boardState = ["", "", "", "", "", "", "", "", ""];
    
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    
    function handleCellPlayed(clickedCell, clickedCellIndex) {
        boardState[clickedCellIndex] = currentPlayer;
        clickedCell.innerText = currentPlayer;
    }
    
    function handlePlayerChange() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.innerText = `It's ${currentPlayer}'s turn`;
    }
    
    function handleResultValidation() {
        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            let a = boardState[winCondition[0]];
            let b = boardState[winCondition[1]];
            let c = boardState[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }
        
        if (roundWon) {
            showResultScreen(`Player ${currentPlayer} wins!`);
            gameActive = false;
            return;
        }
        
        let roundDraw = !boardState.includes("");
        if (roundDraw) {
            showResultScreen(`Draw!`);
            gameActive = false;
            return;
        }
        
        handlePlayerChange();
    }
    
    function handleCellClick(event) {
        const clickedCell = event.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
        
        if (boardState[clickedCellIndex] !== "" || !gameActive) {
            return;
        }
        
        handleCellPlayed(clickedCell, clickedCellIndex);
        handleResultValidation();
        
        if (gameActive && gameMode === 'onePlayer' && currentPlayer === 'O') {
            handleComputerMove();
        }
    }
    
    function handleComputerMove() {
        const bestMove = minimax(boardState, 'O').index;
        const computerMoveCell = document.querySelector(`.cell[data-index='${bestMove}']`);
        
        handleCellPlayed(computerMoveCell, bestMove);
        handleResultValidation();
    }
    
    function minimax(newBoard, player) {
        const availSpots = newBoard.map((val, index) => val === "" ? index : null).filter(val => val !== null);
        
        if (checkWin(newBoard, 'X')) {
            return { score: -10 };
        } else if (checkWin(newBoard, 'O')) {
            return { score: 10 };
        } else if (availSpots.length === 0) {
            return { score: 0 };
        }
        
        const moves = [];
        for (let i = 0; i < availSpots.length; i++) {
            const move = {};
            move.index = availSpots[i];
            newBoard[availSpots[i]] = player;
            
            if (player === 'O') {
                const result = minimax(newBoard, 'X');
                move.score = result.score;
            } else {
                const result = minimax(newBoard, 'O');
                move.score = result.score;
            }
            
            newBoard[availSpots[i]] = "";
            moves.push(move);
        }
        
        let bestMove;
        if (player === 'O') {
            let bestScore = -Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        
        return moves[bestMove];
    }
    
    function checkWin(board, player) {
        let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
        let gameWon = null;
        for (let [index, win] of winningConditions.entries()) {
            if (win.every(elem => plays.indexOf(elem) > -1)) {
                gameWon = { index: index, player: player };
                break;
            }
        }
        return gameWon;
    }
    
    function handleRestartGame() {
        currentPlayer = 'X';
        gameActive = true;
        boardState = ["", "", "", "", "", "", "", "", ""];
        statusDisplay.innerText = `It's ${currentPlayer}'s turn`;
        cells.forEach(cell => cell.innerText = "");
        resultScreen.style.display = 'none';
    }
    
    function setGameMode(mode) {
        gameMode = mode;
        handleRestartGame();
    }
    
    function showResultScreen(message) {
        resultMessage.innerText = message;
        resultScreen.style.display = 'flex';
    }
    
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetButton.addEventListener('click', handleRestartGame);
    twoPlayerButton.addEventListener('click', () => setGameMode('twoPlayer'));
    onePlayerButton.addEventListener('click', () => setGameMode('onePlayer'));
    newGameButton.addEventListener('click', handleRestartGame);
    
    statusDisplay.innerText = `It's ${currentPlayer}'s turn`;
});
