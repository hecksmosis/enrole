const moment = require('moment');

function messageFormatter(type, username, content) {
    return {
        type: type,
        username: username,
        content: content,
        time: moment().format('h:mm a')
    };
}


module.exports = {
    messageFormatter,
};