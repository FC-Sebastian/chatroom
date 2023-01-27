<?php

class Join extends BaseController
{
    /**
     * adds user to session and then redirects to clicked chatroom
     * @return void
     */
    public function render()
    {
        $sRoomName = $this->getRequestParameter("roomName");
        $sUser = $this->getRequestParameter("user");

        $_SESSION["user"] = $sUser;

        $this->redirect($this->getUrl("chat/".$sRoomName."/"));
        exit();
    }
}