const send = $("#send");
const chatDiv = $("#chatDiv");
const chatInput = $("#chatInput");
const user = $("#chatHidden").val().slice(0,$("#chatHidden").val().indexOf("|"));
const roomId = $("#chatHidden").val().slice($("#chatHidden").val().indexOf("|")+1);
setInterval(reloadMessages,5000);


$(document).ready(function () {
    loadMessages();
    chatDiv.scrollTop(chatDiv[0].scrollHeight);
    send.click(function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        clickedSend();
    });
});

function clickedSend() {
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

function reloadMessages() {
    let params = {
        "type":"POST",
        "success": function (response) {
            chatDiv.html(response);
        },
        "data":{
            "controller":"LoadChatMsgsAjax",
            "id":roomId
        }
    };
    $.ajax(domain+"index.php", params);
}

function loadMessages() {
    let params = {
        "type":"POST",
        "success": function (response) {
            chatDiv.html(response);
            chatDiv.scrollTop(chatDiv[0].scrollHeight);
        },
        "data":{
            "controller":"LoadChatMsgsAjax",
            "id":roomId
        }
    };
    $.ajax(domain+"index.php", params);
}