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
const cookie = require('cookie');
const crypto = require('crypto');

// file imports
const { classList, weapons, Weapon, armors, Armor, packs, Pack, Item } = require("./dnd/dnd.js");

// prototypes setup
Array.prototype.random = function() {
    return this[Math.floor((Math.random() * this.length))];
};

// postgresql setup
const { Pool } = require('pg');
const { getMaxListeners } = require('process');
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

// game arrays

// define gameState class
class GameState {
    constructor(data) {
        this.players = data.players;
        this.room = data.room;
        this.id = data.id;
        this.map = new Array(100).fill(Array(100));
        this.players.forEach((player) => {
            if (player.isDM === false) {
                player.x = 0;
                player.y = 0;
                this.map[player.y][player.x] = player.id;
                player.class = '';
                player.race = '';
                player.background = '';
                player.level = 1;
                player.xp = 0;
                player.alignment = '';
                player.str = 0;
                player.dex = 0;
                player.con = 0;
                player.int = 0;
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
                player.saves = { successes: 0, failures: 0 };
            }
        });
    }
    setup(player, data) {
        this.map[player.y][player.x] = player.id;
        player.class = classList.includes(data.class) ? data.class : classList.random();
        player.race = raceList.includes(data.race) ? data.race : raceList.random();
        player.background = backgroundList.includes(data.background) ? data.background : backgroundList.random();
        // TODO: Finish
    }
    addPlayer(player) {
        this.map[player.y][player.x] = player.id;
        player.class = '';
        player.race = '';
        player.background = '';
        player.level = 1;
        player.xp = 0;
        player.alignment = '';
        player.str = 0;
        player.dex = 0;
        player.con = 0;
        player.int = 0;
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
        player.saves = { successes: 0, failures: 0 };
    }
}

// lists
var users = [];
var rooms = [];
pool.query(`SELECT * FROM rooms ORDER BY id`, (err, res) => {
    if (err) {
        console.log(err);
    } else {
        rooms = res.rows;
        rooms.forEach((room) => {
            room.users = [];
        });
        // console.log(rooms);
    }
});

var games = [];

// static files
app.use(express.static(__dirname + '/public'));

// parse client sent data
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'keyboardcatisverycute',

    // cookie options
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, secure: false, maxAge: 60000 }
}));

app.use(flash());

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
                        res.sendFile(__dirname + '/private/game.html');
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
    const sessionid = req.session.id;
    console.log("sessionid = ", sessionid);

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
                    pool.query(`UPDATE users SET sessionid = '${sessionid}' WHERE name = '${username}'`, (err, result) => {
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
    });
});

// signup route
app.post("/signup", async function(req, res) {
    const username = req.body.uname;
    const password = req.body.pword;
    const password2 = req.body.pword2;
    const sessionid = req.session.id;

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
                            `INSERT INTO users (name, password, roles) VALUES ('${username}', '${hashedPassword}', '{"@basic"}')`,
                            (err, result) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    res.cookie('username', username, { maxAge: 900000 });
                                    pool.query(`UPDATE users SET sessionid = '${sessionid}' WHERE name = '${username}'`, (err, result) => {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            res.redirect("/");
                                        }
                                    });
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
    req.session.destroy();
    pool.query(`UPDATE users SET sessionid = NULL WHERE sessionid = '${req.session}'`, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.clearCookie('username');
            res.redirect('/');
        }
    });
});

