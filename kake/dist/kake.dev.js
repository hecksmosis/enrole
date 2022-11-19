"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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
    this.board = initialSetup(this.board);
    this.turn = 1;
    this.invertedBoard = this.showBoard();
  }

  _createClass(Kake, [{
    key: "showBoard",
    value: function showBoard() {
      var socket = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (!socket) {
        // return inverted board
        var board = [];

        for (var i = 0; i < 8; i++) {
          board[i] = [];

          for (var j = 0; j < 8; j++) {
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
        io.to(this.room).emit("isWon");
        var board = this.showBoard(socket);
        socket.jewels = []; // TODO: Moves that make you lose should be invalid
        // get your own jewels

        this.getJewels(socket, board); // get other player's jewels

        var otherPlayer = this.getOtherPlayer(socket);
        otherPlayer.jewels = [];
        var otherPlayerBoard = this.showBoard(otherPlayer);
        this.getJewels(otherPlayer, otherPlayerBoard);
        console.log("jewels: ", socket.jewels);

        if (socket.isMoving) {
          var remaining = this.isValidMove(socket, board, {
            col: col,
            row: row,
            isChecker: isChecker,
            color: color
          });
          console.log("remaining: " + remaining);

          if (remaining !== false) {
            console.log("move is valid"); // check if there is already a same color checker in end pos and add up the values

            var place = board[row][col];
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
                var canmove = 7 - board[row][col] % 10;
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
                  socket.emit("moves", {
                    moves: []
                  });
                  var _iteratorNormalCompletion = true;
                  var _didIteratorError = false;
                  var _iteratorError = undefined;

                  try {
                    for (var _iterator = io.sockets.adapter.rooms[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                      var sroom = _step.value;

                      if (sroom[0] === this.room) {
                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                          for (var _iterator2 = sroom[1][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var ssocket = _step2.value;
                            console.log("socket: " + ssocket);
                            users[ssocket].emit("turn", {
                              turn: this.turn,
                              color: users[ssocket].color
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
                  socket.emit("moves", {
                    moves: []
                  });
                  var _iteratorNormalCompletion3 = true;
                  var _didIteratorError3 = false;
                  var _iteratorError3 = undefined;

                  try {
                    for (var _iterator3 = io.sockets.adapter.rooms[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                      var _sroom = _step3.value;

                      if (_sroom[0] === this.room) {
                        var _iteratorNormalCompletion4 = true;
                        var _didIteratorError4 = false;
                        var _iteratorError4 = undefined;

                        try {
                          for (var _iterator4 = _sroom[1][Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                            var _ssocket = _step4.value;
                            console.log("socket: " + _ssocket);

                            users[_ssocket].emit("turn", {
                              turn: this.turn,
                              color: users[_ssocket].color
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
              var _iteratorNormalCompletion5 = true;
              var _didIteratorError5 = false;
              var _iteratorError5 = undefined;

              try {
                for (var _iterator5 = io.sockets.adapter.rooms[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                  var _sroom2 = _step5.value;

                  if (_sroom2[0] === this.room) {
                    var _iteratorNormalCompletion6 = true;
                    var _didIteratorError6 = false;
                    var _iteratorError6 = undefined;

                    try {
                      for (var _iterator6 = _sroom2[1][Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                        var _ssocket2 = _step6.value;
                        console.log("socket: " + _ssocket2);

                        users[_ssocket2].emit("turn", {
                          turn: this.turn,
                          color: users[_ssocket2].color
                        });

                        users[_ssocket2].emit("update", {
                          board: games[this.room].showBoard(users[_ssocket2])
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

              return;
            }

            if (_digit === socket.color) {
              console.log("same color");
              board[socket.toMove.row][socket.toMove.col] = 0;
              board[row][col] += socket.toMove.value;
            } else {
              board[socket.toMove.row][socket.toMove.col] = 0;
              board[row][col] = socket.toMove.color * 10 + socket.toMove.value;
            }

            console.log(board[row][col]);
            console.log(board);
            console.log("NOTE => room: ", this.room); // update board

            this.setBoard(socket, board);
            console.log("object board: " + this.board.toString()); // this.board is for blue player and this.invertedBoard is for red player

            console.log("emitting is won"); // emit only once?

            io.to(this.room).emit("isWon");
            socket.isMoving = false;
            socket.toMove = null;
            this.turn = this.turn === 1 ? 2 : 1;
            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
              for (var _iterator7 = io.sockets.adapter.rooms[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                var _sroom3 = _step7.value;

                if (_sroom3[0] === this.room) {
                  var _iteratorNormalCompletion8 = true;
                  var _didIteratorError8 = false;
                  var _iteratorError8 = undefined;

                  try {
                    for (var _iterator8 = _sroom3[1][Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                      var _ssocket3 = _step8.value;
                      console.log("socket: " + _ssocket3);

                      users[_ssocket3].emit("turn", {
                        turn: this.turn,
                        color: users[_ssocket3].color
                      });

                      users[_ssocket3].emit("update", {
                        board: games[this.room].showBoard(users[_ssocket3])
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

            return;
          } else {
            socket.isMoving = false;
            socket.toMove = null;
            socket.emit("moves", {
              moves: []
            });
            var _iteratorNormalCompletion9 = true;
            var _didIteratorError9 = false;
            var _iteratorError9 = undefined;

            try {
              for (var _iterator9 = io.sockets.adapter.rooms[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                var _sroom4 = _step9.value;

                if (_sroom4[0] === this.room) {
                  var _iteratorNormalCompletion10 = true;
                  var _didIteratorError10 = false;
                  var _iteratorError10 = undefined;

                  try {
                    for (var _iterator10 = _sroom4[1][Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                      var _ssocket4 = _step10.value;
                      console.log("socket: " + _ssocket4);

                      users[_ssocket4].emit("turn", {
                        turn: this.turn,
                        color: users[_ssocket4].color
                      });
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
                }
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

            return;
          }
        }

        var myVar = board[row][col];
        var sdigit = ('' + myVar)[0];
        console.log("checker: ", myVar);
        console.log(sdigit, ", color: " + socket.color);
        console.log("value: " + board[row][col] % 10);
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
          value: board[row][col] % 10
        };
        var moves = [];

        for (var i = 0; i < 8; i++) {
          for (var j = 0; j < 8; j++) {
            var space = board[j][i];
            var tseldigit = ('' + space)[0];

            var _digit2 = parseInt(tseldigit);

            var _remaining = this.isValidMove(socket, board, {
              row: j,
              col: i
            });

            if (_remaining !== false) {
              if (space % 10 === 7 && _digit2 === socket.color) {
                continue;
              } else if (socket.toMove.value === socket.jewels[0].value && socket.jewels.length === 1) {
                // restricted movement as it is a jewel
                if (_remaining === 0) {
                  console.log(space % 10);
                  moves.push({
                    row: j,
                    col: i,
                    rem: socket.toMove.value
                  });
                }
              } else if (socket.toMove.value - _remaining + space % 10 > 7) {
                // overflow, rem = the number of checkers necessary to fill the end spot up to 7 value
                if (_digit2 !== socket.color) {
                  moves.push({
                    row: j,
                    col: i,
                    rem: socket.toMove.value - _remaining
                  });
                  continue;
                } else {
                  var rem = 7 - space % 10;
                  moves.push({
                    row: j,
                    col: i,
                    rem: rem
                  });
                }
              } else {
                moves.push({
                  row: j,
                  col: i,
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
        var _iteratorNormalCompletion11 = true;
        var _didIteratorError11 = false;
        var _iteratorError11 = undefined;

        try {
          for (var _iterator11 = io.sockets.adapter.rooms[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
            var _sroom5 = _step11.value;

            if (_sroom5[0] === this.room) {
              var _iteratorNormalCompletion12 = true;
              var _didIteratorError12 = false;
              var _iteratorError12 = undefined;

              try {
                for (var _iterator12 = _sroom5[1][Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                  var _ssocket5 = _step12.value;
                  console.log("socket: " + _ssocket5);

                  users[_ssocket5].emit("turn", {
                    turn: this.turn,
                    color: users[_ssocket5].color
                  });
                }
              } catch (err) {
                _didIteratorError12 = true;
                _iteratorError12 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion12 && _iterator12["return"] != null) {
                    _iterator12["return"]();
                  }
                } finally {
                  if (_didIteratorError12) {
                    throw _iteratorError12;
                  }
                }
              }
            }
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

        console.log(socket.toMove);
      } else return;
    }
  }, {
    key: "isValidMove",
    value: function isValidMove(socket, _board, _ref2) {
      var col = _ref2.col,
          row = _ref2.row;

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
        } // if end pos is 2 away from start pos in a straight line


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
        } // if end pos is 3 away from start pos in a straight line


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
        } // if end pos is 4 away from start pos in a straight line


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
        } // if end pos is 5 away from start pos in a straight line


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
        } // if end pos is 6 away from start pos in a straight line


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
        } // if end pos is 7 away from start pos in a straight line


        if (Math.abs(col - socket.toMove.col) === 7 && Math.abs(row - socket.toMove.row) === 0 || Math.abs(col - socket.toMove.col) === 0 && Math.abs(row - socket.toMove.row) === 7) {
          return 0;
        }
      }

      return false;
    }
  }, {
    key: "getJewels",
    value: function getJewels(socket, board) {
      var hvalue = 0;
      var rows = 8;
      var cols = 8;

      for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
          var selplace = board[i][j];
          var sseldigit = ('' + selplace)[0];
          var tdigit = parseInt(sseldigit);

          if (tdigit === socket.color) {
            // if it has the highest value of the pieces of that color the append it to the jewels array
            hvalue = board[i][j] % 10 > hvalue ? board[i][j] % 10 : hvalue;
          }
        }
      }

      rows = 8;
      cols = 8;

      for (var _i2 = 0; _i2 < rows; _i2++) {
        for (var _j2 = 0; _j2 < cols; _j2++) {
          var sselplace = board[_i2][_j2];
          var ssseldigit = ('' + sselplace)[0];

          var _tdigit = parseInt(ssseldigit);

          if (_tdigit === socket.color) {
            if (board[_i2][_j2] % 10 === hvalue) {
              socket.jewels.push({
                row: _i2,
                col: _j2,
                color: socket.color,
                value: board[_i2][_j2] % 10
              });
            }
          }
        }
      }
    }
  }, {
    key: "getOtherPlayer",
    value: function getOtherPlayer(socket) {
      var _iteratorNormalCompletion13 = true;
      var _didIteratorError13 = false;
      var _iteratorError13 = undefined;

      try {
        for (var _iterator13 = io.sockets.adapter.rooms[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
          var sroom = _step13.value;

          if (sroom[0] === this.room) {
            var _iteratorNormalCompletion14 = true;
            var _didIteratorError14 = false;
            var _iteratorError14 = undefined;

            try {
              for (var _iterator14 = sroom[1][Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
                var ssocket = _step14.value;

                if (ssocket !== socket.id) {
                  return users[ssocket];
                }
              }
            } catch (err) {
              _didIteratorError14 = true;
              _iteratorError14 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion14 && _iterator14["return"] != null) {
                  _iterator14["return"]();
                }
              } finally {
                if (_didIteratorError14) {
                  throw _iteratorError14;
                }
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError13 = true;
        _iteratorError13 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion13 && _iterator13["return"] != null) {
            _iterator13["return"]();
          }
        } finally {
          if (_didIteratorError13) {
            throw _iteratorError13;
          }
        }
      }
    }
  }, {
    key: "isWon",
    value: function isWon(socket) {
      var counter, i, j, place, seldigit, digit, win_username, _iteratorNormalCompletion15, _didIteratorError15, _iteratorError15, _iterator15, _step15, sroom, _iteratorNormalCompletion16, _didIteratorError16, _iteratorError16, _iterator16, _step16, ssocket;

      return regeneratorRuntime.async(function isWon$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              console.log("chekin if geim is guon, color: " + socket.color);
              counter = 0;

              for (i = 0; i < 8; i++) {
                for (j = 0; j < 8; j++) {
                  place = this.board[i][j];
                  seldigit = ('' + place)[0];
                  digit = parseInt(seldigit);

                  if (digit === socket.color) {
                    counter++;
                  }
                }
              }

              socket.jewels = [];
              console.log("board: ", this.board);
              console.log("inverted board: ", this.invertedBoard); // get your own jewels

              this.getJewels(socket, socket.color === 2 ? this.board : this.invertedBoard);
              console.log("jewels: ", socket.jewels);
              console.log("jewel count: ", socket.jewels.length, ", piece count: ", counter); // win / loss mechanism

              if (!(socket.jewels.length === counter)) {
                _context.next = 61;
                break;
              }

              // i win
              win_username = this.getOtherPlayer(socket).username;
              _iteratorNormalCompletion15 = true;
              _didIteratorError15 = false;
              _iteratorError15 = undefined;
              _context.prev = 14;
              _iterator15 = io.sockets.adapter.rooms[Symbol.iterator]();

            case 16:
              if (_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done) {
                _context.next = 41;
                break;
              }

              sroom = _step15.value;

              if (!(sroom[0] === this.room)) {
                _context.next = 38;
                break;
              }

              _iteratorNormalCompletion16 = true;
              _didIteratorError16 = false;
              _iteratorError16 = undefined;
              _context.prev = 22;

              for (_iterator16 = sroom[1][Symbol.iterator](); !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
                ssocket = _step16.value;
                users[ssocket].emit("win", {
                  losecolor: users[ssocket].color,
                  color: socket.color,
                  aa: true
                });
              }

              _context.next = 30;
              break;

            case 26:
              _context.prev = 26;
              _context.t0 = _context["catch"](22);
              _didIteratorError16 = true;
              _iteratorError16 = _context.t0;

            case 30:
              _context.prev = 30;
              _context.prev = 31;

              if (!_iteratorNormalCompletion16 && _iterator16["return"] != null) {
                _iterator16["return"]();
              }

            case 33:
              _context.prev = 33;

              if (!_didIteratorError16) {
                _context.next = 36;
                break;
              }

              throw _iteratorError16;

            case 36:
              return _context.finish(33);

            case 37:
              return _context.finish(30);

            case 38:
              _iteratorNormalCompletion15 = true;
              _context.next = 16;
              break;

            case 41:
              _context.next = 47;
              break;

            case 43:
              _context.prev = 43;
              _context.t1 = _context["catch"](14);
              _didIteratorError15 = true;
              _iteratorError15 = _context.t1;

            case 47:
              _context.prev = 47;
              _context.prev = 48;

              if (!_iteratorNormalCompletion15 && _iterator15["return"] != null) {
                _iterator15["return"]();
              }

            case 50:
              _context.prev = 50;

              if (!_didIteratorError15) {
                _context.next = 53;
                break;
              }

              throw _iteratorError15;

            case 53:
              return _context.finish(50);

            case 54:
              return _context.finish(47);

            case 55:
              console.log("User " + socket.username + " lost the game!");
              _context.next = 58;
              return regeneratorRuntime.awrap(pool.query("UPDATE users SET wins = wins + 1 WHERE name = '".concat(win_username, "'"), function (err, result) {
                if (err) {
                  console.log(err);
                }
              }));

            case 58:
              _context.next = 60;
              return regeneratorRuntime.awrap(pool.query("UPDATE users SET losses = losses + 1 WHERE name = '".concat(socket.username, "'"), function (err, result) {
                if (err) {
                  console.log(err);
                }
              }));

            case 60:
              return _context.abrupt("return");

            case 61:
            case "end":
              return _context.stop();
          }
        }
      }, null, this, [[14, 43, 47, 55], [22, 26, 30, 38], [31,, 33, 37], [48,, 50, 54]]);
    }
  }]);

  return Kake;
}();

module.exports = {
  Kake: Kake
};