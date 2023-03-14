const send = $("#send");
const chatDiv = $("#chatDiv");
const chatInput = $("#chatInput");
const userList = $("#userList");
const notificationSelect = $("#notificationSelect");
const user = $("#chatHidden").val().slice(0,$("#chatHidden").val().indexOf("|"));
const roomId = $("#chatHidden").val().slice($("#chatHidden").val().indexOf("|")+1);
const fileInput = $("#picUpload");
const previewDiv = $("#previewDiv");
const previewImg = $("#preview");
const previewText = $("#previewText");
const previewClose = $("#closePreview");
const pushButton = $("#push");
let lastId = $("#lastMessage").val();
const lightboxPic = $("#lightBoxPic");
let modal = new bootstrap.Modal("#modal");
let imageUrls = [];
let pressedKey = [];
setInterval(reloadMessages,intervalTime);
setInterval(loadActiveUsers,intervalTime);

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
    previewClose.click(hidePreview);
    if (navigator.userAgent.match(/firefox|fxios/i)) {
        $(window).on("beforeunload", function () {
            setUserInactive(false);
        });
    } else {
        $(window).on("beforeunload", function () {
            setUserInactive(true);
        });
    }
    chatInput.on("keydown",function (evt) {
        previewText.html(nl2br(chatInput.val()));
        pressedKey[evt.key] = true;
        if (evt.key === "Enter" && pressedKey["Shift"] !== true) {
            sendMsg();
        }
    });
    chatInput.on("keyup",function (evt) {
        previewText.html(nl2br(chatInput.val()));
        if (evt.key === "Enter" && chatInput.val().match(".") === null && pressedKey["Shift"] !== true) {
            chatInput.val("");
        }
        delete pressedKey[evt.key];
    });
    pushButton.click(function () {
        if('serviceWorker' in navigator){
            Notification.requestPermission()
                .then(function () {
                    if(Notification.permission === "granted") {
                        pushSubscribe();
                    }
            });
        }
    });
    $("#next").click(function (){
        nextLightbox();
    });
    $("#prev").click(function (){
        prevLightbox();
    });
    $(window).on("keyup",function (evt) {
        if (evt.key === "Escape") {
            closeLightbox();
        }
    });
});

/**
 * creates push subscription and sends it to node server
 * @returns {Promise<void>}
 */
async function pushSubscribe() {
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

/**
 * builds Uint8 array from given base64 string
 * @param base64String
 * @returns {Uint8Array}
 */
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
    if (chatInput.val().match(".") !== null || (fileInput[0].files[0] !== undefined && fileInput[0].files[0].type.slice(0,6) === "image/")) {
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
                hidePreview();
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
                updateLightbox();
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
            updateLightbox();
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
            $("#offList").html(userList.html());
            $("#offList").children()[0].remove();
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

/**
 * plays notification sound if permitted
 */
function playNotification() {
    if (notificationSelect.val() === "Notification sound active" || (notificationSelect.val() === "Notification sound when in background" && document.visibilityState === "hidden")) {
        let notification = new Audio(domain+"sounds/notification.mp3");
        notification.play();
    }
}

/**
 * scrolls chat to bottom
 */
function scrollToChatBottom() {
    setTimeout(function (){
        chatDiv.scrollTop(chatDiv[0].scrollHeight);
    },50)
}

/**
 * displays preview of uploaded image
 */
function showPreview() {
    if (fileInput[0].files[0].type.slice(0,6) === "image/") {
        let url = window.URL.createObjectURL(fileInput[0].files[0]);
        previewImg.attr("src", url);
        previewDiv.removeClass("d-none");
    }
}

function hidePreview() {
    previewDiv.addClass("d-none");
    previewImg.attr("src","");
    fileInput.val("");
    previewText.html("");
    chatInput.val("");
}

/**
 * loads urls of chat images into imageUrls array
 * adds eventListeners to chat images
 * updates light box index
 */
function updateLightbox() {
    imageUrls = [];
    let images = $(".lightbox");
    images.each(function (index) {
        let image = $(images[index]);
        image.off("click");
        image.click(function (){
            imageClick(image);
        });
        imageUrls.push(image.attr("src"));
    });
    updateLBIndex();
}

/**
 * loads clicked image into modal and displays it
 * updates light box index
 * @param image
 */
function imageClick(image) {
    lightboxPic.attr("src",image.attr("src"));
    modal.show();
    updateLBIndex();
}

/**
 * displays next chat image in light box
 * updates light box index
 */
function nextLightbox() {
    let index = imageUrls.indexOf(lightboxPic.attr("src"));
    if (index === imageUrls.length - 1) {
        index = 0;
    } else {
        index += 1;
    }
    lightboxPic.attr("src",imageUrls[index]);
    updateLBIndex();
}

/**
 * displays previous image in light box
 * updates light box index
 */
function prevLightbox() {
    let index = imageUrls.indexOf(lightboxPic.attr("src"));
    if (index === 0) {
        index = imageUrls.length - 1;
    } else {
        index -= 1;
    }
    lightboxPic.attr("src",imageUrls[index]);
    updateLBIndex();
}

/**
 * updates light box index
 */
function updateLBIndex() {
    let index = imageUrls.indexOf(lightboxPic.attr("src")) + 1;
    let max = imageUrls.length;
    if (max <= 1) {
        $("#next").addClass("d-none");
        $("#prev").addClass("d-none");
    } else {
        $("#next").removeClass("d-none");
        $("#prev").removeClass("d-none");
    }
    $("#lightboxIndex").html(`${index}/${max}`);
}

function closeLightbox() {
    modal.hide();
}

function nl2br (str) {
    if (typeof str === 'undefined' || str === null) {
        return '';
    }
    let br= '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + br + '$2');
}