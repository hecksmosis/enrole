"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

//socket io app
var express = require('express');

var _require = require('./utils/messages'),
    messageFormatter = _require.messageFormatter;

var app = express();

var http = require('http').Server(app);

var io = require('socket.io')(http);

var port = process.env.PORT || 3000;

var fs = require('fs');

var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');

var _require2 = require('fs'),
    createReadStream = _require2.createReadStream;

var bcrypt = require('bcrypt');

var session = require('express-session');

var flash = require('express-flash');

var cookie = require('cookie');

var crypto = require('crypto'); // file imports


var _require3 = require("./dnd/dnd.js"),
    classList = _require3.classList,
    weapons = _require3.weapons,
    Weapon = _require3.Weapon,
    armors = _require3.armors,
    Armor = _require3.Armor,
    packs = _require3.packs,
    Pack = _require3.Pack,
    Item = _require3.Item; // prototypes setup


Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
}; // postgresql setup


var _require4 = require('pg'),
    Pool = _require4.Pool;

var _require5 = require('process'),
    getMaxListeners = _require5.getMaxListeners;

var isProduction = process.env.NODE_ENV === 'production';
console.log(isProduction);
var pool;

if (isProduction) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  pool = new Pool({
    user: 'rhqgfddocuiftw',
    host: 'ec2-54-211-255-161.compute-1.amazonaws.com',
    database: 'd8hs985v1cid97',
    port: 5432,
    password: '5bb7d6571aa254730bffd0c7b74f98027d1d12bbc7134e178bd1e147c6f013f0',
    ssl: {
      rejectUnauthorized: false
    }
  });
}

var games = []; // kake game 

