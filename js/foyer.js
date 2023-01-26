const form = $("#form");
const create = $("#create");
const chatRoomsDiv = $("#chatRooms");
const userInput = $("#username");
const roomInput = $("#room_name");
setInterval(loadRooms,intervalTime);

//adding eventListener and loading chat-rooms
$(document).ready(function () {
   create.click(function (e){
       e.stopPropagation();
       e.preventDefault();
       createClick();
   });
   loadRooms();
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
                        form.attr("action","http://localhost/chatroom/create/createRoom/");
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
 * otherwise submits form to joins clicked chat-room
 * @param roomId
 */
function joinClick(roomId) {
    if (/^[a-zA-Z0-9]*$/.test(userInput.val()) === true) {
        if (userInput.val().length > 0) {
            let params = {
                "type":"POST",
                "data":{
                    "controller":"ValidateJoinAjax",
                    "roomId":roomId,
                    "user":userInput.val()
                },
                "success":function (response) {
                    if (response === "valid") {
                        form.attr("action","http://localhost/chatroom/join/"+roomId+"/"+userInput.val()+"/");
                        form.submit();
                    } else {
                        alert("there already is a " + userInput.val() + " in this room")
                    }
                }
            };
            $.ajax(domain+"index.php",params);

        } else {
            alert("please enter a username");
        }
    } else {
        alert("username cant contain special characters or spaces");
    }
}

/**
 * loads chatroom buttons via ajax call loads them into chatRoomsDiv
 */
function loadRooms()
{
    let params = {
        "type":"POST",
        "data":{
            "controller":"LoadChatRoomsAjax"
        },
        "success":function (response) {
            chatRoomsDiv.html(response);
            let roomButtons = $(".room-button");
            roomButtons.each(function () {
                $(this).click(function (){
                    joinClick($(this).val());
                });
            });
        }
    };
    $.ajax(domain+"index.php",params);
}