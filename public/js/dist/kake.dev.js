"use strict";

var socket = io();
var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var canvas, ctx, game, board;
var W = 400,
    H = 400,
    R = 22;
var offsetX;
var offsetY;
var pageAccessedByReload = window.performance.navigation && window.performance.navigation.type === 1 || window.performance.getEntriesByType('navigation').map(function (nav) {
  return nav.type;
}).includes('reload');

if (!document.cookie.match(/username=([^;]+)/)) {
  window.location = '/';
}

document.getElementById("username").innerHTML = document.cookie.match(/username=([^;]+)/)[1]; // emit joinRoom

socket.emit("joinRoom", {
  room: urlParams.get("room"),
  username: document.cookie.match(/username=([^;]+)/)[1],
  isRefresh: pageAccessedByReload
});
socket.on("users", function (users) {
  if (!users) {
    window.location = '/?error=invalid-username';
  }
});
socket.on("noPerms", function () {
  alert("You do not have permission to join this room.");
  window.location = '/';
});
socket.on("redir", function (data) {
  console.log("redirecting to: " + data !== undefined ? data : "root");

  if (data) {
    window.location = data;
  }

  window.location = '/';
});
socket.on("test", function (data) {
  console.log("test");
  var waitText = document.getElementById("wait");
  var turn = data.turn === 1 ? "red" : "blue";
  var turnItem = document.getElementById("turn");
  turnItem.innerText = turn;
  waitText.innerText = "Player ".concat(data.opponentName, " has connected! The game has started.");
  var login = document.getElementById("username");
  login.innerText = data.username;
});
socket.on("msg", function (data) {
  return console.log(data);
});
socket.on("refresh", function (data) {
  if (document.cookie.match(/refreshed=([^;]+)/)) {
    if (document.cookie.match(/refreshed=([^;]+)/)[1] === "true") {
      return;
    }
  }

  console.log("refresh");
  document.cookie = "refreshed=true";
  window.location = '/room?room=' + urlParams.get("room");
});
socket.on("ok", function (_ref) {
  var data = _ref.data,
      color = _ref.color;
  // start game
  globalThis.COLOR = color;
  var container = document.getElementById("canvas-container");
  container.style.display = "flex";
  var hol = document.getElementById("hide-on-lobby");
  hol.style.display = "flex";
  canvas = document.getElementById("gc");
  console.log("canvas: " + canvas);
  ctx = canvas.getContext("2d");
  console.log("game object created");
  offsetX = canvas.offsetLeft;
  offsetY = canvas.offsetTop; // set color in html display element

  var e_color = document.getElementById("color");
  e_color.innerText = globalThis.COLOR === 1 ? "red" : "blue"; // wait for click and detect checker with handleClick

  canvas.addEventListener("click", handleClick); // draw board

  console.log(data);
  board = data;
  draw(ctx); // emit start

  socket.emit("getupdate");
});
socket.on("update", function (data) {
  console.log("update received");
  console.log("update");
  board = data.board;
  draw(ctx);
});
socket.on("draw", function () {
  draw(ctx);
});
socket.on("clear", function () {
  clear(ctx);
});
socket.on("turn", function (data) {
  console.log("turn");
  var turn = data.turn === 1 ? "red" : "blue";
  var turnItem = document.getElementById("turn");
  turnItem.innerText = turn;
});

function draw(ctx) {
  clear(ctx); // draw chess board 

  for (var _i = 0; _i < 8; _i++) {
    for (var _j = 0; _j < 8; _j++) {
      if ((_i + _j) % 2 == 0) {
        ctx.fillStyle = "white";
      } else {
        ctx.fillStyle = "black";
      }

      ctx.fillRect(_i * (W / 8), _j * (H / 8), W / 8, 100);
    }
  }

  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (Math.floor(board[i][j] / 10) === 1) {
        // draw circular checker with value number on top of it
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(j * (W / 8) + W / 16, i * (H / 8) + H / 16, R, 0, 2 * Math.PI);
        ctx.fill(); // center text in the middle of the checker

        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(board[i][j] % 10, j * (W / 8) + W / 16, i * (H / 8) + H / 16);
      } else if (Math.floor(board[i][j] / 10) === 2) {
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(j * (W / 8) + W / 16, i * (H / 8) + H / 16, R, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = "white"; // draw circular checker with value number on top of it

        ctx.fillText(board[i][j] % 10, j * (W / 8) + W / 16, i * (H / 8) + H / 16);
      }
    }
  }
}