var Kake =
/*#__PURE__*/
function () {
  function Kake(room) {
    _classCallCheck(this, Kake);

    this.room = room;
    this.players = [];
    this.board = [];
    var rows = 8;
    var cols = 8;

    for (var i = 0; i < rows; i++) {
      this.board[i] = [];

      for (var j = 0; j < cols; j++) {
        this.board[i][j] = 0;
      }
    }

    console.log("board");
    this.board[0][0] = 14; // first digit is the color of the piece and the second digit is the value of the piece

    this.board[1][0] = 12;
    this.board[2][0] = 11;
    this.board[0][2] = 13;
    this.board[1][2] = 12;
    this.board[2][2] = 11;
    this.board[0][4] = 13;
    this.board[1][4] = 12;
    this.board[2][4] = 11;
    this.board[0][6] = 13;
    this.board[1][6] = 12;
    this.board[2][6] = 11;
    this.board[7][7] = 24;
    this.board[6][7] = 22;
    this.board[5][7] = 21;
    this.board[7][5] = 23;
    this.board[6][5] = 22;
    this.board[5][5] = 21;
    this.board[7][3] = 23;
    this.board[6][3] = 22;
    this.board[5][3] = 21;
    this.board[7][1] = 23;
    this.board[6][1] = 22;
    this.board[5][1] = 21;
    this.turn = 1;
    console.log(this.board);
    this.invertedBoard = this.showBoard();
  }

  _createClass(Kake, [{
    key: "showBoard",
    value: function showBoard() {
      var socket = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (!socket) {
        // return inverted board
        var _board2 = [];

        for (var i = 0; i < 8; i++) {
          _board2[i] = [];

          for (var j = 0; j < 8; j++) {
            _board2[i][j] = this.board[7 - i][7 - j];
          }
        }

        return _board2;
      } else if (socket.color === 2) {
        console.log("no invert, color: " + socket.color);
        console.log("original board: ", this.board);
        return this.board;
      } else if (socket.color === 1) {
        console.log("invert, color: " + socket.color);
        console.log("inverted board: ", this.invertedBoard);
        return this.invertedBoard;
      }
    }
  }, {
    key: "setBoard",
    value: function setBoard(socket, board) {
      if (socket.color === 2) {
        // invert board
        var _rows = 8;
        var _cols = 8;

        for (var i = 0; i < _rows; i++) {
          for (var j = 0; j < _cols; j++) {
            this.invertedBoard[i][j] = board[7 - i][7 - j];
            this.board[i][j] = board[i][j];
          }
        }
      } else if (socket.color === 1) {
        // invert board
        var _rows2 = 8;
        var _cols2 = 8;

        for (var _i = 0; _i < _rows2; _i++) {
          for (var _j = 0; _j < _cols2; _j++) {
            this.board[_i][_j] = board[7 - _i][7 - _j];
            this.invertedBoard[_i][_j] = board[_i][_j];
          }
        }
      }
    }
  }, {
    key: "move",
    value: function move(socket, _ref) {
      var col = _ref.col,
          row = _ref.row,
          isChecker = _ref.isChecker,
          color = _ref.color;

      if (this.turn === socket.color) {
        var _board3 = this.showBoard(socket);

        socket.jewels = [];
        var hvalue = 0; // invert board

        var _rows3 = 8;
        var _cols3 = 8;

        for (var i = 0; i < _rows3; i++) {
          for (var j = 0; j < _cols3; j++) {
            var selplace = _board3[i][j];
            var sseldigit = ('' + selplace)[0];
            var tdigit = parseInt(sseldigit);

            if (tdigit === socket.color) {
              // if it has the highest value of the pieces of that color the append it to the jewels array
              hvalue = _board3[i][j] % 10 > hvalue ? _board3[i][j] % 10 : hvalue;
            }
          }
        } // invert board


        _rows3 = 8;
        _cols3 = 8;

        for (var _i2 = 0; _i2 < _rows3; _i2++) {
          for (var _j2 = 0; _j2 < _cols3; _j2++) {
            var sselplace = _board3[_i2][_j2];
            var ssseldigit = ('' + sselplace)[0];

            var _tdigit = parseInt(ssseldigit);

            if (_tdigit === socket.color) {
              if (_board3[_i2][_j2] % 10 === hvalue) {
                socket.jewels.push({
                  row: _i2,
                  col: _j2,
                  color: socket.color,
                  value: _board3[_i2][_j2] % 10
                });
              }
            }
          }
        }

        console.log("jewels: ", socket.jewels);

        if (socket.isMoving) {
          var remaining = this.isValidMove(socket, _board3, {
            col: col,
            row: row,
            isChecker: isChecker,
            color: color
          });
          console.log("remaining: " + remaining);

          if (remaining !== false) {
            console.log("move is valid"); // check if there is already a same color checker in end pos and add up the values

            var place = _board3[row][col];
            var seldigit = ('' + place)[0];

            var _digit = parseInt(seldigit);

            if (remaining !== 0) {
              if (socket.toMove.value === socket.jewels[0].value) {
                if (socket.jewels.length === 1) {
                  return;
                }
              }

              console.log("division");

              if (_digit === socket.color) {
                console.log("same color");
                _board3[socket.toMove.row][socket.toMove.col] = socket.toMove.color * 10 + remaining;
                _board3[row][col] += socket.toMove.value - remaining;
              } else {
                _board3[socket.toMove.row][socket.toMove.col] = socket.toMove.color * 10 + remaining;
                _board3[row][col] = socket.toMove.color * 10 + socket.toMove.value - remaining;
              }

              console.log(_board3[row][col]);
              console.log(_board3);
              socket.isMoving = false;
              socket.toMove = null;
              this.turn = this.turn === 1 ? 2 : 1;
              console.log("setting board");
              this.setBoard(socket, _board3);
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                for (var _iterator = io.sockets.adapter.rooms[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  var sroom = _step.value;
                  console.log(sroom);

                  if (sroom[0] === this.room) {
                    console.log(sroom);
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                      for (var _iterator2 = sroom[1][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var ssocket = _step2.value;
                        console.log("socket: " + ssocket);
                        users[ssocket].emit("update", {
                          board: games[this.room].showBoard(users[ssocket])
                        });
                      }
                    } catch (err) {
                      _didIteratorError2 = true;
                      _iteratorError2 = err;
                    } finally {
                      try {
                        if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                          _iterator2["return"]();
                        }
                      } finally {
                        if (_didIteratorError2) {
                          throw _iteratorError2;
                        }
                      }
                    }
                  }
                }
              } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                    _iterator["return"]();
                  }
                } finally {
                  if (_didIteratorError) {
                    throw _iteratorError;
                  }
                }
              }

              return;
            }

            if (_digit === socket.color) {
              console.log("same color");
              _board3[socket.toMove.row][socket.toMove.col] = 0;
              _board3[row][col] += socket.toMove.value;
            } else {
              _board3[socket.toMove.row][socket.toMove.col] = 0;
              _board3[row][col] = socket.toMove.color * 10 + socket.toMove.value;
            }

            console.log(_board3[row][col]);
            console.log(_board3);
            socket.isMoving = false;
            socket.toMove = null;
            this.turn = this.turn === 1 ? 2 : 1;
            this.setBoard(socket, _board3);
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = io.sockets.adapter.rooms[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var _sroom = _step3.value;
                console.log(_sroom);

                if (_sroom[0] === this.room) {
                  console.log(_sroom);
                  var _iteratorNormalCompletion4 = true;
                  var _didIteratorError4 = false;
                  var _iteratorError4 = undefined;

                  try {
                    for (var _iterator4 = _sroom[1][Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                      var _ssocket = _step4.value;
                      console.log("socket: " + _ssocket);

                      users[_ssocket].emit("update", {
                        board: games[this.room].showBoard(users[_ssocket])
                      });
                    }
                  } catch (err) {
                    _didIteratorError4 = true;
                    _iteratorError4 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
                        _iterator4["return"]();
                      }
                    } finally {
                      if (_didIteratorError4) {
                        throw _iteratorError4;
                      }
                    }
                  }
                }
              }
            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
                  _iterator3["return"]();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
                }
              }
            }

            return;
          } else {
            socket.isMoving = false;
            socket.toMove = null;
            socket.emit("moves", {
              moves: []
            });
            return;
          }
        } // TODO: send valid moves to the client


        var myVar = _board3[row][col];
        var sdigit = ('' + myVar)[0];
        console.log("checker: ", myVar);
        console.log(sdigit, ", color: " + socket.color);
        console.log("value: " + _board3[row][col] % 10);
        var digit = parseInt(sdigit);
        if (digit !== socket.color) return;
        if (digit === 0) return;
        console.log("move");
        console.log("row: ", row, ", col: ", col);
        socket.isMoving = true;
        socket.toMove = {
          row: row,
          col: col,
          color: digit,
          value: _board3[row][col] % 10
        };
        var moves = [];

        for (var _i3 = 0; _i3 < 8; _i3++) {
          for (var _j3 = 0; _j3 < 8; _j3++) {
            var space = _board3[_i3][_j3];
            console.log("space: ", space);

            var _remaining = this.isValidMove(socket, _board3, {
              col: _i3,
              row: _j3
            });

            console.log("remaining: " + _remaining);

            if (socket.toMove.value === socket.jewels[0].value) {
              // restricted movement as it is a jewel
              if (_remaining !== false) {
                console.log("is jewel");

                if (_remaining === 0) {
                  moves.push({
                    row: _i3,
                    col: _j3,
                    rem: socket.toMove.value
                  });
                  console.log("is jewel valid move");
                }
              }
            } else {
              if (_remaining !== false) {
                console.log("is a normal piece");
                moves.push({
                  row: _i3,
                  col: _j3,
                  rem: socket.toMove.value - _remaining
                });
              }
            }
          }
        }

        console.log("moves", moves);
        socket.emit("moves", {
          moves: moves
        });
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = io.sockets.adapter.rooms[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var _sroom2 = _step5.value;
            console.log(_sroom2);

            if (_sroom2[0] === this.room) {
              console.log(_sroom2);
              var _iteratorNormalCompletion6 = true;
              var _didIteratorError6 = false;
              var _iteratorError6 = undefined;

              try {
                for (var _iterator6 = _sroom2[1][Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                  var _ssocket2 = _step6.value;
                  console.log("socket: " + _ssocket2);

                  users[_ssocket2].emit("turn", {
                    turn: this.turn,
                    color: socket.color
                  });
                }
              } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
                    _iterator6["return"]();
                  }
                } finally {
                  if (_didIteratorError6) {
                    throw _iteratorError6;
                  }
                }
              }
            }
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
              _iterator5["return"]();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }

        console.log(socket.toMove);
      } else return;
    }
  }, {
    key: "isValidMove",
    value: function isValidMove(socket, _board, _ref2) {
      var col = _ref2.col,
          row = _ref2.row;
      // if checker value is 1
      console.log("value: ", socket.toMove.value);

      if (socket.toMove.value === 1) {
        console.log("moving 1"); // if end pos is 1 away from start pos

        console.log("distance to end col: ", Math.abs(col - socket.toMove.col), " distance to end row: ", Math.abs(row - socket.toMove.row));

        if (Math.abs(col - socket.toMove.col) === 1 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 1) {
          return 0;
        }
      } else if (socket.toMove.value === 2) {
        console.log("moving 2"); // allow pieces to divide depending on the value

        if (Math.abs(col - socket.toMove.col) === 1 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 1) {
          return 1;
        } // if end pos is 2 away from start pos in a straight line


        if (Math.abs(col - socket.toMove.col) === 2 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 2) {
          return 0;
        }
      } else if (socket.toMove.value === 3) {
        console.log("moving 3"); // allow pieces to divide depending on the value

        if (Math.abs(col - socket.toMove.col) === 1 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 1) {
          return 2;
        }

        if (Math.abs(col - socket.toMove.col) === 2 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 2) {
          return 1;
        } // if end pos is 3 away from start pos in a straight line


        if (Math.abs(col - socket.toMove.col) === 3 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 3) {
          return 0;
        }
      } else if (socket.toMove.value === 4) {
        console.log("moving 4"); // allow pieces to divide depending on the value

        if (Math.abs(col - socket.toMove.col) === 1 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 1) {
          return 3;
        }

        if (Math.abs(col - socket.toMove.col) === 2 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 2) {
          return 2;
        }

        if (Math.abs(col - socket.toMove.col) === 3 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 3) {
          return 1;
        } // if end pos is 4 away from start pos in a straight line


        if (Math.abs(col - socket.toMove.col) === 4 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 4) {
          return 0;
        }
      } else if (socket.toMove.value === 5) {
        console.log("moving 5"); // allow pieces to divide depending on the value

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
        } // if end pos is 5 away from start pos in a straight line


        if (Math.abs(col - socket.toMove.col) === 5 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 5) {
          return 0;
        }
      } else if (socket.toMove.value === 6) {
        console.log("moving 6"); // allow pieces to divide depending on the value

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
        } // if end pos is 6 away from start pos in a straight line


        if (Math.abs(col - socket.toMove.col) === 6 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 6) {
          return 0;
        }
      } else if (socket.toMove.value === 7) {
        console.log("moving 7"); // allow pieces to divide depending on the value

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
        } // if end pos is 7 away from start pos in a straight line


        if (Math.abs(col - socket.toMove.col) === 7 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 7) {
          return 0;
        }
      }

      return false;
    }
  }]);

  return Kake;
}(); // game arrays
// define gameState class


