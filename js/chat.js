const send = $("#send");
const chatDiv = $("#chatDiv");
const chatInput = $("#chatInput");
const userList = $("#userList");
const notificationSelect = $("#notificationSelect");
const user = $("#chatHidden").val().slice(0,$("#chatHidden").val().indexOf("|"));
const roomId = $("#chatHidden").val().slice($("#chatHidden").val().indexOf("|")+1);
let lastId = false;
setInterval(reloadMessages,intervalTime);
setInterval(loadActiveUsers,intervalTime);

//loading active users and chat messages, adding eventListeners and checking browser
$(document).ready(function () {
    loadMessages();
    loadActiveUsers();
    send.click(function () {
        sendMsg();
    });
    if (navigator.userAgent.match(/firefox|fxios/i)) {
        $(window).bind("beforeunload", function () {
            setUserInactiveFF();
        });
    } else {
        $(window).bind("beforeunload", function () {
            setUserInactive();
        });
    }
    chatInput.bind("keydown",function (evt) {
        if (evt.key === "Enter") {
            sendMsg();
        }
    });
});

/**
 * inserts sent message into db via ajax call and loads message contents into chat
 */
function sendMsg() {
    if (chatInput.val().length > 0) {
        let params = {
            "type":"POST",
            "data":{
                "text": chatInput.val(),
                "user": user,
                "roomId": roomId,
                "controller": "SendChatMsgAjax",
                },
            "success": function (response) {
                chatInput.val("");
                let newMsg = $($.parseHTML(response));
                chatDiv.append(newMsg);
                chatDiv.scrollTop(chatDiv[0].scrollHeight);

            }
        };
        $.ajax(domain+"index.php", params);
    }
}

/**
 * reloads the chat via ajax call
 */
function reloadMessages() {
    let params = {
        "type":"POST",
        "success": function (response) {
            let responseJson = JSON.parse(response);
            if (responseJson.lastId !== lastId) {
                lastId = responseJson.lastId;
                chatDiv.html(responseJson.text);
                chatDiv.scrollTop(chatDiv[0].scrollHeight);
                if (responseJson.notification === true) {
                    playNotification();
                }
            }
        },
        "data":{
            "controller":"LoadChatMsgsAjax",
            "id":roomId
        }
    };
    $.ajax(domain+"index.php", params);
}

/**
 * loads chat via ajax call and scrolls to the bottom of chat
 */
function loadMessages() {
    let params = {
        "type":"POST",
        "success": function (response) {
            let responseJson = JSON.parse(response);
            chatDiv.html(responseJson.text);
            lastId = responseJson.lastId;
            chatDiv.scrollTop(chatDiv[0].scrollHeight);
        },
        "data":{
            "controller":"LoadChatMsgsAjax",
            "id":roomId
        }
    };
    $.ajax(domain+"index.php", params);
}

/**
 * loads active users into user list via ajax call
 */
function loadActiveUsers() {
    let params = {
        "type":"POST",
        "success": function (response) {
            userList.html(response);
        },
        "data":{
            "controller":"LoadActiveUsersAjax",
            "id":roomId
        }
    };
    $.ajax(domain+"index.php", params);
}

/**
 * removes active user from db for chromium via async ajax call
 */
function setUserInactive() {
    let params = {
        "type":"POST",
        "data": {
            "controller":"SetUserInactiveAjax",
            "roomId":roomId,
            "user":user
        }
    };
    $.ajax(domain+"index.php",params);
}

/**
 * removes active user from db for firefox via sync ajax call
 */
function setUserInactiveFF() {
    let params = {
        "type":"POST",
        "async":false,
        "data": {
            "controller":"SetUserInactiveAjax",
            "roomId":roomId,
            "user":user
        }
    };
    $.ajax(domain+"index.php",params);
}

function playNotification() {
    if (notificationSelect.val() === "notifications active" || (notificationSelect.val() === "notifications when in background" && document.visibilityState === "hidden")) {
        let notification = new Audio(domain+"sounds/notification.mp3");
        notification.play();
    }
}