const chatInput = $("#chatInput");
const fileInput = $("#picUpload");
let lastId = $("#lastMessage").val();
let subscribed = false;
let modal = new bootstrap.Modal("#modal");
let imageUrls = [];
let pressedKey = [];
setInterval(loadMessages,intervalTime);
setInterval(loadActiveUsers,intervalTime);

//loading active users and chat messages, adding eventListeners and checking browser
$(document).ready(function () {
    loadMessages();
    loadActiveUsers();
    $("#send").click(function () {
        sendMsg();
    });
    fileInput.on("change",function () {
        showPreview();
    });
    $("#closePreview").click(hidePreview);
    if (navigator.userAgent.match(/firefox|fxios/i)) {
        $(window).on("beforeunload", function () {
            setUserInactive(false);
            if (subscribed === true) {
                pushSubscribe();
            }
        });
    } else {
        $(window).on("beforeunload", function () {
            setUserInactive(true);
            if (subscribed === true) {
                pushSubscribe();
            }
        });
    }
    chatInput.on("keydown",function (evt) {
        $("#previewText").html(nl2br(chatInput.val()));
        pressedKey[evt.key] = true;
        if (evt.key === "Enter" && pressedKey["Shift"] !== true) {
            sendMsg();
        }
    });
    chatInput.on("keyup",function (evt) {
        $("#previewText").html(nl2br(chatInput.val()));
        if (evt.key === "Enter" && chatInput.val().match(".") === null && pressedKey["Shift"] !== true) {
            chatInput.val("");
        }
        delete pressedKey[evt.key];
    });
    $("#push").click(function () {
        if('serviceWorker' in navigator){
            Notification.requestPermission()
                .then(function () {
                    if(Notification.permission === "granted") {
                        subscribed = true;
                    }
            });
        }
    });
    $(window).on("keyup",function (evt) {
        if (evt.key === "Escape") {
            modal.hide();
        }
    });
});

/**
 * creates push subscription and sends it to node server
 * @returns {Promise<void>}
 */
async function pushSubscribe() {
    let chatHidden = $("#chatHidden");
    const register = await navigator.serviceWorker.register(domain + 'sw.js', {
        scope: domain
    });
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
    });
    const params = JSON.stringify({subscription:subscription, username:chatHidden.val().slice(0,chatHidden.val().indexOf("|")), chatroomId:chatHidden.val().slice(chatHidden.val().indexOf("|")+1), lastMessage:lastId});

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
        .replace(/-/g, "+")
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
        let chatHidden = $("#chatHidden");
        let data = new FormData;
        data.append("text",chatInput.val());
        data.append("user",chatHidden.val().slice(0,chatHidden.val().indexOf("|")));
        data.append("roomId",chatHidden.val().slice(chatHidden.val().indexOf("|")+1));
        data.append("upload",fileInput[0].files[0]);
        data.append("controller","SendChatMsgAjax");
        let params = {
            "type":"POST",
            "enctype":"multipart/form-data",
            "dataType":"json",
            "contentType":false,
            "data":data,
            "processData":false,
            "complete": function () {
                hidePreview();
            }
        };
        $.ajax(domain+"index.php", params);
    }
}

/**
 * reloads the chat via ajax call
 */
function loadMessages() {
    let params = {
        "type":"POST",
        "success": function (response) {
            let responseJson = JSON.parse(response);
            if (responseJson.lastId !== lastId) {
                lastId = responseJson.lastId;
                let newMessages = $(responseJson.text);
                $("#chatDiv").append(newMessages);
                if (responseJson.notification === true) {
                    playNotification();
                }
                scrollToChatBottom();
                updateLightbox();
            }
        },
        "data":{
            "controller":"LoadChatMsgsAjax",
            "id":$("#chatHidden").val().slice($("#chatHidden").val().indexOf("|")+1),
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
            $("#userList").html(response);
            $("#offList").html($("#userList").html());
            $("#offList").children()[0].remove();
        },
        "data":{
            "controller":"LoadActiveUsersAjax",
            "id":$("#chatHidden").val().slice($("#chatHidden").val().indexOf("|")+1)
        }
    };
    $.ajax(domain+"index.php", params);
}

/**
 * removes active user from db via async ajax call
 */
function setUserInactive(async) {
    let chatHidden = $("#chatHidden");
    let params = {
        "type":"POST",
        "async": async,
        "data": {
            "controller":"SetUserInactiveAjax",
            "roomId":chatHidden.val().slice(chatHidden.val().indexOf("|")+1),
            "user":chatHidden.val().slice(0,chatHidden.val().indexOf("|"))
        }
    };
    $.ajax(domain+"index.php",params);
}

/**
 * plays notification sound if permitted
 */
function playNotification() {
    if ($("#notificationSelect").val() === "Notification sound active" || ($("#notificationSelect").val() === "Notification sound when in background" && document.visibilityState === "hidden")) {
        let notification = new Audio(domain+"sounds/notification.mp3");
        notification.play();
    }
}

/**
 * scrolls chat to bottom
 */
function scrollToChatBottom() {
    setTimeout(function (){
        let chatDiv = $("#chatDiv");
        chatDiv.scrollTop(chatDiv[0].scrollHeight);
    },50)
}

/**
 * displays preview of uploaded image
 */
function showPreview() {
    if (fileInput[0].files[0].type.slice(0,6) === "image/") {
        let url = window.URL.createObjectURL(fileInput[0].files[0]);
        $("#preview").attr("src", url);
        $("#previewDiv").removeClass("d-none");
    }
}

/**
 * hides preview
 */
function hidePreview() {
    $("#previewDiv").addClass("d-none");
    $("#preview").attr("src","");
    fileInput.val("");
    $("#previewText").html("");
    chatInput.val("");
}

/**
 * loads urls of chat images into imageUrls array
 * adds eventListeners to chat images
 * updates light box index
 */
function updateLightbox() {
    let images = $(".lightbox");
    let innerLength = $("#lightboxInner").length - 1;
    images.each(function (index) {
        let image = $(images[index]);
        if (imageUrls.includes(image.attr("src")) === false) {
            imageUrls.push(image.attr("src"));
            let lbPic = `<div class="carousel-item"><img src="${image.attr("src")}" class="d-block lightBoxPic"></div>`;
            let lbIndex = `<button type="button" data-bs-target="#lightBox" data-bs-slide-to="${innerLength + index}" aria-label="Slide ${innerLength + index + 1}"></button>`;
            $("#lightboxInner").append($(lbPic));
            $("#lightboxIndex").append($(lbIndex));
            image.click(function (){
                imageClick(innerLength + index);
            });
        }
    });
}

/**
 * loads clicked image into modal and displays it
 * updates light box index
 * @param index
 */
function imageClick(index) {
    let active = $(".active");
    active.each(function (index) {
       $(active[index]).removeClass("active");
    });
    $($("#lightboxInner").children()[index]).addClass("active");
    $($("#lightboxIndex").children()[index]).addClass("active");
    modal.show();
}

/**
 * replaces linebreaks with break tags
 * @param str
 * @returns {string}
 */
function nl2br (str) {
    if (typeof str === 'undefined' || str === null) {
        return '';
    }
    let br= '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + br + '$2');
}