const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('.game--status');
const restartBtn = document.querySelector('.game--restart');

const player = 'X';
const ai = 'O';
let board = ['', '', '', '', '', '', '', '', ''];

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];



cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);
1

function handleCellClick(event) {
    const index = event.target.dataset.cellIndex;
    if (board[index] !== '' || checkWinner(board)) return;

    board[index] = player;
    event.target.textContent = player;
    
    if (checkWinner(board)) {
        updateStatus('Player Wins!');
        return;
    }

    if (!board.includes('')) {
        updateStatus('Draw!');
        return;
    }

    aiMove();
}

function aiMove() {
    let bestMove;
    // 70% chance to make the best move, 30% to make a random move
    if (Math.random() < 0.7) {
        bestMove = getBestMove(board);
    } else {
        const emptyCells = board
            .map((cell, index) => cell === '' ? index : null)
            .filter(index => index !== null);
        bestMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    if (bestMove !== -1) {
        board[bestMove] = ai;
        cells[bestMove].textContent = ai;
    }

    if (checkWinner(board)) {
        updateStatus('AI Wins!');
        return;
    }

    if (!board.includes('')) {
        updateStatus('Draw!');
    }
}


function checkWinner(b) {
    for (const pattern of winPatterns) {
        const [a, c, d] = pattern;
        if (b[a] && b[a] === b[c] && b[a] === b[d]) {
            return b[a];
        }
    }
    return null;
}

function getBestMove(b) {
    let bestScore = -Infinity;
    let move = -1;
    
    for (let i = 0; i < b.length; i++) {
        if (b[i] === '') {
            b[i] = ai;
            let score = minimax(b, 0, false);
            b[i] = '';
            
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(b, depth, isMaximizing) {
    let winner = checkWinner(b);
    if (winner === ai) return 10 - depth;
    if (winner === player) return depth - 10;
    if (!b.includes('')) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < b.length; i++) {
            if (b[i] === '') {
                b[i] = ai;
                let score = minimax(b, depth + 1, false);
                b[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < b.length; i++) {
            if (b[i] === '') {
                b[i] = player;
                let score = minimax(b, depth + 1, true);
                b[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
    
}


function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => cell.textContent = '');
    updateStatus('');
}
