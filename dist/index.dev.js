"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

var crypto = require('crypto'); // functions file


var _require3 = require('./kake/kake'),
    Kake = _require3.Kake;

var _require4 = require('./dnd/main'),
    GameState = _require4.GameState; // file imports


var _require5 = require("./dnd/dnd.js"),
    classList = _require5.classList,
    weapons = _require5.weapons,
    Weapon = _require5.Weapon,
    armors = _require5.armors,
    Armor = _require5.Armor,
    packs = _require5.packs,
    Pack = _require5.Pack,
    Item = _require5.Item; // prototypes setup


Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
}; // postgresql setup


var _require6 = require('pg'),
    Pool = _require6.Pool;

var _require7 = require('process'),
    getMaxListeners = _require7.getMaxListeners;

var _require8 = require('console'),
    Console = _require8.Console;

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

var games = []; // setup handler functions to make code more readable

var getRoomsResponse = function getRoomsResponse(socket, result) {
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
  socket.isLobby = true;
  delete users[socket.id];
};

var isAdmin = function isAdmin(socket, data, updateAdminStatus, updateLobby, lobby, callback) {
  for (var _len = arguments.length, args = new Array(_len > 6 ? _len - 6 : 0), _key = 6; _key < _len; _key++) {
    args[_key - 6] = arguments[_key];
  }

  pool.query("SELECT * FROM users WHERE name = '".concat(data.uname, "' AND sessionid = '").concat(socket.sessionid, "'"), function (err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result.rowCount > 0) {
        if (result.rows[0].roles.includes("@admin")) {
          if (updateAdminStatus) socket.isAdmin = true;
          if (updateLobby) socket.isLobby = lobby;
          if (callback !== null) callback.apply(null, [socket].concat(args));
        }
      }
    }
  });
};

var getRooms = function getRooms(socket, data) {
  return regeneratorRuntime.async(function getRooms$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          pool.query('SELECT * FROM rooms ORDER BY id', function (err, result) {
            if (err) {
              console.log(err);
            } else {
              getRoomsResponse(socket, result);
            }
          });
          isAdmin(socket, data, true, true, false, null);

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
};

var getRolesHandler = function getRolesHandler(socket, result) {
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
};

var getRoles = function getRoles(socket, data) {
  return regeneratorRuntime.async(function getRoles$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          pool.query("SELECT * FROM users WHERE name = '".concat(data, "'"), function (err, result) {
            if (err) {
              console.log(err);
            } else {
              getRolesHandler(socket, result);
            }
          });

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
};

var getAllUsers = function getAllUsers(socket, data) {
  return regeneratorRuntime.async(function getAllUsers$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
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

        case 2:
        case "end":
          return _context3.stop();
      }
    }
  });
};

var deleteUser = function deleteUser(socket, data) {
  return regeneratorRuntime.async(function deleteUser$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
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

        case 1:
        case "end":
          return _context4.stop();
      }
    }
  });
};

var deleteRoom = function deleteRoom(socket, data) {
  return regeneratorRuntime.async(function deleteRoom$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
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

        case 1:
        case "end":
          return _context5.stop();
      }
    }
  });
};

var addRoom = function addRoom(socket, data) {
  return regeneratorRuntime.async(function addRoom$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          if (data) {
            _context6.next = 2;
            break;
          }

          return _context6.abrupt("return");

        case 2:
          if (!(data.name === "")) {
            _context6.next = 4;
            break;
          }

          return _context6.abrupt("return");

        case 4:
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

        case 5:
        case "end":
          return _context6.stop();
      }
    }
  });
}; // lists


var users = [];
var rooms = []; // populate rooms list with rooms from database

pool.query("SELECT * FROM rooms ORDER BY id", function (err, res) {
  if (err) {
    console.log(err);
  } else {
    rooms = res.rows;
    rooms.forEach(function (room) {
      room.users = [];
    });
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
    return regeneratorRuntime.async(function _callee$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
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
            return _context7.stop();
        }
      }
    });
  });
}); // signup route