var GameState =
/*#__PURE__*/
function () {
  function GameState(data) {
    var _this = this;

    _classCallCheck(this, GameState);

    this.players = data.players;
    this.room = data.room;
    this.id = data.id;
    this.map = new Array(100).fill(Array(100));
    this.players.forEach(function (player) {
      if (player.isDM === false) {
        player.x = 0;
        player.y = 0;
        _this.map[player.y][player.x] = player.id;
        player["class"] = '';
        player.race = '';
        player.background = '';
        player.level = 1;
        player.xp = 0;
        player.alignment = '';
        player.str = 0;
        player.dex = 0;
        player.con = 0;
        player["int"] = 0;
        player.wis = 0;
        player.cha = 0;
        player.savingThrows = [];
        player.skills = [];
        player.proficiencyBonus = 2;
        player.initiative = 0;
        player.speed = 0;
        player.maxHitPoints = 0;
        player.hitPoints = 0;
        player.hitDice = 0;
        player.armorClass = 0;
        player.passivePerception = 0;
        player.proficiencies = [];
        player.languages = [];
        player.equipment = [];
        player.attacks = [];
        player.spells = [];
        player.features = [];
        player.personalityTraits = '';
        player.ideals = '';
        player.bonds = '';
        player.flaws = '';
        player.saves = {
          successes: 0,
          failures: 0
        };
      }
    });
  }

  _createClass(GameState, [{
    key: "setup",
    value: function setup(player, data) {
      this.map[player.y][player.x] = player.id;
      player["class"] = classList.includes(data["class"]) ? data["class"] : classList.random();
      player.race = raceList.includes(data.race) ? data.race : raceList.random();
      player.background = backgroundList.includes(data.background) ? data.background : backgroundList.random(); // TODO: Finish
    }
  }, {
    key: "addPlayer",
    value: function addPlayer(player) {
      this.map[player.y][player.x] = player.id;
      player["class"] = '';
      player.race = '';
      player.background = '';
      player.level = 1;
      player.xp = 0;
      player.alignment = '';
      player.str = 0;
      player.dex = 0;
      player.con = 0;
      player["int"] = 0;
      player.wis = 0;
      player.cha = 0;
      player.savingThrows = [];
      player.skills = [];
      player.proficiencyBonus = 2;
      player.initiative = 0;
      player.speed = 0;
      player.maxHitPoints = 0;
      player.hitPoints = 0;
      player.hitDice = 0;
      player.armorClass = 0;
      player.passivePerception = 0;
      player.proficiencies = [];
      player.languages = [];
      player.equipment = [];
      player.attacks = [];
      player.spells = [];
      player.features = [];
      player.personalityTraits = '';
      player.ideals = '';
      player.bonds = '';
      player.flaws = '';
      player.saves = {
        successes: 0,
        failures: 0
      };
    }
  }]);

  return GameState;
}(); // lists


var users = [];
var rooms = [];
pool.query("SELECT * FROM rooms ORDER BY id", function (err, res) {
  if (err) {
    console.log(err);
  } else {
    rooms = res.rows;
    rooms.forEach(function (room) {
      room.users = [];
    }); // console.log(rooms);
  }
});
var games = []; // static files

app.use(express["static"](__dirname + '/public')); // parse client sent data

