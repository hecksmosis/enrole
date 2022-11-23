const { initialSetup } = require('./helpers');

class Kake {
    constructor(room) {
        this.room = room;
        this.players = [];
        this.board = [];
        let rows = 8;
        let cols = 8;
        for (let i = 0; i < rows; i++) {
            this.board[i] = [];
            for (let j = 0; j < cols; j++) {
                this.board[i][j] = 0;
            }
        }
        console.log("board");

        this.board = initialSetup(this.board);

        this.turn = 1;
        this.invertedBoard = this.showBoard();
    }

    showBoard(socket = null) {
        if (!socket) {
            // return inverted board
            let board = [];
            for (let i = 0; i < 8; i++) {
                board[i] = [];
                for (let j = 0; j < 8; j++) {
                    board[i][j] = this.board[7 - i][7 - j];
                }
            }
            return board;
        } else if (socket.color === 2) {
            return this.board;
        } else if (socket.color === 1) {
            return this.invertedBoard;
        }
    }

    setBoard(socket, board) {
        if (socket.color === 2) {
            // invert board
            let rows = 8;
            let cols = 8;
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    this.invertedBoard[i][j] = board[7 - i][7 - j];
                    this.board[i][j] = board[i][j];
                }
            }
        } else if (socket.color === 1) {
            // invert board
            let rows = 8;
            let cols = 8;
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    this.board[i][j] = board[7 - i][7 - j];
                    this.invertedBoard[i][j] = board[i][j];
                }
            }
        }
    }

    move(socket, { col, row, isChecker, color }) {
        if (this.turn === socket.color) {
            io.to(this.room).emit("isWon");
            let board = this.showBoard(socket);
            socket.jewels = [];
            // TODO: Moves that make you lose should be invalid

            // get your own jewels
            this.getJewels(socket, board);

            // get other player's jewels
            let otherPlayer = this.getOtherPlayer(socket);
            otherPlayer.jewels = [];
            let otherPlayerBoard = this.showBoard(otherPlayer);
            this.getJewels(otherPlayer, otherPlayerBoard);

            console.log("jewels: ", socket.jewels);
            if (socket.isMoving) {
                let remaining = this.isValidMove(socket, board, { col, row, isChecker, color });
                console.log("remaining: " + remaining);
                if (remaining !== false) {
                    console.log("move is valid");
                    // check if there is already a same color checker in end pos and add up the values
                    var place = board[row][col];
                    var seldigit = ('' + place)[0];
                    let digit = parseInt(seldigit);
                    if (remaining !== 0) {
                        if (socket.toMove.value === socket.jewels[0].value) {
                            if (socket.jewels.length === 1) {
                                return;
                            }
                        }
                        console.log("division");
                        if (digit === socket.color) {
                            console.log("same color");
                            let canmove = 7 - (board[row][col] % 10);
                            board[socket.toMove.row][socket.toMove.col] = socket.toMove.color * 10 + remaining;
                            board[row][col] += socket.toMove.value - remaining;
                            console.log("end pos: " + board[row][col]);
                            if (canmove === 0) {
                                board[row][col] = socket.color * 10 + 7;
                                console.log("can't move");
                                this.setBoard(socket, board);
                                io.to(this.room).emit("isWon");

                                socket.isMoving = false;
                                socket.toMove = null;

                                socket.emit("moves", { moves: [] });
                                for (let sroom of io.sockets.adapter.rooms) {
                                    if (sroom[0] === this.room) {
                                        for (let ssocket of sroom[1]) {
                                            console.log("socket: " + ssocket);
                                            users[ssocket].emit("turn", { turn: this.turn, color: users[ssocket].color });
                                        }
                                    }
                                }
                                return;
                            } else if (board[row][col] % 10 > 7) {
                                console.log("overflow");
                                board[row][col] = socket.color * 10 + 7;
                                board[socket.toMove.row][socket.toMove.col] = socket.toMove.color * 10 + socket.toMove.value - canmove;

                                io.to(this.room).emit("isWon");
                                socket.isMoving = false;
                                socket.toMove = null;
                                this.turn = this.turn === 1 ? 2 : 1;
                                console.log("setting board");
                                this.setBoard(socket, board);

                                socket.emit("moves", { moves: [] });
                                for (let sroom of io.sockets.adapter.rooms) {
                                    if (sroom[0] === this.room) {
                                        for (let ssocket of sroom[1]) {
                                            console.log("socket: " + ssocket);
                                            users[ssocket].emit("turn", { turn: this.turn, color: users[ssocket].color });
                                        }
                                    }
                                }
                                return;
                            }
                        } else {
                            board[socket.toMove.row][socket.toMove.col] = socket.toMove.color * 10 + remaining;
                            board[row][col] = socket.toMove.color * 10 + socket.toMove.value - remaining;
                        }
                        console.log(board[row][col]);
                        console.log(board);
                        socket.isMoving = false;
                        socket.toMove = null;
                        this.turn = this.turn === 1 ? 2 : 1;
                        console.log("setting board");
                        this.setBoard(socket, board);
                        for (let sroom of io.sockets.adapter.rooms) {
                            if (sroom[0] === this.room) {
                                for (let ssocket of sroom[1]) {
                                    console.log("socket: " + ssocket);
                                    users[ssocket].emit("turn", { turn: this.turn, color: users[ssocket].color });
                                    users[ssocket].emit("update", { board: games[this.room].showBoard(users[ssocket]) });
                                }
                            }
                        }
                        return;
                    }
                    if (digit === socket.color) {
                        console.log("same color");
                        board[socket.toMove.row][socket.toMove.col] = 0;
                        board[row][col] += socket.toMove.value;
                    } else {
                        board[socket.toMove.row][socket.toMove.col] = 0;
                        board[row][col] = socket.toMove.color * 10 + socket.toMove.value;
                    }
                    console.log(board[row][col]);
                    console.log(board);
                    console.log("NOTE => room: ", this.room);

                    // update board
                    this.setBoard(socket, board);

                    console.log("object board: " + this.board.toString()); // this.board is for blue player and this.invertedBoard is for red player
                    console.log("emitting is won");

                    // emit only once?
                    io.to(this.room).emit("isWon");

                    socket.isMoving = false;
                    socket.toMove = null;
                    this.turn = this.turn === 1 ? 2 : 1;
                    for (let sroom of io.sockets.adapter.rooms) {
                        if (sroom[0] === this.room) {
                            for (let ssocket of sroom[1]) {
                                console.log("socket: " + ssocket);
                                users[ssocket].emit("turn", { turn: this.turn, color: users[ssocket].color });
                                users[ssocket].emit("update", { board: games[this.room].showBoard(users[ssocket]) });
                            }
                        }
                    }
                    return;
                } else {
                    socket.isMoving = false;
                    socket.toMove = null;
                    socket.emit("moves", { moves: [] });
                    for (let sroom of io.sockets.adapter.rooms) {
                        if (sroom[0] === this.room) {
                            for (let ssocket of sroom[1]) {
                                console.log("socket: " + ssocket);
                                users[ssocket].emit("turn", { turn: this.turn, color: users[ssocket].color });
                            }
                        }
                    }
                    return;
                }
            }
            var myVar = board[row][col];
            var sdigit = ('' + myVar)[0];
            console.log("checker: ", myVar);
            console.log(sdigit, ", color: " + socket.color);
            console.log("value: " + board[row][col] % 10);
            let digit = parseInt(sdigit);
            if (digit !== socket.color) return;
            if (digit === 0) return;
            console.log("move");
            console.log("row: ", row, ", col: ", col);
            socket.isMoving = true;
            socket.toMove = { row, col, color: digit, value: board[row][col] % 10 };

            let moves = [];

            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    let space = board[j][i];
                    let tseldigit = ('' + space)[0];
                    let digit = parseInt(tseldigit);
                    let remaining = this.isValidMove(socket, board, { row: j, col: i });
                    if (remaining !== false) {
                        if (space % 10 === 7 && digit === socket.color) {
                            continue;
                        } else if (socket.toMove.value === socket.jewels[0].value && socket.jewels.length === 1) {
                            // restricted movement as it is a jewel
                            if (remaining === 0) {
                                console.log(space % 10);
                                moves.push({ row: j, col: i, rem: socket.toMove.value });
                            }
                        } else if (socket.toMove.value - remaining + (space % 10) > 7) {
                            // overflow, rem = the number of checkers necessary to fill the end spot up to 7 value
                            if (digit !== socket.color) {
                                moves.push({ row: j, col: i, rem: socket.toMove.value - remaining });
                                continue;
                            } else {
                                let rem = 7 - (space % 10);
                                moves.push({ row: j, col: i, rem });
                            }
                        } else {
                            moves.push({ row: j, col: i, rem: socket.toMove.value - remaining });
                        }
                    }
                }
            }

            console.log("moves", moves);
            socket.emit("moves", { moves: moves });

            for (let sroom of io.sockets.adapter.rooms) {
                if (sroom[0] === this.room) {
                    for (let ssocket of sroom[1]) {
                        console.log("socket: " + ssocket);
                        users[ssocket].emit("turn", { turn: this.turn, color: users[ssocket].color });
                    }
                }
            }
            console.log(socket.toMove);
        } else return;
    }

    isValidMove(socket, _board, { col, row }) {
        // if checker value is 1
        if (socket.toMove.value === 1) {
            // if end pos is 1 away from start pos
            if (Math.abs(col - socket.toMove.col) === 1 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 1) {
                return 0;
            }
        } else if (socket.toMove.value === 2) {
            // allow pieces to divide depending on the value
            if (Math.abs(col - socket.toMove.col) === 1 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 1) {
                return 1;
            }
            // if end pos is 2 away from start pos in a straight line
            if (Math.abs(col - socket.toMove.col) === 2 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 2) {
                return 0;
            }
        } else if (socket.toMove.value === 3) {
            // allow pieces to divide depending on the value
            if (Math.abs(col - socket.toMove.col) === 1 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 1) {
                return 2;
            }
            if (Math.abs(col - socket.toMove.col) === 2 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 2) {
                return 1;
            }
            // if end pos is 3 away from start pos in a straight line
            if (Math.abs(col - socket.toMove.col) === 3 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 3) {
                return 0;
            }
        } else if (socket.toMove.value === 4) {
            // allow pieces to divide depending on the value
            if (Math.abs(col - socket.toMove.col) === 1 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 1) {
                return 3;
            }
            if (Math.abs(col - socket.toMove.col) === 2 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 2) {
                return 2;
            }
            if (Math.abs(col - socket.toMove.col) === 3 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 3) {
                return 1;
            }
            // if end pos is 4 away from start pos in a straight line
            if (Math.abs(col - socket.toMove.col) === 4 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 4) {
                return 0;
            }
        } else if (socket.toMove.value === 5) {
            // allow pieces to divide depending on the value
            if (Math.abs(col - socket.toMove.col) === 1 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 1) {
                return 4;
            }
            if (Math.abs(col - socket.toMove.col) === 2 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 2) {
                return 3;
            }
            if (Math.abs(col - socket.toMove.col) === 3 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 3) {
                return 2;
            }
            if (Math.abs(col - socket.toMove.col) === 4 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 4) {
                return 1;
            }
            // if end pos is 5 away from start pos in a straight line
            if (Math.abs(col - socket.toMove.col) === 5 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 5) {
                return 0;
            }
        } else if (socket.toMove.value === 6) {
            // allow pieces to divide depending on the value
            if (Math.abs(col - socket.toMove.col) === 1 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 1) {
                return 5;
            }
            if (Math.abs(col - socket.toMove.col) === 2 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 2) {
                return 4;
            }
            if (Math.abs(col - socket.toMove.col) === 3 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 3) {
                return 3;
            }
            if (Math.abs(col - socket.toMove.col) === 4 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 4) {
                return 2;
            }
            if (Math.abs(col - socket.toMove.col) === 5 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 5) {
                return 1;
            }
            // if end pos is 6 away from start pos in a straight line
            if (Math.abs(col - socket.toMove.col) === 6 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 6) {
                return 0;
            }
        } else if (socket.toMove.value === 7) {
            // allow pieces to divide depending on the value
            if (Math.abs(col - socket.toMove.col) === 1 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 1) {
                return 6;
            }
            if (Math.abs(col - socket.toMove.col) === 2 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 2) {
                return 5;
            }
            if (Math.abs(col - socket.toMove.col) === 3 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 3) {
                return 4;
            }
            if (Math.abs(col - socket.toMove.col) === 4 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 4) {
                return 3;
            }
            if (Math.abs(col - socket.toMove.col) === 5 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 5) {
                return 2;
            }
            if (Math.abs(col - socket.toMove.col) === 6 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 6) {
                return 1;
            }
            // if end pos is 7 away from start pos in a straight line
            if (Math.abs(col - socket.toMove.col) === 7 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 7) {
                return 0;
            }
        }
        return false;
    }

    getJewels(socket, board) {
        let hvalue = 0;
        let rows = 8;
        let cols = 8;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                var selplace = board[i][j];
                var sseldigit = ('' + selplace)[0];
                let tdigit = parseInt(sseldigit);
                if (tdigit === socket.color) {
                    // if it has the highest value of the pieces of that color the append it to the jewels array
                    hvalue = board[i][j] % 10 > hvalue ? board[i][j] % 10 : hvalue;
                }
            }
        }
        rows = 8;
        cols = 8;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                var sselplace = board[i][j];
                var ssseldigit = ('' + sselplace)[0];
                let tdigit = parseInt(ssseldigit);
                if (tdigit === socket.color) {
                    if (board[i][j] % 10 === hvalue) {
                        socket.jewels.push({
                            row: i,
                            col: j,
                            color: socket.color,
                            value: board[i][j] % 10
                        });
                    }
                }
            }
        }
    }

    getOtherPlayer(socket) {
        for (let sroom of io.sockets.adapter.rooms) {
            if (sroom[0] === this.room) {
                for (let ssocket of sroom[1]) {
                    if (ssocket !== socket.id) {
                        return users[ssocket];
                    }
                }
            }
        }
    }

    async isWon(socket) {
        console.log("chekin if geim is guon, color: " + socket.color);

        let counter = 0;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let place = this.board[i][j];
                let seldigit = ('' + place)[0];
                let digit = parseInt(seldigit);

                if (digit === socket.color) {
                    counter++;
                }
            }
        }

        socket.jewels = [];
        console.log("board: ", this.board);
        console.log("inverted board: ", this.invertedBoard);

        // get your own jewels
        this.getJewels(socket, socket.color === 2 ? this.board : this.invertedBoard);
        console.log("jewels: ", socket.jewels);
        console.log("jewel count: ", socket.jewels.length, ", piece count: ", counter);

        // win / loss mechanism

        if (socket.jewels.length === counter) {
            // i win
            var win_username = this.getOtherPlayer(socket).username;
            for (let sroom of io.sockets.adapter.rooms) {
                if (sroom[0] === this.room) {
                    for (let ssocket of sroom[1]) {
                        users[ssocket].emit("win", { losecolor: users[ssocket].color, color: socket.color, aa: true });
                    }
                }
            }

            console.log("User " + socket.username + " lost the game!");

            await pool.query(
                `UPDATE users SET wins = wins + 1 WHERE name = '${win_username}'`,
                (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                }
            );

            await pool.query(
                `UPDATE users SET losses = losses + 1 WHERE name = '${socket.username}'`,
                (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                }
            );

            return;
        }

    }

}

module.exports = { Kake };