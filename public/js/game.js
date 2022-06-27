const socket = io();

socket.emit("gameConnect", {
    name: document.cookie.match(/username=([^;]+)/)[1],
    room: "mmorpg"
});

socket.on("gameStart", function(data) {
    console.log(data);
});

socket.on("createCharacter", function(data) {
    //var isDM = data.alreadyDM ? false : prompt("DM? (y/n)") === "y";
});

socket.on("classPersonalization", function(data) {
    var chosen_class = data;
    let optlist = [];

    // choose two skill proficiencies checkbox card
    let card = document.createElement("div");
    card.classList.add("card", "col-sm-4", "col-md-3", "col-lg-2");
    let card_title = document.createElement("h5");
    card_title.classList.add("card-title");
    card_title.innerHTML = "Choose " + chosen_class.skillProficiencyQuantity + " skill proficiencies";
    card.appendChild(card_title);
    card.id = "proficiencies";
    for (let skill of chosen_class.skillProficiencies) {
        // create html element and push it in a card which will be appended to the page
        let option = document.createElement("input");
        option.type = "checkbox";
        option.name = "skillProficiencies";
        option.value = skill;
        option.id = skill;
        let label = document.createElement("label");
        label.htmlFor = skill;
        label.appendChild(document.createTextNode(skill));
        let div = document.createElement("div");
        div.classList.add("checkbox");
        div.appendChild(option);
        div.appendChild(label);
        card.appendChild(div);
        card.style = "margin: 1%; padding: 1%;";
    }
    document.getElementById("class-choices").appendChild(card); // TODO

    console.log(chosen_class.choices);
    let i = 0;
    for (let choice of chosen_class.choices) {
        optlist.push([]);
        optlist[i].push(typeof choice === "string" ? choice : choice.choice);
        i++;
    }
    document.getElementById("choose-class").innerHTML = "";

    // display each choice in a html card with a selector for each one and a button to submit
    for (let choice of optlist) {
        let input;
        let card = document.createElement("div");
        card.classList.add("card", "col-sm-4", "col-md-3", "col-lg-2");
        let card_body = document.createElement("div");
        card_body.classList.add("card-body");
        let card_title = document.createElement("h5");
        card_title.classList.add("card-title");
        card_title.innerHTML = "Choose equipment";
        let card_text = document.createElement("p");
        card_text.classList.add("card-text");
        let card_select = document.createElement("select");
        card_select.classList.add("form-control");
        for (let choice_1 of choice[0]) {
            if (typeof choice_1 === "string") {
                // if choice is string check if it starts with c: to see if it is a choice
                if (choice_1.startsWith("c: ")) {
                    input = document.createElement("input");
                    input.type = "text";
                    input.classList.add("form-control");
                    input.required = true;
                    input.placeholder = choice_1.substring(3);
                    input.name = choice_1.substring(3);
                    break;
                }
                let card_option = document.createElement("option");
                card_option.innerHTML = choice_1;
                card_select.appendChild(card_option);
                continue;
            }
            // if it already contains the value add a 2 in front of it
            if (card_select.innerHTML.includes(choice_1.name)) {
                console.log("Duplicate: " + choice_1.name);
                // replace every occurence of the value with the value and a 2 in front of it
                card_select.innerHTML = card_select.innerHTML.replaceAll(choice_1.name, choice_1.name + " x2");
                continue;
            }
            console.log(choice_1.name);
            let option = document.createElement("option");
            option.value = choice_1.name;
            option.innerHTML = choice_1.name === "Leather" ? "Leather armor" : choice_1.name;
            card_select.appendChild(option);
        }
        card_body.appendChild(card_title);
        card_body.appendChild(card_text);
        if (input) {
            card_body.appendChild(input);
        } else {
            card_body.appendChild(card_select);
        }
        card.appendChild(card_body);

        card.style = "margin: 1%; padding: 1%;";
        document.getElementById("class-choices").appendChild(card);
    }
    for (let elem of document.getElementsByTagName("select")) {
        socket.emit("getItem", elem.value);
        console.log(elem.value);
    }

    // send getItem if select element option is changed
    document.getElementById("class-choices").addEventListener("change", function(e) {
        let target = e.target;
        if (target.tagName === "SELECT") {
            socket.emit("getItem", target.value);
        }
    });

    // allow pack selection with a radio selection for each pack
    let pack_card = document.createElement("div");
    pack_card.classList.add("card", "col-sm-4", "col-md-3", "col-lg-2");
    pack_card.style = "margin: 1%; padding: 1%;";
    let pack_card_title = document.createElement("h5");
    pack_card_title.classList.add("card-title");
    pack_card_title.innerHTML = "Choose a pack";
    pack_card.appendChild(pack_card_title);
    pack_card.id = "packs";
    for (let pack of chosen_class.packs) {
        let option = document.createElement("input");
        option.type = "radio";
        option.name = "pack";
        option.value = pack.name;
        let label = document.createElement("label");
        label.htmlFor = pack.name;
        label.appendChild(document.createTextNode(pack.name));
        let div = document.createElement("div");
        div.classList.add("radio");
        div.appendChild(option);
        div.appendChild(label);
        pack_card.appendChild(div);
    }
    document.getElementById("class-choices").appendChild(pack_card);

    // create button to submit choices
    let s_button = document.createElement("button");
    s_button.classList.add("btn", "btn-primary");
    // set button id 
    s_button.id = "choice_submit";
    s_button.innerHTML = "Submit";
    s_button.addEventListener("click", function() { // jshint ignore:line
        // for each card get the value of the select or input and add it to the array
        let choices = [];
        let profs = [];
        let ecount = 0;
        for (let card of document.getElementsByClassName("card")) {
            if (card.id === "packs") {
                let pack = document.getElementById("packs").querySelector("input:checked").value;
                pack = pack;
            }
            if (card.id === "proficiencies") {
                for (let elem of card.getElementsByTagName("input")) {
                    if (elem.checked) {
                        ecount++;
                        console.log("checked: " + elem.value);
                        profs.push(elem.value);
                    }
                }
                if (ecount !== chosen_class.skillProficiencyQuantity) {
                    alert("You must choose " + chosen_class.skillProficiencyQuantity + " skill proficiencies");
                    return;
                }
            }
            console.log(card.getElementsByTagName("select")[0]);
            if (card.getElementsByTagName("select").length === 0) {
                continue;
            }
            let value = card.getElementsByTagName("select")[0] === undefined ? card.getElementsByTagName("input")[0].value : card.getElementsByTagName("select")[0].value;
            if (value === "") {
                alert("Please choose an option");
                return;
            }

            // if the value is x2 then remove the 2 and add 1 to the value
            if (value.includes(" x2")) {
                value = value.replace(" x2", "");
                value = [value, value];
                console.log(value);
            }
            choices.push(value);
        }
        console.log(choices);

        let s_elems = document.getElementsByTagName("submit");
        for (let s_elem of s_elems) {
            s_elem.onchange = () => {};
        }

        // send the value to the server
        socket.emit("characterData", {
            name: document.cookie.match(/username=([^;]+)/)[1],
            room: room,
            toAdd: {
                skillProficiencies: profs,
                equipment: choices,
                pack
            }
        });
    });
    s_button.style = "margin: 1%; padding: 1%; background-color: #00bcd4; color: white;";
    document.getElementById("class-choices").appendChild(s_button);
});