app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(session({
  secret: 'keyboardcatisverycute',
  // cookie options
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 60000
  }
}));
app.use(flash());
app.get("/room", function (req, res) {
  if (req.query.room) {
    console.log(req.query.room);
    pool.query("SELECT * FROM rooms WHERE name = '".concat(req.query.room, "'"), function (err, result) {
      if (err) {
        console.log(err);
      } else {
        if (result.rowCount > 0) {
          if (result.rows[0].type === "chat") {
            res.sendFile(__dirname + '/private/room.html');
          } else if (result.rows[0].type === "game") {
            res.sendFile(__dirname + '/private/kake.html');
          }
        } else {
          res.sendStatus(404);
        }
      }
    });
  } else {
    res.sendStatus(404);
  }
});
app.get("/rpg", function (req, res) {
  res.sendFile(__dirname + '/private/game.html');
});
app.get("/", function (req, res) {
  var username = req.cookies.username;
  pool.query("SELECT * FROM users WHERE name = '".concat(username, "'"), function (err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result.rowCount > 0) {
        res.sendFile(__dirname + '/private/main.html');
      } else {
        res.sendFile(__dirname + '/public/root.html');
      }
    }
  });
}); // private routes

app.post("/login", function (req, res) {
  var username = req.body.uname;
  var password = req.body.pword;
  var sessionid = req.session.id;
  console.log("sessionid = ", sessionid);

  if (!username || !password) {
    res.redirect("/?error=invalid-credentials");
    return;
  }

  pool.query("SELECT * FROM users WHERE name = '".concat(username, "'"), function _callee(err, result) {
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (err) {
              console.log(err);
            } else {
              if (result.rowCount > 0) {
                if (bcrypt.compareSync(password, result.rows[0].password)) {
                  res.cookie('username', username);
                  pool.query("UPDATE users SET sessionid = '".concat(sessionid, "' WHERE name = '").concat(username, "'"), function (err, result) {
                    if (err) {
                      console.log(err);
                    } else {
                      res.redirect("/");
                    }
                  });
                } else {
                  res.redirect('/?error=invalid-credentials');
                }
              } else {
                res.redirect('/?error=invalid-credentials');
              }
            }

          case 1:
          case "end":
            return _context.stop();
        }
      }
    });
  });
}); // signup route

app.post("/signup", function _callee2(req, res) {
  var username, password, password2, sessionid, hashedPassword;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          username = req.body.uname;
          password = req.body.pword;
          password2 = req.body.pword2;
          sessionid = req.session.id;

          if (!(!username || !password || !password2 || password !== password2 || password.length < 8)) {
            _context2.next = 8;
            break;
          }

          res.redirect("/?error=invalid-signup");
          _context2.next = 12;
          break;

        case 8:
          _context2.next = 10;
          return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

        case 10:
          hashedPassword = _context2.sent;
          pool.query("SELECT * FROM users WHERE name = '".concat(username, "'"), function (err, result) {
            if (err) {
              console.log(err);
              res.redirect("/?error=invalid-signup");
            } else {
              if (result.rowCount > 0) {
                res.redirect("/?error=invalid-signup");
              } else {
                pool.query("INSERT INTO users (name, password, roles) VALUES ('".concat(username, "', '").concat(hashedPassword, "', '{\"@basic\"}')"), function (err, result) {
                  if (err) {
                    console.log(err);
                  } else {
                    res.cookie('username', username, {
                      maxAge: 900000
                    });
                    pool.query("UPDATE users SET sessionid = '".concat(sessionid, "' WHERE name = '").concat(username, "'"), function (err, result) {
                      if (err) {
                        console.log(err);
                      } else {
                        res.redirect("/");
                      }
                    });
                    res.redirect("/");
                  }
                });
              }
            }
          });

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // routing for logout

app.get('/logout', function (req, res) {
  req.session.destroy();
  pool.query("UPDATE users SET sessionid = NULL WHERE sessionid = '".concat(req.session, "'"), function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.clearCookie('username');
      res.redirect('/');
    }
  });
});
app.get("/dashboard", function (req, res) {
  var username = req.cookies.username;
  pool.query("SELECT * FROM users WHERE name = '".concat(username, "'"), function (err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result.rowCount > 0) {
        if (result.rows[0].roles.includes("@admin")) {
          res.sendFile(__dirname + '/private/admin.html');
        } else {
          res.sendFile(__dirname + '/private/dashboard.html');
        }
      } else {
        res.sendStatus(404);
      }
    }
  });
}); // socket io connections

