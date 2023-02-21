<?php

class Join extends BaseController
{
    /**
     * adds user to session and then redirects to clicked chatroom
     * @return void
     */
    public function render()
    {
        $sRoomName = $this->getRequestParameter("room_name");
        $sUser = $this->getRequestParameter("user");

        $_SESSION["user"] = $sUser;

        $this->redirect($this->getUrl("index.php?controller=Chat&chat=".$sRoomName));
        exit();
    }
}