document.getElementById("submit").addEventListener("click", function() {
    socket.emit("characterData", {
        name: document.cookie.match(/username=([^;]+)/)[1],
        room: room,
        toAdd: {
            class: document.getElementById("class").value,
        }
    });
});

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

socket.on("item", function(data) {
    console.log(data);
    console.log("typeof: " + typeof data);

    // create a card in another row which stores item properties
    let card = document.createElement("div");
    card.classList.add("card", "col-sm-5", "col-md-4", "col-lg-3");
    let card_body = document.createElement("div");
    card_body.classList.add("card-body");
    let card_title = document.createElement("h5");
    card_title.classList.add("card-title");
    card_title.innerHTML = data.name;
    let card_text = document.createElement("p");
    card_text.classList.add("card-text");
    for (let key in Object.entries(data)) {
        let value = Object.entries(data)[key][1];
        console.log(value);
        console.log(Object.entries(data)[key][0] + " : ", value);
        if (value === "") { continue; }
        card_text.innerHTML += Object.entries(data)[key][0].capitalize() + ": " + value + "<br>";
    }
    card_body.appendChild(card_title);
    card_body.appendChild(card_text);
    card.appendChild(card_body);
    card.style = "margin: 1%; padding: 1%;";
    document.getElementById("item-info").appendChild(card);
});

socket.on("notification", function(data) {
    alert(data);
});

socket.on("gameState", function(data) {
    data();
});