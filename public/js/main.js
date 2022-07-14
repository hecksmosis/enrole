var socket = io();
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

if (urlParams.length !== 0) {
    if (urlParams.get("error") === "invalid-username") {
        alert("Invalid username. Please try again.");
    }
    if (urlParams.get("error") === "not-admin") {
        alert("Your account does not have administrative privileges. Please log in with another account.");
    }
    if (urlParams.get("error") === "room-full") {
        alert("The room is full. Please try again later or join another room.");
    }
    if (urlParams.get("error") === "invalid-sid") {
        alert("Invalid session ID. Please try again.");
    }
}


// set username to current username stored in cookie
if (!document.cookie.match(/username=([^;]+)/)) { // if cookie does not exist
    window.location = '/';
}
window.onload = () => {
    document.getElementById("username").innerText = document.cookie.match(/username=([^;]+)/)[1];
    console.log("i did shit");
};
// emit getRooms
socket.emit("getRooms", {
    uname: document.cookie.match(/username=([^;]+)/)[1]
});

// receive response and append it to the html
socket.on("rooms", function(data) {
    data = data.rooms;
    document.getElementById("room").innerHTML = "";
    for (var i = 0; i < data.length; i++) {
        document.getElementById("room").innerHTML += "<option value='" + data[i].name + "'>" + data[i].name + "</option>";
    }
});

// if option is changed, update room type
document.getElementById("room").addEventListener("change", function() {
    socket.emit("roomType", document.getElementById("room").value);
});

socket.on("roomType", function(data) {
    document.getElementById("type").innerHTML = data;
    document.getElementById("btype").innerHTML = "Join " + data;
    console.log("got datas");
});