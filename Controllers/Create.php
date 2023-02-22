<?php

class Create extends BaseController
{
    protected $title = "Create Chatroom";

    /**
     * creates a new chat-room and sets session-user to given user then redirects to created room
     */
    public function render()
    {
        $sRoomName = $this->getRequestParameter("room_name");

        $oChatRoom = new ChatRoom();
        $oChatRoom->setRoom_name($sRoomName);
        $oChatRoom->save();
        $_SESSION["user"] = $this->getRequestParameter("user");


        $this->redirect($this->getUrl("index.php?controller=Chat&chat=".$sRoomName));
        exit();
    }
}