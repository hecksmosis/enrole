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

// lists
var users = [];

//db based lists
var rooms = JSON.parse(fs.readFileSync(__dirname + '/private/db.json', 'utf8')).rooms;
var admins = JSON.parse(fs.readFileSync(__dirname + '/private/db.json', 'utf8')).admins;
var USERS = JSON.parse(fs.readFileSync(__dirname + '/private/db.json', 'utf8')).USERS;

// static files
app.use(express.static(__dirname + '/public'));

// parse client sent data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/room", function(req, res) {
    if (req.query.room) {
        if (rooms.filter((room => room.name === req.query.room)).length > 0) {
            const roomtype = rooms.filter((room => room.name === req.query.room))[0].type;
            console.log(roomtype);
            if (roomtype === "Chat") {
                res.sendFile(__dirname + '/private/room.html');
            } else if (roomtype === "Game") {
                res.sendFile(__dirname + '/private/game.html');
            }
        } else {
            res.sendStatus(404);
        }
    } else {
        res.sendStatus(404);
    }
});

app.get("/", function(req, res) {
    const username = req.cookies.username;

    if (USERS[username]) {
        res.sendFile(__dirname + '/private/main.html');
    } else {
        res.sendFile(__dirname + "/public/root.html");
    }
});

// private routes
app.post("/login", function(req, res) {
    const username = req.body.uname;
    const password = USERS[username];

    if (password === req.body.pword) {
        res.cookie('username', username, { maxAge: 900000 });
        res.redirect("/");
    }

    res.redirect("/?error=invalid-credentials");
});

// routing for logout
app.get('/logout', (req, res) => {
    res.clearCookie('username');
    res.clearCookie('password');
    res.redirect('/');
});

app.get("/admin", function(req, res) {
    const username = req.cookies.username;

    if (admins[username]) {
        res.cookie('password', admins[username]);
        res.sendFile(__dirname + '/private/admin.html');
    } else {
        res.redirect("/?error=not-admin");
    }
});

// socket io connections
io.on('connection', function(socket) {
    console.log('a user connected');
    users[socket.id] = socket;

    socket.on("getRooms", async function() {
        socket.emit("rooms", rooms);
        socket.isLobby = true;
        socket.isAdmin = false;
        delete users[socket.id];
    });

    socket.on("isAdmin", function(data) {
        if (!admins[data.uname]) {
            return;
        }
        admin_pword = admins[data.uname];
        if (admin_pword === data.pword) {
            socket.isAdmin = true;
            socket.isLobby = false;
        }
    });

    socket.on("addRoom", function(data) {
        if (!socket.isAdmin) return;
        if (!data) return;
        if (data.name === "") return;
        equal_rooms = rooms.filter((room) => {
            return room.name === data.name;
        });
        console.log("add rooms rooms: ", rooms);
        console.log("add rooms equal_rooms: ", equal_rooms);
        if (equal_rooms.length > 0) {
            socket.emit("invalidRoom", "Room already exists.");
            return;
        }
        added_room = {
            name: data.name,
            users: [],
            type: data.type || "Chat"
        };
        rooms.push(added_room);
        let file = __dirname + '/private/db.json';
        let storage = JSON.parse(fs.readFileSync(file, 'utf8'));
        storage.rooms = rooms;
        fs.writeFileSync(file, JSON.stringify(storage));
        socket.emit("success", "Room added.");

        io.emit("rooms", rooms);
        console.log(rooms);
    });

    // TODO: finish adduser
    socket.on("addUser", function(data) {
        console.log("adduser");
        if (!socket.isAdmin) return;
        if (!data) return;
        if (data.uname === "") return;
        equal_users = USERS[data.uname];
        console.log("add users users: ", USERS);
        console.log("add users equal_users: ", equal_users);
        if (equal_users) {
            socket.emit("invalidUser", "User already exists.");
            return;
        }

        USERS[data.name] = data.pword;
        if (data.isAdmin) admins[data.name] = data.pword;
        let file = __dirname + '/private/db.json';
        let storage = JSON.parse(fs.readFileSync(file, 'utf8'));
        storage.admins = admins;
        storage.USERS = USERS;
        fs.writeFileSync(file, JSON.stringify(storage));
        socket.emit("success", "User added.");

        console.log(USERS);
    });

    socket.on("roomType", async function(roomName) {
        for (var i = 0; i < rooms.length; i++) {
            if (rooms[i].name === roomName) {
                socket.emit("roomType", rooms[i].type);
            }
        }
    });

    // on joinRoom
    socket.on("joinRoom", function({ room, username }) {
        console.log("joining room: ", room);
        let sel_room = rooms.filter((i_room) => {
            return i_room.name === room;
        });
        sel_room = sel_room[0];
        socket.current_room = room;
        if (sel_room.users.indexOf(username) !== -1) {
            console.log("is in room");
            socket.emit("users", null);
            return;
        }
        socket.username = username;
        socket.isLobby = false;
        socket.isAdmin = false;
        if (sel_room.type === 'Chat') {
            socket.join(room);
            sel_room.users.push(socket.username);
            console.log("User " + socket.username + " joined room " + room);
            io.to(room).emit("users", sel_room.users);
            socket.broadcast.to(room).emit('message', messageFormatter("system", "System", "User " + socket.username + " has joined the chat."));
        } else
        if (sel_room.type === 'Game') {
            socket.emit('message', messageFormatter("system", "System", "Game room is not yet implemented."));
        }
    });

    socket.on("chatMessage", function(msg) {
        if (!socket.isLobby) {
            io.to(socket.current_room).emit('message', messageFormatter("user", socket.username, msg));
        }
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