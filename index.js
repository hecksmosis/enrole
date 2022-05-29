//socket io app
const express = require('express');
const { messageFormatter } = require('./utils/messages');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const fs = require('fs');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { createReadStream } = require('fs');
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('express-flash');

// postgresql setup
const { Pool } = require('pg');
const isProduction = process.env.NODE_ENV === 'production';
console.log(isProduction);
var pool;
if (isProduction) {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
} else {
    pool = new Pool({
        user: 'rhqgfddocuiftw',
        host: 'ec2-54-211-255-161.compute-1.amazonaws.com',
        database: 'd8hs985v1cid97',
        port: 5432,
        password: '5bb7d6571aa254730bffd0c7b74f98027d1d12bbc7134e178bd1e147c6f013f0',
        ssl: { rejectUnauthorized: false },
    });
}

// lists
var users = [];
var rooms = [];
pool.query('SELECT * FROM rooms', (err, res) => {
    if (err) {
        console.log(err);
    } else {
        rooms = res.rows;
        rooms.forEach((room) => {
            room.users = [];
        });
        console.log(rooms);
    }
});

// static files
app.use(express.static(__dirname + '/public'));

// parse client sent data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/room", function(req, res) {
    if (req.query.room) {
        console.log(req.query.room);
        pool.query(`SELECT * FROM rooms WHERE name = '${req.query.room}'`, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (result.rowCount > 0) {
                    if (result.rows[0].type === "chat") {
                        res.sendFile(__dirname + '/private/room.html');
                    } else {
                        res.send("WORK IN PROGRESS");

                        //res.sendFile(__dirname + '/private/game.html');
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

app.get("/", function(req, res) {
    const username = req.cookies.username;

    pool.query(`SELECT * FROM users WHERE name = '${username}'`, (err, result) => {
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
});

// private routes
app.post("/login", function(req, res) {
    const username = req.body.uname;
    const password = req.body.pword;

    if (!username || !password) {
        res.redirect("/?error=invalid-credentials");
        return;
    }

    pool.query(`SELECT * FROM users WHERE name = '${username}'`, async(err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (result.rowCount > 0) {
                if (bcrypt.compareSync(password, result.rows[0].password)) {
                    res.cookie('username', username);
                    const hashedPass = await bcrypt.hash(password, 10);
                    res.cookie('password', hashedPass);
                    res.redirect('/');
                } else {
                    res.redirect('/?error=invalid-credentials');
                }
            } else {
                res.redirect('/?error=invalid-credentials');
            }
        }
    });
});

// signup route
app.post("/signup", async function(req, res) {
    const username = req.body.uname;
    const password = req.body.pword;
    const password2 = req.body.pword2;

    if (!username || !password || !password2 || password !== password2 || password.length < 8) {
        res.redirect("/?error=invalid-signup");
    } else {
        const hashedPassword = await bcrypt.hash(password, 10);

        pool.query(
            `SELECT * FROM users WHERE name = '${username}'`,
            (err, result) => {
                if (err) {
                    console.log(err);
                    res.redirect("/?error=invalid-signup");
                } else {
                    if (result.rowCount > 0) {
                        res.redirect("/?error=invalid-signup");
                    } else {
                        pool.query(
                            `INSERT INTO users (name, password) VALUES ('${username}', '${hashedPassword}')`,
                            (err, result) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    res.cookie('username', username, { maxAge: 900000 });
                                    res.redirect("/");
                                }
                            }
                        );
                    }
                }
            }
        );
    }
});

// routing for logout
app.get('/logout', (req, res) => {
    res.clearCookie('username');
    res.clearCookie('password');
    res.redirect('/');
});

app.get("/admin", function(req, res) {
    const username = req.cookies.username;

    pool.query(`SELECT * FROM users WHERE name = '${username}'`, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (result.rowCount > 0) {
                if (result.rows[0].admin) {
                    console.log(result.rows[0]);
                    res.sendFile(__dirname + '/private/admin.html');
                } else {
                    res.redirect("/?error=not-admin");
                }
            } else {
                res.redirect("/?error=not-admin");
            }
        }
    });
});

// socket io connections
io.on('connection', function(socket) {
    console.log('a user connected');
    users[socket.id] = socket;

    socket.on("getRooms", async function(data) {
        pool.query('SELECT * FROM rooms', (err, result) => {
            if (err) {
                console.log(err);
            } else {
                socket.emit("rooms", result.rows);
                socket.isLobby = true;
                delete users[socket.id];
            }
        });
        pool.query(`SELECT * FROM users WHERE name = '${data.uname}'`, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (result.rowCount > 0) {
                    if (result.rows[0].admin === 't') {
                        socket.isAdmin = true;
                    }
                }
            }
        });
    });

    socket.on("isAdmin", async function(data) {
        pool.query(`SELECT * FROM users WHERE name = '${data.uname}'`, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (result.rowCount > 0) {
                    if (bcrypt.compareSync(data.pword, result.rows[0].password)) {
                        if (result.rows[0].admin) {
                            socket.isAdmin = true;
                            socket.isLobby = false;
                            console.log("is admin");
                        }
                    }
                }
            }
        });
    });

    socket.on("addRoom", function(data) {
        console.log("adding room");
        console.log(data.uname);
        var permitted = false;
        pool.query(`SELECT * FROM users WHERE name = '${data.uname}'`, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (result.rowCount > 0) {
                    // if user is admin
                    console.log(result.rows);
                    console.log(result.rows[0].admin);
                    if (result.rows[0].admin) {
                        console.log("admin");
                        if (!data) return;
                        console.log("data");
                        if (data.name === "") return;
                        console.log("passed tests");
                        pool.query(
                            `SELECT * FROM rooms WHERE name = '${data.name}'`,
                            (err, result) => {
                                if (err) {
                                    console.log(err);
                                    socket.emit("invalidRoom", "Invalid room name.");
                                } else {
                                    if (result.rowCount > 0) {
                                        socket.emit("invalidRoom", "Room already exists.");
                                    } else {
                                        const type = data.type === "Chat" ? "chat" : "game";
                                        pool.query(
                                            `INSERT INTO rooms (name, type) VALUES ('${data.name}', '${type}')`,
                                            (err, result) => {
                                                if (err) {
                                                    console.log(err);
                                                    socket.emit("invalidRoom", "Invalid room type.");
                                                } else {
                                                    socket.emit("success", "Room added.");
                                                    rooms[rooms.length - 1].users = [];
                                                    pool.query('SELECT * FROM rooms', (err, result) => {
                                                        if (err) {
                                                            console.log(err);
                                                        } else {
                                                            io.emit("rooms", result.rows);
                                                            console.log("rooms before", rooms);
                                                            users_rooms = [];
                                                            rooms.forEach((room) => {
                                                                users_rooms.push(room.users);
                                                            });
                                                            console.log(users_rooms);
                                                            rooms = result.rows;
                                                            rooms.forEach((room) => {
                                                                room.users = users_rooms[rooms.indexOf(room)];
                                                            });
                                                            console.log("rooms after", rooms);
                                                        }
                                                    });
                                                }
                                            }
                                        );
                                    }
                                }
                            }
                        );
                    } else {
                        permitted = false;
                    }
                } else {
                    permitted = false;
                }
            }
        });


    });

    socket.on("addUser", async function(data) {
        console.log("adduser");
        var permitted = false;
        pool.query(`SELECT * FROM users WHERE name = '${data.uname}'`, async(err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (result.rowCount > 0) {
                    // if user is admin
                    if (result.rows[0].admin) {
                        permitted = true;
                        if (!permitted) return;
                        console.log("isadmin");
                        if (!data) return;
                        console.log("data");
                        if (data.uname === "") return;
                        console.log("uname");
                        if (data.pword === "") return;
                        console.log("pword");
                        if (data.pword !== data.pword2) return;
                        console.log("pword2");
                        if (data.pword.length < 8) return;
                        console.log("pword length");
                        const hashedPassword = await bcrypt.hash(data.pword, 10);
                        pool.query(
                            `SELECT * FROM users WHERE name = '${data.name}'`,
                            (err, result) => {
                                if (err) {
                                    console.log(err);
                                    socket.emit("invalidUser", "Invalid user name.");
                                } else {
                                    if (result.rowCount > 0) {
                                        socket.emit("invalidUser", "User already exists.");
                                    } else {
                                        pool.query(
                                            `INSERT INTO users (name, password, admin) VALUES ('${data.name}', '${hashedPassword}', '${data.isAdmin}')`,
                                            (err, result) => {
                                                if (err) {
                                                    console.log(err);
                                                } else {
                                                    socket.emit("success", "User added.");
                                                }
                                            }
                                        );
                                    }
                                }
                            }
                        );
                    } else {
                        permitted = false;
                    }
                } else {
                    permitted = false;
                }
            }
        });

    });

    socket.on("roomType", async function(roomName) {
        pool.query(`SELECT * FROM rooms WHERE name = '${roomName}'`, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (result.rowCount > 0) {
                    socket.emit("roomType", result.rows[0].type);
                }
            }
        });
    });

    // on joinRoom
    socket.on("joinRoom", function({ room, username }) {
        console.log("joining room: ", room);
        pool.query(`SELECT * FROM rooms WHERE name = '${room}'`, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (result.rowCount > 0) {
                    let sel_room = rooms.filter((i_room) => {
                        return i_room.name === room;
                    });
                    sel_room = sel_room[0];
                    if (sel_room.users.indexOf(username) !== -1) {
                        console.log("is in room");
                        socket.emit("users", null);
                        return;
                    }
                    socket.current_room = sel_room.name;
                    socket.username = username;
                    socket.isLobby = false;
                    if (sel_room.type === 'chat') {
                        console.log(room);
                        socket.join(room);
                        sel_room.users.push(socket.username);
                        console.log("User " + socket.username + " joined room " + room);
                        io.to(room).emit("users", sel_room.users);
                        socket.broadcast.to(room).emit('message', messageFormatter("system", "System", "User " + socket.username + " has joined the chat."));
                    } else
                    if (sel_room.type === 'game') {
                        // TODO: Game room shit
                        socket.emit('message', messageFormatter("system", "System", "Game room is not yet implemented."));
                    }
                } else {
                    socket.emit("invalidRoom", "Invalid room name.");
                }
            }
        });
    });

    socket.on("chatMessage", function(msg) {
        console.log("sending message");
        if (!socket.isLobby) {
            console.log("not lobby");
            console.log(socket.current_room);
            io.to(socket.current_room).emit('message', messageFormatter("user", socket.username, msg));
            return;
        }
        console.log("yes lobby");
    });

    socket.on("getUsers", function(room) {
        sel_room = rooms.filter((i_room) => {
            return i_room.name === room;
        });
        sel_room = sel_room[0];
        console.log("users room: ", sel_room);
        socket.emit("users", sel_room.users);
    });

    // game socket.io functions
    //TODO: create game room + functional gameplay






    // on disconnect
    socket.on('disconnect', function() {
        if (socket.isLobby) {
            delete users[socket.id];
            return;
        }
        let user = users[socket.id];
        if (!user) return;
        console.log("rooms: ", rooms);
        sel_room = rooms.filter((i_room) => {
            console.log(i_room.name, ", current room: ", socket.current_room);
            return i_room.name == user.current_room;
        });
        if (!sel_room[0]) {
            delete users[socket.id];
            return;
        }
        console.log(sel_room);
        sel_room = sel_room[0];
        sel_room.users = sel_room.users.filter(
            (i_user) => {
                return i_user !== user.username;
            }
        );
        if (!user.username) {
            delete users[socket.id];
            return;
        }
        io.to(user.current_room).emit(
            'message',
            messageFormatter("system", "System", `${user.username} has left the chat`)
        );

        // Send users and room info
        io.to(user.room).emit("users", sel_room.users);

        delete users[socket.id];
    });
});

// server listen
http.listen(port, function() {
    console.log('listening on *:' + port);
});