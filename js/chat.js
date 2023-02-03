const send = $("#send");
const chatDiv = $("#chatDiv");
const chatInput = $("#chatInput");
const userList = $("#userList");
const notificationSelect = $("#notificationSelect");
const user = $("#chatHidden").val().slice(0,$("#chatHidden").val().indexOf("|"));
const roomId = $("#chatHidden").val().slice($("#chatHidden").val().indexOf("|")+1);
const allowedFileTypes = ["image/jpeg", "image/png", "image/gif", "image/svg+xml", "image/jpg", "	image/webp"];
const fileInput = $("#picUpload");
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
    if (chatInput.val().length > 0 || (fileInput[0].files[0] !== undefined && $.inArray(fileInput[0].files[0].type,allowedFileTypes) > -1)) {
        let data = new FormData;
        data.append("text",chatInput.val());
        data.append("user",user);
        data.append("roomId",roomId);
        data.append("upload",fileInput[0].files[0]);
        data.append("controller","SendChatMsgAjax");
        let params = {
            "type":"POST",
            "enctype":"multipart/form-data",
            "dataType":"json",
            "contentType":false,
            "data":data,
            "processData":false,
            "complete": function (response) {
                chatInput.val("");
                fileInput.val("");
                let newMsg = $($.parseHTML(response));
                chatDiv.append(newMsg);
                scrollToChatBottom();
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
                if (responseJson.notification === true) {
                    playNotification();
                }
                scrollToChatBottom();
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
            scrollToChatBottom();
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

function scrollToChatBottom() {
    setTimeout(function (){
        chatDiv.scrollTop(chatDiv[0].scrollHeight);
    },50)
}