const socket = io();
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const chatForm = document.getElementById('chat-form');

if (!document.cookie.match(/username=([^;]+)/)) {
    window.location = '/';
}

document.getElementById("username").innerHTML = document.cookie.match(/username=([^;]+)/)[1];

// emit joinRoom
socket.emit("joinRoom", {
    room: urlParams.get("room"),
    username: document.cookie.match(/username=([^;]+)/)[1]
});

socket.emit("getUsers", urlParams.get("room"));

socket.on('message', function(data) {
    if (data.type === 'system') {
        outputMessage(data);
        console.log(data.content);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    } else {
        outputMessage(data);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});

socket.on("users", function(users) {
    if (!users) {
        window.location = '/?error=invalid-username';
    }
    outputRoomName(urlParams.get("room"));
    outputUsers(users);
});

// Confirm room leave
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
        window.location = '/';
    } else {}
});

// Message send
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get message text
    let msg = e.target.elements.msg.value;

    msg = msg.trim();

    if (!msg) {
        return false;
    }

    // Emit message to server
    socket.emit('chatMessage', msg);

    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});


// DOM methods:
// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += `<span>@${message.time}</span>`;
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.content;
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
    console.log(users);
    userList.innerHTML = '';
    for (let user in users) {
        const li = document.createElement('li');
        li.innerText = users[user];
        userList.appendChild(li);
    }
}