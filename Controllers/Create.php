<?php

class Create extends BaseController
{
    protected $title = "Create Chatroom";

    /**
     * creates a new chat-room and sets session-user to given user then redirects to created room
     */
    public function render()
    {
        $sRoomName = htmlspecialchars($this->getRequestParameter("room_name"));
        $_SESSION["user"] = htmlspecialchars($this->getRequestParameter("user"));

        $oChatRoom = new ChatRoom();
        $oChatRoom->setRoom_name($sRoomName);
        $oChatRoom->save();

        $this->redirect($this->getUrl("index.php?controller=Chat&chat=".$sRoomName));
        exit();
    }
}