app.get("/dashboard", function(req, res) {
    const username = req.cookies.username;

    pool.query(`SELECT * FROM users WHERE name = '${username}'`, (err, result) => {
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
});

// socket io connections
io.on('connection', function(socket) {
    console.log('a user connected');
    const s_cookie = socket.handshake.headers.cookie;
    if (s_cookie) {
        const cookieParsed = cookie.parse(s_cookie);
        // console.log('cookieParsed:', cookieParsed);
        // console.log(cookieParsed["connect.sid"]);
        if (cookieParsed["connect.sid"]) {
            const sidParsed = cookieParser.signedCookie(cookieParsed["connect.sid"], 'keyboardcatisverycute');
            // console.log(sidParsed);
            socket.sessionid = sidParsed;
        }
    }
    // console.log("socket id: ", socket.sessionid);
    users[socket.id] = socket;

    socket.on("getRooms", async function(data) {
        pool.query('SELECT * FROM rooms ORDER BY id', (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("sending rooms");
                var to_send_rooms = result.rows;
                console.log(to_send_rooms);
                pool.query("SELECT * FROM roles", (err, res) => {
                    if (err) {
                        console.log(err);
                    } else {
                        var to_send_roles = res.rows;
                        socket.emit("rooms", { rooms: to_send_rooms, roles: to_send_roles });
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
        pool.query(`SELECT * FROM users WHERE name = '${data.uname}' AND sessionid = '${socket.sessionid}'`, (err, result) => {
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
    });

    socket.on("getRoles", function(data) {
        pool.query(`SELECT * FROM users WHERE name = '${data}'`, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                var to_send_roles = result.rows[0].roles;
                console.log(to_send_roles);
                pool.query("SELECT * FROM roles", (err, res) => {
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

    socket.on("getAllUsers", function(data) {
        console.log("users");
        pool.query(`SELECT * FROM users WHERE name = '${data.uname}' AND sessionid = '${socket.sessionid}'`, (err, result) => {
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
                        pool.query('SELECT * FROM users', (err, result) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(result.rows);
                                var users = result.rows;
                                pool.query(`SELECT * FROM roles`, (err, res) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        var roles = res.rows;
                                        socket.emit("allUsers", { users: users, roles: roles });
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

    socket.on("isAdmin", async function(data) {
        pool.query(`SELECT * FROM users WHERE name = '${data.uname}' AND sessionid = '${socket.sessionid}'`, (err, result) => {
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
    });

    socket.on("deleteUser", function(data) {
        console.log("deleting user: " + data.user);
        pool.query(`SELECT * FROM users WHERE name = '${data.uname}' AND sessionid = '${socket.sessionid}'`, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (result.rowCount > 0) {
                    if (result.rows[0].roles.includes("@admin")) {
                        console.log("delete user");
                        pool.query(`DELETE FROM users WHERE name = '${data.user}'`, (err, result) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("user deleted");
                                pool.query(`SELECT * FROM users ORDER BY id`, (err, result) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log(result.rows);
                                        var users = result.rows;
                                        pool.query(`SELECT * FROM roles ORDER BY id`, (err, res) => {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                var roles = res.rows;
                                                socket.emit("allUsers", { users: users, roles: roles });
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

    socket.on("deleteRoom", function(data) {
        console.log("deleting room: " + data.name);
        pool.query(`SELECT * FROM users WHERE name = '${data.uname}' AND sessionid = '${socket.sessionid}'`, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (result.rowCount > 0) {
                    if (result.rows[0].roles.includes("@admin")) {
                        console.log("delete room");
                        pool.query(`DELETE FROM rooms WHERE name = '${data.name}'`, (err, result) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("room deleted");
                                pool.query('SELECT * FROM rooms', (err, result) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log(result.rows);
                                        var rooms = result.rows;
                                        socket.emit("rooms", { rooms: rooms, noroles: true });
                                    }
                                });
                            }
                        });
                    }
                }
            }
        });
    });

    socket.on("addRoom", function(data) {
        console.log("adding room");
        console.log(data.uname);
        var permitted = false;
        pool.query(`SELECT * FROM users WHERE name = '${data.uname}' AND sessionid = '${socket.sessionid}'`, (err, result) => {
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
                                        const type = data.type === "Chat" | "chat" ? "chat" : "game";
                                        pool.query(
                                            `INSERT INTO rooms (name, type, req_roles) VALUES ('${data.name}', '${type}', '{"${data.roles}"}')`,
                                            (err, result) => {
                                                if (err) {
                                                    console.log(err);
                                                    socket.emit("invalidRoom", "Invalid room type.");
                                                } else {
                                                    socket.emit("success", "Room added.");
                                                    rooms[rooms.length - 1].users = [];
                                                    pool.query(`SELECT * FROM rooms ORDER BY id`, (err, result) => {
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
                                                            socket.emit("rooms", rooms);
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
        pool.query(`SELECT * FROM users WHERE name = '${data.uname}' AND sessionid = '${socket.sessionid}'`, async(err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (result.rowCount > 0) {
                    // if user is admin
                    if (result.rows[0].roles.includes("@admin")) {
                        permitted = true;
                        if (!permitted) return;
                        console.log("isadmin");
                        if (!data) return;
                        console.log("data");
                        if (data.name === "") return;
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
                                        if (!data.roles) {
                                            pool.query(
                                                `INSERT INTO users (name, password, roles) VALUES ('${data.name}', '${hashedPassword}', '{"@basic"}')`,
                                                (err, result) => {
                                                    if (err) {
                                                        console.log(err);
                                                    } else {
                                                        socket.emit("success", "User added.");
                                                    }
                                                }
                                            );
                                        } else {
                                            var roles = data.roles.toString().split(",");
                                            var rolesString = "{";
                                            for (var i = 0; i < roles.length; i++) {
                                                rolesString += `"${roles[i]}",`;
                                            }
                                            pool.query(
                                                `INSERT INTO users (name, password, roles) VALUES ('${data.name}', '${hashedPassword}', '${data.roles}')`,
                                                (err, result) => {
                                                    if (err) {
                                                        console.log(err);
                                                    } else {
                                                        socket.emit("success", "User added.");
                                                        pool.query('SELECT * FROM users', (err, result) => {
                                                            if (err) {
                                                                console.log(err);
                                                            } else {
                                                                console.log(result.rows);
                                                                var users = result.rows;
                                                                pool.query(`SELECT * FROM roles`, (err, res) => {
                                                                    if (err) {
                                                                        console.log(err);
                                                                    } else {
                                                                        var roles = res.rows;
                                                                        socket.emit("allUsers", { users: users, roles: roles });
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                }
                                            );
                                        }
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
                    console.log(result.rows[0].req_roles);
                    var rooms_roles = result.rows[0].req_roles;
                    pool.query(`SELECT * FROM users WHERE name = '${username}'`, (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            if (result.rowCount > 0) {
                                var user_roles = result.rows[0].roles;
                                var permitted = false;
                                if (user_roles.includes(rooms_roles) || user_roles.includes("@admin") || user_roles.includes("@allrooms")) {
                                    permitted = true;
                                }
                                if (permitted) {
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
                                        // console.log(room);
                                        socket.join(room);
                                        sel_room.users.push(socket.username);
                                        console.log("User " + socket.username + " joined room " + room);
                                        io.to(room).emit("users", sel_room.users);
                                        socket.broadcast.to(room).emit('message', messageFormatter("system", "System", "User " + socket.username + " has joined the chat."));
                                    } else if (sel_room.type === 'game') {
                                        // TODO: Game room shit
                                        socket.emit('message', messageFormatter("system", "System", "Game room is not yet implemented."));
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
        // console.log("users room: ", sel_room);
        socket.emit("users", sel_room.users);
    });

    // game socket.io functions
    //TODO: create game room + functional gameplay
    socket.on("gameConnect", function({ name, room }) {
        console.log("user " + name + " connected to game room: " + room);
        var roomgames = games.filter((g_room) => {
            return g_room.name === room;
        });
        socket.player = { name: name, isDM: false };
        if (roomgames.length === 0) {
            games.push(new GameState({ id: crypto.randomUUID(), name: room, players: [socket.player] }));
        } else {
            roomgames[0].addPlayer(socket.player);
        }

        socket.emit("createCharacter", {
            alreadyDM: false
        });
    });

    socket.on("characterData", function(data) {
        if (!socket.player) return;
        if (socket.player.isDM) return; // for now
        if (data.toAdd.skillProficiencies) {
            if (data.toAdd.skillProficiencies.length !== socket.player.skillProficiencyQuantity) {
                socket.emit("notification", "You must select " + socket.player.skillProficiencyQuantity + " skill proficiencies.");
                return;
            }
            data.toAdd.skillProficiencies.forEach(skill => {
                socket.player.skills.push(skill);
            });
        }
        for (let key of Object.keys(data.toAdd)) {
            console.log(key);
            console.log("to add: " + data.toAdd[key]);
            console.log(socket.player[key]);
            if (Array.isArray(socket.player[key])) {
                const split_data = data.toAdd[key];
                console.log("split data: " + split_data);
                if (Array.isArray(split_data)) {
                    console.log("korrekt");
                    for (let item of split_data) {
                        console.log("correkt 2");
                        if (Array.isArray(item)) {
                            console.log("item");
                            for (let i of item) {
                                console.log("i");
                                if (weapons.find(w => w.name === i)) { // jshint ignore:line
                                    socket.player[key] = socket.player[key].concat([new Weapon(i)]);
                                    console.log("is wepon");
                                } else if (armors.find(a => a.name === i)) { // jshint ignore:line
                                    socket.player[key] = socket.player[key].concat([new Armor(i)]);
                                    console.log("is armor");
                                } else if (packs.find(p => p.name === i)) { // jshint ignore:line
                                    socket.player[key] = socket.player[key].concat([new Pack(i)]);
                                    console.log("is pak");
                                } else {
                                    socket.player[key] = socket.player[key].concat([new Item(i)]);
                                    console.log("is musik");
                                }
                            }
                        } else {
                            console.log("not arrey");
                            if (weapons.find(w => w.name === item)) {
                                socket.player[key] = socket.player[key].concat([new Weapon(item)]);
                            } else if (armors.find(a => a.name === item)) {
                                socket.player[key] = socket.player[key].concat([new Armor(item)]);
                            } else if (packs.find(p => p.name === item)) {
                                socket.player[key] = socket.player[key].concat([new Pack(item)]);
                            } else {
                                socket.player[key] = socket.player[key].concat([new Item(item)]);
                            }
                        }
                    }
                } else {
                    if (weapons.find(w => w.name === split_data)) {
                        socket.player[key] = socket.player[key].concat([new Weapon(split_data)]);
                    } else if (armors.find(a => a.name === split_data)) {
                        socket.player[key] = socket.player[key].concat([new Armor(split_data)]);
                    } else if (packs.find(p => p.name === split_data)) {
                        socket.player[key] = socket.player[key].concat([new Pack(split_data)]);
                    } else {
                        socket.player[key] = socket.player[key].concat([new Item(split_data)]);
                    }
                }
            } else {
                socket.player[key] = data.toAdd[key];
            }
            console.log(socket.player[key]);
        }
        if (data.toAdd.class) {
            var index = classList.findIndex((i) => {
                return i.name === data.toAdd.class;
            });
            socket.player.hitDice = "1d" + classList[index].hitDice;
            socket.player.hitDiceMax = "1d" + classList[index].hitDice;
            socket.player.hitPoints = classList[index].hitPoints;
            let toolProfs = classList[index].toolProficiencies.includes("None") ? [] : classList[index].toolProficiencies;
            socket.player.proficiencies = classList[index].armorProficiencies.concat(classList[index].weaponProficiencies).concat(toolProfs);
            socket.player.savingThrows = classList[index].savingThrowProficiencies;
            socket.player.skillProficiencyQuantity = classList[index].skillProficiencyQuantity;
            socket.emit("classPersonalization", classList.find(sel_class => sel_class.name === data.toAdd.class));
        }
        socket.emit("notification", "Character data saved.");
    });

    socket.on("getItem", function(item) {
        if (!socket.player) return;
        if (socket.player.isDM) return; // for now
        console.log("get item: " + item);
        if (weapons.find(w => w.name === item)) {
            socket.emit("item", {...new Weapon(item) });
        } else if (armors.find(a => a.name === item)) {
            socket.emit("item", {...new Armor(item) });
        } else if (packs.find(p => p.name === item)) {
            socket.emit("item", {...new Pack(item) });
        } else {
            socket.emit("item", {...new Item(item) });
        }
    });




    // on disconnect
    socket.on('disconnect', function() {
        if (socket.isLobby) {
            delete users[socket.id];
            return;
        }
        let user = users[socket.id];
        if (!user) return;
        // console.log("rooms: ", rooms);
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