//adding eventListener and loading chat-rooms
$(document).ready(function () {
    $("#create").click(function (e){
       e.stopPropagation();
       e.preventDefault();
       createClick();
   });
    $("#join").click(function (e){
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
    let userInput = $("#username");
    let roomInput = $("#room_name");

    if (userInput.val().length > 0) {
        let params = {
            "type": "POST",
            "data": {
                "controller": "ValidateCreateAjax",
                "roomName": roomInput.val()
            },
            "success": function (response) {
                if (response === "valid") {
                    $("#controller").val("Create");
                    $("#form").submit();
                } else if (response === "empty") {
                    alert("Chatroom name cant be empty");
                } else {
                    alert("Chatroom name already taken");
                }
            }
        };
        $.ajax(domain + "index.php", params);
    } else {
        alert("Username cant be empty");
    }
}

/**
 * validates username for clicked chatroom alerts if invalid
 * otherwise submits form to join chatroom
 */
function joinClick() {
    let userInput = $("#username");
    let roomInput = $("#room_name");

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
                        $("#controller").val("Join");
                        $("#form").submit();
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
}