app.post("/signup", function _callee2(req, res) {
  var username, password, password2, sessionid, hashedPassword;
  return regeneratorRuntime.async(function _callee2$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          username = req.body.uname;
          password = req.body.pword;
          password2 = req.body.pword2;
          sessionid = req.session.id;

          if (!(!username || !password || !password2 || password !== password2 || password.length < 8)) {
            _context8.next = 8;
            break;
          }

          res.redirect("/?error=invalid-signup");
          _context8.next = 12;
          break;

        case 8:
          _context8.next = 10;
          return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

        case 10:
          hashedPassword = _context8.sent;
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
          return _context8.stop();
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
  console.log(rooms);
  socket.on("getRooms", function (data) {
    return getRooms(socket, data);
  });
  socket.on("getRoles", function (data) {
    return getRoles(socket, data);
  });
  socket.on("getAllUsers", function (data) {
    return getAllUsers(socket, data);
  });
  socket.on("isAdmin", function (data) {
    return isAdmin(socket, data, true, true, false, null);
  });
  socket.on("deleteUser", function (data) {
    return isAdmin(socket, data, false, false, false, deleteUser, data);
  });
  socket.on("deleteRoom", function (data) {
    return isAdmin(socket, data, false, false, false, deleteRoom, data);
  });
  socket.on("addRoom", function (data) {
    return isAdmin(socket, data, false, false, false, addRoom, data);
  });
  socket.on("addUser", function _callee4(data) {
    var permitted;
    return regeneratorRuntime.async(function _callee4$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            console.log("adduser");
            permitted = false;
            pool.query("SELECT * FROM users WHERE name = '".concat(data.uname, "' AND sessionid = '").concat(socket.sessionid, "'"), function _callee3(err, result) {
              var hashedPassword;
              return regeneratorRuntime.async(function _callee3$(_context9) {
                while (1) {
                  switch (_context9.prev = _context9.next) {
                    case 0:
                      if (!err) {
                        _context9.next = 4;
                        break;
                      }

                      console.log(err);
                      _context9.next = 35;
                      break;

                    case 4:
                      if (!(result.rowCount > 0)) {
                        _context9.next = 34;
                        break;
                      }

                      if (!result.rows[0].roles.includes("@admin")) {
                        _context9.next = 31;
                        break;
                      }

                      permitted = true;

                      if (permitted) {
                        _context9.next = 9;
                        break;
                      }

                      return _context9.abrupt("return");

                    case 9:
                      console.log("isadmin");

                      if (data) {
                        _context9.next = 12;
                        break;
                      }

                      return _context9.abrupt("return");

                    case 12:
                      console.log("data");

                      if (!(data.name === "")) {
                        _context9.next = 15;
                        break;
                      }

                      return _context9.abrupt("return");

                    case 15:
                      console.log("uname");

                      if (!(data.pword === "")) {
                        _context9.next = 18;
                        break;
                      }

                      return _context9.abrupt("return");

                    case 18:
                      console.log("pword");

                      if (!(data.pword !== data.pword2)) {
                        _context9.next = 21;
                        break;
                      }

                      return _context9.abrupt("return");

                    case 21:
                      console.log("pword2");

                      if (!(data.pword.length < 8)) {
                        _context9.next = 24;
                        break;
                      }

                      return _context9.abrupt("return");

                    case 24:
                      console.log("pword length");
                      _context9.next = 27;
                      return regeneratorRuntime.awrap(bcrypt.hash(data.pword, 10));

                    case 27:
                      hashedPassword = _context9.sent;
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
                      _context9.next = 32;
                      break;

                    case 31:
                      permitted = false;

                    case 32:
                      _context9.next = 35;
                      break;

                    case 34:
                      permitted = false;

                    case 35:
                    case "end":
                      return _context9.stop();
                  }
                }
              });
            });

          case 3:
          case "end":
            return _context10.stop();
        }
      }
    });
  });
  socket.on("roomType", function _callee5(roomName) {
    return regeneratorRuntime.async(function _callee5$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
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
            return _context11.stop();
        }
      }
    });
  }); // on joinRoom

  socket.on("joinRoom", function (_ref) {
    var room = _ref.room,
        username = _ref.username,
        isRefresh = _ref.isRefresh;
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
                    console.log("users before enter: " + _sel_room.users); // if there is already 2 people before socket joins, redirect

                    if (_sel_room.users.length > 1) {
                      socket.emit("redir");
                      return;
                    } // socket room join


                    socket.join(room);

                    _sel_room.users.push(socket.username);

                    console.log("User " + socket.username + " joined room " + room);
                    io.to(room).emit("users", _sel_room.users);
                    console.log("users after enter: " + _sel_room.users);

                    if (isRefresh) {
                      // TODO: maybe implement a better solution ???
                      console.log("has refreshed page");
                      io.to(room).emit("redir", "/?error=invalid-sid");
                    }

                    if (_sel_room.users.length === 2) {
                      console.log("second user " + socket.username + " joined room " + room);
                      socket.color = 2;
                      socket.jewels = [];
                      var othersocket;
                      var _iteratorNormalCompletion = true;
                      var _didIteratorError = false;
                      var _iteratorError = undefined;

                      try {
                        for (var _iterator = io.sockets.adapter.rooms[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                          var sroom = _step.value;

                          if (sroom[0] === room) {
                            var _iteratorNormalCompletion2 = true;
                            var _didIteratorError2 = false;
                            var _iteratorError2 = undefined;

                            try {
                              for (var _iterator2 = sroom[1][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                var ssocket = _step2.value;

                                if (ssocket !== socket.id) {
                                  console.log("other socket");
                                  othersocket = users[ssocket];
                                }
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

                      if (games[room] !== undefined) {
                        delete games[room];
                        socket.color = 1;
                        socket.jewels = [];
                        othersocket.color = 2;
                        othersocket.jewels = [];
                      }

                      games[room] = new Kake(room);
                      console.log("second");
                      socket.emit("test", {
                        color: socket.color === 1 ? "red" : "blue",
                        username: socket.username,
                        opponentName: othersocket.username,
                        turn: 1
                      });
                      socket.emit("ok", {
                        data: games[room].showBoard(socket),
                        color: socket.color
                      });
                      othersocket.emit("test", {
                        color: othersocket.color === 1 ? "red" : "blue",
                        username: othersocket.username,
                        opponentName: socket.username,
                        turn: 1
                      });
                      othersocket.emit("ok", {
                        data: games[room].showBoard(othersocket),
                        color: othersocket.color
                      });
                    } else if (_sel_room.users.length === 1) {
                      console.log("first user " + socket.username + " joined room " + room);
                      socket.color = 1;
                      socket.jewels = [];
                    } else {
                      socket.emit("redir", "/?error=room-full");
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

  socket.on("gameConnect", function (_ref2) {
    var name = _ref2.name,
        room = _ref2.room;
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
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = packs.find(function (pack) {
          return pack.name === data.toAdd.pack;
        }).items[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var item = _step3.value;
          socket.player.inventory.push(new Item(item));
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
    }

    for (var _i = 0, _Object$keys = Object.keys(data.toAdd); _i < _Object$keys.length; _i++) {
      var key = _Object$keys[_i];
      console.log(key);
      console.log("to add: " + data.toAdd[key]);
      console.log(socket.player[key]);

      if (Array.isArray(socket.player[key])) {
        (function () {
          var split_data = data.toAdd[key];
          console.log("split data: " + split_data);

          if (Array.isArray(split_data)) {
            console.log("korrekt");
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
              var _loop = function _loop() {
                var item = _step4.value;
                console.log("correkt 2");

                if (Array.isArray(item)) {
                  console.log("item");
                  var _iteratorNormalCompletion5 = true;
                  var _didIteratorError5 = false;
                  var _iteratorError5 = undefined;

                  try {
                    var _loop2 = function _loop2() {
                      var i = _step5.value;
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

                    for (var _iterator5 = item[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                      _loop2();
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
                } else {
                  console.log("not arrey");

                  if (weapons.find(function (w) {
                    return w.name === item;
                  })) {
                    // jshint ignore:line
                    socket.player[key] = socket.player[key].concat([new Weapon(item)]);
                  } else if (armors.find(function (a) {
                    return a.name === item;
                  })) {
                    // jshint ignore:line
                    socket.player[key] = socket.player[key].concat([new Armor(item)]);
                  } else if (packs.find(function (p) {
                    return p.name === item;
                  })) {
                    // jshint ignore:line
                    socket.player[key] = socket.player[key].concat([new Pack(item)]);
                  } else {
                    socket.player[key] = socket.player[key].concat([new Item(item)]);
                  }
                }
              };

              for (var _iterator4 = split_data[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                _loop();
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
    if (games[socket.current_room]) games[socket.current_room].move(io, users, games, socket, data);
  });
  socket.on("isWon", function _callee6() {
    return regeneratorRuntime.async(function _callee6$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            if (!games[socket.current_room]) {
              _context12.next = 3;
              break;
            }

            _context12.next = 3;
            return regeneratorRuntime.awrap(games[socket.current_room].isWon(io, users, socket));

          case 3:
          case "end":
            return _context12.stop();
        }
      }
    });
  }); // on disconnect

  socket.on('disconnect', function () {
    socket.color = undefined;
    var room = rooms.find(function (room) {
      return room.name === socket.current_room;
    });

    if (room) {
      if (room.type === "game") {
        if (games.find(function (game) {
          return game.room === room.name;
        })) {
          io.to(room).emit("redir");
          room.users = []; // remove the game from games array

          games = games.filter(function (game) {
            return game.room !== room.name;
          });
        }
      }
    }

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