io.on('connection', function (socket) {
  console.log('a user connected');
  var s_cookie = socket.handshake.headers.cookie;

  if (s_cookie) {
    var cookieParsed = cookie.parse(s_cookie); // console.log('cookieParsed:', cookieParsed);
    // console.log(cookieParsed["connect.sid"]);

    if (cookieParsed["connect.sid"]) {
      var sidParsed = cookieParser.signedCookie(cookieParsed["connect.sid"], 'keyboardcatisverycute'); // console.log(sidParsed);

      socket.sessionid = sidParsed;
    }
  } // console.log("socket id: ", socket.sessionid);


  users[socket.id] = socket;
  socket.on("getRooms", function _callee3(data) {
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            pool.query('SELECT * FROM rooms ORDER BY id', function (err, result) {
              if (err) {
                console.log(err);
              } else {
                console.log("sending rooms");
                var to_send_rooms = result.rows;
                console.log(to_send_rooms);
                pool.query("SELECT * FROM roles", function (err, res) {
                  if (err) {
                    console.log(err);
                  } else {
                    var to_send_roles = res.rows;
                    socket.emit("rooms", {
                      rooms: to_send_rooms,
                      roles: to_send_roles
                    });
                  }
                });

                if (socket.isAdmin) {
                  console.log("admin");
                  return;
                }

                socket.isLobby = true;
                delete users[socket.id];
              }
            });
            pool.query("SELECT * FROM users WHERE name = '".concat(data.uname, "' AND sessionid = '").concat(socket.sessionid, "'"), function (err, result) {
              if (err) {
                console.log(err);
              } else {
                if (result.rowCount > 0) {
                  if (result.rows[0].roles.includes("@admin")) {
                    socket.isAdmin = true;
                  }
                }
              }
            });

          case 2:
          case "end":
            return _context3.stop();
        }
      }
    });
  });
  socket.on("getRoles", function (data) {
    pool.query("SELECT * FROM users WHERE name = '".concat(data, "'"), function (err, result) {
      if (err) {
        console.log(err);
      } else {
        var to_send_roles = result.rows[0].roles;
        console.log(to_send_roles);
        pool.query("SELECT * FROM roles", function (err, res) {
          if (err) {
            console.log(err);
          } else {
            var data = [];

            for (var i = 0; i < res.rows.length; i++) {
              if (to_send_roles.includes(res.rows[i].name)) {
                data.push(res.rows[i]);
              }
            }

            console.log(data);
            socket.emit("rolelist", data);
          }
        });
      }
    });
  });
  socket.on("getAllUsers", function (data) {
    console.log("users");
    pool.query("SELECT * FROM users WHERE name = '".concat(data.uname, "' AND sessionid = '").concat(socket.sessionid, "'"), function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("here1");
        console.log(socket.sessionid);

        if (result.rowCount > 0) {
          console.log("here2");

          if (result.rows[0].roles.includes("@admin")) {
            console.log(result.rows[0].roles);
            console.log("works");
          }

          if (result.rows[0].roles.includes("@admin")) {
            pool.query('SELECT * FROM users', function (err, result) {
              if (err) {
                console.log(err);
              } else {
                console.log(result.rows);
                var users = result.rows;
                pool.query("SELECT * FROM roles", function (err, res) {
                  if (err) {
                    console.log(err);
                  } else {
                    var roles = res.rows;
                    socket.emit("allUsers", {
                      users: users,
                      roles: roles
                    });
                  }
                });
              }
            });
          }
        } else {
          socket.emit("refresh");
        }
      }
    });
  });
  socket.on("isAdmin", function _callee4(data) {
    return regeneratorRuntime.async(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            pool.query("SELECT * FROM users WHERE name = '".concat(data.uname, "' AND sessionid = '").concat(socket.sessionid, "'"), function (err, result) {
              if (err) {
                console.log(err);
              } else {
                if (result.rowCount > 0) {
                  if (result.rows[0].roles.includes("@admin")) {
                    socket.isAdmin = true;
                    socket.isLobby = false;
                    console.log("is admin");
                  }
                }
              }
            });

          case 1:
          case "end":
            return _context4.stop();
        }
      }
    });
  });
  socket.on("deleteUser", function (data) {
    console.log("deleting user: " + data.user);
    pool.query("SELECT * FROM users WHERE name = '".concat(data.uname, "' AND sessionid = '").concat(socket.sessionid, "'"), function (err, result) {
      if (err) {
        console.log(err);
      } else {
        if (result.rowCount > 0) {
          if (result.rows[0].roles.includes("@admin")) {
            console.log("delete user");
            pool.query("DELETE FROM users WHERE name = '".concat(data.user, "'"), function (err, result) {
              if (err) {
                console.log(err);
              } else {
                console.log("user deleted");
                pool.query("SELECT * FROM users ORDER BY id", function (err, result) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log(result.rows);
                    var users = result.rows;
                    pool.query("SELECT * FROM roles ORDER BY id", function (err, res) {
                      if (err) {
                        console.log(err);
                      } else {
                        var roles = res.rows;
                        socket.emit("allUsers", {
                          users: users,
                          roles: roles
                        });
                        socket.emit("success", "User deleted.");
                      }
                    });
                  }
                });
              }
            });
          }
        }
      }
    });
  });
  socket.on("deleteRoom", function (data) {
    console.log("deleting room: " + data.name);
    pool.query("SELECT * FROM users WHERE name = '".concat(data.uname, "' AND sessionid = '").concat(socket.sessionid, "'"), function (err, result) {
      if (err) {
        console.log(err);
      } else {
        if (result.rowCount > 0) {
          if (result.rows[0].roles.includes("@admin")) {
            console.log("delete room");
            pool.query("DELETE FROM rooms WHERE name = '".concat(data.name, "'"), function (err, result) {
              if (err) {
                console.log(err);
              } else {
                console.log("room deleted");
                pool.query('SELECT * FROM rooms', function (err, result) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log(result.rows);
                    var rooms = result.rows;
                    socket.emit("rooms", {
                      rooms: rooms,
                      noroles: true
                    });
                  }
                });
              }
            });
          }
        }
      }
    });
  });
  socket.on("addRoom", function (data) {
    console.log("adding room");
    console.log(data.uname);
    var permitted = false;
    pool.query("SELECT * FROM users WHERE name = '".concat(data.uname, "' AND sessionid = '").concat(socket.sessionid, "'"), function (err, result) {
      if (err) {
        console.log(err);
      } else {
        if (result.rowCount > 0) {
          // if user is admin
          console.log(result.rows);
          console.log(result.rows[0].roles.includes("@admin"));

          if (result.rows[0].roles.includes("@admin")) {
            console.log("admin");
            if (!data) return;
            console.log("data");
            if (data.name === "") return;
            console.log("passed tests");
            pool.query("SELECT * FROM rooms WHERE name = '".concat(data.name, "'"), function (err, result) {
              if (err) {
                console.log(err);
                socket.emit("invalidRoom", "Invalid room name.");
              } else {
                if (result.rowCount > 0) {
                  socket.emit("invalidRoom", "Room already exists.");
                } else {
                  var type = data.type === "Chat" | "chat" ? "chat" : "game";
                  pool.query("INSERT INTO rooms (name, type, req_roles) VALUES ('".concat(data.name, "', '").concat(type, "', '{\"").concat(data.roles, "\"}')"), function (err, result) {
                    if (err) {
                      console.log(err);
                      socket.emit("invalidRoom", "Invalid room type.");
                    } else {
                      socket.emit("success", "Room added.");
                      rooms[rooms.length - 1].users = [];
                      pool.query("SELECT * FROM rooms ORDER BY id", function (err, result) {
                        if (err) {
                          console.log(err);
                        } else {
                          io.emit("rooms", result.rows);
                          console.log("rooms before", rooms);
                          users_rooms = [];
                          rooms.forEach(function (room) {
                            users_rooms.push(room.users);
                          });
                          console.log(users_rooms);
                          rooms = result.rows;
                          rooms.forEach(function (room) {
                            room.users = users_rooms[rooms.indexOf(room)];
                          });
                          console.log("rooms after", rooms);
                          socket.emit("rooms", rooms);
                        }
                      });
                    }
                  });
                }
              }
            });
          } else {
            permitted = false;
          }
        } else {
          permitted = false;
        }
      }
    });
  });
  socket.on("addUser", function _callee6(data) {
    var permitted;
    return regeneratorRuntime.async(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            console.log("adduser");
            permitted = false;
            pool.query("SELECT * FROM users WHERE name = '".concat(data.uname, "' AND sessionid = '").concat(socket.sessionid, "'"), function _callee5(err, result) {
              var hashedPassword;
              return regeneratorRuntime.async(function _callee5$(_context5) {
                while (1) {
                  switch (_context5.prev = _context5.next) {
                    case 0:
                      if (!err) {
                        _context5.next = 4;
                        break;
                      }

                      console.log(err);
                      _context5.next = 35;
                      break;

                    case 4:
                      if (!(result.rowCount > 0)) {
                        _context5.next = 34;
                        break;
                      }

                      if (!result.rows[0].roles.includes("@admin")) {
                        _context5.next = 31;
                        break;
                      }

                      permitted = true;

                      if (permitted) {
                        _context5.next = 9;
                        break;
                      }

                      return _context5.abrupt("return");

                    case 9:
                      console.log("isadmin");

                      if (data) {
                        _context5.next = 12;
                        break;
                      }

                      return _context5.abrupt("return");

                    case 12:
                      console.log("data");

                      if (!(data.name === "")) {
                        _context5.next = 15;
                        break;
                      }

                      return _context5.abrupt("return");

                    case 15:
                      console.log("uname");

                      if (!(data.pword === "")) {
                        _context5.next = 18;
                        break;
                      }

                      return _context5.abrupt("return");

                    case 18:
                      console.log("pword");

                      if (!(data.pword !== data.pword2)) {
                        _context5.next = 21;
                        break;
                      }

                      return _context5.abrupt("return");

                    case 21:
                      console.log("pword2");

                      if (!(data.pword.length < 8)) {
                        _context5.next = 24;
                        break;
                      }

                      return _context5.abrupt("return");

                    case 24:
                      console.log("pword length");
                      _context5.next = 27;
                      return regeneratorRuntime.awrap(bcrypt.hash(data.pword, 10));

                    case 27:
                      hashedPassword = _context5.sent;
                      pool.query("SELECT * FROM users WHERE name = '".concat(data.name, "'"), function (err, result) {
                        if (err) {
                          console.log(err);
                          socket.emit("invalidUser", "Invalid user name.");
                        } else {
                          if (result.rowCount > 0) {
                            socket.emit("invalidUser", "User already exists.");
                          } else {
                            if (!data.roles) {
                              pool.query("INSERT INTO users (name, password, roles) VALUES ('".concat(data.name, "', '").concat(hashedPassword, "', '{\"@basic\"}')"), function (err, result) {
                                if (err) {
                                  console.log(err);
                                } else {
                                  socket.emit("success", "User added.");
                                }
                              });
                            } else {
                              var roles = data.roles.toString().split(",");
                              var rolesString = "{";

                              for (var i = 0; i < roles.length; i++) {
                                rolesString += "\"".concat(roles[i], "\",");
                              }

                              pool.query("INSERT INTO users (name, password, roles) VALUES ('".concat(data.name, "', '").concat(hashedPassword, "', '").concat(data.roles, "')"), function (err, result) {
                                if (err) {
                                  console.log(err);
                                } else {
                                  socket.emit("success", "User added.");
                                  pool.query('SELECT * FROM users', function (err, result) {
                                    if (err) {
                                      console.log(err);
                                    } else {
                                      console.log(result.rows);
                                      var users = result.rows;
                                      pool.query("SELECT * FROM roles", function (err, res) {
                                        if (err) {
                                          console.log(err);
                                        } else {
                                          var roles = res.rows;
                                          socket.emit("allUsers", {
                                            users: users,
                                            roles: roles
                                          });
                                        }
                                      });
                                    }
                                  });
                                }
                              });
                            }
                          }
                        }
                      });
                      _context5.next = 32;
                      break;

                    case 31:
                      permitted = false;

                    case 32:
                      _context5.next = 35;
                      break;

                    case 34:
                      permitted = false;

                    case 35:
                    case "end":
                      return _context5.stop();
                  }
                }
              });
            });

          case 3:
          case "end":
            return _context6.stop();
        }
      }
    });
  });
  socket.on("roomType", function _callee7(roomName) {
    return regeneratorRuntime.async(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            pool.query("SELECT * FROM rooms WHERE name = '".concat(roomName, "'"), function (err, result) {
              if (err) {
                console.log(err);
              } else {
                if (result.rowCount > 0) {
                  socket.emit("roomType", result.rows[0].type);
                }
              }
            });

          case 1:
          case "end":
            return _context7.stop();
        }
      }
    });
  }); // on joinRoom

  socket.on("joinRoom", function (_ref3) {
    var room = _ref3.room,
        username = _ref3.username;
    console.log("joining room: ", room);
    pool.query("SELECT * FROM rooms WHERE name = '".concat(room, "'"), function (err, result) {
      if (err) {
        console.log(err);
      } else {
        if (result.rowCount > 0) {
          console.log(result.rows[0].req_roles);
          var rooms_roles = result.rows[0].req_roles;
          pool.query("SELECT * FROM users WHERE name = '".concat(username, "'"), function (err, result) {
            if (err) {
              console.log(err);
            } else {
              if (result.rowCount > 0) {
                var user_roles = result.rows[0].roles;
                var permitted = false;

                if (user_roles.includes(rooms_roles[0]) || user_roles.includes("@admin") || user_roles.includes("@allrooms")) {
                  permitted = true;
                }

                console.log("yes");

                if (permitted) {
                  var _sel_room = rooms.filter(function (i_room) {
                    return i_room.name === room;
                  });

                  _sel_room = _sel_room[0];

                  if (_sel_room.users.indexOf(username) !== -1) {
                    console.log("is in room");
                    socket.emit("users", null);
                    return;
                  }

                  socket.current_room = _sel_room.name;
                  socket.username = username;
                  socket.isLobby = false;

                  if (_sel_room.type === 'chat') {
                    // console.log(room);
                    socket.join(room);

                    _sel_room.users.push(socket.username);

                    console.log("User " + socket.username + " joined room " + room);
                    io.to(room).emit("users", _sel_room.users);
                    socket.broadcast.to(room).emit('message', messageFormatter("system", "System", "User " + socket.username + " has joined the chat."));
                  } else if (_sel_room.type === 'game') {
                    console.log("game room");
                    console.log("users: " + _sel_room.users);

                    if (_sel_room.users.length > 1) {
                      socket.emit("redir");
                      return;
                    }

                    socket.join(room);

                    _sel_room.users.push(socket.username);

                    console.log("User " + socket.username + " joined room " + room);
                    io.to(room).emit("users", _sel_room.users);

                    if (_sel_room.users.length === 2) {
                      socket.color = 2;
                      games[room] = new Kake(room);
                      console.log("second");
                      console.log(users);
                      var _iteratorNormalCompletion7 = true;
                      var _didIteratorError7 = false;
                      var _iteratorError7 = undefined;

                      try {
                        for (var _iterator7 = io.sockets.adapter.rooms[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                          var sroom = _step7.value;
                          console.log(sroom);

                          if (sroom[0] === room) {
                            console.log(sroom);
                            var _iteratorNormalCompletion8 = true;
                            var _didIteratorError8 = false;
                            var _iteratorError8 = undefined;

                            try {
                              for (var _iterator8 = sroom[1][Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                                var ssocket = _step8.value;
                                console.log("socket: " + ssocket);
                                users[ssocket].emit("ok", {
                                  data: games[room].showBoard(users[ssocket]),
                                  color: users[ssocket.color]
                                });
                              }
                            } catch (err) {
                              _didIteratorError8 = true;
                              _iteratorError8 = err;
                            } finally {
                              try {
                                if (!_iteratorNormalCompletion8 && _iterator8["return"] != null) {
                                  _iterator8["return"]();
                                }
                              } finally {
                                if (_didIteratorError8) {
                                  throw _iteratorError8;
                                }
                              }
                            }
                          }
                        }
                      } catch (err) {
                        _didIteratorError7 = true;
                        _iteratorError7 = err;
                      } finally {
                        try {
                          if (!_iteratorNormalCompletion7 && _iterator7["return"] != null) {
                            _iterator7["return"]();
                          }
                        } finally {
                          if (_didIteratorError7) {
                            throw _iteratorError7;
                          }
                        }
                      }
                    } else if (_sel_room.users.length === 1) {
                      console.log("first");
                      socket.color = 1;
                    }
                  }
                } else {
                  socket.emit("noPerms");
                }
              } else {
                socket.emit("invalidUser", "Invalid user name.");
              }
            }
          });
        } else {
          socket.emit("invalidRoom", "Invalid room name.");
        }
      }
    });
  });
  socket.on("chatMessage", function (msg) {
    console.log("sending message");

    if (!socket.isLobby) {
      console.log("not lobby");
      console.log(socket.current_room);
      io.to(socket.current_room).emit('message', messageFormatter("user", socket.username, msg));
      return;
    }

    console.log("yes lobby");
  });
  socket.on("getUsers", function (room) {
    sel_room = rooms.filter(function (i_room) {
      return i_room.name === room;
    });
    sel_room = sel_room[0]; // console.log("users room: ", sel_room);

    socket.emit("users", sel_room.users);
  }); // mmorpg socket.io functions
  //TODO: create functional gameplay

  socket.on("gameConnect", function (_ref4) {
    var name = _ref4.name,
        room = _ref4.room;
    console.log("user " + name + " connected to mmorpg");
    var roomgames = games.filter(function (g_room) {
      return g_room.name === room;
    });
    socket.player = {
      name: name,
      isDM: false
    };

    if (roomgames.length === 0) {
      games.push(new GameState({
        id: crypto.randomUUID(),
        name: room,
        players: [socket.player]
      }));
    } else {
      roomgames[0].addPlayer(socket.player);
    }

    socket.emit("createCharacter", {
      alreadyDM: false
    });
  });
  socket.on("characterData", function (data) {
    if (!socket.player) return;
    if (socket.player.isDM) return; // for now

    if (data.toAdd.skillProficiencies) {
      if (data.toAdd.skillProficiencies.length !== socket.player.skillProficiencyQuantity) {
        socket.emit("notification", "You must select " + socket.player.skillProficiencyQuantity + " skill proficiencies.");
        return;
      }

      data.toAdd.skillProficiencies.forEach(function (skill) {
        socket.player.skills.push(skill);
      });
    }

    if (data.toAdd.pack) {
      var _iteratorNormalCompletion9 = true;
      var _didIteratorError9 = false;
      var _iteratorError9 = undefined;

      try {
        for (var _iterator9 = packs.find(function (pack) {
          return pack.name === data.toAdd.pack;
        }).items[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
          var item = _step9.value;
          socket.player.inventory.push(new Item(item));
        }
      } catch (err) {
        _didIteratorError9 = true;
        _iteratorError9 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion9 && _iterator9["return"] != null) {
            _iterator9["return"]();
          }
        } finally {
          if (_didIteratorError9) {
            throw _iteratorError9;
          }
        }
      }
    }

    for (var _i4 = 0, _Object$keys = Object.keys(data.toAdd); _i4 < _Object$keys.length; _i4++) {
      var key = _Object$keys[_i4];
      console.log(key);
      console.log("to add: " + data.toAdd[key]);
      console.log(socket.player[key]);

      if (Array.isArray(socket.player[key])) {
        (function () {
          var split_data = data.toAdd[key];
          console.log("split data: " + split_data);

          if (Array.isArray(split_data)) {
            console.log("korrekt");
            var _iteratorNormalCompletion10 = true;
            var _didIteratorError10 = false;
            var _iteratorError10 = undefined;

            try {
              var _loop = function _loop() {
                var item = _step10.value;
                console.log("correkt 2");

                if (Array.isArray(item)) {
                  console.log("item");
                  var _iteratorNormalCompletion11 = true;
                  var _didIteratorError11 = false;
                  var _iteratorError11 = undefined;

                  try {
                    var _loop2 = function _loop2() {
                      var i = _step11.value;
                      console.log("i");

                      if (weapons.find(function (w) {
                        return w.name === i;
                      })) {
                        // jshint ignore:line
                        socket.player[key] = socket.player[key].concat([new Weapon(i)]);
                        console.log("is wepon");
                      } else if (armors.find(function (a) {
                        return a.name === i;
                      })) {
                        // jshint ignore:line
                        socket.player[key] = socket.player[key].concat([new Armor(i)]);
                        console.log("is armor");
                      } else if (packs.find(function (p) {
                        return p.name === i;
                      })) {
                        // jshint ignore:line
                        socket.player[key] = socket.player[key].concat([new Pack(i)]);
                        console.log("is pak");
                      } else {
                        socket.player[key] = socket.player[key].concat([new Item(i)]);
                        console.log("is musik");
                      }
                    };

                    for (var _iterator11 = item[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                      _loop2();
                    }
                  } catch (err) {
                    _didIteratorError11 = true;
                    _iteratorError11 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion11 && _iterator11["return"] != null) {
                        _iterator11["return"]();
                      }
                    } finally {
                      if (_didIteratorError11) {
                        throw _iteratorError11;
                      }
                    }
                  }
                } else {
                  console.log("not arrey");

                  if (weapons.find(function (w) {
                    return w.name === item;
                  })) {
                    socket.player[key] = socket.player[key].concat([new Weapon(item)]);
                  } else if (armors.find(function (a) {
                    return a.name === item;
                  })) {
                    socket.player[key] = socket.player[key].concat([new Armor(item)]);
                  } else if (packs.find(function (p) {
                    return p.name === item;
                  })) {
                    socket.player[key] = socket.player[key].concat([new Pack(item)]);
                  } else {
                    socket.player[key] = socket.player[key].concat([new Item(item)]);
                  }
                }
              };

              for (var _iterator10 = split_data[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                _loop();
              }
            } catch (err) {
              _didIteratorError10 = true;
              _iteratorError10 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion10 && _iterator10["return"] != null) {
                  _iterator10["return"]();
                }
              } finally {
                if (_didIteratorError10) {
                  throw _iteratorError10;
                }
              }
            }
          } else {
            if (weapons.find(function (w) {
              return w.name === split_data;
            })) {
              socket.player[key] = socket.player[key].concat([new Weapon(split_data)]);
            } else if (armors.find(function (a) {
              return a.name === split_data;
            })) {
              socket.player[key] = socket.player[key].concat([new Armor(split_data)]);
            } else if (packs.find(function (p) {
              return p.name === split_data;
            })) {
              socket.player[key] = socket.player[key].concat([new Pack(split_data)]);
            } else {
              socket.player[key] = socket.player[key].concat([new Item(split_data)]);
            }
          }
        })();
      } else {
        socket.player[key] = data.toAdd[key];
      }

      console.log(socket.player[key]);
    }

    if (data.toAdd["class"]) {
      var index = classList.findIndex(function (i) {
        return i.name === data.toAdd["class"];
      });
      socket.player.hitDice = "1d" + classList[index].hitDice;
      socket.player.hitDiceMax = "1d" + classList[index].hitDice;
      socket.player.hitPoints = classList[index].hitPoints;
      var toolProfs = classList[index].toolProficiencies.includes("None") ? [] : classList[index].toolProficiencies;
      socket.player.proficiencies = classList[index].armorProficiencies.concat(classList[index].weaponProficiencies).concat(toolProfs);
      socket.player.savingThrows = classList[index].savingThrowProficiencies;
      socket.player.skillProficiencyQuantity = classList[index].skillProficiencyQuantity;
      socket.emit("classPersonalization", classList.find(function (sel_class) {
        return sel_class.name === data.toAdd["class"];
      }));
    }

    if (data.toAdd.equipment) {
      socket.emit("showUI", {
        player: socket.player
      });
    }

    socket.emit("notification", "Character data saved.");
  });
  socket.on("getItem", function (item) {
    if (!socket.player) return;
    if (socket.player.isDM) return; // for now

    console.log("get item: " + item);

    if (weapons.find(function (w) {
      return w.name === item;
    })) {
      socket.emit("item", _objectSpread({}, new Weapon(item)));
    } else if (armors.find(function (a) {
      return a.name === item;
    })) {
      socket.emit("item", _objectSpread({}, new Armor(item)));
    } else if (packs.find(function (p) {
      return p.name === item;
    })) {
      socket.emit("item", _objectSpread({}, new Pack(item)));
    } else {
      socket.emit("item", _objectSpread({}, new Item(item)));
    }
  }); // kake socket.io functions 

  socket.on("getupdate", function () {
    console.log(games);
    board = games[socket.current_room].board;
    io.emit("msg", "room: " + socket.current_room);
    console.log(socket.color);
    socket.emit("update", {
      board: games[socket.current_room].showBoard(socket)
    });
  });
  socket.on("move", function (data) {
    if (games[socket.current_room]) games[socket.current_room].move(socket, data);
  }); // on disconnect

  socket.on('disconnect', function () {
    socket.color = undefined;

    if (socket.isLobby) {
      delete users[socket.id];
      return;
    }

    var user = users[socket.id];
    if (!user) return; // console.log("rooms: ", rooms);

    sel_room = rooms.filter(function (i_room) {
      console.log(i_room.name, ", current room: ", socket.current_room);
      return i_room.name == user.current_room;
    });

    if (!sel_room[0]) {
      delete users[socket.id];
      return;
    }

    console.log(sel_room);
    sel_room = sel_room[0];
    sel_room.users = sel_room.users.filter(function (i_user) {
      return i_user !== user.username;
    });

    if (!user.username) {
      delete users[socket.id];
      return;
    }

    io.to(user.current_room).emit('message', messageFormatter("system", "System", "".concat(user.username, " has left the chat"))); // Send users and room info

    io.to(user.room).emit("users", sel_room.users);
    delete users[socket.id];
  });
}); // server listen

http.listen(port, function () {
  console.log('listening on *:' + port);
});