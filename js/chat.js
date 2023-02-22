const publicKey = "BP9dpMh9ZzDu76icN_y9poka-vUmxC1WSFrwxHSariK-puJvRrwcsTYNs2AOrZ6SzNPcVzWnPq6vH1Q-yCXdHXc";
const send = $("#send");
const chatDiv = $("#chatDiv");
const chatInput = $("#chatInput");
const userList = $("#userList");
const notificationSelect = $("#notificationSelect");
const user = $("#chatHidden").val().slice(0,$("#chatHidden").val().indexOf("|"));
const roomId = $("#chatHidden").val().slice($("#chatHidden").val().indexOf("|")+1);
const fileInput = $("#picUpload");
const previewImg = $("#preview");
const pushButton = $("#push");
let lastId = $("#lastMessage").val();
setInterval(reloadMessages,intervalTime);
setInterval(loadActiveUsers,intervalTime);

console.log(navigator.serviceWorker);

//loading active users and chat messages, adding eventListeners and checking browser
$(document).ready(function () {
    loadMessages();
    loadActiveUsers();
    send.click(function () {
        sendMsg();
    });
    fileInput.on("change",function () {
        showPreview();
    });
    previewImg.click(function (){
        previewImg.attr("src","");
        fileInput.val("");
    });
    if (navigator.userAgent.match(/firefox|fxios/i)) {
        $(window).bind("beforeunload", function () {
            setUserInactive(false);
        });
    } else {
        $(window).bind("beforeunload", function () {
            setUserInactive(true);
        });
    }
    chatInput.bind("keydown",function (evt) {
        if (evt.key === "Enter") {
            sendMsg();
        }
    });
    pushButton.click(function (){
        if('serviceWorker' in navigator){
            Notification.requestPermission()
                .then(function () {
                    if(Notification.permission === "granted") {
                        pushSubscribe();
                    }
            });
        }
    });

});

async function pushSubscribe(){
    const register = await navigator.serviceWorker.register(domain + 'sw.js', {
        scope: domain
    });
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
    });
    const params = JSON.stringify({subscription:subscription, username:user, chatroomId:roomId})

    await fetch(nodeDomain+"subscribe", {
        method: "POST",
        body: params,
        headers: {
            "content-type": "application/json",
        }
    });
}

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

/**
 * inserts sent message into db via ajax call and loads message contents into chat
 */
function sendMsg() {
    if (chatInput.val().length > 0 || (fileInput[0].files[0] !== undefined && fileInput[0].files[0].type.slice(0,6) === "image/")) {
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
                previewImg.attr("src","");
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
                let newMessages = $(responseJson.text);
                chatDiv.append(newMessages);
                if (responseJson.notification === true) {
                    playNotification();
                }
                scrollToChatBottom();
            }
        },
        "data":{
            "controller":"LoadChatMsgsAjax",
            "id":roomId,
            "lastMessage":lastId
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
            let newMessages = $(responseJson.text);
            chatDiv.append(newMessages);
            lastId = responseJson.lastId;
            scrollToChatBottom();
        },
        "data":{
            "controller":"LoadChatMsgsAjax",
            "id":roomId,
            "lastMessage":lastId
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
 * removes active user from db via async ajax call
 */
function setUserInactive(async) {
    let params = {
        "type":"POST",
        "async": async,
        "data": {
            "controller":"SetUserInactiveAjax",
            "roomId":roomId,
            "user":user
        }
    };
    $.ajax(domain+"index.php",params);
}

function playNotification() {
    if (notificationSelect.val() === "notification sound active" || (notificationSelect.val() === "notification sound when in background" && document.visibilityState === "hidden")) {
        let notification = new Audio(domain+"sounds/notification.mp3");
        notification.play();
    }
}

function scrollToChatBottom() {
    setTimeout(function (){
        chatDiv.scrollTop(chatDiv[0].scrollHeight);
    },50)
}

function showPreview()
{
    if (fileInput[0].files[0].type.slice(0,6) === "image/") {
        let url = window.URL.createObjectURL(fileInput[0].files[0]);
        previewImg.attr("src", url);
    }
}