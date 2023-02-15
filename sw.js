self.addEventListener("push", e => {
    let title = "was geht "+ params.username;
    let body = "du bist in chat "+params.chatroomId+" und die letzte nachricht war "+params.lastMsg;
    self.registration.showNotification(
        title, {body: body}
    );
});