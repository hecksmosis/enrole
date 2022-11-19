const initialSetup = (board) => {
    board[0][0] = 14; // first digit is the color of the piece and the second digit is the value of the piece
    board[1][0] = 12;
    board[2][0] = 11;
    board[0][2] = 13;
    board[1][2] = 12;
    board[2][2] = 11;
    board[0][4] = 13;
    board[1][4] = 12;
    board[2][4] = 11;
    board[0][6] = 13;
    board[1][6] = 12;
    board[2][6] = 11;
    board[7][7] = 24;
    board[6][7] = 22;
    board[5][7] = 21;
    board[7][5] = 23;
    board[6][5] = 22;
    board[5][5] = 21;
    board[7][3] = 23;
    board[6][3] = 22;
    board[5][3] = 21;
    board[7][1] = 23;
    board[6][1] = 22;
    board[5][1] = 21;

    return board;
};

// Path: utils\setupFunctions.js
module.exports = { initialSetup };