function clear(ctx) {
  ctx.clearRect(0, 0, W, H);
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect(),
      // abs. size of element
  scaleX = canvas.width / rect.width,
      // relationship bitmap vs. element for x
  scaleY = canvas.height / rect.height; // relationship bitmap vs. element for y

  console.log("x, y: " + (evt.clientX - rect.left) * scaleX + ", " + (evt.clientY - rect.top) * scaleY);
  return {
    x: (evt.clientX - rect.left) * scaleX,
    // scale mouse coordinates after they have
    y: (evt.clientY - rect.top) * scaleY // been adjusted to be relative to element

  };
}

function handleClick(e) {
  var evt = e ? e : window.event;

  var _getMousePos = getMousePos(canvas, evt),
      clickX = _getMousePos.x,
      clickY = _getMousePos.y; // get checker that has been clicked


  var _getChecker = getChecker(clickX, clickY),
      x = _getChecker.x,
      y = _getChecker.y,
      c = _getChecker.c; // get checker's row and column


  var row = Math.floor(y / (H / 8));
  var col = Math.floor(x / (W / 8)); // emit move

  console.log("move: row: " + row + ", col: " + col);
  socket.emit("move", {
    row: row,
    col: col,
    isChecker: c,
    color: globalThis.COLOR
  });
}

function getChecker(x, y) {
  console.log(board, ". x: ", x, " y: ", y);

  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (Math.floor(board[i][j] / 10) === 1) {
        if (x > i * (W / 8) + W / 16 - R && x < i * (W / 8) + W / 16 + R && y > j * (H / 8) + H / 16 - R && y < j * (H / 8) + H / 16 + R) {
          return {
            x: i * (W / 8) + W / 16,
            y: j * (H / 8) + H / 16,
            c: true
          };
        }
      } else if (Math.floor(board[i][j] / 10) === 2) {
        if (x > i * (W / 8) + W / 16 - R && x < i * (W / 8) + W / 16 + R && y > j * (H / 8) + H / 16 - R && y < j * (H / 8) + H / 16 + R) {
          return {
            x: i * (W / 8) + W / 16,
            y: j * (H / 8) + H / 16,
            c: true
          };
        }
      } // if square is empty return coords of the square and another value to indicate it is empty
      else if (board[i][j] === 0) {
          // check if square is clicked
          if (x > i * (W / 8) && x < i * (W / 8) + W / 8 && y > j * (H / 8) && y < j * (H / 8) + H / 8) {
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

socket.on("moves", function (data) {
  data = data.moves;

  if (data.length === 0) {
    draw(ctx);
  }

  console.log(data);

  for (var i = 0; i < data.length; i++) {
    var space = data[i];
    var row = space.row;
    var col = space.col;
    var remain = space.rem; // draw a circle on top of the end square

    ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
    ctx.beginPath();
    ctx.arc(col * (W / 8) + W / 16, row * (H / 8) + H / 16, R, 0, 2 * Math.PI);
    ctx.fill(); // draw a number on top of the circle

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(remain, col * (W / 8) + W / 16, row * (H / 8) + H / 16);
  }
});
socket.on("win", function (_ref2) {
  var losecolor = _ref2.losecolor,
      color = _ref2.color,
      aa = _ref2.aa;
  draw(ctx);
  console.log("win/lose");

  if (aa) {
    console.log("test emit");
  }

  var tecst = document.getElementById("wait"); // display win on the canvas

  ctx.fillStyle = "grey";
  ctx.font = "50px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  globalThis.losecolor = losecolor;

  if (losecolor === color) {
    tecst.innerText = "You lost!";
    ctx.fillText("You lost!", W / 2, H / 2);
  } else {
    tecst.innerText = "You won!";
    ctx.fillText("You won!", W / 2, H / 2);
  } // send event to reset the canvas and prompt for play again

});
socket.on("isWon", function () {
  console.log("checkquin hif gwhon");
  socket.emit("isWon");
}); // Confirm room leave

document.getElementById('leave-btn').addEventListener('click', function () {
  var leaveRoom = confirm('Are you sure you want to leave the game?');

  if (leaveRoom) {
    window.location = '/';
  } else {}
});