"use strict";

var getRooms = function getRooms(pool, socket, result) {
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
};

var handlers = {
  getRooms: getRooms
};
module.exports = {
  handlers: handlers
};