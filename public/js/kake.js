const socket = io();

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var ctx, game, board;
const W = 400,
    H = 400,
    R = 22;
var offsetX;
var offsetY;

// emit joinRoom
socket.emit("joinRoom", {
    room: urlParams.get("room"),
    username: document.cookie.match(/username=([^;]+)/)[1]
});

socket.on("users", function(users) {
    if (!users) {
        window.location = '/?error=invalid-username';
    }
});

socket.on("noPerms", function() {
    alert("You do not have permission to join this room.");
    window.location = '/';
});

socket.on("redir", function() {
    window.location = '/';
});

socket.on("test", function(data) {
    console.log("test");
    const waitText = document.getElementById("wait");
    waitText.innerText = `A player has connected! The game has started. You are ${data.color}. Logged in as ${data.username}`;
});

socket.on("msg", data => console.log(data));

socket.on("refresh", function(data) {
    if (document.cookie.match(/refreshed=([^;]+)/)) {
        if (document.cookie.match(/refreshed=([^;]+)/)[1] === "true") {
            return;
        }
    }
    console.log("refresh");
    document.cookie = "refreshed=true";
    window.location = '/room?room=' + urlParams.get("room");
});

socket.on("ok", function({ data, color }) {
    // start game
    globalThis.COLOR = color;
    var canvas = document.getElementById("gc");
    console.log("canvas: " + canvas);
    ctx = canvas.getContext("2d");
    console.log("game object created");
    offsetX = canvas.offsetLeft;
    offsetY = canvas.offsetTop;
    // wait for click and detect checker with handleClick
    canvas.addEventListener("click", handleClick);
    // draw board
    console.log(data);
    board = data;
    draw(ctx);
    // emit start
    socket.emit("getupdate");
});

socket.on("update", function(data) {
    console.log("update received");
    console.log("update");
    board = data.board;
    draw(ctx);
});

socket.on("draw", function() {
    draw(ctx);
});

socket.on("clear", function() {
    clear(ctx);
});

socket.on("turn", function(data) {
    console.log("turn");
    document.getElementById("wait").innerText = `To move: ${data.turn === 1 ? "red" : "blue"}, you are: ${data.color === 1 ? "red" : "blue"}`;
});

function draw(ctx) {
    clear(ctx);

    // draw chess board 
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if ((i + j) % 2 == 0) {
                ctx.fillStyle = "white";
            } else {
                ctx.fillStyle = "black";
            }
            ctx.fillRect(i * (W / 8), j * (H / 8), (W / 8), 100);
        }
    }

    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            if (Math.floor(board[i][j] / 10) === 1) {
                // draw circular checker with value number on top of it
                ctx.fillStyle = "red";
                ctx.beginPath();
                ctx.arc(j * (W / 8) + (W / 16), i * (H / 8) + (H / 16), R, 0, 2 * Math.PI);
                ctx.fill();
                // center text in the middle of the checker
                ctx.fillStyle = "white";
                ctx.font = "20px Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(board[i][j] % 10, j * (W / 8) + (W / 16), i * (H / 8) + (H / 16));
            } else if (Math.floor(board[i][j] / 10) === 2) {
                ctx.fillStyle = "blue";
                ctx.beginPath();
                ctx.arc(j * (W / 8) + (W / 16), i * (H / 8) + (H / 16), R, 0, 2 * Math.PI);
                ctx.fill();
                ctx.fillStyle = "white";
                // draw circular checker with value number on top of it
                ctx.fillText(board[i][j] % 10, j * (W / 8) + (W / 16), i * (H / 8) + (H / 16));
            }
        }
    }
}

function clear(ctx) {
    ctx.clearRect(0, 0, W, H);
}

function handleClick(e) {
    var evt = e ? e : window.event;
    clickX = evt.clientX - offsetX;
    clickY = evt.clientY - offsetY;
    // get checker that has been clicked
    var { x, y, c } = getChecker(clickX, clickY);
    // get checker's row and column
    var row = Math.floor(y / (H / 8));
    var col = Math.floor(x / (W / 8));
    // emit move
    console.log("move: row: " + row + ", col: " + col);
    socket.emit("move", {
        row: row,
        col: col,
        isChecker: c,
        color: globalThis.COLOR
    });

}

function getChecker(x, y) {
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            if (Math.floor(board[i][j] / 10) === 1) {
                if (x > i * (W / 8) + (W / 16) - R && x < i * (W / 8) + (W / 16) + R && y > j * (H / 8) + (H / 16) - R && y < j * (H / 8) + (H / 16) + R) {
                    return {
                        x: i * (W / 8) + (W / 16),
                        y: j * (H / 8) + (H / 16),
                        c: true
                    };
                }
            } else if (Math.floor(board[i][j] / 10) === 2) {
                if (x > i * (W / 8) + (W / 16) - R && x < i * (W / 8) + (W / 16) + R && y > j * (H / 8) + (H / 16) - R && y < j * (H / 8) + (H / 16) + R) {
                    return {
                        x: i * (W / 8) + (W / 16),
                        y: j * (H / 8) + (H / 16),
                        c: true
                    };
                }
            }
            // if square is empty return coords of the square and another value to indicate it is empty
            else if (board[i][j] === 0) {
                // check if square is clicked
                if (x > i * (W / 8) && x < i * (W / 8) + (W / 8) && y > j * (H / 8) && y < j * (H / 8) + (H / 8)) {
                    return {
                        x: i * (W / 8),
                        y: j * (H / 8),
                        c: false
                    };
                }
            }
        }
    }
    return null;
}

socket.on("moves", function(data) {
    data = data.moves;
    if (data.length === 0) {
        draw(ctx);
    }
    console.log(data);
    for (let i = 0; i < data.length; i++) {
        let space = data[i];
        let row = space.row;
        let col = space.col;
        let remain = space.rem;
        // draw a circle on top of the end square
        ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
        ctx.beginPath();
        ctx.arc(row * (W / 8) + (W / 16), col * (H / 8) + (H / 16), R, 0, 2 * Math.PI);
        ctx.fill();
        // draw a number on top of the circle
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(remain, row * (W / 8) + (W / 16), col * (H / 8) + (H / 16));
    }
});