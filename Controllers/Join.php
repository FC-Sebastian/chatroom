<?php

class Join extends BaseController
{
    /**
     * adds user to session and then redirects to clicked chatroom
     * @return void
     */
    public function render()
    {
        $sRoomId = $this->getRequestParameter("roomId");
        $sUser = $this->getRequestParameter("user");

        $oChatroom = new ChatRoom();
        $oChatroom->loaById($sRoomId);
        $_SESSION["user"] = $sUser;

        $this->redirect($this->getUrl("chat/".$oChatroom->data["room_name"]."/"));
        exit();
    }
}