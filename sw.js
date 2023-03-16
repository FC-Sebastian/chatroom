self.addEventListener("push", e => {
    const data = e.data.json();
    self.addEventListener("notificationclick", function (e){
        let url = data.url + `?action=join&room_name=${data.chat}&user=${data.user}`;
        e.waitUntil(
            clients.matchAll({includeUncontrolled: true}).then( windowClients => {
                // Check if there is already a window/tab open with the target URL
                for (let i = 0; i < windowClients.length; i++) {
                    let client = windowClients[i];
                    // If so, just focus it.
                    if (client.url === url && 'focus' in client) {
                        return client.focus();
                    }
                }
                // If not, then open the target URL in a new window/tab.
                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
            })
        );
    });
    self.registration.showNotification(
        `Hey, ${data.user}!`, {body: data.body}
    );
});

