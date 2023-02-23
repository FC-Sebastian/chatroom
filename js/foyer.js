const form = $("#form");
const create = $("#create");
const join = $("#join");
const userInput = $("#username");
const roomInput = $("#room_name");
const controller = $("#controller");

//adding eventListener and loading chat-rooms
$(document).ready(function () {
   create.click(function (e){
       e.stopPropagation();
       e.preventDefault();
       createClick();
   });
   join.click(function (e){
       e.stopPropagation();
       e.preventDefault();
       joinClick();
   });
});

/**
 * validates input and alerts if input is invalid
 * otherwise submits form to create chat-room
 */
function createClick() {
    if (/^[a-zA-Z0-9]*$/.test(userInput.val()) === true) {
        if (/^[a-zA-Z0-9]*$/.test(roomInput.val()) === true) {
            let params = {
                "type":"POST",
                "data":{
                    "controller":"ValidateCreateAjax",
                    "roomName":roomInput.val()
                },
                "success":function (response) {
                    if (response === "valid") {
                        controller.val("Create");
                        form.submit();
                    } else if (response === "empty") {
                        alert("Chatroom name cant be empty");
                    } else {
                        alert("Chatroom name already taken");
                    }
                }
            };
            $.ajax(domain+"index.php",params);
        } else {
            alert("Chatroom cant contain special characters or spaces");
        }
    }
}

/**
 * validates username for clicked chatroom alerts if invalid
 * otherwise submits form to join chatroom
 */
function joinClick() {
    if (/^[a-zA-Z0-9]*$/.test(userInput.val()) === true) {
        if (/^[a-zA-Z0-9]*$/.test(roomInput.val()) === true) {
            if (userInput.val().length > 0) {
                if (roomInput.val().length > 0) {
                    let params = {
                        "type":"POST",
                        "data":{
                            "controller":"ValidateJoinAjax",
                            "roomName":roomInput.val(),
                            "user":userInput.val()
                        },
                        "success":function (response) {
                            if (response === "valid") {
                                controller.val("Join");
                                form.submit();
                            } else if (response === "noRoom") {
                                alert("Chatroom '"+roomInput.val()+"' not found")
                            } else {
                                alert("there already is a " + userInput.val() + " in this room")
                            }
                        }
                    };
                    $.ajax(domain+"index.php",params);
                } else {
                    alert("Chatroom name cant be empty");
                }
            } else {
                alert("Username cant be empty");
            }
        } else {
            alert("Chatroom cant contain special characters or spaces");
        }
    } else {
        alert("username cant contain special characters or spaces");
    }
}